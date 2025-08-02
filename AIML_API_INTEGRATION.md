# AIML API Integration Guide

## Overview
This document explains how to use the AIML API service in the SQL Learning Platform as the primary AI provider for chat functionality and SQL validation.

## Setup Instructions

### 1. Get Your AIML API Key
1. Visit [AIML API](https://api.aimlapi.com/)
2. Sign up for an account
3. Generate your API key
4. Copy the API key for configuration

### 2. Configure Environment Variables
Update your `.env` file with your AIML API key:
```
AIMLAPI_KEY=your_actual_aiml_api_key_here
```

### 3. Install Dependencies
The OpenAI package is required for AIML API compatibility:
```bash
npm install openai
```

## API Endpoints

### Main Chat Endpoint
**POST** `/api/chat`

Primary AI chat service using GPT-4o-mini model through AIML API with streaming support.

#### Request Format
```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful SQL learning assistant."
    },
    {
      "role": "user",
      "content": "Explain SQL SELECT statement"
    }
  ]
}
```

#### Response Format
Streaming Server-Sent Events (SSE) format:
```
data: "The SELECT"
data: " statement is"
data: " used to query..."
event: done
data: [DONE]
```

### SQL Validation Endpoint
**POST** `/validate-sql`

SQL validation service using AIML API.

#### Request Format
```json
{
  "sqlCode": "SELECT * FROM users WHERE id = 1"
}
```

#### Response Format
```json
{
  "hasErrors": false,
  "errors": [],
  "suggestions": ["Consider specifying column names instead of using *"],
  "correctedCode": null
}
```

## Usage Examples

### JavaScript/Frontend Integration
```javascript
// Example: Using AIML API for chat
async function sendMessageToAI(messages) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Handle streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            chunk.trim().split('\n').forEach(line => {
                if (line.startsWith('data: ')) {
                    const data = line.replace('data: ', '');
                    if (data === '[DONE]') return;
                    try {
                        const content = JSON.parse(data);
                        fullResponse += content;
                        console.log('Chunk:', content);
                    } catch (e) {
                        // Skip malformed JSON
                    }
                }
            });
        }
        
        return fullResponse;
    } catch (error) {
        console.error('Network error:', error);
        return null;
    }
}

// Example usage
const messages = [
    { role: 'system', content: 'You are a SQL tutor.' },
    { role: 'user', content: 'What is a JOIN in SQL?' }
];

sendMessageToAI(messages).then(response => {
    if (response) {
        console.log('AI Response:', response);
    }
});
```

### Node.js/Backend Testing
```javascript
const { OpenAI } = require('openai');

// Initialize AIML API client
const aimlApi = new OpenAI({
    apiKey: 'b49838f25ea847ca94fb370bfd36a070',
    baseURL: 'https://api.aimlapi.com/v1'
});

// Test function
async function testAIMLAPI() {
    try {
        const completion = await aimlApi.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful SQL learning assistant.'
                },
                {
                    role: 'user',
                    content: 'Explain the difference between INNER JOIN and LEFT JOIN'
                }
            ],
            temperature: 0.7,
            max_tokens: 1024
        });
        
        console.log('Response:', completion.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error);
    }
}

testAIMLAPI();
```

## Features

### Enhanced Validation
- Input validation for message format
- Message length limits (2000 characters)
- Array structure validation
- Role and content validation

### Error Handling
- Authentication errors (401)
- Rate limiting detection (429)
- Network timeout handling
- Invalid request format detection (400)
- Service unavailability handling (500)

### SQL Learning Context
- Automatic system message enhancement for SQL learning
- Educational response formatting
- Practical example inclusion

### Streaming Support
- Simulated streaming for better user experience
- Real-time response display
- Proper SSE event handling

## Model Information

### GPT-4o-mini
- **Provider**: AIML API
- **Model**: OpenAI GPT-4o-mini
- **Strengths**: 
  - Excellent reasoning capabilities
  - Strong SQL knowledge
  - Educational content generation
  - Cost-effective
  - Fast response times
- **Use Cases**:
  - SQL concept explanations
  - Code examples and debugging
  - Learning assistance
  - Complex query analysis

## AIML API Features

| Feature | AIML API (GPT-4o-mini) |
|---------|-------------------------|
| Streaming | ✅ Yes (Simulated) |
| Cost | Competitive |
| Response Speed | Fast |
| SQL Knowledge | Excellent |
| Context Length | Long |
| Reliability | High |
| Model Quality | High |
| Educational Focus | Excellent |

## Troubleshooting

### Common Issues

1. **API Key Not Configured**
   - Error: "AIML API key not configured"
   - Solution: Set `AIMLAPI_KEY` in `.env` file

2. **Authentication Failed**
   - Error: "Authentication issue detected"
   - Solution: Verify API key is correct and active

3. **Rate Limiting**
   - Error: "I've reached my usage limit"
   - Solution: Wait and retry, or upgrade API plan

4. **Network Issues**
   - Error: "Network connection issue"
   - Solution: Check internet connection and API status

### Testing the Integration

1. **Test API Key Configuration**:
   ```bash
   curl -X POST http://localhost:5000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"Hello"}]}'
   ```

2. **Test SQL Validation**:
   ```bash
   curl -X POST http://localhost:5000/validate-sql \
     -H "Content-Type: application/json" \
     -d '{"sqlCode":"SELECT * FROM users"}'
   ```

3. **Test with Frontend**:
   - Open the chat interface
   - Send a test message
   - Check browser console for errors

## Security Considerations

1. **API Key Protection**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly

2. **Input Validation**
   - All inputs are validated server-side
   - Message length limits enforced
   - Malicious content filtering

3. **Rate Limiting**
   - Implement client-side rate limiting
   - Monitor API usage
   - Set up alerts for unusual activity

## Performance Optimization

1. **Response Caching**
   - Cache common SQL explanations
   - Implement Redis for session storage
   - Use CDN for static content

2. **Request Optimization**
   - Optimize prompt engineering
   - Use appropriate temperature settings
   - Limit max_tokens for faster responses

3. **Error Recovery**
   - Implement retry logic
   - Graceful degradation
   - Fallback responses

## Support

For issues related to:
- **AIML API**: Contact AIML API support
- **Integration**: Check server logs and error messages
- **Platform**: Refer to main project documentation

## Migration Notes

This platform has been migrated from Google Gemini to AIML API for:
- Better reliability
- Consistent API access
- Enhanced model capabilities
- Improved cost efficiency

All previous Google Gemini references have been removed and replaced with AIML API integration.