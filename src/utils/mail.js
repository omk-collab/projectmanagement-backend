import Mailgen from "mailgen";
import nodemailer from "nodemailer";

// ========================================
// Gmail SMTP Transporter
// ========================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,

  // Gmail SMTP port 587 uses STARTTLS
  secure: false,

  // IMPORTANT:
  // Force IPv4 because Render was trying IPv6
  // and giving ENETUNREACH error.
  family: 4,

  auth: {
    user: process.env.GMAIL_SMTP_USER,
    pass: process.env.GMAIL_SMTP_PASS,
  },
});

// ========================================
// Send Email
// ========================================

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",

    product: {
      name: "Task Manager",
      link: "https://projectmanagement-omk.vercel.app",
    },
  });

  // Generate HTML email
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
    console.log("✅ MAIL SENT SUCCESSFULLY");
    console.log("To:", options.email);
    console.log("Message ID:", info.messageId);
    console.log("=================================");

    return info;
  } catch (error) {
    console.log("=================================");
    console.log("❌ SMTP CONNECTION / MAIL ERROR");
    console.log("Error Code:", error.code);
    console.log("Error Message:", error.message);
    console.log("Full Error:", error);
    console.log("=================================");

    throw error;
  }
};

// ========================================
// Email Verification Content
// ========================================

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

// ========================================
// Forgot Password Content
// ========================================

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

// ========================================
// Exports
// ========================================

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};
