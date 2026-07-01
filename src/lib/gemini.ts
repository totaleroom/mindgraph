/**
 * Thin Bring-Your-Own-Key wrapper around the Gemini API. Loaded dynamically so
 * any browser-compatibility issue with the SDK never blocks the rest of the app.
 */
export async function generateWithGemini(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<string> {
  if (!apiKey) throw new Error("No API key configured.");

  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  const text = response.text;
  if (!text) throw new Error("The model returned an empty response.");
  return text.trim();
}
