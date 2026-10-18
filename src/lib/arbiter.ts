import { SentrySignals, ArbiterDecision, TierType, ActionType } from '../types.ts';
import rulesConfig from '../config/rules.config.json';

export function runArbiter(signals: SentrySignals): ArbiterDecision {
  const {
    payment_id,
    rail,
    password_reset_within_7d,
    contact_channel_changed_within_30d,
    address_only_change_within_30d,
    recipient_status,
    trigger_event_type,
    amount,
  } = signals;

  const hasContactChannelChange =
    contact_channel_changed_within_30d.includes('Email') ||
    contact_channel_changed_within_30d.includes('Phone');

  // Rule 1: QUARANTINE Tier
  // Shifts left to RECIPIENT ADDED: payee cannot receive money until confirmed via pre-change contact info
  if (
    password_reset_within_7d &&
    hasContactChannelChange &&
    (recipient_status === 'New' || trigger_event_type === 'Recipient Added')
  ) {
    const citations = [
      `password_reset_within_${rulesConfig.windows.password_reset_days}d`,
      ...contact_channel_changed_within_30d.map((c) => `${c} Change`),
      'recipient_enrolled (New 0d)',
      `sound_pre_change_${rulesConfig.windows.pre_change_lookup_days}d_contact_history`,
    ];

    const flaggedEvents = [
      {
        id: 'EVT-RESET',
        time: '22:09:00',
        type: 'Password Reset',
        detail: 'Self-service credentials reset via mobile user agent',
      },
      {
        id: 'EVT-EMAIL',
        time: '22:14:00',
        type: 'Email Change',
        detail: 'Primary email redirected; security notice routed to old email',
      },
      {
        id: 'EVT-PHONE',
        time: '22:15:00',
        type: 'Phone Change',
        detail: 'Primary phone updated to unrecognized mobile number',
      },
      {
        id: 'EVT-PAYEE',
        time: '22:19:00',
        type: 'Recipient Added',
        detail: 'Payee quick_transfer_p2p enrolled for immediate P2P transfer',
      },
    ];

    return {
      payment_id,
      tier: rulesConfig.tier_names.QUARANTINE as TierType,
      action: rulesConfig.actions.QUARANTINE as ActionType,
      reason_code: rulesConfig.reason_codes.QUARANTINE,
      reason_plain:
        'Password reset followed by dual contact update (Email + Phone) within 30 days. New payee enrollment blocked pending automated pre-change verification. Payee cannot receive money.',
      confirm_channel: 'PHONE_ON_FILE_BEFORE_CHANGE',
      confirm_target_masked: '•••-•••-4821',
      hold_expires_at: 'Next business hours (8:00 AM PST)',
      can_sound_stop: true,
      citations,
      existing_risk_score: 84, // Existing legacy fraud score for side-by-side comparison
      flagged_events: flaggedEvents,
      rule_version: rulesConfig.rule_version,
    };
  }

  // Rule 2: LIGHT Tier (Mover Profile)
  if (
    password_reset_within_7d &&
    address_only_change_within_30d &&
    recipient_status === 'New'
  ) {
    const citations = [
      `password_reset_within_${rulesConfig.windows.password_reset_days}d`,
      `address_only_change_within_${rulesConfig.windows.address_change_days}d`,
      'recipient_status (New)',
    ];

    const flaggedEvents = [
      {
        id: 'EVT-RESET-M',
        time: 'Oct 5, 14:15',
        type: 'Password Reset',
        detail: 'Member self-service reset after failed login',
      },
      {
        id: 'EVT-ADDR-M',
        time: 'Oct 5, 14:28',
        type: 'Address Change',
        detail: 'Apartment relocation (Phone & Email untouched)',
      },
      {
        id: 'EVT-PAYEE-M',
        time: 'Oct 6, 09:15',
        type: 'Recipient Added',
        detail: 'New landlord payee Belltown Properties enrolled',
      },
    ];

    return {
      payment_id,
      tier: rulesConfig.tier_names.LIGHT as TierType,
      action: rulesConfig.actions.LIGHT as ActionType,
      reason_code: rulesConfig.reason_codes.LIGHT,
      reason_plain:
        'Password reset accompanied by address update only. Primary phone remains verified. One-tap payee authorization dispatched to member.',
      confirm_channel: 'UNCHANGED_PHONE_ON_FILE',
      confirm_target_masked: '•••-•••-4821',
      hold_expires_at: `${rulesConfig.windows.light_hold_duration_hours}h 00m`,
      can_sound_stop: false,
      citations,
      existing_risk_score: 42,
      flagged_events: flaggedEvents,
      rule_version: rulesConfig.rule_version,
    };
  }

  // Rule 3: NO_ACTION
  return {
    payment_id,
    tier: rulesConfig.tier_names.NONE as TierType,
    action: rulesConfig.actions.NONE as ActionType,
    reason_code: rulesConfig.reason_codes.NONE,
    reason_plain: 'Activity within baseline parameters. Payee and payment approved.',
    confirm_channel: 'NONE',
    confirm_target_masked: '',
    hold_expires_at: null,
    can_sound_stop: false,
    citations: ['standard_baseline'],
    existing_risk_score: 12,
    rule_version: rulesConfig.rule_version,
  };
}
