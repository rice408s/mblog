package config

import "errors"

var (
	ErrMissingPassphrase = errors.New("SECRET_PASSPHRASE 环境变量未设置")
) 