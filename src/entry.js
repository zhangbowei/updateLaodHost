const post = require('./main');
const move = require('./move');
const argv = require('yargs').argv;

const url = argv.url ? argv.url : 'https://laod.cn';
const password = argv.password ? argv.password : process.env.SUDO_PASSWORD;

module.exports = function() {
    post(url).then(function (res) {
        move(res, password);
    }).catch(err => {
        console.log(err);
    });
}
