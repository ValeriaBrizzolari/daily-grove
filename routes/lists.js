import express from "express";
import db from "../database/db.js";

const router = express.Router();

async function addList(name, userId) {
  await db.query("INSERT INTO lists (name, user_id) VALUES ($1, $2)", [
    name,
    userId,
  ]);
}

async function updateListName(listId, name) {
  await db.query("UPDATE lists SET name = $1 WHERE id = $2", [name, listId]);
}

async function deleteList(listId) {
  await db.query("DELETE FROM lists WHERE id = $1", [listId]);
}

async function getUsers() {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
}

async function getUserById(id) {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

async function getListById(listId) {
  const result = await db.query("SELECT * FROM lists WHERE id = $1", [listId]);
  return result.rows[0];
}

async function getTasksByList(listId) {
  const result = await db.query(
    "SELECT * FROM tasks WHERE list_id = $1 ORDER BY id ASC",
    [listId],
  );

  return result.rows;
}

router.get("/lists/:id", async (req, res) => {
  const listId = req.params.id;

  const users = await getUsers();
  const list = await getListById(listId);
  const tasks = await getTasksByList(listId);
  const currentUser = await getUserById(list.user_id);

  res.render("tasks.ejs", {
    users,
    currentUser,
    list,
    tasks,
    pageStyle: "tasks",
  });
});

router.post("/users/:id/lists", async (req, res) => {
  const userId = req.params.id;
  const listName = req.body.name;

  await addList(listName, userId);

  res.redirect(`/users/${userId}`);
});

router.post("/lists/:id/edit", async (req, res) => {
  const listId = req.params.id;
  const name = req.body.name;

  await updateListName(listId, name);

  res.redirect(`/lists/${listId}`);
});

router.post("/lists/:id/delete", async (req, res) => {
  const listId = req.params.id;

  const result = await db.query("SELECT user_id FROM lists WHERE id = $1", [
    listId,
  ]);

  const userId = result.rows[0].user_id;

  await deleteList(listId);

  res.redirect(`/users/${userId}`);
});

export default router;
