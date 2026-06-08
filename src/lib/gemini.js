import { GoogleGenerativeAI } from '@google/generative-ai';

export async function extractEventDetailsFromImage(base64Image, mimeType, providedApiKey = null) {
  const apiKey = providedApiKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Define a list of models to try in order of preference
    const fallbackModels = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-flash-latest",
      "gemini-2.5-pro"
    ];

    const prompt = `
      You are an expert event data extraction assistant.
      Analyze this event flyer and extract the following details into a strict JSON format. 
      If a field cannot be found, make an educated guess or leave it as a reasonable default (e.g. 0 for price).
      Do NOT include any markdown formatting or backticks in your response, just return the raw JSON.

      Required JSON structure:
      {
        "isEventFlyer": true/false, // MUST be true if the image is an event flyer, false otherwise
        "errorMessage": "If isEventFlyer is false, provide a short 1-sentence reason why",
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
          data: base64Image.split(',')[1],
          mimeType
        }
      }
    ];

    let lastError = null;

    for (const modelName of fallbackModels) {
      try {
        console.log(`Attempting Gemini extraction using model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([prompt, ...imageParts]);
        const responseText = result.response.text();
        
        const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedText);
        
        // Strict check: if the AI explicitly says it's not a flyer, or fails to include the flag, reject it.
        if (!parsed.isEventFlyer || String(parsed.isEventFlyer).toLowerCase() === 'false') {
          throw new Error(parsed.errorMessage || "The uploaded image does not appear to be a valid event flyer. Please upload an image containing event details.");
        }
        
        return parsed;
      } catch (err) {
        console.warn(`Model ${modelName} failed:`, err.message);
        lastError = err;
        
        // If it's a 404 or 503, continue to the next fallback model.
        // If it's our custom validation error (not an event flyer), don't retry, throw immediately!
        if (err.message.includes("does not appear to be a valid event flyer") || err.message.includes("isEventFlyer is false")) {
          throw err;
        }
      }
    }

    // If all models failed
    throw new Error(`All available Gemini models failed. Last error: ${lastError.message}`);
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
}
