class MailSender {

    transporter;

    from;

    constructor(){
        require("dotenv").config()
        const nodemailer = require('nodemailer')
        this.transporter = nodemailer.createTransport({
            service: process.env.NODE_MAILER_SERVICE,
            auth: {
                user: process.env.NODE_MAILER_USER,
                pass: process.env.NODE_MAILER_PASSWORD
            }
        })
        this.from = process.env.NODE_MAILER_USER
    }

    sendMail(to, subject, text) {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: this.from,
                to: to,
                subject: subject,
                text: text
            };
    
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(info.response)
                }
            })
        })
    }
}

var Singleton = (function () {
    var instance;

    function createInstance() {
        var object = new MailSender();

        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }

            return instance;
        }
    };
})();

function sendMail(to, subject, text) {
    return Singleton.getInstance().sendMail(to, subject, text)
}

module.exports = sendMail


