# AWS Amplify Troubleshooting Guide

## Build Error: npm ci requires package-lock.json

### Problem
```
npm error The `npm ci` command can only install with an existing package-lock.json
```

### Solution

You have **3 options**:

#### Option 1: Use Updated amplify.yml (Recommended)
The `amplify.yml` has been updated to use `npm install` instead of `npm ci`.

Just commit and push:
```bash
git add amplify.yml
git commit -m "Fix: Use npm install for Amplify build"
git push origin main
```

#### Option 2: Generate and Commit package-lock.json
If you prefer using `npm ci` (faster, more reliable):

```bash
# Generate package-lock.json
npm install

# Commit it
git add package-lock.json
git commit -m "Add package-lock.json for Amplify"
git push origin main
```

Then update `amplify.yml` back to use `npm ci`:
```yaml
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
```

#### Option 3: Use Simplified Build (No Dependencies)
If you don't need to install npm dependencies (your static site is pre-built):

**Use `amplify-simple.yml`:**

1. Copy the simplified config:
   ```bash
   cp amplify-simple.yml amplify.yml
   git add amplify.yml
   git commit -m "Use simplified Amplify config"
   git push origin main
   ```

2. Or update your Amplify Console build settings to use this configuration:
   ```yaml
   version: 1
   frontend:
     phases:
       build:
         commands:
           - mkdir -p public
           - cp -r assets public/ || true
           - cp *.html public/ || true
           - cp *.css public/ || true
     artifacts:
       baseDirectory: public
       files:
         - '**/*'
   ```

---

## Other Common Build Errors

### Error: "No such file or directory" for assets

**Problem**: Build can't find `assets` directory

**Solution**: Assets might already be in `public/`. Update amplify.yml:
```yaml
build:
  commands:
    - echo "Files already in public directory"
    - ls -la public/
```

### Error: Build timeout

**Problem**: Build takes longer than 5 minutes

**Solution**: In Amplify Console:
1. Go to App settings → Build settings
2. Increase build timeout to 15 or 30 minutes

### Error: Memory limit exceeded

**Problem**: Build runs out of memory

**Solution**: In Amplify Console:
1. Go to App settings → Build settings  
2. Increase build compute to larger size

---

## Deployment Strategies

### Strategy 1: Pre-built Public Folder (Simplest)
If your `public/` folder already has all files:

**amplify.yml:**
```yaml
version: 1
frontend:
  artifacts:
    baseDirectory: public
    files:
      - '**/*'
```

Commit the `public/` folder:
```bash
git add public/
git commit -m "Add pre-built public folder"
git push
```

### Strategy 2: Build During Deployment
If you need to copy files during build:

**amplify.yml:**
```yaml
version: 1
frontend:
  phases:
    build:
      commands:
        - mkdir -p public
        - cp -r assets public/
        - cp *.html public/
        - cp *.css public/
  artifacts:
    baseDirectory: public
    files:
      - '**/*'
```

Don't commit `public/` folder:
```bash
echo "public/" >> .gitignore
git add .gitignore
git commit -m "Ignore public folder"
git push
```

---

## Quick Fix: Current Error

For your current error, do this:

```bash
# 1. Update amplify.yml (already done)
git add amplify.yml

# 2. Commit the change
git commit -m "Fix: Use npm install instead of npm ci"

# 3. Push to trigger rebuild
git push origin main
```

Then monitor the build in Amplify Console. It should succeed now.

---

## Verify Your Setup

Before pushing, test locally:

```bash
# Test the build commands locally
mkdir -p public
cp -r assets public/ || echo "No assets"
cp *.html public/ || echo "No HTML"
cp *.css public/ || echo "No CSS"

# Check if files are there
ls -R public/

# If everything looks good, commit and push
```

---

## Still Having Issues?

### Check Amplify Build Logs

1. Go to Amplify Console
2. Click on your app
3. Click on the failed build
4. Review the full logs
5. Look for the specific error

### Common Issues Checklist

- [ ] `amplify.yml` is in the root directory
- [ ] `amplify.yml` syntax is valid (no tabs, proper indentation)
- [ ] Files exist in the expected locations
- [ ] Git repository is properly connected
- [ ] Branch is correct (main/master)
- [ ] Files are committed and pushed

### Get Help

1. Check the [full error logs](#check-amplify-build-logs)
2. Review [AMPLIFY_DEPLOYMENT.md](./AMPLIFY_DEPLOYMENT.md)
3. Post in AWS Forums with:
   - Full build log
   - Your `amplify.yml` content
   - Repository structure (`tree -L 2`)

---

## Working amplify.yml Examples

### Example 1: Simple Static Site (No Build)
```yaml
version: 1
frontend:
  artifacts:
    baseDirectory: public
    files:
      - '**/*'
```

### Example 2: Copy Files During Build
```yaml
version: 1
frontend:
  phases:
    build:
      commands:
        - mkdir -p public
        - cp -r assets public/
        - cp *.html public/
        - cp *.css public/
  artifacts:
    baseDirectory: public
    files:
      - '**/*'
```

### Example 3: With NPM Dependencies
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: public
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

## Next Steps After Fixing

Once your Amplify build succeeds:

1. ✅ Verify the site loads at the Amplify URL
2. ✅ Check that all assets load (images, CSS)
3. ⚠️ Remember: APIs need to be deployed separately (Lambda + API Gateway)
4. ⚠️ Update API URLs in your HTML files with API Gateway endpoints

See [QUICK_START.md](./QUICK_START.md) for API deployment steps.

---

**Last Updated**: October 2025

