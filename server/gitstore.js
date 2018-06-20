// ███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
// ██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
// ███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
// ╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
// ███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
// ╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports.init = function() {
  try {
    fs.mkdirSync('./gitstore');
  } catch (ignored) {
    // assuming that just means dir already exists
  }

  exec('git init', {cwd: './gitstore'});
}

module.exports.snapshots = async function() {
  try {
    const {stdout, stderr} = await exec('git log', {cwd: './gitstore'});

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

module.exports.makeSnapshot = async function() {
  try {
  const {stdout, stderr} =
    await exec('sh download_snapshot.sh', {cwd: './gitstore'});
  } catch (ignored) {
    // probable just git whining about there not being a change
  }
}

module.exports.diff = async function(base, head) {
  try {
    const {stdout, stderr} =
      await exec(`git diff ${base} ${head}`, {cwd: './gitstore'});
    return stdout;
  } catch (e) {
    return "An error occurred: " + e;
  }
}
