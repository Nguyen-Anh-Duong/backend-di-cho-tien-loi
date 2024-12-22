const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccount.json'); // Đường dẫn đến tệp JSON
admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),}
);
module.exports = admin; 