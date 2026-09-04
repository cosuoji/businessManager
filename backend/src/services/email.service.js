import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async ({
  email,
  name,
  resetToken,
}) => {
  const resetUrl =
    `${process.env.PASSWORD_RESET_URL}?token=${resetToken}`;

  await resend.emails.send({
    from: "Business Manager <onboarding@yourdomain.com>",
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password reset</h2>

        <p>Hi ${name},</p>

        <p>
          We received a request to reset your Business Manager password.
        </p>

        <p>
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #000;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          This link will expire in 1 hour.
        </p>

        <p>
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};
