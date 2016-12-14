import React, { Component } from 'react';
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  Entity,
  Modifier,
  CharacterMetadata,
  ContentBlock,
  BlockMapBuilder,
  CompositeDecorator,
  getVisibleSelectionRect,
  DefaultDraftBlockRenderMap,
  convertToRaw,
  DraftEditorBlock,
  AtomicBlockUtils,
  convertFromRaw
} from 'draft-js';

import { convertToHTML, convertFromHTML } from './serializer';

import {
  getSelectionEntity,
  getEntityRange,
  getSelectedBlocksType,
  getSelectionInlineStyle,
  handleNewLine,
  insertNewUnstyledBlock,
} from 'draftjs-utils';

import 'draft-js/dist/Draft.css'

import Instagram from 'react-instagram-embed';

import { Map, List, Repeat } from 'immutable';

function Media(props) {
  const key = props.block.getEntityAt(0);
  const entity = Entity.get(key);
  const data = entity.getData();
  const type = entity.getType();

  if (type === 'PHOTO')
    return (
      <img src={data.src} />
    );
  if (type === 'YOUTUBE')
    return (
      <iframe
        src={data.src}
        frameBorder="0"
        allowFullScreen />
    );
  if (type === 'INSTAGRAM') {
    return (
      <Instagram
        url={data.src}
      />
    )
  }
}

class MediaBlock extends Component {

  constructor(props) {
    super(props);
    const key = props.block.getEntityAt(0);
    const entity = Entity.get(key);
    const data = entity.getData();

    this.state = data;
  }

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.save();
    }
  }

  setInputField = name => e => {
    const { value } = e.target;
    this.setState({ [name]: value });
  }

  setField = name => value => {
    this.setState({ [name]: value });
  }

  delete = e => {
    e.preventDefault();
    const { editor } = this.props.blockProps;
    editor.setState({ readOnly: false }, () => {
      const { editorState } = editor.state;

      const newContentState = Modifier.removeRange(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        'backward'
      )

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        'backspace-character'
      );

      editor.onChange(newEditorState);
    });
  }

  edit = e => {
    e.preventDefault();
    const { editor } = this.props.blockProps;
    this.setState({ edit: true }, () => {
      editor.setState({ readOnly: true });
    });
  }

  save = () => {
    const { editor } = this.props.blockProps;
    this.setState({ edit: false }, () => {
      editor.setState({ readOnly: false });
    });
    const key = this.props.block.getEntityAt(0);
    const { caption, src, content } = this.state;
    editor.replaceEntityData(key, {
      caption,
      src,
      content
    });
  }

  render() {
    const key = this.props.block.getEntityAt(0);
    const entity = Entity.get(key);
    const data = entity.getData();
    const type = entity.getType();

    if (type === 'HTML') {
      return (
        <div>
          { this.state.edit ? (
            <span>
              <HTMLEditor
                value={this.state.content}
                onChange={this.setField('content')}
                />
              <a href="" onClick={this.toggleEdit}>Done</a>
            </span>
          ) : (
            <span>
              <div dangerouslySetInnerHTML={{__html: this.state.content }} />
              <a href="" onClick={this.toggleEdit}>Edit</a>
            </span>
          ) }
        </div>

      )
    }

    return (
      <div className="relative">
        <a href="" className="absolute right--1 top--1" onClick={this.delete}>
          x
        </a>
        <Media {...this.props} />
        <figcaption>
          { this.state.edit ? (
            <span>
              <input
                type="text"
                defaultValue={this.state.src}
                onKeyPress={this.handleKeyPress}
                onChange={this.setInputField('src')}
                />
              <input
                type="text"
                defaultValue={this.state.caption}
                onKeyPress={this.handleKeyPress}
                onChange={this.setInputField('caption')}
                />
            </span>
          ) : (
            <span onClick={this.edit}>
              { this.state.caption || 'Подпись...'}
            </span>
          ) }
        </figcaption>
      </div>
    );
  }
}


class HTMLEditor extends Component {

  static defaultProps = {
    onChange() {}
  }

  change = e => {
    const { value } = e.target;
    this.props.onChange(value);
  }

  render() {
    return (
        <textarea
          value={this.props.value}
          onChange={this.change} />
    );
  }
}


function HashTag(props) {
  const url = '/tags/' + props.decoratedText.replace(/^\#/, '');
  return (
    <a href={url}>
      { props.children }
    </a>
  );
};


function Link(props) {
  const entity = Entity.get(props.entityKey);
  const { href, target } = entity.getData();
  return (
    <a href={href} target={target}>
      { props.children }
    </a>
  );
};

function URLLink(props) {
  return (
    <a href={props.decoratedText}>
      { props.children }
    </a>
  );
}

function Image(props) {
  const entity = Entity.get(props.entityKey);
  const { src } = entity.getData();
  return <img src={src} />
}


function findEntities(type) {
  return (contentBlock, callback) => {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          Entity.get(entityKey).getType() === type
        );
      },
      callback
    );
  }
}

const URL_REGEX = /(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
const HASHTAG_REGEX = /\#[A-Za-zА-Яа-я0-9]+/g;

function findURLs(contentBlock, callback) {
  findWithRegex(URL_REGEX, contentBlock, callback);
}

function findHashTags(contentBlock, callback) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

function getToolbarStyle(selectionRect, toolbar) {
  // console.log(selectionRect, toolbar);
  let left = selectionRect.left
    + selectionRect.width / 2
    - toolbar.offsetWidth / 2;

  if (left < TOOLBAR_SIDE_MARGIN) {
    left = TOOLBAR_SIDE_MARGIN;
  }

  let top = selectionRect.top
    - toolbar.offsetHeight
    - TOOLBAR_BOTTOM_MARGIN
    + document.body.scrollTop;

  if (top < 2 * TOOLBAR_BOTTOM_MARGIN + document.body.scrollTop) {
    top = 2 * TOOLBAR_BOTTOM_MARGIN + document.body.scrollTop;
  }

  return {
    left,
    top,
    visibility: 'visible'
  }
}

const sampleMarkup =
  '<h1>Header</h1>' +
  '<h3>Header</h3>' +
  '<b>Bold text</b>, <i>Italic text</i><br/ ><br />' +
  '<a href="http://www.ski-o.ru" target="__blank">Example link</a>' +
  '<figure><img src="image.jpg" /><figcaption>Caption</figcaption></figure>' +
  '<p></p>' +
  '<figure><img src="image2.jpg" /><figcaption>Caption 2</figcaption></figure>' +
  '<p></p>' +
  '<figure><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe><figcaption>Caption 3</figcaption></figure>' +
  '<p></p>';

const TOOLBAR_BOTTOM_MARGIN = 15;
const TOOLBAR_SIDE_MARGIN = 15;

const intialState = convertFromHTML(sampleMarkup);

const blockRenderMap = Map({
  'unstyled': {
    element: 'p'
  }
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);


//convertFromRaw(raw);

class RichEditor extends Component {

  createDecorator = () => new CompositeDecorator([
    {
      strategy: findEntities('LINK'),
      component: Link,
    },
    {
      strategy: findURLs,
      component: URLLink,
    },
    {
      strategy: findHashTags,
      component: HashTag
    }
  ]);

  state = {
    editorState: EditorState.createWithContent(intialState, this.createDecorator()),
    selectionRect: {},
    toolbarStyle: {
      visibility: 'hidden'
    },
    linkEditorStyle: {
      visibility: 'hidden'
    },
    readOnly: false
  };

  componentDidUpdate(_, prevState) {
    const selectionIsCollapsed =
      this.state.editorState
      .getSelection()
      .isCollapsed()
      ;

    const { selectionRect } = this.state;

    if (
      !selectionIsCollapsed &&
      this.state.currentEntity &&
      this.state.currentEntity.type === 'LINK' &&
      this.state.linkEditorStyle.visibility !== 'visible'
    ) {
      return this.setState({
        linkEditorStyle: getToolbarStyle(selectionRect, this.linkEditor),
        toolbarStyle: {
          visibility: 'hidden'
        },
      }, () => {
        setTimeout(() => this.linkEditorInput.focus(), 0);
      });
    }

    if (
      selectionRect.width > 0 &&
      selectionRect.width !== prevState.selectionRect.width
    ) {
      return this.setState({
        toolbarStyle: getToolbarStyle(selectionRect, this.toolbar),
        linkEditorStyle: {
          visibility: 'hidden'
        },
      });
    }

    if (
      selectionIsCollapsed &&
      (
        this.state.toolbarStyle.visibility === 'visible' ||
        this.state.linkEditorStyle.visibility === 'visible'
      )
    ) {
      this.setState({
        toolbarStyle: {
          visibility: 'hidden'
        },
        linkEditorStyle: {
          visibility: 'hidden'
        }
      });
    }
  }

  onChange = (editorState, cb = () => {}) => {
    const selectionRect = getVisibleSelectionRect(window) || {};
    const currentEntityKey = getSelectionEntity(editorState);
    const currentEntity = currentEntityKey && Entity.get(currentEntityKey);
    this.setState({
      editorState,
      selectionRect,
      currentEntity,
      currentEntityKey
    }, () => {
      this.props.onChange(
        // convertToRaw(this.state.editorState.getCurrentContent())
        convertToHTML(this.state.editorState)
      );
      if (this.state.linkEditorStyle.visibility !== 'visible') {
        // setTimeout(() => this.editor.focus(), 0);
      }
      this.setAddButtonPosition();
      cb();
    });
  }

  onTab = e => {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  blockRenderer = (contentBlock) => {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      return {
        component: MediaBlock,
        editable: false,
        props: {
          editor: this,
        },
      };
    }

    if (type === 'unstyled') {
      return {

      }
    }
  }

  getSelectedBlockElement = () => {
    const selection = window.getSelection();
    let node = selection.focusNode;
    if (node && !(node instanceof HTMLElement)) {
      node = node.parentNode;
    }
    return node;
  };

  setAddButtonPosition = () => {
    const editorRect = this.editorWrapper.getBoundingClientRect();
    const selectedDOMNode = this.getSelectedBlockElement();

    if (!selectedDOMNode) return;

    const selectedDOMNodeRect = selectedDOMNode.getBoundingClientRect();
    const addButtonRect = this.addButton.getBoundingClientRect();

    let left = editorRect.left
      - addButtonRect.width
      - selectedDOMNodeRect.width / 2
      ;

    if (left < TOOLBAR_SIDE_MARGIN) {
      left = TOOLBAR_SIDE_MARGIN;
    }

    const top =  selectedDOMNodeRect.top
      + document.body.scrollTop
      + selectedDOMNodeRect.height
      - addButtonRect.height / 2
      ;

    this.setState({
      addButtonStyle: {
        top,
        left
      }
    });
  }

  selectionHasInlineStyle = style => {
    const { editorState } = this.state;
    return getSelectionInlineStyle(editorState)[style];
  }

  selectionHasBlockType = type => {
    const { editorState } = this.state;
    return getSelectedBlocksType(editorState) === type;
  }

  handleReturn = e => {
    const { editorState } = this.state;
    const newState = handleNewLine(editorState, e);
    if (newState) {
        this.setState({ editorState: newState })
      return 'handled';
    }
    return 'not-handled';
  }

  handleKeyCommand = command => {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  setEntityData = data => {
    const {
      editorState,
      currentEntity,
      currentEntityKey
    } = this.state;

    Entity.replaceData(currentEntityKey, data);
  }

  replaceEntityData = (key, data) => {
    Entity.replaceData(key, data);
  }

  toggleBlockType = type => () => {
    const { editorState } = this.state;
    this.onChange(
      RichUtils.toggleBlockType(
        editorState,
        type
      ),
      () => setTimeout(() => this.editor.focus(), 0)
    );
  }

  toggleStyle = style => () => {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState, style
      ),
      () => setTimeout(() => this.editor.focus(), 0)
    );
  }

  addLink = () => {
    const { editorState } = this.state;
    const key = Entity.create('LINK', 'MUTABLE', {
      href: 'http://'
    });

    this.onChange(
      RichUtils.toggleLink(
        editorState,
        editorState.getSelection(),
        key
      )
    );
  }

  removeLink = () => {
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      return this.onChange(
        RichUtils.toggleLink(editorState, selection, null),
        this.closeLinkEditor()
      );
    }
  }

  addMedia = (type, data) => {
    return () => {
      const { editorState } = this.state;
      const key = Entity.create(
        type,
        'IMMUTABLE',
        data
      );

      const stateWithAtomicBlock =  AtomicBlockUtils.insertAtomicBlock(
        editorState,
        key,
        ' '
      );

      this.onChange(
        stateWithAtomicBlock
      );
    }
  }


  addPhoto = () => {
    this.addMedia('PHOTO', { src: 'image.jpg' })()
  }

  addYoutube = () => {
    this.addMedia('YOUTUBE', { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ' })()
  }

  addInstagram = () => {
    this.addMedia('INSTAGRAM', { src: 'https://www.instagram.com/p/BMWm4GPjxEV' })()
  }

  addHTML= () => {
    this.addMedia('HTML', { content: '<b>Hello</b>' })()
  }

  closeLinkEditor = () => {
    this.editor.focus();
    this.setState({
      currentEntity: null
    });
  }

  toggleAddMenu = e => {
    this.setState({ showAddMenu: true });
  }

  render() {
    const { toolbarStyle } = this.state;
    return (
      <div className="Editor">
        <div ref={n => this.toolbar = n}
          className="absolute pa1 shadow-4 white bg-black white br2 z-index-3"
          style={toolbarStyle}>
          <Button
            className="b serif"
            active={this.selectionHasBlockType('header-two')}
            onClick={this.toggleBlockType('header-two')}>
            H1
          </Button>
          <Button
            className="f6 serif"
            active={this.selectionHasBlockType('header-three')}
            onClick={this.toggleBlockType('header-three')}>
            H2
          </Button>
          <Button
            className=""
            active={this.selectionHasBlockType('unstyled')}
            onClick={this.toggleBlockType('unstyled')}>
            <i className="fa fa-paragraph"/>
          </Button>
          <Button
            className=""
            active={this.selectionHasBlockType('unordered-list-item')}
            onClick={this.toggleBlockType('unordered-list-item')}>
            <i className="fa fa-list-ul"/>
          </Button>
          <Button
            className=""
            active={this.selectionHasBlockType('ordered-list-item')}
            onClick={this.toggleBlockType('ordered-list-item')}>
            <i className="fa fa-list-ol"/>
          </Button>
          <Button
            className=""
            active={this.selectionHasBlockType('blockquote')}
            onClick={this.toggleBlockType('blockquote')}>
            <i className="fa fa-quote-left"/>
          </Button>
          <Button
            className=""
            active={this.selectionHasInlineStyle('BOLD')}
            onClick={this.toggleStyle('BOLD')}>
            <i className="fa fa-bold"/>
          </Button>
          <Button
            className=""
            active={this.selectionHasInlineStyle('ITALIC')}
            onClick={this.toggleStyle('ITALIC')}>
            <i className="fa fa-italic"/>
          </Button>
          <Button
            className=""
            active={this.selectionHasInlineStyle('UNDERLINE')}
            onClick={this.toggleStyle('UNDERLINE')}>
            <i className="fa fa-underline"/>
          </Button>
          <Button
            className=""
            onClick={this.addLink}>
            <i className="fa fa-link"/>
          </Button>
        </div>


        <div
          ref={n => this.editorWrapper = n}
          className="">
          <Editor
            ref={n => { window.editor = n; this.editor = n }}
            placeholder="Tell a story"
            handleReturn={this.handleReturn}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            blockRendererFn={this.blockRenderer}
            blockRenderMap={extendedBlockRenderMap}
            readOnly={this.state.readOnly}
            onTab={this.onTab}
            onChange={this.onChange} />
        </div>
        <AddButton
          DOMNodeRef={n => this.addButton = n}
          style={this.state.addButtonStyle}
          addPhoto={this.addPhoto}
          addYoutube={this.addYoutube}
          addInstagram={this.addInstagram}
          addHTML={this.addHTML}
          />
        <LinkEditor
          DOMNodeRef={n => this.linkEditor = n}
          inputDOMNodeRef={n => this.linkEditorInput = n}
          addLink={this.addLink}
          removeLink={this.removeLink}
          href={this.state.currentEntity && this.state.currentEntity.getData().href}
          style={this.state.linkEditorStyle}
          onChange={this.setEntityData}
          onClose={this.closeLinkEditor}
          />
      </div>
    );
  }
}


class AddButton extends Component {
  state = {
    show: false
  };

  toggleShow = e => {
    this.setState({ show: !this.state.show });
  }

  delegate = (handler=() => {}) => e => {
    e.preventDefault();
    this.setState({ show: false });
    handler();
  }

  render() {
    const { show } = this.state;
    return (
      <div
        style={this.props.style}
        className="absolute z-index-3 tc w2"
        >
        <div
          onClick={this.toggleShow}
          ref={this.props.DOMNodeRef}
          className="ml1 pointer dib bg-white silver tc flex flex-column justify-center items-center w2 h2 ba br-100 animate-bg hover-bg-silver hover-white">
         <i className={`fa fa-${show ? 'minus' : 'plus'}`}/>
        </div>
        { show && (
          <div className="gray mt1">
            <div className="">
              <Button
                className=""
                onClick={this.delegate(this.props.addPhoto)}>
                <i className="fa fa-picture-o"/>
              </Button>
            </div>
            <div>
              <Button
                className=""
                onClick={this.delegate(this.props.addHTML)}>
                <i className="fa fa-code"/>
              </Button>
            </div>
            <div>
              <Button
                className=""
                onClick={this.delegate(this.props.addYoutube)}>
                <i className="fa fa-film"/>
              </Button>
            </div>
            <div>
              <Button
                className=""
                onClick={this.delegate(this.props.addInstagram)}>
                <i className="fa fa-instagram"/>
              </Button>
            </div>
            <div>
              <Button
                className=""
                onClick={this.delegate(this.addAttachment)}>
                <i className="fa fa-paperclip"/>
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

class LinkEditor extends Component {
  static defaultProps = {
    href: '',
    onChange: () => {},
    onClose: () => {}
  }

  state = {
    href: this.props.href || '',
    blank: false,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.href && nextProps.href !== this.state.href) {
      this.setState({ href: nextProps.href });
    }
  }

  setHref = e => {
    const { value: href } = e.target;
    this.setState({ href }, () => {
      this.props.onChange({
        href,
        target: this.state.blank ? '__blank' : undefined
      });
    });
  }

  setBlank = e => {
    const { checked: blank } = e.target;
    this.setState({ blank }, () => {
      this.props.onChange(this.state);
    });
  }

  close = e => {
    if (e.key === 'Enter') {
     this.props.onClose();
   }
  }

  render() {
    return (
      <div
        ref={this.props.DOMNodeRef}
        className="absolute pa1 dt bg-black white shadow-4 white br2 z-index-3"
        style={this.props.style}>
        <div className="dtc">
          <input
            className="input-reset f5 w5 h-100 br1 bw0 pa2 mr1 bg-near-white black "
            tabIndex={0}
            type="text"
            ref={this.props.inputDOMNodeRef}
            onKeyPress={this.close}
            value={this.state.href}
            onChange={this.setHref}
            />
          <div className="pa2 f6">
            <input
              type="checkbox"
              checked={this.state.blank}
              onChange={this.setBlank}
              />
            {' '}
            В отдельном окне
          </div>
        </div>
        <div className="dtc w2">
        <Button
          className=""
          onClick={this.props.removeLink}>
          <i className="fa fa-close"/>
        </Button>
        </div>
      </div>
    )
  }
}

const Button = ({ onClick, children, className, active }) => (
  <div
    className={
      `pointer dib pa1 br1 ph2 ma1 ` +
      (active ?
        `bg-white hover-bg-gray black` :
        `bg-transparent hover-bg-gray hover-white`
      ) +
      `${className ? ' ' + className : ''}`
    }
    onClick={onClick}>
    { children }
  </div>
);

export default RichEditor;
