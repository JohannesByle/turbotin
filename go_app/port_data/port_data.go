package port_data

import (
	"context"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"net/url"
	"os"
	"strings"
	"time"
	"turbotin/ent"
	"turbotin/protos"
	"turbotin/services"
	"turbotin/util"

	"github.com/schollz/progressbar/v3"
)

const BATCH_SIZE = 5000

type tobaccoKey struct {
	item string
	link string
}

func batch[T any](in []T) [][]T {
	var result = make([][]T, 0)

	for i := 0; i < len(in); i = i + BATCH_SIZE {
		j := i + BATCH_SIZE
		if j > len(in) {
			j = len(in)
		}
		result = append(result, in[i:j])
	}

	return result
}

func portTobaccos(tx *ent.Tx) error {
	f, err := os.Open("../data/archive.csv")
	if err != nil {
		return err
	}
	defer f.Close()

	tobaccoMap := map[tobaccoKey]*ent.Tobacco{}

	r := csv.NewReader(f)
	r.Read()
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		url, err := url.Parse(record[5])
		if err != nil {
			continue
		}
		key := tobaccoKey{
			item: strings.TrimSpace(strings.ToLower(record[2])),
			link: strings.TrimSpace(strings.ToLower(url.String()))}
		if len(key.link) == 0 || len(key.item) == 0 {
			continue
		}

		tobacco, ok := tobaccoMap[key]
		if !ok {
			store, ok := protos.Store_value["STORE_"+strings.ToUpper(record[1])]
			if !ok {
				continue
			}

			tobacco = &ent.Tobacco{
				Store: int16(store),
				Item:  record[2],
				Link:  url.String(),
				Edges: ent.TobaccoEdges{Prices: make([]*ent.TobaccoPrice, 0)}}
			tobaccoMap[key] = tobacco

		}
		t, err := time.Parse("2006-01-02 15:04:05", record[6])
		if err != nil {
			panic(fmt.Sprintf("unable to convert time: %s", record[6]))
		}
		tobacco.Edges.Prices = append(tobacco.Edges.Prices, &ent.TobaccoPrice{
			Price: record[3],
			Stock: record[4],
			Time:  t})

	}

	tobaccos := []*ent.Tobacco{}
	for _, t := range tobaccoMap {
		tobaccos = append(tobaccos, t)
	}

	ctx := context.Background()
	_, err = tx.Tobacco.Delete().Exec(ctx)
	if err != nil {
		return err
	}
	tobaccoArrs := batch(tobaccos)
	rows := []*ent.Tobacco{}
	bar := progressbar.Default(int64(len(tobaccos)), "Creating tobaccos")
	for _, arr := range tobaccoArrs {
		temp, err := tx.Tobacco.MapCreateBulk(arr, func(c *ent.TobaccoCreate, i int) {
			t := arr[i]
			c.SetStore(t.Store).
				SetItem(t.Item).
				SetLink(t.Link).
				AddPrices()
		}).Save(ctx)
		if err != nil {
			return err
		}
		rows = append(rows, temp...)
		bar.Add(len(arr))
	}
	log.Printf("Created %d tobaccos", len(tobaccos))

	bar = progressbar.Default(int64(len(rows)), "Creating prices")
	for i, arr := range batch(rows) {
		builders := []*ent.TobaccoPriceCreate{}
		for j, t := range tobaccoArrs[i] {
			for _, p := range t.Edges.Prices {
				builders = append(builders, tx.TobaccoPrice.Create().
					SetPrice(p.Price).
					SetStock(p.Stock).
					SetTime(p.Time).
					SetTobacco(arr[j]))
			}
		}
		c := float32(len(arr)) / float32(len(builders))
		for _, sub_arr := range batch(builders) {
			_, err = tx.TobaccoPrice.CreateBulk(sub_arr...).Save(ctx)

			if err != nil {
				return err
			}

			bar.Add(int(c * float32(len(sub_arr))))
		}

	}
	return nil
}

func portCategories(tx *ent.Tx) error {
	f, err := os.Open("../data/cat_data.csv")
	if err != nil {
		return err
	}
	defer f.Close()

	blendMap := map[string]map[string]bool{}
	tobaccoBlendMap := map[string][]string{}

	r := csv.NewReader(f)
	r.Read()
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}
		tobacco := strings.TrimSpace(record[1])
		brand := strings.TrimSpace(record[2])
		blend := strings.TrimSpace(record[3])

		tobaccoBlends, ok := tobaccoBlendMap[blend]
		if !ok {
			tobaccoBlends = []string{}
		}
		tobaccoBlendMap[blend] = append(tobaccoBlends, tobacco)

		blends, ok := blendMap[brand]
		if !ok {
			blends = map[string]bool{}
			blendMap[brand] = blends
		}
		blends[blend] = true

	}

	ctx := context.Background()

	tx.Category.Delete().Exec(ctx)

	brandCat, err := tx.Category.Create().SetName("Brand").Save(ctx)
	if err != nil {
		return err
	}
	blendCat, err := tx.Category.Create().SetName("Blend").Save(ctx)
	if err != nil {
		return err
	}
	_, err = tx.Category.Create().SetName("Size").Save(ctx)
	if err != nil {
		return err
	}
	_, err = tx.Category.Create().SetName("Cut").Save(ctx)
	if err != nil {
		return err
	}
	brands := []*ent.Tag{}
	blends := []*ent.Tag{}

	for brand, arr := range blendMap {
		brands = append(brands, &ent.Tag{Value: brand})
		for blend := range arr {
			blendTag := &ent.Tag{Value: blend}
			blends = append(blends, blendTag)
		}
	}
	brands, err = tx.Tag.MapCreateBulk(brands, func(c *ent.TagCreate, i int) {
		b := brands[i]
		c.SetValue(b.Value).
			SetCategory(brandCat)
	}).Save(ctx)
	if err != nil {
		return err
	}
	log.Printf("Created %d brands", len(brands))
	blends, err = tx.Tag.MapCreateBulk(blends, func(c *ent.TagCreate, i int) {
		b := blends[i]
		c.SetValue(b.Value).
			SetCategory(blendCat)
	}).Save(ctx)
	if err != nil {
		return err
	}
	blendNameMap := map[string]*ent.Tag{}
	for _, blend := range blends {
		blendNameMap[blend.Value] = blend
	}
	log.Printf("Created %d blends", len(blends))

	tagToTags := []*ent.TagToTag{}
	i := 0
	j := 0
	for _, arr := range blendMap {
		for range arr {
			tagToTags = append(tagToTags, &ent.TagToTag{
				Edges: ent.TagToTagEdges{
					ParentTag: blends[i],
					Tag:       brands[j],
				},
			})
			i++
		}
		j++
	}
	_, err = tx.TagToTag.MapCreateBulk(tagToTags, func(c *ent.TagToTagCreate, i int) {
		t := tagToTags[i]
		c.SetParentTag(t.Edges.ParentTag).
			SetTag(t.Edges.Tag)

	}).Save(ctx)
	if err != nil {
		return err
	}
	log.Printf("Created %d links", len(tagToTags))

	tobaccos := tx.Tobacco.Query().AllX(ctx)
	tobaccoMap := map[string]*ent.Tobacco{}
	for _, tobacco := range tobaccos {
		tobaccoMap[tobacco.Item] = tobacco
	}
	tobaccoToTags := []*ent.TobaccoToTag{}
	for _, blend := range blends {
		names, ok := tobaccoBlendMap[blend.Value]
		for _, name := range names {
			if !ok {
				continue
			}
			tobacco, ok := tobaccoMap[name]
			if !ok {
				continue
			}
			tobaccoToTags = append(tobaccoToTags, &ent.TobaccoToTag{Edges: ent.TobaccoToTagEdges{
				Tobacco: tobacco,
				Tag:     blend,
			}})

		}

	}
	_, err = tx.TobaccoToTag.MapCreateBulk(tobaccoToTags, func(c *ent.TobaccoToTagCreate, i int) {
		t := tobaccoToTags[i]
		c.SetTag(t.Edges.Tag).
			SetTobacco(t.Edges.Tobacco)
	}).Save(ctx)
	if err != nil {
		return err
	}
	log.Printf("Created %d tobacco tags", len(tobaccoToTags))
	return services.AssertStructureValid(ctx, tx)
}

func PortData() {
	ctx := context.Background()
	err := util.WithTx(ctx, util.DB, portTobaccos)
	if err != nil {
		log.Fatal(err)
	}
	err = util.WithTx(ctx, util.DB, portCategories)
	if err != nil {
		log.Fatal(err)
	}
}
