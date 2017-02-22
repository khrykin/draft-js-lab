import React, { Component } from 'react';
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
          <h2>Editor</h2>
          <Editor
            value={this.state.html}
            onChange={this.change}
            />
        </div>
        <div className="dtc w-50 pa2">
          <h2>Output</h2>
          <div dangerouslySetInnerHTML={{__html: this.state.html }} />
        </div>
      </div>
    );
  }
}

export default App;
