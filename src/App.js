import React, { Component } from 'react';
import './App.css';
import Editor from './editor/Editor';
import sampleMarkup from "./editor/sampleMarkup";

class App extends Component {
  state = {
    html: 'Hello',
    showHTML: false,
    attachments: [
      {
        href: 'http://ski-o.ru/docs/info_gelendzikvelo17.pdf',
        size: '16 kB',
        id: 1
      },
      {
        href: 'http://ski-o.ru/docs/results2017.pdf',
        size: '100 kB',
        id: 2
      }
    ]
  };

  change = html => {
    this.setState({ html });
  }

  toggleHTML = () => {
    this.setState({ showHTML: !this.state.showHTML })
  }

  attach = () => {

  }

  render() {

    return (
      <div className="pa4 dt w-100">
        <div className="dtc w-50 pa2">
          <h2>Editor</h2>
          <Editor
            initialValue={sampleMarkup}
            onChange={this.change}
            uploads={this.state.uploads}
            onAttach={this.attach}
            attachments={this.state.attachments}
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
