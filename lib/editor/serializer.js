'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertFromHTML = exports.convertToHTML = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftConvert = require('draft-convert');

var _draftJs = require('draft-js');

var _TableEditor = require('./TableEditor');

var _Media = require('./Media');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Instagram from 'react-instagram-embed';
var mediaEls = [];

function isPlainHTMLNode(node) {
  var result = false;
  var testNode = node;
  while (testNode.parentElement) {
    if (testNode.parentElement.dataset && testNode.parentElement.dataset.skioHtml) {
      return result = true;
    }
    testNode = testNode.parentElement;
  }
  return result;
}

function preparePlainHTMLMediaEls(html) {
  var wrapper = document.createElement('DIV');

  wrapper.innerHTML = html;

  var mediaEls = wrapper.querySelectorAll('[data-skio-html]');
  for (var index in mediaEls) {
    var el = mediaEls[index];
    if (!el.dataset) continue;
    el.dataset.skioHtmlContent = el.innerHTML;
    el.innerHTML = "";
  }

  return wrapper.innerHTML;
}

function prepareTableMediaEls(html) {
  var wrapper = document.createElement('DIV');
  wrapper.innerHTML = html;

  var mediaEls = wrapper.getElementsByTagName('table');

  for (var index in mediaEls) {
    var el = mediaEls[index];
    if (!el.dataset) continue;
    el.dataset.skioTableContent = el.innerHTML;
    el.innerHTML = "";
  }

  return wrapper.innerHTML;
}

function prepareEmbedMediaEls(html) {
  var wrapper = document.createElement('DIV');
  wrapper.innerHTML = html;

  var mediaEls = wrapper.querySelectorAll('.Embed');

  for (var index in mediaEls) {
    var el = mediaEls[index];
    if (!el.parentNode) continue;
    var span = document.createElement('SPAN');
    console.log('el', el);
    span.innerHTML = el.innerHTML;
    span.className = "Embed";
    el.parentNode.insertBefore(span, el);
    el.parentNode.removeChild(el);
  }

  console.log('prepareEmbedMediaEls', wrapper.innerHTML);

  return wrapper.innerHTML;
}

function toHTML(editorState) {
  return (0, _draftConvert.convertToHTML)({
    styleToHTML: function styleToHTML(style) {
      if (style === 'BOLD') {
        return _react2.default.createElement('strong', null);
      }
      if (style === 'SMALL') {
        return _react2.default.createElement('small', null);
      }
    },
    blockToHTML: function blockToHTML(block) {
      if (block.type === 'atomic') {
        return _react2.default.createElement('figure', null);
      }
      if (block.type === 'code-block') {
        return _react2.default.createElement('pre', null);
      }
    },
    entityToHTML: function entityToHTML(entity, originalText) {
      if (entity.type === 'LINK') {
        return _react2.default.createElement(
          'a',
          {
            href: entity.data.href,
            target: entity.data.target },
          originalText
        );
      }

      if (entity.type === 'ATTACHMENT') {
        return _react2.default.createElement(
          'a',
          {
            'data-skio-attachment': true,
            'data-skio-attachment-size': entity.data.size,
            'data-skio-attachment-filename': entity.data.filename,
            target: '__blank',
            href: entity.data.href },
          originalText
        );
      }

      var _entity$data = entity.data,
          caption = _entity$data.caption,
          src = _entity$data.src;

      var captionHTML = caption && caption.length ? '<figcaption>' + caption + '</figcaption>' : '';

      if (entity.type === 'PHOTO') {
        return '<img src="' + src + '"/>' + captionHTML;
      }

      if (entity.type === 'YOUTUBE') {
        return '<div class="Embed"><iframe src="' + (0, _Media.getYoutubeEmbedSrc)(src) + '" frameborder="0" allowfullscreen></iframe></div>' + captionHTML;
      }

      if (entity.type === 'INSTAGRAM') {
        return '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="7" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:28.194444444444443% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAMUExURczMzPf399fX1+bm5mzY9AMAAADiSURBVDjLvZXbEsMgCES5/P8/t9FuRVCRmU73JWlzosgSIIZURCjo/ad+EQJJB4Hv8BFt+IDpQoCx1wjOSBFhh2XssxEIYn3ulI/6MNReE07UIWJEv8UEOWDS88LY97kqyTliJKKtuYBbruAyVh5wOHiXmpi5we58Ek028czwyuQdLKPG1Bkb4NnM+VeAnfHqn1k4+GPT6uGQcvu2h2OVuIf/gWUFyy8OWEpdyZSa3aVCqpVoVvzZZ2VTnn2wU8qzVjDDetO90GSy9mVLqtgYSy231MxrY6I2gGqjrTY0L8fxCxfCBbhWrsYYAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/BMWm4GPjxEV/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">\u0421\u0442\u0430\u0440\u0442 \u041D\u043E\u0447\u043D\u043E\u0433\u043E \u043A\u0443\u0431\u043A\u0430 SKI-O\uD83C\uDFC3 \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0432\u0441\u0435\u043C \u043A\u0442\u043E \u043F\u0440\u0438\u0448\u0451\u043B:) \u0416\u0434\u0451\u043C \u0432\u0430\u0441 5 \u0438 6 \u043D\u043E\u044F\u0431\u0440\u044F \u0432 \u0421\u0430\u0440\u043E\u0447\u0430\u043D\u0430\u0445, \u0431\u0443\u0434\u0435\u0442 \u0438\u043D\u0442\u0435\u0440\u0435\u0441\u043D\u043E \uD83D\uDE00 #\u0441\u0442\u0430\u0440\u0442 #\u043D\u043E\u0447\u044C #\u043E\u0440\u0438\u0435\u043D\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 #\u041E\u0440\u0438\u0435\u043D\u0442\u0430 #skio #orientaskio</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">\u041F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F \u043E\u0442 \u041C\u0430\u043A\u0441\u0438\u043C \u041A\u0430\u043F\u0438\u0442\u043E\u043D\u043E\u0432 (@orientaskio) <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2016-11-03T15:35:58+00:00">\u041D\u043E\u044F 3 2016 \u0432 8:35 PDT</time></p></div></blockquote> <script async defer src="//platform.instagram.com/en_US/embeds.js"></script>' + captionHTML;
      }

      if (entity.type === 'TABLE') {
        return (0, _TableEditor.CSVToHTML)(entity.data.content) + captionHTML;
      }

      if (entity.type === 'HTML') {
        return '<span contentEditable="false" data-skio-html="true">' + entity.data.content + '</span>' + captionHTML;
      }

      return '';
    }
  })(editorState.getCurrentContent());
}

function fromHTML(html) {
  /* Remove newlines and indentation */
  html = html.replace(/\n\s*/g, '');
  html = preparePlainHTMLMediaEls(html);
  html = prepareTableMediaEls(html);
  html = prepareEmbedMediaEls(html);

  return (0, _draftConvert.convertFromHTML)({
    htmlToStyle: function htmlToStyle(nodeName, node, currentStyle) {

      // const isPlainHTML= isPlainHTMLNode(node);
      //
      // if (isPlainHTML) return currentStyle.clear();

      if (nodeName === 'strong') {
        return currentStyle.add('BOLD');
      }
      if (nodeName === 'small') {
        return currentStyle.add('SMALL');
      }

      return currentStyle;
    },
    htmlToEntity: function htmlToEntity(nodeName, node) {

      // const isPlainHTML= isPlainHTMLNode(node);
      // if (isPlainHTML) {
      //   console.log('isPlainHTMLNode', node);
      //   console.log('isPlainHTML', isPlainHTML);
      // }

      // if (isPlainHTML) return null;

      if (nodeName === 'a') {

        if (node.dataset.skioAttachment) {
          return _draftJs.Entity.create('ATTACHMENT', 'MUTABLE', {
            href: node.getAttribute('href'),
            filename: node.dataset.skioAttachmentFilename,
            size: node.dataset.skioAttachmentSize
          });
        }

        return _draftJs.Entity.create('LINK', 'MUTABLE', {
          href: node.href,
          target: node.target
        });
      }

      if (nodeName === 'figure') {
        var mediaEl = node.children[0];
        var caption = node.children[1] && node.children[1].innerText;

        if (mediaEl instanceof HTMLTableElement) {
          return _draftJs.Entity.create('TABLE', 'IMMUTABLE', {
            content: (0, _TableEditor.HTMLToCSV)('<table>' + mediaEl.dataset.skioTableContent + '</table>'),
            caption: caption
          });
        }

        if (mediaEl instanceof HTMLImageElement) {
          var src = mediaEl.getAttribute('src');

          return _draftJs.Entity.create('PHOTO', 'IMMUTABLE', { src: src, caption: caption });
        }

        if (mediaEl instanceof HTMLSpanElement && mediaEl.classList.contains('Embed')) {
          console.log('mediaEl', mediaEl);

          // let type = 'EMBED';
          // if (mediaEl.getAttribute('data-instgrm-payload-id')) {
          //   type = 'INSTAGRAM';
          // } else {
          //   type = 'YOUTUBE';
          // }
          var _src = mediaEl.children[0].getAttribute('src');

          return _draftJs.Entity.create('YOUTUBE', 'IMMUTABLE', { src: _src, caption: caption });
        }

        if (mediaEl instanceof HTMLSpanElement && mediaEl.dataset && mediaEl.dataset.skioHtml && mediaEl.dataset.skioHtmlContent) {
          return _draftJs.Entity.create('HTML', 'IMMUTABLE', {
            content: mediaEl.dataset.skioHtmlContent,
            caption: caption
          });
        }

        return _draftJs.Entity.create("DUMB", "IMMUTABLE");
      }
    },

    // textToEntity(text) {
    // //   const result = [];
    // //   text.replace(/@(\w+)/g, (match, name, offset) => {
    // //       const entityKey = Entity.create(
    // //         'AT-MENTION',
    // //         'IMMUTABLE',
    // //         { name }
    // //       );
    // //       result.push({
    // //         entity: entityKey,
    // //         offset,
    // //         length: match.length,
    // //         result: match
    // //       });
    // //   });
    //   // return result;
    // },
    htmlToBlock: function htmlToBlock(nodeName, node) {

      // const isHTMLBlock =
      //   node.parentNode &&
      //   node.parentNode.dataset &&
      //   node.parentNode.dataset.skioHtml;
      //
      // if (isHTMLBlock) return {
      //   type: 'unstyled'
      // }

      // const isPlainHTML= isPlainHTMLNode(node);
      //
      // if (isPlainHTML) return null;

      if (nodeName === 'blockquote') {
        return {
          type: 'blockquote',
          data: {}
        };
      }

      if (nodeName === 'figure') {
        return {
          type: 'atomic'
        };
      }
    }
  })(html);
}

exports.convertToHTML = toHTML;
exports.convertFromHTML = fromHTML;
exports.default = {
  convertToHTML: toHTML,
  convertFromHTML: fromHTML
};