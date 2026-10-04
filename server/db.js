import Database from "better-sqlite3";

const db = new Database("guide.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    title_en TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    content_en TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
  )
`);

const count = db.prepare("SELECT COUNT(*) AS n FROM lessons").get().n;

if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO lessons (title, summary, content, title_en, summary_en, content_en)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insert.run(
    "מה זה Repository?",
    "התיקייה שבה הפרויקט שלך חי",
    "Repository (או בקיצור repo) הוא תיקיית פרויקט ש-Git עוקב אחרי השינויים בה. הוא שומר את כל ההיסטוריה של הקבצים, כך שאפשר תמיד לחזור לגרסה קודמת.",
    "What is a Repository?",
    "The folder where your project lives",
    "A repository (or repo) is a project folder that Git tracks changes in. It stores the full history of your files, so you can always go back to an earlier version."
  );
  insert.run(
    "מה זה Commit?",
    "שמירת תמונת מצב של השינויים",
    "Commit הוא שמירה של השינויים שעשית, יחד עם הודעה שמסבירה מה שונה. פקודות: git add . ואחר כך git commit -m \"הודעה\".",
    "What is a Commit?",
    "Saving a snapshot of your changes",
    "A commit saves your changes together with a message describing what changed. Commands: git add . and then git commit -m \"message\"."
  );
  insert.run(
    "Push ו-Pull",
    "העלאה והורדה של קוד מ-GitHub",
    "git push שולח את ה-commits שלך מהמחשב אל GitHub. git pull מוריד שינויים חדשים מ-GitHub אל המחשב שלך.",
    "Push and Pull",
    "Uploading and downloading code from GitHub",
    "git push sends your commits from your computer to GitHub. git pull downloads new changes from GitHub to your computer."
  );
  insert.run(
    "מה זה Branch?",
    "ענף נפרד לעבודה בלי לשבור את הקוד הראשי",
    "Branch מאפשר לעבוד על תכונה חדשה בנפרד מהקוד הראשי (main). כשמסיימים ובודקים, מאחדים אותו חזרה. פקודה: git checkout -b שם-הענף.",
    "What is a Branch?",
    "A separate line of work that doesn't break the main code",
    "A branch lets you work on a new feature separately from the main code (main). When you're done and tested, you merge it back. Command: git checkout -b branch-name."
  );
  insert.run(
    "מה זה Pull Request?",
    "בקשה לאחד את השינויים שלך לקוד הראשי",
    "Pull Request (או PR) הוא בקשה ב-GitHub לאחד ענף אחד לתוך ענף אחר. בו אחרים יכולים לסקור את הקוד, להגיב ולאשר לפני האיחוד.",
    "What is a Pull Request?",
    "A request to merge your changes into the main code",
    "A pull request (PR) is a request on GitHub to merge one branch into another. Others can review the code, comment, and approve before the merge."
  );
}

export default db;