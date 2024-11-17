package models

type Post struct {
	Title    string   `json:"title"`
	Category string   `json:"category"`
	Summary  string   `json:"summary"`
	Content  string   `json:"content"`
	Tags     []string `json:"tags"`
	Created  string   `json:"created"`
	Updated  string   `json:"updated"`
	Deleted  bool     `json:"deleted"`
}

type PassphraseRequest struct {
	Passphrase string `json:"passphrase"`
} 