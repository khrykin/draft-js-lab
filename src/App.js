import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Editor from './editor/Editor';

class App extends Component {
  state = {
    html: 'Hello',
    showHTML: false
  };

  change = html => {
    this.setState({ html });
  }

  toggleHTML = () => {
    this.setState({ showHTML: !this.state.showHTML })
  }

  render() {

    return (
      <div className="pa4 dt w-100">
        <div className="dtc w-50 pa2">
          <h2>Title</h2>
          <input type="text" className="input-reset ba br1 f4 pa2"/>
          <h2>Editor</h2>
          <Editor
            value={this.state.html}
            onChange={this.change}
            />
        </div>
        <div className="dtc w-50 mw7 pa2">
          <h2>Output</h2>
          <div onClick={this.toggleHTML}
            className="ba dib pa2 br1 pointer dim link">
            HTML
          </div>
          { this.state.showHTML && (
            <pre className="bg-dark-gray near-white pa4 br1 overflow-scroll">
              { JSON.stringify(this.state.html, null, '  ') }
            </pre>
          )}
        </div>
      </div>
    );
  }
}

export default App;
