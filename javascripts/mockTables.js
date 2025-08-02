// mockTables.js - Reusable Mock Table Engine for SQL Learning Platform

const mockData = {
  // User management tables
  users: [
    { user_id: 1, username: "john_doe", email: "john@example.com", age: 28, created_at: "2024-05-01 10:30", is_active: true },
    { user_id: 2, username: "jane_smith", email: "jane@example.com", age: 34, created_at: "2024-06-15 11:45", is_active: true },
    { user_id: 3, username: "alice_wong", email: "alice@example.com", age: 25, created_at: "2024-07-20 14:00", is_active: false },
    { user_id: 4, username: "bob_wilson", email: "bob@example.com", age: 31, created_at: "2024-08-10 09:15", is_active: true }
  ],

  // Customer management tables
  customers: [
    { customer_id: 1, first_name: "John", last_name: "Doe", email: "john.doe@email.com", phone: "+1-555-0123", city: "New York", country: "USA" },
    { customer_id: 2, first_name: "Jane", last_name: "Smith", email: "jane.smith@email.com", phone: "+1-555-0456", city: "Los Angeles", country: "USA" },
    { customer_id: 3, first_name: "Alice", last_name: "Wong", email: null, phone: "+1-555-0789", city: "Toronto", country: "Canada" },
    { customer_id: 4, first_name: "Bob", last_name: "Wilson", email: "bob.wilson@email.com", phone: null, city: "London", country: "UK" },
    { customer_id: 5, first_name: "Maria", last_name: "Garcia", email: "maria.garcia@email.com", phone: "+1-555-0321", city: "Madrid", country: "Spain" }
  ],

  // E-commerce product tables
  products: [
    { product_id: 1, product_name: "Arcade Hat", price: 19.99, quantity: 12, category_id: 1, is_active: true },
    { product_id: 2, product_name: "Pixel Mug", price: 12.50, quantity: 34, category_id: 2, is_active: true },
    { product_id: 3, product_name: "Retro Keyboard", price: 89.99, quantity: 8, category_id: 1, is_active: true },
    { product_id: 4, product_name: "Gaming Mouse", price: 45.00, quantity: 0, category_id: 1, is_active: false }
  ],

  // Order management
  orders: [
    { order_id: 1, user_id: 1, product_id: 1, quantity: 2, order_date: "2024-09-01", status: "completed", total: 39.98 },
    { order_id: 2, user_id: 2, product_id: 2, quantity: 1, order_date: "2024-09-02", status: "pending", total: 12.50 },
    { order_id: 3, user_id: 1, product_id: 3, quantity: 1, order_date: "2024-09-03", status: "shipped", total: 89.99 }
  ],

  // Categories
  categories: [
    { category_id: 1, category_name: "Gaming Accessories", description: "Gaming peripherals and accessories" },
    { category_id: 2, category_name: "Drinkware", description: "Mugs, cups, and bottles" },
    { category_id: 3, category_name: "Apparel", description: "Clothing and wearables" }
  ],

  // Employee management
  employees: [
    { emp_id: 1, first_name: "Sarah", last_name: "Johnson", department: "Engineering", salary: 75000, hire_date: "2023-01-15" },
    { emp_id: 2, first_name: "Mike", last_name: "Chen", department: "Marketing", salary: 65000, hire_date: "2023-03-20" },
    { emp_id: 3, first_name: "Lisa", last_name: "Rodriguez", department: "Engineering", salary: 80000, hire_date: "2022-11-10" }
  ],

  // Banking/Finance
  accounts: [
    { account_id: 1, account_number: "ACC001", customer_name: "John Doe", balance: 2500.00, account_type: "checking" },
    { account_id: 2, account_number: "ACC002", customer_name: "Jane Smith", balance: 15000.00, account_type: "savings" },
    { account_id: 3, account_number: "ACC003", customer_name: "Bob Wilson", balance: 750.50, account_type: "checking" }
  ],

  // Student records
  students: [
    { student_id: 1, first_name: "Emma", last_name: "Davis", grade: "A", course: "Computer Science", enrollment_date: "2024-01-15" },
    { student_id: 2, first_name: "Alex", last_name: "Thompson", grade: "B+", course: "Mathematics", enrollment_date: "2024-01-20" },
    { student_id: 3, first_name: "Sofia", last_name: "Garcia", grade: "A-", course: "Computer Science", enrollment_date: "2024-02-01" }
  ],

  // Inventory management
  inventory: [
    { item_id: 1, item_name: "Laptop", quantity: 25, location: "Warehouse A", last_updated: "2024-09-15" },
    { item_id: 2, item_name: "Monitor", quantity: 40, location: "Warehouse B", last_updated: "2024-09-14" },
    { item_id: 3, item_name: "Keyboard", quantity: 100, location: "Warehouse A", last_updated: "2024-09-13" }
  ],

  // Database management examples
  databases: [
    { database_name: "ecommerce_prod", size_mb: 2048, status: "🟢 Active", last_backup: "2024-09-15 02:00" },
    { database_name: "user_analytics", size_mb: 1024, status: "🟢 Active", last_backup: "2024-09-15 02:30" },
    { database_name: "temp_testing", size_mb: 256, status: "🟡 Outdated", last_backup: "2024-08-20 10:00" },
    { database_name: "old_backup", size_mb: 512, status: "🔴 Unused", last_backup: "2024-07-01 12:00" }
  ],

  // Index examples
  indexes: [
    { index_name: "idx_users_email", table_name: "users", column_name: "email", index_type: "UNIQUE", cardinality: 1000 },
    { index_name: "idx_products_category", table_name: "products", column_name: "category_id", index_type: "BTREE", cardinality: 5 },
    { index_name: "idx_orders_date", table_name: "orders", column_name: "order_date", index_type: "BTREE", cardinality: 365 }
  ],

  // View examples
  views: [
    { view_name: "active_users", base_tables: "users", description: "Users with is_active = true" },
    { view_name: "product_summary", base_tables: "products, categories", description: "Products with category names" },
    { view_name: "order_details", base_tables: "orders, users, products", description: "Complete order information" }
  ],

  // View performance analysis data
  viewPerformance: [
    { aspect: "🔍 Query Complexity", impact: "Complex views can be slow", best_practice: "Keep views simple, use indexes on base tables" },
    { aspect: "🔄 Nested Views", impact: "Views based on other views", best_practice: "Avoid deep nesting, limit to 2-3 levels" },
    { aspect: "📊 Aggregations", impact: "COUNT, SUM, AVG can be expensive", best_practice: "Consider materialized views or caching" },
    { aspect: "🔗 Multiple Joins", impact: "Many table joins slow performance", best_practice: "Ensure proper indexes on join columns" },
    { aspect: "📈 Large Datasets", impact: "Views on large tables can timeout", best_practice: "Add WHERE clauses, use LIMIT when appropriate" }
  ],

  // Before/After examples for ALTER TABLE
  users_before: [
    { user_id: 1, username: "john_doe", email: "john@example.com", created_at: "2024-05-01 10:30" },
    { user_id: 2, username: "jane_smith", email: "jane@example.com", created_at: "2024-06-15 11:45" }
  ],

  users_after: [
    { user_id: 1, username: "john_doe", email: "john@example.com", age: 28, phone: "+1-555-0123", created_at: "2024-05-01 10:30" },
    { user_id: 2, username: "jane_smith", email: "jane@example.com", age: 34, phone: "+1-555-0456", created_at: "2024-06-15 11:45" }
  ],

  // Employee table structure for ALTER TABLE examples
  employees_before: [
    { column_name: "id", data_type: "INT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
    { column_name: "first_name", data_type: "VARCHAR(50)", constraints: "NOT NULL" },
    { column_name: "last_name", data_type: "VARCHAR(50)", constraints: "NOT NULL" },
    { column_name: "email", data_type: "VARCHAR(100)", constraints: "UNIQUE" },
    { column_name: "hire_date", data_type: "DATE", constraints: "NOT NULL" }
  ],

  employees_after: [
    { column_name: "id", data_type: "INT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
    { column_name: "first_name", data_type: "VARCHAR(50)", constraints: "NOT NULL" },
    { column_name: "last_name", data_type: "VARCHAR(50)", constraints: "NOT NULL" },
    { column_name: "email", data_type: "VARCHAR(150)", constraints: "UNIQUE" },
    { column_name: "hire_date", data_type: "DATE", constraints: "NOT NULL" },
    { column_name: "department_id", data_type: "INT", constraints: "FOREIGN KEY" },
     { column_name: "salary", data_type: "DECIMAL(10,2)", constraints: "CHECK (salary > 0)" },
     { column_name: "phone", data_type: "VARCHAR(15)", constraints: "NULL" }
   ],

  // Database cleanup scenario for DROP DATABASE
  databaseCleanup: [
    { database_name: "ecommerce_prod", purpose: "Production data", status: "🟢 Active", action: "🚫 KEEP - Never drop!" },
    { database_name: "ecommerce_test", purpose: "Testing environment", status: "🟡 Outdated", action: "🗑️ Safe to drop" },
    { database_name: "temp_experiment", purpose: "Developer testing", status: "🔴 Unused", action: "🗑️ Should drop" },
    { database_name: "backup_2023", purpose: "Old backup copy", status: "🔴 Obsolete", action: "🗑️ Can drop safely" }
  ]
};

// Main function to display mock tables
export function displayMockTable(tableKey, targetId = "mockTableOutput") {
  // Auto-detect target ID based on table key if not specified
  if (targetId === "mockTableOutput") {
    const autoTargets = {
      'customers': 'customersTableOutput',
      'orders': 'ordersTableOutput'
    };
    if (autoTargets[tableKey]) {
      targetId = autoTargets[tableKey];
    }
  }
  
  const output = document.getElementById(targetId);
  const rows = mockData[tableKey];
  
  if (!output) {
    console.error(`Target element with ID '${targetId}' not found`);
    return;
  }
  
  if (!rows || rows.length === 0) {
    output.innerHTML = `<p style="color: #ff6b6b; text-align: center; padding: 20px;">⚠️ No mock data available for '${tableKey}'</p>`;
    return;
  }

  // Build HTML table with pixel-art styling
  let html = `
    <div class="mock-table-container" style="margin: 20px 0; border: 2px solid #00ffff; border-radius: 8px; overflow: hidden;">
      <div style="background: rgba(0, 255, 255, 0.1); padding: 10px; border-bottom: 1px solid #00ffff;">
        <h4 style="color: #00ffff; margin: 0; font-family: 'Press Start 2P', monospace; font-size: 12px;">📊 Mock Table: ${tableKey}</h4>
      </div>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-family: 'Courier New', monospace; font-size: 11px;">
          <thead>
            <tr style="background: rgba(0, 255, 255, 0.2);">`;
  
  // Add headers
  Object.keys(rows[0]).forEach(col => {
    html += `<th style="padding: 8px; border: 1px solid #4a5568; color: #00ffff; text-align: left;">${col}</th>`;
  });
  
  html += `</tr></thead><tbody>`;
  
  // Add data rows
  rows.forEach((row, index) => {
    const bgColor = index % 2 === 0 ? 'rgba(26, 32, 44, 0.5)' : 'rgba(45, 55, 72, 0.5)';
    html += `<tr style="background: ${bgColor};">`;
    Object.values(row).forEach(value => {
      html += `<td style="padding: 8px; border: 1px solid #4a5568; color: #e2e8f0;">${value}</td>`;
    });
    html += `</tr>`;
  });
  
  html += `</tbody></table></div></div>`;
  output.innerHTML = html;
}

// Function to display side-by-side comparison (for ALTER TABLE examples)
export function displayBeforeAfter(beforeKey, afterKey, targetId = "mockTableOutput") {
  const output = document.getElementById(targetId);
  
  if (!output) {
    console.error(`Target element with ID '${targetId}' not found`);
    return;
  }
  
  const beforeData = mockData[beforeKey];
  const afterData = mockData[afterKey];
  
  if (!beforeData || !afterData) {
    output.innerHTML = `<p style="color: #ff6b6b;">⚠️ Missing data for comparison</p>`;
    return;
  }
  
  let html = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
      <div>
        <h4 style="color: #ffd700; margin-bottom: 10px;">📋 Before (${beforeKey})</h4>
        <div id="beforeTable"></div>
      </div>
      <div>
        <h4 style="color: #98fb98; margin-bottom: 10px;">✨ After (${afterKey})</h4>
        <div id="afterTable"></div>
      </div>
    </div>`;
  
  output.innerHTML = html;
  
  // Display both tables
  setTimeout(() => {
    displayMockTable(beforeKey, 'beforeTable');
    displayMockTable(afterKey, 'afterTable');
  }, 100);
}

// Mock database state management
let mockDatabaseState = {
  'ecommerce_prod': { exists: true, canDrop: false },
  'ecommerce_test': { exists: true, canDrop: true },
  'temp_experiment': { exists: true, canDrop: true },
  'backup_2023': { exists: true, canDrop: true },
  'sample_database': { exists: false, canDrop: false }
};

// Function to simulate CREATE DATABASE
export function simulateCreateDatabase(dbName, targetId = "mockTableOutput") {
  const output = document.getElementById(targetId);
  
  if (!output) {
    console.error(`Target element with ID '${targetId}' not found`);
    return;
  }
  
  if (mockDatabaseState[dbName] && mockDatabaseState[dbName].exists) {
    output.innerHTML = `
      <div style="background: rgba(255, 193, 7, 0.2); border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin: 10px 0;">
        <p style="color: #ffc107; margin: 0;">⚠️ <strong>Error:</strong> Database '${dbName}' already exists!</p>
        <p style="color: #fff3cd; margin: 5px 0 0 0; font-size: 0.9em;">💡 Try: CREATE DATABASE IF NOT EXISTS ${dbName};</p>
      </div>`;
  } else {
    // Create the database
    mockDatabaseState[dbName] = { exists: true, canDrop: true };
    output.innerHTML = `
      <div style="background: rgba(40, 167, 69, 0.2); border: 1px solid #28a745; border-radius: 8px; padding: 15px; margin: 10px 0;">
        <p style="color: #28a745; margin: 0;">✅ <strong>Success:</strong> Database '${dbName}' created successfully!</p>
        <p style="color: #d4edda; margin: 5px 0 0 0; font-size: 0.9em;">🎯 You can now use this database or drop it safely.</p>
      </div>`;
  }
}

// Function to simulate DROP DATABASE with proper error handling
export function simulateDropDatabase(dbName, useIfExists = false, targetId = "mockTableOutput") {
  const output = document.getElementById(targetId);
  
  if (!output) {
    console.error(`Target element with ID '${targetId}' not found`);
    return;
  }
  
  const dbState = mockDatabaseState[dbName];
  
  if (!dbState || !dbState.exists) {
    if (useIfExists) {
      output.innerHTML = `
        <div style="background: rgba(40, 167, 69, 0.2); border: 1px solid #28a745; border-radius: 8px; padding: 15px; margin: 10px 0;">
          <p style="color: #28a745; margin: 0;">✅ <strong>Success:</strong> DROP DATABASE IF EXISTS executed</p>
          <p style="color: #d4edda; margin: 5px 0 0 0; font-size: 0.9em;">💡 Database '${dbName}' doesn't exist, but no error occurred due to IF EXISTS clause.</p>
        </div>`;
    } else {
      output.innerHTML = `
        <div style="background: rgba(220, 53, 69, 0.2); border: 1px solid #dc3545; border-radius: 8px; padding: 15px; margin: 10px 0;">
          <p style="color: #dc3545; margin: 0;">❌ <strong>Error: ER_DB_DROP_EXISTS:</strong> Can't drop database '${dbName}'; database doesn't exist</p>
          <p style="color: #f8d7da; margin: 5px 0 0 0; font-size: 0.9em;">💡 Try: DROP DATABASE IF EXISTS ${dbName}; or create the database first.</p>
        </div>`;
    }
    return;
  }
  
  if (!dbState.canDrop) {
    output.innerHTML = `
      <div style="background: rgba(220, 53, 69, 0.2); border: 1px solid #dc3545; border-radius: 8px; padding: 15px; margin: 10px 0;">
        <p style="color: #dc3545; margin: 0;">🚫 <strong>Error:</strong> Cannot drop database '${dbName}' - insufficient privileges or protected database</p>
        <p style="color: #f8d7da; margin: 5px 0 0 0; font-size: 0.9em;">⚠️ Production databases are protected from deletion.</p>
      </div>`;
    return;
  }
  
  // Successfully drop the database
  mockDatabaseState[dbName].exists = false;
  output.innerHTML = `
    <div style="background: rgba(255, 107, 107, 0.2); border: 1px solid #ff6b6b; border-radius: 8px; padding: 15px; margin: 10px 0;">
      <p style="color: #ff6b6b; margin: 0;">🗑️ <strong>Database '${dbName}' dropped successfully!</strong></p>
      <p style="color: #ffcccc; margin: 5px 0 0 0; font-size: 0.9em;">⚠️ All data has been permanently deleted. This action cannot be undone!</p>
      <p style="color: #a0a0a0; margin: 5px 0 0 0; font-size: 0.8em;">💡 This is just a simulation - no real database was harmed!</p>
    </div>`;
}

// Function to simulate database drop (legacy function for backward compatibility)
export function simulateDrop(tableKey, targetId = "mockTableOutput") {
  const output = document.getElementById(targetId);
  
  if (!output) {
    console.error(`Target element with ID '${targetId}' not found`);
    return;
  }
  
  // First show the table
  displayMockTable(tableKey, targetId);
  
  // After 2 seconds, show "dropped" message
  setTimeout(() => {
    output.innerHTML = `
      <div style="text-align: center; padding: 40px; border: 2px dashed #ff6b6b; border-radius: 8px; background: rgba(255, 107, 107, 0.1);">
        <h3 style="color: #ff6b6b; margin: 0;">🗑️ Table '${tableKey}' has been dropped</h3>
        <p style="color: #e2e8f0; margin: 10px 0 0 0;">All data has been permanently deleted</p>
      </div>`;
  }, 2000);
}

// Function to show current database state
export function showDatabaseState(targetId = "mockTableOutput") {
  const output = document.getElementById(targetId);
  
  if (!output) {
    console.error(`Target element with ID '${targetId}' not found`);
    return;
  }
  
  let html = `
    <div style="background: rgba(26, 32, 44, 0.8); border: 1px solid #4a5568; border-radius: 8px; padding: 15px; margin: 10px 0;">
      <h4 style="color: #00ffff; margin-top: 0;">📋 Current Database State</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #4a5568;">
            <th style="text-align: left; padding: 8px; color: #00ffff;">Database</th>
            <th style="text-align: left; padding: 8px; color: #00ffff;">Status</th>
            <th style="text-align: left; padding: 8px; color: #00ffff;">Can Drop</th>
          </tr>
        </thead>
        <tbody>`;
  
  Object.entries(mockDatabaseState).forEach(([dbName, state]) => {
    const status = state.exists ? '🟢 Exists' : '🔴 Not Found';
    const canDrop = state.canDrop ? '✅ Yes' : '🚫 Protected';
    html += `
      <tr style="border-bottom: 1px solid #4a5568;">
        <td style="padding: 8px;"><code style="color: #00ffff;">${dbName}</code></td>
        <td style="padding: 8px; color: #e2e8f0;">${status}</td>
        <td style="padding: 8px; color: #e2e8f0;">${canDrop}</td>
      </tr>`;
  });
  
  html += `</tbody></table></div>`;
  output.innerHTML = html;
}

// Make functions globally available
window.displayMockTable = displayMockTable;
window.displayBeforeAfter = displayBeforeAfter;
window.simulateDrop = simulateDrop;
window.simulateCreateDatabase = simulateCreateDatabase;
window.simulateDropDatabase = simulateDropDatabase;
window.showDatabaseState = showDatabaseState;

// Export for module usage
export { mockData };