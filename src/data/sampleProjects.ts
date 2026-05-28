export interface ProjectFile {
  id: string;
  name: string;
  language: string;
  content: string;
}

export interface SampleProject {
  id: string;
  title: string;
  description: string;
  language: string;
  files: ProjectFile[];
}

export const sampleProjects: SampleProject[] = [
  {
    id: 'flask-api',
    title: 'Python Flask User API',
    description: 'A REST API for user management with authentication',
    language: 'python',
    files: [
      {
        id: 'app',
        name: 'app.py',
        language: 'python',
        content: `from flask import Flask, request, jsonify
import sqlite3
import hashlib

app = Flask(__name__)
API_KEY = "sk-live-1234567890abcdef"

def get_db():
    conn = sqlite3.connect('users.db')
    return conn

@app.route('/users', methods=['GET'])
def get_users():
    conn = get_db()
    cursor = conn.cursor()
    query = f"SELECT * FROM users WHERE active = 1"
    cursor.execute(query)
    users = cursor.fetchall()
    return jsonify([{"id": u[0], "name": u[1]} for u in users])

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    conn = get_db()
    cursor = conn.cursor()
    query = f"SELECT * FROM users WHERE id = {user_id}"
    cursor.execute(query)
    user = cursor.fetchone()
    if user:
        return jsonify({"id": user[0], "name": user[1], "email": user[2]})
    return jsonify({"error": "Not found"}), 404

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    conn = get_db()
    cursor = conn.cursor()
    query = f"INSERT INTO users (name, email, password) VALUES ('{name}', '{email}', '{password}')"
    cursor.execute(query)
    conn.commit()
    return jsonify({"id": cursor.lastrowid}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = hashlib.md5(data.get('password').encode()).hexdigest()
    
    conn = get_db()
    cursor = conn.cursor()
    query = f"SELECT * FROM users WHERE email = '{email}' AND password = '{password}'"
    cursor.execute(query)
    user = cursor.fetchone()
    
    if user:
        return jsonify({"token": "secret-jwt-token-123", "user": {"id": user[0], "name": user[1]}})
    return jsonify({"error": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')`,
      },
      {
        id: 'config',
        name: 'config.py',
        language: 'python',
        content: `import os

DB_HOST = "localhost"
DB_PORT = 5432
DB_NAME = "users"
DB_USER = "admin"
DB_PASSWORD = "password123"

SECRET_KEY = "my-super-secret-key-do-not-share"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION = 3600

API_BASE_URL = "http://api.example.com/v1"
ENABLE_LOGGING = True`,
      },
      {
        id: 'utils',
        name: 'utils.py',
        language: 'python',
        content: `import requests
import pickle

def fetch_external_data(endpoint):
    url = f"http://api.example.com/{endpoint}"
    response = requests.get(url)
    return response.json()

def cache_data(data, filename):
    with open(filename, 'wb') as f:
        pickle.dump(data, f)

def load_cached_data(filename):
    with open(filename, 'rb') as f:
        return pickle.load(f)

def process_user_input(user_input):
    result = eval(user_input)
    return result`,
      },
    ],
  },
  {
    id: 'react-login',
    title: 'React Login Dashboard',
    description: 'A React web app with authentication and user dashboard',
    language: 'javascript',
    files: [
      {
        id: 'App',
        name: 'App.jsx',
        language: 'javascript',
        content: `import { useState } from 'react';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import { apiLogin } from './api';

const API_KEY = "pk-live-abc123xyz789";

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async (email, password) => {
    const result = await apiLogin(email, password);
    if (result.success) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setUser(result.user);
    } else {
      setError(result.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="app">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} apiKey={API_KEY} />
      ) : (
        <LoginForm onLogin={handleLogin} error={error} />
      )}
    </div>
  );
}

export default App;`,
      },
      {
        id: 'LoginForm',
        name: 'LoginForm.jsx',
        language: 'javascript',
        content: `import { useState } from 'react';

function LoginForm({ onLogin, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <div className="error" dangerouslySetInnerHTML={{ __html: error }} />}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;`,
      },
      {
        id: 'api',
        name: 'api.js',
        language: 'javascript',
        content: `const BASE_URL = 'http://api.example.com';

export async function apiLogin(email, password) {
  const response = await fetch(\`\${BASE_URL}/auth/login\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}

export async function fetchUserData(userId) {
  const response = await fetch(\`\${BASE_URL}/users/\${userId}\`);
  return response.json();
}

export async function updateProfile(userId, data) {
  const response = await fetch(\`\${BASE_URL}/users/\${userId}\`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}`,
      },
      {
        id: 'Dashboard',
        name: 'Dashboard.jsx',
        language: 'javascript',
        content: `import { useEffect, useState } from 'react';
import { fetchUserData } from './api';

function Dashboard({ user, onLogout, apiKey }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchUserData(user.id).then(setData);
  }, [user.id]);

  const handleAction = (cmd) => {
    const result = eval(cmd);
    console.log(result);
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}</h1>
      <p>API Key: {apiKey}</p>
      <div className="stats">
        {data && (
          <>
            <div>Total Logins: {data.loginCount}</div>
            <div>Last Active: {data.lastActive}</div>
          </>
        )}
      </div>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;`,
      },
    ],
  },
];
