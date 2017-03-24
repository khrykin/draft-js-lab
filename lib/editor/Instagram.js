'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var style = {
  "background": "rgb(255, 255, 255)",
  "border": "0px",
  "margin": "1px",
  "maxWidth": "658px",
  "width": "calc(100% - 2px)",
  "borderRadius": "4px",
  "boxShadow": "rgba(0, 0, 0, 0.498039) 0px 0px 1px 0px, rgba(0, 0, 0, 0.14902) 0px 1px 10px 0px",
  "display": "block",
  "padding": "0px",
  position: 'absolute'
};

var Instagram = function (_Component) {
  _inherits(Instagram, _Component);

  function Instagram() {
    _classCallCheck(this, Instagram);

    return _possibleConstructorReturn(this, (Instagram.__proto__ || Object.getPrototypeOf(Instagram)).apply(this, arguments));
  }

  _createClass(Instagram, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var src = this.props.src;

      return _react2.default.createElement('iframe', {
        ref: function ref(n) {
          return _this2.el = n;
        },
        className: 'instagram-media instagram-media-rendered',
        id: 'instagram-embed-0',
        src: src + '/embed/captioned/?v=7',
        allowTransparency: true,
        frameBorder: '0',
        height: '460',
        sandbox: 'allow-scripts',
        'data-instgrm': true,
        'data-instgrm-payload-id': 'instagram-media-payload-0',
        scrolling: 'no',
        style: style
      });
    }
  }]);

  return Instagram;
}(_react.Component);

Instagram.asString = function (src) {
  return (0, _server.renderToStaticMarkup)(_react2.default.createElement(Instagram, { src: src }));
};

exports.default = Instagram;