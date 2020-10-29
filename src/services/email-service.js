let config = require('../config');
let sendGrid = require('sendgrid')(config.sendGridKey);


exports.send = async (to, subject, body) => {
    sendGrid.send({
        to: to,
        from: 'f.s1488@outlook.com',
        subject: subject,
        html: body
    });
}