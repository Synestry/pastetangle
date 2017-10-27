import * as React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/jsx';

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
    'monokai',
    'github',
    'tomorrow',
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
    code?: string;
}
interface State {
    value: string;
    theme: string;
    mode: string;
    fontSize: number;
    tabSize: number;
}

export default class Editor extends React.Component<Props, State> {
    async onSave() {
        console.log('saving...');
        let txs = await iotaHelper.uploadToTangle(this.state.value, {
            theme: this.state.theme,
            mode: this.state.mode,
            fontSize: this.state.fontSize,
            tabSize: this.state.tabSize
        });

        console.log(txs);
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

    constructor(props: Props) {
        super(props);
        this.state = {
            value: props.code || defaultCode,
            theme: 'monokai',
            mode: 'javascript',
            fontSize: 14,
            tabSize: 4,
        };
        this.setTheme = this.setTheme.bind(this);
        this.setMode = this.setMode.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setFontSize = this.setFontSize.bind(this);
        this.setTabSize = this.setTabSize.bind(this);
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
                                        <select name="mode" onChange={this.setMode} value={this.state.mode}>
                                            {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
                                        </select>
                                    </span>
                                </p>
                            </div>
                            <div className="field">
                                <label>Theme:</label>
                                <p className="control">
                                    <span className="select">
                                        <select name="Theme" onChange={this.setTheme} value={this.state.theme}>
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
                                            onChange={this.setFontSize}
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
                                            onChange={this.setTabSize}
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
                                onChange={this.onChange}
                                value={this.state.value}
                                fontSize={this.state.fontSize}
                                showPrintMargin={true}
                                showGutter={true}
                                highlightActiveLine={true}
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