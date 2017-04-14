const cheerio = require('cheerio')

const card = (function () {
    let cookie = '';
    return {
        getCookie: function () {
            return cookie;
        },
        setCookie: function (data) {
            cookie = data;
        }
    };
})();

const link = (function () {
    let address = '';
    return {
        getAddress: function () {
            return address;
        },
        setAddress: function (url) {
            address = url;
        }
    }
})();

const data = (function () {
    let infor = {};
    function setInfor(s) {
        const $ = cheerio.load(s);
        const dom = $('span[style="color: #ff0000; background-color: #ffff00;"]').parent();
        const code = dom.html();
        const res = unescape(code.replace(/&#x/g, '%u').replace(/;/g, ''))
        // infor.version = dom.text().match(/\s(\d+?)-/)[1];
        // infor.address = dom.attr('href');
        // infor.password = dom[0].next.data.match(/：(\S+)$/)[1];

        infor.address = res.match(/(http\S+)/)[1];
        infor.version = res.match(/\s(\d+)/)[1];
        infor.password = res.match(/：(\S+)/)[1];
    }
    function getInfor() {
        return infor;
    }

    return {
        setInfor,
        getInfor
    };
})();

function parseHost(s) {
    const host = s.match(/a href="([^<]*?)"[^<]*?Google hosts/)[1];
    return host;
}

const header = {
    getCookie: card.getCookie,
    setCookie: card.setCookie,
    getAddress: link.getAddress,
    setAddress: link.setAddress,
    setInfor: data.setInfor,
    getInfor: data.getInfor,
    parseHost: parseHost
};

module.exports = header;