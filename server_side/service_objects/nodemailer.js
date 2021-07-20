const nodemailer = require("nodemailer");

const sendEmail = async (subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SERVICE,
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: 'medcentre.melbourne@gmail.com',
            to: 'medcentre.melbourne@gmail.com',
            subject: subject,
            html: html,
        });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};

module.exports = sendEmail;