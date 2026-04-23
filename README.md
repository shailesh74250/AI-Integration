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

## Free image effects API

This project also supports image post-processing with Sharp. This is useful for blur, grayscale, sharpening, tinting, resizing, brightness changes, and simple background color replacement for transparent images.

### Apply image effects

`POST /image-effects`

Request body:

```json
{
	"imageUrl": "https://image.pollinations.ai/prompt/astronaut%20cat?width=512&height=512",
	"blur": 6,
	"grayscale": false,
	"sharpen": true,
	"brightness": 1.1,
	"tint": "#7dd3fc",
	"backgroundColor": "#ffffff",
	"width": 512,
	"height": 512,
	"format": "jpeg",
	"quality": 90
}
```

Example with curl:

```bash
curl -X POST http://localhost:8080/image-effects \
	-H "Content-Type: application/json" \
	-d '{"imageUrl":"https://image.pollinations.ai/prompt/city%20skyline?width=512&height=512","blur":8,"format":"jpeg"}' \
	--output blurred-image.jpg
```

Example for simple background color change on transparent images:

```bash
curl -X POST http://localhost:8080/image-effects \
	-H "Content-Type: application/json" \
	-d '{"imageUrl":"https://example.com/logo.png","backgroundColor":"#f8fafc","format":"png"}' \
	--output image-with-background.png
```

Notes:

- `backgroundColor` only affects transparent areas. It does not do AI background removal.
- Response is binary image data, not JSON.
- Supported output formats are `jpeg`, `png`, and `webp`.
