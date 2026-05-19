const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Your full GNews API key
const GNEWS_API_KEY = "4034aa889b6c84c246e90e2469f0dad6";

app.get("/api/news", async (req, res) => {
  try {
    const country = req.query.country || "India";
    const category = req.query.category || "all";

    const searchQuery =
      category && category !== "all"
        ? `${country} ${category}`
        : country;

    const url =
      "https://gnews.io/api/v4/search?" +
      `q=${encodeURIComponent(searchQuery)}` +
      "&lang=en" +
      "&max=10" +
      `&apikey=${encodeURIComponent(GNEWS_API_KEY)}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log("GNews status:", response.status);
    console.log("Search query:", searchQuery);
    console.log("GNews response:", data);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "GNews API error",
        status: response.status,
        details: data
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Server fetch failed:", error);

    res.status(500).json({
      error: "Server fetch failed",
      details: error.message
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});