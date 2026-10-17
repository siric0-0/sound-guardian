import { DemoEvent } from '../types.ts';
import rawCsv from '../../public/data/demo_events_subset.csv?raw';

export function parseCSV(csvText: string): DemoEvent[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const events: DemoEvent[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? '';
    });

    events.push({
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
      profile_change_recent: parseInt(row['profile_change_recent'] || '0', 10),
      password_reset_recent: parseInt(row['password_reset_recent'] || '0', 10),
      trusted_contact_enrolled: parseInt(row['trusted_contact_enrolled'] || '0', 10),
      warning_displayed: parseInt(row['warning_displayed'] || '0', 10),
      member_response: row['member_response'] || '',
      employee_interaction: row['employee_interaction'] || '',
      case_open: parseInt(row['case_open'] || '0', 10),
      payment_status: row['payment_status'] || '',
      event_note: row['event_note'] || '',
    });
  }

  return events;
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

export async function loadDemoCSV(): Promise<DemoEvent[]> {
  return parseCSV(rawCsv);
}
