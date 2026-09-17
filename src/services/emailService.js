import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Sends an inquiry submission via EmailJS.
 * Expects template variables: name, email, phone, service, message.
 */
export function sendInquiry(formData) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return Promise.reject(
      new Error(
        "EmailJS is not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY in your .env file."
      )
    );
  }

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      message: formData.message,
    },
    { publicKey: PUBLIC_KEY }
  );
}
