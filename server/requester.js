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

module.exports = function() {
  function timerCallback() {
    console.log("Attempting a snapshot at", new Date());
    gitstore.makeSnapshot()
      .then(commitMade => {
        if (commitMade) {
          console.log('    ...changes made!');
          wuphf();
        } else {
          console.log('    ...nothing to do.');
        }
      });
  }

  timer.setInterval(timerCallback,
    (   27    /* mins */
      * 60   /* secs */
      * 1000 /* millis */));

  try {
    timerCallback();
  } catch (err) {
    console.error(err);
  }
}
