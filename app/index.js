console.log(`
███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

`);

import Snapshot from './model.js';

async function fetchLastModifiedTimes() {
  let res = await fetch('/api/responses');
  return res.json();
}

let timesListTag = document.getElementById('lastModifiedTimesList');
let diffResult = document.getElementById('diffResult');
// diffResult.textContent = 'memes memes memes\n   oh what wonderful memes'

let snapshots = undefined;

Snapshot.fetchSnapshots()
.then(snaps => {
  snapshots = snaps;
  let base = undefined, head = undefined;
  function maybeDiff() {
    if (base && head) {
      Snapshot.fetchDiff(base, head)
      .then(diff => {
        diffResult.textContent = diff;
      })
    }
  }

  while (timesListTag.firstChild) {
      timesListTag.firstChild.remove();
  }
  for (let snapshot of snaps) {
    let li = document.createElement("li");

    let baseRadio = document.createElement("input");
    baseRadio.setAttribute('type', 'radio');
    baseRadio.setAttribute('name', 'base');
    baseRadio.onclick = () => {
      base = snapshot.commit_id;
      maybeDiff();
    }
    li.appendChild(baseRadio);

    let headRadio = document.createElement("input");
    headRadio.setAttribute('type', 'radio');
    headRadio.setAttribute('name', 'head');
    headRadio.onclick = () => {
      head = snapshot.commit_id;
      maybeDiff();
    }
    li.appendChild(headRadio);

    let span = document.createElement('span');
    span.innerHTML =
      `<strong>${snapshot.description}:</strong> ${snapshot.commit_id}`;
    li.appendChild(span);

    timesListTag.appendChild(li);
  }

});
