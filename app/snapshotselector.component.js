import {h, Component} from "./preact.mjs";
import htm from  "./htm.mjs";
const html = htm.bind(h);

import {fetchSnapshots} from "./apiService.js";

export class SnapshotselectorComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      snapshots: null,

      base: null,
      head: null,
    };
  }

  componentDidMount() {
    if (this.props.site) {
      fetchData();
    }
  }

  componentDidUpdate(previousProps) {
    if (previousProps.site !== this.props.site) {
      this.fetchData();
    }
  }

  fetchData() {
    if (!this.props.site) return;
    setTimeout(() => fetchSnapshots(this.props.site)
        .then(snaps => {
          for (let snapshot of snaps) {
            if (!snapshot.description.match(/^[a-z0-9-:,.! ]*$/i)) {
              throw Error(snapshot.description + ' is not permitted! Is this XSS?');
            }
            if (!snapshot.commit_id.match(/^[a-z0-9]*$/i)) {
              throw Error(snapshot.commit_id + ' is not permitted! Is this XSS?');
            }
          }
          this.setState({
            error: null,
            isLoaded: true,
            snapshots: snaps,
          });
        }, err => {
          this.setState({
            error: err,
            isLoaded: false,
            snapshots: null,
          })
        }), 700);
  }

  baseSelected(ev) {
    this.props.onBaseChange(ev.currentTarget.value);
  }

  headSelected(ev) {
    this.props.onHeadChange(ev.currentTarget.value);
  }

  render() {
    const {error, isLoaded, snapshots} = this.state;
    if (error) {
      return html`<div id="lastModifiedTimesList">Error: ${error.message}`;
    }
    if (!isLoaded) {
      return html`<div id="lastModifiedTimesList">Loading...</div>`;
    }
    return html`<ul id="lastModifiedTimesList">
      ${snapshots.map(((snap, index) => html`<li key=${snap.commit_id}>
        <input type="radio" name="base" value=${snap.commit_id}
            checked=${this.props.base === snap.commit_id}
            onChange=${this.baseSelected.bind(this)}/>
        <input type="radio" name="head" value=${snap.commit_id}
               checked=${this.props.head === snap.commit_id}
               onChange=${this.headSelected.bind(this)}/>
        <span><strong>${snap.description}:</strong> ${snap.commit_id}</span>
      </li>`).bind(this))}
    </ul>`;
  }

}

export default SnapshotselectorComponent;