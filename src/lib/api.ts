import { TierType } from '../types.ts';

export interface GuardianExplainResponse {
  headline: string;
  body: string;
  alert_copy: string;
  secured_copy: string;
  is_live_ai: boolean;
}

export interface StaffAssistResponse {
  summary: string[];
  script: string;
  nextActions: string[];
  is_live_ai: boolean;
}

export async function checkAiStatus(): Promise<{
  aiStatus: 'live' | 'offline';
  provider: string;
  model: string;
}> {
  try {
    const res = await fetch('/api/status').catch(() => null);
    if (!res || !res.ok) throw new Error('Status endpoint unavailable');
    return await res.json();
  } catch {
    return {
      aiStatus: 'offline',
      provider: 'none',
      model: 'deterministic_templates',
    };
  }
}

export async function fetchGuardianCopy(params: {
  tier: TierType;
  amount: number;
  maskedPhone: string;
  lang: 'en' | 'es';
  rail?: string;
}): Promise<GuardianExplainResponse> {
  try {
    const res = await fetch('/api/guardian/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    }).catch(() => null);
    if (!res || !res.ok) throw new Error('Guardian endpoint unavailable');
    return await res.json();
  } catch {
    // Client-side fallback if network error or static offline mode
    const isEs = params.lang === 'es';
    if (params.tier === 'QUARANTINE') {
      return {
        headline: isEs ? "Necesitamos confirmar este pago" : "We need to confirm this payment",
        body: isEs
          ? `Para mantener su dinero seguro, enviamos una confirmación al número de teléfono que estaba en su cuenta antes de cambiar recientemente (${params.maskedPhone}). Este pago no se enviará hasta que se confirme allí.`
          : `To keep your money safe, we've sent a confirmation to the phone number that was on your account before it changed recently (${params.maskedPhone}). This payment won't be sent until it's confirmed there.`,
        alert_copy: isEs
          ? `Sound Credit Union: ¿Acaba de restablecer su contraseña y agregar un nuevo destinatario? Alguien solicitó un pago de $${params.amount.toFixed(2)} desde su cuenta. Si no fue usted, presione Congelar y Recuperar — lo detendremos, protegeremos su cuenta y le llamaremos.`
          : `Sound Credit Union: Did you just reset your password and add a new payee? Someone requested a $${params.amount.toFixed(2)} payment from your account at 10:22 PM. If this wasn't you, tap Freeze & Recover — we'll stop it, secure your account, and call you.`,
        secured_copy: isEs
          ? `Su cuenta está protegida. Hemos pausado los pagos salientes, detenido el pago pendiente y abierto un caso. Un especialista le llamará a su número de confianza en menos de 30 minutos.`
          : `Your account is secured. We've paused outgoing payments, stopped the pending payment, and opened case #C-2026-1003. A member of our fraud team will call you on your trusted number within 30 minutes. You did the right thing by acting quickly.`,
        is_live_ai: false,
      };
    }
    return {
      headline: isEs ? "Verificación rápida: ¿fue usted?" : "Quick check: was this you?",
      body: isEs
        ? `Recientemente restableció su contraseña y actualizó su dirección, y este es un nuevo destinatario. Toque a continuación para confirmar este pago de $${params.amount.toFixed(2)}.`
        : `You recently reset your password and updated your address, and this is a new payee. Tap below to confirm this $${params.amount.toFixed(2)} payment.`,
      alert_copy: '',
      secured_copy: isEs
        ? "Listo. Su pago está en camino. Gracias por confirmar. Esto tomó 8 segundos."
        : "Done. Your payment is on its way. Thanks for confirming. This took 8 seconds.",
      is_live_ai: false,
    };
  }
}

export async function fetchStaffAssist(params: {
  tier: TierType;
  amount: number;
  rail: string;
  maskedPrePhone: string;
  citations: string[];
  isBranch?: boolean;
  eventNote?: string;
}): Promise<StaffAssistResponse> {
  try {
    const res = await fetch('/api/staff/assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    }).catch(() => null);
    if (!res || !res.ok) throw new Error('Staff Assist endpoint unavailable');
    return await res.json();
  } catch {
    if (params.isBranch) {
      return {
        summary: [
          `In-branch high-risk withdrawal attempt of $${params.amount.toFixed(2)} Cash.`,
          `Cross-channel context: Member called Contact Center earlier regarding cash withdrawal limits and wire arrival speed.`,
          `High susceptibility for active imposter/government coercion.`
        ],
        script: `Mr. James, before we complete this cash withdrawal, our policy is to pause and ask one important question: Has anyone told you to keep this secret, stay on the phone, or transfer these funds to protect your money? We are here to protect you.`,
        nextActions: [
          "Engage member with compassion and zero blame",
          "Offer quiet consultation away from active phone pressure",
          "Provide member option to cancel or freeze transaction immediately"
        ],
        is_live_ai: false
      };
    }
    if (params.tier === 'LIGHT') {
      return {
        summary: [
          `Mover profile signature: Address-only change following password reset with new payee ${params.rail} transfer ($${params.amount.toFixed(2)}).`,
          `One-tap verification dispatched to unchanged primary phone on file.`,
          `Citations: ${params.citations.join(', ')}.`
        ],
        script: `Hello from Sound Credit Union. We noticed an address update accompanied by a new payee setup. We sent a quick one-tap verification to your mobile phone to safely authorize this transfer.`,
        nextActions: [
          "Allow automated one-tap resolution (typical resolution under 30 seconds)",
          "If member calls in: perform standard phone verification and release hold with 1-click",
          "No secondary staff sign-off required for LIGHT tier"
        ],
        is_live_ai: false
      };
    }
    return {
      summary: [
        `Account Takeover signature detected: Recent password reset and dual contact change (Email + Phone) prior to high-ratio ${params.rail} transfer ($${params.amount.toFixed(2)}).`,
        `Payment intercepted prior to network submission; funds remain in member account.`,
        `Citations: ${params.citations.join(', ')}.`
      ],
      script: `Hello, this is Sound Credit Union Fraud Prevention calling for our member. We paused an outgoing ${params.rail} payment of $${params.amount.toFixed(2)} requested after recent credentials and contact updates. We are verifying directly via your pre-change number (${params.maskedPrePhone}) to ensure your account security.`,
      nextActions: [
        "Verify member identity via pre-change phone before releasing funds",
        "If member confirms unauthorized access: Apply Stop (ATO) and initiate Account Recovery protocol",
        "Quarantine release requires 2-staff approval and verified physical or out-of-band identification"
      ],
      is_live_ai: false,
    };
  }
}

