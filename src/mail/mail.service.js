import nodemailer from "nodemailer";

function getTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

export async function sendVerificationEmail(email, verificationLink) {
    const transporter = getTransporter();

    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: "Підтвердження електронної пошти",
        html: `
            <h2>Підтвердіть email</h2>
            <p>Натисніть на посилання нижче:</p>
            <a href="${verificationLink}">${verificationLink}</a>
        `,
    });
}