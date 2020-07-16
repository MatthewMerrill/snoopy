// ███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
// ██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
// ███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
// ╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
// ███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
// ╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

export default class Snapshot {
  constructor(commit_id, description) {
    this.commit_id = commit_id;
    this.description = description;
  }

  static async fetchSnapshots(site) {
    try {
      let snapshots = await (await fetch(`/api/snapshots/${site}`)).json();
      return snapshots.map(s => new Snapshot(s.commit_id, s.description));
    } catch (e) {
      console.error('Error fetching snapshots', e);
    }
  }

  static async fetchDiff(site, base, head) {
    try {
      return await (await fetch(`/api/diff/${site}/${base}/${head}`)).text()
    } catch (e) {
      console.error('Error fetching diff', e);
    }
  }
}
