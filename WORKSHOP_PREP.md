# Before the Workshop — Setup Checklist

You'll be cloning a real codebase and building on top of it using AI. Get this done before you arrive.

---

### Install these tools

- [ ] **Node.js v18+** — https://nodejs.org (pick LTS)
  - Verify: run `node --version` in your terminal — should say v18 or higher
- [ ] **Git** — https://git-scm.com/downloads
  - Verify: run `git --version`
- [ ] **Cursor** (AI code editor) — https://cursor.com
- [ ] **GitHub account** — https://github.com

---

### Get the app running

- [ ] Clone the repo:
  ```
  git clone https://github.com/trimble-immersion/case-study.git
  ```
- [ ] Install dependencies:
  ```
  cd case-study && npm install
  ```
- [ ] Start the app:
  ```
  npm run dev
  ```
- [ ] Open **http://localhost:3000** — you should see the Corestone CMS dashboard

---

### Open it in Cursor

- [ ] Open Cursor → File → Open Folder → select the `case-study` folder
- [ ] Wait ~1 min for Cursor to index the project
- [ ] Try it: open any file, highlight some code, press `Ctrl+K` / `Cmd+K`, and describe a change

---

**Stuck?** Bring the error message to the session — we'll fix it at the start.
