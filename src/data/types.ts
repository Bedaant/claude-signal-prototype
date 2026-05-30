export type SignalLevel = 'green' | 'yellow' | 'red';
export type CheckStatus = 'pass' | 'warn' | 'fail';

export interface SignalCheck {
  id: string;
  name: string;
  status: CheckStatus;
  icon: string;
  summary: string;
  detail: string;
  guidedVerification?: string;
}

export interface SignalResult {
  level: SignalLevel;
  label: string;
  itemCount: number;
  checks: SignalCheck[];
  notChecked: string[];
  timeSaved: string;
  reasoning?: {
    goal: string;
    approach: string;
    assumptions: Array<{
      id: string;
      type: string;
      category: string;
      assumption: string;
      confidence: 'high' | 'medium' | 'low';
      inferredFrom: string;
      line?: number;
      file?: string;
      status?: 'pending' | 'confirmed' | 'overridden';
    }>;
    assumptionCount: number;
    breakdown: { critical: number; medium: number; high: number };
  };
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  userPrompt: string;
  codeLanguage: string;
  codeOutput: string;
  explanation: string;
  signal: SignalResult;
}

export interface CalibrationState {
  interactionCount: number;
  overrideCount: number;
  issuesFromOverrides: number;
  signalStrength: 'default' | 'amplified' | 'reduced';
  message: string;
}
