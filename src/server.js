require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const DEFAULT_WIDTH = 512;
const DEFAULT_HEIGHT = 512;
const POLLINATIONS_BASE_URL = "https://image.pollinations.ai/prompt";

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

app.get("/", (req, res) => {
  res.json({
    message: "AI Integration server is running",
    endpoint: "POST /create",
    provider: "pollinations (free)",
  });
});

app.listen(8080, () => {
  console.log("server started");
});