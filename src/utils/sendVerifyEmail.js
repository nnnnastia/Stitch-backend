// utils/sendVerifyEmail.js
import { createTransporter } from "./mailer.js";

export async function sendVerificationEmail({ to, verifyUrl }) {
    const transporter = createTransporter();

    await transporter.sendMail({
        from: process.env.MAIL_FROM, // напр. "Stitch <no-reply@stitch.com>"
        to,
        subject: "Підтвердіть електронну пошту",
        html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>Підтвердження пошти</h2>
        <p>Перейдіть за посиланням нижче, щоб підтвердити email:</p>
        <p>
          <a href="${verifyUrl}" style="display:inline-block;padding:10px 14px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px">
            Підтвердити пошту
          </a>
        </p>
        <p style="color:#666;font-size:12px">Посилання діє обмежений час.</p>
      </div>
    `,
    });
}
