package main

import (
	"context"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"net/http"
	"time"
)

var ctx = context.Background()

type Game struct {
	Username   string   `json:"username"`
	Deck       []string `json:"deck"`
	Hand       []string `json:"hand"`
	StartTime  string   `json:"startTime"`  // Record game start time
	LastSaved  string   `json:"lastSaved"`  // Record last save time
}

var rdb *redis.Client

func main() {
	rdb = redis.NewClient(&redis.Options{
		Addr: "localhost:6379", // Redis server address
	})

	router := gin.Default()

	router.POST("/api/startGame", startGame)
	router.POST("/api/saveGame", saveGame)
	router.GET("/api/leaderboard", getLeaderboard)

	router.Run(":8080")
}

func startGame(c *gin.Context) {
	var game Game
	if err := c.ShouldBindJSON(&game); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	game.Deck = []string{"Cat", "Cat", "Defuse", "Shuffle", "Exploding Kitten"}
	game.Hand = []string{}
	game.StartTime = time.Now().Format(time.RFC3339) // Store the current time when the game starts
	game.LastSaved = game.StartTime                 // Initialize the last saved time as start time

	data, _ := json.Marshal(game)

	err := rdb.Set(ctx, "game:"+game.Username, data, 0).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save game"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Game started", "startTime": game.StartTime})
}

func saveGame(c *gin.Context) {
	var game Game
	if err := c.ShouldBindJSON(&game); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	game.LastSaved = time.Now().Format(time.RFC3339) // Update last saved time with the current time

	data, _ := json.Marshal(game)
	err := rdb.Set(ctx, "game:"+game.Username, data, 0).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save game"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Game saved", "lastSaved": game.LastSaved})
}

func getLeaderboard(c *gin.Context) {
	leaderboard := rdb.ZRevRangeWithScores(ctx, "leaderboard", 0, 10).Val()

	c.JSON(http.StatusOK, gin.H{
		"leaderboard": leaderboard,
	})
}
