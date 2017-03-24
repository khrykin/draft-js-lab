'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UploadButton = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = Button;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function Button(_ref) {
  var onClick = _ref.onClick,
      children = _ref.children,
      className = _ref.className,
      active = _ref.active;

  return _react2.default.createElement(
    'div',
    {
      className: 'pointer dib pa1 br1 ph2 ma1 ' + (active ? 'bg-white hover-bg-gray black' : 'bg-transparent hover-bg-gray hover-white') + ('' + (className ? ' ' + className : '')),
      onClick: onClick },
    children
  );
}

var UploadButton = exports.UploadButton = function (_Component) {
  _inherits(UploadButton, _Component);

  function UploadButton() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, UploadButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = UploadButton.__proto__ || Object.getPrototypeOf(UploadButton)).call.apply(_ref2, [this].concat(args))), _this), _this.delegateUpload = function (e) {
      e.preventDefault();
      console.log('BUTTON CLICKED');
      _this.props.onClick();
      _this.fileInput.click();
    }, _this.onUpload = function (e) {
      console.log('UPLOAD CHECKED');
      var files = e.target.files;

      _this.props.onChange(files);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(UploadButton, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          children = _props.children,
          onClick = _props.onClick,
          props = _objectWithoutProperties(_props, ['children', 'onClick']);

      return _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          Button,
          _extends({}, props, {
            onClick: this.delegateUpload }),
          children
        ),
        _react2.default.createElement('input', {
          ref: function ref(n) {
            return _this2.fileInput = n;
          },
          type: 'file',
          name: props.name,
          onChange: this.onUpload,
          style: { display: 'none' }
        })
      );
    }
  }]);

  return UploadButton;
}(_react.Component);

UploadButton.defaultProps = {
  onChange: function onChange() {},
  onClick: function onClick() {}
};