package models

import (
	"database/sql"
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email    string `gorm:"type:varchar(100) not null;unique"`
	Password string `gorm:"type:char(100) not null"`

	EmailVerified        bool
	EmailCode            string `gorm:"type:char(64) not null"`
	EmailCodeCreated     sql.NullTime
	PasswordResetCode    string `gorm:"type:char(64) not null"`
	PasswordResetCreated sql.NullTime

	IsAdmin bool

	LastEmailTime sql.NullTime
}

type Tobacco struct {
	gorm.Model
	Store  int32  `gorm:"type:varchar(100) not null;"`
	Item   string `gorm:"type:varchar(150) not null;uniqueIndex:idx_tobacco"`
	Link   string `gorm:"type:varchar(250) not null;uniqueIndex:idx_tobacco"`
	Prices []TobaccoPrice
}

type TobaccoPrice struct {
	gorm.Model
	TobaccoId uint      `gorm:"index"`
	Price     string    `gorm:"type:varchar(100) not null"`
	Stock     string    `gorm:"type:varchar(100) not null"`
	Time      time.Time `gorm:"index"`
}

type Tag struct {
	gorm.Model
	ParentId   uint   `gorm:"null;index;uniqueIndex:value"`
	Value      string `gorm:"type:varchar(500);uniqueIndex:value"`
	CategoryId uint   `gorm:"index;uniqueIndex:value"`
}

type Category struct {
	gorm.Model
	ParentId uint   `gorm:"null"`
	Name     string `gorm:"type:varchar(100);unique"`
}
