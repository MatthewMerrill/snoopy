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

const { urlBase, interval } = require('../config.js'); 
const c = require('ansi-colors');
const process = require('process');

module.exports = function(site) {
  async function timerCallback() {
    console.log(`[${site}] Attempting a snapshot at`, new Date());
    if (await gitstore.makeSnapshot(site)) {
      console.log(`[${site}]`.padEnd(24), c.green('...changes made!'));
      let snapshots = await gitstore.snapshots(site);
      if (snapshots.length >= 2) {
        wuphf(`WUPHF! Site change detected for ${site}.`
            + `\n\n${urlBase}/#!/${site}/${snapshots[1].commit_id}/${snapshots[0].commit_id}`,
            site);
      } else {
        wuphf(`WUPHF! Site change detected for ${site}.`
            + `\n\n${urlBase}/#!/${site}`,
            site);
      }
    } else {
      console.log(`[${site}]`.padEnd(24), c.red('...nothing to do.'));
    }
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
