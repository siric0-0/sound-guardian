import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini if key is provided
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI client:', err);
  }
}

// Fallback deterministic templates for GUARDIAN (member-facing)
const GUARDIAN_TEMPLATES = {
  QUARANTINE_EN: (amount: number, maskedPhone: string) => ({
    headline: "Payee Blocked · Confirmation Required",
    body: `To keep your money safe, a confirmation was sent to the phone on file before recent updates (${maskedPhone}). This code approves a NEW payee and payments to it. Sound will never call or text asking for this code. Payments to this payee are locked upfront.`,
    alert_copy: `Sound Credit Union: Did you just reset your password and add a new payee? This code approves a NEW payee and payments to it. Sound will never call or text asking for this code. If this wasn't you, tap Freeze & Recover.`,
    secured_copy: `Your account is secured. We've locked unauthorized payee additions, stopped outgoing payments, and protected your balance. A member of our fraud team will call you on your trusted number.`,
    is_live_ai: false
  }),
  QUARANTINE_ES: (amount: number, maskedPhone: string) => ({
    headline: "Destinatario Bloqueado · Confirmación Requerida",
    body: `Para proteger sus fondos, enviamos una confirmación al teléfono registrado antes de cambios recientes (${maskedPhone}). Este código aprueba un NUEVO destinatario y pagos hacia él. Sound nunca le llamará ni le enviará mensajes solicitando este código.`,
    alert_copy: `Sound Credit Union: ¿Agregó un nuevo destinatario tras cambiar su contraseña? Este código aprueba un NUEVO destinatario y pagos hacia él. Sound nunca le llamará ni le enviará mensajes solicitando este código. Si no fue usted, presione Congelar y Recuperar.`,
    secured_copy: `Su cuenta está protegida. Hemos bloqueado al destinatario no autorizado y protegido su saldo íntegramente. Un especialista se comunicará con usted.`,
    is_live_ai: false
  }),
  LIGHT_EN: (amount: number) => ({
    headline: "Quick check: was this you?",
    body: `You recently reset your password and updated your address, and this is a new payee. Tap below to confirm this $${amount.toFixed(2)} payment.`,
    released_copy: "Done. Your payment is on its way. Thanks for confirming. This took 8 seconds.",
    fast_path_copy: "Your payment is safely on hold. Because your phone and email changed recently, we need to confirm it's you another way. Visit any branch with ID, or call us, and we'll release it right away.",
    is_live_ai: false
  }),
  LIGHT_ES: (amount: number) => ({
    headline: "Verificación rápida: ¿fue usted?",
    body: `Recientemente restableció su contraseña y actualizó su dirección, y este es un nuevo destinatario. Toque a continuación para confirmar este pago de $${amount.toFixed(2)}.`,
    released_copy: "Listo. Su pago está en camino. Gracias por confirmar. Esto tomó 8 segundos.",
    fast_path_copy: "Su pago está retenido de manera segura. Como su teléfono y correo electrónico cambiaron recientemente, necesitamos confirmarlo por otra vía. Visite cualquier sucursal con identificación o llámenos.",
    is_live_ai: false
  })
};

// Fallback deterministic templates for STAFF ASSIST
const STAFF_TEMPLATES = {
  QUARANTINE: (amount: number, maskedPrePhone: string, rail: string, citations: string[]) => ({
    summary: [
      `Account Takeover signature detected: Recent password reset and dual contact change (Email + Phone) prior to high-ratio ${rail} transfer ($${amount.toFixed(2)}).`,
      `Payment intercepted prior to network submission; funds remain in member account.`,
      `Citations: ${citations.join(', ')}.`
    ],
    script: `Hello, this is Sound Credit Union Fraud Prevention calling for our member. We paused an outgoing ${rail} payment of $${amount.toFixed(2)} requested after recent credentials and contact updates. We are verifying directly via your pre-change number (${maskedPrePhone}) to ensure your account security.`,
    nextActions: [
      "Verify member identity via pre-change phone before releasing funds",
      "If member confirms unauthorized access: Apply Stop (ATO) and initiate Account Recovery protocol",
      "Quarantine release requires 2-staff approval and verified physical or out-of-band identification"
    ],
    is_live_ai: false
  }),
  LIGHT: (amount: number, rail: string, citations: string[]) => ({
    summary: [
      `Mover profile signature: Address-only change following password reset with new payee ${rail} transfer ($${amount.toFixed(2)}).`,
      `One-tap verification dispatched to unchanged primary phone on file.`,
      `Citations: ${citations.join(', ')}.`
    ],
    script: `Hello from Sound Credit Union. We noticed an address update accompanied by a new payee setup. We sent a quick one-tap verification to your mobile phone to safely authorize this transfer.`,
    nextActions: [
      "Allow automated one-tap resolution (typical resolution under 30 seconds)",
      "If member calls in: perform standard phone verification and release hold with 1-click",
      "No secondary staff sign-off required for LIGHT tier"
    ],
    is_live_ai: false
  }),
  BRANCH_ASSIST: (amount: number, note: string) => ({
    summary: [
      `In-branch high-risk withdrawal attempt of $${amount.toFixed(2)} Cash.`,
      `Cross-channel context: Member called Contact Center earlier regarding cash withdrawal limits and wire arrival speed.`,
      `High susceptibility for active imposter/government coercion.`
    ],
    script: `Mr. James, before we complete this cash withdrawal, our policy is to pause and ask one important question: Has anyone told you to keep this secret, stay on the phone, or transfer these funds to protect your money? We are here to protect you.`,
    nextActions: [
      "Engage member with compassion and zero blame",
      "Offer quiet private consultation room away from active phone pressure",
      "Provide member option to cancel or freeze transaction immediately"
    ],
    is_live_ai: false
  })
};

function withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    ),
  ]);
}

// API: Health & Status
app.get('/api/status', (req, res) => {
  const isLive = !!aiClient;
  const provider = isLive ? 'gemini' : (process.env.LLM_PROVIDER || 'none');
  res.json({
    status: 'ok',
    aiStatus: isLive ? 'live' : 'offline',
    provider,
    model: isLive ? 'gemini-3.8-flash' : 'deterministic_templates',
    message: isLive ? 'AI explanation service online' : 'Operating in offline deterministic mode'
  });
});

// API: GUARDIAN (Member-Facing Explanation)
app.post('/api/guardian/explain', async (req, res) => {
  const { tier, amount = 0, maskedPhone = '•••-•••-4821', lang = 'en', rail = 'P2P' } = req.body;
  const isSpanish = lang === 'es';

  // Deterministic fallback generator
  const getFallback = () => {
    if (tier === 'QUARANTINE') {
      return isSpanish
        ? GUARDIAN_TEMPLATES.QUARANTINE_ES(amount, maskedPhone)
        : GUARDIAN_TEMPLATES.QUARANTINE_EN(amount, maskedPhone);
    }
    return isSpanish
      ? GUARDIAN_TEMPLATES.LIGHT_ES(amount)
      : GUARDIAN_TEMPLATES.LIGHT_EN(amount);
  };

  if (!aiClient) {
    return res.json(getFallback());
  }

  try {
    const prompt = `You are GUARDIAN, the member-facing communication engine for Sound Credit Union's Sound Guardian system.
Strict Guidelines:
- Calm, clear, empathetic, reassuring, non-blaming tone.
- NEVER say "you are being scammed", "fraud", "fraudulent", or "suspicious".
- NEVER reveal internal fraud scores, algorithms, or internal tier names.
- Frame the action as proactive member protection: e.g. "We paused this to make sure your money reaches the right person."
- For QUARANTINE tier, always explicitly include the coercion warning: "This code approves a NEW payee and payments to it. Sound will never call or text asking for this code."
- Language: ${isSpanish ? 'Spanish (Español formal y empático)' : 'English'}.

Input context:
- Decision Tier: ${tier}
- Amount: $${amount.toFixed(2)}
- Payment Rail: ${rail}
- Pre-change phone number: ${maskedPhone}

Return a valid JSON object matching this schema exactly:
{
  "headline": string,
  "body": string,
  "alert_copy": string,
  "secured_copy": string
}`;

    const generatePromise = aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const response = await withTimeout(generatePromise, 4500);
    const text = response.text?.trim() || '';
    const parsed = JSON.parse(text);
    return res.json({
      ...parsed,
      is_live_ai: true
    });
  } catch (err) {
    console.warn('Guardian Gemini call timed out or failed, returning fallback template');
    return res.json(getFallback());
  }
});

// API: STAFF ASSIST (Employee-Facing Script & 3-line Summary)
app.post('/api/staff/assist', async (req, res) => {
  const {
    tier = 'QUARANTINE',
    amount = 0,
    rail = 'P2P',
    maskedPrePhone = '•••-•••-4821',
    citations = ['password_reset_recent', 'Email Change', 'Phone Change', 'recipient_status'],
    isBranch = false,
    eventNote = ''
  } = req.body;

  const getFallback = () => {
    if (isBranch) {
      return STAFF_TEMPLATES.BRANCH_ASSIST(amount, eventNote);
    }
    if (tier === 'QUARANTINE') {
      return STAFF_TEMPLATES.QUARANTINE(amount, maskedPrePhone, rail, citations);
    }
    return STAFF_TEMPLATES.LIGHT(amount, rail, citations);
  };

  if (!aiClient) {
    return res.json(getFallback());
  }

  try {
    const prompt = `You are STAFF ASSIST, the internal operational copilot for Sound Credit Union fraud investigators and branch tellers.
Generate an objective, highly actionable, non-blaming briefing for this held payment.

Input details:
- Tier: ${tier}
- Rail: ${rail}
- Amount: $${amount.toFixed(2)}
- Pre-change verified contact: ${maskedPrePhone}
- Field Citations: ${JSON.stringify(citations)}
- Branch context / assisted notes: "${eventNote}"

Return a valid JSON object with:
{
  "summary": [string, string, string],
  "script": string,
  "nextActions": [string, string, string]
}`;

    const generatePromise = aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const response = await withTimeout(generatePromise, 4500);
    const text = response.text?.trim() || '';
    const parsed = JSON.parse(text);
    return res.json({
      ...parsed,
      is_live_ai: true
    });
  } catch (err) {
    console.warn('Staff assist Gemini call timed out or failed, returning fallback template');
    return res.json(getFallback());
  }
});

// Setup Vite middleware in dev or static server in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    app.use(express.static(path.resolve(__dirname, 'public')));
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sound Guardian server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
