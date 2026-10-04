import Database from "better-sqlite3";

const db = new Database("guide.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
  )
`);

// מוסיף שיעורים התחלתיים רק אם הטבלה ריקה
const count = db.prepare("SELECT COUNT(*) AS n FROM lessons").get().n;

if (count === 0) {
  const insert = db.prepare(
    "INSERT INTO lessons (title, summary, content) VALUES (?, ?, ?)"
  );

  insert.run(
    "מה זה Repository?",
    "התיקייה שבה הפרויקט שלך חי",
    "Repository (או בקיצור repo) הוא תיקיית פרויקט ש-Git עוקב אחרי השינויים בה. הוא שומר את כל ההיסטוריה של הקבצים, כך שאפשר תמיד לחזור לגרסה קודמת."
  );
  insert.run(
    "מה זה Commit?",
    "שמירת תמונת מצב של השינויים",
    "Commit הוא שמירה של השינויים שעשית, יחד עם הודעה שמסבירה מה שונה. פקודות: git add . ואחר כך git commit -m \"הודעה\"."
  );
  insert.run(
    "Push ו-Pull",
    "העלאה והורדה של קוד מ-GitHub",
    "git push שולח את ה-commits שלך מהמחשב אל GitHub. git pull מוריד שינויים חדשים מ-GitHub אל המחשב שלך."
  );
  insert.run(
    "מה זה Branch?",
    "ענף נפרד לעבודה בלי לשבור את הקוד הראשי",
    "Branch מאפשר לעבוד על תכונה חדשה בנפרד מהקוד הראשי (main). כשמסיימים ובודקים, מאחדים אותו חזרה. פקודה: git checkout -b שם-הענף."
  );
  insert.run(
    "מה זה Pull Request?",
    "בקשה לאחד את השינויים שלך לקוד הראשי",
    "Pull Request (או PR) הוא בקשה ב-GitHub לאחד ענף אחד לתוך ענף אחר. בו אחרים יכולים לסקור את הקוד, להגיב ולאשר לפני האיחוד."
  );
}

export default db;