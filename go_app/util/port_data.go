package util

import (
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"net/url"
	"os"
	"strings"
	"time"
	"turbotin/models"
	"turbotin/protos"
)

type tobaccoKey struct {
	item string
	link string
}

func PortTobaccos() {
	f, err := os.Open("../data/archive.csv")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	tobaccoMap := map[tobaccoKey]*models.Tobacco{}

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
			item: strings.ToLower(record[2]),
			link: strings.ToLower(url.String())}

		tobacco, ok := tobaccoMap[key]
		if !ok {
			store, ok := protos.Store_value[record[1][6:]]
			if !ok {
				continue
			}
			tobacco = &models.Tobacco{
				Store:  int32(store),
				Item:   record[2],
				Link:   url.String(),
				Prices: make([]models.TobaccoPrice, 0)}
			tobaccoMap[key] = tobacco

		}
		t, err := time.Parse("2006-01-02 15:04:05", record[6])
		if err != nil {
			panic(fmt.Sprintf("unable to convert time: %s", record[6]))
		}
		tobacco.Prices = append(tobacco.Prices, models.TobaccoPrice{
			Price: record[3],
			Stock: record[4],
			Time:  t})

	}

	tobaccos := []*models.Tobacco{}
	for _, v := range tobaccoMap {
		tobaccos = append(tobaccos, v)
	}
	log.Println(len(tobaccos))

	DB.Omit("Prices").CreateInBatches(tobaccos, 500)

	prices := []models.TobaccoPrice{}
	for _, tobacco := range tobaccos {
		for _, price := range tobacco.Prices {
			price.TobaccoId = tobacco.ID
			prices = append(prices, price)
		}
	}
	log.Println(len(prices))
	DB.CreateInBatches(prices, 500)

}

func PortCategories() {
	f, err := os.Open("../data/cat_data.csv")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	blendMap := map[string]map[string]bool{}
	tobaccoBlendMap := map[string]string{}

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

		tobaccoBlendMap[blend] = tobacco

		blends, ok := blendMap[brand]
		if !ok {
			blends = map[string]bool{}
			blendMap[brand] = blends
		}
		blends[blend] = true

	}

	brandCat := &models.Category{Name: "Brand"}
	DB.Create(brandCat)
	blendCat := &models.Category{Name: "Blend"}
	DB.Create(blendCat)
	DB.Create(&models.Category{Name: "Size"})
	DB.Create(&models.Category{Name: "Cut"})

	brands := []*models.Tag{}
	blends := []*models.Tag{}
	blendTagMap := map[string][]*models.Tag{}

	// dedup on name
	seenBlends := map[string]bool{}

	for brand, arr := range blendMap {
		brands = append(brands, &models.Tag{
			CategoryId: brandCat.ID,
			Value:      brand})
		blendTags := []*models.Tag{}
		for blend := range arr {
			if seenBlends[strings.ToLower(blend)] {
				continue
			}
			seenBlends[strings.ToLower(blend)] = true
			blendTag := &models.Tag{
				CategoryId: blendCat.ID,
				Value:      blend}
			blends = append(blends, blendTag)
			blendTags = append(blendTags, blendTag)
		}
		blendTagMap[brand] = blendTags
	}
	DB.CreateInBatches(brands, 500)
	log.Println("Created brands")
	DB.CreateInBatches(blends, 500)
	log.Println("Created blends")

	tagToTags := []*models.TagToTag{}
	for _, brand := range brands {
		for _, blend := range blendTagMap[brand.Value] {
			tagToTags = append(tagToTags, &models.TagToTag{
				ParentTagId: blend.ID,
				TagId:       brand.ID})
		}
	}
	DB.CreateInBatches(tagToTags, 500)
	log.Println("Created tags")

	tobaccos := []*models.Tobacco{}
	DB.Find(&tobaccos)
	tobaccoMap := map[string]*models.Tobacco{}
	for _, tobacco := range tobaccos {
		tobaccoMap[tobacco.Item] = tobacco
	}
	tobaccoToTags := []*models.TobaccoToTag{}
	for _, blend := range blends {
		name, ok := tobaccoBlendMap[blend.Value]
		if !ok {
			continue
		}
		tobacco, ok := tobaccoMap[name]
		if !ok {
			continue
		}
		tobaccoToTags = append(tobaccoToTags, &models.TobaccoToTag{
			TobaccoId: tobacco.ID,
			TagId:     blend.ID,
		})

	}
	DB.CreateInBatches(tobaccoToTags, 500)
	log.Println("Created tobacco tags")

}
