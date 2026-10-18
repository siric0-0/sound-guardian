import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DemoEvent, SentrySignals, ArbiterDecision } from '../src/types.ts';
import { buildSentrySignals, parseTimestamp } from '../src/lib/sentry.ts';
import { runArbiter } from '../src/lib/arbiter.ts';
import rulesConfig from '../src/config/rules.config.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Path definitions
const eventsCsvPath = path.join(rootDir, 'public', 'data', 'events_full.csv');
const memberKeyCsvPath = path.join(rootDir, 'data', 'member_key.csv');
const outputPath = path.join(rootDir, 'public', 'data', 'evaluation.json');

// Ensure member key remains strictly outside public
if (memberKeyCsvPath.includes(path.join(rootDir, 'public'))) {
  console.error('CRITICAL: member_key.csv must NOT reside in public/ directory!');
  process.exit(1);
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseFlag(val: string | undefined): number {
  if (!val) return 0;
  const v = val.trim().toLowerCase();
  if (v === 'yes' || v === 'true' || v === '1') return 1;
  const num = parseInt(val, 10);
  return isNaN(num) ? 0 : num;
}

console.log('Loading datasets...');
const eventsCsvRaw = fs.readFileSync(eventsCsvPath, 'utf-8');
const memberKeyRaw = fs.readFileSync(memberKeyCsvPath, 'utf-8');

// Parse Member Key (used ONLY for scoring and validation, NEVER at decision time)
const memberKeyLines = memberKeyRaw.trim().split(/\r?\n/);
const keyHeaders = parseCSVLine(memberKeyLines[0]);
interface MemberKeyRecord {
  synthetic_member_id: string;
  anchor_persona: string;
  scenario_type: string;
  scenario_subtype: string;
  is_legitimate_lookalike: string;
  journey_summary: string;
  dollars_attempted: number;
  dollars_sent: number;
  dollars_prevented: number;
  dollars_recovered: number;
  net_member_loss: number;
  journey_outcome: string;
}

const memberKeys = new Map<string, MemberKeyRecord>();
for (let i = 1; i < memberKeyLines.length; i++) {
  const line = memberKeyLines[i].trim();
  if (!line) continue;
  const vals = parseCSVLine(line);
  const row: Record<string, string> = {};
  keyHeaders.forEach((h, idx) => {
    row[h] = vals[idx] ?? '';
  });
  const memberId = row['synthetic_member_id'];
  if (!memberId) continue;
  memberKeys.set(memberId, {
    synthetic_member_id: memberId,
    anchor_persona: row['anchor_persona'] || '',
    scenario_type: row['scenario_type'] || '',
    scenario_subtype: row['scenario_subtype'] || '',
    is_legitimate_lookalike: row['is_legitimate_lookalike'] || 'No',
    journey_summary: row['journey_summary'] || '',
    dollars_attempted: parseFloat(row['dollars_attempted'] || '0') || 0,
    dollars_sent: parseFloat(row['dollars_sent'] || '0') || 0,
    dollars_prevented: parseFloat(row['dollars_prevented'] || '0') || 0,
    dollars_recovered: parseFloat(row['dollars_recovered'] || '0') || 0,
    net_member_loss: parseFloat(row['net_member_loss'] || '0') || 0,
    journey_outcome: row['journey_outcome'] || '',
  });
}

// Parse Events
const eventLines = eventsCsvRaw.trim().split(/\r?\n/);
const eventHeaders = parseCSVLine(eventLines[0]);
const allEvents: DemoEvent[] = [];

for (let i = 1; i < eventLines.length; i++) {
  const line = eventLines[i].trim();
  if (!line) continue;
  const vals = parseCSVLine(line);
  const row: Record<string, string> = {};
  eventHeaders.forEach((h, idx) => {
    row[h] = vals[idx] ?? '';
  });

  allEvents.push({
    event_id: row['event_id'] || `E-${i}`,
    synthetic_member_id: row['synthetic_member_id'] || '',
    event_sequence: parseInt(row['event_sequence'] || '0', 10),
    event_timestamp: row['event_timestamp'] || '',
    day_of_week: row['day_of_week'] || '',
    event_category: row['event_category'] || '',
    event_type: row['event_type'] || '',
    channel: row['channel'] || '',
    payment_id: row['payment_id'] || '',
    payment_rail: row['payment_rail'] || '',
    amount: parseFloat(row['amount'] || '0') || 0,
    transaction_direction: row['transaction_direction'] || '',
    recipient_id: row['recipient_id'] || '',
    recipient_status: (row['recipient_status'] === 'New' || row['recipient_status'] === 'Existing')
      ? (row['recipient_status'] as 'New' | 'Existing')
      : '',
    recipient_age_days: parseInt(row['recipient_age_days'] || '0', 10),
    days_since_last_same_rail: parseInt(row['days_since_last_same_rail'] || '0', 10),
    amount_to_baseline_ratio: parseFloat(row['amount_to_baseline_ratio'] || '1.0'),
    amount_vs_member_baseline: row['amount_vs_member_baseline'] || '',
    payment_velocity_band: row['payment_velocity_band'] || '',
    available_balance_after: parseFloat(row['available_balance_after'] || '0') || 0,
    profile_change_recent: parseFlag(row['profile_change_recent']),
    password_reset_recent: parseFlag(row['password_reset_recent']),
    trusted_contact_enrolled: parseFlag(row['trusted_contact_enrolled']),
    warning_displayed: parseFlag(row['warning_displayed']),
    member_response: row['member_response'] || '',
    employee_interaction: row['employee_interaction'] || '',
    case_open: parseFlag(row['case_open']),
    payment_status: row['payment_status'] || '',
    event_note: row['event_note'] || '',
  });
}

console.log(`Parsed ${allEvents.length} events across ${memberKeys.size} members.`);

// Group events by member and sort by sequence / timestamp
const eventsByMember = new Map<string, DemoEvent[]>();
for (const ev of allEvents) {
  const mId = ev.synthetic_member_id;
  if (!eventsByMember.has(mId)) {
    eventsByMember.set(mId, []);
  }
  eventsByMember.get(mId)!.push(ev);
}

for (const [mId, mEvents] of eventsByMember.entries()) {
  mEvents.sort((a, b) => {
    if (a.event_sequence !== b.event_sequence) return a.event_sequence - b.event_sequence;
    return parseTimestamp(a.event_timestamp) - parseTimestamp(b.event_timestamp);
  });
}

// Evaluate each member using ONLY observable fields through Sentry & Arbiter
interface MemberEvaluation {
  memberId: string;
  quarantined: boolean;
  lightTriggered: boolean;
  quarantineDecision?: ArbiterDecision;
  lightDecision?: ArbiterDecision;
  firstTargetEventType?: string;
  recipientAddedTimestamp?: string;
  firstPaymentTimestamp?: string;
  leadMinutes?: number;
  rail?: string;
}

const evaluations = new Map<string, MemberEvaluation>();

for (const [mId, mEvents] of eventsByMember.entries()) {
  let memberQuarantined = false;
  let memberLight = false;
  let quarantineDec: ArbiterDecision | undefined;
  let lightDec: ArbiterDecision | undefined;
  let recipientAddedTs: string | undefined;
  let firstPaymentTs: string | undefined;
  let rail: string | undefined;

  for (const ev of mEvents) {
    if (ev.event_type === 'Recipient Added' || ev.event_type === 'Payment Initiated') {
      const signals = buildSentrySignals(ev, mEvents);
      const decision = runArbiter(signals);

      if (decision.tier === 'QUARANTINE' && !memberQuarantined) {
        memberQuarantined = true;
        quarantineDec = decision;
        recipientAddedTs = ev.event_timestamp;
        rail = ev.payment_rail || (signals.rail !== 'ACH' ? signals.rail : 'P2P');
      }

      if (decision.tier === 'LIGHT' && !memberLight) {
        memberLight = true;
        lightDec = decision;
      }

      if (
        ev.event_type === 'Payment Initiated' &&
        recipientAddedTs &&
        !firstPaymentTs &&
        parseTimestamp(ev.event_timestamp) >= parseTimestamp(recipientAddedTs)
      ) {
        firstPaymentTs = ev.event_timestamp;
        if (ev.payment_rail) {
          rail = ev.payment_rail;
        }
      }
    }
  }

  let leadMinutes: number | undefined;
  if (recipientAddedTs && firstPaymentTs) {
    const diffMs = parseTimestamp(firstPaymentTs) - parseTimestamp(recipientAddedTs);
    leadMinutes = Math.round(diffMs / 60000);
  }

  evaluations.set(mId, {
    memberId: mId,
    quarantined: memberQuarantined,
    lightTriggered: memberLight,
    quarantineDecision: quarantineDec,
    lightDecision: lightDec,
    recipientAddedTimestamp: recipientAddedTs,
    firstPaymentTimestamp: firstPaymentTs,
    leadMinutes,
    rail,
  });
}

// Score against Member Key
const quarantinedATO: string[] = [];
const quarantinedNonATO: string[] = [];
const lightMembers: string[] = [];
const lookalikeMembers: string[] = [];
const routineMembers: string[] = [];
const otherScamsMembers: string[] = [];

let atoDollarsAttempted = 0;
let atoDollarsSent = 0;
let atoDollarsPrevented = 0;
let atoDollarsRecovered = 0;
let atoNetLoss = 0;

const atoJourneysData: any[] = [];
const leadMinutesArr: number[] = [];

for (const [mId, key] of memberKeys.entries()) {
  const evalResult = evaluations.get(mId) || {
    memberId: mId,
    quarantined: false,
    lightTriggered: false,
  };

  const isATO = key.scenario_type === 'Sound Impersonation + ATO';
  const isLookalike = key.is_legitimate_lookalike === 'Yes';
  const isRoutine = key.scenario_type === 'Normal Activity' && !isLookalike;
  const isOtherScam = !isATO && !isLookalike && !isRoutine;

  if (isATO) {
    atoDollarsAttempted += key.dollars_attempted;
    atoDollarsSent += key.dollars_sent;
    atoDollarsPrevented += key.dollars_prevented;
    atoDollarsRecovered += key.dollars_recovered;
    atoNetLoss += key.net_member_loss;

    if (evalResult.quarantined) {
      quarantinedATO.push(mId);
    }

    if (evalResult.leadMinutes !== undefined) {
      leadMinutesArr.push(evalResult.leadMinutes);
    }

    // Format for Evidence & Data table
    let formattedOutcome = 'Loss';
    if (key.journey_outcome.toLowerCase().includes('prevented')) {
      formattedOutcome = 'Prevented';
    } else if (key.journey_outcome.toLowerCase().includes('partially recovered')) {
      formattedOutcome = 'Loss partly recovered';
    }

    // Format timestamps: e.g. "10/15 22:19", "22:22"
    const formatDateTime = (ts?: string) => {
      if (!ts) return '';
      const d = new Date(parseTimestamp(ts));
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      return `${month}/${day} ${hours}:${mins}`;
    };

    const formatTimeOnly = (ts?: string) => {
      if (!ts) return '';
      const d = new Date(parseTimestamp(ts));
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      return `${hours}:${mins}`;
    };

    atoJourneysData.push({
      id: `ATO-${String(atoJourneysData.length + 1).padStart(2, '0')}`,
      member: mId,
      payeeAdded: formatDateTime(evalResult.recipientAddedTimestamp),
      firstPayment: formatTimeOnly(evalResult.firstPaymentTimestamp),
      rail: evalResult.rail || 'P2P',
      leadTime: `${evalResult.leadMinutes || 0} min`,
      leadMinutes: evalResult.leadMinutes || 0,
      attempted: `$${key.dollars_attempted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      outcome: formattedOutcome,
    });
  } else {
    if (evalResult.quarantined) {
      quarantinedNonATO.push(mId);
    }
  }

  if (evalResult.lightTriggered) {
    lightMembers.push(mId);
  }

  if (isLookalike) {
    lookalikeMembers.push(mId);
  } else if (isRoutine) {
    routineMembers.push(mId);
  } else if (isOtherScam) {
    otherScamsMembers.push(mId);
  }
}

// Sort atoJourneysData by member ID
atoJourneysData.sort((a, b) => a.member.localeCompare(b.member));

console.log('\n================ EVALUATION SUMMARY ================');
console.log(`ATO Quarantined: ${quarantinedATO.length} / 12 (Target: 12/12)`);
console.log(`Other Quarantined: ${quarantinedNonATO.length} / 106 (Target: 0/106)`);
console.log(`LIGHT Triggered: [${lightMembers.sort().join(', ')}] (Target: [M1039, M1041, M1051, M1114])`);
console.log(`Intervention Lead Times: ${Math.min(...leadMinutesArr)}–${Math.max(...leadMinutesArr)} min`);
console.log(`Dollars Attempted in ATO: $${atoDollarsAttempted.toFixed(2)}`);
console.log(`Dollars Sent in ATO: $${atoDollarsSent.toFixed(2)}`);
console.log(`Net Loss in ATO: $${atoNetLoss.toFixed(2)}`);
console.log('====================================================\n');

// Strict Assertions
const expectedLightMembers = ['M1039', 'M1041', 'M1051', 'M1114'];
const actualLightSorted = [...lightMembers].sort();
const lightMatches =
  actualLightSorted.length === expectedLightMembers.length &&
  actualLightSorted.every((val, idx) => val === expectedLightMembers[idx]);

let failed = false;

if (quarantinedATO.length !== 12) {
  console.error(`FAILURE: ATO quarantine count ${quarantinedATO.length} !== 12`);
  failed = true;
}

if (quarantinedNonATO.length !== 0) {
  console.error(`FAILURE: Other quarantine count ${quarantinedNonATO.length} !== 0 (Offenders: ${quarantinedNonATO.join(', ')})`);
  failed = true;
}

if (!lightMatches) {
  console.error(`FAILURE: LIGHT members mismatch. Expected: ${expectedLightMembers.join(', ')} | Got: ${actualLightSorted.join(', ')}`);
  failed = true;
}

if (failed) {
  console.error('\nEvaluation failed strict production validation criteria.');
  process.exit(1);
}

// Generate evaluation.json
const evaluationJson = {
  rule_version: rulesConfig.rule_version,
  evaluated_at: new Date().toISOString(),
  total_members: memberKeys.size,
  headline: {
    ato_quarantined: quarantinedATO.length,
    ato_total: 12,
    other_quarantined: quarantinedNonATO.length,
    other_total: 106,
    lead_time_min: Math.min(...leadMinutesArr),
    lead_time_max: Math.max(...leadMinutesArr),
    light_fired: lightMembers.length,
    lookalikes_total: lookalikeMembers.length,
    light_members: actualLightSorted,
    dollars_attempted: atoDollarsAttempted,
    dollars_sent: atoDollarsSent,
    dollars_prevented: atoDollarsPrevented,
    dollars_recovered: atoDollarsRecovered,
    net_loss: atoNetLoss,
    summary_text: `QUARANTINE fired on ${quarantinedATO.length} of 12 takeover journeys, ${Math.min(...leadMinutesArr)}–${Math.max(...leadMinutesArr)} min before the first payment. 0 of 106 other members quarantined (${otherScamsMembers.length} other scams, ${routineMembers.length} routine, ${lookalikeMembers.length} look-alikes). LIGHT fired on ${lightMembers.length} of ${lookalikeMembers.length} look-alikes (${actualLightSorted.join(', ')}, all real movers). Takeover dollars in the data: $${atoDollarsAttempted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} attempted, $${atoDollarsSent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sent, $${atoNetLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} net loss.`,
  },
  counts_by_scenario: {
    ato: {
      total: 12,
      quarantine: quarantinedATO.length,
      light: 0,
      none: 0,
      dollars_attempted: atoDollarsAttempted,
      dollars_sent: atoDollarsSent,
      dollars_prevented: atoDollarsPrevented,
      dollars_recovered: atoDollarsRecovered,
      net_loss: atoNetLoss,
    },
    lookalikes: {
      total: lookalikeMembers.length,
      quarantine: 0,
      light: lightMembers.length,
      none: lookalikeMembers.length - lightMembers.length,
    },
    other_scams: {
      total: otherScamsMembers.length,
      quarantine: 0,
      light: 0,
      none: otherScamsMembers.length,
    },
    routine: {
      total: routineMembers.length,
      quarantine: 0,
      light: 0,
      none: routineMembers.length,
    },
  },
  ato_journeys: atoJourneysData,
  active_rules: rulesConfig,
};

fs.writeFileSync(outputPath, JSON.stringify(evaluationJson, null, 2), 'utf-8');
console.log(`Successfully generated ${outputPath}`);
console.log('Evaluation passed all assertions with 100% precision.');
process.exit(0);
