const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Simple API test function
export const testAPI = async () => {
  console.log('🧪 Testing Google AI Studio API...');
  console.log('API Key (first 10 chars):', GOOGLE_API_KEY?.substring(0, 10) + '...');
  
  try {
    const testMessages = [{ role: 'user', content: 'Say "API is working!"' }];
    const response = await sendMessage(testMessages);
    console.log('✅ API Test Success:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendMessage = async (messages, onStream = null) => {
  console.log('🔑 Google API Key exists:', !!GOOGLE_API_KEY);
  console.log('📤 Sending messages:', messages);
  
  if (!GOOGLE_API_KEY) {
    throw new Error('Google AI Studio API key not configured. Please check your .env file.');
  }

  try {
    const lastMessage = messages[messages.length - 1];
    const response = await fetch(`${API_URL}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: lastMessage.content
          }]
        }]
      })
    });

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      
      // Handle specific error cases
      if (response.status === 400) {
        throw new Error('Invalid request. Please check your message format.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Google AI Studio API key.');
      } else if (response.status === 403) {
        throw new Error('API access forbidden. Please check your API key permissions.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else {
        throw new Error(`API Error: ${errorText || 'Unknown error occurred'}`);
      }
    }

    const data = await response.json();
    console.log('✅ Google AI Response:', data);
    
    // Check if response has the expected structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('❌ Unexpected response structure:', data);
      throw new Error('Unexpected response format from AI service.');
    }
    
    const content = data.candidates[0].content.parts[0].text;
    
    if (onStream) {
      // Simulate streaming for Google AI
      for (let i = 0; i <= content.length; i += 3) {
        await new Promise(resolve => setTimeout(resolve, 30));
        onStream(content.substring(0, i));
      }
    }
    
    return content;
  } catch (error) {
    console.error('❌ Full error details:', error);
    
    // If it's a network error, provide a more user-friendly message
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw error;
  }
};