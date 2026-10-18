export type Lang = 'en' | 'es';

export interface DictEntry {
  en: string;
  es: string;
}

export const DICTIONARY: Record<string, DictEntry> = {
  // Global / Brand
  brand_name: { en: 'Sound Credit Union', es: 'Sound Credit Union' },
  brand_sub: { en: 'Sound Digital Banking', es: 'Banca Digital de Sound' },
  exit: { en: 'Exit', es: 'Salir' },
  large_text: { en: 'Large text', es: 'Texto grande' },
  menu: { en: 'Menu', es: 'Menú' },
  member_app: { en: 'Member app', es: 'App de socio' },
  staff_console: { en: 'Staff console', es: 'Consola de personal' },
  choose_story: { en: 'Choose a story', es: 'Elegir una historia' },
  reset_demo: { en: 'Reset demo', es: 'Reiniciar demo' },
  about_data: { en: 'About the data', es: 'Acerca de los datos' },

  // Bottom Tabs
  tab_home: { en: 'Home', es: 'Inicio' },
  tab_pay: { en: 'Pay', es: 'Pagar' },
  tab_activity: { en: 'Activity', es: 'Actividad' },
  tab_help: { en: 'Help', es: 'Ayuda' },

  // Home Tab
  balance_available: { en: 'Total Available Balance', es: 'Saldo Total Disponible' },
  classic_checking: { en: 'Classic Checking (··9412)', es: 'Cuenta Corriente Clásica (··9412)' },
  recent_activity: { en: 'Recent Activity', es: 'Actividad Reciente' },
  view_all: { en: 'View all', es: 'Ver todo' },
  send_money: { en: 'Send Money', es: 'Enviar Dinero' },
  check_digital_payments: { en: 'Check Digital Payments Status', es: 'Verificar estado de pagos digitales' },
  home_quarantine_title: { en: 'Payee Blocked · Action Required', es: 'Destinatario Bloqueado · Acción Requerida' },
  home_quarantine_body: {
    en: 'A new payee was blocked upfront to protect your money. Check required before money can leave.',
    es: 'Un nuevo destinatario fue bloqueado preventivamente para proteger su dinero. Se requiere verificación antes de que salgan fondos.',
  },
  home_quarantine_btn: { en: 'Review Payee Check', es: 'Revisar Destinatario' },
  home_light_title: { en: 'Quick check: was this you?', es: 'Verificación rápida: ¿fue usted?' },
  home_light_body: {
    en: 'Confirm your {amount} payment to {payee}.',
    es: 'Confirme su pago de {amount} a {payee}.',
  },
  home_light_btn: { en: 'Review 1-Tap Check', es: 'Confirmar Pago (8 segundos)' },
  home_secured_title: { en: 'Your account is secured', es: 'Su cuenta está protegida' },
  home_secured_body: {
    en: 'Unauthorized payee blocked and balances protected. Zero money left your account.',
    es: 'Destinatario no autorizado bloqueado y saldos protegidos. Ningún fondo salió de su cuenta.',
  },
  info: { en: 'Info', es: 'Info' },

  // Pay Flow Steps
  step_progress: { en: 'Step {step} of 4: {label}', es: 'Paso {step} de 4: {label}' },
  step_payee: { en: 'Payee', es: 'Destinatario' },
  step_amount: { en: 'Amount', es: 'Monto' },
  step_review: { en: 'Review', es: 'Revisión' },
  step_result: { en: 'Result', es: 'Resultado' },
  payee_heading: { en: 'Select or Review Payee', es: 'Seleccione o revise el destinatario' },
  payee_subheading: { en: 'P2P payments & direct transfers', es: 'Pagos P2P o transferencias directas' },
  active_payee: { en: 'Active Payee', es: 'Destinatario Activo' },
  new_payee_today: { en: 'New payee added today', es: 'Destinatario nuevo agregado hoy' },
  continue_to_amount: { en: 'Continue to Amount', es: 'Continuar al Monto' },
  back_to_home: { en: 'Back to Home', es: 'Volver al Inicio' },
  back_to_payee: { en: 'Back to Payee', es: 'Volver al Destinatario' },
  back_to_amount: { en: 'Back to Amount', es: 'Volver al Monto' },
  transfer_amount: { en: 'Transfer Amount', es: 'Monto a transferir' },
  to_payee: { en: 'To: {payee}', es: 'Para: {payee}' },
  from_rail_note: {
    en: 'From: Classic Checking (··9412) · Rail: {rail}',
    es: 'Desde: Cuenta Corriente Clásica (··9412) · Riel: {rail}',
  },
  review_payment_btn: { en: 'Review Payment', es: 'Revisar Pago' },
  from_account_label: { en: 'From Account:', es: 'Cuenta de origen:' },
  to_payee_label: { en: 'To Payee:', es: 'Destinatario:' },
  amount_label: { en: 'Amount:', es: 'Monto:' },
  payment_rail_label: { en: 'Payment Rail:', es: 'Riel de pago:' },
  send_payment: { en: 'Send Payment', es: 'Enviar Pago' },
  no_digital_title: { en: 'No digital payment in this story', es: 'No hay pagos digitales en esta historia' },
  no_digital_body: {
    en: 'James is being coerced in-person to withdraw $7,000 cash at the Tacoma branch. This scam does not use digital banking rails.',
    es: 'James está siendo coaccionado en persona para retirar $7,000 en efectivo en la sucursal de Tacoma. Esta estafa no utiliza rieles de banca digital.',
  },
  open_branch_mode: { en: 'Open Branch Mode in Staff Console', es: 'Abrir Modo Sucursal en Consola de Personal' },
  return_to_home: { en: 'Return to Home', es: 'Volver al Inicio' },

  // LIGHT Tier
  light_title: { en: 'Quick check: was this you?', es: 'Verificación rápida: ¿fue usted?' },
  light_sub: { en: '1-tap check resolves in 8 seconds', es: 'Comprobación de 1 toque en 8 segundos' },
  light_body: {
    en: 'You recently reset your password and updated your address, and this is a new payee. Tap below to confirm this {amount} payment.',
    es: 'Recientemente restableció su contraseña y actualizó su dirección, y este es un nuevo destinatario. Toque a continuación para confirmar este pago de {amount}.',
  },
  light_yes: { en: 'Yes, this was me (Confirm & Send)', es: 'Sí, fui yo (Confirmar y Enviar)' },
  light_yes_short: { en: 'Yes, this was me', es: 'Sí, fui yo' },
  light_no: { en: "No, this wasn't me (Stop)", es: 'No, no fui yo (Detener)' },
  light_talk: { en: "I'd like to talk to someone", es: 'Deseo hablar con alguien' },
  light_cleared: { en: 'Auto-cleared via LIGHT verification', es: 'Liberado automáticamente sin demora' },
  status_protected: { en: 'Status: Account Protected & Rails Frozen', es: 'Estado: Cuenta protegida y rieles congelados' },
  status_approved: { en: 'Status: Payment Approved & Dispatched', es: 'Estado: Pago aprobado y enviado' },
  view_outcome: { en: 'View Outcome Screen', es: 'Ver Pantalla de Resultado' },
  outcome_sent: { en: 'Payment sent, took 8 seconds', es: 'Pago enviado, tomó 8 segundos' },
  outcome_sent_body: {
    en: 'Done. Your payment is on its way. Thanks for confirming. This took 8 seconds.',
    es: 'Listo. Su pago está en camino. Gracias por confirmar. Esto tomó 8 segundos.',
  },
  outcome_processed: { en: 'Payment processed', es: 'Pago procesado' },
  outcome_processed_body: {
    en: 'Your transaction has been submitted.',
    es: 'Su transacción ha sido enviada.',
  },

  // Quarantine & Freeze & Recover
  quarantine_title: { en: 'Payee Blocked Pending Confirmation', es: 'Destinatario Bloqueado Pendiente de Confirmación' },
  quarantine_sub: { en: 'Sound Guardian pre-send lock', es: 'Protección anticipada de Sound Guardian' },
  quarantine_left_body: {
    en: "Waiting for confirmation on your previous phone. This payee can't receive money until it's confirmed there.",
    es: 'Esperando confirmación en su teléfono anterior. Este destinatario no puede recibir dinero hasta que se confirme allí.',
  },
  cancel: { en: 'Cancel', es: 'Cancelar' },
  get_help: { en: 'Get help', es: 'Obtener ayuda' },
  second_attempt_blocked: { en: 'Second Attempt Blocked ({amount})', es: 'Segundo Intento Bloqueado ({amount})' },
  session_terminated: { en: 'Session Terminated', es: 'Sesión Desconectada' },
  session_terminated_body: {
    en: 'All outgoing payment rails have been frozen following pre-change phone confirmation. This session cannot initiate transfers.',
    es: 'Los rieles de pago fueron congelados tras la confirmación en el teléfono previo. Esta sesión no autorizada no puede realizar transferencias.',
  },
  left_phone_label: { en: 'Session that added the payee', es: 'Sesión que agregó al destinatario' },
  right_phone_label: {
    en: "Sarah's phone on file before the change (•••-4821)",
    es: 'Teléfono registrado de Sarah previo al cambio (•••-4821)',
  },
  security_alert_title: { en: 'Security Alert', es: 'Aviso de Seguridad' },
  security_alert_body: {
    en: 'Did you just reset your password and add a new payee? … This code approves a NEW payee. Sound will never call or text asking for this code.',
    es: '¿Acaba de restablecer su contraseña y agregar un nuevo destinatario? … Este código aprueba un NUEVO destinatario. Sound nunca le llamará ni le enviará mensajes solicitando este código.',
  },
  new_payee_label: { en: 'New Payee:', es: 'Destinatario nuevo:' },
  attempted_amount_label: { en: 'Attempted Amount:', es: 'Monto intentado:' },
  second_attempt_notice: { en: 'Second transfer attempt detected within 8m', es: 'Segundo intento detectado en 8 minutos' },
  freeze_recover: { en: 'Freeze & Recover', es: 'Congelar y Recuperar' },
  yes_was_me: { en: 'Yes, this was me', es: 'Sí, fui yo' },
  account_secured: { en: 'Your account is secured', es: 'Su cuenta está protegida' },
  account_secured_body: {
    en: 'Unauthorized payee blocked and balances protected. Zero money left your account.',
    es: 'Destinatario no autorizado bloqueado y saldos protegidos. Ningún fondo salió de su cuenta.',
  },
  fraud_case: { en: 'Fraud Case:', es: 'Caso de Fraude:' },
  status_stopped: {
    en: 'Status: STOPPED in Sound staff operations queue.',
    es: 'Estado: DETENIDO en la cola de personal de Sound.',
  },
  total_protected_note: {
    en: 'Total protected: $3,006.33 ($1,574.18 + $1,432.15)',
    es: 'Total protegido: $3,006.33 ($1,574.18 + $1,432.15)',
  },
  view_case_staff: { en: 'View case in staff queue', es: 'Ver caso en consola de personal' },
  coercion_warning_label: { en: 'Mandatory Coercion Warning', es: 'Aviso Obligatorio contra Coacción' },
  auto_verification_status: { en: 'Automated 24/7 Verification Status:', es: 'Estado de verificación automatizada 24/7:' },
  unresolved_next_hours: {
    en: 'Unresolved · Next Business Hours Queue',
    es: 'No resuelto · Cola de horario laboral siguiente',
  },
  auto_verification_note: {
    en: 'Automated verification runs 24/7 at any hour with zero staff required. If unresolved, items roll to the 8:00 AM PST business hours queue.',
    es: 'La verificación automatizada se ejecuta las 24 horas del día, los 7 días de la semana, sin necesidad de personal. Si no se resuelve, se transfiere a la cola de horario laboral a las 8:00 AM PST.',
  },
  okay: { en: 'Okay', es: 'Entendido' },
  request_branch_priority: { en: 'Request at Branch (Priority)', es: 'Solicitar en sucursal (Prioridad)' },
  marked_branch_priority: { en: 'Marked Branch Priority', es: 'Marcado con prioridad de sucursal' },
  line_verified: { en: 'Line: •••-4821 (Verified record)', es: 'Línea: •••-4821 (Registro verificado)' },
  sound_guardian_alert: { en: 'Sound Guardian Alert', es: 'Alerta de Sound Guardian' },
  sound_security_messages: { en: 'Sound Security Messages', es: 'Mensajes de Seguridad Sound' },

  // Sarah ATO Specific Story (Left & Right Phone)
  mobile_safari_session: { en: 'Mobile Banking · Safari Session', es: 'Banca Móvil · Sesión Safari' },
  payee_blocked_short: { en: 'Payee Blocked', es: 'Destinatario Bloqueado' },
  attacker_step0_desc: {
    en: 'Failed login recorded from unrecognized mobile user agent.',
    es: 'Intento de inicio de sesión fallido registrado desde agente móvil no reconocido.',
  },
  attacker_step0_sub: {
    en: 'Attacker is probing access to Sarah’s mobile banking account.',
    es: 'El atacante está intentando acceder a la cuenta de Sarah.',
  },
  attacker_step1_desc: {
    en: 'One-time passcode (OTP) requested.',
    es: 'Código de acceso único (OTP) solicitado.',
  },
  attacker_step2_desc: {
    en: 'Password reset completed via self-service portal.',
    es: 'Contraseña restablecida exitosamente en el portal.',
  },
  attacker_step2_sub: {
    en: 'New password activated in this attacker session.',
    es: 'Nueva contraseña activada en esta sesión.',
  },
  attacker_step3_desc: {
    en: 'Email changed to attacker address.',
    es: 'Correo electrónico actualizado a dirección del atacante.',
  },
  attacker_step3_sub: {
    en: 'Security notice dispatched to original sarah.m****@email.com.',
    es: 'Aviso de seguridad enviado al correo original sarah.m****@email.com.',
  },
  attacker_step4_desc: {
    en: 'Phone number updated to (555) 019-2834.',
    es: 'Número de teléfono actualizado a (555) 019-2834.',
  },
  attacker_step4_sub: {
    en: 'Pre-change verified phone on file was (206) 555-4821.',
    es: 'El número previo verificado de Sarah era (206) 555-4821.',
  },
  attacker_advance_note: {
    en: 'Advance to Next step to see the transfer attempt.',
    es: 'Avance al siguiente paso para ver el intento de retiro.',
  },
  sms_step0: {
    en: 'Sound: Unrecognized login attempt detected on your mobile banking.',
    es: 'Sound: Intento de inicio de sesión no reconocido registrado.',
  },
  sms_step1: {
    en: 'Sound: Your one-time verification passcode is 849-210. Never share this code with anyone.',
    es: 'Sound: Su código de verificación es 849-210. No comparta este código con nadie.',
  },
  sms_step2: {
    en: 'Sound: Password was reset for your digital banking account.',
    es: 'Sound: Se completó el restablecimiento de contraseña de su cuenta.',
  },
  sms_step3: {
    en: 'Sound: Your profile email was updated. If you did not make this change, contact us immediately.',
    es: 'Sound: Su correo de perfil fue modificado. Si no lo reconoció, contáctenos inmediatamente.',
  },
  sms_step4: {
    en: 'Sound Alert: A request to update your registered phone to (555) 019-2834 was detected.',
    es: 'Sound Alerta: Se detectó una solicitud para cambiar su teléfono registrado a (555) 019-2834.',
  },
  sms_waiting: {
    en: 'Waiting for payee enrollment events...',
    es: 'Esperando eventos de destinatario...',
  },
  sarah_auth_required: {
    en: 'Sound Credit Union: New Payee Authorization Required',
    es: 'Sound Credit Union: Verificación de Nuevo Destinatario',
  },
  sarah_dispatched_trusted: {
    en: 'Dispatched to your trusted line (•••-4821)',
    es: 'Enviado a su línea de confianza (•••-4821)',
  },
  event_badge: { en: 'Event', es: 'Evento' },

  // Activity Tab
  activity_history: { en: 'Activity History', es: 'Registro de Actividad' },
  events_count: { en: '{count} events', es: '{count} eventos' },
  time_label: { en: 'Time:', es: 'Hora:' },
  channel_label: { en: 'Channel:', es: 'Canal:' },
  note_label: { en: 'Note:', es: 'Nota:' },
  standard_log_entry: { en: 'Standard log entry', es: 'Registro estándar de actividad' },
  close: { en: 'Close', es: 'Cerrar' },

  // Help Tab
  security_and_help: { en: 'Security & Help', es: 'Soporte y Seguridad' },
  here_to_protect: { en: 'We are here to protect you 24/7', es: 'Estamos aquí para protegerle 24/7' },
  think_scammed: { en: "I think I've been scammed", es: 'Creo que he sido víctima de una estafa' },
  talk_to_someone: { en: 'Talk to someone', es: 'Hablar con alguien' },
  direct_fraud_line: {
    en: 'Direct line to Sound Credit Union Fraud Specialists:',
    es: 'Línea directa con especialistas en fraude de Sound Credit Union:',
  },
  visit_branch: { en: 'Visit a branch', es: 'Visitar una sucursal' },
  branches_desc: {
    en: '26 Puget Sound branches with in-person identity verification.',
    es: '26 sucursales en Puget Sound con verificación presencial de identidad.',
  },
  notify_branch_visit: { en: 'Notify Branch of In-Person Visit', es: 'Notificar a sucursal de visita presencial' },
  priority_flagged_branch: { en: 'Priority Flagged for Branch', es: 'Marcado con prioridad en sucursal' },

  // Guided Story Bar
  step_x_of_y: { en: 'Step {current} of {total}', es: 'Paso {current} de {total}' },
  back: { en: 'Back', es: 'Atrás' },
  next: { en: 'Next', es: 'Siguiente' },
  return_to_stories: { en: '← Return to stories', es: '← Volver a elegir historia' },

  // Scam Report Details
  scam_step1_header: { en: '1. What happened?', es: '1. ¿Qué ocurrió?' },
  scam_step2_header: { en: '2. Which payment?', es: '2. ¿Qué pago o transacción?' },
  scam_step3_header: { en: '3. How should we reach you?', es: '3. ¿Cómo debemos contactarle?' },
  scam_status_label: { en: 'Status:', es: 'Estado:' },
  scam_status_call: { en: 'Callback scheduled with fraud specialist', es: 'Llamada programada con especialista' },
  scam_status_branch: { en: 'Flagged as Branch PRIORITY', es: 'Marcado con PRIORIDAD en sucursal' },
  scam_protection_label: { en: 'Protection:', es: 'Medida de seguridad:' },

  // Event Types
  event_Failed_Login: { en: 'Failed Login', es: 'Inicio de sesión fallido' },
  event_One_Time_Code_Sent: { en: 'One-Time Code Sent', es: 'Código de un solo uso enviado' },
  event_Password_Reset: { en: 'Password Reset', es: 'Restablecimiento de contraseña' },
  event_Email_Change: { en: 'Email Change', es: 'Cambio de correo electrónico' },
  event_Phone_Change: { en: 'Phone Change', es: 'Cambio de teléfono' },
  event_Address_Change: { en: 'Address Change', es: 'Cambio de dirección' },
  event_Recipient_Added: { en: 'Recipient Added', es: 'Destinatario agregado' },
  event_Payment_Initiated: { en: 'Payment Initiated', es: 'Pago iniciado' },
  event_Fraud_Reported: { en: 'Fraud Reported', es: 'Fraude reportado' },
  event_Member_Inquiry: { en: 'Member Inquiry', es: 'Consulta del socio' },
  event_Cash_Withdrawal_Request: { en: 'Cash Withdrawal Request', es: 'Solicitud de retiro en efectivo' },
  event_Withdrawal_Cancelled: { en: 'Withdrawal Cancelled', es: 'Retiro cancelado' },
  event_Account_Secured: { en: 'Account Secured', es: 'Cuenta protegida' },

  // Scam Report Modal
  scam_modal_title: { en: "I Think I've Been Scammed", es: 'Reportar una Estafa o Fraude' },
  scam_close: { en: '✕ Close', es: '✕ Cerrar' },
  scam_progress: { en: 'Step {step} of 3: {title}', es: 'Paso {step} de 3: {title}' },
  scam_step1_title: { en: 'What happened?', es: '¿Qué ocurrió?' },
  scam_step2_title: { en: 'Which payment?', es: '¿Qué pago o transacción?' },
  scam_step3_title: { en: 'How should we reach you?', es: '¿Cómo debemos contactarle?' },
  scam_reassurance: {
    en: "We're here to help, and it's not your fault. Scams fool careful people every day.",
    es: 'Estamos aquí para ayudarle, y no es su culpa. Las estafas engañan a personas cuidadosas todos los días.',
  },
  scam_opt_account: {
    en: 'Someone got into my account',
    es: 'Alguien ingresó a mi cuenta sin autorización',
  },
  scam_opt_scammer: {
    en: 'I sent money to someone I now think is a scammer',
    es: 'Envié dinero a alguien que ahora creo que es un estafador',
  },
  scam_opt_other: {
    en: 'Something else',
    es: 'Otra situación sospechosa',
  },
  scam_details_label: { en: 'Additional details (optional):', es: 'Detalles adicionales (opcional):' },
  scam_details_placeholder: {
    en: 'Describe what happened, who contacted you, or any suspicious instructions...',
    es: 'Describa lo que ocurrió, quién le contactó, o instrucciones sospechosas...',
  },
  scam_which_payment_desc: {
    en: 'Select any payments connected to this scam so we can initiate recall attempts immediately:',
    es: 'Seleccione los pagos vinculados a esta estafa para que iniciemos solicitudes de recuperación de inmediato:',
  },
  scam_no_payments: {
    en: 'No outgoing digital payments on record',
    es: 'No hay pagos digitales registrados',
  },
  scam_not_sure: { en: "I'm not sure", es: 'No estoy seguro/a de cuál fue' },
  scam_reach_call: { en: 'Call me', es: 'Llamarme por teléfono' },
  scam_reach_call_desc: {
    en: 'A fraud specialist will call your verified trusted number within 30 minutes.',
    es: 'Un especialista en fraude le llamará a su número de confianza en menos de 30 minutos.',
  },
  scam_reach_branch: { en: "I'll visit a branch", es: 'Visitaré una sucursal' },
  scam_reach_branch_desc: {
    en: 'Visit any of our 26 branch locations. Your case will be marked PRIORITY at the front of the queue.',
    es: 'Visite cualquiera de nuestras 26 sucursales. Su caso se marcará con PRIORIDAD en la atención.',
  },
  scam_branch_priority_badge: {
    en: 'PRIORITY · Branch Teller Priority',
    es: 'PRIORIDAD · Prioridad de Caja en Sucursal',
  },
  submit_report: { en: 'Submit report', es: 'Enviar Reporte' },
  scam_submitted_title: { en: 'Report Received', es: 'Reporte Recibido' },
  scam_submitted_reassurance: {
    en: "We've got it, and it's not your fault. Case #{caseId} is open. We've paused outgoing payments while we review. The sooner you report, the better the chance we can get money back.",
    es: 'Hemos recibido su reporte, y esto no es su culpa. El caso #{caseId} está abierto. Hemos pausado los pagos salientes mientras revisamos. Cuanto antes reporte, mayor será la posibilidad de recuperar los fondos.',
  },
  scam_case_status: {
    en: 'Status: Open · Assigned to Senior Investigator',
    es: 'Estado: Abierto · Asignado a Investigador Principal',
  },
  scam_branch_priority_status: {
    en: 'Status: Open (PRIORITY) · Branch Team Alerted',
    es: 'Estado: Abierto (PRIORITARIO) · Equipo de Sucursal Notificado',
  },
  scam_protection_notice: {
    en: 'Protection: Outgoing payment rails frozen',
    es: 'Medida de seguridad: Rieles de pago salientes congelados',
  },
  done: { en: 'Done', es: 'Listo' },
};

export function t(key: string, lang: Lang, params?: Record<string, string | number>): string {
  const entry = DICTIONARY[key];
  let text = entry ? entry[lang] || entry.en : key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }
  return text;
}

export function translateEventType(eventType: string, lang: Lang): string {
  if (lang === 'en') return eventType;
  const key = `event_${eventType.replace(/[\s-]+/g, '_')}`;
  if (DICTIONARY[key]) {
    return DICTIONARY[key].es;
  }
  // Fallbacks
  const map: Record<string, string> = {
    'Failed Login': 'Inicio de sesión fallido',
    'One-Time Code Sent': 'Código de un solo uso enviado',
    'Password Reset': 'Restablecimiento de contraseña',
    'Email Change': 'Cambio de correo electrónico',
    'Phone Change': 'Cambio de teléfono',
    'Address Change': 'Cambio de dirección',
    'Recipient Added': 'Destinatario agregado',
    'Payment Initiated': 'Pago iniciado',
    'Fraud Reported': 'Fraude reportado',
    'Member Inquiry': 'Consulta del socio',
    'Cash Withdrawal Request': 'Solicitud de retiro en efectivo',
    'Withdrawal Cancelled': 'Retiro cancelado',
    'Account Secured': 'Cuenta protegida',
  };
  return map[eventType] || eventType;
}

export function translateChannel(channel: string, lang: Lang): string {
  if (lang === 'en') return channel;
  const map: Record<string, string> = {
    Mobile: 'Móvil',
    SMS: 'SMS',
    Phone: 'Teléfono',
    Branch: 'Sucursal',
    'Online Banking': 'Banca en Línea',
    'Contact Center': 'Centro de Contacto',
  };
  return map[channel] || channel;
}
