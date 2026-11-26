import nodemailer from "nodemailer";

// ---------- Provider 1: SMTP (Nodemailer) ----------
// Local development or paid hosting where SMTP ports are open.
const sendViaSmtp = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

// ---------- Provider 2: Brevo (HTTPS API) ----------
// Free hosting platforms (e.g. Render free tier) block outbound SMTP ports,
// so we send over HTTPS instead.
const sendViaBrevo = async (options) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: process.env.BREVO_SENDER_NAME || "NexCart",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: options.email }],
      subject: options.subject,
      textContent: options.message,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo email failed (${response.status}): ${errorBody}`);
  }
};

// ---------- Public function (same signature as before) ----------
const sendEmail = async (options) => {
  const provider = (process.env.EMAIL_PROVIDER || "smtp").toLowerCase();

  if (provider === "brevo") return sendViaBrevo(options);
  if (provider === "smtp") return sendViaSmtp(options);

  throw new Error(`Unsupported EMAIL_PROVIDER: ${provider}`);
};

export { sendEmail };