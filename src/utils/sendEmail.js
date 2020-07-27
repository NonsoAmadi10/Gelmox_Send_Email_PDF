import sendGrid from '@sendgrid/mail';

import dotenv from "dotenv"

dotenv.config()

/* eslint-disable max-len */
/**
 * @description contains utility function to send emails
 */
class SendEmail {

  /**
   * This function sends an email to reset password
   * @param {string} email - email address to send the message to
   * @returns {boolean} specifies if a verification email was sent to user
   * after registration
  */


  static sendOrderEmail(html, pdf, email = "stellandudim@gmail.com") {
    const details = {
      email,
      subject: 'Gelmox Group - Order Received',
      html,
      attachments: pdf

    };

    return SendEmail.emailSender(details)
  }

  /**
   *
   * @param {object} details - Object containing info for sending email
   * @returns {boolean} sends email to users
   */
  static async emailSender(details) {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      from: process.env.mail_master,
      html: details.html,
      subject: details.subject,
      to: details.email,
      attachments: [{
        content: details.attachments,
        filename: `Order`,
        type: 'application/pdf',
        disposition: "attachment"
      }
      ]
    };
    try {
      const isEmailSent = await sendGrid.send(msg);
      if (isEmailSent) {
        return true;
      }
    } catch (error) {
      return false;
    }
  }
}


export default SendEmail;