import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

/* ─────────────────────────────────────────
   MVP contact-form backend.
   Flow: validate → build transporter → send mail → respond.
   No DB, no queue — just "does it reach the inbox reliably".
───────────────────────────────────────── */

type ContactPayload = {
  name: string
  email: string
  phone?: string
  service?: string
  budget?: string
  message: string
}

// Very small, dependency-free email check — good enough to catch typos,
// not meant to be a full RFC validator.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(body: Partial<ContactPayload>): string | null {
  if (!body.name || !body.name.trim()) return "Name is required."
  if (!body.email || !EMAIL_RE.test(body.email)) return "A valid email is required."
  if (!body.message || !body.message.trim()) return "Message is required."
  return null
}

export async function POST(req: NextRequest) {
  let body: Partial<ContactPayload>

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const validationError = validate(body)
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  const { name, email, phone, service, budget, message } = body as ContactPayload

  const EMAIL_USER = process.env.EMAIL_USER
  const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD

  if (!EMAIL_USER || !EMAIL_APP_PASSWORD) {
    // Fails loudly in dev so a missing .env.local is obvious instead of
    // silently swallowed as a generic 500.
    console.error("Missing EMAIL_USER or EMAIL_APP_PASSWORD in environment.")
    return NextResponse.json({ error: "Server email is not configured." }, { status: 500 })
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_APP_PASSWORD,
    },
  })

  const subject = `New inquiry from ${name}${service ? ` — ${service}` : ""}`

  const textBody = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    service ? `Service: ${service}` : null,
    budget ? `Budget: ${budget}` : null,
    "",
    "Message:",
    message,
  ]
    .filter(Boolean)
    .join("\n")

  // Row helper — keeps the table markup below readable. Skips rendering
  // entirely when a value wasn't provided (phone/service/budget are optional).
  function row(label: string, value?: string): string {
    if (!value) return ""
    return `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #F1E9F6;vertical-align:top;width:120px">
          <span style="font-family:sans-serif;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#8B2FC9">${label}</span>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #F1E9F6;vertical-align:top">
          <span style="font-family:sans-serif;font-size:15px;color:#1B1023">${escapeHtml(value)}</span>
        </td>
      </tr>`
  }

  const htmlBody = `
  <!DOCTYPE html>
  <html>
    <body style="margin:0;padding:0;background:#FBF7FC;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7FC;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 24px 60px rgba(27,16,35,0.08);">

              <!-- Gradient header, matches the site's hero/CTA gradient -->
              <tr>
                <td style="background:linear-gradient(135deg,#8B2FC9,#FF2D95);background-color:#8B2FC9;padding:36px 40px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <span style="display:inline-block;font-family:sans-serif;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.85);background:rgba(255,255,255,0.14);border:1px solid rgba(255,255,255,0.28);border-radius:999px;padding:6px 14px;">
                          New inquiry
                        </span>
                        <h1 style="margin:16px 0 0;font-family:sans-serif;font-size:26px;font-weight:800;color:#ffffff;line-height:1.25;">
                          ${escapeHtml(name)} wants to start something.
                        </h1>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:32px 40px 8px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    ${row("Name", name)}
                    ${row("Email", email)}
                    ${row("Phone", phone)}
                    ${row("Service", service)}
                    ${row("Budget", budget)}
                  </table>
                </td>
              </tr>

              <!-- Message block, styled as its own card so it stands out -->
              <tr>
                <td style="padding:24px 40px 8px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7FC;border:1px solid rgba(139,47,201,0.14);border-radius:16px;">
                    <tr>
                      <td style="padding:20px 22px;">
                        <span style="display:block;font-family:sans-serif;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#8B2FC9;margin-bottom:8px;">
                          Message
                        </span>
                        <p style="margin:0;font-family:sans-serif;font-size:15px;line-height:1.7;color:#1B1023;white-space:pre-wrap;">${escapeHtml(message)}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Reply CTA — one click back to the sender -->
              <tr>
                <td style="padding:28px 40px 36px;">
                  <a href="mailto:${encodeURIComponent(email)}" style="display:inline-block;font-family:sans-serif;font-size:14px;font-weight:700;color:#ffffff;background:linear-gradient(135deg,#8B2FC9,#FF2D95);background-color:#8B2FC9;padding:14px 28px;border-radius:999px;text-decoration:none;">
                    Reply to ${escapeHtml(name.split(" ")[0] || "them")} →
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 40px;border-top:1px solid #F1E9F6;">
                  <p style="margin:0;font-family:sans-serif;font-size:12px;color:#a89aad;">
                    Sent automatically from the SK Techs website contact form.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `

  try {
    await transporter.sendMail({
      from: `"Website Contact Form" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error("Failed to send contact email:", err)
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
  }
}

// Minimal HTML-escaping so form input can't break out of the email markup.
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}