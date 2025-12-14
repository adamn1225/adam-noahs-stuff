import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email to admin (you)
    const adminMailOptions = {
      from: process.env.FROM_EMAIL,
      to: process.env.SMTP_USER, // Send to yourself
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h3 style="color: #333;">Message:</h3>
            <p style="color: #666; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px;">
            This email was sent from your portfolio contact form.
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    };

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `Thanks for reaching out, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thanks for contacting us!</h2>
          <p style="color: #666; line-height: 1.6;">
            Hi ${name},
          </p>
          <p style="color: #666; line-height: 1.6;">
            We've received your message and will get back to you as soon as possible.
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333;">Your message:</h3>
            <p style="color: #666;"><strong>Subject:</strong> ${subject}</p>
            <p style="color: #666; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #666; line-height: 1.6;">
            Best regards,<br>
            Adam & Noah
          </p>
        </div>
      `,
      text: `
Hi ${name},

Thanks for reaching out! We've received your message and will get back to you as soon as possible.

Your message:
Subject: ${subject}
${message}

Best regards,
Adam & Noah
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
