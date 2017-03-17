const shell = require("shelljs");
const record = require("./record");

function checkCommand(res) {
    return res ? true : console.log(["Already Latest! Version: ", record.readVersion()].join(''));
}
function doCommand(res, password) {
    const fileName = [record.rootLocation, '/hosts'].join('');
    const credit = ["echo", password, "|"].join(' ');
    const unzip = [
        'unzip -o -P',
        res,
        record.hostsLocation
    ].join(' ');
    const backup = [
        credit,
        "sudo -S cp /etc/hosts",
        "/etc/hosts_backup"
    ].join(' ');
    const move = [
        credit,
        "sudo -S cp",
        fileName,
        "/etc/hosts"
    ].join(' ');
    const reset = [
        credit,
        "sudo -S",
        "sudo killall -HUP mDNSResponder"
    ].join(' ');

    [unzip, backup, move, reset].forEach(
        (item) => shell.exec(item)
    );
}

function move(res, password) {
    checkCommand(res) ? doCommand(res, password) : null;
}

module.exports = move;