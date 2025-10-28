import { useEffect, useState } from 'react';

export default function EnvCheck() {
  const [envStatus, setEnvStatus] = useState({
    hasApiKey: false,
    keyLength: 0,
    error: '',
    details: ''
  });

  useEffect(() => {
    const checkEnv = () => {
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const cleanKey = apiKey?.replace(/["']/g, '');
        const isValidLength = cleanKey?.length >= 30;
        
        setEnvStatus({
          hasApiKey: !!cleanKey,
          keyLength: cleanKey?.length || 0,
          error: isValidLength ? '' : 'API key might be invalid (too short)',
          details: `Key format: ${apiKey === cleanKey ? 'Clean' : 'Has quotes'}`
        });

        // Test the key format
        if (cleanKey && !isValidLength) {
          console.warn('API Key might be invalid - length is too short');
        }
      } catch (err: any) {
        setEnvStatus({
          hasApiKey: false,
          keyLength: 0,
          error: err.message,
          details: 'Error accessing environment variables'
        });
      }
    };

    checkEnv();
  }, []);

  return (
    <div className="fixed top-4 right-4 p-4 bg-white rounded-lg shadow-lg z-50">
      <h3 className="font-bold mb-2">Environment Check</h3>
      <ul className="text-sm space-y-1">
        <li className={envStatus.hasApiKey ? "text-green-600" : "text-red-600"}>
          API Key: {envStatus.hasApiKey ? "Present" : "Missing"}
        </li>
        <li className={envStatus.keyLength >= 30 ? "text-green-600" : "text-yellow-600"}>
          Key Length: {envStatus.keyLength} characters {envStatus.keyLength < 30 && '(Too short!)'}
        </li>
        {envStatus.details && (
          <li className="text-gray-600">
            Details: {envStatus.details}
          </li>
        )}
        {envStatus.error && (
          <li className="text-red-600 mt-2 p-2 bg-red-50 rounded">
            Error: {envStatus.error}
          </li>
        )}
      </ul>
      {(envStatus.error || !envStatus.hasApiKey || envStatus.keyLength < 30) && (
        <div className="mt-3 text-xs text-gray-600">
          <p className="font-semibold">Troubleshooting:</p>
          <ol className="list-decimal ml-4 mt-1 space-y-1">
            <li>Check .env file exists</li>
            <li>Verify API key is correct</li>
            <li>Remove any quotes around the key</li>
            <li>Restart the development server</li>
          </ol>
        </div>
      )}
    </div>
  );
}