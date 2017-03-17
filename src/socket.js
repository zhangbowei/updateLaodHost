const request = require('superagent');
const record = require('./record');
const header = require('./header');

const base_headers = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, sdch, br',
    'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    DNT: 1,
    'upgrade-insecure-requests': 1,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
};

function makeReqTemplate() {
    return new Promise((fulfill, reject) => {
        request
            .get(header.getAddress())
            .set(base_headers)
            .set('Cookie', header.getCookie())
            .end((err, res) => {
                if (err) reject(err)
                else fulfill(res)
            });
    });
}

function getMainPage(conf) {
    header.setAddress(conf);
    return makeReqTemplate();
}

function getHostsPage(res) {
    header.setCookie(res.headers['set-cookie'] ? res.headers['set-cookie'].join('') : '');
    header.setAddress(header.parseHost(res.text));

    return makeReqTemplate();
}

function getResourcePage(res) {
    header.setInfor(res.text);
    header.setAddress(header.getInfor().address);

    if (record.readVersion() === header.getInfor().version) {
        return null;
    } else {
        record.writeVersion(header.getInfor().version);
        return makeReqTemplate();
    }
}

function getRefreshPage(res) {
    header.setAddress(res.text.match(/url='(.*?)'/)[1]);

    return makeReqTemplate();
}

function getZipfile(res) {
    const fileName = res.text.match(/href="(.*?\.zip).*苹果/)[1];
    const address = [header.getAddress(), fileName].join('');

    return new Promise((fulfill, reject) => {
        let stream = record.writeHosts();
        let download = request
            .get(address)
            .set(base_headers)
            .set('Host', 'iiio.io')
            .set('Referer', header.getAddress())
            .pipe(stream);
        download.on('close', () => fulfill(header.getInfor().password));
        download.on('error', () => reject(null));
    });
}

const socket = (function () {
    const fnSet = [
        getMainPage,
        getHostsPage,
        getResourcePage,
        getRefreshPage,
        getZipfile
    ];

    const wrapCheckRes = fnSet.reduce(function (prev, item) {
        prev[item.name] = function (res) {
            return res ? item.call(null, res) : res;
        };
        return prev;
    }, {});

    return wrapCheckRes;
})();

module.exports = socket;


