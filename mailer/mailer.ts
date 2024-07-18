import type { SendMailOptions } from "nodemailer";
import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import readline from "readline";
import { Address } from "nodemailer/lib/mailer";

function isAddress(addr: string | Address){
  return (addr as Address)?.address !== undefined
}

export const sendMail = async (
  fromMail: string | Address,
  address: string[],
  bcc: string,
  subject: string,
  text: string,
  html?: string
) => {
  const user = process.env.ATT ? "m05169-AP@MTA02.ATT-MAIL.COM" : "user@example.org";

  try {
    const transporter = nodemailer.createTransport(
      process.env.ATT
        ? {
            host: "mta02.az.3pc.att.com",
            port: 587,
            secure: false,
            auth: {
              user: user,
              pass: process.env.MAIL_SERVER_PASSWORD,
            },
          }
        : {
            host: "app.debugmail.io",
            port: 9025,
            auth: {
              user: user,
              pass: process.env.SMTP_PASS,
            },
          }
    );    
    const mailOptions: SendMailOptions = {
      from: {
        name: isAddress(fromMail) && (fromMail as Address).name  || fromMail as string,
        address: isAddress(fromMail) && (fromMail as Address).address  || fromMail as string
      } ,
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
function isValidEmail(addr: string | Address): boolean {
  if(isAddress(addr) && (addr as Address).name === undefined){
    throw Error("Error: from should configure as { name: 'sender name', address: 'sender email' }")
  }
  const email = isAddress(addr) && (addr as Address).address || addr as string;  
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
const config: { from: string | Address; to: string[]; bcc: string; subject: string; body: string[] } =
  readConfigFile(configFilePath);
console.log(config); // For demonstration purposes
const { from, to, subject, body, bcc } = config;

if (!isValidEmail(from)) {
  console.error("from is not a valid email");
  process.exit(1);
}

if (to.some(email =>!isValidEmail(email))) {
  console.error("to is not a valid email");
  process.exit(1);
}

if(!isValidEmail(bcc)){
  console.error("bcc is not a valid email");
  process.exit(1);
}

if (subject === "" || !subject) {
  console.error("subject is empty");
  process.exit(1);
}

if (!body.length || !body) {
  console.error("body is empty");
  process.exit(1);
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Confirmation prompt before sending mail
rl.question(
  "Are you sure you want to send this email? (yes/no) (emailer for edit)",
  async (answer) => {
    if (answer.toLowerCase() === "yes") {
      await sendMail(from, to, bcc, subject, body.join("\n"));
      console.log("Email sent successfully.");
    } else {
      console.log("Email sending canceled.");
    }
    rl.close();
  }
);
