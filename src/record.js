const fs = require('fs');

const rootLocation = [__dirname, '/..'].join('');
const versionLocation = [rootLocation, '/version'].join('');
const hostsLocation = [rootLocation, '/hosts.zip'].join('');

function readVersion() {
    return fs.readFileSync(versionLocation, {flag: 'a+', encoding: 'utf8'});
}

function writeVersion(version) {
    fs.writeFileSync(versionLocation, version);
}

function writeHosts() {
    return fs.createWriteStream(hostsLocation);
}

module.exports = {
    readVersion,
    writeVersion,
    writeHosts,
    hostsLocation,
    rootLocation
}
