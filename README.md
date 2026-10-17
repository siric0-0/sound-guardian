# Sound Guardian

> Dual-sided Account Takeover (ATO) & wire scam defense system for Sound Credit Union, pairing deterministic 3-tier risk evaluation with member-facing non-blaming explanations and staff-assisted workflows.

**Synthetic data only · Educational prototype**

---

## 3 Demo Stories

1. **Story 1: Sarah — Account Takeover (ATO) [Verdict: CAUGHT]**
   - **Context**: Attacker phishes member credentials via fake SMS, resets password, changes both email and phone, then attempts two P2P payments totaling $3,006.33.
   - **Sound Guardian Defense**: QUARANTINE tier intercepts at payee enrollment. The system dispatches an out-of-band notification to the member's pre-change verified phone with an explicit coercion warning. Sarah taps "Freeze & Recover", locking the compromised payee and stopping both transfers before submission.

2. **Story 2: Legitimate Mover — Look-Alike Profile Change [Verdict: RELEASED]**
   - **Context**: Legitimate member forgets password, updates mailing address following an apartment move, and submits a $4,151.68 ACH payment to a new landlord.
   - **Sound Guardian Defense**: Evaluated as LIGHT tier due to benign address-only profile delta. Dispatches a rapid one-tap "Was this you?" confirmation to unchanged mobile on file. Resolved and released in under 10 seconds without call center backlog.

3. **Story 3: James — Government Impersonation Scam [Verdict: BRANCH ASSIST / HONEST MISS]**
   - **Context**: Senior member coerced over the phone by an imposter posing as a federal officer into visiting a branch for an urgent $7,000 cash withdrawal. No digital profile changes occur.
   - **Sound Guardian Defense**: Honest Miss for automated digital rules. Cross-channel context bridges contact center inquiries to the in-branch teller portal, surfacing a compassionate, blame-free verbal script: *"Has anyone told you to keep this secret, stay on the phone, or transfer these funds to protect your money?"*

---

## How to Run

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Start Application
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Offline Mode**: Sound Guardian runs 100% locally with built-in deterministic templates. No API key is required. If an optional Gemini key is configured, live AI explanations are seamlessly enabled.

---

*Synthetic data only · Educational prototype*
