package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"sort"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"server/config"
	"server/models"
)

// 修改请求结构体
type PhotoRequest struct {
	URLs        []string `json:"urls"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Category    string   `json:"category"`
	Created     string   `json:"created"`
}

// 保存照片
func HandleSavePhotos(c *gin.Context) {
	var newPhotos PhotoRequest
	if err := c.BindJSON(&newPhotos); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的数据格式"})
		return
	}

	photosData := models.PhotosData{Photos: []models.Photo{}}
	photosFile := config.PhotosFile

	if _, err := os.Stat("data"); os.IsNotExist(err) {
		os.Mkdir("data", 0755)
	}

	if data, err := os.ReadFile(photosFile); err == nil {
		json.Unmarshal(data, &photosData)
	}

	photo := models.Photo{
		ID:          uuid.New().String(),
		URLs:        newPhotos.URLs,
		Title:       newPhotos.Title,
		Description: newPhotos.Description,
		Category:    newPhotos.Category,
		Created:     newPhotos.Created,
		UpdatedAt:   time.Now(),
	}

	photosData.Photos = append(photosData.Photos, photo)

	jsonData, err := json.MarshalIndent(photosData, "", "    ")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存失败"})
		return
	}

	if err := os.WriteFile(photosFile, jsonData, 0644); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存失败"})
		return
	}

	c.JSON(http.StatusOK, photo)
}

// 获取照片列表
func HandleGetPhotos(c *gin.Context) {
	photosData := models.PhotosData{Photos: []models.Photo{}}
	photosFile := config.PhotosFile

	if data, err := os.ReadFile(photosFile); err == nil {
		if err := json.Unmarshal(data, &photosData); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "读取数据失败"})
			return
		}
	}

	category := c.Query("category")
	if category != "" && category != "all" {
		filteredPhotos := []models.Photo{}
		for _, photo := range photosData.Photos {
			if photo.Category == category {
				filteredPhotos = append(filteredPhotos, photo)
			}
		}
		photosData.Photos = filteredPhotos
	}

	sort.Slice(photosData.Photos, func(i, j int) bool {
		return photosData.Photos[i].Created > photosData.Photos[j].Created
	})

	c.JSON(http.StatusOK, photosData)
}

// 删除照片
func HandleDeletePhoto(c *gin.Context) {
	id := c.Param("id")
	photosFile := config.PhotosFile

	photosData := models.PhotosData{Photos: []models.Photo{}}
	if data, err := os.ReadFile(photosFile); err == nil {
		json.Unmarshal(data, &photosData)
	}

	found := false
	newPhotos := []models.Photo{}
	for _, photo := range photosData.Photos {
		if photo.ID != id {
			newPhotos = append(newPhotos, photo)
		} else {
			found = true
		}
	}

	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "照片不存在"})
		return
	}

	photosData.Photos = newPhotos
	jsonData, err := json.MarshalIndent(photosData, "", "    ")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存失败"})
		return
	}

	if err := os.WriteFile(photosFile, jsonData, 0644); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

// 获取单个照片
func HandleGetPhotoById(c *gin.Context) {
	id := c.Param("id")
	photosFile := config.PhotosFile

	photosData := models.PhotosData{Photos: []models.Photo{}}
	if data, err := os.ReadFile(photosFile); err == nil {
		if err := json.Unmarshal(data, &photosData); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "读取数据失败"})
			return
		}
	}

	for _, photo := range photosData.Photos {
		if photo.ID == id {
			c.JSON(http.StatusOK, photo)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "照片不存在"})
}

// 更新照片
func HandleUpdatePhoto(c *gin.Context) {
	id := c.Param("id")
	var updatePhoto PhotoRequest
	if err := c.BindJSON(&updatePhoto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的数据格式"})
		return
	}

	photosFile := config.PhotosFile
	photosData := models.PhotosData{Photos: []models.Photo{}}
	
	if data, err := os.ReadFile(photosFile); err == nil {
		if err := json.Unmarshal(data, &photosData); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "读取数据失败"})
			return
		}
	}

	found := false
	for i, photo := range photosData.Photos {
		if photo.ID == id {
			photosData.Photos[i] = models.Photo{
				ID:          id,
				URLs:        updatePhoto.URLs,
				Title:       updatePhoto.Title,
				Description: updatePhoto.Description,
				Category:    updatePhoto.Category,
				Created:     updatePhoto.Created,
				UpdatedAt:   time.Now(),
			}
			found = true
			break
		}
	}

	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "照片不存在"})
		return
	}

	jsonData, err := json.MarshalIndent(photosData, "", "    ")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存失败"})
		return
	}

	if err := os.WriteFile(photosFile, jsonData, 0644); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "更新成功"})
} 