const { Router } = require("express");
const nodemailer = require("nodemailer");
const router = Router();

/* POST de contacto */
router.post("/contac-us", (req, res) => {
  const { name, email, phone, message } = req.body;
  console.log(req.body);

  contentHTML = `
        <h1>User Information</h1>
        <ul>
            <li>Nombre de usuario: ${name}</li>
            <li>Email de usuario: ${email}</li>
            <li>Telefono: ${phone}</li>
        </ul>
        <p>${message}</p>
    `;
  console.log(contentHTML);
  // Create a SMTP transporter object
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "leopold.zemlak@ethereal.email",
      pass: "dhptErun6taQx5uCXy",
    },
    //Name: Leopold Zemlak
  });

  // Message object
  let mail = {
    from: `"Covid Track" ${name}`,
    to: `'Recipient' <clientes@covidtrack.pe>`,
    subject: "Formulario de contacto ✔",
    html: contentHTML,
  };

  transporter.sendMail(mail, (err, info) => {
    if (err) {
      console.log("Error occurred. " + err.mail);
      return process.exit(1);
    }

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });

  res.render("feedback");
});

module.exports = router;
