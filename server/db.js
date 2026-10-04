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

db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    question_en TEXT NOT NULL,
    options_en TEXT NOT NULL,
    correct INTEGER NOT NULL,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
  )
`);

const qCount = db.prepare("SELECT COUNT(*) AS n FROM questions").get().n;

if (qCount === 0) {
  const insertQ = db.prepare(`
    INSERT INTO questions (lesson_id, question, options, question_en, options_en, correct)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // correct = המיקום של התשובה הנכונה (מתחיל מ-0)
  const add = (lessonId, q, opts, qEn, optsEn, correct) =>
    insertQ.run(lessonId, q, JSON.stringify(opts), qEn, JSON.stringify(optsEn), correct);

  // שיעור 1: Repository
  add(1, "מה Repository שומר?",
    ["רק את הקוד האחרון", "את כל ההיסטוריה של הקבצים", "רק תמונות", "סיסמאות"],
    "What does a repository store?",
    ["Only the latest code", "The full history of the files", "Only images", "Passwords"], 1);
  add(1, "איזה מהמשפטים מתאר הכי טוב repository?",
    ["תוכנה לעריכת תמונות", "שרת מייל", "תיקיית פרויקט ש-Git עוקב אחרי השינויים בה", "סוג של מקלדת"],
    "Which sentence best describes a repository?",
    ["Photo editing software", "A mail server", "A project folder that Git tracks changes in", "A type of keyboard"], 2);

  // שיעור 2: Commit
  add(2, "איזו פקודה שומרת את השינויים ב-commit?",
    ["git send", "git commit", "git open", "git erase"],
    "Which command saves your changes as a commit?",
    ["git send", "git commit", "git open", "git erase"], 1);
  add(2, "איזו פקודה מוסיפה את כל השינויים לפני ה-commit?",
    ["git add .", "git pull", "git clone", "git init"],
    "Which command stages all changes before the commit?",
    ["git add .", "git pull", "git clone", "git init"], 0);

  // שיעור 3: Push ו-Pull
  add(3, "איזו פקודה שולחת commits מהמחשב אל GitHub?",
    ["git pull", "git add", "git push", "git branch"],
    "Which command sends commits from your computer to GitHub?",
    ["git pull", "git add", "git push", "git branch"], 2);
  add(3, "מה עושה git pull?",
    ["מוחק את הפרויקט", "יוצר ענף חדש", "משנה שם של קובץ", "מוריד שינויים חדשים מ-GitHub אל המחשב"],
    "What does git pull do?",
    ["Deletes the project", "Creates a new branch", "Renames a file", "Downloads new changes from GitHub to your computer"], 3);

  // שיעור 4: Branch
  add(4, "למה משתמשים ב-branch?",
    ["כדי למחוק היסטוריה", "כדי לעבוד על תכונה בלי לשבור את הקוד הראשי", "כדי להצפין סיסמאות", "כדי להתקין Node.js"],
    "Why do we use a branch?",
    ["To delete history", "To work on a feature without breaking the main code", "To encrypt passwords", "To install Node.js"], 1);
  add(4, "איזו פקודה יוצרת branch חדש ועוברת אליו?",
    ["git new branch", "git push branch", "git checkout -b my-branch", "git commit branch"],
    "Which command creates a new branch and switches to it?",
    ["git new branch", "git push branch", "git checkout -b my-branch", "git commit branch"], 2);

  // שיעור 5: Pull Request
  add(5, "מה זה Pull Request?",
    ["פקודה שמוחקת repository", "בקשה לאחד ענף אחד לתוך ענף אחר", "סוג של commit", "הורדת קובץ"],
    "What is a Pull Request?",
    ["A command that deletes a repository", "A request to merge one branch into another", "A type of commit", "Downloading a file"], 1);
  add(5, "מה קורה בדרך כלל לפני שמאחדים Pull Request?",
    ["מוחקים את הקוד", "מתקינים מחדש את Git", "שולחים מייל", "אחרים סוקרים את הקוד ומאשרים"],
    "What usually happens before a Pull Request is merged?",
    ["The code is deleted", "Git is reinstalled", "An email is sent", "Others review the code and approve it"], 3);
}
export default db;