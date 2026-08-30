import Mailgen from "mailgen";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://projectmanagement-omk.vercel.app",
    },
  });

  const emailHtml = mailGenerator.generate(
    options.mailgenContent
  );

  try {
    console.log("=================================");
    console.log("📧 SENDING EMAIL USING BREVO API");
    console.log("From:", process.env.BREVO_SENDER_EMAIL);
    console.log("To:", options.email);

    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",

        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },

        body: JSON.stringify({
          sender: {
            name: process.env.BREVO_SENDER_NAME,
            email: process.env.BREVO_SENDER_EMAIL,
          },

          to: [
            {
              email: options.email,
            },
          ],

          subject: options.subject,

          htmlContent: emailHtml,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("=================================");
      console.log("❌ BREVO EMAIL ERROR");
      console.log("Status:", response.status);
      console.log("Response:", data);
      console.log("=================================");

      throw new Error(
        data.message || "Brevo email sending failed"
      );
    }

    console.log("=================================");
    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("To:", options.email);
    console.log("Message ID:", data.messageId);
    console.log("=================================");

    return data;

  } catch (error) {

    console.log("=================================");
    console.log("❌ EMAIL SENDING FAILED");
    console.log("Error:", error.message);
    console.log("=================================");

    throw error;
  }
};


const emailVerificationMailgenContent = (
  username,
  verificationUrl
) => {
  return {
    body: {
      name: username,

      intro:
        "Welcome to Task Manager! We're excited to have you on board.",

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


const forgotPasswordMailgenContent = (
  username,
  passwordResetUrl
) => {
  return {
    body: {
      name: username,

      intro:
        "We received a request to reset the password for your Task Manager account.",

      action: {
        instructions:
          "Click the button below to reset your password.",

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


export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};