# AI-Integration
Build application with help of LLM
## Model library
- https://ollama.com/search 

## Free image generation API

This project now uses Pollinations (free) for image creation. No API key is required.

### Run

```bash
npm install
npm start
```

Server runs on `http://localhost:8080`.

### Create image

`POST /create`

Request body:

```json
{
	"prompt": "futuristic city skyline at sunrise",
	"width": 512,
	"height": 512,
	"seed": 42
}
```

Example with curl:

```bash
curl -X POST http://localhost:8080/generate-image \
	-H "Content-Type: application/json" \
	-d '{"prompt":"astronaut cat painting","width":512,"height":512}'
```

Response:

```json
{
	"provider": "pollinations",
	"imageUrl": "https://image.pollinations.ai/prompt/astronaut%20cat%20painting?width=512&height=512&nologo=true",
	"prompt": "astronaut cat painting",
	"width": 512,
	"height": 512
}
```
