export const mailTemplate =  {
  passwordReset: (resetUrl: string): string  =>  `<p>You requested a password reset.</p>
    <p>Click the link below to reset your password:</p>
    <p>
      <a href="${resetUrl}" target="_blank" style="
        display: inline-block;
        background-color: #007bff;
        color: #ffffff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      ">
        Reset Password
      </a>
    </p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <hr />
    <p style="font-size: 12px; color: #666;">
      Or copy and paste this link into your browser:<br />
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    </p>`,

  welcome: (username: string): string => `<h1>Welcome to Creationary!</h1>
    <p>Hi ${username},</p>
    <p>Thank you for signing up for Creationary. We're excited to have you on board!</p>
    <p>Feel free to explore and let us know if you have any questions.</p>
    <p>Best regards,<br/>The Creationary Team</p>`,
}