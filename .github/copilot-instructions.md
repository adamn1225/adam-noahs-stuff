<!-- Use this file to provide workspace-specific custom instructions to Copilot. -->

## Premier Watchdog - eBay Trademark Monitoring System

### Project Overview
- **Backend:** Go 1.23 on Railway (combined API + scanner binary)
- **Frontend:** Next.js on Netlify
- **Database:** Railway Postgres
- **eBay Integration:** Browse API (production credentials)

### Deployment Preferences ⚠️ IMPORTANT
**ALWAYS use CLI tools for deployment. DO NOT suggest git commit/push workflows.**

**Frontend (Netlify):**
```bash
cd /home/adam/ebay_alterts/premier_watch
netlify deploy --prod
```

**Backend (Railway):**
```bash
cd /home/adam/ebay_alterts/backend
railway up
```

**Build Verification:**
- Backend: `go build ./cmd/combined`
- Frontend: `npm run build` (clear `.next` cache if needed)

### Project Structure
- `backend/` - Go API + scanner
  - `cmd/combined/` - Combined binary (API + scanner)
  - `cmd/scanner/` - Scanner-only binary
  - `internal/` - Core logic (api, store, ebay, config)
  - `migrations/` - Database migrations (001-014)
- `premier_watch/` - Next.js frontend
  - `app/dashboard/` - Main dashboard pages
  - `lib/` - TypeScript types and utilities

### Key Features (See FEATURES.md)
- ✅ Core listing & alert system
- ✅ VeRO reporting (manual + email)
- ✅ Authorized sellers management
- ✅ Email notifications
- ✅ Scanner with rate limiting
- ❌ Products/scanner-config (removed Dec 10, 2025)

### Development Notes
- Scanner runs every 15 minutes (primary brands)
- Bad actor queries every 30 minutes
- API rate limit: 5,000 calls/day (current usage: ~768/day)
- Authorized sellers automatically skip alert creation
