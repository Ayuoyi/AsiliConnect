import { GoogleGenerativeAI } from "@google/generative-ai";

interface TestResult {
  success: boolean;
  message: string;
  response?: string;
  error?: {
    name?: string;
    status?: number;
    code?: string;
    details?: string;
    suggestion?: string;
  };
  apiKeyStatus: 'missing' | 'invalid' | 'valid';
  timestamp: string;
  performance?: {
    requestDuration: number;
    tokenCount?: number;
  };
  modelInfo?: {
    name: string;
    version?: string;
  };
}

export async function testGeminiConnection(): Promise<TestResult> {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  console.log('Testing Gemini API connection...');
  
  if (!API_KEY) {
    return {
      success: false,
      message: 'API key is missing. Please check your environment variables.',
      apiKeyStatus: 'missing',
      timestamp: new Date().toISOString(),
      error: {
        name: 'ConfigurationError',
        details: 'Missing API key'
      }
    };
  }

  try {
    const startTime = performance.now();
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 50,
        candidateCount: 1
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });

    // Test prompt for agricultural context
    const testPrompt = "Respond with 'READY_FOR_FARM_ASSIST' if you can help with farming questions.";
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();
    
    const endTime = performance.now();
    const requestDuration = endTime - startTime;

    // Validate response format
    const isValidResponse = text.includes('READY_FOR_FARM_ASSIST');
    
    console.log('Farm Assistant test response:', {
      text,
      isValid: isValidResponse,
      length: text.length,
      duration: requestDuration
    });

    return {
      success: true,
      message: isValidResponse ? 'API connection successful' : 'API connected but response format unexpected',
      response: text,
      apiKeyStatus: 'valid',
      timestamp: new Date().toISOString(),
      performance: {
        requestDuration,
        tokenCount: text.split(/\s+/).length // Rough estimate
      },
      modelInfo: {
        name: 'gemini-pro',
        version: '1.0'
      }
    };
  } catch (error: any) {
    console.error('API Test Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      status: error.status,
      code: error.code
    });

    const errorLower = error.message?.toLowerCase() ?? '';
    const isAuthError = errorLower.includes('authentication') || 
                       errorLower.includes('unauthorized') ||
                       errorLower.includes('api key');
    const isQuotaError = errorLower.includes('quota') ||
                        errorLower.includes('rate limit');
    const isNetworkError = errorLower.includes('network') ||
                          errorLower.includes('timeout') ||
                          errorLower.includes('connection');

    let suggestion = '';
    if (isAuthError) {
      suggestion = 'Check your API key in the .env file and ensure it is properly set. Try generating a new API key if the issue persists.';
    } else if (isQuotaError) {
      suggestion = 'You have reached your API usage limit. Wait a few minutes or check your quota in the Google Cloud Console.';
    } else if (isNetworkError) {
      suggestion = 'Check your internet connection and try again. If the problem persists, there might be an issue with the Gemini API service.';
    }

    return {
      success: false,
      message: error.message,
      apiKeyStatus: isAuthError ? 'invalid' : 'valid',
      timestamp: new Date().toISOString(),
      performance: {
        requestDuration: performance.now() - startTime
      },
      modelInfo: {
        name: 'gemini-pro'
      },
      error: {
        name: error.name,
        status: error.status,
        code: error.code,
        details: error.message,
        suggestion
      }
    };
  }
}