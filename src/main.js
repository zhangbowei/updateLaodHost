const socket = require('./socket');

function post(url) {
  const res = new Promise((fulfill, reject) => {
    socket.getMainPage(url)
      .then(socket.getHostsPage)
      .then(socket.getResourcePage)
      .then(socket.getRefreshPage)
      .then(socket.getZipfile)
      .then(data => {
        fulfill(data);
      })
      .catch(err => {
        reject("failure");
      });
  });

  return res;
}

module.exports = post;