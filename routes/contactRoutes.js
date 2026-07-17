const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

const contactEmail = emailUser && emailPass
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    })
  : null;

if (contactEmail) {
  contactEmail.verify((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Ready to Send");
    }
  });
} else {
  console.log("Email transport is disabled because EMAIL_USER or EMAIL_PASS is missing.");
}

router.post("/", (req, res) => {
  if (!contactEmail) {
    return res.status(503).json({
      message: "Contact email service is not configured.",
    });
  }

  const name = req.body.firstName + req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  const mail = {
    from: name,
    to: emailUser,
    subject: "Contact Form Submission - Portfolio",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`,
  };

  contactEmail.sendMail(mail, (error) => {
    if (error) {
      return res.json(error);
    }

    return res.json({ code: 200, status: "Message Sent" });
  });
});

module.exports = router;
