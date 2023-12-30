const bcrypt = require('bcryptjs');
const pass = 'Test@1234'

//$2a$10$OLAZgYXxyC1Zw7gzuHYKseQtZzBkYLK2ocqF.qBts/AQJktfPm4x6

console.log('hash: ', bcrypt.hashSync(pass));

console.log('confirm: ', bcrypt.compareSync(pass, '$2a$10$OLAZgYXxyC1Zw7gzuHYKseQtZzBkYLK2ocqF.qBts/AQJktfPm4x6'));

