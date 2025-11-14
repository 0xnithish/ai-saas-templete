'use client';

import { useState } from 'react';

export default function PolarTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test: string, status: 'success' | 'error', message: string) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date() }]);
  };

  const testEnvironmentVariables = async () => {
    try {
      const response = await fetch('/api/test-polar/env');
      const data = await response.json();
      
      if (data.success) {
        addResult('Environment Variables', 'success', `✓ All required variables are set: ${data.variables.join(', ')}`);
      } else {
        addResult('Environment Variables', 'error', `✗ Missing variables: ${data.missing?.join(', ') || 'Unknown error'}`);
      }
    } catch (error) {
      addResult('Environment Variables', 'error', `✗ Error: ${error}`);
    }
  };

  const testPolarConnection = async () => {
    try {
      const response = await fetch('/api/test-polar/connection');
      const data = await response.json();
      
      if (data.success) {
        addResult('Polar API Connection', 'success', `✓ Connected successfully. Server: ${data.server}`);
      } else {
        addResult('Polar API Connection', 'error', `✗ Connection failed: ${data.error}`);
      }
    } catch (error) {
      addResult('Polar API Connection', 'error', `✗ Error: ${error}`);
    }
  };

  const testWebhookEndpoint = async () => {
    try {
      const response = await fetch('/api/test-polar/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'checkout.updated',
          data: { id: 'test-checkout-id', status: 'test' }
        })
      });
      const data = await response.json();
      
      if (data.success) {
        addResult('Webhook Endpoint', 'success', `✓ Webhook endpoint working: ${data.message}`);
      } else {
        addResult('Webhook Endpoint', 'error', `✗ Webhook test failed: ${data.error}`);
      }
    } catch (error) {
      addResult('Webhook Endpoint', 'error', `✗ Error: ${error}`);
    }
  };

  const testCheckoutSession = async () => {
    try {
      const response = await fetch('/api/test-polar/checkout');
      const data = await response.json();
      
      if (data.success) {
        addResult('Checkout Session', 'success', `✓ Checkout session created: ${data.checkoutUrl}`);
      } else {
        addResult('Checkout Session', 'error', `✗ Checkout creation failed: ${data.error}`);
      }
    } catch (error) {
      addResult('Checkout Session', 'error', `✗ Error: ${error}`);
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    await testEnvironmentVariables();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testPolarConnection();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testWebhookEndpoint();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testCheckoutSession();
    
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Polar Integration Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Polar Connection</h2>
          <p className="text-gray-600 mb-6">
            This page tests your Polar integration including environment variables, API connection, webhook endpoints, and checkout sessions.
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={runAllTests}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Running Tests...' : 'Run All Tests'}
            </button>
            
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Clear Results
            </button>
          </div>
        </div>

        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-md border ${
                    result.status === 'success' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start">
                    <span className="font-medium text-gray-900">{result.test}:</span>
                  </div>
                  <p className={`mt-1 ${result.status === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                    {result.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {result.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Environment Variables Status</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">POLAR_ACCESS_TOKEN:</span>
              <span className="text-blue-600">
                ✓ Check via server-side test
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">POLAR_WEBHOOK_SECRET:</span>
              <span className="text-blue-600">
                ✓ Check via server-side test
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Environment variables are server-side only. Run the test above to verify they're properly configured.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
