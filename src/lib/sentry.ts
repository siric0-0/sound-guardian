import { DemoEvent, SentrySignals } from '../types.ts';
import { tokenizeMemberId } from './tokenization.ts';

function parseTimestamp(ts: string): number {
  const formatted = ts.includes('T') ? ts : ts.replace(' ', 'T');
  return new Date(formatted).getTime();
}

export function buildSentrySignals(
  targetEvent: DemoEvent,
  allMemberEvents: DemoEvent[]
): SentrySignals {
  const eventTime = parseTimestamp(targetEvent.event_timestamp);

  // Consider all prior events up to this target event
  const priorEvents = allMemberEvents.filter((ev) => {
    const t = parseTimestamp(ev.event_timestamp);
    return t <= eventTime && ev.event_id !== targetEvent.event_id;
  });

  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  let hasPasswordResetWithin7d = targetEvent.password_reset_recent === 1;
  const contactChanges: ('Email' | 'Phone')[] = [];
  let hasAddressChangeWithin30d = false;
  let mostRecentChangeTime: number | null = null;
  const sourceEventIds: string[] = [];

  for (const ev of priorEvents) {
    const evTime = parseTimestamp(ev.event_timestamp);
    const diffMs = eventTime - evTime;

    if (ev.event_type === 'Password Reset' && diffMs <= sevenDaysMs) {
      hasPasswordResetWithin7d = true;
      sourceEventIds.push(ev.event_id);
      if (!mostRecentChangeTime || evTime > mostRecentChangeTime) {
        mostRecentChangeTime = evTime;
      }
    }

    if (ev.event_type === 'Email Change' && diffMs <= thirtyDaysMs) {
      if (!contactChanges.includes('Email')) contactChanges.push('Email');
      sourceEventIds.push(ev.event_id);
      if (!mostRecentChangeTime || evTime > mostRecentChangeTime) {
        mostRecentChangeTime = evTime;
      }
    }

    if (ev.event_type === 'Phone Change' && diffMs <= thirtyDaysMs) {
      if (!contactChanges.includes('Phone')) contactChanges.push('Phone');
      sourceEventIds.push(ev.event_id);
      if (!mostRecentChangeTime || evTime > mostRecentChangeTime) {
        mostRecentChangeTime = evTime;
      }
    }

    if (ev.event_type === 'Address Change' && diffMs <= thirtyDaysMs) {
      hasAddressChangeWithin30d = true;
      sourceEventIds.push(ev.event_id);
      if (!mostRecentChangeTime || evTime > mostRecentChangeTime) {
        mostRecentChangeTime = evTime;
      }
    }
  }

  const addressOnlyChangeWithin30d =
    hasAddressChangeWithin30d && contactChanges.length === 0;

  const minutesSinceLastChange = mostRecentChangeTime
    ? Math.max(1, Math.round((eventTime - mostRecentChangeTime) / 60000))
    : 9999;

  const isRecipientAdded = targetEvent.event_type === 'Recipient Added';

  return {
    member_token: tokenizeMemberId(targetEvent.synthetic_member_id),
    payment_id: targetEvent.payment_id || `PAYEE-${targetEvent.recipient_id || targetEvent.event_id}`,
    rail: targetEvent.payment_rail || (isRecipientAdded ? 'P2P' : 'ACH'),
    amount: targetEvent.amount || 0,
    recipient_status: 'New',
    recipient_age_days: targetEvent.recipient_age_days ?? 0,
    password_reset_within_7d: hasPasswordResetWithin7d,
    contact_channel_changed_within_30d: contactChanges,
    address_only_change_within_30d: addressOnlyChangeWithin30d,
    minutes_since_last_change: minutesSinceLastChange,
    amount_to_baseline_ratio: targetEvent.amount_to_baseline_ratio || 1.0,
    source_event_ids: sourceEventIds,
    trigger_event_type: isRecipientAdded ? 'Recipient Added' : 'Payment Initiated',
  };
}
