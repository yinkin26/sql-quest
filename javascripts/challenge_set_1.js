export const challengeSet1 = [
    // ? EASY (8 questions)
    {
        id: 1, difficulty: "easy", type: "mcq", topic: "Intro to SQL",
        question: "What does SQL stand for?",
        options: ["Structured Query Language", "Simple Query Logic", "Standard Query Link"],
        answer: "Structured Query Language",
        score: 5
    },
    {
        id: 2, difficulty: "easy", type: "mcq", topic: "Intro to SQL",
        question: "Which command is used to retrieve data?",
        options: ["GET", "SELECT", "FETCH"],
        answer: "SELECT",
        score: 5
    },
    {
        id: 3, difficulty: "easy", type: "sql", topic: "SQL Syntax",
        question: "Select all records from the 'users' table.",
        expectedQuery: "SELECT * FROM users;",
        score: 5
    },
    {
        id: 4, difficulty: "easy", type: "mcq", topic: "SQL Data Types",
        question: "Which is the correct data type for storing text?",
        options: ["INT", "VARCHAR", "BOOLEAN"],
        answer: "VARCHAR",
        score: 5
    },
    {
        id: 5, difficulty: "easy", type: "mcq", topic: "SQL Data Types",
        question: "Which data type is used for true/false values?",
        options: ["TEXT", "BOOLEAN", "NUMBER"],
        answer: "BOOLEAN",
        score: 5
    },
    {
        id: 6, difficulty: "easy", type: "sql", topic: "SQL Syntax",
        question: "Write a SQL statement to get all columns from the 'products' table.",
        expectedQuery: "SELECT * FROM products;",
        score: 5
    },
    {
        id: 7, difficulty: "easy", type: "mcq", topic: "Intro to SQL",
        question: "SQL is used for...?",
        options: ["Designing web pages", "Managing databases", "Styling CSS"],
        answer: "Managing databases",
        score: 5
    },
    {
        id: 8, difficulty: "easy", type: "sql", topic: "SQL Data Types",
        question: "Select the 'email' column from 'customers'.",
        expectedQuery: "SELECT email FROM customers;",
        score: 5
    },

    // ?? MEDIUM (8 questions)
    {
        id: 9, difficulty: "medium", type: "sql", topic: "SQL Syntax",
        question: "Select name and age from 'users' table.",
        expectedQuery: "SELECT name, age FROM users;",
        score: 10
    },
    {
        id: 10, difficulty: "medium", type: "sql", topic: "SQL Data Types",
        question: "Select all rows from 'products' where price is above 100.",
        expectedQuery: "SELECT * FROM products WHERE price > 100;",
        score: 10
    },
    {
        id: 11, difficulty: "medium", type: "mcq", topic: "SQL Syntax",
        question: "Which keyword is used to remove duplicates in result?",
        options: ["DISTINCT", "UNIQUE", "REMOVE"],
        answer: "DISTINCT",
        score: 10
    },
    {
        id: 12, difficulty: "medium", type: "sql", topic: "SQL Syntax",
        question: "Select distinct department from 'employees'.",
        expectedQuery: "SELECT DISTINCT department FROM employees;",
        score: 10
    },
    {
        id: 13, difficulty: "medium", type: "sql", topic: "SQL Data Types",
        question: "Get all items with stock greater than or equal to 50.",
        expectedQuery: "SELECT * FROM items WHERE stock >= 50;",
        score: 10
    },
    {
        id: 14, difficulty: "medium", type: "mcq", topic: "SQL Data Types",
        question: "Which type stores floating-point numbers?",
        options: ["FLOAT", "INT", "CHAR"],
        answer: "FLOAT",
        score: 10
    },
    {
        id: 15, difficulty: "medium", type: "sql", topic: "SQL Syntax",
        question: "Select id and title from 'books' table.",
        expectedQuery: "SELECT id, title FROM books;",
        score: 10
    },
    {
        id: 16, difficulty: "medium", type: "sql", topic: "SQL Data Types",
        question: "Get users where age is not 30.",
        expectedQuery: "SELECT * FROM users WHERE age <> 30;",
        score: 10
    },

    // ?? HARD (8 questions)
    {
        id: 17, difficulty: "hard", type: "sql", topic: "SQL Syntax",
        question: "Write a SQL query to return all products sorted by price descending.",
        expectedQuery: "SELECT * FROM products ORDER BY price DESC;",
        score: 15
    },
    {
        id: 18, difficulty: "hard", type: "sql", topic: "SQL Syntax",
        question: "Select customers with age between 18 and 30.",
        expectedQuery: "SELECT * FROM customers WHERE age BETWEEN 18 AND 30;",
        score: 15
    },
    {
        id: 19, difficulty: "hard", type: "sql", topic: "SQL Syntax",
        question: "Select users where country is 'USA' and age is greater than 25.",
        expectedQuery: "SELECT * FROM users WHERE country = 'USA' AND age > 25;",
        score: 15
    },
    {
        id: 20, difficulty: "hard", type: "sql", topic: "SQL Data Types",
        question: "Select all rows where date_of_birth is not NULL.",
        expectedQuery: "SELECT * FROM users WHERE date_of_birth IS NOT NULL;",
        score: 15
    },
    {
        id: 21, difficulty: "hard", type: "sql", topic: "SQL Data Types",
        question: "Get products where description is not empty.",
        expectedQuery: "SELECT * FROM products WHERE description IS NOT NULL;",
        score: 15
    },
    {
        id: 22, difficulty: "hard", type: "sql", topic: "SQL Data Types",
        question: "Select all orders with status not 'cancelled'.",
        expectedQuery: "SELECT * FROM orders WHERE status <> 'cancelled';",
        score: 15
    },
    {
        id: 23, difficulty: "hard", type: "mcq", topic: "SQL Syntax",
        question: "Which SQL clause is used to sort the result set?",
        options: ["ORDER BY", "GROUP BY", "HAVING"],
        answer: "ORDER BY",
        score: 15
    },
    {
        id: 24, difficulty: "hard", type: "sql", topic: "SQL Syntax",
        question: "Write a SQL query to get all books with a title starting with 'A'.",
        expectedQuery: "SELECT * FROM books WHERE title LIKE 'A%';",
        score: 15
    }
];
