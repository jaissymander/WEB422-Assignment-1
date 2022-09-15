/*********************************************************************************
 * WEB422 – Assignment 1
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Jaskirat Singh Student ID: 145562203 Date: Sept. 15, 2022
 * Cyclic Link: _______________________________________________________________
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

app.post("/api/movies", async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: "No movie data" });
    }
    const data = await db.addNewMovie(req.body);
    res.status(201).send(data);
  } catch (error) {
    res.status(400).send({ error: error.message });
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
      return res.status(204).send();
    }
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get("/api/movies/:_id", async (req, res) => {
  try {
    const data = await db.getMovieById(req.params._id);
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.put("/api/movie/:_id", async (req, res) => {
  try {
    await db.updateMovieById(req.body, req.params._id);
    res.send("Movie updated!");
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.delete("/api/movies/:_id", async (req, res) => {
  try {
    await db.deleteMovieById(req.params._id);
    res.send("Movie deleted!");
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
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
