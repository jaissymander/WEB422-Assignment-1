/*********************************************************************************
 * WEB422 – Assignment 1
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Jaskirat Singh Student ID: 145562203 Date: Sept. 15, 2022
 * Cyclic Link: https://defiant-kilt-newt.cyclic.app
 *
 ********************************************************************************/

const express = require("express");
const cors = require("cors");
const app = express();

const HTTP_PORT = process.env.PORT || 3000;

const MoviesDB = require("../modules/moviesDB");
const db = new MoviesDB();

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("WEB422 Assignment-1 (Web-API)");
});

app.post("/api/movies", async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "No movie data" });
    }
    const data = await db.addNewMovie(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/movies", async (req, res) => {
  try {
    const data = await db.getAllMovies(
      req.query.page,
      req.query.perPage,
      req.query.title || null
    );
    if (data.length === 0) {
      return res.status(400).json([]);
    }
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/movies/:_id", async (req, res) => {
  try {
    const data = await db.getMovieById(req.params._id);
    if (!data) {
      return res.status(400).json({ error: "Movie not found." });
    }
    res.send(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/movie/:_id", async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "No data provided to update." });
    }
    const data = await db.updateMovieById(req.body, req.params._id);
    res.json({ success: "Movie updated!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/movies/:_id", async (req, res) => {
  try {
    const movie = await db.getMovieById(req.params._id);
    if (!movie) {
      return res.status(400).json({ error: "movie not found." });
    }
    await db.deleteMovieById(req.params._id);
    res.json({ success: `Movie - ${movie.title} deleted!` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.all("*", (req, res) => {
  res.json({ error: "End point not supported." });
});

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
