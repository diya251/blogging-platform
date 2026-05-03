import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
) {
  await resend.emails.send({
    from: "WriteFlow <onboarding@resend.dev>", // ✅ works without a custom domain
    to,
    subject: "Reset your WriteFlow password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="font-size: 24px; font-weight: bold;">Reset your password</h2>
        <p style="color: #555;">
          Click the button below to reset your password. 
          This link expires in <strong>1 hour</strong>.
        </p>
        <a href="${resetUrl}"
          style="display: inline-block; margin-top: 16px; padding: 12px 24px;
                 background: #000; color: #fff; border-radius: 8px;
                 text-decoration: none; font-weight: 500;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}