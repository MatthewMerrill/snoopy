console.log(`
███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

`);

import {h, Component, render} from './preact.mjs';
import htm from './htm.mjs';
const html = htm.bind(h);

import {fetchSites} from './apiService.js';
import {SnapshotselectorComponent} from "./snapshotselector.component.js";
import {DiffView} from './diffview.component.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sites: [],
      site: null,
      base: null,
      head: null,
    };
    this.setBaseHead = Object.bind(this, this.setBaseHead);
  }

  componentDidMount() {
    fetchSites().then(sites => {
      this.setState({sites});
      this.parseHash();
    });
  }

  onBaseChange(base) {
    this.setState({base});
    this.updateHash(this.state.site, base, this.state.head);
  }

  onHeadChange(head) {
    this.setState({head});
    this.updateHash(this.state.site, this.state.base, head);
  }

  onSiteChange(ev) {
    this.setState({site: ev.target.value});
    this.updateHash(site, this.state.base, this.state.head);
  }

  parseHash() {
    try {
      let [hashbang, site, base, head] = location.hash.split('/');
      console.log(hashbang, site, base, head);
      if (hashbang === '#!') {
        this.setState({site, base, head});
      }
    } catch (err) {
      this.setState({
        site: null, base: null, head: null,
      });
    }
  }

  updateHash(site, base, head) {
    if (site && base && head) {
      location.hash = `#!/${site}/${base || ''}/${head || ''}`;
    }
  }

  render() {
    let {sites, site, base, head} = this.state;
    return html`
      <div id="header">
        <!--<h1>SNOOPY</h1>-->
        <img src="snoopy.gif" id="logo" />
        <select id="siteSelect" onChange=${this.onSiteChange.bind(this)}>
          <option selected=${site === null} disabled=${true}>Select a Site</option>
          ${sites.map((availableSite, index) =>
              html`
                <option selected=${availableSite === site} key=${index} value=${availableSite}>
                  ${availableSite}
                </option>`
          )}
        </select>
      </div>
      <div id="main">
        <${SnapshotselectorComponent} site=${site} base=${base} head=${head}
                                      onBaseChange=${this.onBaseChange.bind(this)}
                                      onHeadChange=${this.onHeadChange.bind(this)}/>
          <${DiffView} site=${site} base=${base} head=${head}/>
      </div>`;
  }
}

render(html`<${App} name=""/>`, document.body)