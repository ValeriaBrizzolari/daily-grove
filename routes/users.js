import express from "express";
import db from "../database/db.js";

const router = express.Router();

async function getUsers() {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
}
async function getUserById(id) {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);

  return result.rows[0];
}

async function getListsByUser(userId) {
  const result = await db.query("SELECT * FROM lists WHERE user_id = $1", [
    userId,
  ]);
  return result.rows;
}

async function addUser(name, avatarUrl) {
  await db.query("INSERT INTO users (name, avatar_url) VALUES ($1, $2)", [
    name,
    avatarUrl,
  ]);
}

router.get("/users/new", async (req, res) => {
  const users = await getUsers();

  res.render("new-user.ejs", {
    users,
    currentUser: null,
    pageStyle: "dashboard",
  });
});

router.get("/users/:id/edit", async (req, res) => {
  const users = await getUsers();
  const user = await getUserById(req.params.id);

  res.render("new-user.ejs", {
    users,
    currentUser: user,
    user,
    pageStyle: "dashboard",
    isEditing: true,
  });
});

router.post("/users/:id/edit", async (req, res) => {
  const userId = req.params.id;
  const name = req.body.name;
  const avatarSeed = req.body.avatarSeed;

  const avatarUrl = `https://api.dicebear.com/9.x/lorelei/svg?seed=${avatarSeed}`;

  await db.query("UPDATE users SET name = $1, avatar_url = $2 WHERE id = $3", [
    name,
    avatarUrl,
    userId,
  ]);

  res.redirect(`/users/${userId}`);
});

router.get("/users/:id", async (req, res) => {
  const userId = req.params.id;

  const users = await getUsers();
  const currentUser = await getUserById(userId);
  const lists = await getListsByUser(userId);

  res.render("lists.ejs", {
    users,
    currentUser,
    lists,
    pageStyle: "dashboard",
  });
});

router.post("/users", async (req, res) => {
  const name = req.body.name;
  const avatarSeed = req.body.avatarSeed;

  const avatarUrl = `https://api.dicebear.com/9.x/lorelei/svg?seed=${avatarSeed}`;

  try {
    await addUser(name, avatarUrl);
    res.redirect("/");
  } catch (error) {
    if (error.code === "23505") {
      const users = await getUsers();

      res.render("new-user.ejs", {
        users,
        currentUser: null,
        pageStyle: "dashboard",
        error: "That name already exists. Try another one.",
      });
    } else {
      console.log(error);
      res.redirect("/users/new");
    }
  }
});

router.post("/users/:id/delete", async (req, res) => {
  const userId = req.params.id;

  await db.query("DELETE FROM users WHERE id = $1", [userId]);

  res.redirect("/");
});

export default router;
