import * as React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/jsx';

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
            value: defaultCode,
            theme: 'tomorrow',
            mode: 'javascript',
            fontSize: 14,
            tabSize: 4,
        };

        this.getCode(queryState.get('bundle'));
    }

    async getCode(bundle?: string) {
        if (!bundle) {
            return;
        }

        this.setState({
            value: 'Fetching code...',
        });

        console.log('Fetching code...');

        let { data, metaData } = await iotaHelper.fetchFromTangle<string, State>(bundle, queryState.get('seed'));

        this.setState({
            value: data as string,
            theme: metaData.theme,
            mode: metaData.mode,
            fontSize: metaData.fontSize,
            tabSize: metaData.tabSize
        });
    }

    async onSave() {
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
                                <label>Mode:</label>
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
                        </div>

                        <div className="column">
                            <h2>Editor</h2>
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
                        </div>

                        <div className="column">
                            <h2>Save</h2>
                            <button onClick={(e) => this.onSave()}>Save To Tangle</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}