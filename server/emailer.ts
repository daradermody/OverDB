import * as nodemailer from 'nodemailer';
import * as fs from 'fs';

class AuthInfo {
  user: string;
  pass: string;

  constructor(username, password) {
    this.user = username;
    this.pass = password;
  }
}

export class Emailer {
  private static authInfo = Emailer.getAuthInformation();

  private static transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secure: false,
    port: 587,
    auth: Emailer.authInfo
  });

  static sendMail(destinationEmail: string, html: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let mailOptions = {
        from: 'OverDB',
        to: destinationEmail,
        subject: 'Project Updates',
        html: html
      };

      Emailer.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info.messageId);
        }
      });
    });
  }

  private static getAuthInformation(): AuthInfo {
    const emailAuthFile = 'server/emailing/email_auth.json';

    if (!fs.existsSync(emailAuthFile)) {
      const authInfo = new AuthInfo('daradermody@outlook.com', '[password]');
      fs.writeFileSync(emailAuthFile, JSON.stringify(authInfo, null, 2));
    }

    const authInformation = <AuthInfo>JSON.parse(<string>fs.readFileSync(emailAuthFile, 'utf8'));

    if (authInformation.pass === '[password]') {
      throw new Error(`Update the password here: ${emailAuthFile}`);
    }

    return authInformation;
  }
}
