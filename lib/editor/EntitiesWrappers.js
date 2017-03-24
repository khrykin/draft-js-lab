'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HashTag = HashTag;
exports.Link = Link;
exports.URLLink = URLLink;
exports.Image = Image;
exports.Attachment = Attachment;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function HashTag(props) {
  var url = '/tags/' + props.decoratedText.replace(/^#/, '');
  return _react2.default.createElement(
    'a',
    { href: url },
    props.children
  );
};

function Link(props) {
  // const entity = Entity.get(props.entityKey);
  // const { href, target } = entity.getData();
  return _react2.default.createElement(
    'a',
    { href: "href", target: "target" },
    props.children
  );
};

function URLLink(props) {
  return _react2.default.createElement(
    'a',
    { href: props.decoratedText },
    props.children
  );
}

function Image(props) {
  // const entity = Entity.get(props.entityKey);
  // const { src } = entity.getData();
  return _react2.default.createElement('img', { alt: '{src}', src: "image.jpg" });
}

var fileInfoStyle = {
  position: 'absolute',
  right: 0,
  bottom: 0
};

var attachmentStyle = {
  position: 'relative'
};

function Attachment(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, ['children']);

  var entityKey = props.entityKey,
      contentState = props.contentState;

  var entity = contentState.getEntity(entityKey);
  var data = entity.getData();
  if (!data.href) {
    return _react2.default.createElement(
      'span',
      { className: 'Attachment-loading' },
      typeof data.progress !== 'undefined' && _react2.default.createElement(
        'strong',
        { className: 'Attachment-loading--info f6' },
        data.progress,
        ' %'
      ),
      _react2.default.createElement(
        'a',
        { className: data.progress ? "Attachment-loading-blinker" : '', href: '' },
        children
      )
    );
  }
  return _react2.default.createElement(
    'a',
    { href: '' },
    children
  );
}