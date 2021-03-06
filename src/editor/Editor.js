import React, { Component } from 'react';
import { Map } from 'immutable';
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  SelectionState,
  CompositeDecorator,
  getVisibleSelectionRect,
  DefaultDraftBlockRenderMap,
  AtomicBlockUtils,
  convertToRaw
} from 'draft-js';


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
  moveAtomicBlock,
  getScrollTop
} from './utils';


/* Serialization imports */

import { convertToHTML, convertFromHTML } from './serializer';
import {
  findURLs,
  findHashTags,
  findEntities
} from './strategies';



/* Components imports */

// import Instagram from 'react-instagram-embed';
import { DEFAULT_IMAGE, LOADING_IMAGE } from './Media';
import AtomicBlockEditor from './AtomicBlockEditor';
// import HTMLEditor from './HTMLEditor';
import LinkEditor from './LinkEditor';
import AttachmentEditor from './AttachmentEditor';
import AddButton from './AddButton';
import Button, { UploadButton } from './Button';

import {
  HashTag,
  Link,
  URLLink,
  Attachment
  // Image,
} from './EntitiesWrappers';

import fetchWithProgress from './fetchWithProgress';

const TOOLBAR_BOTTOM_MARGIN = 15;
const TOOLBAR_SIDE_MARGIN = 15;

function reloadScripts(container = document) {
  const scripts = container.getElementsByTagName('script');
  if (!scripts.length) return;
  for (let i in scripts) {
    const script = scripts[i];
    if (!script.getAttribute) continue;


    let newScript = document.createElement('script');
    newScript.textContent = script.textContent;

    let src = script.getAttribute('src');
    // if (!/\?/.test(src)) {
    //   src = src + `?${Math.random().toString(36).substr(2, 5)}`;
    // } else {
    //   src = src.replace(/(\?+)/, `?${Math.random().toString(36).substr(2, 5)}`);
    // }

    for (let ai in script.attributes) {
      const { name, value } = script.attributes[ai];
      if (typeof value === 'undefined') continue;
      newScript.setAttribute(name, value);
    }
    newScript.setAttribute('src', src);

    const head = document.getElementsByTagName('HEAD')[0];
    script.parentNode.appendChild(newScript);
    script.parentNode.removeChild(script);

    /* Special fix for instagram */
    /* NB! Doesn't work in IE
     * http://stackoverflow.com/questions/14644558/call-javascript-function-after-script-is-loaded
     */
    newScript.onload = () => {
      window.instgrm && window.instgrm.Embeds.process();
    };
  };
}



const blockRenderMap = Map({
  // 'unstyled': {
  //   element: 'p'
  // }
});

const styleMap  = {
  'SMALL': {
    fontSize: '80%',
  },
};

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);


//convertFromRaw(raw);

class RichEditor extends Component {

  static defaultProps = {
    attachments: [],
    initalValue: "",
    uploadURL: "/api/photos/upload"
  }
  //
  componentDidMount() {
    require('draft-js/dist/Draft.css');
    require('../index.css');
    window.addEventListener('click', this.handleReadOnly);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleReadOnly);
  }

  componentDidUpdate() {
    this.reloadScripts();
  }

  reloadScripts() {
    reloadScripts(this.editorWrapper);
  }


  createDecorator = () => new CompositeDecorator([
    {
      strategy: findEntities('LINK'),
      component: Link,
    },
    {
      strategy: findEntities('ATTACHMENT'),
      component: Attachment,
    }//,
    // {
    //   strategy: findURLs,
    //   component: URLLink,
    // },
    // {
    //   strategy: findHashTags,
    //   component: HashTag
    // }
  ]);

  constructor(props) {
    super(props);

    const decorator = this.createDecorator();

    const intialContentState = convertFromHTML(props.initialValue);

    this.state = {
      editorState: EditorState.createWithContent(intialContentState, decorator),
      // toolbarStyle: {
      //   visibility: 'hidden'
      // },
      // linkEditorStyle: {
      //   visibility: 'hidden'
      // },
      toolbar: null,
      toolbarStyle: {
        visibility: 'hidden'
      },
      readOnly: false,
      // files: this.props.files || [{ filename: "test.pdf", href: "http://ski-o.ru/index.pdf" },{ filename: "test3.pdf", href: "http://ski-o.ru/index.pdf" }]
    };
  }



  onChange = (editorState, cb = () => {}) => {
    // const selectionRect = getVisibleSelectionRect(window) || {};
    this.setState({ editorState }, () => {

      const currentBlock = getSelectedBlock(this.state.editorState);
      console.log('currentBlock', currentBlock.getType());

      this.props.onChange(convertToHTML(this.state.editorState));
      console.log("EDITOR_STATE", convertToRaw(this.state.editorState.getCurrentContent()));
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
        component: AtomicBlockEditor,
        editable: false,
        props: {
          editor: this,
          onDragStart: () => {
            console.log('onDragStart type', type);
            this.editor.focus();
            this.setState({
              isDragging: contentBlock,
              readOnly: false
            });
          },
          onDragEnd: () => {
            const key = contentBlock.getEntityAt(0);
            const entity = this.state.editorState.getCurrentContent().getEntity(key);
            if (entity.getType() === 'PHOTO') return;
            console.log('DROPPED');
            this.setState({
              readOnly: false
            });
            this.handleDrop(this.state.editorState.getSelection());
          }
        },
      };
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

  getToolbarStyle(selectionRect, toolbar) {

    let left = selectionRect.left
      + selectionRect.width / 2
      - toolbar.offsetWidth / 2;

    if (left < TOOLBAR_SIDE_MARGIN) {
      left = TOOLBAR_SIDE_MARGIN;
    }

    const scrollTop = getScrollTop();

    let top = selectionRect.top
      - toolbar.offsetHeight
      - TOOLBAR_BOTTOM_MARGIN
      + scrollTop;

    if (top < 2 * TOOLBAR_BOTTOM_MARGIN + scrollTop) {
      top = 2 * TOOLBAR_BOTTOM_MARGIN + scrollTop;
    }

    const { toolbarStyle } = this.state;

    return {
      left: left || toolbarStyle.left,
      top: top || toolbarStyle.top,
      visibility: 'visible'
    }
  }

  setAddButtonPosition = () => {
    const editorRect = this.editorWrapper.getBoundingClientRect();
    const selectedDOMNode = this.getSelectedBlockElement();
    const selectionRect = this.getSelectionRect();

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

    const selectionTop =
      getScrollTop()
    + selectionRect.top
    ;

    const blockBottom =
      selectedDOMNodeRect.top
    + getScrollTop()
    + selectedDOMNodeRect.height
    - this.addButton.offsetHeight / 2
    ;

    let top = selectionTop;

    if (!selectionTop) {
      top = blockBottom;
    }

    this.setState({
      addButtonStyle: {
        top,
        left
      }
    });
  }

  setToolbarPosition = (toolbar = 'toolbar') => {
    const selectionIsCollapsed =
      this.state.editorState
      .getSelection()
      .isCollapsed()
      ;

    const currentEntity = this.getCurrentEntity();
    const selectionRect = this.getSelectionRect();

    const linkIsSelected = (
      !selectionIsCollapsed &&
      currentEntity &&
      currentEntity.type === 'LINK'
    );

    const attachmentIsSelected = (
      !selectionIsCollapsed &&
      currentEntity &&
      currentEntity.type === 'ATTACHMENT'
    );

    if (linkIsSelected) {
      return this.setState({
        toolbarStyle: this.getToolbarStyle(selectionRect, this.linkEditor),
        toolbar: 'linkEditor'
      });
    }

    if (attachmentIsSelected) {
      return this.setState({
        toolbarStyle: this.getToolbarStyle(selectionRect, this.attachmentEditor),
        toolbar: 'attachmentEditor'
      });
    }

    const { editorState, toolbarStyle } = this.state;
    const currentBlock = getSelectedBlock(editorState);
    const currentBlockType = currentBlock.getType();

    if (selectionRect.width > 0 && !selectionIsCollapsed && currentBlockType !== 'atomic') {
      return this.setState({
        toolbarStyle: this.getToolbarStyle(selectionRect, this.toolbar),
        toolbar
      });
    }

    if (selectionIsCollapsed && toolbarStyle.visibility === 'visible') {
      this.setState({
        toolbarStyle: {
          visibility: 'hidden'
        },
        toolbar: null
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
    console.log('HANDLE DROP');
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
    const { editorState } = this.state;

    const currentEntityKey = getSelectionEntity(editorState);

    this.replaceEntityData(currentEntityKey, data);
  }

  setLinkData = data => {
    const { editorState } = this.state;

    const currentEntityKey = getSelectionEntity(editorState);
    this.replaceEntityData(currentEntityKey, data, false);
  }

  replaceEntityData = (key, data, rerender = true) => {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.replaceEntityData(key, data);
    const editorStateWithEntity = EditorState.push(
      editorState,
      contentStateWithEntity,
      'apply-entity'
    );

    if (!rerender) {
      return this.onChange(editorStateWithEntity);
    }

    /* This is currently needed to trigger re-render */
    const editorStateWithForcedSelection = EditorState.forceSelection(
      editorStateWithEntity,
      editorStateWithEntity.getSelection()
    );

    this.onChange(editorStateWithForcedSelection);
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
    const currentSelection = editorState.getSelection();
    const editorStateWithLink = RichUtils.toggleLink(
      editorState,
      currentSelection,
      key
    );

    const editorStateWithForcedSelection = EditorState.forceSelection(
      editorStateWithLink,
      currentSelection
    );

    this.onChange(editorStateWithForcedSelection);
  }

  removeLink = () => {
    const { editorState } = this.state;
    const currentSelection = editorState.getSelection();

    const editorStateWithoutLink = RichUtils.toggleLink(
      editorState,
      currentSelection,
      null
    );

    const collapsedSelection = collapseSelectionToTheEnd(editorStateWithoutLink);

    const editorStateWithForcedSelection = EditorState.forceSelection(
      editorStateWithoutLink,
      collapsedSelection
    );

    if (!currentSelection.isCollapsed()) {
      return this.onChange(editorStateWithForcedSelection);
    }
  }

  removeCurrentEntity = () => {
    const { editorState } = this.state;
    const currentSelection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    const contentStateWithoutEntity = Modifier.applyEntity(
      contentState,
      currentSelection,
      null
    );

    const editorStateWithoutEntity = EditorState.push(
      editorState,
      contentStateWithoutEntity,
      'apply-entity'
    );


    const collapsedSelection = collapseSelectionToTheEnd(editorStateWithoutEntity);

    const editorStateWithForcedSelection = EditorState.forceSelection(
      editorStateWithoutEntity,
      collapsedSelection
    );

    if (!currentSelection.isCollapsed()) {
      return this.onChange(editorStateWithForcedSelection);
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

      this.onChange(stateWithAtomicBlock);
    }
  }

  saveSelection = () => {
    const { editorState } = this.state;
    const selectionState = editorState.getSelection();
    this.savedSelection = selectionState;
    const collapsedSelection = collapseSelectionToTheEnd(editorState);

    const editorStateWithForcedSelection = EditorState.forceSelection(
      editorState,
      collapsedSelection
    );
  }

  insertAttachment = (editorState, selectionState, data) => {

    const contentState = editorState.getCurrentContent();

    const contentStateWithEntity =
      contentState.createEntity('ATTACHMENT', 'MUTABLE', data);


    // const selectionState = editorState.getSelection();

    const key = contentStateWithEntity.getLastCreatedEntityKey();

    const contentStateWithText = Modifier.applyEntity(
      contentState,
      selectionState,
      key
    );

    const editorStateWithEntity = EditorState.push(
      editorState,
      contentStateWithText,
      'apply-entity'
    );

    const editorStateWithForcedSelection = EditorState.forceSelection(
      editorStateWithEntity,
      editorState.getSelection()
    );

    // const collapsedSelection = collapseSelectionToTheEnd(editorStateWithEntity);
    //
    // const editorStateWithForcedSelection = EditorState.forceSelection(
    //   editorStateWithEntity,
    //   collapsedSelection
    // );

    this.onChange(editorStateWithForcedSelection);
    return key;
  }


  addPhoto = () => {
    this.addMedia('PHOTO', { src: '' })()
  }

  addYoutube = () => {
    this.addMedia('YOUTUBE', { src: '' })()
  }

  addInstagram = () => {
    this.addMedia('INSTAGRAM', { src: '' })()
  }

  addTable= () => {
    this.addMedia('TABLE', { content: 'a  b\nc  d' })()
  }

  addHTML= () => {
    this.addMedia('HTML', { content: 'Вставьте <strong>HTML</strong> код' })()
  }


  addAttachment = () => {
    // const file = files[0];
    // if (!file) return;
    const { editorState } = this.state;
    const selectionState = editorState.getSelection();

    const entityKey = this.insertAttachment(
      editorState,
      selectionState,
      {
        href: '',
        // filename: file.name
      }
    );
    //

  }

  uploadImageForKey = (entityKey, files) => {
    const { editorState } = this.state;

    const file = files[0];
    this.waitingForUpload = true;

    if (!/^image/.test(file.type)) {
      return alert("Недопустимый формат файла");
    }

    const data = new FormData();
    data.append('file', file);
    data.append('courtesy', 'TEST');

    fetchWithProgress(this.props.uploadURL, {
      headers: {
        'Accept': 'application/json'
      },
      method: "POST",
      body: data,
      credentials: 'same-origin'
    }, (e) => {
      if (e.lengthComputable) {
        const percentage = Math.round(e.loaded / e.total * 100);
        this.replaceEntityData(entityKey, {
          src: '',
          filename: file.name,
          size: file.size,
          progress: percentage
        });
        // console.log("add upload event-listener" + evt.loaded + "/" + evt.total);
      }
    })
    .then(res => {
      console.log('PHOTO UPLOADED', res);
      return this.replaceEntityData(entityKey, {
        src: res.file.normal,
        filename: file.name,
        size: file.size,
        uploaded: true,
      });
    }, err => console.log(err))
  }

  uploadAttachmentForKey = (entityKey, files) => {
    const { editorState } = this.state;

    const file = files[0];
    this.waitingForUpload = true;

    const data = new FormData();
    data.append('file', file);
    data.append('courtesy', 'TEST');

    fetchWithProgress('/api/documents/upload', {
      headers: {
        'Accept': 'application/json'
      },
      method: "POST",
      body: data,
      credentials: 'same-origin'
    }, (e) => {
      if (e.lengthComputable) {
        const percentage = Math.round(e.loaded / e.total * 100);
        this.replaceEntityData(entityKey, {
          href: '',
          filename: file.name,
          size: file.size,
          progress: percentage
        });
        // console.log("add upload event-listener" + evt.loaded + "/" + evt.total);
      }
    })
    .then(res => {
      console.log('DOCUMENT UPLOADED', res);
      return this.replaceEntityData(entityKey, {
        href: res.file,
        filename: file.name,
        size: file.size,
        uploaded: true,
      });
    }, err => console.log(err))
  }

  uploadAttachment = (files) => {
    const { editorState } = this.state;
    const entityKey = getSelectionEntity(editorState);
    this.uploadAttachmentForKey(entityKey, files);
  }

  collapseSelection = () => {
    const { editorState } = this.state;
    const selectionState = collapseSelectionToTheEnd(editorState);
    const editorStateWithCollapsedSelection =
    EditorState.forceSelection(editorState, selectionState);
    this.onChange(editorStateWithCollapsedSelection);
  }

  toggleAddMenu = e => {
    this.setState({ showAddMenu: true });
  }

  Toolbar = () => {
    const { toolbarStyle, toolbar } = this.state;
    const mainToolbarStyle = toolbar === 'toolbar' ? toolbarStyle : {
      visibility: 'hidden'
    };
    return (
      <div ref={n => this.toolbar = n}
        className="z99 absolute pa1 shadow-4 white bg-black white br2 z-index-3"
        style={mainToolbarStyle}>
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
          active={this.selectionHasInlineStyle('SMALL')}
          onClick={this.toggleStyle('SMALL')}>
          sm
        </Button>
        <Button
          className=""
          onClick={this.addLink}>
          <i className="fa fa-link"/>
        </Button>
        <Button
          className=""
          onClick={this.addAttachment}
          >
          <i className="fa fa-paperclip"/>
        </Button>
      </div>
    );
  }


  render() {
    const { toolbarStyle, toolbar } = this.state;
    const linkEditorStyle = toolbar === 'linkEditor' ? toolbarStyle : {
      visibility: 'hidden'
    };
    const attachmentEditorStyle = toolbar === 'attachmentEditor' ? toolbarStyle : {
      visibility: 'hidden'
    };

    const currentEntityData = this.getCurrentEntity() && this.getCurrentEntity().getData();

    return (
      <div className="Editor">
        <this.Toolbar />
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
            customStyleMap={styleMap}
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
          addTable={this.addTable}
          />
        <LinkEditor
          DOMNodeRef={n => this.linkEditor = n}
          addLink={this.addLink}
          removeLink={this.removeLink}
          data={currentEntityData}
          style={linkEditorStyle}
          onChange={this.setLinkData}
          onClose={this.collapseSelection}
          />
        <AttachmentEditor
          DOMNodeRef={n => this.attachmentEditor = n}
          onRemove={this.removeCurrentEntity}
          data={currentEntityData}
          style={attachmentEditorStyle}
          onUpload={this.uploadAttachment}
          onChange={this.setEntityData}
          onClose={this.collapseSelection}
          attachments={this.props.attachments}
          />
      </div>
    );
  }
}


export default RichEditor;



function File({ filename, href, onDelete = () => {} }) {
  return (
    <div className="bg-light-gray dib pa2 ma2">
      <a href={href}>{ filename }</a>
      <div>
        <a href="" onClick={onDelete}>Delete</a>
      </div>
    </div>
  );
}
