// ███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
// ██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
// ███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
// ╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
// ███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
// ╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

const timer = require('timers');
const fetch = require('node-fetch');
const gitstore = require('./gitstore.js');
const wuphf = require('./wuphf.js');

const { urlBase } = require('../config.js'); 

module.exports = function(site, interval) {
  function timerCallback() {
    console.log(`[${site}] Attempting a snapshot at`, new Date());
    gitstore.makeSnapshot(site)
      .then(commitMade => {
        if (commitMade) {
          console.log(`[${site}]    ...changes made!`);
          wuphf(`WUPHF! Site change detected for ${site}.`
              + `\n\n${urlBase}/#!/${site}/HEAD~1/HEAD`);
        } else {
          console.log(`[${site}]    ...nothing to do.`);
        }
      });
  }

  let ivalId = timer.setInterval(timerCallback,
    ((interval || 27) /* mins */
      * 60            /* secs */
      * 1000          /* millis */));

  try {
    timerCallback();
    return ivalId;
  } catch (err) {
    clearInterval(ivalId);
    console.error(err);
  }
}
