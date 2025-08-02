const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize AIML API client
const aimlApi = new OpenAI({
    apiKey: process.env.AIMLAPI_KEY,
    baseURL: 'https://api.aimlapi.com/v1'
});

const systemPrompt = "You are a helpful SQL learning assistant. Provide clear, educational responses with practical examples when discussing SQL concepts.";
const userPrompt = "Explain the difference between INNER JOIN and LEFT JOIN in SQL with examples.";

const testAIMLAPI = async () => {
    try {
        console.log('Testing AIML API integration...');
        console.log('API Key configured:', process.env.AIMLAPI_KEY ? 'Yes' : 'No');
        console.log('Base URL:', 'https://api.aimlapi.com/v1');
        console.log('Model:', 'mistralai/Mistral-7B-Instruct-v0.2');
        console.log('\n--- Request ---');
        console.log('User:', userPrompt);
        console.log('\n--- Processing ---');
        
        const completion = await aimlApi.chat.completions.create({
            model: 'mistralai/Mistral-7B-Instruct-v0.2',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt
                }
            ],
            temperature: 0.7,
            max_tokens: 512
        });
        
        const response = completion.choices[0].message.content;
        
        console.log('\n--- Response ---');
        console.log('AI:', response);
        console.log('\n--- Success ---');
        console.log('✅ AIML API integration is working correctly!');
        console.log('Model used:', completion.model || 'mistralai/Mistral-7B-Instruct-v0.2');
        console.log('Tokens used:', completion.usage?.total_tokens || 'N/A');
        
    } catch (error) {
        console.log('\n--- Error ---');
        console.error('❌ AIML API Error:', error.message);
        
        if (error.status === 401) {
            console.log('\n🔑 Authentication Issue:');
            console.log('- Check if AIMLAPI_KEY is set in .env file');
            console.log('- Verify the API key is correct and active');
            console.log('- Make sure you have sufficient credits');
        } else if (error.status === 400) {
            console.log('\n📝 Request Issue:');
            console.log('- Check the request format');
            console.log('- Verify model name is correct');
            console.log('- Check message structure');
        } else if (error.status === 429) {
            console.log('\n⏰ Rate Limit Issue:');
            console.log('- You have exceeded the rate limit');
            console.log('- Wait a moment and try again');
            console.log('- Consider upgrading your plan');
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            console.log('\n🌐 Network Issue:');
            console.log('- Check your internet connection');
            console.log('- Verify the API endpoint is accessible');
            console.log('- Check if there are any firewall restrictions');
        } else {
            console.log('\n🔧 General Issue:');
            console.log('- Error details:', error);
        }
        
        console.log('\n📋 Troubleshooting Steps:');
        console.log('1. Ensure AIMLAPI_KEY is set in .env file');
        console.log('2. Verify your API key at https://api.aimlapi.com/');
        console.log('3. Check your account balance and limits');
        console.log('4. Test with a simple request first');
        console.log('5. Check the AIML API documentation for updates');
    }
};

// Run the test
if (require.main === module) {
    testAIMLAPI();
}

module.exports = { testAIMLAPI, aimlApi };