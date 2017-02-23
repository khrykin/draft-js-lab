import React, { Component } from 'react';
import { removeBlock } from './utils';

import Media from './Media';
import TableEditor, { CSVToHTML } from './TableEditor';

export default class MediaBlockEditor extends Component {

  constructor(props) {
    super(props);
    const key = props.block.getEntityAt(0);
    const { contentState } = props;
    const entity = contentState.getEntity(key);
    const data = entity.getData();

    this.state = { data };
  }

  handleCaptionKeyPress = e => {
    if (e.key === 'Enter') {
      this.save();
    }
  }

  setInputField = name => e => {
    const { value } = e.target;
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

  blockEditor = () => {
    const { editor } = this.props.blockProps;
    editor.setState({ readOnly: true });
  }

  unblockEditor = () => {
    const { editor } = this.props.blockProps;
    editor.setState({ readOnly: false }, () => {
      const key = this.props.block.getEntityAt(0);
      editor.replaceEntityData(key, this.state.data);
    });
  }

  delete = e => {
    e.preventDefault();
    const { editor } = this.props.blockProps;
    editor.setState({ readOnly: false }, () => {

      const newEditorState = removeBlock(editor.state.editorState, this.props.block.key);

      editor.onChange(newEditorState);
    });
  }

  edit = e => {
    e && e.preventDefault();
    const { editor } = this.props.blockProps;
    this.setState({ edit: true }, () => {
      editor.setState({ readOnly: true });
    });
  }

  save = e => {

    if (e) {
      e.preventDefault();
    }

    const { editor } = this.props.blockProps;
    this.setState({ edit: false }, () => {
      editor.setState({ readOnly: false });
    });
    const key = this.props.block.getEntityAt(0);
    editor.replaceEntityData(key, this.state.data);
  }



  render() {
    const key = this.props.block.getEntityAt(0);
    const { contentState } = this.props;
    const entity = contentState.getEntity(key);
    // const data = entity.getData();
    const type = entity.getType();

    const { editor } = this.props.blockProps;

    // if (type === 'TABLE') {
    //   return (
    //     <div
    //       draggable
    //       onDragStart={this.props.blockProps.onDragStart}
    //       onDragEnd={this.props.blockProps.onDragEnd}
    //       >
    //       { this.state.edit ? (
    //         <span>
    //           <TableEditor
    //             value={this.state.content}
    //             onChange={this.setField('content')}
    //             />
    //           <a href="" onClick={this.save}>Done</a>
    //         </span>
    //       ) : (
    //         <span>
    //           <div dangerouslySetInnerHTML={{__html: CSVToHTML(this.state.content) }} />
    //           <a href="" onClick={this.edit}>Edit</a>
    //         </span>
    //       ) }
    //     </div>
    //
    //   )
    // }

    return (
      <div
        className="relative"
        draggable
        onDragStart={this.props.blockProps.onDragStart}
        onDragEnd={this.props.blockProps.onDragEnd}
        >
        <a
          href=""
          className="absolute right--1 top--1"
          onClick={this.delete}>
          x
        </a>
        <Media
          type={type}
          data={this.state.data}
          onChange={this.onMediaDataChange}
          onFocus={this.blockEditor}
          onBlur={this.unblockEditor}
          />
        <figcaption>
          { this.state.edit ? (
            <span>
              <input
                type="text"
                defaultValue={this.state.data.caption}
                onKeyPress={this.handleCaptionKeyPress}
                onChange={this.setInputField('caption')}
                />
            </span>
          ) : (
            <span onClick={this.edit}>
              { this.state.data.caption || 'Подпись...'}
            </span>
          ) }
        </figcaption>
      </div>
    );
  }
}
