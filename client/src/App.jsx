import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:3000/api";

const TEXT = {
  he: {
    dir: "rtl",
    title: "GitHub למתחילים",
    progress: (done, total, percent) =>
      `${done} מתוך ${total} שיעורים (${percent}%)`,
    back: "→ חזרה לרשימה",
    markDone: "סימון כהושלם",
    unmark: "ביטול סימון ✓",
    switchTo: "English",
  },
  en: {
    dir: "ltr",
    title: "GitHub for Beginners",
    progress: (done, total, percent) =>
      `${done} of ${total} lessons (${percent}%)`,
    back: "← Back to lessons",
    markDone: "Mark as completed",
    unmark: "Unmark ✓",
    switchTo: "עברית",
  },
};

export default function App() {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "he");
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({ total: 0, done: 0, percent: 0 });
  const [selected, setSelected] = useState(null);

  const t = TEXT[lang];

  async function loadData() {
    const [lessonsRes, progressRes] = await Promise.all([
      fetch(`${API}/lessons?lang=${lang}`),
      fetch(`${API}/progress`),
    ]);
    setLessons(await lessonsRes.json());
    setProgress(await progressRes.json());
  }

  async function openLesson(id) {
    const res = await fetch(`${API}/lessons/${id}?lang=${lang}`);
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

  // בכל החלפת שפה: שומרים את הבחירה, וטוענים מחדש את התוכן בשפה החדשה
  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    loadData();
    if (selected) openLesson(selected.id);
  }, [lang]);

  return (
    <div className="app" dir={t.dir}>
      <button onClick={() => setLang(lang === "he" ? "en" : "he")}>
        {t.switchTo}
      </button>

      <h1>{t.title}</h1>

      <div className="progress">
        <div className="progress-bar" style={{ width: `${progress.percent}%` }} />
      </div>
      <p>{t.progress(progress.done, progress.total, progress.percent)}</p>

      {selected ? (
        <div className="card">
          <button onClick={() => setSelected(null)}>{t.back}</button>
          <h2>{selected.title}</h2>
          <p>{selected.content}</p>
          <button onClick={() => toggleComplete(selected)}>
            {selected.completed ? t.unmark : t.markDone}
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