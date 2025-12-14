# Ollama in Production

## Current Setup (Development)
Ollama runs locally on your machine at `http://localhost:11434`

## Production Options

### Option 1: Disable AI Features in Production (Simplest)
The admin panel works perfectly without AI - just no sparkle buttons.

Update `/app/api/ai/route.ts` to check environment:
```typescript
if (process.env.NODE_ENV === 'production' && !process.env.OLLAMA_URL) {
  return NextResponse.json({ 
    error: 'AI features not available in production' 
  }, { status: 503 });
}
```

### Option 2: Self-Host Ollama on a VPS
1. Rent a VPS (DigitalOcean, Linode, etc.) - ~$12-20/month
2. Install Ollama on it
3. Set environment variable: `OLLAMA_URL=https://your-vps-ip:11434`
4. Update API route to use `process.env.OLLAMA_URL`

**Pros:** Keep using Ollama, private
**Cons:** Extra cost and server management

### Option 3: Use OpenAI API Instead (Easiest Paid Option)
Replace Ollama with OpenAI's API - similar functionality, no server needed.

1. Get OpenAI API key ($5-20/month depending on usage)
2. Add to env: `OPENAI_API_KEY=sk-...`
3. Update `/app/api/ai/route.ts` to call OpenAI instead

**Pros:** No server management, reliable, fast
**Cons:** ~$0.002 per request (very cheap)

### Option 4: Ollama on Railway (Experimental)
Some users run Ollama in a Docker container on Railway, but:
- Requires GPU for decent performance (expensive)
- Railway's CPU-only is very slow for LLMs
- Not recommended

## Recommended Approach

**For your portfolio:**
1. **Development**: Use Ollama locally (what you have now) ✅
2. **Production**: Disable AI features or switch to OpenAI API

The AI is mainly useful when creating many projects. Once your portfolio is set up, you won't need it much!

## Quick Fix: Make AI Optional

Let me update the code to gracefully handle when Ollama isn't available...
