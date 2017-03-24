'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./App.css');

var _Editor = require('./editor/Editor');

var _Editor2 = _interopRequireDefault(_Editor);

var _sampleMarkup = require('./editor/sampleMarkup');

var _sampleMarkup2 = _interopRequireDefault(_sampleMarkup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Component) {
  _inherits(App, _Component);

  function App() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, App);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = App.__proto__ || Object.getPrototypeOf(App)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      html: 'Hello',
      showHTML: false,
      attachments: [{
        href: 'http://ski-o.ru/docs/info_gelendzikvelo17.pdf',
        size: '16 kB',
        id: 1
      }, {
        href: 'http://ski-o.ru/docs/results2017.pdf',
        size: '100 kB',
        id: 2
      }]
    }, _this.change = function (html) {
      _this.setState({ html: html });
    }, _this.toggleHTML = function () {
      _this.setState({ showHTML: !_this.state.showHTML });
    }, _this.attach = function () {}, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {

      return _react2.default.createElement(
        'div',
        { className: 'pa4 dt w-100' },
        _react2.default.createElement(
          'div',
          { className: 'dtc w-50 pa2' },
          _react2.default.createElement(
            'h2',
            null,
            'Editor'
          ),
          _react2.default.createElement(_Editor2.default, {
            initialValue: _sampleMarkup2.default,
            onChange: this.change,
            uploads: this.state.uploads,
            onAttach: this.attach,
            attachments: this.state.attachments
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'dtc w-50 pa2' },
          _react2.default.createElement(
            'h2',
            null,
            'Output'
          ),
          _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: this.state.html } })
        )
      );
    }
  }]);

  return App;
}(_react.Component);

exports.default = App;