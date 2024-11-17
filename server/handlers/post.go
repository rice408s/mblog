package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"
	"unicode"

	"server/config"
	"server/models"
	"server/utils"

	"github.com/gin-gonic/gin"
)

// 处理图片上传
func HandleImageUpload(c *gin.Context) {
	utils.Logger.Println("开始处理图片上传请求")

	file, err := c.FormFile("image")
	if err != nil {
		utils.Logger.Printf("获取上传文件失败: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "无法获取上传的文件"})
		return
	}

	if !utils.IsAllowedImageType(file.Header.Get("Content-Type")) {
		utils.Logger.Printf("不支持的文件类型: %s", file.Header.Get("Content-Type"))
		c.JSON(http.StatusBadRequest, gin.H{"error": "不支持的文件类型"})
		return
	}

	filename := fmt.Sprintf("%d-%s", time.Now().UnixNano(), file.Filename)
	uploadDir := config.ImagesDir
	filepath := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, filepath); err != nil {
		utils.Logger.Printf("保存文件失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存文件失败"})
		return
	}

	imageUrl := fmt.Sprintf("http://%s/content/images/%s", c.Request.Host, filename)
	c.JSON(http.StatusOK, gin.H{
		"imageUrl": imageUrl,
		"message":  "图片上传成功",
	})
}

// 保存文章
func HandleSavePost(c *gin.Context) {
	var post models.Post
	if err := c.ShouldBindJSON(&post); err != nil {
		utils.Logger.Printf("绑定 JSON 失败: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求格式"})
		return
	}

	if post.Title == "" || post.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "标题和内容不能为空"})
		return
	}

	// 使用北京时间
	loc, err := time.LoadLocation("Asia/Shanghai")
	if err != nil {
		utils.Logger.Printf("加载Asia/Shanghai时区失败: %v, 使用固定时区", err)
		loc = time.FixedZone("CST", 8*3600)
	}

	// 获取当前时间
	currentTime := time.Now().In(loc)

	utils.Logger.Printf("当前时间: %v", currentTime)
	utils.Logger.Printf("时区: %v", currentTime.Location())

	// 使用当前时间作为创建和更新时间
	timeStr := currentTime.Format("2006-01-02 15:04")
	utils.Logger.Printf("格式化后的时间: %v", timeStr)

	// 构建文章内容
	frontmatter := []string{
		"---",
		fmt.Sprintf("title:    %s", post.Title),
		fmt.Sprintf("created:  %s", timeStr), // 使用当前时间
		fmt.Sprintf("updated:  %s", timeStr), // 使用当前时间
		fmt.Sprintf("category: %s", post.Category),
		fmt.Sprintf("summary:  %s", post.Summary),
		"tags:",
	}

	for _, tag := range post.Tags {
		frontmatter = append(frontmatter, fmt.Sprintf("  - %s", tag))
	}
	frontmatter = append(frontmatter, "---")

	// 提取主要内容（如果有的话）
	mainContent := extractMainContent(post.Content)

	// 组合完整的文章内容
	fullContent := strings.Join(frontmatter, "\n") + "\n\n" + mainContent

	// 清理标题，移除特殊字符
	sanitizedTitle := strings.Map(func(r rune) rune {
		switch {
		case unicode.IsLetter(r), unicode.IsNumber(r):
			return r
		case unicode.IsSpace(r):
			return '-'
		default:
			return '-'
		}
	}, post.Title)

	// 使用当前时间构建文件名
	fileName := fmt.Sprintf("%sT%s-%s.md",
		currentTime.Format("2006-01-02"),
		currentTime.Format("15-04"),
		sanitizedTitle)

	// 使用相对路径
	postsDir := config.PostsDir
	filePath := filepath.Join(postsDir, fileName)

	// 确保目录存在
	if err := os.MkdirAll(postsDir, 0755); err != nil {
		utils.Logger.Printf("创建目录失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存文章失败"})
		return
	}

	// 写入文件
	utils.Logger.Printf("正在保存文件: %s", filePath)
	utils.Logger.Printf("文章内容: %s", fullContent)

	if err := os.WriteFile(filePath, []byte(fullContent), 0644); err != nil {
		utils.Logger.Printf("保存文件失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存文章失败"})
		return
	}

	// 返回成功响应
	urlPath := strings.TrimSuffix(fileName, ".md")
	c.JSON(http.StatusOK, gin.H{
		"message": "文章保存成功",
		"path":    fileName,
		"url":     urlPath,
		"title":   post.Title,
		"created": timeStr,
		"updated": timeStr,
	})
}

// 获取文章列表
func HandleGetPosts(c *gin.Context) {
	postsDir := config.PostsDir
	files, err := os.ReadDir(postsDir)
	if err != nil {
		utils.Logger.Printf("读取文章目录失败: %v", err)
		c.JSON(http.StatusOK, []gin.H{}) // 返回空数组而不是错误
		return
	}

	posts := getPostsList(files, postsDir, false)
	if posts == nil {
		posts = []gin.H{} // 确保返回空数组而不是 null
	}
	c.JSON(http.StatusOK, posts)
}

// 获取单篇文章
func HandleGetPostById(c *gin.Context) {
	id := c.Param("id")
	filePath := filepath.Join(config.PostsDir, id+".md")

	post, err := getPostByPath(filePath)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		return
	}

	c.JSON(http.StatusOK, post)
}

// 更新文章
func HandleUpdatePost(c *gin.Context) {
	id := c.Param("id")
	var post models.Post
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求格式"})
		return
	}

	if post.Title == "" || post.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "标题和内容不能为空"})
		return
	}

	filePath := filepath.Join(config.PostsDir, id+".md")
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		return
	}

	// 使用北京时间，并添加详细日志
	loc, err := time.LoadLocation("Asia/Shanghai")
	if err != nil {
		utils.Logger.Printf("加载Asia/Shanghai时区失败: %v, 使用固定时区", err)
		loc = time.FixedZone("CST", 8*3600)
	}

	utcTime := time.Now()
	beijingTime := utcTime.In(loc)

	utils.Logger.Printf("UTC时间: %v", utcTime)
	utils.Logger.Printf("北京时间: %v", beijingTime)
	utils.Logger.Printf("时区: %v", beijingTime.Location())

	now := beijingTime.Format("2006-01-02 15:04")
	utils.Logger.Printf("格式化后的时间: %v", now)

	post.Updated = now

	content := buildPostContent(post)
	if err := os.WriteFile(filePath, []byte(content), 0644); err != nil {
		utils.Logger.Printf("更新文章失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新文章失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "文章更新成功",
		"path":    id + ".md",
		"url":     id,
		"title":   post.Title,
		"created": post.Created,
		"updated": now,
	})
}

// 软删除文章
func HandleSoftDeletePost(c *gin.Context) {
	id := c.Param("id")
	filePath := filepath.Join(config.PostsDir, id+".md")

	if err := updatePostDeleteStatus(filePath, true); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "文章已删除"})
}

// 获取回收站文章
func HandleGetTrashPosts(c *gin.Context) {
	files, err := os.ReadDir(config.PostsDir)
	if err != nil {
		utils.Logger.Printf("读取目录失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取回收站文章失败"})
		return
	}

	posts := getPostsList(files, config.PostsDir, true)
	c.JSON(http.StatusOK, gin.H{"posts": posts})
}

// 恢复文章
func HandleRestorePost(c *gin.Context) {
	id := c.Param("id")
	filePath := filepath.Join(config.PostsDir, id+".md")

	if err := updatePostDeleteStatus(filePath, false); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "恢复失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "文章已恢复"})
}

// 永久删除文章
func HandlePermanentDelete(c *gin.Context) {
	id := c.Param("id")
	filePath := filepath.Join(config.PostsDir, id+".md")

	content, err := os.ReadFile(filePath)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		return
	}

	// 删除文章中的图片
	imgRegex := regexp.MustCompile(`!\[.*?\]\((.*?)\)`)
	matches := imgRegex.FindAllStringSubmatch(string(content), -1)
	for _, match := range matches {
		if len(match) > 1 {
			imgPath := filepath.Join(config.ImagesDir, filepath.Base(match[1]))
			os.Remove(imgPath)
		}
	}

	if err := os.Remove(filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除文章失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "文章已永久删除"})
}

// 辅助函数
func buildPostContent(post models.Post) string {
	frontmatter := []string{
		"---",
		fmt.Sprintf("title:    %s", post.Title),
		fmt.Sprintf("created:  %s", post.Created),
		fmt.Sprintf("updated:  %s", post.Updated),
		fmt.Sprintf("category: %s", post.Category),
		fmt.Sprintf("summary:  %s", post.Summary),
		"tags:",
	}

	for _, tag := range post.Tags {
		frontmatter = append(frontmatter, fmt.Sprintf("  - %s", tag))
	}
	frontmatter = append(frontmatter, "---")

	mainContent := extractMainContent(post.Content)
	return strings.Join(frontmatter, "\n") + "\n\n" + mainContent
}

func extractMainContent(content string) string {
	contentRegex := regexp.MustCompile(`(?s)^---\n.*?\n---\n\s*([\s\S]*)$`)
	matches := contentRegex.FindStringSubmatch(content)
	if len(matches) > 1 {
		return strings.TrimSpace(matches[1])
	}
	return strings.TrimSpace(content)
}

func updatePostDeleteStatus(filePath string, deleted bool) error {
	content, err := os.ReadFile(filePath)
	if err != nil {
		return err
	}

	frontmatterRegex := regexp.MustCompile(`(?s)^(---\n.*?\n---\n)(.*)$`)
	matches := frontmatterRegex.FindStringSubmatch(string(content))
	if len(matches) != 3 {
		return fmt.Errorf("无效的文章格式")
	}

	frontmatter, mainContent := matches[1], matches[2]
	if strings.Contains(frontmatter, "deleted:") {
		frontmatter = strings.Replace(frontmatter,
			fmt.Sprintf("deleted: %v", !deleted),
			fmt.Sprintf("deleted: %v", deleted), 1)
	} else {
		frontmatter = strings.TrimSuffix(frontmatter, "---\n") +
			fmt.Sprintf("deleted: %v\n---\n", deleted)
	}

	newContent := frontmatter + mainContent
	return os.WriteFile(filePath, []byte(newContent), 0644)
}

func getPostsList(files []os.DirEntry, postsDir string, deleted bool) []gin.H {
	var posts []gin.H
	for _, file := range files {
		if !file.IsDir() && strings.HasSuffix(file.Name(), ".md") {
			content, err := os.ReadFile(filepath.Join(postsDir, file.Name()))
			if err != nil {
				continue
			}

			isDeleted := strings.Contains(string(content), "deleted: true")
			if isDeleted != deleted {
				continue
			}

			if post, err := parsePost(content, file.Name()); err == nil {
				posts = append(posts, post)
			}
		}
	}

	// 按创建时间排序
	sort.Slice(posts, func(i, j int) bool {
		return posts[i]["created"].(string) > posts[j]["created"].(string)
	})

	return posts
}

func parsePost(content []byte, fileName string) (gin.H, error) {
	frontmatterRegex := regexp.MustCompile(`(?s)^---\n(.*?)\n---\n`)
	matches := frontmatterRegex.FindSubmatch(content)
	if len(matches) < 2 {
		return nil, fmt.Errorf("无效的文章格式")
	}

	frontmatter := string(matches[1])
	title := utils.ExtractField(frontmatter, "title")
	created := utils.ExtractField(frontmatter, "created")
	updated := utils.ExtractField(frontmatter, "updated")
	category := utils.ExtractField(frontmatter, "category")
	summary := utils.ExtractField(frontmatter, "summary")

	var tags []string
	tagRegex := regexp.MustCompile(`(?m)^  - (.+)$`)
	tagMatches := tagRegex.FindAllStringSubmatch(frontmatter, -1)
	for _, match := range tagMatches {
		if len(match) > 1 {
			tags = append(tags, match[1])
		}
	}

	id := strings.TrimSuffix(fileName, ".md")
	return gin.H{
		"id":       id,
		"title":    title,
		"created":  created,
		"updated":  updated,
		"category": category,
		"summary":  summary,
		"tags":     tags,
		"content":  string(content),
	}, nil
}
func getPostByPath(filePath string) (gin.H, error) {
	content, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	return parsePost(content, filepath.Base(filePath))
}
