const timer = require('timers');
const fetch = require('node-fetch');

module.exports = function(db) {
  async function timerCallback() {
    let prevRes = db.get('responses').last().value()
    let reqConf = { headers: {} }

    console.log(prevRes)
    if (prevRes && prevRes.lastModTime) {
      reqConf.headers['If-Modified-Since'] = prevRes.lastModTime;
    }

    console.log(reqConf);
    res = await fetch('https://hackmit.org', reqConf);
    let lastModTime = res.headers.get('last-modified');

    if (res.status === 304) {
      // db.get('responses')
      //   .push({
      //     status: 304,
      //     lastModTime: lastModTime,
      //   })
      //   .write();
    }
    else if ((!prevRes) || prevRes.lastModTime !== lastModTime  || prevRes.status !== res.status){
      db.get('responses')
        .push({
          status: res.status,
          lastModTime: lastModTime,
        })
        .write()
      console.log('saved')
    }
  }

  timer.setInterval(timerCallback,
    (   5    /* mins */
      * 60   /* secs */
      * 1000 /* millis */));

  try {
    timerCallback();
  } catch (err) {
    console.error(err);
  }
}
