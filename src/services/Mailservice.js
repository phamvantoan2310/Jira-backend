const nodemailer = require("nodemailer");

const SendEmail = async ({mailTo, taskId}) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for port 465, false for other ports
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASS,
        },
    });

    const info = await transporter.sendMail({
        from: `${process.env.MAIL}`, // sender address
        to: mailTo, // list of receivers
        subject: "Notify that the task has changed", // Subject line
        text: `Task ${taskId} has changed`, // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}



module.exports = {
    SendEmail,
}