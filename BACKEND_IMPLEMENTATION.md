# Scoreboard Assistant Backend Implementation Guide

## Overview

This document provides a complete guide for implementing a backend API to support the Team Sport Score Tracker frontend. The backend is responsible for managing score state and serving the frontend API requests.

## API Specification

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. GET /scores
**Description:** Retrieve current scores for both teams

**Request:**
```
GET /api/scores
```

**Response:** `200 OK`
```json
{
  "teamA": 15,
  "teamB": 12
}
```

**Error:** `500 Internal Server Error`
```json
{
  "error": "Failed to retrieve scores"
}
```

---

#### 2. PUT /scores/teamA
**Description:** Update Team A's score

**Request:**
```
PUT /api/scores/teamA
Content-Type: application/json

{
  "score": 16
}
```

**Response:** `200 OK`
```json
{
  "teamA": 16,
  "teamB": 12
}
```

**Error:** `400 Bad Request`
```json
{
  "error": "Invalid score value"
}
```

---

#### 3. PUT /scores/teamB
**Description:** Update Team B's score

**Request:**
```
PUT /api/scores/teamB
Content-Type: application/json

{
  "score": 13
}
```

**Response:** `200 OK`
```json
{
  "teamA": 16,
  "teamB": 13
}
```

**Error:** `400 Bad Request`
```json
{
  "error": "Invalid score value"
}
```

---

#### 4. POST /scores/reset
**Description:** Reset both scores to 0

**Request:**
```
POST /api/scores/reset
```

**Response:** `200 OK`
```json
{
  "teamA": 0,
  "teamB": 0
}
```

---

## Data Schema

### Score State
```typescript
interface ScoreState {
  teamA: number  // Must be >= 0
  teamB: number  // Must be >= 0
}
```

### Request Body
```typescript
interface UpdateScoreRequest {
  score: number  // Must be >= 0
}
```

---

## Implementation Examples

### Node.js + Express

```typescript
import express from 'express'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

// In-memory score storage
let scores = {
  teamA: 0,
  teamB: 0,
}

// GET /api/scores
app.get('/api/scores', (req, res) => {
  res.json(scores)
})

// PUT /api/scores/teamA
app.put('/api/scores/teamA', (req, res) => {
  const { score } = req.body

  if (typeof score !== 'number' || score < 0) {
    return res.status(400).json({ error: 'Invalid score value' })
  }

  scores.teamA = score
  res.json(scores)
})

// PUT /api/scores/teamB
app.put('/api/scores/teamB', (req, res) => {
  const { score } = req.body

  if (typeof score !== 'number' || score < 0) {
    return res.status(400).json({ error: 'Invalid score value' })
  }

  scores.teamB = score
  res.json(scores)
})

// POST /api/scores/reset
app.post('/api/scores/reset', (req, res) => {
  scores = {
    teamA: 0,
    teamB: 0,
  }
  res.json(scores)
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
```

**Setup:**
```bash
npm init -y
npm install express cors
npx tsc --init
# Add start script to package.json
npm run start
```

---

### Python + Flask

```python
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory score storage
scores = {
    'teamA': 0,
    'teamB': 0
}

@app.route('/api/scores', methods=['GET'])
def get_scores():
    return jsonify(scores)

@app.route('/api/scores/teamA', methods=['PUT'])
def update_team_a():
    data = request.get_json()
    score = data.get('score')
    
    if not isinstance(score, int) or score < 0:
        return jsonify({'error': 'Invalid score value'}), 400
    
    scores['teamA'] = score
    return jsonify(scores)

@app.route('/api/scores/teamB', methods=['PUT'])
def update_team_b():
    data = request.get_json()
    score = data.get('score')
    
    if not isinstance(score, int) or score < 0:
        return jsonify({'error': 'Invalid score value'}), 400
    
    scores['teamB'] = score
    return jsonify(scores)

@app.route('/api/scores/reset', methods=['POST'])
def reset_scores():
    global scores
    scores = {'teamA': 0, 'teamB': 0}
    return jsonify(scores)

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

**Setup:**
```bash
pip install flask flask-cors
python app.py
```

---

### Go + Gin

```go
package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type Scores struct {
	TeamA int `json:"teamA"`
	TeamB int `json:"teamB"`
}

type UpdateRequest struct {
	Score int `json:"score"`
}

var scores = Scores{TeamA: 0, TeamB: 0}

func main() {
	router := gin.Default()
	router.Use(CORSMiddleware())

	router.GET("/api/scores", getScores)
	router.PUT("/api/scores/teamA", updateTeamA)
	router.PUT("/api/scores/teamB", updateTeamB)
	router.POST("/api/scores/reset", resetScores)

	router.Run(":3000")
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func getScores(c *gin.Context) {
	c.JSON(http.StatusOK, scores)
}

func updateTeamA(c *gin.Context) {
	var req UpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.Score < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid score value"})
		return
	}
	scores.TeamA = req.Score
	c.JSON(http.StatusOK, scores)
}

func updateTeamB(c *gin.Context) {
	var req UpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.Score < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid score value"})
		return
	}
	scores.TeamB = req.Score
	c.JSON(http.StatusOK, scores)
}

func resetScores(c *gin.Context) {
	scores = Scores{TeamA: 0, TeamB: 0}
	c.JSON(http.StatusOK, scores)
}
```

**Setup:**
```bash
go mod init scoreboard-api
go get -u github.com/gin-gonic/gin
go run main.go
```

---

## State Management

### In-Memory Storage (Development)
Perfect for local testing and development. Scores reset when the server restarts.

```typescript
let scores = { teamA: 0, teamB: 0 }
```

### Database Storage (Production)

For persistent storage, use a database:

#### PostgreSQL Example
```sql
CREATE TABLE scores (
  id INT PRIMARY KEY DEFAULT 1,
  team_a INT NOT NULL DEFAULT 0,
  team_b INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO scores (team_a, team_b) VALUES (0, 0);
```

#### MongoDB Example
```javascript
db.scores.insertOne({
  _id: 1,
  teamA: 0,
  teamB: 0,
  updatedAt: new Date()
})
```

---

## CORS Configuration

The backend must allow requests from the frontend with proper CORS headers.

**Required Headers:**
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, PUT, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

**Node.js Example:**
```typescript
import cors from 'cors'

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
}))
```

---

## Environment Configuration

Create a `.env` file for your backend:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/scoreboard
CORS_ORIGIN=http://localhost:5173
```

---

## Testing the API

### Using cURL

```bash
# Get scores
curl http://localhost:3000/api/scores

# Update Team A
curl -X PUT http://localhost:3000/api/scores/teamA \
  -H "Content-Type: application/json" \
  -d '{"score": 10}'

# Update Team B
curl -X PUT http://localhost:3000/api/scores/teamB \
  -H "Content-Type: application/json" \
  -d '{"score": 8}'

# Reset scores
curl -X POST http://localhost:3000/api/scores/reset
```

### Using Postman
1. Create a new collection
2. Add GET request to `http://localhost:3000/api/scores`
3. Add PUT requests to `/teamA` and `/teamB` with JSON body
4. Add POST request to `/reset`

---

## Input Validation

All backends should implement:

1. **Score Validation**
   - Must be a non-negative integer
   - Should have a reasonable max (e.g., 999)

2. **Content-Type Validation**
   - Reject requests without `Content-Type: application/json`

3. **Error Handling**
   - Return appropriate HTTP status codes
   - Include error messages in response body

**Example Validation:**
```typescript
function validateScore(score: any): boolean {
  return (
    typeof score === 'number' &&
    Number.isInteger(score) &&
    score >= 0 &&
    score <= 999
  )
}
```

---

## Deployment

### Development
```bash
npm install
npm run dev
```

### Production
```bash
npm install
npm run build
npm start
```

### Docker Example
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Monitoring and Logging

Implement basic logging for debugging:

```typescript
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})
```

---

## Summary

| Aspect | Details |
|--------|---------|
| **Base URL** | `http://localhost:3000/api` |
| **Endpoints** | 4 (GET scores, PUT teamA, PUT teamB, POST reset) |
| **Content-Type** | `application/json` |
| **Response Format** | `{ teamA: number, teamB: number }` |
| **Validation** | Score must be >= 0 |
| **CORS** | Required for frontend access |
| **Storage** | In-memory (dev) or database (prod) |

Choose any technology stack you're comfortable with—the API specification remains the same!
