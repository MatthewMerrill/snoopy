console.log(`
███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

`);

import Snapshot from './model.js';

async function fetchSites() {
  let res = await fetch('/api/sites');
  return res.json();
}

async function fetchLastModifiedTimes() {
  let res = await fetch('/api/responses');
  return res.json();
}

let timesListTag = document.getElementById('lastModifiedTimesList');
let diffResult = document.getElementById('diffResult');
// diffResult.textContent = 'memes memes memes\n   oh what wonderful memes'

let site = undefined;
let validSites = undefined;

fetchSites()
  .then(sites => {
    validSites = sites;
    let siteSelect = document.getElementById('siteSelect');
    siteSelect.selectedIndex = 0;
    siteSelect.onchange = () => setSite(siteSelect.value);
    let [hashsite] = location.hash.substr(3).split('/');
    for (let site of sites) {
      let option = document.createElement("option");
      option.setAttribute('value', site);
      option.innerText = site;
      siteSelect.appendChild(option);
      if (hashsite === site) {
        siteSelect.value = site;
        siteSelect.onchange();
      }
    }
    if (siteSelect.selectedIndex < 1) {
      location.hash = '';
    }
  });

function setSite(site) {
  let snapshots = undefined;
  Snapshot.fetchSnapshots(site)
    .then(snaps => {
      snapshots = snaps;
      let base = undefined, head = undefined;
      function maybeDiff() {
        if (base && head) {
          Snapshot.fetchDiff(site, base, head)
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

      let elems = {};
      for (let snapshotIdx = 0; snapshotIdx < snaps.length; snapshotIdx++) {
        let snapshot = snaps[snapshotIdx];
        let li = document.createElement("li");
        li.setAttribute('commit_id', snapshot.commit_id);

        let baseRadio = document.createElement("input");
        baseRadio.setAttribute('type', 'radio');
        baseRadio.setAttribute('name', 'base');
        baseRadio.onclick = ev => {
          if (ev) {
            base = snapshot.commit_id;
            try { head = elems[head].commit_id; } catch {}
          }
          location.hash = `#!/${site}/${base||''}/${head||''}`;
          maybeDiff();
        }
        baseRadio.setAttribute('commit_id', snapshot.commit_id);
        li.appendChild(baseRadio);

        let headRadio = document.createElement("input");
        headRadio.setAttribute('type', 'radio');
        headRadio.setAttribute('name', 'head');
        headRadio.onclick = ev => {
          if (ev) {
            try { base = elems[base].commit_id; } catch {}
            head = snapshot.commit_id;
          }
          location.hash = `#!/${site}/${base||''}/${head||''}`;
          maybeDiff();
        }
        headRadio.setAttribute('commit_id', snapshot.commit_id);
        li.appendChild(headRadio);

        let span = document.createElement('span');
        span.innerHTML =
          `<strong>${snapshot.description}:</strong> ${snapshot.commit_id}`;
        li.appendChild(span);

        timesListTag.appendChild(li);

        let listing = {commit_id: snapshot.commit_id, li, baseRadio, headRadio, span};
        elems[snapshot.commit_id] = listing;
        elems[`HEAD~${snapshotIdx}`] = listing;
      }
      if (snaps.length) {
        elems['HEAD'] = elems['HEAD~0'];
      }

      let somethingIsSet = false;
      let regex = /^([a-fA-F0-9]+|HEAD(~[0-9]+)?)$/;

      if (location.hash && location.hash.length > 30) {
        try {
          let [hashsite, hashbase, hashhead] = location.hash.substr(3).split('/');
          if (site === hashsite
              && regex.test(hashbase)
              && regex.test(hashhead)) {
            let baseRadio = elems[hashbase].baseRadio;
            let headRadio = elems[hashhead].headRadio;
            base = hashbase;
            head = hashhead;
            baseRadio.value = true;
            baseRadio.checked = true;
            baseRadio.onclick();
            headRadio.value = true;
            headRadio.checked = true;
            headRadio.onclick();
            somethingIsSet = true;
          }
          else {
            location.hash = '';
          }
        }
        catch (ignored) {}
      }
      if (!somethingIsSet && snaps.length >= 2) {
        base = 'HEAD~1';
        head = 'HEAD';
        if (regex.test(base) && regex.test(head)) {
          let baseRadio = elems[base].baseRadio;
          let headRadio = elems[head].headRadio;
          baseRadio.value = true;
          baseRadio.checked = true;
          baseRadio.onclick();
          headRadio.value = true;
          headRadio.checked = true;
          headRadio.onclick();
        }
        base = 'HEAD~1';
        head = 'HEAD';
      }
    });
}
