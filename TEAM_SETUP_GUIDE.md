# UniFind — Team Setup Guide

Follow these steps in order before you start working on your module.

---

## 1. Get Git and Node.js installed

Check you have them:
```powershell
git --version
node -v
npm -v
```
If any command fails, install Git from git-scm.com and Node.js (LTS version) from nodejs.org.

---

## 2. Get added to the repo and MongoDB Atlas

Before cloning, make sure:
- You've accepted the **GitHub collaborator invite** sent to your email
- You've accepted the **MongoDB Atlas project invite** sent to your email

If you haven't received either, message the group.

---

## 3. Clone the repository

```powershell
cd D:\Projects
git clone https://github.com/Muditha-Sankalpa/campus-lost-and-found.git
cd campus-lost-and-found
```

Switch to the `dev` branch (this is our main working branch, not `main`):
```powershell
git checkout dev
git pull origin dev
```

---

## 4. Create your own MongoDB Atlas login

You don't need to create a new cluster — we're all sharing one. Just:
1. Accept the project invite email from Atlas
2. Sign in at [cloud.mongodb.com](https://cloud.mongodb.com)
3. Once you're in and can see the **UniFind** project, reply to the group with the email you used to sign up, so we can confirm your access

You will **not** need your own connection string — you'll use the shared one below.

---

## 5. Set up your `.env` file

Inside the `server` folder, create a file named exactly `.env` (no filename before the dot).

The content will be sent to you separately (never commit this file or post it in a group chat/GitHub — DB password is inside it).

It'll look like this structure:
```
PORT=5000
MONGO_URI=<will be sent to you>
JWT_SECRET=<will be sent to you>
JWT_EXPIRES_IN=7d
```

If you're working on the client too, also create `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

---

## 6. Install dependencies

**Backend:**
```powershell
cd server
npm install
npm run dev
```
Should print `MongoDB Connected` and `UniFind Server Started Successfully on port 5000`.

**Frontend:**
```powershell
cd client
npm install
npm run dev
```
Opens at `http://localhost:5173`.

Server always runs on **port 5000**, client always runs on **port 5173** — keep these consistent so the API calls work for everyone.

---

## 7. Branching rules

**Never commit directly to `main` or `dev`.** Always work in your own branch.

Branch naming format:
```
feature/<module>-<task>
```

Examples:
- `feature/auth-registration`
- `feature/items-upload-images`
- `feature/moderation-review-reports`
- `feature/admin-analytics`

Create your branch off the latest `dev`:
```powershell
git checkout dev
git pull origin dev
git checkout -b feature/your-task-name
```

---

## 8. Commit habits

- Commit **often** — after every small working change, not just at the end of the day
- Write clear messages describing what changed:
  ```powershell
  git add .
  git commit -m "Add login form validation"
  ```
- Push regularly so your work isn't sitting only on your laptop:
  ```powershell
  git push origin feature/your-task-name
  ```

---

## 9. Opening a Pull Request

Once your task (or a solid chunk of it) is working:

1. Go to the repo on GitHub
2. You'll see a banner suggesting your recently pushed branch → click **Compare & pull request**
3. Make sure the PR target is **`dev`**, not `main`
4. Add a short description of what you did
5. Submit the PR — **do not merge it yourself**

Muditha will review and merge into `dev`.

---

## 10. Before you start each work session

Always pull the latest `dev` into your branch to avoid conflicts:
```powershell
git checkout dev
git pull origin dev
git checkout feature/your-task-name
git merge dev
```

---

## Quick Reference

| Item | Value |
|---|---|
| Repo | github.com/Muditha-Sankalpa/campus-lost-and-found |
| Working branch | `dev` |
| Branch format | `feature/<module>-<task>` |
| Server port | 5000 |
| Client port | 5173 |
| PR target | `dev` (never `main`) |
| Who merges PRs | Muditha |

## Rules Recap

1. Clone the repo, checkout `dev`
2. Create your own `feature/...` branch off `dev`
3. Never commit directly to `dev` or `main`
4. Commit small and often, with clear messages
5. Push your branch, open a PR into `dev`
6. Wait for review/merge — don't merge your own PR
7. Create your Atlas login and send your sign-up email
8. Create `.env` in `server` (and `client` if needed) using the values sent to you separately
9. Keep server on port 5000, client on port 5173