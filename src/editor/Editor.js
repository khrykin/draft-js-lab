import React, { Component } from 'react';
import { Map, List, Repeat } from 'immutable';
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
  SelectionState,
  CompositeDecorator,
  getVisibleSelectionRect,
  DefaultDraftBlockRenderMap,
  convertToRaw,
  DraftEditorBlock,
  AtomicBlockUtils,
  convertFromRaw
} from 'draft-js';

import 'draft-js/dist/Draft.css'

/* State manipulation imports */

import {
  getSelectionEntity,
  getEntityRange,
  getSelectedBlocksType,
  getSelectionInlineStyle,
  handleNewLine,
  insertNewUnstyledBlock,
} from 'draftjs-utils';

import {
  removeBlock
} from './utils';


/* Serialization imports */

import { convertToHTML, convertFromHTML } from './serializer';
import {
  findURLs,
  findHashTags,
  findEntities
} from './strategies';

import sampleMarkup from "./sampleMarkup";


/* Components imports */

import Instagram from 'react-instagram-embed';
import Media from './Media';
import MediaBlockEditor from './MediaBlockEditor';
import HTMLEditor from './HTMLEditor';
import LinkEditor from './LinkEditor';
import AddButton from './AddButton';
import Button from './Button';

import {
  HashTag,
  Link,
  URLLink,
  Image,
} from './EntitiesWrappers';



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


const TOOLBAR_BOTTOM_MARGIN = 15;
const TOOLBAR_SIDE_MARGIN = 15;

const intialState = convertFromHTML(sampleMarkup);

const blockRenderMap = Map({
  // 'unstyled': {
  //   element: 'p'
  // }
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
        component: MediaBlockEditor,
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
      - addButtonRect.width * 2
      // - selectedDOMNodeRect.width / 2
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


export default RichEditor;
