'use server'

import { GoogleGenAI } from '@google/genai'

export async function simplifyText(text: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
  const prompt = process.env.PROMPT_INICIAL || 'Prompt padrão em caso de erro.';

  if (!apiKey) throw new Error('API key não definida.')

  const ai = new GoogleGenAI({ apiKey })

  const response = await ai.models.generateContentStream({
    model,
    contents: `${prompt}\n\n${text}`,
  })

  let result = ''
  for await (const chunk of response) {
    result += chunk.text
  }

  return result
}
