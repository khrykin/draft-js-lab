'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CodeEditor = require('./CodeEditor');

var _CodeEditor2 = _interopRequireDefault(_CodeEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLEditor = function (_Component) {
  _inherits(HTMLEditor, _Component);

  function HTMLEditor() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, HTMLEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = HTMLEditor.__proto__ || Object.getPrototypeOf(HTMLEditor)).call.apply(_ref, [this].concat(args))), _this), _this.toggleIsEditing = function (e) {
      e && e.preventDefault();
      _this.setState({ isEditing: true });
    }, _this.state = {
      isEditing: false
    }, _this.change = function (value) {
      _this.props.onChange(_extends({}, _this.props.data, {
        content: value
      }));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(HTMLEditor, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.state.isEditing && !nextProps.focused) {
        this.setState({ isEditing: false });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var isEditing = this.state.isEditing;
      var data = this.props.data;

      return _react2.default.createElement(
        'div',
        { className: 'realtive' },
        isEditing ? _react2.default.createElement(_CodeEditor2.default, {
          value: data.content,
          onChange: this.change
        }) : _react2.default.createElement('span', { dangerouslySetInnerHTML: { __html: data.content } }),
        _react2.default.createElement(
          'div',
          { style: { display: isEditing ? 'none' : 'block' } },
          _react2.default.createElement(
            'a',
            { href: '', className: 'link dim gray',
              onClick: this.toggleIsEditing },
            _react2.default.createElement('i', { className: 'fa fa-pencil' })
          )
        )
      );
    }
  }]);

  return HTMLEditor;
}(_react.Component);

HTMLEditor.defaultProps = {
  onChange: function onChange() {}
};
exports.default = HTMLEditor;