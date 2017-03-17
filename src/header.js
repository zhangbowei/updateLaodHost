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
        let dom;

        dom = $('.scbutton.green').slice(-1).eq(0)
        infor.version = dom.text().match(/\s(\d+?)-/)[1];
        infor.address = dom.attr('href');
        infor.password = dom[0].next.data.match(/(\w+)$/)[1];
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
    const host = s.match(/href="(.*?)".*?Google hosts/)[1];
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