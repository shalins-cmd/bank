import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// NOTE: API Key must be provided in the environment as process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are Nova, a helpful and professional AI banking assistant for Nova Bank. 
Your goal is to assist users with navigating the site, understanding banking products (Savings, Loans, Credit Cards), and providing general financial advice.
Keep answers concise, friendly, and formatted nicely. 
If a user asks to apply for something, guide them to click the "Apply Now" button on the respective page.
Do not ask for real personal sensitive information like account numbers or passwords.
`;

export const sendMessageToGemini = async (message: string, history: { role: 'user' | 'model'; text: string }[]) => {
  try {
    if (!process.env.API_KEY) {
      return "I'm currently in demo mode without an API key. Please configure the API key to chat with me!";
    }

    const model = 'gemini-3-flash-preview';
    
    // Transform history for the chat context if needed, 
    // but for simple single-turn or short context we can just use generateContent with history as context string
    // or use the Chat API. Let's use Chat API for better context management.
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I'm having trouble connecting to the banking server right now. Please try again later.";
  }
};