import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.replace(/["']/g, '');

// Validate API key
if (!API_KEY) {
  console.error('API key is missing. Please check your .env file and restart the development server.');
  throw new Error('API_KEY_MISSING');
}

if (API_KEY.length < 30) {
  console.error('API key appears to be invalid (too short). Please check your .env file.');
  throw new Error('API_KEY_INVALID');
}

// Initialize Gemini with proper configuration
const genAI = new GoogleGenerativeAI(API_KEY);

// Basic configuration for the model
const defaultConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

// System prompt for agricultural focus
const SYSTEM_PROMPT = `You are FarmBot, an AI assistant specialized in agriculture and farming. Your primary role is to help farmers with:

1. **Crop Management**: Advice on planting, growing, harvesting various crops
2. **Pest & Disease Control**: Identifying and treating plant diseases and pest infestations
3. **Market Information**: Guidance on crop pricing, market trends, and selling strategies
4. **Weather & Climate**: Weather-related farming advice and climate adaptation
5. **Soil Health**: Soil testing, fertilizer recommendations, and soil improvement
6. **Livestock Management**: Animal husbandry, health, and breeding advice
7. **Sustainable Farming**: Organic farming, water conservation, and eco-friendly practices
8. **Farm Technology**: Modern farming equipment, irrigation systems, and farm management tools
9. **Financial Advice**: Agricultural loans, subsidies, insurance, and farm economics
10. **Storage & Processing**: Post-harvest handling, storage techniques, and value addition

**Response Guidelines:**
- Keep responses practical, actionable, and easy to understand
- Use simple language suitable for farmers with varying education levels
- Provide step-by-step guidance when relevant
- Include measurements in local units (acres, kilograms, liters)
- Consider cost-effective solutions for small-scale farmers
- When uncertain, acknowledge it and suggest consulting local agricultural experts
- Always prioritize sustainable and safe farming practices
- Be culturally sensitive and consider local farming contexts

**Limitations:**
- Stay focused on agricultural topics
- If asked about non-farming topics, politely redirect to farming-related questions
- Do not provide medical advice beyond basic first aid for farm injuries
- Do not provide legal advice; suggest consulting agricultural extension officers or lawyers

Now, respond to the farmer's question:`;

export async function getGeminiResponse(userMessage: string, conversationHistory: any[] = []) {
  try {
    if (!userMessage.trim()) {
      return "Please provide a question or topic you'd like to discuss about farming.";
    }

    console.log('Starting Gemini API request...', {
      messageLength: userMessage.length,
      historyLength: conversationHistory.length
    });

    // Use gemini-pro model with specific configurations
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.8,
        topK: 20,
        topP: 0.9,
        maxOutputTokens: 2048,
        stopSequences: ["Farmer:", "FarmBot:"]
      }
    });

    // Build conversation context
    let prompt = SYSTEM_PROMPT + "\n\n";
    
    // Add conversation history for context
    if (conversationHistory.length > 0) {
      prompt += "Previous conversation:\n";
      conversationHistory.slice(-4).forEach(msg => {
        prompt += `${msg.type === 'user' ? 'Farmer' : 'FarmBot'}: ${msg.text}\n`;
      });
      prompt += "\n";
    }
    
    prompt += `Farmer's current question: ${userMessage}\n\nFarmBot's response:`;

    console.log('Sending prompt to Gemini...', {
      promptLength: prompt.length,
      historyMessages: conversationHistory.length
    });

    console.log('Processing request...', {
      hasSystemPrompt: prompt.includes(SYSTEM_PROMPT)
    });

    const result = await model.generateContent(prompt);
    
    if (!result) {
      throw new Error('No response received from Gemini API');
    }

    console.log('Received response from Gemini');
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response received from Gemini API');
    }
    
    console.log('Successfully processed response', {
      responseLength: text.length,
      hasContent: text.length > 0
    });

    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      API_KEY_EXISTS: !!API_KEY
    });
    
    if (error.message?.includes("API key")) {
      return "I'm having trouble connecting. Please check the API configuration.";
    } else if (error.message?.includes("quota")) {
      return "I'm experiencing high demand right now. Please try again in a moment.";
    } else {
      return "I apologize, but I'm having trouble processing your request right now. Please try rephrasing your question or try again later.";
    }
  }
}

// Optional: Function to analyze images (for crop disease detection)
export async function analyzeImage(imageData: any, userMessage: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const prompt = `${SYSTEM_PROMPT}\n\nThe farmer has shared an image and asks: ${userMessage}\n\nAnalyze this image in the context of agriculture and farming. If it shows a plant, identify any diseases, pests, or issues. Provide practical advice.`;

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error analyzing image:", error);
    return "I'm having trouble analyzing the image. Please ensure it's clear and try again.";
  }
}