'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _Media = require('./Media');

var _Media2 = _interopRequireDefault(_Media);

var _TableEditor = require('./TableEditor');

var _TableEditor2 = _interopRequireDefault(_TableEditor);

var _PlainTextEditor = require('./PlainTextEditor');

var _PlainTextEditor2 = _interopRequireDefault(_PlainTextEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getDataFromProps(props) {
  var key = props.block.getEntityAt(0);
  var contentState = props.contentState;

  var entity = contentState.getEntity(key);
  var data = entity.getData();
  return data;
}

var MediaBlockEditor = function (_Component) {
  _inherits(MediaBlockEditor, _Component);

  function MediaBlockEditor(props) {
    _classCallCheck(this, MediaBlockEditor);

    var _this = _possibleConstructorReturn(this, (MediaBlockEditor.__proto__ || Object.getPrototypeOf(MediaBlockEditor)).call(this, props));

    _this.handleClick = function (e) {
      if (!_this.DOMNode.contains(e.target)) {
        /* Click outside */
        if (_this.state.focused) {
          _this.looseFocus();
        }
      } else {
        /* Click inside */
        if (!_this.state.focused) {
          _this.setFocus();
        }
      }
    };

    _this.setFocus = function () {
      var editor = _this.props.blockProps.editor;

      editor.setState({ readOnly: true }, function () {
        _this.setState({ focused: true });
        // this.captionEditor.focus();
      });
    };

    _this.looseFocus = function () {
      var editor = _this.props.blockProps.editor;

      editor.setState({ readOnly: false }, function () {
        _this.setState({ focused: false, editCaption: false });
      });

      var key = _this.props.block.getEntityAt(0);
      editor.replaceEntityData(key, _this.state.data);
    };

    _this.handleCaptionKeyPress = function (e) {
      if (e.key === 'Enter') {
        _this.setState({ editCaption: false }, function () {
          _this.save();
        });
      }
    };

    _this.setInputField = function (name) {
      return function (e) {
        var value = e.target ? e.target.value : e;
        _this.setState({
          data: _extends({}, _this.state.data, _defineProperty({}, name, value))
        });
      };
    };

    _this.onMediaDataChange = function (state) {
      _this.setState({
        data: _extends({}, _this.state.data, state)
      });
    };

    _this.setField = function (name) {
      return function (value) {
        _this.setState(_defineProperty({}, name, value));
      };
    };

    _this.delete = function (e) {
      e.preventDefault();
      var editor = _this.props.blockProps.editor;

      editor.setState({ readOnly: false }, function () {
        var editorState = editor.state.editorState;

        var newEditorState = (0, _utils.removeBlock)(editorState, _this.props.block.key);
        editor.onChange(newEditorState);
      });
    };

    _this.editCaption = function (e) {
      e && e.preventDefault();
      // const { editor } = this.props.blockProps;
      _this.setState({ editCaption: true });
      // console.log('EDIT');
      // this.setState({ focused: true, editCaption: true }, () => {
      //   editor.setState({ readOnly: true });
      // });
    };

    _this.save = function (e) {
      e && e.preventDefault();
      _this.looseFocus();
    };

    _this.uploadImageForKey = function (key) {
      return function (files) {
        var editor = _this.props.blockProps.editor;

        editor.uploadImageForKey(key, files);
      };
    };

    _this.state = {
      data: getDataFromProps(props),
      focused: false,
      editCaption: false
    };
    return _this;
  }

  _createClass(MediaBlockEditor, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.state.editCaption && !nextProps.focused) {
        this.setState({ editCaption: false });
      }

      var nextData = getDataFromProps(nextProps);

      if (nextData && nextData !== this.state.data) {
        this.setState({ data: nextData });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('click', this.handleClick);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('click', this.handleClick);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var key = this.props.block.getEntityAt(0);
      var contentState = this.props.contentState;

      var entity = contentState.getEntity(key);
      var type = entity.getType();

      var editor = this.props.blockProps.editor;


      return _react2.default.createElement(
        'div',
        {
          className: 'relative',
          draggable: !this.state.focused,
          ref: function ref(n) {
            return _this2.DOMNode = n;
          },
          onDragStart: this.props.blockProps.onDragStart,
          onDragEnd: this.props.blockProps.onDragEnd,
          style: {} /*this.state.focused ? { border: '2px solid blue' } : {}*/
        },
        _react2.default.createElement(
          'a',
          {
            href: '',
            className: 'absolute right--1 top--1 link dim blue',
            onClick: this.delete },
          _react2.default.createElement('i', { className: 'fa fa-close' })
        ),
        _react2.default.createElement(_Media2.default, {
          type: type,
          data: this.state.data,
          focused: this.state.focused,
          onChange: this.onMediaDataChange,
          onFocus: this.blockEditor,
          onUpload: this.uploadImageForKey(key),
          onBlur: this.save }),
        _react2.default.createElement(
          'figcaption',
          null,
          _react2.default.createElement(_PlainTextEditor2.default, {
            type: 'text',
            value: getDataFromProps(this.props).caption,
            placeholder: '\u041F\u043E\u0434\u043F\u0438\u0441\u044C...',
            onKeyPress: this.handleCaptionKeyPress,
            onChange: this.setInputField('caption'),
            onBlockParentEditor: this.setFocus
          })
        )
      );
    }
  }]);

  return MediaBlockEditor;
}(_react.Component);

exports.default = MediaBlockEditor;