package config

import (
	"os"
	"path/filepath"
	"strings"
	"time"
)

// 服务器配置
var (
	Port           string
	AllowedOrigins []string
	MaxAge         time.Duration
	TimeZone       string
)

// 目录配置
var (
	ContentDir string
	ImagesDir  string
	PostsDir   string
)

// 文件配置
var (
	PhotosFile string
)

// CORS配置
var (
	AllowMethods     []string
	AllowHeaders     []string
	ExposeHeaders    []string
	AllowCredentials bool
)

// 图片配置
var AllowedImageTypes map[string]bool

// 初始化函数
func Init() error {
	var err error

	// 加载服务器配置
	Port = getEnvOrDefault("PORT", ":8080")
	AllowedOrigins = strings.Split(getEnvOrDefault("ALLOWED_ORIGINS", "https://innov.ink,http://localhost:5173,http://localhost:8080"), ",")
	MaxAge, err = time.ParseDuration(getEnvOrDefault("MAX_AGE", "12h"))
	if err != nil {
		return err
	}
	TimeZone = getEnvOrDefault("TIMEZONE", "Asia/Shanghai")

	// 检查必要的环境变量
	if os.Getenv("SECRET_PASSPHRASE") == "" {
		return ErrMissingPassphrase
	}

	// 加载目录配置
	ContentDir = getEnvOrDefault("CONTENT_DIR", "/var/www/innov.ink")
	ImagesDir = filepath.Join(ContentDir, "images")
	PostsDir = filepath.Join(ContentDir, "posts")

	// 加载文件配置
	PhotosFile = getEnvOrDefault("PHOTOS_FILE", "data/photos.json")

	// 加载CORS配置
	AllowMethods = strings.Split(getEnvOrDefault("ALLOW_METHODS", "GET,POST,PUT,DELETE,OPTIONS"), ",")
	AllowHeaders = strings.Split(getEnvOrDefault("ALLOW_HEADERS", "Origin,Content-Type,Authorization"), ",")
	ExposeHeaders = strings.Split(getEnvOrDefault("EXPOSE_HEADERS", "Content-Length"), ",")
	AllowCredentials = getEnvOrDefault("ALLOW_CREDENTIALS", "true") == "true"

	// 加载图片配置
	allowedTypes := strings.Split(getEnvOrDefault("ALLOWED_IMAGE_TYPES", "image/jpeg,image/png,image/gif,image/webp"), ",")
	AllowedImageTypes = make(map[string]bool)
	for _, t := range allowedTypes {
		AllowedImageTypes[strings.TrimSpace(t)] = true
	}

	// 创建必要的目录
	dirs := []string{ImagesDir, PostsDir}
	for _, dir := range dirs {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return err
		}
	}

	return nil
}

// 辅助函数：获取环境变量，如果不存在则返回默认值
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
