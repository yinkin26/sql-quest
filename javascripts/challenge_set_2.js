export const challengeSet2 = [
    // ? EASY (8 questions)
    {
        id: 25, difficulty: "easy", type: "sql", topic: "SQL Create Table",
        question: "Create a table named 'students' with columns id and name.",
        expectedQuery: "CREATE TABLE students (id INT, name VARCHAR(100));",
        score: 5
    },
    {
        id: 26, difficulty: "easy", type: "sql", topic: "SQL Insert Into",
        question: "Insert a student with id 1 and name 'Lily'.",
        expectedQuery: "INSERT INTO students (id, name) VALUES (1, 'Lily');",
        score: 5
    },
    {
        id: 27, difficulty: "easy", type: "mcq", topic: "SQL Select",
        question: "Which keyword is used to retrieve data in SQL?",
        options: ["SELECT", "RETRIEVE", "GET"],
        answer: "SELECT",
        score: 5
    },
    {
        id: 28, difficulty: "easy", type: "sql", topic: "SQL Insert Into",
        question: "Insert into 'products' a product with id 10 and name 'Chair'.",
        expectedQuery: "INSERT INTO products (id, name) VALUES (10, 'Chair');",
        score: 5
    },
    {
        id: 29, difficulty: "easy", type: "sql", topic: "SQL Create Table",
        question: "Create a table 'books' with id INT and title VARCHAR.",
        expectedQuery: "CREATE TABLE books (id INT, title VARCHAR(255));",
        score: 5
    },
    {
        id: 30, difficulty: "easy", type: "sql", topic: "SQL Select",
        question: "Select all from 'employees'.",
        expectedQuery: "SELECT * FROM employees;",
        score: 5
    },
    {
        id: 31, difficulty: "easy", type: "mcq", topic: "SQL Insert Into",
        question: "Which SQL keyword is used to add new data to a table?",
        options: ["ADD", "INSERT", "CREATE"],
        answer: "INSERT",
        score: 5
    },
    {
        id: 32, difficulty: "easy", type: "sql", topic: "SQL Create Table",
        question: "Create table 'categories' with only one column 'name'.",
        expectedQuery: "CREATE TABLE categories (name VARCHAR(100));",
        score: 5
    },

    // ?? MEDIUM (8 questions)
    {
        id: 33, difficulty: "medium", type: "sql", topic: "SQL Insert Into",
        question: "Insert 3 rows into 'products': (1, 'Pen'), (2, 'Pencil'), (3, 'Eraser').",
        expectedQuery: "INSERT INTO products (id, name) VALUES (1, 'Pen'), (2, 'Pencil'), (3, 'Eraser');",
        score: 10
    },
    {
        id: 34, difficulty: "medium", type: "sql", topic: "SQL Create Table",
        question: "Create table 'orders' with id, customer_name, and order_date.",
        expectedQuery: "CREATE TABLE orders (id INT, customer_name VARCHAR(100), order_date DATE);",
        score: 10
    },
    {
        id: 35, difficulty: "medium", type: "mcq", topic: "SQL Create Table",
        question: "Which data type stores dates?",
        options: ["TEXT", "DATETIME", "BOOLEAN"],
        answer: "DATETIME",
        score: 10
    },
    {
        id: 36, difficulty: "medium", type: "sql", topic: "SQL Select",
        question: "Select name and department from 'staff'.",
        expectedQuery: "SELECT name, department FROM staff;",
        score: 10
    },
    {
        id: 37, difficulty: "medium", type: "sql", topic: "SQL Insert Into",
        question: "Insert user with id 5, username 'admin', and email 'admin@email.com'.",
        expectedQuery: "INSERT INTO users (id, username, email) VALUES (5, 'admin', 'admin@email.com');",
        score: 10
    },
    {
        id: 38, difficulty: "medium", type: "sql", topic: "SQL Create Table",
        question: "Create 'payments' with id, amount (FLOAT), and paid (BOOLEAN).",
        expectedQuery: "CREATE TABLE payments (id INT, amount FLOAT, paid BOOLEAN);",
        score: 10
    },
    {
        id: 39, difficulty: "medium", type: "mcq", topic: "SQL Insert Into",
        question: "What clause is used to specify columns during insert?",
        options: ["VALUES", "FIELDS", "COLUMNS"],
        answer: "VALUES",
        score: 10
    },
    {
        id: 40, difficulty: "medium", type: "sql", topic: "SQL Select",
        question: "Select id and price from 'items'.",
        expectedQuery: "SELECT id, price FROM items;",
        score: 10
    },

    // ?? HARD (8 questions)
    {
        id: 41, difficulty: "hard", type: "sql", topic: "SQL Create Table",
        question: "Create table 'users' with id, username, email, registered_at (DATETIME), and is_active (BOOLEAN).",
        expectedQuery: "CREATE TABLE users (id INT, username VARCHAR(100), email VARCHAR(100), registered_at DATETIME, is_active BOOLEAN);",
        score: 15
    },
    {
        id: 42, difficulty: "hard", type: "sql", topic: "SQL Insert Into",
        question: "Insert 2 rows into 'customers': (1, 'Ali'), (2, 'Sara').",
        expectedQuery: "INSERT INTO customers (id, name) VALUES (1, 'Ali'), (2, 'Sara');",
        score: 15
    },
    {
        id: 43, difficulty: "hard", type: "sql", topic: "SQL Select",
        question: "Select all orders placed after Jan 1, 2024.",
        expectedQuery: "SELECT * FROM orders WHERE order_date > '2024-01-01';",
        score: 15
    },
    {
        id: 44, difficulty: "hard", type: "sql", topic: "SQL Select",
        question: "Select top 5 most expensive products from 'items'.",
        expectedQuery: "SELECT * FROM items ORDER BY price DESC LIMIT 5;",
        score: 15
    },
    {
        id: 45, difficulty: "hard", type: "sql", topic: "SQL Insert Into",
        question: "Insert into 'inventory' with default values except for 'name'.",
        expectedQuery: "INSERT INTO inventory (name) VALUES ('Widget');",
        score: 15
    },
    {
        id: 46, difficulty: "hard", type: "sql", topic: "SQL Create Table",
        question: "Create 'employees' with id, name, salary (FLOAT), and hire_date (DATE).",
        expectedQuery: "CREATE TABLE employees (id INT, name VARCHAR(100), salary FLOAT, hire_date DATE);",
        score: 15
    },
    {
        id: 47, difficulty: "hard", type: "sql", topic: "SQL Select",
        question: "Get all users with email ending in '@gmail.com'.",
        expectedQuery: "SELECT * FROM users WHERE email LIKE '%@gmail.com';",
        score: 15
    },
    {
        id: 48, difficulty: "hard", type: "sql", topic: "SQL Create Table",
        question: "Create 'feedback' table with id, message (TEXT), and rating (INT).",
        expectedQuery: "CREATE TABLE feedback (id INT, message TEXT, rating INT);",
        score: 15
    }
];
