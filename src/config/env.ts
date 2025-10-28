// Load environment variables with fallbacks
const getEnvVariable = (key: string): string => {
  const value = import.meta.env[key] || process.env[key];
  if (!value) {
    console.error(`Environment variable ${key} is not set`);
  }
  return value || '';
};

export const config = {
  GEMINI_API_KEY: getEnvVariable('VITE_GEMINI_API_KEY'),
} as const;

// Validate required environment variables
export const validateEnv = (): boolean => {
  const required = ['VITE_GEMINI_API_KEY'];
  const missing = required.filter(key => !getEnvVariable(key));
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing.join(', '));
    return false;
  }
  
  return true;
};