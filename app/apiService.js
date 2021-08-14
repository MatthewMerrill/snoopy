import Snapshot from './model.js';

export async function fetchSites() {
  let res = await fetch('/api/sites');
  return res.json();
}

export async function fetchLastModifiedTimes() {
  let res = await fetch('/api/responses');
  return res.json();
}

export async function fetchDiff(site, base, head) {
  return await (await fetch(`/api/diff/${site}/${base}/${head}`)).text();
}

export async function fetchSnapshots(site) {
  let snapshots = await (await fetch(`/api/snapshots/${site}`)).json();
  return snapshots.map(s => new Snapshot(s.commit_id, s.description));
}