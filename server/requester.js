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

module.exports = function(site, interval) {
  function timerCallback() {
    console.log(`[${site}] Attempting a snapshot at`, new Date());
    gitstore.makeSnapshot(site)
      .then(commitMade => {
        if (commitMade) {
          console.log(`[${site}]    ...changes made!`);
          wuphf(`WUPH! Site change detected for ${site}.`);
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
