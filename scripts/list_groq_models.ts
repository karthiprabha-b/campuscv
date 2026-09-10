export {};
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

async function listModels() {
  const res = await fetch('https://api.groq.com/openai/v1/models', {
    headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
  });
  const data = await res.json();
  console.log('Available models:', (data.data || []).map((m: any) => m.id));
}

listModels();
