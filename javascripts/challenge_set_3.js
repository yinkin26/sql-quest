export const challengeSet3 = [
    // ? EASY (8 questions)
    {
        id: 49, difficulty: "easy", type: "sql", topic: "SQL Select Distinct",
        question: "Select unique categories from 'products'.",
        expectedQuery: "SELECT DISTINCT category FROM products;",
        score: 5
    },
    {
        id: 50, difficulty: "easy", type: "sql", topic: "SQL Where Clause",
        question: "Select all users whose country is 'Malaysia'.",
        expectedQuery: "SELECT * FROM users WHERE country = 'Malaysia';",
        score: 5
    },
    {
        id: 51, difficulty: "easy", type: "sql", topic: "SQL And / Or / Not",
        question: "Get all products where stock is above 50 AND price under 100.",
        expectedQuery: "SELECT * FROM products WHERE stock > 50 AND price < 100;",
        score: 5
    },
    {
        id: 52, difficulty: "easy", type: "sql", topic: "SQL Where Clause",
        question: "Find orders where status is 'shipped'.",
        expectedQuery: "SELECT * FROM orders WHERE status = 'shipped';",
        score: 5
    },
    {
        id: 53, difficulty: "easy", type: "sql", topic: "SQL Where Clause",
        question: "Get employees with salary above 2000.",
        expectedQuery: "SELECT * FROM employees WHERE salary > 2000;",
        score: 5
    },
    {
        id: 54, difficulty: "easy", type: "mcq", topic: "SQL Select Distinct",
        question: "What does SELECT DISTINCT do?",
        options: ["Removes duplicates", "Sorts rows", "Filters NULLs"],
        answer: "Removes duplicates",
        score: 5
    },
    {
        id: 55, difficulty: "easy", type: "sql", topic: "SQL And / Or / Not",
        question: "Find users in 'UK' or 'USA'.",
        expectedQuery: "SELECT * FROM users WHERE country = 'UK' OR country = 'USA';",
        score: 5
    },
    {
        id: 56, difficulty: "easy", type: "sql", topic: "SQL And / Or / Not",
        question: "Find players with level above 5 and coins below 500.",
        expectedQuery: "SELECT * FROM players WHERE level > 5 AND coins < 500;",
        score: 5
    },

    // ?? MEDIUM (8 questions)
    {
        id: 57, difficulty: "medium", type: "sql", topic: "SQL Select Distinct",
        question: "Select distinct job titles from 'employees'.",
        expectedQuery: "SELECT DISTINCT job_title FROM employees;",
        score: 10
    },
    {
        id: 58, difficulty: "medium", type: "sql", topic: "SQL Where Clause",
        question: "Get all orders where amount is over 100 and status is 'paid'.",
        expectedQuery: "SELECT * FROM orders WHERE amount > 100 AND status = 'paid';",
        score: 10
    },
    {
        id: 59, difficulty: "medium", type: "sql", topic: "SQL Where Clause",
        question: "Get products priced between 10 and 100.",
        expectedQuery: "SELECT * FROM products WHERE price BETWEEN 10 AND 100;",
        score: 10
    },
    {
        id: 60, difficulty: "medium", type: "sql", topic: "SQL Where Clause",
        question: "Get users not from 'India'.",
        expectedQuery: "SELECT * FROM users WHERE country <> 'India';",
        score: 10
    },
    {
        id: 61, difficulty: "medium", type: "sql", topic: "SQL And / Or / Not",
        question: "Select players where level > 5 OR gems > 100.",
        expectedQuery: "SELECT * FROM players WHERE level > 5 OR gems > 100;",
        score: 10
    },
    {
        id: 62, difficulty: "medium", type: "sql", topic: "SQL And / Or / Not",
        question: "Select users not from 'Japan' and with age < 30.",
        expectedQuery: "SELECT * FROM users WHERE NOT country = 'Japan' AND age < 30;",
        score: 10
    },
    {
        id: 63, difficulty: "medium", type: "mcq", topic: "SQL Where Clause",
        question: "What operator checks inequality?",
        options: ["<>", "!=", "= !"],
        answer: "<>",
        score: 10
    },
    {
        id: 64, difficulty: "medium", type: "sql", topic: "SQL Where Clause",
        question: "Select customers whose name starts with 'A'.",
        expectedQuery: "SELECT * FROM customers WHERE name LIKE 'A%';",
        score: 10
    },

    // ?? HARD (8 questions)
    {
        id: 65, difficulty: "hard", type: "sql", topic: "SQL Select Distinct",
        question: "Select distinct cities from 'addresses' where country = 'USA'.",
        expectedQuery: "SELECT DISTINCT city FROM addresses WHERE country = 'USA';",
        score: 15
    },
    {
        id: 66, difficulty: "hard", type: "sql", topic: "SQL Where Clause",
        question: "Get orders where status is NOT 'pending' and amount >= 500.",
        expectedQuery: "SELECT * FROM orders WHERE status <> 'pending' AND amount >= 500;",
        score: 15
    },
    {
        id: 67, difficulty: "hard", type: "sql", topic: "SQL Where Clause",
        question: "Select users where email ends with '@yahoo.com'.",
        expectedQuery: "SELECT * FROM users WHERE email LIKE '%@yahoo.com';",
        score: 15
    },
    {
        id: 68, difficulty: "hard", type: "sql", topic: "SQL Select Distinct",
        question: "Select distinct genres from 'movies' with year > 2015.",
        expectedQuery: "SELECT DISTINCT genre FROM movies WHERE year > 2015;",
        score: 15
    },
    {
        id: 69, difficulty: "hard", type: "sql", topic: "SQL And / Or / Not",
        question: "Select items where quantity < 20 or sold_out is true.",
        expectedQuery: "SELECT * FROM items WHERE quantity < 20 OR sold_out = TRUE;",
        score: 15
    },
    {
        id: 70, difficulty: "hard", type: "sql", topic: "SQL And / Or / Not",
        question: "Get staff not in 'HR' and with salary over 4000.",
        expectedQuery: "SELECT * FROM staff WHERE NOT department = 'HR' AND salary > 4000;",
        score: 15
    },
    {
        id: 71, difficulty: "hard", type: "sql", topic: "SQL Select Distinct",
        question: "Select distinct makers of phones priced above 1000.",
        expectedQuery: "SELECT DISTINCT maker FROM phones WHERE price > 1000;",
        score: 15
    },
    {
        id: 72, difficulty: "hard", type: "sql", topic: "SQL Where Clause",
        question: "Get all users with NULL phone numbers.",
        expectedQuery: "SELECT * FROM users WHERE phone IS NULL;",
        score: 15
    }
];
