import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// כל השיעורים (בלי התוכן המלא, לרשימה)
app.get("/api/lessons", (req, res) => {
  const lessons = db
    .prepare("SELECT id, title, summary, completed FROM lessons")
    .all();
  res.json(lessons);
});

// שיעור בודד
app.get("/api/lessons/:id", (req, res) => {
  const lesson = db
    .prepare("SELECT * FROM lessons WHERE id = ?")
    .get(req.params.id);

  if (!lesson) {
    return res.status(404).json({ error: "השיעור לא נמצא" });
  }
  res.json(lesson);
});

// סימון שיעור כהושלם או לא הושלם
app.patch("/api/lessons/:id/complete", (req, res) => {
  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    return res.status(400).json({ error: "completed חייב להיות true או false" });
  }

  const result = db
    .prepare("UPDATE lessons SET completed = ? WHERE id = ?")
    .run(completed ? 1 : 0, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "השיעור לא נמצא" });
  }
  res.json({ id: Number(req.params.id), completed });
});

// אחוז התקדמות
app.get("/api/progress", (req, res) => {
  const { total, done } = db
    .prepare("SELECT COUNT(*) AS total, SUM(completed) AS done FROM lessons")
    .get();
  const doneCount = done || 0;
  res.json({
    total,
    done: doneCount,
    percent: total ? Math.round((doneCount / total) * 100) : 0,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`השרת רץ על http://localhost:${PORT}`);
});