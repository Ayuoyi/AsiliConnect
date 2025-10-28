import { useState } from 'react';
import { testGeminiConnection } from '../services/testGeminiConnection';

interface TestState {
  result: string;
  error: string;
  isLoading: boolean;
  lastTestTime: string;
  apiKeyStatus: 'unknown' | 'missing' | 'invalid' | 'valid';
  performance?: {
    requestDuration: number;
    tokenCount?: number;
  };
  modelInfo?: {
    name: string;
    version?: string;
  };
  errorSuggestion?: string;
}

export default function TestGeminiAPI() {
  const [state, setState] = useState<TestState>({
    result: '',
    error: '',
    isLoading: false,
    lastTestTime: '',
    apiKeyStatus: 'unknown'
  });

  const testAPI = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: '', result: '' }));

    try {
      const testResult = await testGeminiConnection();
      
      if (testResult.success) {
        setState(prev => ({
          ...prev,
          result: `Connection Test: ${testResult.message}\nResponse: ${testResult.response}`,
          apiKeyStatus: testResult.apiKeyStatus,
          lastTestTime: testResult.timestamp,
          performance: testResult.performance,
          modelInfo: testResult.modelInfo,
          errorSuggestion: undefined
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: `Test Failed: ${testResult.message}\nError Details: ${JSON.stringify(testResult.error, null, 2)}`,
          apiKeyStatus: testResult.apiKeyStatus,
          lastTestTime: testResult.timestamp,
          performance: testResult.performance,
          modelInfo: testResult.modelInfo,
          errorSuggestion: testResult.error?.suggestion
        }));
      }
    } catch (err: any) {
      console.error('API Test Error:', err);
      setState(prev => ({
        ...prev,
        error: err.message || 'An unexpected error occurred',
        apiKeyStatus: 'unknown'
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const getApiKeyStatusColor = () => {
    switch (state.apiKeyStatus) {
      case 'valid': return 'text-green-600';
      case 'invalid': return 'text-red-600';
      case 'missing': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Gemini API Test</h2>
        <div className={`text-sm ${getApiKeyStatusColor()}`}>
          API Key Status: {state.apiKeyStatus}
        </div>
      </div>
      
      <button 
        onClick={testAPI}
        disabled={state.isLoading}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {state.isLoading ? 'Testing...' : 'Test API Connection'}
      </button>

      {state.lastTestTime && (
        <p className="mt-2 text-sm text-gray-500">
          Last tested: {new Date(state.lastTestTime).toLocaleString()}
        </p>
      )}

      {state.error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-bold">Error:</p>
          <pre className="mt-2 whitespace-pre-wrap text-sm">{state.error}</pre>
          {state.errorSuggestion && (
            <div className="mt-3 p-3 bg-red-100 rounded">
              <p className="font-semibold">Suggestion:</p>
              <p className="text-sm mt-1">{state.errorSuggestion}</p>
            </div>
          )}
        </div>
      )}   

      {state.result && (
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500">
          <p className="font-bold">API Response:</p>
          <pre className="mt-2 whitespace-pre-wrap text-sm">{state.result}</pre>
          
          {state.performance && (
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-semibold">Request Duration:</p>
                <p>{state.performance.requestDuration.toFixed(2)}ms</p>
              </div>
              {state.performance.tokenCount && (
                <div>
                  <p className="font-semibold">Token Count:</p>
                  <p>{state.performance.tokenCount}</p>
                </div>
              )}
            </div>
          )}

          {state.modelInfo && (
            <div className="mt-3 text-sm text-gray-600">
              <p className="font-semibold">Model Information:</p>
              <p>{state.modelInfo.name} {state.modelInfo.version || ''}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}