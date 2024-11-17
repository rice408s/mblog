package utils

import (
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"
	"time"
	"server/config"
)

var Logger = log.New(os.Stdout, "[API] ", log.LstdFlags)

func ToBeijingTime(t time.Time) string {
	loc, err := time.LoadLocation("Asia/Shanghai")
	if err != nil {
		loc = time.FixedZone("CST", 8*3600)
	}
	beijingTime := t.In(loc)
	return beijingTime.Format("2006-01-02 15:04")
}

func IsAllowedImageType(contentType string) bool {
	return config.AllowedImageTypes[contentType]
}

func EnsureDirectories() {
	dirs := []string{config.ImagesDir, config.PostsDir}

	for _, dir := range dirs {
		if err := os.MkdirAll(dir, 0755); err != nil {
			Logger.Fatalf("创建目录失败 %s: %v", dir, err)
		}
		Logger.Printf("确保目录存在: %s", dir)
	}
}

func ExtractField(frontmatter string, field string) string {
	re := regexp.MustCompile(fmt.Sprintf(`(?m)^%s:\s*(.+)$`, field))
	matches := re.FindStringSubmatch(frontmatter)
	if len(matches) > 1 {
		return strings.TrimSpace(matches[1])
	}
	return ""
} 