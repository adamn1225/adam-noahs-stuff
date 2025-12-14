import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if Ollama is available (optional in production)
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    
    // In production, you can disable AI features by not setting OLLAMA_URL
    if (process.env.NODE_ENV === 'production' && !process.env.OLLAMA_URL) {
      return NextResponse.json({ 
        error: 'AI features are disabled in production. Use Ollama locally or set OLLAMA_URL environment variable.' 
      }, { status: 503 });
    }

    const { prompt, action, context } = await request.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'generate_description':
        systemPrompt = 'You are a professional portfolio writer. Generate a compelling, concise project description (2-3 sentences) that highlights the key features and impact.';
        userPrompt = `Project title: ${context.title}\nTechnologies: ${context.tags}\nGenerate a professional description:`;
        break;
      
      case 'enhance_description':
        systemPrompt = 'You are a professional portfolio writer. Improve this project description to be more compelling and professional while keeping it concise (2-3 sentences).';
        userPrompt = `Current description: ${context.description}\nImprove it:`;
        break;
      
      case 'suggest_tags':
        systemPrompt = 'You are a tech expert. Suggest 5-7 relevant technology tags for this project. Return ONLY a comma-separated list, no explanations.';
        userPrompt = `Project: ${context.title}\nDescription: ${context.description}\nSuggest tags:`;
        break;
      
      case 'improve_title':
        systemPrompt = 'You are a branding expert. Suggest 3 improved, catchy project titles. Return ONLY the titles, one per line, no numbers or explanations.';
        userPrompt = `Current title: ${context.title}\nDescription: ${context.description}\nSuggest better titles:`;
        break;
      
      default:
        userPrompt = prompt;
    }

    // Call Ollama API
    const ollamaResponse = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'llama3.2',
        prompt: systemPrompt ? `${systemPrompt}\n\n${userPrompt}` : userPrompt,
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error('Ollama API error');
    }

    const data = await ollamaResponse.json();
    
    return NextResponse.json({
      success: true,
      response: data.response.trim(),
    });
  } catch (error) {
    console.error('Ollama error:', error);
    return NextResponse.json(
      { error: 'AI assistance unavailable. Make sure Ollama is running.' },
      { status: 500 }
    );
  }
}
