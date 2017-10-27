import * as React from 'react';
import './App.css';
import Editor from './components/Editor';

const logo = require('./logo.svg');

class App extends React.Component<{}, {}> {
    render() {
        return (
            <div className="App">
                <section className="hero is-primary">
                    <div className="hero-body">
                        <div className="container has-text-centered">
                            <img src={logo} className="App-logo" alt="logo" />

                            <h1 className="title">
                                PasteTangle
                            </h1>
                            <h2 className="subtitle">
                                An encrypted anonymous pastebin
                            </h2>
                        </div>
                    </div>
                </section>
                <section className="section">
                    <Editor />
                </section>
            </div>
        );
    }
}

export default App;
