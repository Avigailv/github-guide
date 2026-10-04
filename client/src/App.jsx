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
    quiz: "חידון",
    right: "נכון! ✅",
    wrong: "לא נכון ❌",
    score: (s, n) => `הציון שלך: ${s} מתוך ${n}`,
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
    quiz: "Quiz",
    right: "Correct! ✅",
    wrong: "Not quite ❌",
    score: (s, n) => `Your score: ${s} of ${n}`,
  },
};

export default function App() {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "he");
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({ total: 0, done: 0, percent: 0 });
  const [selected, setSelected] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});

  const t = TEXT[lang];

  async function loadData() {
    const [lessonsRes, progressRes] = await Promise.all([
      fetch(`${API}/lessons?lang=${lang}`),
      fetch(`${API}/progress`),
    ]);
    setLessons(await lessonsRes.json());
    setProgress(await progressRes.json());
  }

  // keepAnswers=true בהחלפת שפה, כדי לא לאבד תשובות שכבר נבחרו
  async function openLesson(id, keepAnswers = false) {
    const [lessonRes, quizRes] = await Promise.all([
      fetch(`${API}/lessons/${id}?lang=${lang}`),
      fetch(`${API}/lessons/${id}/quiz?lang=${lang}`),
    ]);
    setSelected(await lessonRes.json());
    setQuiz(await quizRes.json());
    if (!keepAnswers) setAnswers({});
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

  async function answer(questionId, choice) {
    if (answers[questionId]) return;
    const res = await fetch(`${API}/questions/${questionId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choice }),
    });
    const data = await res.json();
    setAnswers((a) => ({ ...a, [questionId]: { choice, ...data } }));
  }

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    loadData();
    if (selected) openLesson(selected.id, true);
  }, [lang]);

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter((a) => a.correct).length;

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

          {quiz.length > 0 && (
            <div className="quiz">
              <h3>{t.quiz}</h3>
              {quiz.map((q, qi) => {
                const a = answers[q.id];
                return (
                  <div key={q.id} className="question">
                    <p>
                      <strong>
                        {qi + 1}. {q.question}
                      </strong>
                    </p>
                    {q.options.map((opt, i) => {
                      let cls = "option";
                      if (a) {
                        if (i === a.correctIndex) cls += " correct";
                        else if (i === a.choice) cls += " wrong";
                      }
                      return (
                        <button
                          key={i}
                          className={cls}
                          disabled={!!a}
                          onClick={() => answer(q.id, i)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                    {a && <p>{a.correct ? t.right : t.wrong}</p>}
                  </div>
                );
              })}
              {answeredCount === quiz.length && (
                <p>
                  <strong>{t.score(correctCount, quiz.length)}</strong>
                </p>
              )}
            </div>
          )}

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