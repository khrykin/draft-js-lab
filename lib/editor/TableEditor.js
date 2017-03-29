'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.CSVToHTML = CSVToHTML;
exports.HTMLToCSV = HTMLToCSV;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CodeEditor = require('./CodeEditor');

var _CodeEditor2 = _interopRequireDefault(_CodeEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TableEditor = function (_Component) {
  _inherits(TableEditor, _Component);

  function TableEditor() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TableEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TableEditor.__proto__ || Object.getPrototypeOf(TableEditor)).call.apply(_ref, [this].concat(args))), _this), _this.toggleIsEditing = function (e) {
      e && e.preventDefault();
      _this.setState({ isEditing: true });
    }, _this.state = {
      isEditing: false
    }, _this.change = function (value) {
      // const { value } = e.target;
      _this.props.onChange(_extends({}, _this.props.data, {
        content: value
      }));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TableEditor, [{
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
        null,
        isEditing ? _react2.default.createElement(_CodeEditor2.default, {
          value: data.content,
          onChange: this.change }) : _react2.default.createElement(
          'span',
          null,
          _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: CSVToHTML(data.content) } })
        ),
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

  return TableEditor;
}(_react.Component);

TableEditor.defaultProps = {
  onChange: function onChange() {}
};
exports.default = TableEditor;


var DELIMETER = /( {2,}|\t)/g;

function CSVToHTML(csv) {
  var delimeter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DELIMETER;

  var rows = csv.split('\n');
  for (var i = 0; i < rows.length; i++) {
    var tag = i > 0 ? 'td' : 'th';
    rows[i] = '<tr><' + tag + '>' + rows[i].replace(delimeter, '</' + tag + '><' + tag + '>') + ('</' + tag + '></tr>');
  }

  var out = '<table>' + rows.join('') + '</table>';
  return out;
}

function HTMLToCSV(html) {
  var delimeter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '\t';

  var out = html;
  var parent = document.createElement('TABLE');
  parent.innerHTML = html;
  var rows = [].concat(_toConsumableArray(parent.children[0].children));

  for (var i = 0; i < rows.length; i++) {
    var cols = [];
    for (var j = 0; j < rows[i].children.length; j++) {
      cols.push(rows[i].children[j].innerHTML);
    }
    rows[i] = cols.join(delimeter);
  }

  return rows.join('\n');
}