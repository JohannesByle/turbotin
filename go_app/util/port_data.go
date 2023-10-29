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

		brand := record[2]
		blend := record[3]

		blends, ok := blendMap[brand]
		if !ok {
			blends = map[string]bool{}
			blendMap[brand] = blends
		}
		blends[blend] = true

	}

	brandCat := &models.Category{Name: "Brand"}
	DB.Create(brandCat)
	blendCat := &models.Category{
		Name:     "Blend",
		ParentId: brandCat.ID}
	DB.Create(blendCat)

	brands := []*models.Tag{}
	for k := range blendMap {
		brands = append(brands, &models.Tag{
			CategoryId: brandCat.ID,
			Value:      k,
			ParentId:   0})
	}
	DB.CreateInBatches(brands, 500)

	blends := []*models.Tag{}
	for _, brand := range brands {
		for blend := range blendMap[brand.Value] {
			blends = append(blends, &models.Tag{
				CategoryId: blendCat.ID,
				Value:      blend,
				ParentId:   brand.ID})
		}
	}
	DB.CreateInBatches(blends, 500)

}
