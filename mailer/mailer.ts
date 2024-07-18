import type { SendMailOptions } from "nodemailer";
import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import readline from "readline";

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
        pass: process.env.MAIL_SERVER_PASSWORD,
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

// Function to read the JSON file and convert it to a JavaScript object
function readConfigFile(filePath: string): any {
  try {
    const absolutePath = path.resolve(filePath);
    const fileContents = fs.readFileSync(absolutePath, "utf8");
    const configObject = JSON.parse(fileContents);
    return configObject;
  } catch (error) {
    console.error("Error reading or parsing config file:", error);
    process.exit(1);
  }
}

// Step 1: Define the email validation function
function isValidEmail(email: string): boolean {
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email.toLowerCase());
}

const args = process.argv;

if (args.length < 3) {
  console.info("usage: ts mailer <path to config file>");
  process.exit(1);
}

// Assuming the path to the config file is the second argument (index 2)
const configFilePath = args[2];

// Usage
const config: { from: string; to: string; subject: string; body: string } =
  readConfigFile(configFilePath);
console.log(config); // For demonstration purposes
const { from, to, subject, body } = config;

if (!isValidEmail(from)) {
  console.error("from is not a valid email");
  process.exit(1);
}

if (!isValidEmail(to)) {
  console.error("to is not a valid email");
  process.exit(1);
}

if (subject === "" || !subject) {
  console.error("subject is empty");
  process.exit(1);
}

if (body === "" || !body) {
  console.error("body is empty");
  process.exit(1);
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Confirmation prompt before sending mail
rl.question("Are you sure you want to send this email? (yes/no) ", (answer) => {
  if (answer.toLowerCase() === "yes") {
    sendMail(from, to, subject, body);
    console.log("Email sent successfully.");
  } else {
    console.log("Email sending canceled.");
  }
  rl.close();
});
