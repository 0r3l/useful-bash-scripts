import type { SendMailOptions } from "nodemailer";
import nodemailer from "nodemailer";

export const sendMail = async (
  fromMail: string,
  address: string,
  subject: string,
  text: string,
  html?: string
) => {
  const user = "m05169-AP@MTA02.ATT-MAIL.COM";
  try {
    const transporter = nodemailer.createTransport({
      host: "mta02.az.3pc.att.com",
      port: 587,
      secure: false,
      auth: {
        user: user,
        pass: "Sbg%jHr4&D",
      },
    });

    const mailOptions: SendMailOptions = {
      from: fromMail,
      to: address,
      subject: subject,
      text: text,
      html: html, // HTML body content
    };

    const info = await transporter.sendMail({
      ...mailOptions,
      envelope: { from: user, to: address },
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};


// Step 1: Define the email validation function
function isValidEmail(email: string): boolean {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email.toLowerCase());
}

const args = process.argv;

if(args.length < 6){
  console.info('usage: ts mailer <from> <to> <subject> <text> [html]')
  process.exit(1)
}


// Inside the script where you parse arguments and before sending the email
const [_, __, from, to, subject, text, html] = args;

// Step 2: Validate the 'from' and 'to' email addresses
if (!isValidEmail(from) || !isValidEmail(to)) {
  console.error("Invalid email address provided.");
  process.exit(1);
}

sendMail(
  from,
  to,
  subject,
  text,
);
