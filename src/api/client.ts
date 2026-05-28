import { API_BASE_URL } from '../config';

const getBase = () => {
  if (API_BASE_URL) return API_BASE_URL;
  // Fallback for local development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  return '';
};

export interface GenerateResponse {
  code: string;
  explanation: string;
  language: string;
  prompt: string;
  model: string;
}

export interface Finding {
  line: number;
  file: string;
  message: string;
  severity: 'critical' | 'warn' | 'info';
  code: string;
  fix?: {
    title: string;
    before: string;
    after: string;
    line?: number;
  };
}

export interface AnalysisResponse {
  level: 'green' | 'yellow' | 'red';
  label: string;
  itemCount: number;
  checks: Array<{
    id: string;
    name: string;
    status: 'pass' | 'warn' | 'fail';
    icon: string;
    summary: string;
    detail: string;
    guidedVerification?: string;
    findings?: Finding[];
  }>;
  findings?: Finding[];
  notChecked: string[];
  timeSaved: string;
  files?: string[];
}

export interface CalibrationResponse {
  profile: {
    user_id: string;
    interaction_count: number;
    override_count: number;
    issues_from_overrides: number;
    signal_strength: string;
  };
  interactions: Array<{
    signal_level: string;
    override_decision: string;
    created_at: string;
  }>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const base = getBase();
  if (!base) throw new Error('API not configured');
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function generateCode(prompt: string, language: string): Promise<GenerateResponse> {
  return post('/api/generate', { prompt, language });
}

export async function analyzeCode(code: string, language: string): Promise<AnalysisResponse> {
  return post('/api/analyze', { code, language });
}

export async function analyzeFiles(files: { name: string; content: string }[], language: string): Promise<AnalysisResponse> {
  try {
    // Try multi-file analysis first (new backend)
    return await post('/api/analyze', { code: files, language });
  } catch {
    // Fallback: analyze each file individually and merge (old backend compatibility)
    const results = await Promise.all(files.map(f => analyzeCode(f.content, language)));

    const mergedChecks: AnalysisResponse['checks'] = [];
    const allFindings: Finding[] = [];
    const checkIds = [...new Set(results.flatMap(r => r.checks.map(c => c.id)))];

    checkIds.forEach(id => {
      const allForId = results.flatMap((r, idx) =>
        r.checks.filter(c => c.id === id).map(c => ({
          ...c,
          findings: (c.findings || []).map(f => ({ ...f, file: files[idx].name }))
        }))
      );
      const hasFail = allForId.some(c => c.status === 'fail');
      const hasWarn = allForId.some(c => c.status === 'warn');
      const status = hasFail ? 'fail' as const : hasWarn ? 'warn' as const : 'pass' as const;

      const allDetail = allForId
        .filter(c => c.findings && c.findings.length > 0)
        .flatMap(c => c.findings!.map(f => `${f.file}:${f.line}: ${f.message}`));

      const first = allForId[0];
      mergedChecks.push({
        id, name: first.name, status, icon: first.icon,
        summary: status === 'fail' ? `${allDetail.length} issue(s) across files` : status === 'warn' ? `${allDetail.length} warning(s) across files` : first.summary,
        detail: allDetail.length > 0 ? allDetail.join('\n') : first.detail,
        guidedVerification: first.guidedVerification,
        findings: allForId.flatMap(c => c.findings || [])
      });
    });

    allFindings.push(...mergedChecks.flatMap(c => c.findings || []));

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
}

export async function logOverride(userId: string, data: {
  prompt: string;
  generated_code: string;
  language: string;
  signal_level: string;
  override_decision: string;
}): Promise<void> {
  await post('/api/override', { user_id: userId, ...data });
}

export async function getCalibration(userId: string): Promise<CalibrationResponse> {
  const base = getBase();
  if (!base) throw new Error('API not configured');
  const res = await fetch(`${base}/api/calibration/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch calibration');
  return res.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const base = getBase();
    if (!base) return false;
    const res = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
