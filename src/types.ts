export interface DemoEvent {
  event_id: string;
  synthetic_member_id: string;
  event_sequence: number;
  event_timestamp: string;
  day_of_week: string;
  event_category: string;
  event_type: string;
  channel: string;
  payment_id: string;
  payment_rail: string;
  amount: number;
  transaction_direction: string;
  recipient_id: string;
  recipient_status: 'New' | 'Existing' | '';
  recipient_age_days: number;
  days_since_last_same_rail: number;
  amount_to_baseline_ratio: number;
  amount_vs_member_baseline: string;
  payment_velocity_band: string;
  available_balance_after: number;
  profile_change_recent: number;
  password_reset_recent: number;
  trusted_contact_enrolled: number;
  warning_displayed: number;
  member_response: string;
  employee_interaction: string;
  case_open: number;
  payment_status: string;
  event_note: string;
}

export interface SentrySignals {
  member_token: string;
  payment_id: string;
  rail: string;
  amount: number;
  recipient_status: 'New' | 'Existing';
  recipient_age_days: number;
  password_reset_within_7d: boolean;
  contact_channel_changed_within_30d: ('Email' | 'Phone')[];
  address_only_change_within_30d: boolean;
  minutes_since_last_change: number;
  amount_to_baseline_ratio: number;
  source_event_ids: string[];
  trigger_event_type: 'Recipient Added' | 'Payment Initiated';
}

export type TierType = 'QUARANTINE' | 'LIGHT' | 'NONE';

export type ActionType =
  | 'BLOCK_PAYEE_PENDING_CONFIRMATION'
  | 'PAUSE_BEFORE_SEND'
  | 'ONE_TAP_VERIFY'
  | 'PROCESS_NORMALLY';

export interface ArbiterDecision {
  payment_id: string;
  tier: TierType;
  action: ActionType;
  reason_code: string;
  reason_plain: string;
  confirm_channel: 'PHONE_ON_FILE_BEFORE_CHANGE' | 'UNCHANGED_PHONE_ON_FILE' | 'NONE';
  confirm_target_masked: string;
  hold_expires_at: string | null;
  can_sound_stop: boolean;
  citations: string[];
  existing_risk_score?: number; // legacy risk score (e.g. 78/100)
  flagged_events?: { id: string; time: string; type: string; detail: string }[];
  rule_version?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor_role: string;
  action: string;
  case_id: string;
  reason_code: string;
  source_event_ids: string[];
  rule_version: string;
  who?: string;
  what?: string;
  reason?: string;
  payment_id?: string;
}

export interface AssistedNote {
  id: string;
  author: string;
  channel: string;
  timestamp: string;
  text: string;
}

export type ScenarioId = 'sarah_ato' | 'mover_legitimate' | 'james_branch';

export interface ScenarioDefinition {
  id: ScenarioId;
  memberId: string;
  name: string;
  personaTitle: string;
  verdict: 'CAUGHT' | 'RELEASED' | 'MISSED';
  summary: string;
  originalOutcome: string;
  guardianOutcome: string;
}
