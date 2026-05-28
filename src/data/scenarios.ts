import { Scenario } from './types';

export const scenarios: Scenario[] = [
  {
    id: 'clean',
    title: 'Clean Code — All Checks Pass',
    description: 'A simple utility function with no issues detected.',
    userPrompt: 'Write a Python function that validates email addresses using regex and returns True/False',
    codeLanguage: 'python',
    codeOutput: `import re

def validate_email(email: str) -> bool:
    """Validate email address format.
    
    Args:
        email: The email address to validate.
        
    Returns:
        True if the email format is valid, False otherwise.
    """
    if not email or not isinstance(email, str):
        return False
    
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))`,
    explanation: "Here's a Python function that validates email addresses using a regex pattern. It includes input validation and handles edge cases:",
    signal: {
      level: 'green',
      label: 'High Confidence',
      itemCount: 0,
      checks: [
        { id: 'syntax', name: 'Syntax & Style', status: 'pass', icon: 'CheckCircle', summary: 'No issues found. Follows PEP 8.', detail: 'pylint score: 10/10. Type hints present. Docstring included.', guidedVerification: undefined },
        { id: 'security', name: 'Security', status: 'pass', icon: 'Shield', summary: 'No vulnerabilities detected.', detail: 'Bandit scan: 0 issues. No eval(), no SQL, no shell injection vectors.', guidedVerification: undefined },
        { id: 'deps', name: 'Dependencies', status: 'pass', icon: 'Package', summary: 're module is stdlib — no external dependencies.', detail: 'Only uses Python standard library. No CVE exposure.', guidedVerification: undefined },
        { id: 'tests', name: 'Auto-Generated Tests', status: 'pass', icon: 'FlaskConical', summary: '5/5 tests passed (valid, invalid, empty, None, special chars).', detail: 'Tests: valid@email.com ✓, invalid ✓, "" ✓, None ✓, test+tag@sub.domain.com ✓', guidedVerification: undefined },
        { id: 'complexity', name: 'Code Complexity', status: 'pass', icon: 'GitBranch', summary: 'Cyclomatic complexity: 2 (low).', detail: 'Single branch (if not email). Linear flow. Easy to maintain.', guidedVerification: undefined },
      ],
      notChecked: ['Business logic correctness', 'RFC 5322 full compliance'],
      timeSaved: '~2 minutes',
    }
  },
  {
    id: 'risky',
    title: 'Risky Code — CVE & Edge Case Found',
    description: 'API client code with a known vulnerability and missing error handling.',
    userPrompt: 'Write a Python function to fetch user data from a REST API and return parsed JSON',
    codeLanguage: 'python',
    codeOutput: `import requests

def fetch_user_data(user_id: int) -> dict:
    """Fetch user data from the API.
    
    Args:
        user_id: The user's ID.
        
    Returns:
        Dictionary containing user data.
    """
    url = f"https://api.example.com/users/{user_id}"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    
    response = requests.get(url, headers=headers)
    return response.json()`,
    explanation: "Here's a function that fetches user data from a REST API using the requests library:",
    signal: {
      level: 'yellow',
      label: 'Medium Confidence',
      itemCount: 2,
      checks: [
        { id: 'syntax', name: 'Syntax & Style', status: 'pass', icon: 'CheckCircle', summary: 'No syntax issues. Type hints present.', detail: 'pylint score: 8.5/10. Minor: API_KEY referenced but not defined in scope.', guidedVerification: undefined },
        { id: 'security', name: 'Dependency Security', status: 'warn', icon: 'ShieldAlert', summary: '⚠️ requests==2.28.1 has CVE-2023-32681 (SSRF vulnerability)', detail: 'CVE-2023-32681: Unintended leak of Proxy-Authorization header to destination servers. Severity: Medium (CVSS 6.1). Fix: Update to requests>=2.31.0. Source: OSV Database.', guidedVerification: 'Run: pip install requests>=2.31.0 and verify no breaking changes in your codebase.' },
        { id: 'deps', name: 'Dependencies', status: 'pass', icon: 'Package', summary: 'requests is widely used (50k+ GitHub stars).', detail: 'Latest stable: 2.31.0. Your version: 2.28.1 (outdated).', guidedVerification: undefined },
        { id: 'tests', name: 'Auto-Generated Tests', status: 'warn', icon: 'FlaskConical', summary: '⚠️ 3/5 tests passed. Test #4 fails: no error handling for non-200 responses.', detail: 'FAILED: fetch_user_data(99999) — API returns 404, response.json() raises ValueError. FAILED: fetch_user_data(-1) — No input validation for negative IDs. PASSED: valid user, auth header, JSON parsing.', guidedVerification: 'Add: response.raise_for_status() or check response.status_code before .json()' },
        { id: 'complexity', name: 'Code Complexity', status: 'pass', icon: 'GitBranch', summary: 'Cyclomatic complexity: 1 (very low — suspiciously low).', detail: 'No branching at all. No error handling, no retries, no timeout. This is a risk for production code.', guidedVerification: undefined },
      ],
      notChecked: ['Rate limiting', 'API timeout behavior', 'Cost implications of API calls', 'API_KEY security (hardcoded vs environment variable)'],
      timeSaved: '~4 minutes',
    }
  },
  {
    id: 'unsafe',
    title: 'Unsafe Code — Critical Issues Found',
    description: 'Database query function with SQL injection, no auth, and unsafe error handling.',
    userPrompt: 'Write a Python Flask endpoint that searches users by name in a SQLite database',
    codeLanguage: 'python',
    codeOutput: `from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

@app.route('/search')
def search_users():
    name = request.args.get('name')
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    query = f"SELECT * FROM users WHERE name LIKE '%{name}%'"
    cursor.execute(query)
    
    results = cursor.fetchall()
    conn.close()
    
    return jsonify({"users": results, "query": query})`,
    explanation: "Here's a Flask endpoint that searches for users by name in a SQLite database:",
    signal: {
      level: 'red',
      label: 'Low Confidence',
      itemCount: 5,
      checks: [
        { id: 'syntax', name: 'Syntax & Style', status: 'pass', icon: 'CheckCircle', summary: 'Syntactically valid Python.', detail: 'pylint score: 6.0/10. Missing docstrings. No type hints.', guidedVerification: undefined },
        { id: 'security', name: 'SQL Injection', status: 'fail', icon: 'ShieldX', summary: '🔴 CRITICAL: f-string SQL query is vulnerable to SQL injection.', detail: "Line 13: f\"SELECT * FROM users WHERE name LIKE '%{name}%'\" — User input directly interpolated into SQL. An attacker can input: ' OR 1=1 -- to dump entire database. Fix: Use parameterized queries: cursor.execute(\"SELECT * FROM users WHERE name LIKE ?\", (f\"%{name}%\",))", guidedVerification: 'NEVER use f-strings or string concatenation for SQL. Always use parameterized queries.' },
        { id: 'security2', name: 'Data Exposure', status: 'fail', icon: 'Eye', summary: '🔴 Response includes raw SQL query — leaks database schema to client.', detail: 'Line 18: "query": query — Returns the executed SQL to the API caller. This exposes table names, column structure, and confirms SQL injection success. Remove this field immediately.', guidedVerification: 'Never return internal queries, stack traces, or system info in API responses.' },
        { id: 'tests', name: 'Auto-Generated Tests', status: 'fail', icon: 'FlaskConical', summary: '🔴 1/5 tests passed. SQL injection test SUCCEEDED (vulnerability confirmed).', detail: 'CRITICAL: Injection payload "\' OR 1=1 --" returned ALL users. FAILED: No input validation (name=None crashes). FAILED: No authentication on endpoint. FAILED: Connection not in try/finally (resource leak). PASSED: Basic valid search.', guidedVerification: 'This code must not be deployed. Rewrite with parameterized queries, input validation, auth middleware, and proper connection handling.' },
        { id: 'auth', name: 'Authentication', status: 'fail', icon: 'LockOpen', summary: '🔴 No authentication. Any user can search the entire user database.', detail: 'The /search endpoint has no @login_required, no API key check, no rate limiting. This is an open data endpoint exposing user PII.', guidedVerification: 'Add authentication middleware (Flask-Login, JWT, or API key) and rate limiting.' },
        { id: 'complexity', name: 'Resource Management', status: 'warn', icon: 'GitBranch', summary: '⚠️ Database connection not in try/finally — will leak on errors.', detail: 'If cursor.execute() throws, conn.close() is never called. Use context manager: with sqlite3.connect("users.db") as conn:', guidedVerification: 'Use Python context managers (with statement) for all resource handling.' },
      ],
      notChecked: ['Deployment configuration', 'CORS settings', 'Rate limiting capacity'],
      timeSaved: '~8 minutes',
    }
  },
];

export const getScenario = (id: string): Scenario | undefined => {
  return scenarios.find((s) => s.id === id);
};
