class MailSender {

    mailSender

    from

    constructor(){
        this.mailSender = require('sendmail')();
        this.from = "no-reply@femploy.com"
    }

    sendMail(to, subject, text) {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: this.from,
                to: to,
                subject: subject,
                html: text
            };
    
            this.mailSender(mailOptions, (error, info) => {
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


