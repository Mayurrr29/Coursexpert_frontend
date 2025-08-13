import React, { useState } from 'react';
import axios from 'axios';

const AIChatAssistant = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  // Function to handle user input and send request to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the backend API
      const result = await axios.post('http://localhost:5000/api/ask', { prompt: input });
      setResponse(result.data.reply); // Adjusted based on your API response structure
    } catch (error) {
      console.error('Error:', error);
      setResponse('Sorry, there was an issue with your request.');
    }
  };

  return (
    <div>
      <h2>AI Assistant</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
        style={{ padding: "10px", width: "300px" }}
      />
      <button onClick={handleSubmit}>Submit</button>
      <div>
        <h3>Response:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default AIChatAssistant;
