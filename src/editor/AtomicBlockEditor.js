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

    this.state = {
      data,
      focused: false,
      editCaption: false
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('this.state.editCaption', this.state.editCaption);
    console.log('!nextProps.focused', !nextProps.focused);

    if (this.state.editCaption && !nextProps.focused) {
      console.log('LOOSE CAPTION')
      this.setState({ editCaption: false });
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
        draggable={!this.state.focused}
        ref={n => this.DOMNode = n}
        onDragStart={this.props.blockProps.onDragStart}
        onDragEnd={this.props.blockProps.onDragEnd}
        style={this.state.focused ? { border: '2px solid blue' } : {}}
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
          focused={this.state.focused}
          onChange={this.onMediaDataChange}
          onFocus={this.blockEditor}
          onBlur={this.save}
          />
        <figcaption>
          { this.state.editCaption ? (
            <span>
              <input
                type="text"
                defaultValue={this.state.data.caption}
                onKeyPress={this.handleCaptionKeyPress}
                onChange={this.setInputField('caption')}
                />
            </span>
          ) : (
            <span onClick={this.editCaption}>
              { this.state.data.caption || 'Подпись...'}
            </span>
          ) }
        </figcaption>
      </div>
    );
  }
}
