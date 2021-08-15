import {h, Component} from "./preact.mjs";
import htm from  "./htm.mjs";
const html = htm.bind(h);

import {fetchDiff} from "./apiService.js";

export class DiffView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            value: null,
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(previousProps) {
        if (previousProps.site !== this.props.site
          || previousProps.base !== this.props.base
          || previousProps.head !== this.props.head) {
            if (this.props.site && this.props.base && this.props.head) {
                this.fetchData();
            }
        }
    }

    fetchData() {
        this.setState({
            error: null,
            isLoaded: false,
            value: null,
        })
        setTimeout(() =>
        fetchDiff(this.props.site, this.props.base, this.props.head)
            .then((diff) => {
                this.setState({
                    error: null,
                    isLoaded: true,
                    value: diff,
                })
            }, err => {
                this.setState({
                    error: err,
                    isLoaded: false,
                    value: null,
                })
            }), 1000)
    }

    render() {
        if (this.state.error) {
            console.error(this.state.error);
            return html`<pre id="diffResult">Error: ${this.state.error}</pre>`;
        }
        if (this.props.site && this.props.base && this.props.head && !this.state.isLoaded) {
            return html`<pre id="diffResult">Loading...</pre>`;
        }
        if (!this.state.isLoaded) {
            return html`<pre id="diffResult">Please select base and head.</pre>`
        }
        return html`
            <pre id="diffResult">
                ${this.state.value}
            </pre>`;
    }
}

export default DiffView;