import React, { Component } from 'react';
import { Map } from 'immutable';
import {
  Editor,
  EditorState,
  ContentState
  // RichUtils,
  // Modifier,
  // SelectionState,
  // CompositeDecorator,
  // getVisibleSelectionRect,
  // DefaultDraftBlockRenderMap,
  // AtomicBlockUtils,
  // convertToRaw
} from 'draft-js';

export default class PlainTextEditor extends Component {

  static defaultProps = {
    onChange() {},
    onBlockParentEditor() {},
    value: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createWithContent(
        ContentState.createFromText(this.props.value)
      )
    }
  }

  change = editorState => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    this.props.onBlockParentEditor();
      // if (contentState !== this.state.editorState.getCurrentContent()) {
    console.log('plainText', plainText);
    this.props.onChange(plainText);
      // }
      this.setState({ editorState });
  }

  createStateFromProps = () => {
    return EditorState.push(
      this.state.editorState,
      ContentState.createFromText(this.props.value)
    )
  }

  render() {
    const { editorState } = this.state;
    const { value, onChange, placeholder, readOnly } = this.props;
    return (
      <div className="PlainTextEditor">
        <Editor
          placeholder={placeholder}
          readOnly={readOnly}
          editorState={editorState}
          onChange={this.change}
          />
      </div>
    );
  }
}
