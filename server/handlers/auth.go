package handlers

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"server/models"
)

func ValidatePassphrase(c *gin.Context) {
	var req models.PassphraseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求格式"})
		return
	}

	correctPassphrase := os.Getenv("SECRET_PASSPHRASE")
	isValid := req.Passphrase == correctPassphrase

	c.JSON(http.StatusOK, gin.H{
		"isValid": isValid,
		"message": map[bool]string{
			true:  "验证成功",
			false: "验证失败",
		}[isValid],
	})
} 