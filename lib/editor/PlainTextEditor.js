'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlainTextEditor = function (_Component) {
  _inherits(PlainTextEditor, _Component);

  function PlainTextEditor(props) {
    _classCallCheck(this, PlainTextEditor);

    var _this = _possibleConstructorReturn(this, (PlainTextEditor.__proto__ || Object.getPrototypeOf(PlainTextEditor)).call(this, props));

    _this.change = function (editorState) {
      var contentState = editorState.getCurrentContent();
      var plainText = contentState.getPlainText();
      _this.props.onBlockParentEditor();
      // if (contentState !== this.state.editorState.getCurrentContent()) {
      console.log('plainText', plainText);
      _this.props.onChange(plainText);
      // }
      _this.setState({ editorState: editorState });
    };

    _this.createStateFromProps = function () {
      return _draftJs.EditorState.push(_this.state.editorState, _draftJs.ContentState.createFromText(_this.props.value));
    };

    _this.state = {
      editorState: _draftJs.EditorState.createWithContent(_draftJs.ContentState.createFromText(_this.props.value))
    };
    return _this;
  }

  _createClass(PlainTextEditor, [{
    key: 'render',
    value: function render() {
      var editorState = this.state.editorState;
      var _props = this.props,
          value = _props.value,
          onChange = _props.onChange,
          placeholder = _props.placeholder,
          readOnly = _props.readOnly;

      return _react2.default.createElement(
        'div',
        { className: 'PlainTextEditor' },
        _react2.default.createElement(_draftJs.Editor, {
          placeholder: placeholder,
          readOnly: readOnly,
          editorState: editorState,
          onChange: this.change
        })
      );
    }
  }]);

  return PlainTextEditor;
}(_react.Component);

PlainTextEditor.defaultProps = {
  onChange: function onChange() {},
  onBlockParentEditor: function onBlockParentEditor() {},

  value: ''
};
exports.default = PlainTextEditor;