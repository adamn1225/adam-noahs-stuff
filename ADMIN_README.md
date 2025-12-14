# Portfolio Admin Setup

## Admin Backend Features

Your portfolio now has a full admin backend where you can:

- **Add new projects** with image uploads
- **Edit existing projects** (title, description, category, tags, images)
- **Delete projects**
- **Upload images** directly through the admin interface
- **Manage project links** (live demo and GitHub)
- **✨ AI-Powered Assistance** - Use Ollama to:
  - Generate compelling project descriptions automatically
  - Enhance existing descriptions to be more professional
  - Suggest relevant technology tags
  - Improve project titles

## Getting Started

### 1. Set Your Admin Password

Edit `.env.local` and change the password:

```bash
ADMIN_PASSWORD=YourSecurePasswordHere
NEXTAUTH_SECRET=your-long-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

**Important:** Keep `.env.local` secret and never commit it to Git!

### 2. Start Ollama (Optional but Recommended)

For AI-powered assistance when creating/editing projects:

```bash
# Make sure Ollama is running
ollama serve

# In another terminal, pull llama3.2 if you haven't already
ollama pull llama3.2
```

The admin panel will work without Ollama, but AI features will be disabled.

### 3. Access the Admin Panel

1. Start the dev server: `npm run dev`
2. Visit: http://localhost:3000/admin/login
3. Enter your password from `.env.local`
4. Manage your projects at: http://localhost:3000/admin/dashboard

## Project Structure

```
/app
  /api
    /auth/[...nextauth]  - NextAuth authentication
    /projects           - Project CRUD API
    /upload             - Image upload endpoint
  /admin
    /login             - Admin login page
    /dashboard         - Admin project management
/data
  projects.json        - Your projects database (auto-created)
/public
  /uploads            - Uploaded project images
  /app_portfolio      - Your existing screenshots
```

## API Endpoints

- `GET /api/projects` - Fetch all projects (public)
- `POST /api/projects` - Create project (authenticated)
- `PUT /api/projects` - Update project (authenticated)
- `DELETE /api/projects?id=xxx` - Delete project (authenticated)
- `POST /api/upload` - Upload image (authenticated)
- `POST /api/ai` - AI assistance (authenticated, requires Ollama)

## Tech Stack

- **Authentication:** NextAuth.js with credentials provider
- **Storage:** JSON file-based (easily migrated to DB later)
- **Images the basic info (Title and Category)
3. **Use AI Assistance (✨ buttons):**
   - **AI Generate** - Creates a description from your title and tags
   - **AI Enhance** - Improves your existing description
   - **Lightning icon** on Title - Suggests better project titles
   - **Tag icon** on Tags - Suggests relevant technology tags
4. Upload an image
5. (Optional) Add live link and GitHub link
6. Click "Save Project"

Your new project will appear immediately on the portfolio!

### AI Features in Detail

The AI assistance uses your locally-running Ollama instance:

- **Generate Description**: Enter a title and some tags, then click "AI Generate" to create a professional 2-3 sentence description
- **Enhance Description**: Already have a description? Click "AI Enhance" to make it more compelling
- **Improve Title**: Get 3 alternative title suggestions (applies the first one)
- **Suggest Tags**: Based on your title and description, get relevant technology tags

**Tip**: The AI works best when you provide context. Fill in title + tags before generating descriptions

## Adding Projects

1. Click "Add New Project"
2. Fill in:
   - Title
   - Description
   - Category (AI, Brand Protection, SaaS, Video Analysis)
   - Tags (comma-separated)
   - Upload an image
   - (Optional) Live link and GitHub link
3. Click "Save Project"

Your new project will appear immediately on the portfolio!

## Production Deployment

Before deploying:

1. **Generate secure secrets:**
   ```bash
   openssl rand -base64 32  # For NEXTAUTH_SECRET
   ```

2. **Set environment variables** on your host (Vercel/Netlify):
   - `ADMIN_PASSWORD`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)

3. **For production storage**, consider migrating from JSON to:
   - PostgreSQL (Supabase, Railway, Vercel Postgres)
   - MongoDB (MongoDB Atlas)
   - Or keep JSON simple if you don't need multi-user edits

## Future Enhancements

Consider adding:
- Different Ollama models (llama3.1, mistral, etc.)
- Batch AI operations on multiple projects
- Multiple admin users
- Project ordering/sorting
- Image optimization
- Analytics integration
- SEO meta tags per project
- Project categories management
