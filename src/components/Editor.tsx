import {h, Component} from "preact";
import './Editor.css';
import AceEditor from 'react-ace';
import Clipboard from 'clipboard';
import qs from "querystate";
import {publish, fetch, generateSecret} from '../helpers/IotaHelper';

// Setup ace
import ace from "ace-builds/src-noconflict/ace";
import 'ace-builds/src-min-noconflict/theme-tomorrow'
import 'ace-builds/src-min-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';

const CDN = 'https://cdn.jsdelivr.net/npm/ace-builds@1.4.12/src-min-noconflict';
ace.config.set('basePath', CDN);
ace.config.set('modePath', CDN);
ace.config.set('themePath', CDN);
ace.config.set('workerPath', CDN);
const queryState = qs();

const languages = [
    'javascript',
    'java',
    'python',
    'xml',
    'ruby',
    'sass',
    'markdown',
    'mysql',
    'json',
    'html',
    'handlebars',
    'golang',
    'csharp',
    'elixir',
    'typescript',
    'css'
];

const themes = [
    'tomorrow',
    'monokai',
    'github',
    'kuroir',
    'twilight',
    'xcode',
    'textmate',
    'solarized_dark',
    'solarized_light',
    'terminal',
];

const defaultCode = `console.log("hello iota");`;

interface Props {
}
interface State {
    loading: boolean;
    root: string;
    address: string;
    secret: string;
    status: string;
    value: string;
    theme: string;
    mode: string;
    fontSize: number;
    tabSize: number;
}

export default class Editor extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            loading: Boolean(queryState.get('bundle')),
            root: queryState.get('root'),
            address: "",
            secret: queryState.get('secret'),
            status: 'Fetching code...',
            value: defaultCode,
            theme: 'tomorrow',
            mode: 'javascript',
            fontSize: 14,
            tabSize: 4,
        };

        this.getCode();
    }

    async getCode() {
        if (!this.state.root || !this.state.secret) {
            return;
        }

        console.log('Fetching code...');
        this.setState({
            loading: true
        })

        let payload = await fetch(this.state.root, this.state.secret);
        if (!payload) {
            this.setState({
                loading: false
            });
            return;
        }

        const {data, metaData} = payload[0];

        this.setState({
            value: data as string,
            theme: metaData.theme,
            mode: metaData.mode,
            fontSize: metaData.fontSize,
            tabSize: metaData.tabSize,
            loading: false
        });
    }

    async onSave() {
        this.setState({
            loading: true,
            status: 'Saving...'
        });

        console.log('Saving...');

        const secret = generateSecret();

        const {root, address} = await publish({
            data: this.state.value,
            metaData: {
                theme: this.state.theme,
                mode: this.state.mode,
                fontSize: this.state.fontSize,
                tabSize: this.state.tabSize
            }
        }, secret);

        queryState.set('root', root);
        queryState.set('secret', secret);
        this.setState({
            root: root,
            address: address,
            secret: secret,
            loading: false
        });
    }

    getEditor() {
        if (this.state.loading) {
            return (
                <div className="loading-container">
                    <div className="loading-aligner">
                        <ul>
                            <li>
                                <h3 className="status-text">{this.state.status}</h3>
                            </li>
                            <li>
                                <svg style="margin:auto;background:transparent;display:block;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                                    <circle cx="84" cy="50" r="10" fill="#ec324c">
                                        <animate attributeName="r" repeatCount="indefinite" dur="0.7575757575757576s" calcMode="spline" keyTimes="0;1" values="10;0" keySplines="0 0.5 0.5 1" begin="0s"></animate>
                                        <animate attributeName="fill" repeatCount="indefinite" dur="3.0303030303030303s" calcMode="discrete" keyTimes="0;0.25;0.5;0.75;1" values="#ec324c;#32c2ec;#32ec9f;#7e32ec;#ec324c" begin="0s"></animate>
                                    </circle><circle cx="16" cy="50" r="10" fill="#ec324c">
                                    <animate attributeName="r" repeatCount="indefinite" dur="3.0303030303030303s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>
                                    <animate attributeName="cx" repeatCount="indefinite" dur="3.0303030303030303s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>
                                    </circle><circle cx="50" cy="50" r="10" fill="#7e32ec">
                                    <animate attributeName="r" repeatCount="indefinite" dur="3.0303030303030303s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.7575757575757576s"></animate>
                                    <animate attributeName="cx" repeatCount="indefinite" dur="3.0303030303030303s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.7575757575757576s"></animate>
                                    </circle><circle cx="84" cy="50" r="10" fill="#32ec9f">
                                    <animate attributeName="r" repeatCount="indefinite" dur="3.0303030303030303s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.5151515151515151s"></animate>
                                    <animate attributeName="cx" repeatCount="indefinite" dur="3.0303030303030303s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.5151515151515151s"></animate>
                                    </circle><circle cx="16" cy="50" r="10" fill="#32c2ec">
                                    <animate attributeName="r" repeatCount="indefinite" dur="3.0303030303030303s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-2.2727272727272725s"></animate>
                                    <animate attributeName="cx" repeatCount="indefinite" dur="3.0303030303030303s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-2.2727272727272725s"></animate>
                                    </circle>
                                </svg>
                            </li>
                        </ul>
                    </div>
                </div>
            );
        }

        return (
            <AceEditor
                mode={this.state.mode}
                theme={this.state.theme}
                name="paste"
                onChange={e => this.onChange(e)}
                value={this.state.value}
                fontSize={this.state.fontSize}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                width="1000px"
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: this.state.tabSize,
                    useSoftTabs: true,
                }} />
        );
    }

    onCopy() {
        let a = new Clipboard('.copy-url', {
            text: () => window.location.href
        });
        return a;
    }

    onChange(newValue: string) {
        this.setState({
            value: newValue
        });
    }

    setTheme(e: Event) {
        this.setState({
            theme: e.target["value"]
        });
    }

    setMode(e: Event) {
        this.setState({
            mode: e.target["value"]
        });
    }

    setFontSize(e: Event) {
        this.setState({
            fontSize: parseInt(e.target["value"], 10)
        });
    }

    setTabSize(e: Event) {
        this.setState({
            tabSize: parseInt(e.target["value"], 10)
        });
    }

    render() {
        return (
            <div className="container">
                <div className="content">
                    <div className="columns">

                        <div className="column">
                            <h2>Options</h2>
                            <div className="field">
                                <label>Language:</label>
                                <p className="control">
                                    <span className="select">
                                        <select name="mode" onChange={(e) => this.setMode(e)} value={this.state.mode}>
                                            {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
                                        </select>
                                    </span>
                                </p>
                            </div>
                            <div className="field">
                                <label>Theme:</label>
                                <p className="control">
                                    <span className="select">
                                        <select
                                            name="Theme"
                                            onChange={(e) => this.setTheme(e)}
                                            value={this.state.theme}>
                                            {themes.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
                                        </select>
                                    </span>
                                </p>
                            </div>
                            <div className="field">
                                <label>Font Size:</label>
                                <p className="control">
                                    <span className="select">
                                        <select
                                            name="Font Size"
                                            onChange={e => this.setFontSize(e)}
                                            value={this.state.fontSize}>
                                            {[14, 16, 18, 20, 24, 28, 32, 40].map((lang) =>
                                                <option key={lang} value={lang}>{lang}</option>)
                                            }
                                        </select>
                                    </span>
                                </p>
                            </div>
                            <div className="field">
                                <label>Tab Size:</label>
                                <p className="control">
                                    <span className="select">
                                        <select
                                            name="Tab Size"
                                            onChange={e => this.setTabSize(e)}
                                            value={this.state.tabSize}>
                                            {[1, 2, 3, 4].map((lang) =>
                                                <option key={lang} value={lang}>{lang}</option>)
                                            }
                                        </select>
                                    </span>
                                </p>
                            </div>

                            <div className="field is-grouped">
                                <p className="control">
                                    <button className={`button is-primary${this.state.loading ? ' is-loading' : ''}`}
                                        disabled={this.state.loading}
                                        onClick={(e) => this.onSave()}>Save To Tangle
                                    </button>
                                </p>
                                <p className="control">
                                    <button className="button is-primary copy-url"
                                        onClick={(e) => this.onCopy()}>
                                        <span className="icon">
                                            <i className="fa fa-clipboard copy-icon" />
                                        </span>
                                        <span>Copy URL</span>
                                    </button>
                                </p>
                            </div>

                            <p className="field is-grouped">
                                <p className="control">
                                    <a className="button"
                                        target="_blank"
                                        href="https://github.com/Synestry/pastetangle">
                                        <span className="icon">
                                            <i className="fa fa-github" />
                                        </span>
                                        <span>GitHub</span>
                                    </a>
                                </p>
                                {this.state.root ? (
                                    <p className="control">
                                        {this.state.address != "" && (<a className="button"
                                            target="_blank"
                                            href={`https://thetangle.org/address/${this.state.address}`}>
                                            <span>See Transaction</span>
                                        </a>)}
                                    </p>
                                ) : null}

                            </p>
                        </div>

                        <div className="column">
                            <h2>Editor</h2>
                            {this.getEditor()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}