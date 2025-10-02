# GitHub Setup Guide

## ✅ Git Repository Initialized

Your local repository is ready with 3 organized commits:

```
1536039 - Add complete Rails API and React frontend code
20754c5 - Phase 2: Backend Core - Models & Database  
7393717 - Phase 1: Foundation Setup
```

---

## 🚀 Push to GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name:** `movie-dashboard-hackathon` (or your preferred name)
3. **Description:** "Full-stack movie dashboard built in 24h - Rails API + React + PostgreSQL + TMDB API"
4. **Visibility:** Public or Private (your choice)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

### Step 2: Configure Git User (if needed)

If you haven't set your global git config:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Or just for this repository:

```bash
cd "/Users/juandiego/Mini Hackathon Oct 2025"
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Step 3: Connect to GitHub

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values:

```bash
cd "/Users/juandiego/Mini Hackathon Oct 2025"

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git

# Verify remote was added
git remote -v
```

### Step 4: Push to GitHub

```bash
# Push main branch to GitHub
git push -u origin main

# Enter your GitHub credentials if prompted
```

---

## 📊 What's in the Repository

### Commit 1: Phase 1 - Foundation Setup
- Docker Compose configuration
- Rails API initialization
- React + Vite frontend initialization
- CORS configuration
- Dependencies and tools

### Commit 2: Phase 2 - Backend Core
- 5 database models
- Database migrations
- TMDB Service integration
- Seed data
- Documentation

### Commit 3: Complete Application Code
- All Rails controllers and routes
- All models with associations
- Complete frontend structure
- Configuration files

---

## 🔄 Future Workflow

After Phase 3 and beyond:

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Phase 3: REST API Controllers - Full CRUD implementation"

# Push to GitHub
git push

# Or push to a new branch
git checkout -b phase3
git push -u origin phase3
```

---

## 🏷️ Recommended Git Workflow for Hackathon

### Option 1: Simple (Main branch only)
```bash
# After each phase
git add .
git commit -m "Phase X: Description"
git push
```

### Option 2: Feature Branches (Safer)
```bash
# Create branch for Phase 3
git checkout -b phase3-api-controllers

# Work on Phase 3...
git add .
git commit -m "Phase 3: REST API controllers"

# Push branch
git push -u origin phase3-api-controllers

# Merge to main when ready
git checkout main
git merge phase3-api-controllers
git push
```

---

## 🔖 Tagging Phases (Optional but Recommended)

Tag each completed phase for easy rollback:

```bash
# Tag Phase 1 & 2
git tag -a v0.1-phase1-2 -m "Phase 1 & 2: Foundation and Backend Core"

# Push tag to GitHub
git push origin v0.1-phase1-2

# Later, tag Phase 3
git tag -a v0.2-phase3 -m "Phase 3: REST API Controllers"
git push origin v0.2-phase3
```

### Roll back to a tag if needed:
```bash
git checkout v0.1-phase1-2
```

---

## 🚨 Emergency Rollback

If something breaks in Phase 3:

```bash
# Option 1: See what changed
git diff main~1 main

# Option 2: Undo last commit (keep changes)
git reset --soft HEAD~1

# Option 3: Hard reset to Phase 2 (CAREFUL: loses changes)
git reset --hard 20754c5
```

---

## ✅ Verification

After pushing to GitHub, verify:

1. Go to your GitHub repository URL
2. Check all 3 commits are visible
3. Browse code to ensure all files are present
4. Check that README.md displays correctly

---

## 📝 .gitignore Summary

Already configured to ignore:
- `.env` files (sensitive data)
- `node_modules/` (frontend dependencies)
- `log/` and `tmp/` (Rails temporary files)
- `master.key` (Rails encryption key)
- IDE files (.vscode, .idea)
- OS files (.DS_Store)

---

## 🎯 Quick Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# View changes
git diff

# View remote
git remote -v

# Pull latest changes
git pull

# Push changes
git push
```

---

## 🆘 Troubleshooting

**"Authentication failed"**
- Use GitHub Personal Access Token (not password)
- Generate at: https://github.com/settings/tokens
- Use token as password when prompted

**"Remote already exists"**
```bash
git remote remove origin
git remote add origin YOUR_NEW_URL
```

**"Diverged branches"**
```bash
git pull --rebase origin main
```

---

**Repository is ready! Push to GitHub whenever you're ready to continue with Phase 3.**

