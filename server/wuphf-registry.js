// ███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
// ██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
// ███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
// ╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
// ███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
// ╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

const { sites } = require('../config.js') || {}; 

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

let registry = db.defaults({ registry: [], })
  .get('registry');

registry.write();

function isValidSite(site) {
  return site === '*' || sites.indexOf(site) > -1;
}
module.exports.isValidSite = isValidSite;

function assertValidSite(site) {
  if (!isValidSite(site)) {
    throw new Error('Invalid Site');
  }
}

module.exports.enable = function(medium, target, site) {
  assertValidSite(site);
  if (site === '*') {
    registry.remove({ medium, target }).write();
  }
  else {
    registry.remove({ medium, target, site: '*' }).write();
  }
  registry.push({ medium, target, site }).write();
  console.log(`[registry:${medium}] Enabled ${target} for site ${site}`);
}

module.exports.disable = function(medium, target, site) {
  assertValidSite(site);
  if (site === '*') {
    registry.remove({ medium, target }).write();
  }
  else {
    registry.remove({ medium, target, site }).write();
  }
  console.log(`[registry:${medium}] Disabled ${target} for site ${site}`);
}

module.exports.poll = function(site) {
  if (site === '*') {
    return registry.value()
  }
  return registry.filter({ site }).value()
    .concat(registry.filter({ site: '*' }).value());
}

module.exports.registry = registry;
