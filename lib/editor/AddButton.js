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

var AddButton = function (_Component) {
  _inherits(AddButton, _Component);

  function AddButton() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AddButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AddButton.__proto__ || Object.getPrototypeOf(AddButton)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      show: false
    }, _this.toggleShow = function (e) {
      _this.setState({ show: !_this.state.show });
    }, _this.delegate = function () {
      var handler = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      return function (e) {
        e && e.preventDefault && e.preventDefault();
        _this.setState({ show: false });
        handler(e);
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AddButton, [{
    key: 'render',
    value: function render() {
      var show = this.state.show;

      return _react2.default.createElement(
        'div',
        {
          style: this.props.style,
          className: 'absolute z99 tc w2'
        },
        _react2.default.createElement(
          'div',
          {
            onClick: this.toggleShow,
            ref: this.props.DOMNodeRef,
            className: 'ml1 pointer dib bg-white silver tc flex flex-column justify-center items-center w2 h2 ba br-100 animate-bg hover-bg-silver hover-white' },
          _react2.default.createElement('i', { className: 'fa fa-' + (show ? 'minus' : 'plus') })
        ),
        show && _react2.default.createElement(
          'div',
          { className: 'gray mt1' },
          _react2.default.createElement(
            'div',
            { className: '' },
            _react2.default.createElement(
              _Button2.default,
              {
                className: '',
                onClick: this.delegate(this.props.addPhoto) },
              _react2.default.createElement('i', { className: 'fa fa-picture-o' })
            )
          ),
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              _Button2.default,
              {
                className: '',
                onClick: this.delegate(this.props.addHTML) },
              _react2.default.createElement('i', { className: 'fa fa-code' })
            )
          ),
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              _Button2.default,
              {
                className: '',
                onClick: this.delegate(this.props.addTable) },
              _react2.default.createElement('i', { className: 'fa fa-table' })
            )
          ),
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              _Button2.default,
              {
                className: '',
                onClick: this.delegate(this.props.addYoutube) },
              _react2.default.createElement('i', { className: 'fa fa-film' })
            )
          ),
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              _Button2.default,
              {
                className: '',
                onClick: this.delegate(this.props.addInstagram) },
              _react2.default.createElement('i', { className: 'fa fa-instagram' })
            )
          )
        )
      );
    }
  }]);

  return AddButton;
}(_react.Component);

exports.default = AddButton;