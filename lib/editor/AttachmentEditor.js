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

var AttachmentEditor = function (_Component) {
  _inherits(AttachmentEditor, _Component);

  function AttachmentEditor() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AttachmentEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AttachmentEditor.__proto__ || Object.getPrototypeOf(AttachmentEditor)).call.apply(_ref, [this].concat(args))), _this), _this.close = function (e) {
      if (e.key === 'Enter') {
        _this.props.onClose();
      }
    }, _this.attachLocalFile = function (file) {
      return function (e) {
        e.preventDefault();
        _this.props.onChange({
          href: file.href,
          filename: getFilenameFromURL(file.href)
        });
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AttachmentEditor, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.href && nextProps.href !== this.state.href) {
        this.setState({ href: nextProps.href });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          data = _props.data,
          attachments = _props.attachments;


      return _react2.default.createElement(
        'div',
        {
          ref: this.props.DOMNodeRef,
          className: 'absolute pa1 dt bg-black white shadow-4 white br2 z99',
          style: this.props.style },
        data.filename ? _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'div',
            { className: 'dib pa2' },
            _react2.default.createElement(
              'a',
              { className: 'white', target: '__blank', href: data.href },
              _react2.default.createElement(FileInfo, data)
            )
          ),
          _react2.default.createElement(
            _Button2.default,
            {
              onClick: this.props.onRemove },
            _react2.default.createElement('i', { className: 'fa fa-close' })
          )
        ) : _react2.default.createElement(
          'div',
          { className: 'dib' },
          attachments.length > 0 && _react2.default.createElement(
            'div',
            { className: 'pa2 bb b--white-20' },
            _react2.default.createElement(
              'div',
              { className: 'mb2' },
              _react2.default.createElement(
                'strong',
                { className: 'white ttu f6 mb2' },
                '\u0417\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E'
              )
            ),
            attachments.map(function (file) {
              return _react2.default.createElement(
                'a',
                { className: 'db pointer link dim pb1', key: file.id, onClick: _this2.attachLocalFile(file) },
                _react2.default.createElement(FileInfo, file)
              );
            })
          ),
          _react2.default.createElement(
            _Button.UploadButton,
            {
              onChange: this.props.onUpload },
            '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C'
          ),
          _react2.default.createElement(
            _Button2.default,
            {
              className: 'fr',
              onClick: this.props.onRemove },
            _react2.default.createElement('i', { className: 'fa fa-close' })
          )
        )
      );
    }
  }]);

  return AttachmentEditor;
}(_react.Component);

AttachmentEditor.defaultProps = {
  data: {},
  onChange: function onChange() {},
  onClose: function onClose() {},
  onUpload: function onUpload() {},
  onAttachLocalFile: function onAttachLocalFile() {}
};
exports.default = AttachmentEditor;


function getFilenameFromURL(url) {
  return url.split('/').pop().split('#')[0].split('?')[0];
}

function getExtensionFromURL(url) {
  var ext = url.split('/').pop().split('#')[0].split('?')[0].split('.')[1];
  return ext && ext.toLowerCase();
}

function FileIcon(_ref2) {
  var href = _ref2.href;

  var filename = getFilenameFromURL(href);
  var extension = getExtensionFromURL(href);

  var iconClassName = 'fa-file-o';
  switch (extension) {
    case 'pdf':
      iconClassName = 'fa-file-pdf-o';
      break;
    case 'jpg':
      iconClassName = 'fa-file-image-o';
      break;
    case 'jpeg':
      iconClassName = 'fa-file-image-o';
      break;
    case 'png':
      iconClassName = 'fa-file-image-o';
      break;
    case 'gif':
      iconClassName = 'fa-file-image-o';
      break;
    case 'doc':
      iconClassName = 'fa-file-word-o';
      break;
    case 'docx':
      iconClassName = 'fa-file-word-o';
      break;
    case 'xls':
      iconClassName = 'fa-file-excel-o';
      break;
    case 'xslx':
      iconClassName = 'fa-file-excel-o';
      break;
  }

  return _react2.default.createElement('i', { className: 'fa ' + iconClassName });
}

function FileInfo(_ref3) {
  var href = _ref3.href,
      size = _ref3.size;

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(FileIcon, { href: href }),
    ' ',
    getFilenameFromURL(href),
    ' ',
    _react2.default.createElement(
      'small',
      { className: 'light-gray' },
      size
    )
  );
}