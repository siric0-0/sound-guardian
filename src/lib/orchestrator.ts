import { SentrySignals, ArbiterDecision, AuditEntry, ScenarioId } from '../types.ts';

export interface OrchestratorState {
  scenarioId: ScenarioId;
  stepIndex: number;
  viewMode: 'member' | 'staff';
  lang: 'en' | 'es';
  largeText: boolean;
  memberActions: {
    frozen?: boolean;
    confirmedMover?: boolean;
    cancelledJames?: boolean;
    fastPathRequested?: boolean;
    scamReported?: boolean;
    reportedCaseId?: string;
    branchPriority?: boolean;
  };
  staffActions: {
    releasedPayments: string[];
    stoppedPayments: string[];
    createdCases: string[];
    recallRequested: string[];
  };
  auditLog: AuditEntry[];
  validationErrors: string[];
}

const STORAGE_KEY = 'sound_guardian_session_v1';

export const INITIAL_STATE: OrchestratorState = {
  scenarioId: 'sarah_ato',
  stepIndex: 0,
  viewMode: 'member',
  lang: 'en',
  largeText: false,
  memberActions: {},
  staffActions: {
    releasedPayments: [],
    stoppedPayments: [],
    createdCases: [],
    recallRequested: [],
  },
  auditLog: [],
  validationErrors: [],
};

export function loadSavedState(): OrchestratorState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_STATE, ...parsed };
  } catch (e) {
    console.warn('Failed to restore session state from localStorage', e);
    return INITIAL_STATE;
  }
}

export function saveState(state: OrchestratorState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save session state to localStorage', e);
  }
}

export function clearSavedState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear session state from localStorage', e);
  }
}

// Strict JSON Schema Validators
export function validateSentrySignals(data: any): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Sentry signals payload must be a non-null JSON object.' };
  }
  if (!data.member_token || typeof data.member_token !== 'string') {
    return { valid: false, error: 'Missing or invalid "member_token".' };
  }
  if (!data.payment_id || typeof data.payment_id !== 'string') {
    return { valid: false, error: 'Missing or invalid "payment_id".' };
  }
  if (typeof data.amount !== 'number' || isNaN(data.amount)) {
    return { valid: false, error: 'Missing or invalid "amount". Must be a number.' };
  }
  if (!data.rail || typeof data.rail !== 'string') {
    return { valid: false, error: 'Missing or invalid "rail".' };
  }
  if (!['New', 'Existing'].includes(data.recipient_status)) {
    return { valid: false, error: 'Invalid "recipient_status". Must be "New" or "Existing".' };
  }
  if (typeof data.password_reset_within_7d !== 'boolean') {
    return { valid: false, error: 'Invalid "password_reset_within_7d". Must be boolean.' };
  }
  if (!Array.isArray(data.contact_channel_changed_within_30d)) {
    return { valid: false, error: 'Invalid "contact_channel_changed_within_30d". Must be array.' };
  }
  if (typeof data.address_only_change_within_30d !== 'boolean') {
    return { valid: false, error: 'Invalid "address_only_change_within_30d". Must be boolean.' };
  }
  return { valid: true };
}

export function validateArbiterDecision(data: any): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Arbiter decision payload must be a non-null JSON object.' };
  }
  if (!data.payment_id || typeof data.payment_id !== 'string') {
    return { valid: false, error: 'Missing or invalid "payment_id".' };
  }
  if (!['QUARANTINE', 'LIGHT', 'NONE'].includes(data.tier)) {
    return { valid: false, error: 'Invalid "tier". Must be QUARANTINE, LIGHT, or NONE.' };
  }
  if (!['BLOCK_PAYEE_PENDING_CONFIRMATION', 'PAUSE_BEFORE_SEND', 'ONE_TAP_VERIFY', 'PROCESS_NORMALLY'].includes(data.action)) {
    return { valid: false, error: 'Invalid "action".' };
  }
  if (!data.reason_code || typeof data.reason_code !== 'string') {
    return { valid: false, error: 'Missing "reason_code".' };
  }
  if (!data.reason_plain || typeof data.reason_plain !== 'string') {
    return { valid: false, error: 'Missing "reason_plain".' };
  }
  if (typeof data.can_sound_stop !== 'boolean') {
    return { valid: false, error: 'Invalid "can_sound_stop". Must be boolean.' };
  }
  if (!Array.isArray(data.citations)) {
    return { valid: false, error: 'Invalid "citations". Must be array.' };
  }
  return { valid: true };
}
