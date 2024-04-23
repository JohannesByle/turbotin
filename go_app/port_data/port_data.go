package port_data

import (
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/url"
	"os"
	"slices"
	"strconv"
	"strings"
	"time"
	"turbotin/ent"
	"turbotin/protos"
	"turbotin/services"
	"turbotin/util"

	"github.com/schollz/progressbar/v3"
)

const BATCH_SIZE = 5000

var STORES = map[string]protos.Store{
	"UNSPECIFIED":     protos.Store_STORE_UNSPECIFIED,
	"4NOGGINS":        protos.Store_STORE_4NOGGINS,
	"TOPHAT":          protos.Store_STORE_TOPHAT,
	"CUPOJOES":        protos.Store_STORE_CUPOJOES,
	"MARSCIGARS":      protos.Store_STORE_MARSCIGARS,
	"MILAN":           protos.Store_STORE_MILAN,
	"SMOKINGPIPES":    protos.Store_STORE_SMOKINGPIPES,
	"NICEASHCIGARS":   protos.Store_STORE_NICEASHCIGARS,
	"IWANRIES":        protos.Store_STORE_IWANRIES,
	"MCCRANIES":       protos.Store_STORE_MCCRANIES,
	"BOSWELL":         protos.Store_STORE_BOSWELL,
	"LILBROWN":        protos.Store_STORE_LILBROWN,
	"WINDYCITYCIGARS": protos.Store_STORE_WINDYCITYCIGARS,
	"BNB":             protos.Store_STORE_BNB,
	"THEBRIARY":       protos.Store_STORE_THEBRIARY,
	"KBVEN":           protos.Store_STORE_KBVEN,
	"TOBACCOPIPES":    protos.Store_STORE_TOBACCOPIPES,
	"KINGSMOKING":     protos.Store_STORE_KINGSMOKING,
	"COUNTRYSQUIRE":   protos.Store_STORE_COUNTRYSQUIRE,
	"PIPESANDCIGARS":  protos.Store_STORE_PIPESANDCIGARS,
	"WATCHCITYCIGAR":  protos.Store_STORE_WATCHCITYCIGAR,
	"THESTORYTELLERS": protos.Store_STORE_THESTORYTELLERS,
	"PAYLESS":         protos.Store_STORE_PAYLESS,
	"HILANDSCIGARS":   protos.Store_STORE_HILANDSCIGARS,
	"PIPEANDLEAF":     protos.Store_STORE_PIPEANDLEAF,
	"CIGARSINTL":      protos.Store_STORE_CIGARSINTL,
	"EACAREY":         protos.Store_STORE_EACAREY,
	"PIPENOOK":        protos.Store_STORE_PIPENOOK,
	"WILKE":           protos.Store_STORE_WILKE,
	"SMOKERSHAVEN":    protos.Store_STORE_SMOKERSHAVEN,
	"BLACKCATCIGARS":  protos.Store_STORE_BLACKCATCIGARS,
	"ANSTEADS":        protos.Store_STORE_ANSTEADS,
	"CDMCIGARS":       protos.Store_STORE_CDMCIGARS,
	"LJPERETTI":       protos.Store_STORE_LJPERETTI,
	"OUTWEST":         protos.Store_STORE_OUTWEST,
	"JUST4HIM":        protos.Store_STORE_JUST4HIM,
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
	type tobaccoKey struct {
		item string
		link string
	}

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
	numPrices := 0
	for i, arr := range batch(rows) {
		builders := []*ent.TobaccoPriceCreate{}
		for j, t := range tobaccoArrs[i] {
			for _, p := range t.Edges.Prices {
				numPrices++
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
	log.Printf("Created %d prices", numPrices)
	return nil
}

func portCategories(tx *ent.Tx) error {
	f, err := os.Open("../data/cat_data.csv")
	if err != nil {
		return err
	}
	defer f.Close()

	blendMap := map[string][]string{}
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
			blends = []string{}
		}
		if slices.Index(blends, blend) < 0 {
			blendMap[brand] = append(blends, blend)
		}
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
		for _, blend := range arr {
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
	log.Printf("Created %d blends", len(blends))

	tagToTags := []*ent.TagToTag{}
	i := 0
	for _, brand := range brands {
		arr := blendMap[brand.Value]
		for range arr {
			tagToTags = append(tagToTags, &ent.TagToTag{
				Edges: ent.TagToTagEdges{
					ParentTag: blends[i],
					Tag:       brand,
				},
			})
			i++
		}

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

func portUsers(tx *ent.Tx) error {
	ctx := context.Background()
	type notification struct {
		Brand    string      `json:"brand"`
		Blend    string      `json:"blend"`
		Stores   []string    `json:"stores"`
		MaxPrice interface{} `json:"max_price"`
	}
	type blendKey struct {
		brand string
		blend string
	}
	links, err := tx.TagToTag.Query().WithTag().WithParentTag().All(ctx)
	if err != nil {
		return err
	}
	linkMap := map[blendKey]*ent.Tag{}
	for _, link := range links {
		key := blendKey{
			brand: strings.ToLower(link.Edges.Tag.Value),
			blend: strings.ToLower(link.Edges.ParentTag.Value),
		}
		linkMap[key] = link.Edges.ParentTag
	}

	f, err := os.Open("../data/user.csv")
	if err != nil {
		return err
	}
	defer f.Close()

	users := []*ent.User{}
	notificationMap := map[string][]*ent.Notification{}
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
		id, err := strconv.Atoi(record[1])
		if err != nil {
			return err
		}
		user := &ent.User{
			ID:                       id,
			Email:                    record[2],
			Password:                 record[3],
			EmailVerified:            record[5] == "1",
			EmailCode:                record[6],
			EmailCodeCreated:         time.Now(),
			PasswordResetCode:        record[8],
			IsAdmin:                  false,
			LastEmailTime:            time.Now(),
			PasswordResetCodeCreated: time.Now(),
			Edges:                    ent.UserEdges{Notifications: []*ent.Notification{}},
		}
		if !util.EMAIL_REGEX.Match([]byte(user.Email)) && !user.EmailVerified {
			continue
		}
		var notifications []notification
		err = json.Unmarshal([]byte(record[7]), &notifications)
		if err != nil {
			return err
		}

		tags := map[int]bool{}
		i := 0
		for _, notification := range notifications {
			key := blendKey{
				brand: strings.ToLower(notification.Brand),
				blend: strings.ToLower(notification.Blend),
			}
			tag, ok := linkMap[key]
			if !ok {
				continue
			}
			if tags[tag.ID] {
				continue
			}
			tags[tag.ID] = true

			stores := []string{}
			for _, store := range notification.Stores {
				s, ok := STORES[strings.ToUpper(store)]
				if ok {
					stores = append(stores, strconv.Itoa(int(s)))
				}
			}

			user.Edges.Notifications = append(user.Edges.Notifications, &ent.Notification{
				Edges: ent.NotificationEdges{Tag: tag, User: user},
			})

			if len(stores) > 0 {
				user.Edges.Notifications[i].Stores = "[" + strings.Join(stores, ",") + "]"
			}
			switch maxPrice := notification.MaxPrice.(type) {
			case float64:
				user.Edges.Notifications[i].MaxPrice = int16(maxPrice)
			}
			i++
		}
		users = append(users, user)
		notificationMap[user.Email] = user.Edges.Notifications
	}

	users, err = tx.User.MapCreateBulk(users, func(c *ent.UserCreate, i int) {
		u := users[i]
		c.SetEmail(u.Email).
			SetPassword(u.Password).
			SetEmailVerified(u.EmailVerified).
			SetEmailCode(u.EmailCode).
			SetEmailCodeCreated(u.EmailCodeCreated).
			SetIsAdmin(u.IsAdmin).
			SetLastEmailTime(u.LastEmailTime).
			SetPasswordResetCodeCreated(u.PasswordResetCodeCreated)
	}).Save(ctx)
	if err != nil {
		return err
	}
	log.Printf("Created %d users", len(users))

	notifications := []*ent.Notification{}

	for _, user := range users {
		for _, notification := range notificationMap[user.Email] {
			notification.Edges.User = user
			notifications = append(notifications, notification)
		}
	}
	_, err = tx.Notification.MapCreateBulk(notifications, func(c *ent.NotificationCreate, i int) {
		n := notifications[i]
		c.SetUser(n.Edges.User).
			SetTag(n.Edges.Tag).
			SetExcludeStores(false)
		if len(n.Stores) > 0 {
			c.SetStores(n.Stores)
		}
		if n.MaxPrice > 0 {
			c.SetMaxPrice(n.MaxPrice)
		}

	}).Save(ctx)
	log.Printf("Created %d notifications", len(notifications))

	return err
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
	err = util.WithTx(ctx, util.DB, portUsers)
	if err != nil {
		log.Fatal(err)
	}

}
