import * as React from 'react';
import './Editor.css';
import AceEditor from 'react-ace';
import { RingLoader } from 'halogen';
import 'brace/mode/jsx';
import Clipboard = require('clipboard');

const queryState = require('querystate')();

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

languages.forEach((lang) => {
    require(`brace/mode/${lang}`);
    require(`brace/snippets/${lang}`);
});

themes.forEach((theme) => {
    require(`brace/theme/${theme}`);
});

import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

import iotaHelper from '../helpers/IotaHelper';

interface Props {
}
interface State {
    loading: boolean;
    bundle: string;
    seed: string;
    status: string;
    value: string;
    theme: string;
    mode: string;
    fontSize: number;
    tabSize: number;
}

export default class Editor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            loading: Boolean(queryState.get('bundle')),
            bundle: queryState.get('bundle'),
            seed: queryState.get('seed'),
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
        if (!this.state.bundle || !this.state.seed) {
            return;
        }

        console.log('Fetching code...');

        let { data, metaData } = await iotaHelper.fetchFromTangle<string, State>(this.state.bundle, this.state.seed);

        this.setState({
            value: data as string,
            theme: metaData.theme,
            mode: metaData.mode,
            fontSize: metaData.fontSize,
            tabSize: metaData.tabSize,
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
                                <RingLoader size="100px" color="#00d1b2" />
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

    async onSave() {
        this.setState({
            loading: true,
            status: 'Saving...'
        });

        console.log('saving...');
        let transaction = await iotaHelper.uploadToTangle(this.state.value, {
            theme: this.state.theme,
            mode: this.state.mode,
            fontSize: this.state.fontSize,
            tabSize: this.state.tabSize
        });

        console.log(transaction);
        queryState.set('bundle', transaction.bundle);
        queryState.set('seed', transaction.seed);
        this.setState({
            bundle: transaction.bundle.toString(),
            seed: transaction.seed,
            loading: false
        });
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

    setTheme(e: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({
            theme: e.target.value
        });
    }

    setMode(e: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({
            mode: e.target.value
        });
    }

    setFontSize(e: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({
            fontSize: parseInt(e.target.value, 10)
        });
    }

    setTabSize(e: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({
            tabSize: parseInt(e.target.value, 10)
        });
    }

    render(): JSX.Element {
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
                                {this.state.bundle ? (
                                    <p className="control">
                                        <a className="button"
                                            target="_blank"
                                            href={`https://thetangle.org/bundle/${this.state.bundle}`}>
                                            <span>See Transaction</span>
                                        </a>
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