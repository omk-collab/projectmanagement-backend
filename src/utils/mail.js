import Mailgen from "mailgen";
import nodemailer from "nodemailer";

// ==========================================
// GMAIL SMTP CONFIGURATION
// ==========================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.GMAIL_SMTP_USER,
    pass: process.env.GMAIL_SMTP_PASS,
  },

  tls: {
    rejectUnauthorized: false,
  },
});

// ==========================================
// VERIFY SMTP CONNECTION
// ==========================================

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP CONNECTION FAILED");
    console.log(error);
  } else {
    console.log("✅ SMTP SERVER READY");
  }
});

// ==========================================
// SEND EMAIL
// ==========================================

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
    console.log("=================================");
    console.log("📧 TRYING TO SEND EMAIL");
    console.log("From:", process.env.GMAIL_SMTP_USER);
    console.log("To:", options.email);

    const info = await transporter.sendMail({
      from: `"Task Manager" <${process.env.GMAIL_SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      html: emailHtml,
    });

    console.log("=================================");
    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("To:", options.email);
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
    console.log("=================================");

    return info;
  } catch (error) {
    console.log("=================================");
    console.log("❌ EMAIL SENDING FAILED");
    console.log("Error code:", error.code);
    console.log("Error message:", error.message);
    console.log("Full error:", error);
    console.log("=================================");

    throw error;
  }
};

// ==========================================
// EMAIL VERIFICATION
// ==========================================

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,

      intro: "Welcome to Task Manager! We're excited to have you on board.",

      action: {
        instructions:
          "To verify your email address, please click the button below.",

        button: {
          color: "#22BC66",
          text: "Verify Your Email",
          link: verificationUrl,
        },
      },

      outro:
        "If you did not create an account, you can safely ignore this email.",
    },
  };
};

// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,

      intro:
        "We received a request to reset the password for your Task Manager account.",

      action: {
        instructions: "Click the button below to reset your password.",

        button: {
          color: "#22BC66",
          text: "Reset Password",
          link: passwordResetUrl,
        },
      },

      outro:
        "If you did not request a password reset, you can safely ignore this email.",
    },
  };
};

// ==========================================
// EXPORT
// ==========================================

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};
