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

  static async fetchSnapshots() {
    try {
      let snapshots = await (await fetch('/api/snapshots/hackmit.org')).json();
      return snapshots.map(s => new Snapshot(s.commit_id, s.description));
    } catch (e) {
      console.error('Error fetching snapshots', e);
    }
  }

  static async fetchDiff(base, head) {
    try {
      return await (await fetch(`/api/diff/hackmit.org/${base}/${head}`)).text()
    } catch (e) {
      console.error('Error fetching diff', e);
    }
  }
}
