import SibApiV3Sdk from "sib-api-v3-sdk";

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!to) {
      console.log("❌ No recipient email provided");
      return;
    }

    const client = SibApiV3Sdk.ApiClient.instance;

    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const sender = {
      name: "EasyAppointments",
      email: "ashiqtalpur18@gmail.com", // ✅ MUST be verified in Brevo
    };

    const receivers = [
      {
        email: to,
      },
    ];

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject,
      htmlContent: html,
    });

    console.log("✅ Email sent successfully via Brevo API");
  } catch (error) {
    console.log(
      "❌ Email sending error:",
      error.response?.body || error.message
    );
  }
};

export default sendEmail;
