import express from "express";
import db from "../database/db.js";

const router = express.Router();

async function addTask(title, listId) {
  await db.query("INSERT INTO tasks (title, list_id) VALUES ($1, $2)", [
    title,
    listId,
  ]);
}

async function deleteTask(taskId) {
  await db.query("DELETE FROM tasks WHERE id = $1", [taskId]);
}
async function toggleTaskComplete(taskId) {
  await db.query("UPDATE tasks SET completed = NOT completed WHERE id = $1", [
    taskId,
  ]);
}

async function getTaskById(taskId) {
  const result = await db.query("SELECT * FROM tasks WHERE id = $1", [taskId]);
  return result.rows[0];
}

async function updateTaskTitle(taskId, title) {
  await db.query("UPDATE tasks SET title = $1 WHERE id = $2", [title, taskId]);
}
router.post("/lists/:id/tasks", async (req, res) => {
  const listId = req.params.id;
  const title = req.body.title;

  await addTask(title, listId);

  res.redirect(`/lists/${listId}`);
});
router.post("/tasks/:id/toggle", async (req, res) => {
  const taskId = req.params.id;
  const listId = req.body.listId;

  await toggleTaskComplete(taskId);

  res.redirect(`/lists/${listId}`);
});

router.post("/tasks/:id/edit", async (req, res) => {
  const taskId = req.params.id;
  const title = req.body.title;
  const listId = req.body.listId;

  await updateTaskTitle(taskId, title);

  res.redirect(`/lists/${listId}`);
});

router.post("/tasks/:id/delete", async (req, res) => {
  const taskId = req.params.id;
  const listId = req.body.listId;

  await deleteTask(taskId);

  res.redirect(`/lists/${listId}`);
});

export default router;
