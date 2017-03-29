'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LOADING_IMAGE = exports.DEFAULT_IMAGE = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getYoutubeEmbedSrc = getYoutubeEmbedSrc;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactInstagramEmbed = require('react-instagram-embed');

var _reactInstagramEmbed2 = _interopRequireDefault(_reactInstagramEmbed);

var _TableEditor = require('./TableEditor');

var _TableEditor2 = _interopRequireDefault(_TableEditor);

var _HTMLEditor = require('./HTMLEditor');

var _HTMLEditor2 = _interopRequireDefault(_HTMLEditor);

var _Button = require('./Button');

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function parseURL(url) {
  var parser = document.createElement('a');
  var params = {};
  // Let the browser do the work
  parser.href = url;
  // Convert query string to object
  var queries = parser.search.replace(/^\?/, '').split('&');
  for (var i = 0; i < queries.length; i++) {
    var split = queries[i].split('=');
    params[split[0]] = split[1];
  }

  return {
    protocol: parser.protocol,
    host: parser.host,
    hostname: parser.hostname,
    port: parser.port,
    pathname: parser.pathname,
    search: parser.search,
    params: params
  };
}

function getYoutubeEmbedSrc(url) {
  var _parseURL = parseURL(url),
      params = _parseURL.params,
      hostname = _parseURL.hostname;

  var v = params.v;


  if (hostname !== 'youtube.com' && hostname !== 'www.youtube.com' || !v) return url;
  return 'http://www.youtube.com/embed/' + v;
}

var Media = function (_Component) {
  _inherits(Media, _Component);

  function Media() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Media);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Media.__proto__ || Object.getPrototypeOf(Media)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Media, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          data = _props.data,
          type = _props.type,
          focused = _props.focused;


      if (type === 'HTML') {
        return _react2.default.createElement(_HTMLEditor2.default, {
          focused: focused,
          data: data,
          onChange: this.props.onChange
        });
      }

      if (type === 'TABLE') {
        return _react2.default.createElement(_TableEditor2.default, {
          focused: focused,
          data: data,
          onChange: this.props.onChange
        });
      }

      if (type === 'PHOTO') return _react2.default.createElement(
        MediaEditor,
        {
          focused: focused,
          data: data,
          upload: true,
          onUpload: this.props.onUpload,
          onChange: this.props.onChange },
        data.src ? _react2.default.createElement('img', { className: '', alt: data.src, src: data.src }) : _react2.default.createElement(
          EmptyMedia,
          null,
          _react2.default.createElement('i', { className: 'fa fa-photo' }),
          data.progress > 0 && _react2.default.createElement(
            'span',
            null,
            ' ',
            data.progress,
            ' %'
          )
        )
      );

      if (type === 'YOUTUBE') return _react2.default.createElement(
        MediaEditor,
        {
          focused: focused,
          data: data,
          onChange: this.props.onChange },
        data.src ? _react2.default.createElement(
          'div',
          { className: 'Embed' },
          _react2.default.createElement('iframe', {
            src: getYoutubeEmbedSrc(data.src),
            width: '400',
            height: '300',
            frameBorder: '0',
            allowFullScreen: true })
        ) : _react2.default.createElement(
          EmptyMedia,
          null,
          _react2.default.createElement('i', { className: 'fa fa-video-camera' })
        )
      );

      if (type === 'INSTAGRAM') return _react2.default.createElement(_reactInstagramEmbed2.default, {
        url: data.src
      });

      return _react2.default.createElement(
        'div',
        null,
        '*** Undefined Media Type *** '
      );
    }
  }]);

  return Media;
}(_react.Component);

Media.defaultProps = {
  onChange: function onChange() {},
  onBlur: function onBlur() {},
  onFocus: function onFocus() {},
  onUpload: function onUpload() {}
};
exports.default = Media;


function Toolbar(_ref2) {
  var children = _ref2.children;

  return _react2.default.createElement(
    'div',
    { className: 'pa2 child z99 bg-black-30 white absolute w-100 tl' },
    children
  );
}

function EmptyMedia(_ref3) {
  var children = _ref3.children;

  return _react2.default.createElement(
    'div',
    { className: 'dt bg-light-gray h5 w-100 tc mb1 br2' },
    _react2.default.createElement(
      'div',
      { className: 'dtc v-mid gray lh-copy f6' },
      children
    )
  );
}

var DEFAULT_IMAGE = exports.DEFAULT_IMAGE = 'image.jpg';
var LOADING_IMAGE = exports.LOADING_IMAGE = 'image2.jpg';

var MediaEditor = function (_Component2) {
  _inherits(MediaEditor, _Component2);

  function MediaEditor() {
    var _ref4;

    var _temp2, _this2, _ret2;

    _classCallCheck(this, MediaEditor);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_ref4 = MediaEditor.__proto__ || Object.getPrototypeOf(MediaEditor)).call.apply(_ref4, [this].concat(args))), _this2), _this2.handleKeyPress = function (e) {
      if (e.key === 'Enter') {
        _this2.setState({ showURL: false });
        // this.props.onBlur();
      }
    }, _this2.toggleShowURL = function (e) {
      e.preventDefault();
      _this2.setState({ showURL: !_this2.state.showURL });
    }, _this2.onFieldChange = function (name) {
      return function (e) {
        e.preventDefault();
        var value = e.target.value;

        _this2.props.onChange(_extends({}, _this2.props.data, _defineProperty({}, name, value)));
      };
    }, _this2.state = {
      showURL: false
    }, _temp2), _possibleConstructorReturn(_this2, _ret2);
  }

  _createClass(MediaEditor, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.state.showURL && !nextProps.focused) {
        this.setState({ showURL: false });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          data = _props2.data,
          upload = _props2.upload;

      return _react2.default.createElement(
        'div',
        { className: 'relative hide-child' },
        _react2.default.createElement(
          Toolbar,
          null,
          _react2.default.createElement(
            _Button2.default,
            {
              onClick: this.toggleShowURL },
            'URL'
          ),
          this.state.showURL && _react2.default.createElement('input', {
            type: 'text',
            value: data.src,
            onKeyPress: this.handleKeyPress,
            onChange: this.onFieldChange('src')
          }),
          upload && _react2.default.createElement(
            'span',
            null,
            _react2.default.createElement(
              _Button.UploadButton,
              {
                onChange: this.props.onUpload },
              '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C'
            )
          )
        ),
        this.props.children
      );
    }
  }]);

  return MediaEditor;
}(_react.Component);

// class TableEditor extends Component {
//   render() {
//     return (
//       <div>Table Editor</div>
//     );
//   }
// }


MediaEditor.defaultProps = {
  onUpload: function onUpload() {
    console.log('MediaEditor onUpload is undefined');
  }
};