import nodemailer from "nodemailer";

let transporterPromise = nodemailer.createTestAccount().then((testAccount) =>
  nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "brennon.moen83@ethereal.email",
      pass: "zKxEVQ4cEKqcrHhuQr",
    },
  })
);

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendMail({ to, subject, text, html }: MailOptions) {
  const transporter = await transporterPromise;

  const info = await transporter.sendMail({
    from: '"My App" <no-reply@myapp.com>',
    to,
    subject,
    text,
    html,
  });

  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  return info;
}
