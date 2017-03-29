import React, { Component } from 'react';
import { removeBlock } from './utils';

import Media from './Media';
import TableEditor, { CSVToHTML } from './TableEditor';

import PlainTextEditor from './PlainTextEditor';


function getDataFromProps(props) {
  const key = props.block.getEntityAt(0);
  const { contentState } = props;
  const entity = contentState.getEntity(key);
  const data = entity.getData();
  return data;
}

export default class MediaBlockEditor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: getDataFromProps(props),
      focused: false,
      editCaption: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.editCaption && !nextProps.focused) {
      this.setState({ editCaption: false });
    }

    const nextData = getDataFromProps(nextProps);

    if (nextData && nextData !== this.state.data) {
      this.setState({ data: nextData });
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick);
  }

  handleClick = (e) => {
    if (!this.DOMNode.contains(e.target)) {
      /* Click outside */
      if (this.state.focused) {
        this.looseFocus();
      }
    } else {
      /* Click inside */
      if (!this.state.focused) {
        this.setFocus();
      }
    }
  }

  setFocus = () => {
    const { editor } = this.props.blockProps;
    editor.setState({ readOnly: true }, () => {
      this.setState({ focused: true });
      // this.captionEditor.focus();
    });
  }

  looseFocus = () => {
    const { editor } = this.props.blockProps;
    editor.setState({ readOnly: false }, () => {
      this.setState({ focused: false, editCaption: false });
    });

    const key = this.props.block.getEntityAt(0);
    editor.replaceEntityData(key, this.state.data);
  }


  handleCaptionKeyPress = e => {
    if (e.key === 'Enter') {
      this.setState({ editCaption: false }, () => {
        this.save();
      });
    }
  }

  setInputField = name => e => {
    const value = e.target ? e.target.value : e;
    this.setState({
      data: {
        ...this.state.data,
        [name]: value
      }
    });
  }

  onMediaDataChange = state => {
    this.setState({
      data: {
        ...this.state.data,
        ...state
      }
    });
  }


  setField = name => value => {
    this.setState({ [name]: value });
  }

  delete = e => {
    e.preventDefault();
    const { editor } = this.props.blockProps;
    editor.setState({ readOnly: false }, () => {
      const { editorState } = editor.state;
      const newEditorState = removeBlock(editorState, this.props.block.key);
      editor.onChange(newEditorState);
    });
  }

  editCaption = e => {
    e && e.preventDefault();
    // const { editor } = this.props.blockProps;
    this.setState({ editCaption: true });
    // console.log('EDIT');
    // this.setState({ focused: true, editCaption: true }, () => {
    //   editor.setState({ readOnly: true });
    // });
  }

  save = e => {
    e && e.preventDefault();
    this.looseFocus();
  }

  uploadImageForKey = key => files => {
    const { editor } = this.props.blockProps;
    editor.uploadImageForKey(key, files);
  }

  render() {
    const key = this.props.block.getEntityAt(0);
    const { contentState } = this.props;
    const entity = contentState.getEntity(key);
    const type = entity.getType();

    const { editor } = this.props.blockProps;

    return (
      <div
        className="relative"
        draggable={!this.state.focused}
        ref={n => this.DOMNode = n}
        onDragStart={this.props.blockProps.onDragStart}
        onDragEnd={this.props.blockProps.onDragEnd}
        style={{} /*this.state.focused ? { border: '2px solid blue' } : {}*/}
        >
        <a
          href=""
          className="absolute right--1 top--1 link dim blue"
          onClick={this.delete}>
          <i className="fa fa-close" />
        </a>
        <Media
          type={type}
          data={this.state.data}
          focused={this.state.focused}
          onChange={this.onMediaDataChange}
          onFocus={this.blockEditor}
          onUpload={this.uploadImageForKey(key)}
          onBlur={this.save} />
        <figcaption>
          <PlainTextEditor
            type="text"
            value={getDataFromProps(this.props).caption}
            placeholder="Подпись..."
            onKeyPress={this.handleCaptionKeyPress}
            onChange={this.setInputField('caption')}
            onBlockParentEditor={this.setFocus}
            />
        </figcaption>
      </div>
    );
  }
}
