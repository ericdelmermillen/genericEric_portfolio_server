import nodemailer from "nodemailer";

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const subject = "Contact form submission from genericeric.dev"


// POST /api/contact/
const sendContactForm = async (req, res) => {
  const { 
    name, 
    email, 
    message
  } = req.body;

  const config = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: PASSWORD
    }
  };
  
  const transporter = nodemailer.createTransport(config)

  const submittedMessage = `
  <p>New Contact form submission:</p>
  <p>From: ${name}</p>
  <p>Email: ${email}</p>
  <p>Subject: ${subject}</p>
  <p>Message:</p>
  <p>${message}</p>
`;

const emailMessage = {
  from: email,
  to: EMAIL,
  subject: `${subject}`,
  text: "New Contact form submission",
  html: submittedMessage
};


  try {
    // response sent before request to transporter due to very long wait for confirmation
    res.status(201).json({
      message: "Thanks! Your message to Eric has been sent!"})
      
    return await transporter.sendMail(emailMessage);
  } catch(error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: "Failed to send email." });
  };
};

export {
  sendContactForm
};