import { GoogleGenAI } from "@google/genai";
import { Habit, JournalEntry } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getHabitAdvice = async (habitName: string, currentStreak: number): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI service unavailable. Please check configuration.";

  try {
    const prompt = `
      You are an expert habit coach. 
      The user is tracking a habit called "${habitName}".
      Their current streak is ${currentStreak} days.
      Give them a short, punchy, 2-sentence motivational tip or advice specific to this habit and their progress.
      Do not be generic. Be encouraging.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Keep going! You're doing great.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Consistency is key. Keep it up!";
  }
};

export const analyzeJournalEntry = async (entry: string, mood?: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI service unavailable.";

  try {
    const prompt = `
      Analyze this short journal entry: "${entry}".
      User mood reported: ${mood || 'Not specified'}.
      Provide a very brief (max 30 words) supportive insight or reflection to help the user grow.
      Tone: Empathetic, warm, professional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Thank you for sharing your thoughts.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Reflection recorded.";
  }
};

export const generateHabitSuggestions = async (goal: string): Promise<string[]> => {
  const ai = getAIClient();
  if (!ai) return ["Drink water", "Read 10 pages", "Walk 15 mins"];

  try {
    const prompt = `
      The user has a goal: "${goal}".
      Suggest 3 specific, actionable daily habits they can start to achieve this.
      Return ONLY the 3 habits as a comma-separated list. No numbering, no extra text.
      Example: "Drink 2L water, Run 2km, Sleep at 10pm"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "";
    return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return ["Start small", "Be consistent", "Track progress"];
  }
};

export const generateProgressReport = async (
  habits: Habit[], 
  stats: { totalCompletions: number, completionRate: number, longestStreak: number }
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "## Weekly Review\n\n**Status:** AI unavailable.\n**Advice:** Keep tracking your habits manually!";

  try {
    // Construct a summary of habit performance
    const habitSummary = habits.map(h => `- ${h.name}: ${h.streak} day streak, ${h.completedDates.length} total completions.`).join('\n');
    
    const prompt = `
      You are a world-class performance coach. Generate a "Weekly Progress Report" for this user based on their data.
      
      **User Stats:**
      - Total Completions: ${stats.totalCompletions}
      - 30-Day Rate: ${stats.completionRate}%
      - Best Streak: ${stats.longestStreak}
      
      **Habit Breakdown:**
      ${habitSummary}

      **Output Format (Markdown):**
      1. **The Win:** One specific thing they did well (celebrate a specific habit or streak).
      2. **The Gap:** One area for improvement (gentle nudge on a lower performing habit).
      3. **The Challenge:** A specific, achievable goal for next week.

      Keep it concise, professional, yet inspiring.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Report generation failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate report at this time.";
  }
};