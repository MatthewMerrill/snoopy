// ███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
// ██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
// ███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
// ╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
// ███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
// ╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports.init = function(site) {
  if (!site.match(/[a-z]/i)) {
    throw Error('Bad Site');
  }
  try {
    fs.mkdirSync(`./stores/${site}`);
  } catch (ignored) {
    // assuming that just means dir already exists
  }

  exec('git init', {cwd: `./stores/${site}`});
  
}

module.exports.snapshots = async function(site) {
  if (!site.match(/[a-z]/i)) {
    throw Error('Bad Site');
  }
  try {
    const {stdout, stderr} = await exec('git log', {cwd: `./stores/${site}`});

    let lines = stdout.split("\n");
    let snapshot = undefined;
    let snapshots = [];

    for (let line of lines) {
      if (line.startsWith('commit ')) {
        snapshot = {
          commit_id: line.substring('commit '.length)
        };
      }
      else if (snapshot && line.startsWith('    Last-Modified: ')) {
        snapshot.description = line.trim();
        snapshots.push(snapshot);
        snapshot = undefined;
      }
    }
    return snapshots;
  } catch (err) {
    console.error(err);
  }
}

module.exports.makeSnapshot = async function(site) {
  if (!site.match(/[a-z]/i)) {
    throw Error('Bad Site');
  }
  try {
  const {stdout, stderr} =
    await exec(`sh download_snapshot.sh ${site}`, {cwd: `./stores`});
    return true;
  } catch (ignored) {
    // probable just git whining about there not being a change
    // 2019-07-14: thank you past matt for commenting this
    return false;
  }
}

module.exports.diff = async function(site, base, head) {
  if (!site.match(/[a-z]/i)) {
    throw Error('Bad Site');
  }
  try {
    const {stdout, stderr} =
      await exec(`git diff ${base} ${head}`, {cwd: `./stores/${site}`});
    return stdout;
  } catch (e) {
    return "An error occurred: " + e;
  }
}
