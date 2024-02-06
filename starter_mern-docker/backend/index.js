const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");

dotenv.config();
colors.enable();

const Anim = require("./database/anim.model");
const connect = require("./database/connect");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Hello World!".rainbow);

  res.send("Hello World!");
});

app.get("/api/anime", async (req, res) => {
  const anime = await Anim.find();
  res.json(anime);
});

app.post("/api/anime", async (req, res) => {
  const anime = new Anim(req.body);
  await anime.save();
  res.json(anime);
});

// ... other imports and initialization

app.put("/api/anime/:id", async (req, res) => {
  try {
    const updatedAnime = await Anim.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
    });
    if (!updatedAnime) {
      return res.status(404).json({ message: "Anime not found" });
    }
    res.json(updatedAnime);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(500).json({ message: "Error updating anime" });
    }
  }
});

app.delete("/api/anime/:id", async (req, res) => {
  try {
    const deletedAnime = await Anim.findByIdAndDelete(req.params.id);
    if (!deletedAnime) {
      return res.status(404).json({ message: "Anime not found" });
    }
    res.json({ message: "Anime deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting anime" });
  }
});


app.listen(8000, () => {
  console.log("server listening on port 8000");

  // connect to the database
  connect();
});
