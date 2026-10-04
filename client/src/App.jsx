import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:3000/api";

export default function App() {
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({ total: 0, done: 0, percent: 0 });
  const [selected, setSelected] = useState(null);

  async function loadData() {
    const [lessonsRes, progressRes] = await Promise.all([
      fetch(`${API}/lessons`),
      fetch(`${API}/progress`),
    ]);
    setLessons(await lessonsRes.json());
    setProgress(await progressRes.json());
  }

  useEffect(() => {
    loadData();
  }, []);

  async function openLesson(id) {
    const res = await fetch(`${API}/lessons/${id}`);
    setSelected(await res.json());
  }

  async function toggleComplete(lesson) {
    const newValue = !lesson.completed;
    await fetch(`${API}/lessons/${lesson.id}/complete`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: newValue }),
    });
    setSelected((s) => (s ? { ...s, completed: newValue ? 1 : 0 } : s));
    loadData();
  }

  return (
    <div className="app" dir="rtl">
      <h1>GitHub למתחילים</h1>

      <div className="progress">
        <div className="progress-bar" style={{ width: `${progress.percent}%` }} />
      </div>
      <p>
        {progress.done} מתוך {progress.total} שיעורים ({progress.percent}%)
      </p>

      {selected ? (
        <div className="card">
          <button onClick={() => setSelected(null)}>← חזרה לרשימה</button>
          <h2>{selected.title}</h2>
          <p>{selected.content}</p>
          <button onClick={() => toggleComplete(selected)}>
            {selected.completed ? "בטלי סימון ✓" : "סמני כהושלם"}
          </button>
        </div>
      ) : (
        <ul className="lessons">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="card" onClick={() => openLesson(lesson.id)}>
              <h3>
                {lesson.completed ? "✅ " : ""}
                {lesson.title}
              </h3>
              <p>{lesson.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}