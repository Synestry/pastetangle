import * as React from 'react';
import './App.css';
import Editor from './components/Editor';

const logo = require('./logo.svg');

class App extends React.Component<{}, {}> {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Paste Tangle</h2>
                </div>
                <br />
                <Editor />
            </div>
        );
    }
}

export default App;
