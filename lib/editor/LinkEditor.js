'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Button = require('./Button');

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import ReactDOM from 'react-dom';

var LinkEditor = function (_Component) {
  _inherits(LinkEditor, _Component);

  function LinkEditor() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, LinkEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = LinkEditor.__proto__ || Object.getPrototypeOf(LinkEditor)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      href: _this.props.data.href || '',
      blank: _this.props.data.target === '__blank'
    }, _this.setHref = function (e) {
      var href = e.target.value;

      _this.setState({ href: href }, function () {
        _this.props.onChange({
          href: href,
          target: _this.state.blank ? '__blank' : undefined
        });
      });
    }, _this.setBlank = function (e) {
      var blank = e.target.checked;

      _this.setState({ blank: blank }, function () {
        _this.props.onChange({
          href: _this.state.href,
          target: _this.state.blank ? '__blank' : undefined
        });
      });
    }, _this.close = function (e) {
      if (e.key === 'Enter') {
        _this.props.onClose();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(LinkEditor, [{
    key: 'componentWillReceiveProps',


    /* This is neccessary while we switchbetween links, since editor is actually
     * always mounted
     */
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.data.href && nextProps.data.href !== this.state.href) {
        this.setState({ href: nextProps.data.href });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          ref: this.props.DOMNodeRef,
          className: 'absolute pa1 dt bg-black white shadow-4 white br2 z-index-3',
          style: this.props.style },
        _react2.default.createElement(
          'div',
          { className: 'dtc' },
          _react2.default.createElement('input', {
            className: 'input-reset f5 w5 h-100 br1 bw0 pa2 mr1 bg-near-white black ',
            tabIndex: 0,
            type: 'text',
            ref: this.props.inputDOMNodeRef,
            onKeyPress: this.close,
            value: this.state.href,
            onChange: this.setHref
          }),
          _react2.default.createElement(
            'div',
            { className: 'pa2 f6' },
            _react2.default.createElement('input', {
              type: 'checkbox',
              checked: this.state.blank,
              onChange: this.setBlank
            }),
            ' ',
            '\u0412 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E\u043C \u043E\u043A\u043D\u0435'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'dtc w2' },
          _react2.default.createElement(
            _Button2.default,
            {
              className: '',
              onClick: this.props.removeLink },
            _react2.default.createElement('i', { className: 'fa fa-close' })
          )
        )
      );
    }
  }]);

  return LinkEditor;
}(_react.Component);

LinkEditor.defaultProps = {
  data: {},
  onChange: function onChange() {},
  onClose: function onClose() {}
};
exports.default = LinkEditor;