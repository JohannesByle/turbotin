package util

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

	"github.com/schollz/progressbar/v3"
)

type tobaccoKey struct {
	item string
	link string
}

func batch[T any](in []T, batchSize int) [][]T {
	var result = make([][]T, 0)

	for i := 0; i < len(in); i = i + batchSize {
		j := i + batchSize
		if j > len(in) {
			j = len(in)
		}
		result = append(result, in[i:j])
	}

	return result
}

func PortTobaccos() {
	f, err := os.Open("../data/archive.csv")
	if err != nil {
		panic(err)
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
	rows := DB.Tobacco.MapCreateBulk(tobaccos, func(c *ent.TobaccoCreate, i int) {
		t := tobaccos[i]
		c.SetStore(t.Store).
			SetItem(t.Item).
			SetLink(t.Link).
			AddPrices()
	}).SaveX(ctx)
	log.Printf("Created %d tobaccos", len(tobaccos))

	bar := progressbar.Default(int64(len(rows)), "Creating prices")
	tobaccoArrs := batch(tobaccos, 500)
	for i, arr := range batch(rows, 500) {
		builders := []*ent.TobaccoPriceCreate{}
		for j, t := range tobaccoArrs[i] {
			for _, p := range t.Edges.Prices {
				builders = append(builders, DB.TobaccoPrice.Create().
					SetPrice(p.Price).
					SetStock(p.Stock).
					SetTime(p.Time).
					SetTobacco(arr[j]))
			}
		}

		DB.TobaccoPrice.CreateBulk(builders...).SaveX(ctx)
		bar.Add(len(arr))
	}

}

func PortCategories() {
	f, err := os.Open("../data/cat_data.csv")
	if err != nil {
		panic(err)
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

	brandCat := DB.Category.Create().SetName("Brand").SaveX(ctx)
	blendCat := DB.Category.Create().SetName("Blend").SaveX(ctx)
	DB.Category.Create().SetName("Size").SaveX(ctx)
	DB.Category.Create().SetName("Cut").SaveX(ctx)

	brands := []*ent.Tag{}
	blends := []*ent.Tag{}

	// dedup on name
	seenBlends := map[string]bool{}

	for brand, arr := range blendMap {
		brands = append(brands, &ent.Tag{Value: brand})
		for blend := range arr {
			if seenBlends[strings.ToLower(blend)] {
				continue
			}
			seenBlends[strings.ToLower(blend)] = true
			blendTag := &ent.Tag{Value: blend}
			blends = append(blends, blendTag)
		}
	}
	brands = DB.Tag.MapCreateBulk(brands, func(c *ent.TagCreate, i int) {
		b := brands[i]
		c.SetValue(b.Value).
			SetCategory(brandCat)
	}).SaveX(ctx)
	log.Printf("Created %d brands", len(brands))
	blends = DB.Tag.MapCreateBulk(blends, func(c *ent.TagCreate, i int) {
		b := blends[i]
		c.SetValue(b.Value).
			SetCategory(blendCat)
	}).SaveX(ctx)
	blendNameMap := map[string]*ent.Tag{}
	for _, blend := range blends {
		blendNameMap[blend.Value] = blend
	}
	log.Printf("Created %d blends", len(blends))

	tagToTags := []*ent.TagToTag{}
	for _, brand := range brands {
		for name := range blendMap[brand.Value] {
			blend, ok := blendNameMap[name]
			if !ok {
				continue
			}
			tagToTags = append(tagToTags, &ent.TagToTag{
				Edges: ent.TagToTagEdges{
					ParentTag: blend,
					Tag:       brand,
				},
			})
		}
	}
	DB.TagToTag.MapCreateBulk(tagToTags, func(c *ent.TagToTagCreate, i int) {
		t := tagToTags[i]
		c.SetParentTag(t.Edges.ParentTag).
			SetTag(t.Edges.Tag)

	}).SaveX(ctx)
	log.Printf("Created %d links", len(tagToTags))

	tobaccos := DB.Tobacco.Query().AllX(ctx)
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
	DB.TobaccoToTag.MapCreateBulk(tobaccoToTags, func(c *ent.TobaccoToTagCreate, i int) {
		t := tobaccoToTags[i]
		c.SetTag(t.Edges.Tag).
			SetTobacco(t.Edges.Tobacco)
	}).SaveX(ctx)
	log.Printf("Created %d tobacco tags", len(tobaccoToTags))

}
