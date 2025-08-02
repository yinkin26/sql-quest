export const challengeSet4 = [
    // ? EASY (8 questions)
    {
        id: 73, difficulty: "easy", type: "sql", topic: "SQL Order By",
        question: "Select all students ordered by age ascending.",
        expectedQuery: "SELECT * FROM students ORDER BY age ASC;",
        score: 5
    },
    {
        id: 74, difficulty: "easy", type: "sql", topic: "SQL Limit",
        question: "Select the first 5 users.",
        expectedQuery: "SELECT * FROM users LIMIT 5;",
        score: 5
    },
    {
        id: 75, difficulty: "easy", type: "sql", topic: "SQL IS NULL",
        question: "Select all books with no author assigned.",
        expectedQuery: "SELECT * FROM books WHERE author IS NULL;",
        score: 5
    },
    {
        id: 76, difficulty: "easy", type: "mcq", topic: "SQL Aliases",
        question: "What does the AS keyword do in SQL?",
        options: ["Create table", "Create alias", "Join table"],
        answer: "Create alias",
        score: 5
    },
    {
        id: 77, difficulty: "easy", type: "sql", topic: "SQL Order By",
        question: "Get all products ordered by price descending.",
        expectedQuery: "SELECT * FROM products ORDER BY price DESC;",
        score: 5
    },
    {
        id: 78, difficulty: "easy", type: "sql", topic: "SQL Aliases",
        question: "Select username from users and rename it to 'User'.",
        expectedQuery: "SELECT username AS User FROM users;",
        score: 5
    },
    {
        id: 79, difficulty: "easy", type: "sql", topic: "SQL Limit",
        question: "Get top 10 most recent transactions.",
        expectedQuery: "SELECT * FROM transactions ORDER BY date DESC LIMIT 10;",
        score: 5
    },
    {
        id: 80, difficulty: "easy", type: "sql", topic: "SQL IS NULL",
        question: "Find employees with no manager assigned.",
        expectedQuery: "SELECT * FROM employees WHERE manager_id IS NULL;",
        score: 5
    },

    // ?? MEDIUM (8 questions)
    {
        id: 81, difficulty: "medium", type: "sql", topic: "SQL Order By",
        question: "Get top 5 products sorted by rating and price descending.",
        expectedQuery: "SELECT * FROM products ORDER BY rating DESC, price DESC LIMIT 5;",
        score: 10
    },
    {
        id: 82, difficulty: "medium", type: "sql", topic: "SQL Aliases",
        question: "Rename 'email' to 'ContactEmail' from users.",
        expectedQuery: "SELECT email AS ContactEmail FROM users;",
        score: 10
    },
    {
        id: 83, difficulty: "medium", type: "sql", topic: "SQL Limit / Offset",
        question: "Skip the first 10 orders and show the next 5.",
        expectedQuery: "SELECT * FROM orders LIMIT 5 OFFSET 10;",
        score: 10
    },
    {
        id: 84, difficulty: "medium", type: "sql", topic: "SQL IS NULL",
        question: "Get all customers with no phone number registered.",
        expectedQuery: "SELECT * FROM customers WHERE phone IS NULL;",
        score: 10
    },
    {
        id: 85, difficulty: "medium", type: "sql", topic: "SQL Order By",
        question: "Sort staff by department ascending, and salary descending.",
        expectedQuery: "SELECT * FROM staff ORDER BY department ASC, salary DESC;",
        score: 10
    },
    {
        id: 86, difficulty: "medium", type: "mcq", topic: "SQL Limit",
        question: "What does LIMIT do in SQL?",
        options: ["Deletes rows", "Limits number of returned rows", "Sorts data"],
        answer: "Limits number of returned rows",
        score: 10
    },
    {
        id: 87, difficulty: "medium", type: "sql", topic: "SQL Aliases",
        question: "Use alias to rename 'price' as 'Cost' in the output.",
        expectedQuery: "SELECT price AS Cost FROM items;",
        score: 10
    },
    {
        id: 88, difficulty: "medium", type: "sql", topic: "SQL IS NULL",
        question: "Select users whose phone IS NOT NULL.",
        expectedQuery: "SELECT * FROM users WHERE phone IS NOT NULL;",
        score: 10
    },

    // ?? HARD (8 questions)
    {
        id: 89, difficulty: "hard", type: "sql", topic: "SQL Order By",
        question: "Order movies by rating descending and title ascending.",
        expectedQuery: "SELECT * FROM movies ORDER BY rating DESC, title ASC;",
        score: 15
    },
    {
        id: 90, difficulty: "hard", type: "sql", topic: "SQL IS NULL",
        question: "Get employees where department IS NULL and manager_id IS NOT NULL.",
        expectedQuery: "SELECT * FROM employees WHERE department IS NULL AND manager_id IS NOT NULL;",
        score: 15
    },
    {
        id: 91, difficulty: "hard", type: "sql", topic: "SQL Aliases",
        question: "Select product name and alias it as 'ItemName'.",
        expectedQuery: "SELECT name AS ItemName FROM products;",
        score: 15
    },
    {
        id: 92, difficulty: "hard", type: "sql", topic: "SQL Order By",
        question: "Get all invoices sorted by date descending, amount ascending.",
        expectedQuery: "SELECT * FROM invoices ORDER BY date DESC, amount ASC;",
        score: 15
    },
    {
        id: 93, difficulty: "hard", type: "sql", topic: "SQL Limit / Offset",
        question: "Select rows 21 to 30 from 'students'.",
        expectedQuery: "SELECT * FROM students LIMIT 10 OFFSET 20;",
        score: 15
    },
    {
        id: 94, difficulty: "hard", type: "sql", topic: "SQL Aliases",
        question: "Use aliases for 'name' and 'score' as 'Player' and 'Points'.",
        expectedQuery: "SELECT name AS Player, score AS Points FROM leaderboard;",
        score: 15
    },
    {
        id: 95, difficulty: "hard", type: "sql", topic: "SQL IS NULL",
        question: "Select contacts where email IS NULL or phone IS NULL.",
        expectedQuery: "SELECT * FROM contacts WHERE email IS NULL OR phone IS NULL;",
        score: 15
    },
    {
        id: 96, difficulty: "hard", type: "sql", topic: "SQL IS NULL",
        question: "Select tasks with no due date but a priority assigned.",
        expectedQuery: "SELECT * FROM tasks WHERE due_date IS NULL AND priority IS NOT NULL;",
        score: 15
    }
];