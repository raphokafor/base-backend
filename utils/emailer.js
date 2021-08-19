// email utils
const fetch = require("node-fetch");
const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

exports.sendEmail = async ({ ...emailData }) => {
  const emailObject = {
    from: process.env.EMAIL_FROM,
    to: emailData.email,
    subject: emailData.subject,
    html: emailData.emailHtml,
    text: emailData.text && emailData.text,
  };

  await mg.messages().send(emailObject);
};
