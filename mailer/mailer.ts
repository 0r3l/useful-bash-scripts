import type { SendMailOptions } from "nodemailer";
import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import readline from "readline";
import { Address } from "nodemailer/lib/mailer";
import validator from 'html-validator';


function isAddress(addr: string | Address) {
  return (addr as Address)?.address !== undefined
}

export const sendMail = async (
  fromMail: string | Address,
  address: string[],
  bcc: string,
  subject: string,
  html: string,
  attachments: any
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
        name: isAddress(fromMail) && (fromMail as Address).name || fromMail as string,
        address: isAddress(fromMail) && (fromMail as Address).address || fromMail as string
      },
      to: address,
      subject: subject,
      bcc: bcc,
      attachments: attachments,
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
    console.debug(filePath)
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
  if (isAddress(addr) && (addr as Address).name === undefined) {
    throw Error("Error: from should configure as { name: 'sender name', address: 'sender email' }")
  }
  const email = isAddress(addr) && (addr as Address).address || addr as string;
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email.toLowerCase());
}

async function openAndValidateHtmlFile(filePath: string): Promise<string> {
  try {
    // Step 1: Read the HTML file
    const absolutePath = path.resolve(filePath);
    const htmlContent = fs.readFileSync(absolutePath, 'utf8');

    // Step 2: Validate the HTML content
    const options = {
      data: htmlContent, // HTML content to validate
      format: 'text' // Format of the validation result
    };

    // const result = await validator(options as any);
    //console.log(result);
    return htmlContent;
  } catch (error) {
    console.error("Error opening or validating HTML file:", error);
    throw error
  }
}




async function main() {
  const args = process.argv;

  if (args.length < 3) {
    console.info("usage: ts mailer <path to config file>");
    process.exit(1);
  }

  // Assuming the path to the config file is the second argument (index 2)
  const configFilePath = args[2];
  const templateFile = args[3];

  console.debug('configFilePath', configFilePath, 'templateFile', templateFile)

  // Usage
  const config: { from: string | Address; to: string[]; bcc: string; subject: string; attachments: any } =
    readConfigFile(configFilePath);
  const html = await openAndValidateHtmlFile(templateFile);
  console.log(config); // For demonstration purposes
  const { from, to, subject, bcc, attachments } = config;

  if (!isValidEmail(from)) {
    console.error("from is not a valid email");
    process.exit(1);
  }

  if (to.some(email => !isValidEmail(email))) {
    console.error("to is not a valid email");
    process.exit(1);
  }

  if (!isValidEmail(bcc)) {
    console.error("bcc is not a valid email");
    process.exit(1);
  }

  if (subject === "" || !subject) {
    console.error("subject is empty");
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
        await sendMail(from, to, bcc, subject, html, attachments);
        console.log("Email sent successfully.");
      } else {
        console.log("Email sending canceled.");
      }
      rl.close();
    }
  );

}


main().catch(err => console.error(err))
