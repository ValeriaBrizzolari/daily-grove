import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import db from "./database/db.js";

import taskRoutes from "./routes/tasks.js";
import listRoutes from "./routes/lists.js";
import userRoutes from "./routes/users.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(taskRoutes);
app.use(listRoutes);
app.use(userRoutes);

async function getUsers() {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
}

app.get("/", async (req, res) => {
  const users = await getUsers();

  try {
    const response = await axios.get("https://dummyjson.com/quotes/random", {
      timeout: 5000,
    });

    const quote = response.data.quote;
    const author = response.data.author;

    res.render("index.ejs", {
      users,
      currentUser: null,
      quote,
      author,
      pageStyle: "dashboard",
    });
  } catch (error) {
    console.log("Quote API failed:", error.code);

    res.render("index.ejs", {
      users,
      currentUser: null,
      quote: "Small steps each day still grow a forest.",
      author: "Daily Grove",
      pageStyle: "dashboard",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
