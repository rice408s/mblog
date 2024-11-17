package models

import "time"

type Photo struct {
	ID          string    `json:"id"`
	URLs        []string  `json:"urls"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	Created     string    `json:"created"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type PhotosData struct {
	Photos []Photo `json:"photos"`
} 