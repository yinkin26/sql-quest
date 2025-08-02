const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const axios = require('axios');
const { OpenAI } = require('openai');

require('dotenv').config();

// Initialize AIML API client
const aimlApi = new OpenAI({
    apiKey: process.env.AIMLAPI_KEY,
    baseURL: 'https://api.aimlapi.com/v1'
});

const app = express();
app.use(cors({
    origin: true,
    credentials: true
}));


app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.get('/check-session', (req, res) => {
    if (req.session.userId) {
        db.query("SELECT score, completed_levels FROM players WHERE id = ?", [req.session.userId], (err, results) => {
            if (err) return res.status(500).json({ error: "Failed to fetch session data" });

            const score = results[0]?.score || 0;

            let completed = {};
            try {
                completed = JSON.parse(results[0]?.completed_levels || "{}");
            } catch {
                completed = {};
            }

            return res.json({
                loggedIn: true,
                username: req.session.username,
                userId: req.session.userId,
                userScore: score,
                completedLevels: completed
            });
        });
    } else {
        res.json({ loggedIn: false });
    }
});





// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Connect to MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Hoyinkin123*", // Update if needed
    database: "sql_learning"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database.");
    }
});

// API Route for SQL Queries
app.post("/execute", (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: "Query is empty" });
    }

    db.query(query, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message }); // ? log this message
        } else {
            if (results.affectedRows !== undefined) {
                res.json({ message: "Query executed successfully", affectedRows: results.affectedRows });
            } else {
                res.json({ result: results });
            }
        }
    });
});


// Registration route
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    db.query('SELECT * FROM players WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });

        if (results.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: 'Error hashing password' });

            const query = 'INSERT INTO players (username, email, password) VALUES (?, ?, ?)';
            db.query(query, [username, email, hashedPassword], (err, results) => {
                if (err) return res.status(500).json({ error: 'Error saving user' });
                res.json({ message: 'Registration successful' });
            });
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM players WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });

        if (results.length > 0) {
            const user = results[0];

            // Compare the password with the stored hash
            bcrypt.compare(password, user.password, (err, match) => {
                if (match) {
                    req.session.userId = user.id;
                    req.session.username = user.username; // optional
                    return res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });

                } else {
                    return res.status(400).json({ error: 'Invalid credentials' });
                }
            });
        } else {
            return res.status(400).json({ error: 'User not found' });
        }
    });
});



// Route to update player score
app.post("/updateScore", (req, res) => {
    const { playerId, newScore } = req.body;

    const query = "UPDATE players SET score = ? WHERE id = ?";
    db.query(query, [newScore, playerId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error updating score" });
        }
        res.status(200).json({ message: "Score updated successfully!" });
    });
});

// Route to get top players (Leaderboard)
app.get("/leaderboard", (req, res) => {
    const query = "SELECT username, score FROM players ORDER BY score DESC LIMIT 10";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching leaderboard" });
        }
        res.status(200).json(results);
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Error during logout' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    });
});

app.post("/mark-completed", (req, res) => {
    const userId = req.session.userId;
    const { setKey, level } = req.body;

    if (!userId || !setKey || !level) {
        return res.status(400).json({ error: "Missing data" });
    }

    db.query("SELECT completed_levels FROM players WHERE id = ?", [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "DB read error" });

        let completed = {};
        try {
            completed = JSON.parse(results[0]?.completed_levels || "{}");
        } catch {
            completed = {};
        }

        if (!completed[setKey]) {
            completed[setKey] = [];
        }

        if (!completed[setKey].includes(level)) {
            completed[setKey].push(level);
        }

        db.query("UPDATE players SET completed_levels = ? WHERE id = ?", [JSON.stringify(completed), userId], (err2) => {
            if (err2) return res.status(500).json({ error: "DB write error" });
            res.json({ success: true });
        });
    });
});

app.post('/bookmark', (req, res) => {
    const { lessonId, bookmarked } = req.body;
    const userId = req.session.userId;

    if (!userId) return res.status(401).json({ error: "Not logged in" });

    const query = bookmarked
        ? "INSERT INTO bookmarks (user_id, lesson_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE lesson_id = lesson_id"
        : "DELETE FROM bookmarks WHERE user_id = ? AND lesson_id = ?";

    const values = bookmarked ? [userId, lessonId] : [userId, lessonId];

    db.query(query, values, (err) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json({ success: true });
    });
});



// Add this to server.js
app.get('/bookmarks', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Not logged in" });

    db.query("SELECT lesson_id FROM bookmarks WHERE user_id = ?", [userId], (err, results) => {
        if (err) {
            console.error("Bookmarks query error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        const lessonIds = results.map(row => row.lesson_id);
        res.json({ lessonIds });
    });
});



// Add this endpoint before app.listen
app.get('/bookmark-status', (req, res) => {
    const { lessonId } = req.query;
    const userId = req.session.userId;

    if (!userId) return res.status(401).json({ bookmarked: false });

    db.query("SELECT * FROM bookmarks WHERE user_id = ? AND lesson_id = ?",
        [userId, lessonId],
        (err, results) => {
            if (err) {
                console.error("Bookmark status check error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ bookmarked: results.length > 0 });
        }
    );
});


app.post("/complete-lesson", (req, res) => {
    const userId = req.session.userId;
    const { lesson } = req.body;
    if (!userId || !lesson) return res.status(400).json({ error: "Missing data" });

    db.query("SELECT current_lesson FROM players WHERE id = ?", [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "DB read error" });
        let currentLessons = results[0]?.current_lesson?.split(",") || [];
        if (!currentLessons.includes(lesson)) currentLessons.push(lesson);

        const updated = currentLessons.join(",");
        db.query("UPDATE players SET current_lesson = ? WHERE id = ?", [updated, userId], (err2) => {
            if (err2) return res.status(500).json({ error: "DB update error" });
            res.json({ success: true });
        });
    });
});



// Route to get completed lessons for the profile page
app.get("/completed-lessons", (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Not logged in" });
    db.query("SELECT current_lesson FROM players WHERE id = ?", [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "DB error" });
        const completed = results[0]?.current_lesson || "";
        const list = completed ? completed.split(",").filter(Boolean) : [];
        res.json(list);
    });
});




// AIML API Chat endpoint with streaming simulation
app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;

    // Enhanced validation
    if (!Array.isArray(messages)) {
        return res.status(400).json({ error: 'messages must be an array' });
    }
    
    if (messages.length === 0) {
        return res.status(400).json({ error: 'messages array cannot be empty' });
    }
    
    // Validate message structure
    const validMessages = messages.every(msg => 
        msg && typeof msg === 'object' && 
        typeof msg.role === 'string' && 
        typeof msg.content === 'string' &&
        msg.content.trim().length > 0
    );
    
    if (!validMessages) {
        return res.status(400).json({ error: 'Invalid message format' });
    }
    
    // Check for excessively long messages
    const maxMessageLength = 2000;
    const hasLongMessage = messages.some(msg => msg.content.length > maxMessageLength);
    
    if (hasLongMessage) {
        return res.status(400).json({ error: 'Message too long. Please keep messages under 2000 characters.' });
    }

    // Enable streaming so the UI can "type"
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.flushHeaders();

    try {
        // Check if AIML API key is configured
        if (!process.env.AIMLAPI_KEY || process.env.AIMLAPI_KEY === '<YOUR_AIMLAPI_KEY>') {
            res.write(`event: error\ndata: ${JSON.stringify('AIML API key not configured. Please set AIMLAPI_KEY in environment variables.')}\n\n`);
            res.end();
            return;
        }

        // Add SQL learning context to system message
        const enhancedMessages = messages.map(msg => {
            if (msg.role === 'system') {
                return {
                    ...msg,
                    content: msg.content + ' You are specifically helping users learn SQL. Provide clear, educational responses with practical examples when discussing SQL concepts.'
                };
            }
            return msg;
        });

        // If no system message exists, add one
        if (!enhancedMessages.some(msg => msg.role === 'system')) {
            enhancedMessages.unshift({
                role: 'system',
                content: 'You are a helpful SQL learning assistant. Provide clear, educational responses with practical examples when discussing SQL concepts.'
            });
        }

        const completion = await aimlApi.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: enhancedMessages,
            temperature: 0.7,
            max_tokens: 1024,
            stream: false
        });

        const response = completion.choices[0].message.content;
        
        // Validate response quality
        if (!response || response.trim().length < 10) {
            res.write(`data: ${JSON.stringify('I apologize, but I couldn\'t generate a proper response. Could you please rephrase your question?')}\n\n`);
            res.write('event: done\ndata: [DONE]\n\n');
            res.end();
            return;
        }

        // Simulate streaming by sending response in chunks
        const words = response.split(' ');
        const chunkSize = 3; // Send 3 words at a time
        
        for (let i = 0; i < words.length; i += chunkSize) {
            const chunk = words.slice(i, i + chunkSize).join(' ');
            if (i + chunkSize < words.length) {
                res.write(`data: ${JSON.stringify(chunk + ' ')}\n\n`);
            } else {
                res.write(`data: ${JSON.stringify(chunk)}\n\n`);
            }
            
            // Add small delay to simulate streaming
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        res.write('event: done\ndata: [DONE]\n\n');
        res.end();
        
    } catch (error) {
        console.error('AIML API Error:', error);
        
        let errorMessage = 'I apologize, but I\'m experiencing technical difficulties. Please try asking your question again.';
        
        // More specific error handling
        if (error.message?.includes('API_KEY') || error.message?.includes('authentication') || error.status === 401) {
            errorMessage = 'Authentication issue detected. The AIML API service is temporarily unavailable.';
        } else if (error.message?.includes('quota') || error.message?.includes('limit') || error.status === 429) {
            errorMessage = 'I\'ve reached my usage limit. Please try again later.';
        } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
            errorMessage = 'Network connection issue. Please check your internet connection and try again.';
        } else if (error.status === 400) {
            errorMessage = 'Invalid request format. Please rephrase your question.';
        } else if (error.status === 500) {
            errorMessage = 'AIML API service temporarily unavailable. Please try again in a few moments.';
        }
        
        res.write(`event: error\ndata: ${JSON.stringify(errorMessage)}\n\n`);
        res.end();
    }
});



// SQL Validation API endpoint using AIML API
app.post('/validate-sql', async (req, res) => {
    const { sqlCode } = req.body;
    
    // Enhanced validation
    if (!sqlCode || typeof sqlCode !== 'string') {
        return res.status(400).json({ error: 'SQL code is required and must be a string' });
    }
    
    if (sqlCode.trim().length === 0) {
        return res.status(400).json({ error: 'SQL code cannot be empty' });
    }
    
    if (sqlCode.length > 5000) {
        return res.status(400).json({ error: 'SQL code too long. Please keep it under 5000 characters.' });
    }
    
    try {
        // Check if AIML API key is configured
        if (!process.env.AIMLAPI_KEY || process.env.AIMLAPI_KEY === '<YOUR_AIMLAPI_KEY>') {
            return res.status(500).json({ 
                error: 'AIML API key not configured. Please set AIMLAPI_KEY in environment variables.' 
            });
        }

        const completion = await aimlApi.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a SQL expert validator. Analyze SQL code for syntax errors, logical issues, and best practices. ALWAYS respond with ONLY a valid JSON object in this exact format: {"hasErrors": boolean, "errors": ["error1", "error2"], "suggestions": ["suggestion1", "suggestion2"], "correctedCode": "corrected SQL or null"}. Set hasErrors to true if there are ANY syntax errors, missing keywords, or logical issues. Set hasErrors to false only if the SQL is completely valid. Include specific error descriptions in the errors array. Do not include any text outside the JSON object.'
                },
                {
                    role: 'user',
                    content: `Please analyze this SQL code for errors and improvements:\n\n${sqlCode}`
                }
            ],
            max_tokens: 800,
            temperature: 0.3,
            stream: false
        });
        
        const aiResponse = completion.choices[0].message.content;
        
        try {
            // Try to parse the AI response as JSON
            const parsedResponse = JSON.parse(aiResponse);
            
            // Validate the parsed response structure
            if (typeof parsedResponse.hasErrors !== 'boolean' || 
                !Array.isArray(parsedResponse.errors) || 
                !Array.isArray(parsedResponse.suggestions)) {
                throw new Error('Invalid response format');
            }
            
            res.json(parsedResponse);
        } catch (parseError) {
            console.log('AI Response parsing failed:', aiResponse);
            
            // Improved fallback logic for non-JSON responses
            const lowerResponse = aiResponse.toLowerCase();
            const errorKeywords = ['error', 'incorrect', 'invalid', 'wrong', 'syntax error', 'missing', 'unexpected', 'problem'];
            const successKeywords = ['correct', 'valid', 'good', 'no errors', 'looks good', 'properly formatted', 'well-formed'];
            
            const hasErrorKeywords = errorKeywords.some(keyword => lowerResponse.includes(keyword));
            const hasSuccessKeywords = successKeywords.some(keyword => lowerResponse.includes(keyword));
            
            // More intelligent error detection
            let hasErrors = false;
            let errors = [];
            let suggestions = [];
            
            if (hasErrorKeywords && !hasSuccessKeywords) {
                hasErrors = true;
                errors = [aiResponse];
            } else if (hasSuccessKeywords && !hasErrorKeywords) {
                hasErrors = false;
                suggestions = ['Your SQL code looks good!'];
            } else {
                // Ambiguous response - treat as suggestion
                hasErrors = false;
                suggestions = [aiResponse];
            }
            
            res.json({
                hasErrors,
                errors,
                suggestions,
                correctedCode: null
            });
        }
        
    } catch (error) {
        console.error('AIML API Error:', error);
        
        let errorMessage = 'Failed to validate SQL code. Please try again later.';
        
        // More specific error handling
        if (error.message?.includes('API_KEY') || error.message?.includes('authentication') || error.status === 401) {
            errorMessage = 'Authentication issue detected. The AIML API service is temporarily unavailable.';
        } else if (error.message?.includes('quota') || error.message?.includes('limit') || error.status === 429) {
            errorMessage = 'API usage limit reached. Please try again later.';
        } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
            errorMessage = 'Network connection issue. Please check your internet connection and try again.';
        } else if (error.status === 400) {
            errorMessage = 'Invalid request format. Please check your SQL code.';
        } else if (error.status === 500) {
            errorMessage = 'AIML API service temporarily unavailable. Please try again in a few moments.';
        }
        
        res.status(500).json({ error: errorMessage });
    }
});

// Alternative SQL Validation API endpoint using AIML API
app.post('/validate-sql-aiml', async (req, res) => {
    const { sqlCode } = req.body;
    
    // Enhanced validation
    if (!sqlCode || typeof sqlCode !== 'string') {
        return res.status(400).json({ error: 'SQL code is required and must be a string' });
    }
    
    if (sqlCode.trim().length === 0) {
        return res.status(400).json({ error: 'SQL code cannot be empty' });
    }
    
    if (sqlCode.length > 5000) {
        return res.status(400).json({ error: 'SQL code too long. Please keep it under 5000 characters.' });
    }
    
    try {
        // Check if AIML API key is configured
        if (!process.env.AIMLAPI_KEY || process.env.AIMLAPI_KEY === '<YOUR_AIMLAPI_KEY>') {
            return res.status(500).json({ 
                error: 'AIML API key not configured. Please set AIMLAPI_KEY in environment variables.' 
            });
        }

        const completion = await aimlApi.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a SQL expert validator. Analyze SQL code for syntax errors, logical issues, and best practices. ALWAYS respond with ONLY a valid JSON object in this exact format: {"hasErrors": boolean, "errors": ["error1", "error2"], "suggestions": ["suggestion1", "suggestion2"], "correctedCode": "corrected SQL or null"}. Set hasErrors to true if there are ANY syntax errors, missing keywords, or logical issues. Set hasErrors to false only if the SQL is completely valid. Include specific error descriptions in the errors array. Do not include any text outside the JSON object.'
                },
                {
                    role: 'user',
                    content: `Please analyze this SQL code for errors and improvements:\n\n${sqlCode}`
                }
            ],
            max_tokens: 800,
            temperature: 0.3,
            stream: false
        });
        
        const aiResponse = completion.choices[0].message.content;
        
        try {
            // Try to parse the AI response as JSON
            const parsedResponse = JSON.parse(aiResponse);
            
            // Validate the parsed response structure
            if (typeof parsedResponse.hasErrors !== 'boolean' || 
                !Array.isArray(parsedResponse.errors) || 
                !Array.isArray(parsedResponse.suggestions)) {
                throw new Error('Invalid response format');
            }
            
            res.json(parsedResponse);
        } catch (parseError) {
            console.log('AI Response parsing failed:', aiResponse);
            
            // Improved fallback logic for non-JSON responses
            const lowerResponse = aiResponse.toLowerCase();
            const errorKeywords = ['error', 'incorrect', 'invalid', 'wrong', 'syntax error', 'missing', 'unexpected', 'problem'];
            const successKeywords = ['correct', 'valid', 'good', 'no errors', 'looks good', 'properly formatted', 'well-formed'];
            
            const hasErrorKeywords = errorKeywords.some(keyword => lowerResponse.includes(keyword));
            const hasSuccessKeywords = successKeywords.some(keyword => lowerResponse.includes(keyword));
            
            // More intelligent error detection
            let hasErrors = false;
            let errors = [];
            let suggestions = [];
            
            if (hasErrorKeywords && !hasSuccessKeywords) {
                hasErrors = true;
                errors = [aiResponse];
            } else if (hasSuccessKeywords && !hasErrorKeywords) {
                hasErrors = false;
                suggestions = ['Your SQL code looks good!'];
            } else {
                // Ambiguous response - treat as suggestion
                hasErrors = false;
                suggestions = [aiResponse];
            }
            
            res.json({
                hasErrors,
                errors,
                suggestions,
                correctedCode: null
            });
        }
        
    } catch (error) {
        console.error('AIML API Error:', error);
        
        let errorMessage = 'Failed to validate SQL code. Please try again later.';
        
        // More specific error handling
        if (error.message?.includes('API_KEY') || error.message?.includes('authentication') || error.status === 401) {
            errorMessage = 'Authentication issue detected. The AIML API service is temporarily unavailable.';
        } else if (error.message?.includes('quota') || error.message?.includes('limit') || error.status === 429) {
            errorMessage = 'API usage limit reached. Please try again later.';
        } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
            errorMessage = 'Network connection issue. Please check your internet connection and try again.';
        } else if (error.status === 400) {
            errorMessage = 'Invalid request format. Please check your SQL code.';
        } else if (error.status === 500) {
            errorMessage = 'AIML API service temporarily unavailable. Please try again in a few moments.';
        }
        
        res.status(500).json({ error: errorMessage });
    }
});

// Start the Server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
})