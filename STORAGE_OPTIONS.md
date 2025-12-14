# Image Storage for Production

## Current Setup (Development)
Images are stored as files in `/public/uploads/` and paths are saved in JSON.

⚠️ **This WILL NOT work on Railway** - files uploaded will be deleted on redeploy!

## Production Solutions

### Option 1: Cloudinary (Recommended - Free Tier)
1. Sign up at https://cloudinary.com (free tier: 25GB storage, 25GB bandwidth/month)
2. Get your credentials
3. Add to `.env.local`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
4. Install: `npm install cloudinary`
5. Images will be stored on Cloudinary's CDN

### Option 2: AWS S3
- More complex setup
- Cost: ~$0.023/GB/month
- Better for large-scale

### Option 3: Vercel Blob Storage
- If deploying to Vercel instead
- Easy integration
- Free tier: 500MB

### Option 4: Keep Images in Git
For a simple portfolio with few images:
- Store images in `/public/app_portfolio/`
- Commit them to git
- No uploads needed in production
- Add projects manually via admin

## Recommended for Your Portfolio

Since you have relatively few projects, I recommend **Option 4** for simplicity:
1. Keep using `/public/app_portfolio/` for images
2. Use the admin panel to add project metadata only
3. Upload images to your git repo manually
4. This is simple, free, and reliable

Or go with **Cloudinary** if you want full upload functionality in production.

Would you like me to implement Cloudinary integration?
