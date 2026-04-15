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

`POST /generate-image`

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

## Free content generation API

This project also supports free text/content generation using Pollinations OpenAI-compatible text API.

### Generate content

`POST /generate-content`

Request body:

```json
{
	"prompt": "Write a short product description for an AI note-taking app",
	"model": "openai",
	"seed": 42
}
```

Example with curl:

```bash
curl -X POST http://localhost:8080/generate-content \
	-H "Content-Type: application/json" \
	-d '{"prompt":"Write a short welcome email for new users"}'
```

Response:

```json
{
	"provider": "pollinations",
	"prompt": "Write a short welcome email for new users",
	"model": "default",
	"content": "...generated text..."
}
```

## Free video generation API

This project supports free video generation using HuggingFace Inference. No API key required for free tier (returns interactive link).

### Generate video

`POST /generate-video`

Request body:

```json
{
	"prompt": "A robot dancing in space with neon lights",
	"duration": 3
}
```

Example with curl:

```bash
curl -X POST http://localhost:8080/generate-video \
	-H "Content-Type: application/json" \
	-d '{"prompt":"A cat astronaut on the moon","duration":3}'
```

Response (without API key - free tier):

```json
{
	"message": "Using free video inference endpoint (no HF token needed)",
	"provider": "huggingface-inference",
	"prompt": "A cat astronaut on the moon",
	"duration": 3,
	"videoUrl": "https://huggingface.co/spaces/AnoopKunchukuttan/AnimateDiff-Lightning?prompt=A%20cat%20astronaut%20on%20the%20moon&duration=3",
	"note": "This returns an interactive link. For API-based generation, provide HUGGINGFACE_API_KEY in .env"
}
```

### Optional: Enable API-based video generation

Add your HuggingFace API token to `.env`:

```bash
HUGGINGFACE_API_KEY=hf_your_token_here
```

This enables direct video file generation (base64 encoded MP4).
