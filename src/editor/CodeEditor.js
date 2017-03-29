import React, { Component } from 'react';


/**
 * Controlled input-like code editor
 */

class CodeEditor extends Component {

  componentDidUpdate(prevProps) {
    const valueChanged = this.props.value !== this.mirror.getValue();
    const propsChanged = prevProps.value !== this.props.value;
    if (valueChanged && propsChanged) {
      this.mirror.setValue(this.props.value);
    }
  }

  componentDidMount() {
    require('codemirror/lib/codemirror.css');
    require('codemirror/theme/material.css');
    require('codemirror/mode/htmlembedded/htmlembedded.js');
    const CodeMirror = require('codemirror');
    this.mirror = CodeMirror(this.editor, {
      value: this.props.value,
      mode: "htmlembedded",
      theme: "material"
    });

    this.mirror.on('change', (editor) => {
      const newValue = editor.getValue();
      if (newValue === this.props.value) return;
      this.props.onChange(newValue);
    });
  }

  render() {
    return (
      <div
        className="CodeEditor measure dib code input-reset tl w-100 br2 bg-black white overflow-hidden"
        ref={n => this.editor = n}>
      </div>
    );
  }
}

export default CodeEditor;
