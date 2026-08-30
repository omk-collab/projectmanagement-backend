import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.GMAIL_SMTP_HOST,
  port: Number(process.env.GMAIL_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.GMAIL_SMTP_USER,
    pass: process.env.GMAIL_SMTP_PASS,
  },
});

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://projectmanagement-omk.vercel.app",
    },
  });

  const emailHtml = mailGenerator.generate(options.mailgenContent);

  try {
    const info = await transporter.sendMail({
      from: `"Task Manager" <${process.env.GMAIL_SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      html: emailHtml,
    });

    console.log("✅ Mail Sent Successfully");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.log("❌ MAIL ERROR");
    console.log(error);

    throw error;
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,

      intro: "Welcome to our App! We're excited to have you on board.",

      action: {
        instructions:
          "To verify your email please click on the following button.",

        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl,
        },
      },

      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,

      intro: "We got a request to reset the password of your account.",

      action: {
        instructions: "To reset your password click on the following button.",

        button: {
          color: "#22BC66",
          text: "Reset Password",
          link: passwordResetUrl,
        },
      },

      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};
