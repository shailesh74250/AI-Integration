require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const DEFAULT_WIDTH = 512;
const DEFAULT_HEIGHT = 512;
const DEFAULT_VIDEO_DURATION = 3;
const POLLINATIONS_BASE_URL = "https://image.pollinations.ai/prompt";
const POLLINATIONS_TEXT_BASE_URL = "https://text.pollinations.ai/openai";
const HUGGINGFACE_VIDEO_MODEL = "ByteDance/AnimateDiff-Lightning";

app.use(bodyParser.json());
app.use(cors());

app.post("/generate-image", async (req, res) => {
  const { prompt, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, seed } = req.body;

  if (!prompt) {
    return res.status(400).send("Prompt is required");
  }

  const parsedWidth = Number(width);
  const parsedHeight = Number(height);

  if (
    !Number.isInteger(parsedWidth) ||
    !Number.isInteger(parsedHeight) ||
    parsedWidth <= 0 ||
    parsedHeight <= 0
  ) {
    return res
      .status(400)
      .json({ error: "width and height must be positive integers" });
  }

  try {
    const params = new URLSearchParams({
      width: String(parsedWidth),
      height: String(parsedHeight),
      nologo: "true",
    });

    if (seed !== undefined && seed !== null && String(seed).trim() !== "") {
      params.set("seed", String(seed));
    }

    const imageUrl = `${POLLINATIONS_BASE_URL}/${encodeURIComponent(
      prompt
    )}?${params.toString()}`;

    return res.json({
      provider: "pollinations",
      imageUrl,
      prompt,
      width: parsedWidth,
      height: parsedHeight,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/generate-content", async (req, res) => {
  const { prompt, model = "openai", seed } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const payload = {
      model: String(model),
      messages: [{ role: "user", content: String(prompt) }],
    };

    if (seed !== undefined && seed !== null && String(seed).trim() !== "") {
      payload.seed = Number(seed);
    }

    const response = await fetch(`${POLLINATIONS_TEXT_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Failed to generate content",
        details: `Upstream status ${response.status}`,
      });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({
        error: "No content returned from provider",
      });
    }

    return res.json({
      provider: "pollinations",
      prompt,
      model: String(model),
      content,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/generate-video", async (req, res) => {
  const { prompt, duration = DEFAULT_VIDEO_DURATION } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const parsedDuration = Number(duration);

  if (!Number.isInteger(parsedDuration) || parsedDuration <= 0 || parsedDuration > 10) {
    return res.status(400).json({
      error: "duration must be an integer between 1 and 10 seconds",
    });
  }

  try {
    const hfToken = process.env.HUGGINGFACE_API_KEY;

    if (!hfToken) {
      return res.status(200).json({
        message: "Video generation link (free - no API key needed)",
        provider: "huggingface-inference",
        prompt,
        duration: parsedDuration,
        videoUrl: `https://huggingface.co/spaces/AnoopKunchukuttan/AnimateDiff-Lightning?prompt=${encodeURIComponent(prompt)}&duration=${parsedDuration}`,
        note: "Click the videoUrl link to generate and download video. For direct API generation, optionally add HUGGINGFACE_API_KEY to .env",
      });
    }

    const payload = {
      inputs: {
        prompt: String(prompt),
        num_frames: Math.min(24 * parsedDuration, 120),
        height: 512,
        width: 512,
        guidance_scale: 7.5,
      },
    };

    const hfResponse = await fetch(
      `https://api-inference.huggingface.co/models/${HUGGINGFACE_VIDEO_MODEL}`,
      {
        headers: { Authorization: `Bearer ${hfToken}` },
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    if (!hfResponse.ok) {
      return res.status(hfResponse.status).json({
        error: "Failed to generate video",
        details: `HuggingFace API returned ${hfResponse.status}`,
      });
    }

    const videoBuffer = await hfResponse.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString("base64");

    return res.json({
      provider: "huggingface",
      prompt,
      duration: parsedDuration,
      videoBase64: `data:video/mp4;base64,${videoBase64.substring(0, 100)}...`,
      note: "Base64 truncated for response. Use the videoBase64 field as data URL in <video> tag.",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "AI Integration server is running",
    endpoints: [
      "POST /generate-image",
      "POST /generate-content",
      "POST /generate-video",
    ],
    provider: "free (pollinations + huggingface)",
  });
});

app.listen(8080, () => {
  console.log("server started");
});