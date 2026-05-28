const axios = require('axios');

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const MODEL = 'meta/llama-3.1-8b-instruct';

async function generateCode(prompt, language = 'python') {
  const systemPrompt = `You are a helpful coding assistant. Generate clean, production-ready ${language} code based on the user's request. 
Respond ONLY with the code block (wrapped in triple backticks with the language), followed by a brief 1-sentence explanation.
Do not include any markdown outside the code block except the brief explanation.`;

  const response = await axios.post(
    `${NVIDIA_BASE_URL}/chat/completions`,
    {
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2048,
      top_p: 0.9,
      stream: false
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );

  const content = response.data.choices[0]?.message?.content || '';

  // Extract code block
  const codeMatch = content.match(/```(?:\w+)?\n?([\s\S]*?)```/);
  const code = codeMatch ? codeMatch[1].trim() : content.trim();

  // Extract explanation (text outside code block)
  const explanation = content.replace(/```[\s\S]*?```/, '').trim() || 'Here is the generated code:';

  return {
    code,
    explanation,
    language,
    prompt,
    model: MODEL
  };
}

module.exports = { generateCode };
