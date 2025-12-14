# Railway Deployment Guide

## Pre-Deployment Checklist

### 1. Handle Images (Choose One)

**Option A: Use Existing Images Only (Simplest)**
- Keep images in `/public/app_portfolio/`
- Commit them to git
- Don't use image upload in production
- Manage projects metadata only via admin

**Option B: Add Cloudinary (Full Upload Support)**
```bash
npm install cloudinary
```
Then update `/app/api/upload/route.ts` to use Cloudinary instead of file system.

### 2. Environment Variables

You'll need to set these on Railway:

**Required:**
```
ADMIN_PASSWORD=YourSecurePasswordHere
NEXTAUTH_SECRET=generate-a-long-random-string-here
NEXTAUTH_URL=https://your-app.up.railway.app
```

**Optional (for AI features):**
```
OLLAMA_URL=your-ollama-server-url
OLLAMA_MODEL=llama3.2
```
*(Leave blank to disable AI in production)*

### 3. Generate Secure Secrets

```bash
# Generate a secure NEXTAUTH_SECRET
openssl rand -base64 32

# Or use this Node.js one-liner
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Deployment Steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 2. Deploy to Railway

1. Go to https://railway.app
2. Sign up / Log in
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Next.js and deploy

### 3. Set Environment Variables

In Railway dashboard:
1. Go to your project
2. Click "Variables" tab
3. Add each environment variable:
   - `ADMIN_PASSWORD`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (will be `https://your-app-name.up.railway.app`)

### 4. Get Your URL

Railway will assign you a URL like: `https://your-app-name.up.railway.app`

Update `NEXTAUTH_URL` to match this URL.

### 5. Access Admin Panel

Visit: `https://your-app-name.up.railway.app/admin/login`

## Data Persistence

**Important:** The `/data/projects.json` file will persist on Railway!

Railway volumes are persistent, so your JSON database will survive redeploads.

However, `/public/uploads/` is NOT persistent - uploaded files will be lost on redeploy.

## Custom Domain (Optional)

In Railway:
1. Go to Settings → Domains
2. Click "Add Domain"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` to your custom domain

## Monitoring

Railway provides:
- Deployment logs
- Runtime logs
- Metrics dashboard
- Automatic HTTPS
- Auto-deploy on git push

## Cost

Railway pricing:
- Free tier: $5 credit/month (enough for small portfolio)
- Pro: $20/month (includes $5 credit)
- Pay per usage after credit

Your simple Next.js portfolio should stay within free tier!

## Troubleshooting

### Build Fails
Check Railway logs. Common issues:
- Missing dependencies in package.json
- Environment variables not set

### Admin Login Not Working
- Check NEXTAUTH_URL matches your Railway domain exactly
- Check NEXTAUTH_SECRET is set
- Check ADMIN_PASSWORD is set

### AI Features Not Working
- Expected! Set OLLAMA_URL if you have a hosted instance
- Or just use AI locally during development

## Alternative: Vercel Deployment

Vercel is even easier:
1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

Vercel free tier is perfect for portfolios!

## Recommended Setup

For your portfolio:
- **Hosting**: Railway or Vercel (both free tier)
- **Images**: Git-committed (no uploads in production)
- **AI**: Disabled in production (use locally)
- **Database**: JSON file (works great for portfolios)

This keeps it simple, free, and maintainable!
