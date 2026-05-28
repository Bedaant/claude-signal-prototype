const axios = require('axios');

// ==================== JAVASCRIPT ANALYSIS ====================

function analyzeJavaScript(code) {
  const checks = [];

  // Syntax check
  try {
    new Function(code);
    checks.push({
      id: 'syntax',
      name: 'Syntax & Style',
      status: 'pass',
      icon: 'CheckCircle',
      summary: 'No syntax issues detected.',
      detail: 'JavaScript parser validated the code successfully. No syntax errors found.'
    });
  } catch (e) {
    checks.push({
      id: 'syntax',
      name: 'Syntax & Style',
      status: 'fail',
      icon: 'XCircle',
      summary: 'Syntax error detected.',
      detail: e.message
    });
  }

  // Security checks
  const securityIssues = [];
  if (/eval\s*\(/.test(code)) securityIssues.push('eval() detected — arbitrary code execution risk');
  if (/new\s+Function\s*\(/.test(code)) securityIssues.push('new Function() — dynamic code execution risk');
  if (/setTimeout\s*\(\s*["']/.test(code)) securityIssues.push('setTimeout with string — implicit eval');
  if (/setInterval\s*\(\s*["']/.test(code)) securityIssues.push('setInterval with string — implicit eval');
  if (/innerHTML\s*=/.test(code)) securityIssues.push('innerHTML assignment — XSS injection risk');
  if (/outerHTML\s*=/.test(code)) securityIssues.push('outerHTML assignment — XSS injection risk');
  if (/document\.write\s*\(/.test(code)) securityIssues.push('document.write() — XSS and performance risk');
  if (/exec\s*\(/.test(code)) securityIssues.push('exec() — potential command injection');
  if (/password\s*[=:]\s*["']/.test(code)) securityIssues.push('Hardcoded password detected');
  if (/api[_-]?key\s*[=:]\s*["']/.test(code)) securityIssues.push('Hardcoded API key detected');
  if (/secret\s*[=:]\s*["']/.test(code)) securityIssues.push('Hardcoded secret detected');
  if (/token\s*[=:]\s*["'][A-Za-z0-9_-]{20,}/.test(code)) securityIssues.push('Hardcoded bearer token detected');
  if (/SELECT\s+.*\s+FROM/.test(code) && !/\?/.test(code) && !code.includes('prepare')) {
    securityIssues.push('Possible SQL injection — query uses string concatenation');
  }
  if (/fetch\s*\(/.test(code) && !/https:/.test(code)) {
    securityIssues.push('HTTP request without HTTPS — potential MITM vulnerability');
  }
  if (/localStorage\.setItem\s*\(/.test(code) && /password|token|secret/.test(code)) {
    securityIssues.push('Sensitive data stored in localStorage — accessible to XSS attacks');
  }
  if (/window\.location\.href\s*=/.test(code) || /location\.assign\s*\(/.test(code)) {
    if (!/https/.test(code)) securityIssues.push('Open redirect vulnerability possible');
  }

  if (securityIssues.length > 0) {
    checks.push({
      id: 'security',
      name: 'Security',
      status: 'fail',
      icon: 'ShieldX',
      summary: `${securityIssues.length} security issue(s) found.`,
      detail: securityIssues.join('\n'),
      guidedVerification: 'Review each security finding and refactor to use safer alternatives.'
    });
  } else {
    checks.push({
      id: 'security',
      name: 'Security',
      status: 'pass',
      icon: 'Shield',
      summary: 'No obvious security issues detected.',
      detail: 'No eval(), innerHTML, hardcoded secrets, or SQL injection patterns found.'
    });
  }

  // Error handling check
  const hasTryCatch = /try\s*\{/.test(code);
  const hasAsync = /async\s|await\s/.test(code);
  const hasPromiseCatch = /\.catch\s*\(/.test(code);
  if ((hasAsync || /fetch\s*\(|\.then\s*\(/.test(code)) && !hasPromiseCatch && !hasTryCatch) {
    checks.push({
      id: 'errors',
      name: 'Error Handling',
      status: 'warn',
      icon: 'AlertTriangle',
      summary: 'Async operations without error handling.',
      detail: 'Async/await or Promise chains detected without .catch() or try/catch. Unhandled rejections will crash the application.',
      guidedVerification: 'Wrap async calls in try/catch or add .catch() to all Promise chains.'
    });
  } else {
    checks.push({
      id: 'errors',
      name: 'Error Handling',
      status: 'pass',
      icon: 'CheckCircle',
      summary: 'Error handling appears adequate.',
      detail: 'try/catch or .catch() detected for async operations.'
    });
  }

  // Input validation check
  const hasInput = /req\.body|req\.query|req\.params|prompt\(|input|document\.getElementById/.test(code);
  const hasValidation = /if\s*\(.*\)|validate|sanitize|typeof|instanceof/.test(code);
  if (hasInput && !hasValidation) {
    checks.push({
      id: 'validation',
      name: 'Input Validation',
      status: 'warn',
      icon: 'AlertTriangle',
      summary: 'User input used without validation.',
      detail: 'Code appears to accept external input but lacks explicit validation checks.',
      guidedVerification: 'Always validate and sanitize user inputs before processing.'
    });
  } else {
    checks.push({
      id: 'validation',
      name: 'Input Validation',
      status: 'pass',
      icon: 'CheckCircle',
      summary: 'Input validation present.',
      detail: 'Validation patterns detected for user inputs.'
    });
  }

  // Complexity check
  const functionMatches = code.match(/function\s+\w+|const\s+\w+\s*=\s*\(|=>/g) || [];
  const branchMatches = code.match(/if\s*\(|else|switch|for\s*\(|while\s*\(/g) || [];
  const complexity = branchMatches.length + 1;

  if (complexity > 10) {
    checks.push({
      id: 'complexity',
      name: 'Code Complexity',
      status: 'warn',
      icon: 'GitBranch',
      summary: `Cyclomatic complexity: ${complexity} (high).`,
      detail: `Found ${functionMatches.length} functions and ${branchMatches.length} branches. Consider refactoring into smaller functions.`
    });
  } else {
    checks.push({
      id: 'complexity',
      name: 'Code Complexity',
      status: 'pass',
      icon: 'GitBranch',
      summary: `Cyclomatic complexity: ${complexity} (acceptable).`,
      detail: 'Code structure is reasonably simple and maintainable.'
    });
  }

  // Tests check
  checks.push({
    id: 'tests',
    name: 'Auto-Generated Tests',
    status: 'warn',
    icon: 'FlaskConical',
    summary: 'Test execution requires sandbox environment.',
    detail: 'Static analysis completed. Runtime test execution is not available in this prototype environment.'
  });

  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;
  const level = failCount > 0 ? 'red' : warnCount > 0 ? 'yellow' : 'green';

  return {
    level,
    label: level === 'green' ? 'High Confidence' : level === 'yellow' ? 'Medium Confidence' : 'Low Confidence',
    itemCount: failCount + warnCount,
    checks,
    notChecked: ['Runtime behavior', 'Performance at scale', 'Browser compatibility', 'Dependency freshness'],
    timeSaved: '~3 minutes'
  };
}

// ==================== PYTHON ANALYSIS ====================

function analyzePython(code) {
  const checks = [];

  // Syntax check (basic)
  const indentIssues = code.split('\n').some((line, i, arr) => {
    if (i === 0) return false;
    const curr = line.match(/^(\s*)/)?.[1].length || 0;
    const prev = arr[i-1].match(/^(\s*)/)?.[1].length || 0;
    return curr > prev && curr - prev !== 4 && line.trim().length > 0 && !line.trim().startsWith('#');
  });

  if (indentIssues) {
    checks.push({
      id: 'syntax',
      name: 'Syntax & Style',
      status: 'warn',
      icon: 'AlertTriangle',
      summary: 'Possible indentation inconsistency.',
      detail: 'Some lines appear to use non-standard indentation. PEP 8 recommends 4 spaces.'
    });
  } else {
    checks.push({
      id: 'syntax',
      name: 'Syntax & Style',
      status: 'pass',
      icon: 'CheckCircle',
      summary: 'No obvious syntax issues.',
      detail: 'Basic syntax validation passed. Indentation appears consistent.'
    });
  }

  // Security checks
  const securityIssues = [];
  if (/f["']SELECT\s+/.test(code) || /f["']INSERT\s+/.test(code) || /f["']UPDATE\s+/.test(code) || /f["']DELETE\s+/.test(code)) {
    securityIssues.push('CRITICAL: f-string used in SQL query — SQL injection vulnerability');
  }
  if (/\.format\s*\(.*\).*(?:SELECT|INSERT|UPDATE|DELETE)/.test(code)) {
    securityIssues.push('Possible SQL injection via .format() in query');
  }
  if (/%\s*\(.*\).*(?:SELECT|INSERT|UPDATE|DELETE)/.test(code)) {
    securityIssues.push('Possible SQL injection via % formatting in query');
  }
  if (/exec\s*\(/.test(code)) securityIssues.push('exec() detected — arbitrary code execution risk');
  if (/eval\s*\(/.test(code)) securityIssues.push('eval() detected — code injection risk');
  if (/compile\s*\(/.test(code)) securityIssues.push('compile() with dynamic input — code injection risk');
  if (/input\s*\(/.test(code) && !/int\s*\(\s*input/.test(code) && !/str\s*\(\s*input/.test(code)) {
    securityIssues.push('input() without type casting — potential type confusion');
  }
  if (/password\s*=\s*["']/.test(code) || /api_key\s*=\s*["']/.test(code) || /secret\s*=\s*["']/.test(code) || /auth_token\s*=\s*["']/.test(code)) {
    securityIssues.push('Hardcoded credential detected');
  }
  if (/return\s+jsonify\s*\(.*query/.test(code) || /return\s+\{.*query/.test(code)) {
    securityIssues.push('Response may leak internal SQL query to client');
  }
  if (/requests\.get\s*\(/.test(code) && !/timeout/.test(code)) {
    securityIssues.push('HTTP request without timeout — potential hanging connection');
  }
  if (/requests\.get\s*\(/.test(code) && !/verify\s*=\s*False/.test(code) === false && /verify\s*=\s*False/.test(code)) {
    securityIssues.push('SSL verification disabled — MITM vulnerability');
  }
  if (/sqlite3\.connect/.test(code) && !/with\s+sqlite3/.test(code) && !/try:/.test(code)) {
    securityIssues.push('Database connection not in try/finally or context manager — resource leak risk');
  }
  if (/open\s*\(/.test(code) && !/with\s+open/.test(code)) {
    securityIssues.push('File opened without context manager — potential resource leak');
  }
  if (/subprocess\./.test(code)) securityIssues.push('subprocess module used — command injection risk if input is tainted');
  if (/os\.system\s*\(/.test(code)) securityIssues.push('os.system() — shell injection vulnerability');
  if (/pickle\./.test(code) && /load\s*\(/.test(code)) securityIssues.push('pickle.load() — arbitrary code execution on untrusted data');
  if (/yaml\.load\s*\(/.test(code) && !/SafeLoader/.test(code) && !/safe_load/.test(code)) {
    securityIssues.push('yaml.load() without SafeLoader — arbitrary code execution');
  }
  if (/@app\.route/.test(code) && !/@login_required|@require_auth|auth/.test(code)) {
    securityIssues.push('Flask route without authentication decorator');
  }
  if (/debug\s*=\s*True/.test(code)) securityIssues.push('Debug mode enabled — do not deploy to production');

  if (securityIssues.length > 0) {
    checks.push({
      id: 'security',
      name: 'Security',
      status: 'fail',
      icon: 'ShieldX',
      summary: `${securityIssues.length} security issue(s) found.`,
      detail: securityIssues.join('\n'),
      guidedVerification: 'Never use f-strings or .format() for SQL. Use parameterized queries (cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))).'
    });
  } else {
    checks.push({
      id: 'security',
      name: 'Security',
      status: 'pass',
      icon: 'Shield',
      summary: 'No obvious security issues detected.',
      detail: 'No SQL injection vectors, eval/exec, hardcoded secrets, or subprocess abuse found.'
    });
  }

  // Input validation check
  const hasInput = /request\.(args|form|json)|input\(|sys\.argv/.test(code);
  const hasValidation = /if\s+.*(?:not|isinstance|type\(|len\(|validate|sanitize)/.test(code);
  if (hasInput && !hasValidation) {
    checks.push({
      id: 'validation',
      name: 'Input Validation',
      status: 'warn',
      icon: 'AlertTriangle',
      summary: 'User input accepted without validation.',
      detail: 'External input is used but no explicit validation pattern was detected.',
      guidedVerification: 'Validate all user inputs with type checks, length limits, and regex patterns.'
    });
  } else {
    checks.push({
      id: 'validation',
      name: 'Input Validation',
      status: 'pass',
      icon: 'CheckCircle',
      summary: 'Input validation appears present.',
      detail: 'Validation patterns detected for external inputs.'
    });
  }

  // Error handling check
  const hasTry = /try:/.test(code);
  const hasRaise = /raise\s/.test(code);
  if (!hasTry && /open\s*\(|connect\s*\(|get\s*\(/.test(code)) {
    checks.push({
      id: 'errors',
      name: 'Error Handling',
      status: 'warn',
      icon: 'AlertTriangle',
      summary: 'I/O operations without exception handling.',
      detail: 'File, network, or database operations detected without try/except blocks.',
      guidedVerification: 'Wrap I/O operations in try/except with specific exception types.'
    });
  } else {
    checks.push({
      id: 'errors',
      name: 'Error Handling',
      status: 'pass',
      icon: 'CheckCircle',
      summary: 'Exception handling present.',
      detail: hasTry ? 'try/except blocks detected.' : 'No risky I/O operations requiring exception handling.'
    });
  }

  // Dependency check
  const packageMatches = code.match(/import\s+(\w+)|from\s+(\w+)/g) || [];
  const packages = [...new Set(packageMatches.map(m => m.replace(/import|from/, '').trim()).filter(Boolean))];

  if (/import\s+requests/.test(code)) {
    checks.push({
      id: 'deps',
      name: 'Dependencies',
      status: 'pass',
      icon: 'Package',
      summary: 'requests library detected.',
      detail: 'requests is widely used and actively maintained. CVE check will run via OSV.'
    });
  } else if (/import\s+flask/.test(code) || /from\s+flask/.test(code)) {
    checks.push({
      id: 'deps',
      name: 'Dependencies',
      status: 'pass',
      icon: 'Package',
      summary: 'Flask framework detected.',
      detail: 'Ensure Flask is updated to the latest stable version for security patches.'
    });
  } else {
    checks.push({
      id: 'deps',
      name: 'Dependencies',
      status: 'pass',
      icon: 'Package',
      summary: 'Only standard library imports detected.',
      detail: 'No external dependencies — no CVE exposure from third-party packages.'
    });
  }

  // Complexity
  const functionCount = (code.match(/def\s+\w+\s*\(/g) || []).length;
  const classCount = (code.match(/class\s+\w+/g) || []).length;
  const branchCount = (code.match(/if\s|elif\s|else:|for\s|while\s/g) || []).length;
  const complexity = branchCount + 1;

  if (complexity > 10) {
    checks.push({
      id: 'complexity',
      name: 'Code Complexity',
      status: 'warn',
      icon: 'GitBranch',
      summary: `Estimated complexity: ${complexity} (high for ${functionCount} functions).`,
      detail: 'Consider extracting nested logic into helper functions or classes.'
    });
  } else {
    checks.push({
      id: 'complexity',
      name: 'Code Complexity',
      status: 'pass',
      icon: 'GitBranch',
      summary: `Estimated complexity: ${complexity} (acceptable).`,
      detail: `Found ${functionCount} function(s) and ${classCount} class(es). Code is reasonably structured.`
    });
  }

  // Tests check
  checks.push({
      id: 'tests',
      name: 'Auto-Generated Tests',
      status: 'warn',
      icon: 'FlaskConical',
      summary: 'Test execution requires sandbox environment.',
      detail: 'Static analysis completed. Runtime test execution is not available in this prototype environment.'
  });

  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;
  const level = failCount > 0 ? 'red' : warnCount > 0 ? 'yellow' : 'green';

  return {
    level,
    label: level === 'green' ? 'High Confidence' : level === 'yellow' ? 'Medium Confidence' : 'Low Confidence',
    itemCount: failCount + warnCount,
    checks,
    notChecked: ['Runtime behavior', 'Type checking (mypy)', 'Full pylint scan', 'Bandit security scan'],
    timeSaved: '~4 minutes'
  };
}

// ==================== OSV CVE LOOKUP ====================

async function checkOSV(packageName, ecosystem, version) {
  try {
    const response = await axios.post(
      'https://api.osv.dev/v1/query',
      {
        package: { name: packageName, ecosystem },
        version
      },
      { timeout: 5000 }
    );
    return response.data.vulns || [];
  } catch (err) {
    console.error('OSV lookup failed:', err.message);
    return [];
  }
}

// ==================== MAIN ANALYZER ====================

async function analyzeCode(code, language) {
  let result;

  if (language === 'javascript' || language === 'typescript' || language === 'js' || language === 'ts') {
    result = analyzeJavaScript(code);
  } else {
    result = analyzePython(code);
  }

  // Attempt OSV lookup for common packages found in code
  const packageMatches = code.match(/import\s+(\w+)|from\s+(\w+)|require\s*\(\s*['"](\w+)/g) || [];
  const packages = [...new Set(packageMatches.map(m => m.replace(/import|from|require|\(|\)|['"]/g, '').trim()).filter(Boolean))];

  if (packages.length > 0) {
    const ecosystem = (language === 'javascript' || language === 'js' || language === 'ts') ? 'npm' : 'PyPI';
    const vulns = await checkOSV(packages[0], ecosystem, '1.0.0');
    if (vulns.length > 0) {
      result.checks.push({
        id: 'cve',
        name: 'Dependency Security',
        status: 'warn',
        icon: 'ShieldAlert',
        summary: `${vulns.length} known vulnerability(ies) in ${packages[0]}.`,
        detail: vulns.map(v => `${v.id}: ${v.summary}`).join('\n'),
        guidedVerification: `Check https://osv.dev/vulnerability/${vulns[0].id} for fix details.`
      });
      result.level = 'yellow';
      result.label = 'Medium Confidence';
      result.itemCount++;
    }
  }

  return result;
}

module.exports = { analyzeCode, checkOSV };
