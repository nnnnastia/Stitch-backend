import { createTransporter } from "../utils/mailer.js";

export async function sendResetPasswordEmail({ to, resetUrl }) {
    const transporter = createTransporter();
    await transporter.sendMail({
        from: `"Marketplace Support" <${process.env.SMTP_FROM}>`,
        to,
        subject: "Відновлення пароля",

        text: `
Відновлення пароля

Перейдіть за посиланням:
${resetUrl}

Посилання дійсне 15 хвилин.
Якщо ви не робили запит — просто проігноруйте цей лист.
        `,

        html: `
            <h2>Відновлення пароля</h2>
            <p>Ми отримали запит на зміну пароля.</p>
            <p>
                Для встановлення нового пароля перейдіть за посиланням:
            </p>
            <p>
                <a href="${resetUrl}">${resetUrl}</a>
            </p>
            <p>Посилання дійсне протягом 15 хвилин.</p>
            <p>Якщо ви не надсилали цей запит, просто проігноруйте цей лист.</p>
        `,
    });
}