// Map synthetic member IDs to stable token strings
const MEMBER_TOKEN_MAP: Record<string, string> = {
  M1003: 'MBR_7F3A',
  M1039: 'MBR_4E21',
  M1004: 'MBR_9B10',
  M1041: 'MBR_3C88',
  M1051: 'MBR_5D19',
  M1114: 'MBR_2A77',
  M1001: 'MBR_8K42',
  M1020: 'MBR_1X99',
};

export function tokenizeMemberId(id: string): string {
  if (MEMBER_TOKEN_MAP[id]) return MEMBER_TOKEN_MAP[id];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(0, 4);
  return `MBR_${hex}`;
}

export function maskPhone(phone?: string): string {
  if (!phone) return '•••-•••-4821';
  // Keep last 4 digits
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 4) {
    const last4 = digits.slice(-4);
    return `•••-•••-${last4}`;
  }
  return '•••-•••-4821';
}

export function maskAccount(accNumber?: string | number): string {
  if (!accNumber) return '••••1003';
  const str = String(accNumber).replace(/\D/g, '');
  if (str.length >= 4) {
    return `••••${str.slice(-4)}`;
  }
  return '••••1003';
}

export function maskEmail(email?: string): string {
  if (!email || !email.includes('@')) return 's****@email.com';
  const [local, domain] = email.split('@');
  const firstLetter = local[0] || 'm';
  return `${firstLetter}****@${domain}`;
}

export function maskRecipient(recipientId: string): string {
  if (!recipientId) return 'REC_••••';
  if (recipientId === 'REC_SELF') return 'Member Primary (Self)';
  if (recipientId === 'REC_8821') return 'P2P: quick_transfer_p2p (REC_8821)';
  if (recipientId === 'REC_4412') return 'ACH: Belltown Properties LLC (REC_4412)';
  return recipientId;
}
