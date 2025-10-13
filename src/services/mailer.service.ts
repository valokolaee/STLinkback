import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'valokolaee@gmail.com',
        pass: ' ',

    }
});

let mailOptions = {
    from: 'valokolaee@gmail.com',
    to: 'valokolaee@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

export default ()=> transporter.sendMail(mailOptions, function (error:any, info:any) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});