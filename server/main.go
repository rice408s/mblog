package main

import (
	"server/config"
	"server/handlers"
	"server/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		utils.Logger.Fatal("Error loading .env file")
	}

	// 初始化配置
	if err := config.Init(); err != nil {
		utils.Logger.Fatal(err)
	}

	r := gin.Default()

	// 使用配置的CORS设置
	r.Use(cors.New(cors.Config{
		AllowOrigins:     config.AllowedOrigins,
		AllowMethods:     config.AllowMethods,
		AllowHeaders:     config.AllowHeaders,
		ExposeHeaders:    config.ExposeHeaders,
		AllowCredentials: config.AllowCredentials,
		MaxAge:           config.MaxAge,
	}))

	// 使用配置的静态文件路径
	r.Static("/content", config.ContentDir)

	api := r.Group("/api")
	{
		api.POST("/validate-passphrase", handlers.ValidatePassphrase)
		api.POST("/upload", handlers.HandleImageUpload)
		api.POST("/posts", handlers.HandleSavePost)
		api.GET("/posts", handlers.HandleGetPosts)
		api.GET("/posts/:id", handlers.HandleGetPostById)
		api.PUT("/posts/:id", handlers.HandleUpdatePost)
		api.DELETE("/posts/:id", handlers.HandleSoftDeletePost)
		api.GET("/trash", handlers.HandleGetTrashPosts)
		api.POST("/posts/:id/restore", handlers.HandleRestorePost)
		api.DELETE("/posts/:id/permanent", handlers.HandlePermanentDelete)
		api.POST("/photos", handlers.HandleSavePhotos)
		api.GET("/photos", handlers.HandleGetPhotos)
		api.DELETE("/photos/:id", handlers.HandleDeletePhoto)
		api.GET("/photos/:id", handlers.HandleGetPhotoById)
		api.PUT("/photos/:id", handlers.HandleUpdatePhoto)
	}

	utils.Logger.Printf("服务器启动在 %s 端口...", config.Port)
	r.Run(config.Port)
}
