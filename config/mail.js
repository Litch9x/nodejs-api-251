module.exports = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_HOST,
    secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
  
};
