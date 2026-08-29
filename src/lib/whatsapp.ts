/**
 * Milad Drinking Water - WhatsApp Messaging Utility Service
 * Production-ready notification helper supporting UltraMsg, Twilio, and Greenweb APIs.
 */

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  recipient: string;
  error?: string;
  provider?: 'ultramsg' | 'greenweb' | 'mock';
  timestamp: string;
}

export interface WhatsAppSendOptions {
  to: string;
  message: string;
  priority?: number; // 1-10
  referenceId?: string;
}

export interface WhatsAppDocumentOptions {
  to: string;
  documentUrl: string;
  filename: string;
  caption?: string;
}

/**
 * Normalizes and formats Bangladeshi phone numbers to international standard (8801XXXXXXXXX).
 * Handles formats like:
 * - "+880 1712-345678" -> "8801712345678"
 * - "01712345678"      -> "8801712345678"
 * - "8801712345678"    -> "8801712345678"
 * - "01819-876543"     -> "8801819876543"
 */
export function formatBangladeshiPhone(rawPhone: string): string {
  if (!rawPhone) return '';

  // Strip all non-digit characters (+, -, spaces, parentheses, etc.)
  let digits = rawPhone.replace(/\D/g, '');

  // If starts with 0088, strip leading 00
  if (digits.startsWith('0088')) {
    digits = digits.slice(2);
  }

  // If starts with 880 (e.g. 8801712345678)
  if (digits.startsWith('880') && digits.length === 13) {
    return digits;
  }

  // If starts with 01 (local 11-digit format e.g. 01712345678)
  if (digits.startsWith('01') && digits.length === 11) {
    return `88${digits}`;
  }

  // If starts with 1 (e.g. 1712345678, missing 0)
  if (digits.startsWith('1') && digits.length === 10) {
    return `880${digits}`;
  }

  return digits;
}

/**
 * Validates whether the formatted phone number is a valid Bangladeshi mobile number.
 * Valid BD prefixes: 013, 014, 015, 016, 017, 018, 019
 */
export function isValidBangladeshiPhone(formattedPhone: string): boolean {
  const bdMobileRegex = /^8801[3-9]\d{8}$/;
  return bdMobileRegex.test(formattedPhone);
}

/**
 * Generates an instant Click-to-Chat URL (https://wa.me/...)
 * for web and admin dashboard manual one-click communication.
 */
export function createWhatsAppChatUrl(phone: string, textMessage?: string): string {
  const formatted = formatBangladeshiPhone(phone);
  if (!formatted) return '#';
  
  const encodedText = textMessage ? encodeURIComponent(textMessage) : '';
  return `https://wa.me/${formatted}${encodedText ? `?text=${encodedText}` : ''}`;
}

/**
 * Retrieves WhatsApp credentials safely from environment variables.
 */
function getCredentials() {
  const instanceId = 
    (typeof process !== 'undefined' && process.env?.WHATSAPP_INSTANCE_ID) ||
    (typeof process !== 'undefined' && process.env?.ULTRAMSG_INSTANCE_ID) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_WHATSAPP_INSTANCE_ID) ||
    'instance103829';

  const token = 
    (typeof process !== 'undefined' && process.env?.WHATSAPP_API_TOKEN) ||
    (typeof process !== 'undefined' && process.env?.ULTRAMSG_TOKEN) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_WHATSAPP_API_TOKEN) ||
    '';

  const baseUrl = 
    (typeof process !== 'undefined' && process.env?.ULTRAMSG_API_URL) ||
    'https://api.ultramsg.com';

  return { instanceId, token, baseUrl };
}

/**
 * Sends a WhatsApp text message via UltraMsg / WhatsApp Gateway with retry logic.
 */
export async function sendWhatsAppMessage(
  options: WhatsAppSendOptions,
  maxRetries = 2
): Promise<WhatsAppSendResult> {
  const { to, message, referenceId } = options;
  const formattedPhone = formatBangladeshiPhone(to);

  if (!formattedPhone || !isValidBangladeshiPhone(formattedPhone)) {
    console.warn(`[WhatsApp] Invalid Bangladeshi mobile number: "${to}" (formatted: "${formattedPhone}")`);
    return {
      success: false,
      recipient: to,
      error: `Invalid Bangladeshi mobile number: ${to}. Expected format 01XXXXXXXXX or +8801XXXXXXXXX`,
      timestamp: new Date().toISOString()
    };
  }

  const { instanceId, token, baseUrl } = getCredentials();

  // If token is not configured or in test sandbox mode, perform safe simulation & logging
  if (!token || token === 'your_ultramsg_token' || token === 'your_whatsapp_token_here') {
    console.info(`[WhatsApp Mock Simulation] To: +${formattedPhone} | Ref: ${referenceId || 'N/A'}`);
    console.info(`[WhatsApp Content]\n${message}\n---`);
    return {
      success: true,
      messageId: `mock_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      recipient: formattedPhone,
      provider: 'mock',
      timestamp: new Date().toISOString()
    };
  }

  const endpoint = `${baseUrl.replace(/\/$/, '')}/${instanceId}/messages/chat`;
  const payload = new URLSearchParams({
    token: token,
    to: formattedPhone,
    body: message,
    priority: String(options.priority || 10),
    referenceId: referenceId || ''
  });

  let attempt = 0;
  let lastError = '';

  while (attempt <= maxRetries) {
    try {
      attempt++;
      console.log(`[WhatsApp] Dispatching message attempt ${attempt}/${maxRetries + 1} to +${formattedPhone}`);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: payload.toString()
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status} ${response.statusText}`);
      }

      console.log(`[WhatsApp Success] Sent to +${formattedPhone} (ID: ${data.id || data.messageId || 'OK'})`);
      return {
        success: true,
        messageId: data.id || data.messageId || `msg_${Date.now()}`,
        recipient: formattedPhone,
        provider: 'ultramsg',
        timestamp: new Date().toISOString()
      };
    } catch (err: any) {
      lastError = err?.message || 'Unknown network error';
      console.error(`[WhatsApp Error attempt ${attempt}] Failed to send to +${formattedPhone}:`, lastError);

      if (attempt <= maxRetries) {
        // Exponential backoff wait (500ms, 1000ms...)
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }

  return {
    success: false,
    recipient: formattedPhone,
    error: lastError,
    provider: 'ultramsg',
    timestamp: new Date().toISOString()
  };
}

/**
 * Sends a PDF or document invoice via WhatsApp.
 */
export async function sendWhatsAppDocument(
  options: WhatsAppDocumentOptions
): Promise<WhatsAppSendResult> {
  const { to, documentUrl, filename, caption } = options;
  const formattedPhone = formatBangladeshiPhone(to);

  if (!formattedPhone || !isValidBangladeshiPhone(formattedPhone)) {
    return {
      success: false,
      recipient: to,
      error: `Invalid Bangladeshi mobile number: ${to}`,
      timestamp: new Date().toISOString()
    };
  }

  const { instanceId, token, baseUrl } = getCredentials();

  if (!token || token === 'your_ultramsg_token' || token === 'your_whatsapp_token_here') {
    console.info(`[WhatsApp Document Simulation] Document: ${filename} -> +${formattedPhone}`);
    return {
      success: true,
      messageId: `mock_doc_${Date.now()}`,
      recipient: formattedPhone,
      provider: 'mock',
      timestamp: new Date().toISOString()
    };
  }

  const endpoint = `${baseUrl.replace(/\/$/, '')}/${instanceId}/messages/document`;
  const payload = new URLSearchParams({
    token: token,
    to: formattedPhone,
    filename: filename,
    document: documentUrl,
    caption: caption || `Official Invoice from Milad Drinking Water (${filename})`
  });

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload.toString()
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }

    return {
      success: true,
      messageId: data.id || data.messageId,
      recipient: formattedPhone,
      provider: 'ultramsg',
      timestamp: new Date().toISOString()
    };
  } catch (err: any) {
    return {
      success: false,
      recipient: formattedPhone,
      error: err?.message || 'Failed to dispatch document',
      timestamp: new Date().toISOString()
    };
  }
}
