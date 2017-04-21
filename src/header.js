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
        const title = $('#button_file > .buttons').html();
        const text = $('span[style="color: #3366ff;"]').text();

        infor.address = title.match(/"(http\S+)"/)[1];
        infor.version = infor.address.match(/\/(\d+)\/$/)[1];
        infor.password = text.match(/密码：(\S+)/)[1];
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