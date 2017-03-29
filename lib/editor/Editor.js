'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _draftJs = require('draft-js');

var _draftjsUtils = require('draftjs-utils');

var _utils = require('./utils');

var _serializer = require('./serializer');

var _strategies = require('./strategies');

var _Media = require('./Media');

var _AtomicBlockEditor = require('./AtomicBlockEditor');

var _AtomicBlockEditor2 = _interopRequireDefault(_AtomicBlockEditor);

var _LinkEditor = require('./LinkEditor');

var _LinkEditor2 = _interopRequireDefault(_LinkEditor);

var _AttachmentEditor = require('./AttachmentEditor');

var _AttachmentEditor2 = _interopRequireDefault(_AttachmentEditor);

var _AddButton = require('./AddButton');

var _AddButton2 = _interopRequireDefault(_AddButton);

var _Button = require('./Button');

var _Button2 = _interopRequireDefault(_Button);

var _EntitiesWrappers = require('./EntitiesWrappers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* State manipulation imports */

/* Serialization imports */

/* Components imports */

// import Instagram from 'react-instagram-embed';

// import HTMLEditor from './HTMLEditor';


var TOOLBAR_BOTTOM_MARGIN = 15;
var TOOLBAR_SIDE_MARGIN = 15;

function _reloadScripts() {
  var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

  var scripts = container.getElementsByTagName('script');
  if (!scripts.length) return;
  for (var i in scripts) {
    var script = scripts[i];
    if (!script.getAttribute) continue;

    var newScript = document.createElement('script');
    newScript.textContent = script.textContent;

    var src = script.getAttribute('src');
    // if (!/\?/.test(src)) {
    //   src = src + `?${Math.random().toString(36).substr(2, 5)}`;
    // } else {
    //   src = src.replace(/(\?+)/, `?${Math.random().toString(36).substr(2, 5)}`);
    // }

    for (var ai in script.attributes) {
      var _script$attributes$ai = script.attributes[ai],
          name = _script$attributes$ai.name,
          value = _script$attributes$ai.value;

      if (typeof value === 'undefined') continue;
      newScript.setAttribute(name, value);
    }
    newScript.setAttribute('src', src);

    var head = document.getElementsByTagName('HEAD')[0];
    script.parentNode.appendChild(newScript);
    script.parentNode.removeChild(script);

    /* Special fix for instagram */
    /* NB! Doesn't work in IE
     * http://stackoverflow.com/questions/14644558/call-javascript-function-after-script-is-loaded
     */
    newScript.onload = function () {
      window.instgrm && window.instgrm.Embeds.process();
    };
  };
}

var blockRenderMap = (0, _immutable.Map)({
  // 'unstyled': {
  //   element: 'p'
  // }
});

var styleMap = {
  'SMALL': {
    fontSize: '80%'
  }
};

var extendedBlockRenderMap = _draftJs.DefaultDraftBlockRenderMap.merge(blockRenderMap);

//convertFromRaw(raw);

var RichEditor = function (_Component) {
  _inherits(RichEditor, _Component);

  _createClass(RichEditor, [{
    key: 'componentDidMount',

    //
    value: function componentDidMount() {
      require('draft-js/dist/Draft.css');
      require('../index.css');
      window.addEventListener('click', this.handleReadOnly);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('click', this.handleReadOnly);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.reloadScripts();
    }
  }, {
    key: 'reloadScripts',
    value: function reloadScripts() {
      _reloadScripts(this.editorWrapper);
    }
  }]);

  function RichEditor(props) {
    _classCallCheck(this, RichEditor);

    var _this = _possibleConstructorReturn(this, (RichEditor.__proto__ || Object.getPrototypeOf(RichEditor)).call(this, props));

    _this.createDecorator = function () {
      return new _draftJs.CompositeDecorator([{
        strategy: (0, _strategies.findEntities)('LINK'),
        component: _EntitiesWrappers.Link
      }, {
        strategy: (0, _strategies.findEntities)('ATTACHMENT'),
        component: _EntitiesWrappers.Attachment
      } //,
      // {
      //   strategy: findURLs,
      //   component: URLLink,
      // },
      // {
      //   strategy: findHashTags,
      //   component: HashTag
      // }
      ]);
    };

    _this.onChange = function (editorState) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      // const selectionRect = getVisibleSelectionRect(window) || {};
      _this.setState({ editorState: editorState }, function () {

        var currentBlock = (0, _draftjsUtils.getSelectedBlock)(_this.state.editorState);
        console.log('currentBlock', currentBlock.getType());

        _this.props.onChange((0, _serializer.convertToHTML)(_this.state.editorState));
        console.log("EDITOR_STATE", (0, _draftJs.convertToRaw)(_this.state.editorState.getCurrentContent()));
        _this.setAddButtonPosition();
        _this.setToolbarPosition();
        cb();
      });
    };

    _this.onTab = function (e) {
      var maxDepth = 4;
      _this.onChange(_draftJs.RichUtils.onTab(e, _this.state.editorState, maxDepth));
    };

    _this.blockRenderer = function (contentBlock) {
      var type = contentBlock.getType();
      if (type === 'atomic') {
        return {
          component: _AtomicBlockEditor2.default,
          editable: false,
          props: {
            editor: _this,
            onDragStart: function onDragStart() {
              console.log('onDragStart type', type);
              _this.editor.focus();
              _this.setState({
                isDragging: contentBlock,
                readOnly: false
              });
            },
            onDragEnd: function onDragEnd() {
              var key = contentBlock.getEntityAt(0);
              var entity = _this.state.editorState.getCurrentContent().getEntity(key);
              if (entity.getType() === 'PHOTO') return;
              console.log('DROPPED');
              _this.setState({
                readOnly: false
              });
              _this.handleDrop(_this.state.editorState.getSelection());
            }
          }
        };
      }
    };

    _this.getSelectedBlockElement = function () {
      var selection = window.getSelection();
      var node = selection.focusNode;
      if (node && !(node instanceof HTMLElement)) {
        node = node.parentNode;
      }
      return node;
    };

    _this.getCurrentEntity = function () {
      var editorState = _this.state.editorState;

      var currentEntityKey = (0, _draftjsUtils.getSelectionEntity)(editorState);

      if (!currentEntityKey) return;

      var currentContent = editorState.getCurrentContent();
      return currentContent.getEntity(currentEntityKey);
    };

    _this.getSelectionRect = function () {
      return (0, _draftJs.getVisibleSelectionRect)(window) || {};
    };

    _this.setAddButtonPosition = function () {
      var editorRect = _this.editorWrapper.getBoundingClientRect();
      var selectedDOMNode = _this.getSelectedBlockElement();
      var selectionRect = _this.getSelectionRect();

      if (!selectedDOMNode) return;

      var selectedDOMNodeRect = selectedDOMNode.getBoundingClientRect();
      var addButtonRect = _this.addButton.getBoundingClientRect();

      var left = editorRect.left - addButtonRect.width * 2
      // - selectedDOMNodeRect.width / 2
      ;

      if (left < TOOLBAR_SIDE_MARGIN) {
        left = TOOLBAR_SIDE_MARGIN;
      }

      var selectionTop = (0, _utils.getScrollTop)() + selectionRect.top;

      var blockBottom = selectedDOMNodeRect.top + (0, _utils.getScrollTop)() + selectedDOMNodeRect.height - _this.addButton.offsetHeight / 2;

      var top = selectionTop;

      if (!selectionTop) {
        top = blockBottom;
      }

      _this.setState({
        addButtonStyle: {
          top: top,
          left: left
        }
      });
    };

    _this.setToolbarPosition = function () {
      var toolbar = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'toolbar';

      var selectionIsCollapsed = _this.state.editorState.getSelection().isCollapsed();

      var currentEntity = _this.getCurrentEntity();
      var selectionRect = _this.getSelectionRect();

      var linkIsSelected = !selectionIsCollapsed && currentEntity && currentEntity.type === 'LINK';

      var attachmentIsSelected = !selectionIsCollapsed && currentEntity && currentEntity.type === 'ATTACHMENT';

      if (linkIsSelected) {
        return _this.setState({
          toolbarStyle: _this.getToolbarStyle(selectionRect, _this.linkEditor),
          toolbar: 'linkEditor'
        });
      }

      if (attachmentIsSelected) {
        return _this.setState({
          toolbarStyle: _this.getToolbarStyle(selectionRect, _this.attachmentEditor),
          toolbar: 'attachmentEditor'
        });
      }

      var _this$state = _this.state,
          editorState = _this$state.editorState,
          toolbarStyle = _this$state.toolbarStyle;

      var currentBlock = (0, _draftjsUtils.getSelectedBlock)(editorState);
      var currentBlockType = currentBlock.getType();

      if (selectionRect.width > 0 && !selectionIsCollapsed && currentBlockType !== 'atomic') {
        return _this.setState({
          toolbarStyle: _this.getToolbarStyle(selectionRect, _this.toolbar),
          toolbar: toolbar
        });
      }

      if (selectionIsCollapsed && toolbarStyle.visibility === 'visible') {
        _this.setState({
          toolbarStyle: {
            visibility: 'hidden'
          },
          toolbar: null
        });
      }
    };

    _this.selectionHasInlineStyle = function (style) {
      var editorState = _this.state.editorState;

      return (0, _draftjsUtils.getSelectionInlineStyle)(editorState)[style];
    };

    _this.selectionHasBlockType = function (type) {
      var editorState = _this.state.editorState;

      return (0, _draftjsUtils.getSelectedBlocksType)(editorState) === type;
    };

    _this.handleReturn = function (e) {
      var editorState = _this.state.editorState;

      var newState = (0, _draftjsUtils.handleNewLine)(editorState, e);
      if (newState) {
        _this.setState({ editorState: newState });
        return 'handled';
      }
      return 'not-handled';
    };

    _this.handleKeyCommand = function (command) {
      var editorState = _this.state.editorState;

      var newState = _draftJs.RichUtils.handleKeyCommand(editorState, command);

      if (newState) {
        _this.onChange(newState);
        return 'handled';
      }
      return 'not-handled';
    };

    _this.handleDrop = function (selection, dataTransfer, isInternal) {
      console.log('HANDLE DROP');
      var _this$state2 = _this.state,
          editorState = _this$state2.editorState,
          isDragging = _this$state2.isDragging;

      if (isDragging) {
        var newState = (0, _utils.moveAtomicBlock)(editorState, isDragging, selection, 'move-block');

        _this.onChange(newState);
        return 'handled';
      }

      return 'not-handled';
    };

    _this.setEntityData = function (data) {
      var editorState = _this.state.editorState;


      var currentEntityKey = (0, _draftjsUtils.getSelectionEntity)(editorState);

      _this.replaceEntityData(currentEntityKey, data);
    };

    _this.setLinkData = function (data) {
      var editorState = _this.state.editorState;


      var currentEntityKey = (0, _draftjsUtils.getSelectionEntity)(editorState);
      _this.replaceEntityData(currentEntityKey, data, false);
    };

    _this.replaceEntityData = function (key, data) {
      var rerender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var editorState = _this.state.editorState;

      var contentState = editorState.getCurrentContent();
      var contentStateWithEntity = contentState.replaceEntityData(key, data);
      var editorStateWithEntity = _draftJs.EditorState.push(editorState, contentStateWithEntity, 'apply-entity');

      if (!rerender) {
        return _this.onChange(editorStateWithEntity);
      }

      /* This is currently needed to trigger re-render */
      var editorStateWithForcedSelection = _draftJs.EditorState.forceSelection(editorStateWithEntity, editorStateWithEntity.getSelection());

      _this.onChange(editorStateWithForcedSelection);
    };

    _this.toggleBlockType = function (type) {
      return function () {
        var editorState = _this.state.editorState;

        _this.onChange(_draftJs.RichUtils.toggleBlockType(editorState, type), function () {
          return setTimeout(function () {
            return _this.editor.focus();
          }, 0);
        });
      };
    };

    _this.toggleStyle = function (style) {
      return function () {
        _this.onChange(_draftJs.RichUtils.toggleInlineStyle(_this.state.editorState, style), function () {
          return setTimeout(function () {
            return _this.editor.focus();
          }, 0);
        });
      };
    };

    _this.addLink = function () {
      var editorState = _this.state.editorState;

      var contentState = editorState.getCurrentContent();

      var contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
        href: 'http://'
      });

      var key = contentStateWithEntity.getLastCreatedEntityKey();
      var currentSelection = editorState.getSelection();
      var editorStateWithLink = _draftJs.RichUtils.toggleLink(editorState, currentSelection, key);

      var editorStateWithForcedSelection = _draftJs.EditorState.forceSelection(editorStateWithLink, currentSelection);

      _this.onChange(editorStateWithForcedSelection);
    };

    _this.removeLink = function () {
      var editorState = _this.state.editorState;

      var currentSelection = editorState.getSelection();

      var editorStateWithoutLink = _draftJs.RichUtils.toggleLink(editorState, currentSelection, null);

      var collapsedSelection = (0, _utils.collapseSelectionToTheEnd)(editorStateWithoutLink);

      var editorStateWithForcedSelection = _draftJs.EditorState.forceSelection(editorStateWithoutLink, collapsedSelection);

      if (!currentSelection.isCollapsed()) {
        return _this.onChange(editorStateWithForcedSelection);
      }
    };

    _this.removeCurrentEntity = function () {
      var editorState = _this.state.editorState;

      var currentSelection = editorState.getSelection();
      var contentState = editorState.getCurrentContent();

      var contentStateWithoutEntity = _draftJs.Modifier.applyEntity(contentState, currentSelection, null);

      var editorStateWithoutEntity = _draftJs.EditorState.push(editorState, contentStateWithoutEntity, 'apply-entity');

      var collapsedSelection = (0, _utils.collapseSelectionToTheEnd)(editorStateWithoutEntity);

      var editorStateWithForcedSelection = _draftJs.EditorState.forceSelection(editorStateWithoutEntity, collapsedSelection);

      if (!currentSelection.isCollapsed()) {
        return _this.onChange(editorStateWithForcedSelection);
      }
    };

    _this.addMedia = function (type, data) {
      return function () {
        var editorState = _this.state.editorState;

        var contentState = editorState.getCurrentContent();
        var contentStateWithEntity = contentState.createEntity(type, 'IMMUTABLE', data);

        var key = contentStateWithEntity.getLastCreatedEntityKey();

        var stateWithAtomicBlock = _draftJs.AtomicBlockUtils.insertAtomicBlock(editorState, key, ' ');

        _this.onChange(stateWithAtomicBlock);
      };
    };

    _this.saveSelection = function () {
      var editorState = _this.state.editorState;

      var selectionState = editorState.getSelection();
      _this.savedSelection = selectionState;
      var collapsedSelection = (0, _utils.collapseSelectionToTheEnd)(editorState);

      var editorStateWithForcedSelection = _draftJs.EditorState.forceSelection(editorState, collapsedSelection);
    };

    _this.insertAttachment = function (editorState, selectionState, data) {

      var contentState = editorState.getCurrentContent();

      var contentStateWithEntity = contentState.createEntity('ATTACHMENT', 'MUTABLE', data);

      // const selectionState = editorState.getSelection();

      var key = contentStateWithEntity.getLastCreatedEntityKey();

      var contentStateWithText = _draftJs.Modifier.applyEntity(contentState, selectionState, key);

      var editorStateWithEntity = _draftJs.EditorState.push(editorState, contentStateWithText, 'apply-entity');

      var editorStateWithForcedSelection = _draftJs.EditorState.forceSelection(editorStateWithEntity, editorState.getSelection());

      // const collapsedSelection = collapseSelectionToTheEnd(editorStateWithEntity);
      //
      // const editorStateWithForcedSelection = EditorState.forceSelection(
      //   editorStateWithEntity,
      //   collapsedSelection
      // );

      _this.onChange(editorStateWithForcedSelection);
      return key;
    };

    _this.addPhoto = function () {
      _this.addMedia('PHOTO', { src: '' })();
    };

    _this.addYoutube = function () {
      _this.addMedia('YOUTUBE', { src: '' })();
    };

    _this.addInstagram = function () {
      _this.addMedia('INSTAGRAM', { src: '' })();
    };

    _this.addTable = function () {
      _this.addMedia('TABLE', { content: 'a  b\nc  d' })();
    };

    _this.addHTML = function () {
      _this.addMedia('HTML', { content: 'Вставьте <strong>HTML</strong> код' })();
    };

    _this.addAttachment = function () {
      // const file = files[0];
      // if (!file) return;
      var editorState = _this.state.editorState;

      var selectionState = editorState.getSelection();

      var entityKey = _this.insertAttachment(editorState, selectionState, {
        href: ''
      });
      //
    };

    _this.uploadImageForKey = function (entityKey, files) {
      var editorState = _this.state.editorState;


      var file = files[0];
      _this.waitingForUpload = true;

      if (!/^image/.test(file.type)) {
        return alert("Недопустимый формат файла");
      }

      var percentage = 0;
      var self = _this;
      var ts = setTimeout(function progress() {

        self.replaceEntityData(entityKey, {
          src: '',
          filename: file.name,
          size: file.size,
          progress: percentage
        });

        if (percentage >= 100) {
          this.waitingForUpload = false;
          return self.replaceEntityData(entityKey, {
            src: 'http://ski-o.ru/docs/' + file.name,
            filename: file.name,
            size: file.size,
            progress: 100
          });
        }

        percentage += 10;
        ts = setTimeout(progress, 500);
      }, 500);
    };

    _this.uploadAttachmentForKey = function (entityKey, files) {
      var editorState = _this.state.editorState;


      _this.collapseSelection();
      _this.waitingForUpload = true;

      var file = files[0];

      var percentage = 0;
      var self = _this;
      var ts = setTimeout(function progress() {

        self.replaceEntityData(entityKey, {
          href: '',
          filename: file.name,
          size: file.size,
          progress: percentage
        });

        if (percentage >= 100) {
          this.waitingForUpload = false;
          return self.replaceEntityData(entityKey, {
            href: 'http://ski-o.ru/docs/' + file.name,
            filename: file.name,
            size: file.size,
            progress: 100
          });
        }

        percentage += 10;
        ts = setTimeout(progress, 500);
      }, 500);
    };

    _this.uploadAttachment = function (files) {
      var editorState = _this.state.editorState;

      var entityKey = (0, _draftjsUtils.getSelectionEntity)(editorState);
      _this.uploadAttachmentForKey(entityKey, files);
    };

    _this.collapseSelection = function () {
      var editorState = _this.state.editorState;

      var selectionState = (0, _utils.collapseSelectionToTheEnd)(editorState);
      var editorStateWithCollapsedSelection = _draftJs.EditorState.forceSelection(editorState, selectionState);
      _this.onChange(editorStateWithCollapsedSelection);
    };

    _this.toggleAddMenu = function (e) {
      _this.setState({ showAddMenu: true });
    };

    _this.Toolbar = function () {
      var _this$state3 = _this.state,
          toolbarStyle = _this$state3.toolbarStyle,
          toolbar = _this$state3.toolbar;

      var mainToolbarStyle = toolbar === 'toolbar' ? toolbarStyle : {
        visibility: 'hidden'
      };
      return _react2.default.createElement(
        'div',
        { ref: function ref(n) {
            return _this.toolbar = n;
          },
          className: 'z99 absolute pa1 shadow-4 white bg-black white br2 z-index-3',
          style: mainToolbarStyle },
        _react2.default.createElement(
          _Button2.default,
          {
            className: 'b serif',
            active: _this.selectionHasBlockType('header-two'),
            onClick: _this.toggleBlockType('header-two') },
          'H1'
        ),
        _react2.default.createElement(
          _Button2.default,
          {
            className: 'f6 serif',
            active: _this.selectionHasBlockType('header-three'),
            onClick: _this.toggleBlockType('header-three') },
          'H2'
        ),
        _react2.default.createElement(
          _Button2.default,
          {
            className: '',
            active: _this.selectionHasBlockType('unstyled'),
            onClick: _this.toggleBlockType('unstyled') },
          _react2.default.createElement('i', { className: 'fa fa-paragraph' })
        ),
        _react2.default.createElement(
          _Button2.default,
          {
            className: '',
            active: _this.selectionHasBlockType('unordered-list-item'),
            onClick: _this.toggleBlockType('unordered-list-item') },
          _react2.default.createElement('i', { className: 'fa fa-list-ul' })
        ),
        _react2.default.createElement(
          _Button2.default,
          {
            className: '',
            active: _this.selectionHasBlockType('ordered-list-item'),
            onClick: _this.toggleBlockType('ordered-list-item') },
          _react2.default.createElement('i', { className: 'fa fa-list-ol' })
        ),
        _react2.default.createElement(
          _Button2.default,
          {
            className: '',
            active: _this.selectionHasBlockType('blockquote'),
            onClick: _this.toggleBlockType('blockquote') },
          _react2.default.createElement('i', { className: 'fa fa-quote-left' })
        ),
        _react2.default.createElement(
          _Button2.default,
          {
            className: '',
            active: _this.selectionHasInlineStyle('BOLD'),
            onClick: _this.toggleStyle('BOLD') },
          _react2.default.createElement('i', { className: 'fa fa-bold' })
        ),
        _react2.default.createElement(
          _Button2.default,
          {
            className: '',
            active: _this.selectionHasInlineStyle('ITALIC'),
            onClick: _this.toggleStyle('ITALIC') },
          _react2.default.createElement('i', { className: 'fa fa-italic' })
        ),
        _react2.default.createElement(
          _Button2.default,
          {
            className: '',
            active: _this.selectionHasInlineStyle('UNDERLINE'),
            onClick: _this.toggleStyle('UNDERLINE') },
          _react2.default.createElement('i', { className: 'fa fa-underline' })
        ),
        _react2.default.createElement(
          _Button2.default,
          {
            className: '',
            active: _this.selectionHasInlineStyle('SMALL'),
            onClick: _this.toggleStyle('SMALL') },
          'sm'
        ),
        _react2.default.createElement(
          _Button2.default,
          {
            className: '',
            onClick: _this.addLink },
          _react2.default.createElement('i', { className: 'fa fa-link' })
        ),
        _react2.default.createElement(
          _Button2.default,
          {
            className: '',
            onClick: _this.addAttachment
          },
          _react2.default.createElement('i', { className: 'fa fa-paperclip' })
        )
      );
    };

    var decorator = _this.createDecorator();

    var intialContentState = (0, _serializer.convertFromHTML)(props.initialValue);

    _this.state = {
      editorState: _draftJs.EditorState.createWithContent(intialContentState, decorator),
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
      readOnly: false
    };
    return _this;
  }

  _createClass(RichEditor, [{
    key: 'getToolbarStyle',
    value: function getToolbarStyle(selectionRect, toolbar) {

      var left = selectionRect.left + selectionRect.width / 2 - toolbar.offsetWidth / 2;

      if (left < TOOLBAR_SIDE_MARGIN) {
        left = TOOLBAR_SIDE_MARGIN;
      }

      var scrollTop = (0, _utils.getScrollTop)();

      var top = selectionRect.top - toolbar.offsetHeight - TOOLBAR_BOTTOM_MARGIN + scrollTop;

      if (top < 2 * TOOLBAR_BOTTOM_MARGIN + scrollTop) {
        top = 2 * TOOLBAR_BOTTOM_MARGIN + scrollTop;
      }

      var toolbarStyle = this.state.toolbarStyle;


      return {
        left: left || toolbarStyle.left,
        top: top || toolbarStyle.top,
        visibility: 'visible'
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          toolbarStyle = _state.toolbarStyle,
          toolbar = _state.toolbar;

      var linkEditorStyle = toolbar === 'linkEditor' ? toolbarStyle : {
        visibility: 'hidden'
      };
      var attachmentEditorStyle = toolbar === 'attachmentEditor' ? toolbarStyle : {
        visibility: 'hidden'
      };

      var currentEntityData = this.getCurrentEntity() && this.getCurrentEntity().getData();

      return _react2.default.createElement(
        'div',
        { className: 'Editor' },
        _react2.default.createElement(this.Toolbar, null),
        _react2.default.createElement(
          'div',
          {
            ref: function ref(n) {
              return _this2.editorWrapper = n;
            },
            className: '' },
          _react2.default.createElement(_draftJs.Editor, {
            ref: function ref(n) {
              window.editor = n;_this2.editor = n;
            },
            placeholder: 'Tell a story',
            handleReturn: this.handleReturn,
            editorState: this.state.editorState,
            handleKeyCommand: this.handleKeyCommand,
            handleDrop: this.handleDrop,
            blockRendererFn: this.blockRenderer,
            blockRenderMap: extendedBlockRenderMap,
            customStyleMap: styleMap,
            readOnly: this.state.readOnly,
            onTab: this.onTab,
            onChange: this.onChange })
        ),
        _react2.default.createElement(_AddButton2.default, {
          DOMNodeRef: function DOMNodeRef(n) {
            return _this2.addButton = n;
          },
          style: this.state.addButtonStyle,
          addPhoto: this.addPhoto,
          addYoutube: this.addYoutube,
          addInstagram: this.addInstagram,
          addHTML: this.addHTML,
          addTable: this.addTable
        }),
        _react2.default.createElement(_LinkEditor2.default, {
          DOMNodeRef: function DOMNodeRef(n) {
            return _this2.linkEditor = n;
          },
          addLink: this.addLink,
          removeLink: this.removeLink,
          data: currentEntityData,
          style: linkEditorStyle,
          onChange: this.setLinkData,
          onClose: this.collapseSelection
        }),
        _react2.default.createElement(_AttachmentEditor2.default, {
          DOMNodeRef: function DOMNodeRef(n) {
            return _this2.attachmentEditor = n;
          },
          onRemove: this.removeCurrentEntity,
          data: currentEntityData,
          style: attachmentEditorStyle,
          onUpload: this.uploadAttachment,
          onChange: this.setEntityData,
          onClose: this.collapseSelection,
          attachments: this.props.attachments
        })
      );
    }
  }]);

  return RichEditor;
}(_react.Component);

RichEditor.defaultProps = {
  attachments: [],
  initalValue: ""
};
exports.default = RichEditor;


function File(_ref) {
  var filename = _ref.filename,
      href = _ref.href,
      _ref$onDelete = _ref.onDelete,
      onDelete = _ref$onDelete === undefined ? function () {} : _ref$onDelete;

  return _react2.default.createElement(
    'div',
    { className: 'bg-light-gray dib pa2 ma2' },
    _react2.default.createElement(
      'a',
      { href: href },
      filename
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'a',
        { href: '', onClick: onDelete },
        'Delete'
      )
    )
  );
}