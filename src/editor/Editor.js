import React, { Component } from 'react';
import { Map } from 'immutable';
import {
  Editor,
  EditorState,
  RichUtils,
  CompositeDecorator,
  getVisibleSelectionRect,
  DefaultDraftBlockRenderMap,
  AtomicBlockUtils,
} from 'draft-js';

import 'draft-js/dist/Draft.css'

/* State manipulation imports */

import {
  getSelectionEntity,
  getSelectedBlocksType,
  getSelectedBlock,
  getSelectionInlineStyle,
  handleNewLine,
} from 'draftjs-utils';

import {
  collapseSelectionToTheEnd,
  moveAtomicBlock
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

// import Instagram from 'react-instagram-embed';
// import Media from './Media';
import MediaBlockEditor from './MediaBlockEditor';
// import HTMLEditor from './HTMLEditor';
import LinkEditor from './LinkEditor';
import AddButton from './AddButton';
import Button from './Button';

import {
  HashTag,
  Link,
  URLLink,
  // Image,
} from './EntitiesWrappers';

const TOOLBAR_BOTTOM_MARGIN = 15;
const TOOLBAR_SIDE_MARGIN = 15;


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

  // console.log('toolbar.offsetWidth', toolbar.offsetWidth);
  // console.log('toolbar.offsetHeight', toolbar.offsetHeight);
  // console.log('selectionRect.top', selectionRect.top);
  // console.log('document.body.scrollTop', document.body.scrollTop);
  //
  // console.log("TOOLBAR_POSITION", {
  //   left,
  //   top,
  //   visibility: 'visible'
  // });

  return {
    left,
    top,
    visibility: 'visible'
  }
}



const intialState = convertFromHTML(sampleMarkup);

const blockRenderMap = Map({
  // 'unstyled': {
  //   element: 'p'
  // }
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);


//convertFromRaw(raw);

class RichEditor extends Component {
  //
  componentDidMount() {
    window.addEventListener('click', this.handleReadOnly);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleReadOnly);
  }

  /**
   * Removes readOnly set by toolbars in order to preserve selction state
   * of editor
   */

  handleReadOnly = (e) => {
    setTimeout(() => {

      /* this allows atomic block editors to control readOnly too
       * since selection is collapsed when you choose an atomic block
       */

      const selectionIsCollapsed =
        this.state.editorState
        .getSelection()
        .isCollapsed()
        ;

      if (this.state.readOnly && !selectionIsCollapsed) {
        this.setState({ readOnly: false });
      }
    }, 0);
  }

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
    toolbarStyle: {
      visibility: 'hidden'
    },
    linkEditorStyle: {
      visibility: 'hidden'
    },
    readOnly: false
  };

  componentDidUpdate(_, prevState) {

  }

  onChange = (editorState, cb = () => {}) => {
    // const selectionRect = getVisibleSelectionRect(window) || {};
    this.setState({ editorState }, () => {

      const currentBlock = getSelectedBlock(this.state.editorState);
      console.log('currentBlock', currentBlock.getType());

      this.props.onChange(convertToHTML(this.state.editorState));
      // console.log("EDITOR_STATE", JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())));
      this.setAddButtonPosition();
      this.setToolbarPosition();
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
          onMouseDown: () => {
            console.log('Clicked type', type);
            this.setState({
              isDragging: contentBlock
            })
          }
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

  getCurrentEntity = () => {
    const { editorState } = this.state;
    const currentEntityKey = getSelectionEntity(editorState);

    if (!currentEntityKey) return;

    const currentContent = editorState.getCurrentContent();
    return currentContent.getEntity(currentEntityKey);
  }

  getSelectionRect = () => {
    return getVisibleSelectionRect(window) || {};
  }

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

  setToolbarPosition = () => {
    const selectionIsCollapsed =
      this.state.editorState
      .getSelection()
      .isCollapsed()
      ;

    const currentEntity = this.getCurrentEntity();
    const selectionRect = this.getSelectionRect();

    console.log('selectionRect', selectionRect);

    const linkIsSelected = (
      !selectionIsCollapsed &&
      currentEntity &&
      currentEntity.type === 'LINK' &&
      this.state.linkEditorStyle.visibility !== 'visible'
    );

    if (linkIsSelected) {
      console.log('this.linkEditor', this.linkEditor);
      return this.setState({
        linkEditorStyle: getToolbarStyle(selectionRect, this.linkEditor),
        toolbarStyle: {
          visibility: 'hidden'
        },
      }, () => {
        // setTimeout(() => this.linkEditorInput.focus(), 0);
      });
    }

    if (selectionRect.width > 0) {
      return this.setState({
        toolbarStyle: getToolbarStyle(selectionRect, this.toolbar),
        readOnly: true,
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
        readOnly: false,
        toolbarStyle: {
          visibility: 'hidden'
        },
        linkEditorStyle: {
          visibility: 'hidden'
        }
      });
    }
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

  handleDrop = (selection, dataTransfer, isInternal) => {
    const { editorState, isDragging } = this.state;
    if (isDragging) {
      const newState = moveAtomicBlock(
        editorState,
        isDragging,
        selection,
        'move-block'
      );

      this.onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  setEntityData = data => {
    const {
      editorState
    } = this.state;

    const currentEntityKey = getSelectionEntity(editorState);
    const contentState = editorState.getCurrentContent();
    contentState.replaceEntityData(currentEntityKey, data);
  }

  replaceEntityData = (key, data) => {
    const contentState = this.state.editorState.getCurrentContent();
    contentState.replaceEntityData(key, data);
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
    const contentState = editorState.getCurrentContent();

    const contentStateWithEntity =
      contentState.createEntity('LINK', 'MUTABLE', {
        href: 'http://'
      });

    const key = contentStateWithEntity.getLastCreatedEntityKey();

    this.onChange(
      RichUtils.toggleLink(
        editorState,
        editorState.getSelection(),
        key
      ), () => {
        this.setState({ readOnly: false });
      }
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
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        type,
        'IMMUTABLE',
        data
      );

      const key = contentStateWithEntity.getLastCreatedEntityKey();

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
    const { editorState } = this.state;
    const selectionState = collapseSelectionToTheEnd(editorState);
    this.onChange(EditorState.forceSelection(editorState, selectionState));
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
            handleDrop={this.handleDrop}
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
          href={this.getCurrentEntity() && this.getCurrentEntity().getData().href}
          style={this.state.linkEditorStyle}
          onChange={this.setEntityData}
          onClose={this.closeLinkEditor}
          />
      </div>
    );
  }
}


export default RichEditor;
