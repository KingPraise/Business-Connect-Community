import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with the Vite environment variable
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export async function extractEventDetailsFromImage(base64Image, mimeType) {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY is missing from .env.local');
  }

  try {
    // Use gemini-1.5-flash as it is fast and supports multimodal input
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert event data extraction assistant.
      Analyze this event flyer and extract the following details into a strict JSON format. 
      If a field cannot be found, make an educated guess or leave it as a reasonable default (e.g. 0 for price).
      Do NOT include any markdown formatting or backticks in your response, just return the raw JSON.

      Required JSON structure:
      {
        "name": "Event Title",
        "date": "YYYY-MM-DDT12:00:00+01:00", (Extract date and time and format as ISO string, assume current year if missing, timezone +01:00)
        "category": "One of: Networking, Business, Creative, Community, Social", (Choose the best fit)
        "address": "Full venue address",
        "area": "A short area or district name (e.g. Dugbe, Bodija, Ring Road)",
        "priceType": "Free" or "Paid",
        "priceAmount": 0 (if Free) or amount in numbers (if Paid),
        "description": "A 1-2 sentence description summarizing what the event is about",
        "organizerName": "Name of the host/organizer",
        "organizerContact": "Email, phone or website of organizer",
        "tags": ["tag1", "tag2", "tag3"] (Generate 3 relevant lowercase tags)
      }
    `;

    const imageParts = [
      {
        inlineData: {
          data: base64Image.split(',')[1], // Remove the data:image/jpeg;base64, prefix
          mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting if the model disobeys instructions
    const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
}
