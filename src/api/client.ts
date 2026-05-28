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
  findings: Finding[];
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
  return post('/api/analyze', { code: files, language });
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
