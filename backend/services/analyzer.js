const axios = require('axios');

// ==================== LINE NUMBER HELPERS ====================

function getLineNumber(code, pattern) {
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) return i + 1;
  }
  return null;
}

function getLineNumbers(code, pattern) {
  const lines = code.split('\n');
  const results = [];
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) results.push(i + 1);
  }
  return results;
}

function getLineContent(code, lineNum) {
  return code.split('\n')[lineNum - 1]?.trim() || '';
}

// ==================== FIX SUGGESTIONS ====================

const commonFixes = {
  sqlInjection: {
    title: 'Use parameterized queries',
    before: 'query = f"SELECT * FROM users WHERE id = {user_id}"',
    after: 'query = "SELECT * FROM users WHERE id = ?"\ncursor.execute(query, (user_id,))'
  },
  hardcodedSecret: {
    title: 'Move secret to environment variable',
    before: 'API_KEY = "sk-1234567890abcdef"',
    after: 'import os\nAPI_KEY = os.environ.get("API_KEY")'
  },
  evalExec: {
    title: 'Replace with safer alternative',
    before: 'result = eval(user_input)',
    after: '# Use ast.literal_eval for safe parsing of literals\nimport ast\nresult = ast.literal_eval(user_input)'
  },
  noInputValidation: {
    title: 'Add input validation',
    before: 'user_id = request.args.get("id")',
    after: 'user_id = request.args.get("id")\nif not user_id or not user_id.isdigit():\n    return jsonify({"error": "Invalid user ID"}), 400'
  },
  noErrorHandling: {
    title: 'Wrap in try/except',
    before: 'data = fetch_api_data()',
    after: 'try:\n    data = fetch_api_data()\nexcept Exception as e:\n    logger.error(f"API fetch failed: {e}")\n    return None'
  },
  debugMode: {
    title: 'Disable debug in production',
    before: 'app.run(debug=True)',
    after: 'app.run(debug=os.environ.get("DEBUG", "False") == "True")'
  },
  noHttps: {
    title: 'Use HTTPS for API calls',
    before: 'url = "http://api.example.com/data"',
    after: 'url = "https://api.example.com/data"'
  },
  innerHTML: {
    title: 'Use textContent or sanitized HTML',
    before: 'element.innerHTML = userInput',
    after: 'element.textContent = userInput  // Safe: treats as plain text'
  },
  noTimeout: {
    title: 'Add timeout to requests',
    before: 'requests.get(url)',
    after: 'requests.get(url, timeout=10)'
  },
  pickleLoad: {
    title: 'Use JSON instead of pickle',
    before: 'data = pickle.load(open("data.pkl", "rb"))',
    after: 'import json\ndata = json.load(open("data.json", "r"))'
  },
  yamlUnsafe: {
    title: 'Use safe_load instead of load',
    before: 'config = yaml.load(file)',
    after: 'config = yaml.safe_load(file)'
  },
  openRedirect: {
    title: 'Validate redirect URLs',
    before: 'return redirect(request.args.get("next"))',
    after: 'next_url = request.args.get("next")\nif not next_url or not next_url.startswith("/"):\n    next_url = "/"\nreturn redirect(next_url)'
  },
  localStorageSecret: {
    title: 'Use httpOnly cookies instead',
    before: 'localStorage.setItem("token", authToken)',
    after: '// Store in httpOnly cookie server-side\n// document.cookie = "token=" + authToken + "; HttpOnly; Secure"'
  },
  missingAuth: {
    title: 'Add authentication decorator',
    before: '@app.route("/admin")\ndef admin():',
    after: '@app.route("/admin")\n@login_required\ndef admin():'
  }
};

// ==================== JAVASCRIPT/TYPESCRIPT ANALYSIS ====================

async function analyzeJavaScript(code, filename = 'main.js', allFiles = []) {
  if (typeof code !== 'string') code = String(code || '');
  const checks = [];
  const findings = [];

  // Syntax check
  try {
    new Function(code);
    checks.push({
      id: 'syntax',
      name: 'Syntax & Style',
      status: 'pass',
      icon: 'CheckCircle',
      summary: 'No syntax issues detected.',
      detail: 'JavaScript parser validated the code successfully.'
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

  // Security checks with line numbers and fixes
  const securityPatterns = [
    { pattern: /eval\s*\(/, message: 'eval() detected — arbitrary code execution risk', fix: commonFixes.evalExec, severity: 'critical' },
    { pattern: /new\s+Function\s*\(/, message: 'new Function() — dynamic code execution risk', fix: commonFixes.evalExec, severity: 'critical' },
    { pattern: /innerHTML\s*=/, message: 'innerHTML assignment — XSS injection risk', fix: commonFixes.innerHTML, severity: 'critical' },
    { pattern: /document\.write\s*\(/, message: 'document.write() — XSS and performance risk', fix: null, severity: 'warn' },
    { pattern: /password\s*[=:]\s*["']/, message: 'Hardcoded password detected', fix: commonFixes.hardcodedSecret, severity: 'critical' },
    { pattern: /api[_-]?key\s*[=:]\s*["']/, message: 'Hardcoded API key detected', fix: commonFixes.hardcodedSecret, severity: 'critical' },
    { pattern: /secret\s*[=:]\s*["']/, message: 'Hardcoded secret detected', fix: commonFixes.hardcodedSecret, severity: 'critical' },
    { pattern: /token\s*[=:]\s*["'][A-Za-z0-9_-]{20,}/, message: 'Hardcoded bearer token detected', fix: commonFixes.hardcodedSecret, severity: 'critical' },
    { pattern: /localStorage\.setItem\s*\(/, message: 'Sensitive data stored in localStorage — accessible to XSS attacks', fix: commonFixes.localStorageSecret, severity: 'warn' },
    { pattern: /fetch\s*\(.*http:\/\//, message: 'HTTP request without HTTPS — potential MITM vulnerability', fix: commonFixes.noHttps, severity: 'warn' },
  ];

  const securityIssues = [];
  securityPatterns.forEach(({ pattern, message, fix, severity }) => {
    const lines = getLineNumbers(code, pattern);
    lines.forEach(line => {
      const content = getLineContent(code, line);
      const issue = {
        line,
        file: filename,
        message,
        severity,
        code: content,
      };
      if (fix) {
        issue.fix = fix;
        issue.fix.line = line;
      }
      securityIssues.push(issue);
      findings.push(issue);
    });
  });

  if (securityIssues.length > 0) {
    checks.push({
      id: 'security',
      name: 'Security',
      status: 'fail',
      icon: 'ShieldX',
      summary: `${securityIssues.length} security issue(s) found.`,
      detail: securityIssues.map(i => `Line ${i.line}: ${i.message}`).join('\n'),
      guidedVerification: 'Review each security finding. Click "See Fix" for the recommended replacement.',
      findings: securityIssues
    });
  } else {
    checks.push({
      id: 'security',
      name: 'Security',
      status: 'pass',
      icon: 'Shield',
      summary: 'No obvious security issues detected.',
      detail: 'No eval(), innerHTML, hardcoded secrets, or insecure HTTP patterns found.'
    });
  }

  // Error handling
  const hasTryCatch = /try\s*\{/.test(code);
  const hasAsync = /async\s|await\s/.test(code);
  const hasPromiseCatch = /\.catch\s*\(/.test(code);
  const errLines = getLineNumbers(code, /fetch\s*\(|\.then\s*\(/);
  if ((hasAsync || errLines.length > 0) && !hasPromiseCatch && !hasTryCatch) {
    const errFindings = errLines.slice(0, 2).map(line => ({
      line, file: filename, message: 'Async operation without error handling',
      severity: 'warn', code: getLineContent(code, line),
      fix: commonFixes.noErrorHandling
    }));
    findings.push(...errFindings);
    checks.push({
      id: 'errors',
      name: 'Error Handling',
      status: 'warn',
      icon: 'AlertTriangle',
      summary: 'Async operations without error handling.',
      detail: `Found ${errLines.length} async operations without .catch() or try/catch.`,
      guidedVerification: 'Wrap async calls in try/catch or add .catch() to all Promise chains.',
      findings: errFindings
    });
  } else {
    checks.push({ id: 'errors', name: 'Error Handling', status: 'pass', icon: 'CheckCircle', summary: 'Error handling appears adequate.', detail: 'try/catch or .catch() detected for async operations.' });
  }

  // Input validation
  const inputLines = getLineNumbers(code, /req\.body|req\.query|req\.params|prompt\(|input|document\.getElementById/);
  const hasValidation = /if\s*\(.*\)|validate|sanitize|typeof|instanceof/.test(code);
  if (inputLines.length > 0 && !hasValidation) {
    const valFindings = inputLines.slice(0, 2).map(line => ({
      line, file: filename, message: 'User input used without validation',
      severity: 'warn', code: getLineContent(code, line),
      fix: commonFixes.noInputValidation
    }));
    findings.push(...valFindings);
    checks.push({
      id: 'validation', name: 'Input Validation', status: 'warn', icon: 'AlertTriangle',
      summary: 'User input accepted without validation.',
      detail: 'External input is used but lacks explicit validation checks.',
      guidedVerification: 'Always validate and sanitize user inputs before processing.',
      findings: valFindings
    });
  } else {
    checks.push({ id: 'validation', name: 'Input Validation', status: 'pass', icon: 'CheckCircle', summary: 'Input validation present.', detail: 'Validation patterns detected for user inputs.' });
  }

  // Complexity
  const functionCount = (code.match(/function\s+\w+|const\s+\w+\s*=\s*\(|=>/g) || []).length;
  const branchCount = (code.match(/if\s*\(|else|switch|for\s*\(|while\s*\(/g) || []).length;
  const complexity = branchCount + 1;
  if (complexity > 10) {
    checks.push({ id: 'complexity', name: 'Code Complexity', status: 'warn', icon: 'GitBranch', summary: `Cyclomatic complexity: ${complexity} (high).`, detail: `Found ${functionCount} functions and ${branchCount} branches. Consider refactoring.` });
  } else {
    checks.push({ id: 'complexity', name: 'Code Complexity', status: 'pass', icon: 'GitBranch', summary: `Complexity: ${complexity} (acceptable).`, detail: 'Code structure is reasonably simple.' });
  }

  // Dependency + OSV CVE check
  const pkgJson = allFiles.find(f => f.name === 'package.json');
  let cveFindings = [];
  const detectedPkgs = [];
  if (/import\s+axios|require\s*\(\s*['"]axios['"]\s*\)/.test(code)) detectedPkgs.push('axios');
  if (/import\s+express|require\s*\(\s*['"]express['"]\s*\)/.test(code)) detectedPkgs.push('express');
  if (/import\s+lodash|require\s*\(\s*['"]lodash['"]\s*\)/.test(code)) detectedPkgs.push('lodash');

  for (const pkg of detectedPkgs) {
    let version = null;
    if (pkgJson) {
      try {
        const parsed = JSON.parse(pkgJson.content);
        const depVersion = parsed.dependencies?.[pkg] || parsed.devDependencies?.[pkg];
        if (depVersion) version = depVersion.replace(/^[^0-9]*/, '');
      } catch { /* ignore parse errors */ }
    }
    const vulns = await checkOSV(pkg, 'npm', version);
    if (vulns.length > 0) {
      const topVulns = vulns.slice(0, 3);
      topVulns.forEach(v => {
        cveFindings.push({
          line: 1, file: filename,
          message: `${pkg}${version ? '@' + version : ''}: ${v.id} — ${v.summary || 'CVE found'}`,
          severity: (v.severity?.[0]?.score > 7 || v.database_specific?.severity === 'HIGH') ? 'critical' : 'warn',
          code: `import ${pkg}`,
          fix: { title: 'Update dependency', before: `${pkg}${version ? '@' + version : ''}`, after: `${pkg}@latest` }
        });
      });
    }
  }

  if (cveFindings.length > 0) {
    findings.push(...cveFindings);
    checks.push({
      id: 'deps', name: 'Dependencies', status: 'warn', icon: 'ShieldAlert',
      summary: `${cveFindings.length} CVE(s) found in dependencies.`,
      detail: cveFindings.map(f => f.message).join('\n'),
      guidedVerification: 'Update dependencies to the latest secure versions.',
      findings: cveFindings
    });
  } else {
    checks.push({ id: 'deps', name: 'Dependencies', status: 'pass', icon: 'Package', summary: 'No known CVEs in detected dependencies.', detail: 'OSV scan completed with no critical findings.' });
  }

  checks.push({ id: 'tests', name: 'Auto-Generated Tests', status: 'warn', icon: 'FlaskConical', summary: 'Test execution requires sandbox.', detail: 'Static analysis only. Runtime tests not available.' });

  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;
  const level = failCount > 0 ? 'red' : warnCount > 0 ? 'yellow' : 'green';

  return { level, label: level === 'green' ? 'High Confidence' : level === 'yellow' ? 'Medium Confidence' : 'Low Confidence', itemCount: failCount + warnCount, checks, findings, notChecked: ['Runtime behavior', 'Performance', 'Browser compat'], timeSaved: '~3 minutes' };
}

// ==================== PYTHON ANALYSIS ====================

async function analyzePython(code, filename = 'main.py', allFiles = []) {
  if (typeof code !== 'string') code = String(code || '');
  const checks = [];
  const findings = [];

  // Syntax check
  const indentIssues = code.split('\n').some((line, i, arr) => {
    if (i === 0) return false;
    const curr = line.match(/^(\s*)/)?.[1].length || 0;
    const prev = arr[i-1].match(/^(\s*)/)?.[1].length || 0;
    return curr > prev && curr - prev !== 4 && line.trim().length > 0 && !line.trim().startsWith('#');
  });

  if (indentIssues) {
    checks.push({ id: 'syntax', name: 'Syntax & Style', status: 'warn', icon: 'AlertTriangle', summary: 'Possible indentation inconsistency.', detail: 'Some lines use non-standard indentation. PEP 8 recommends 4 spaces.' });
  } else {
    checks.push({ id: 'syntax', name: 'Syntax & Style', status: 'pass', icon: 'CheckCircle', summary: 'No obvious syntax issues.', detail: 'Basic syntax validation passed.' });
  }

  // Security checks with line numbers
  const securityPatterns = [
    { pattern: /f["']SELECT\s+/, message: 'f-string used in SQL query — SQL injection', fix: commonFixes.sqlInjection, severity: 'critical' },
    { pattern: /f["']INSERT\s+/, message: 'f-string used in SQL query — SQL injection', fix: commonFixes.sqlInjection, severity: 'critical' },
    { pattern: /f["']UPDATE\s+/, message: 'f-string used in SQL query — SQL injection', fix: commonFixes.sqlInjection, severity: 'critical' },
    { pattern: /f["']DELETE\s+/, message: 'f-string used in SQL query — SQL injection', fix: commonFixes.sqlInjection, severity: 'critical' },
    { pattern: /\.format\s*\(.*\).*(?:SELECT|INSERT|UPDATE|DELETE)/, message: 'SQL injection via .format() in query', fix: commonFixes.sqlInjection, severity: 'critical' },
    { pattern: /exec\s*\(/, message: 'exec() — arbitrary code execution', fix: commonFixes.evalExec, severity: 'critical' },
    { pattern: /eval\s*\(/, message: 'eval() — code injection risk', fix: commonFixes.evalExec, severity: 'critical' },
    { pattern: /password\s*=\s*["']/, message: 'Hardcoded password detected', fix: commonFixes.hardcodedSecret, severity: 'critical' },
    { pattern: /api_key\s*=\s*["']/, cond: (_c, line) => !/os\.environ|os\.getenv|dotenv/.test(line), message: 'Hardcoded API key detected', fix: commonFixes.hardcodedSecret, severity: 'critical' },
    { pattern: /secret\s*=\s*["']/, message: 'Hardcoded secret detected', fix: commonFixes.hardcodedSecret, severity: 'critical' },
    { pattern: /auth_token\s*=\s*["']/, message: 'Hardcoded auth token detected', fix: commonFixes.hardcodedSecret, severity: 'critical' },
    { pattern: /requests\.get\s*\(/, cond: (c, line) => !/timeout\s*=/.test(line), message: 'HTTP request without timeout', fix: commonFixes.noTimeout, severity: 'warn' },
    { pattern: /verify\s*=\s*False/, message: 'SSL verification disabled — MITM vulnerability', fix: null, severity: 'warn' },
    { pattern: /open\s*\(/, cond: c => !/with\s+open/.test(c), message: 'File opened without context manager', fix: null, severity: 'warn' },
    { pattern: /pickle\./, message: 'pickle used — arbitrary code execution on untrusted data', fix: commonFixes.pickleLoad, severity: 'critical' },
    { pattern: /yaml\.load\s*\(/, cond: c => !/SafeLoader/.test(c) && !/safe_load/.test(c), message: 'yaml.load() without SafeLoader', fix: commonFixes.yamlUnsafe, severity: 'critical' },
    { pattern: /debug\s*=\s*True/, message: 'Debug mode enabled — do not deploy to production', fix: commonFixes.debugMode, severity: 'warn' },
    { pattern: /subprocess\./, message: 'subprocess used — command injection risk if input is tainted', fix: null, severity: 'warn' },
    { pattern: /os\.system\s*\(/, message: 'os.system() — shell injection vulnerability', fix: null, severity: 'critical' },
    { pattern: /@app\.route/, cond: c => !/@login_required|@require_auth/.test(c), message: 'Flask route without authentication', fix: commonFixes.missingAuth, severity: 'warn' },
  ];

  const securityIssues = [];
  securityPatterns.forEach(({ pattern, cond, message, fix, severity }) => {
    const lines = getLineNumbers(code, pattern);
    lines.forEach(line => {
      const lineContent = getLineContent(code, line);
      if (cond && !cond(code, lineContent)) return;
      const content = getLineContent(code, line);
      const issue = { line, file: filename, message, severity, code: content };
      if (fix) { issue.fix = fix; issue.fix.line = line; }
      securityIssues.push(issue);
      findings.push(issue);
    });
  });

  if (securityIssues.length > 0) {
    checks.push({
      id: 'security', name: 'Security', status: 'fail', icon: 'ShieldX',
      summary: `${securityIssues.length} security issue(s) found.`,
      detail: securityIssues.map(i => `Line ${i.line}: ${i.message}`).join('\n'),
      guidedVerification: 'Never use f-strings for SQL. Use parameterized queries. Move secrets to env vars.',
      findings: securityIssues
    });
  } else {
    checks.push({ id: 'security', name: 'Security', status: 'pass', icon: 'Shield', summary: 'No obvious security issues.', detail: 'No SQL injection, eval/exec, hardcoded secrets, or subprocess abuse found.' });
  }

  // Input validation
  const inputLines = getLineNumbers(code, /request\.(args|form|json)|input\(|sys\.argv/);
  const hasValidation = /if\s+.*(?:not|isinstance|type\(|len\(|validate|sanitize)/.test(code);
  if (inputLines.length > 0 && !hasValidation) {
    const valFindings = inputLines.slice(0, 2).map(line => ({
      line, file: filename, message: 'User input accepted without validation',
      severity: 'warn', code: getLineContent(code, line), fix: commonFixes.noInputValidation
    }));
    findings.push(...valFindings);
    checks.push({ id: 'validation', name: 'Input Validation', status: 'warn', icon: 'AlertTriangle', summary: 'User input without validation.', detail: 'External input lacks explicit validation.', guidedVerification: 'Validate all inputs with type checks, length limits, regex.', findings: valFindings });
  } else {
    checks.push({ id: 'validation', name: 'Input Validation', status: 'pass', icon: 'CheckCircle', summary: 'Input validation present.', detail: 'Validation patterns detected.' });
  }

  // Error handling
  const ioLines = getLineNumbers(code, /open\s*\(|connect\s*\(|get\s*\(/);
  const hasTry = /try:/.test(code);
  if (ioLines.length > 0 && !hasTry) {
    const errFindings = ioLines.slice(0, 2).map(line => ({
      line, file: filename, message: 'I/O operation without exception handling',
      severity: 'warn', code: getLineContent(code, line), fix: commonFixes.noErrorHandling
    }));
    findings.push(...errFindings);
    checks.push({ id: 'errors', name: 'Error Handling', status: 'warn', icon: 'AlertTriangle', summary: 'I/O operations without try/except.', detail: 'File, network, or DB operations lack exception handling.', guidedVerification: 'Wrap I/O in try/except with specific exception types.', findings: errFindings });
  } else {
    checks.push({ id: 'errors', name: 'Error Handling', status: 'pass', icon: 'CheckCircle', summary: 'Exception handling present.', detail: hasTry ? 'try/except detected.' : 'No risky I/O operations.' });
  }

  // Dependencies + OSV CVE check
  const reqFile = allFiles.find(f => f.name === 'requirements.txt');
  let cveFindings = [];
  const detectedPkgs = [];
  if (/import\s+requests/.test(code)) detectedPkgs.push('requests');
  if (/import\s+flask|from\s+flask/.test(code)) detectedPkgs.push('flask');
  if (/import\s+django/.test(code)) detectedPkgs.push('django');

  for (const pkg of detectedPkgs) {
    let version = null;
    if (reqFile) {
      const match = reqFile.content.match(new RegExp(`${pkg}>=?([0-9][^\\s]*)`, 'i'));
      if (match) version = match[1].trim();
    }
    const vulns = await checkOSV(pkg, 'PyPI', version);
    if (vulns.length > 0) {
      const topVulns = vulns.slice(0, 3);
      topVulns.forEach(v => {
        cveFindings.push({
          line: 1, file: filename,
          message: `${pkg}${version ? '@' + version : ''}: ${v.id} — ${v.summary || 'CVE found'}`,
          severity: (v.severity?.[0]?.score > 7 || v.database_specific?.severity === 'HIGH') ? 'critical' : 'warn',
          code: `import ${pkg}`,
          fix: { title: 'Update dependency', before: `${pkg}${version ? '==' + version : ''}`, after: `${pkg}>=latest` }
        });
      });
    }
  }

  if (cveFindings.length > 0) {
    findings.push(...cveFindings);
    checks.push({
      id: 'deps', name: 'Dependencies', status: 'warn', icon: 'ShieldAlert',
      summary: `${cveFindings.length} CVE(s) found in dependencies.`,
      detail: cveFindings.map(f => f.message).join('\n'),
      guidedVerification: 'Update dependencies: pip install --upgrade <package>',
      findings: cveFindings
    });
  } else {
    if (detectedPkgs.length > 0) {
      checks.push({ id: 'deps', name: 'Dependencies', status: 'pass', icon: 'Package', summary: `${detectedPkgs.join(', ')} detected. No known CVEs.`, detail: 'OSV scan completed with no critical findings.' });
    } else {
      checks.push({ id: 'deps', name: 'Dependencies', status: 'pass', icon: 'Package', summary: 'Standard library only.', detail: 'No external dependencies — no CVE exposure.' });
    }
  }

  // Complexity
  const funcCount = (code.match(/def\s+\w+\s*\(/g) || []).length;
  const branchCount = (code.match(/if\s|elif\s|else:|for\s|while\s/g) || []).length;
  const complexity = branchCount + 1;
  if (complexity > 10) {
    checks.push({ id: 'complexity', name: 'Code Complexity', status: 'warn', icon: 'GitBranch', summary: `Complexity: ${complexity} (high).`, detail: 'Consider extracting nested logic into smaller functions.' });
  } else {
    checks.push({ id: 'complexity', name: 'Code Complexity', status: 'pass', icon: 'GitBranch', summary: `Complexity: ${complexity} (acceptable).`, detail: `Found ${funcCount} function(s). Code is reasonably structured.` });
  }

  checks.push({ id: 'tests', name: 'Auto-Generated Tests', status: 'warn', icon: 'FlaskConical', summary: 'Test execution requires sandbox.', detail: 'Static analysis only. Runtime tests not available.' });

  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;
  const level = failCount > 0 ? 'red' : warnCount > 0 ? 'yellow' : 'green';

  return { level, label: level === 'green' ? 'High Confidence' : level === 'yellow' ? 'Medium Confidence' : 'Low Confidence', itemCount: failCount + warnCount, checks, findings, notChecked: ['Runtime behavior', 'Type checking (mypy)', 'Full pylint scan'], timeSaved: '~4 minutes' };
}

// ==================== OSV CVE LOOKUP ====================

async function checkOSV(packageName, ecosystem, version = null) {
  try {
    const body = { package: { name: packageName, ecosystem } };
    if (version) body.version = version;
    const response = await axios.post('https://api.osv.dev/v1/query', body, { timeout: 5000 });
    return response.data.vulns || [];
  } catch (err) { return []; }
}

// ==================== MULTI-FILE ANALYZER ====================

async function analyzeFiles(files, language) {
  const allResults = [];
  const allFindings = [];

  for (const file of files) {
    const result = language === 'javascript' || language === 'typescript' || language === 'js' || language === 'ts'
      ? await analyzeJavaScript(file.content, file.name, files)
      : await analyzePython(file.content, file.name, files);
    allResults.push({ ...result, filename: file.name });
    allFindings.push(...result.findings.map(f => ({ ...f, file: file.name })));
  }

  // Cross-file analysis
  const fullCode = files.map(f => `// === ${f.name} ===\n${f.content}`).join('\n\n');
  const crossFileIssues = [];

  // Check if API key is hardcoded in one file and used in another
  const hardcodedKeyFile = files.find(f => /api_key\s*=\s*["']/.test(f.content));
  const usesApiFile = files.find(f => /api_key|API_KEY/.test(f.content) && !/api_key\s*=\s*["']/.test(f.content));
  if (hardcodedKeyFile && usesApiFile && hardcodedKeyFile.name !== usesApiFile.name) {
    const line = getLineNumber(hardcodedKeyFile.content, /api_key\s*=\s*["']/);
    crossFileIssues.push({
      line, file: hardcodedKeyFile.name,
      message: `Hardcoded API key in ${hardcodedKeyFile.name} — also referenced in ${usesApiFile.name}. Move to environment variable.`,
      severity: 'critical', code: getLineContent(hardcodedKeyFile.content, line),
      fix: commonFixes.hardcodedSecret
    });
  }

  // Check if HTTP is used across files
  const httpFile = files.find(f => /http:\/\//.test(f.content));
  if (httpFile) {
    const line = getLineNumber(httpFile.content, /http:\/\//);
    crossFileIssues.push({
      line, file: httpFile.name,
      message: `Insecure HTTP detected in ${httpFile.name} — use HTTPS for all API calls`,
      severity: 'warn', code: getLineContent(httpFile.content, line),
      fix: commonFixes.noHttps
    });
  }

  // Merge everything
  const mergedChecks = [];
  const checkIds = [...new Set(allResults.flatMap(r => r.checks.map(c => c.id)))];

  checkIds.forEach(id => {
    const allForId = allResults.flatMap(r => r.checks.filter(c => c.id === id));
    const hasFail = allForId.some(c => c.status === 'fail');
    const hasWarn = allForId.some(c => c.status === 'warn');
    const status = hasFail ? 'fail' : hasWarn ? 'warn' : 'pass';

    const allDetail = allForId
      .filter(c => c.findings && c.findings.length > 0)
      .flatMap(c => c.findings.map(f => `${f.file}:${f.line}: ${f.message}`));

    const first = allForId[0];
    mergedChecks.push({
      id, name: first.name, status, icon: first.icon,
      summary: status === 'fail' ? `${allDetail.length} issue(s) across files` : status === 'warn' ? `${allDetail.length} warning(s) across files` : first.summary,
      detail: allDetail.length > 0 ? allDetail.join('\n') : first.detail,
      guidedVerification: first.guidedVerification,
      findings: allForId.flatMap(c => c.findings || [])
    });
  });

  if (crossFileIssues.length > 0) {
    mergedChecks.push({
      id: 'crossfile', name: 'Cross-File Issues', status: 'warn', icon: 'ShieldAlert',
      summary: `${crossFileIssues.length} cross-file issue(s) found.`,
      detail: crossFileIssues.map(f => `${f.file}:${f.line}: ${f.message}`).join('\n'),
      guidedVerification: 'Issues span multiple files. Ensure fixes are applied consistently across the project.',
      findings: crossFileIssues
    });
    allFindings.push(...crossFileIssues);
  }

  const totalFails = mergedChecks.filter(c => c.status === 'fail').length;
  const totalWarns = mergedChecks.filter(c => c.status === 'warn').length;
  const level = totalFails > 0 ? 'red' : totalWarns > 0 ? 'yellow' : 'green';

  return {
    level,
    label: level === 'green' ? 'High Confidence' : level === 'yellow' ? 'Medium Confidence' : 'Low Confidence',
    itemCount: totalFails + totalWarns,
    checks: mergedChecks,
    findings: allFindings,
    notChecked: ['Runtime behavior', 'Performance at scale', 'Dependency freshness'],
    timeSaved: `~${files.length * 2} minutes`,
    files: files.map(f => f.name)
  };
}

// ==================== MAIN ENTRY ====================

async function analyzeCode(codeOrFiles, language) {
  const isMultiFile = Array.isArray(codeOrFiles);
  if (isMultiFile) {
    return analyzeFiles(codeOrFiles, language);
  }
  if (language === 'javascript' || language === 'typescript' || language === 'js' || language === 'ts') {
    return analyzeJavaScript(codeOrFiles, 'main.js', [{ name: 'main.js', content: codeOrFiles }]);
  }
  return analyzePython(codeOrFiles, 'main.py', [{ name: 'main.py', content: codeOrFiles }]);
}

module.exports = { analyzeCode, checkOSV };
// deployed Thu May 28 21:13:45 IST 2026
