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
    if (!snapshot.description.match(/^[a-z0-9-:,.! ]*$/i)) {
      throw Error(snapshot.description + ' is not permitted! Is this XSS?');
    }
    if (!snapshot.commit_id.match(/^[a-z0-9]*$/i)) {
      throw Error(snapshot.commit_id + ' is not permitted! Is this XSS?');
    }
  }

  for (let snapshot of snaps) {
    let li = document.createElement("li");
    li.setAttribute('commit_id', snapshot.commit_id);

    let baseRadio = document.createElement("input");
    baseRadio.setAttribute('type', 'radio');
    baseRadio.setAttribute('name', 'base');
    baseRadio.onclick = () => {
      base = snapshot.commit_id;
      location.hash = `#!/${base||''}/${head||''}`;
      maybeDiff();
    }
    baseRadio.setAttribute('commit_id', snapshot.commit_id);
    li.appendChild(baseRadio);

    let headRadio = document.createElement("input");
    headRadio.setAttribute('type', 'radio');
    headRadio.setAttribute('name', 'head');
    headRadio.onclick = () => {
      head = snapshot.commit_id;
      location.hash = `#!/${base||''}/${head||''}`;
      maybeDiff();
    }
    headRadio.setAttribute('commit_id', snapshot.commit_id);
    li.appendChild(headRadio);

    let span = document.createElement('span');
    span.innerHTML =
      `<strong>${snapshot.description}:</strong> ${snapshot.commit_id}`;
    li.appendChild(span);

    timesListTag.appendChild(li);
  }

  let somethingIsSet = false;

  if (location.hash && location.hash.length > 30) {
    try {
      let [base, head] = location.hash.substr(3).split('/');
      let regex = /^[a-fA-F0-9]+$/;
      if (regex.test(base) && regex.test(head)) {
        let baseRadio = document.querySelector(`input[type=radio][name=base][commit_id="${base}"]`);
        let headRadio = document.querySelector(`input[type=radio][name=head][commit_id="${head}"]`);
        baseRadio.value = true;
        baseRadio.checked = true;
        baseRadio.onclick();
        headRadio.value = true;
        headRadio.checked = true;
        headRadio.onclick();
        somethingIsSet = true;
      }
    }
    catch (ignored) {}
  }
  if (!somethingIsSet && snaps.length >= 2) {
    let base = snaps[1].commit_id;
    let head = snaps[0].commit_id;
    let regex = /^[a-fA-F0-9]+$/;
    if (regex.test(base) && regex.test(head)) {
      let baseRadio = document.querySelector(`input[type=radio][name=base][commit_id="${base}"]`);
      let headRadio = document.querySelector(`input[type=radio][name=head][commit_id="${head}"]`);
      baseRadio.value = true;
      baseRadio.checked = true;
      baseRadio.onclick();
      headRadio.value = true;
      headRadio.checked = true;
      headRadio.onclick();
    }
  }
});
