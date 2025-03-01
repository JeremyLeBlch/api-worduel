import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: false, // `true` pour 465, `false` pour d'autres ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetPasswordEmail = async (to: string, resetLink: string) => {
  const mailOptions = {
    from: '"Support Worduel" <no-reply@worduel.com>',
    to,
    subject: 'Réinitialisation de votre mot de passe',
    html: `<p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
           <p>Veuillez cliquer sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
           <a href="${resetLink}">${resetLink}</a>
           <p>Ce lien expirera dans une heure.</p>`,
  };

  await transporter.sendMail(mailOptions);
};