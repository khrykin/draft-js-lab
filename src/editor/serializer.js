import React from 'react';
// import Instagram from 'react-instagram-embed';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { Entity } from 'draft-js';

import {
  CSVToHTML,
  HTMLToCSV
} from './TableEditor';

function toHTML(editorState) {
  return convertToHTML({
    styleToHTML(style) {
      if (style === 'BOLD') {
        return <strong />;
      }
    },
    blockToHTML(block) {
      if (block.type === 'atomic') {
        return <figure />;
      }
      if (block.type === 'code-block') {
        return <pre />;
      }
    },
    entityToHTML(entity, originalText) {
      if (entity.type === 'LINK') {
        return (
          <a
            href={entity.data.href}
            target={entity.data.target}>
            {originalText}
          </a>
        );
      }
      const { caption, src } = entity.data;
      const captionHTML = caption && caption.length ? `<figcaption>${caption}</figcaption>` : '';

      if (entity.type === 'PHOTO') {
        return (
          `<img src="${src}"/>` +
          captionHTML
        )
     }
     if (entity.type === 'YOUTUBE') {
        return (
          `<iframe src="${src}" frameborder="0" allowfullscreen></iframe>` +
          captionHTML
        );
     }

     if (entity.type === 'INSTAGRAM') {
        return (
          `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="7" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:28.194444444444443% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAMUExURczMzPf399fX1+bm5mzY9AMAAADiSURBVDjLvZXbEsMgCES5/P8/t9FuRVCRmU73JWlzosgSIIZURCjo/ad+EQJJB4Hv8BFt+IDpQoCx1wjOSBFhh2XssxEIYn3ulI/6MNReE07UIWJEv8UEOWDS88LY97kqyTliJKKtuYBbruAyVh5wOHiXmpi5we58Ek028czwyuQdLKPG1Bkb4NnM+VeAnfHqn1k4+GPT6uGQcvu2h2OVuIf/gWUFyy8OWEpdyZSa3aVCqpVoVvzZZ2VTnn2wU8qzVjDDetO90GSy9mVLqtgYSy231MxrY6I2gGqjrTY0L8fxCxfCBbhWrsYYAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/BMWm4GPjxEV/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">Старт Ночного кубка SKI-O🏃 Спасибо всем кто пришёл:) Ждём вас 5 и 6 ноября в Сарочанах, будет интересно 😀 #старт #ночь #ориентирование #Ориента #skio #orientaskio</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">Публикация от Максим Капитонов (@orientaskio) <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2016-11-03T15:35:58+00:00">Ноя 3 2016 в 8:35 PDT</time></p></div></blockquote> <script async defer src="//platform.instagram.com/en_US/embeds.js"></script>`
          + captionHTML
        );
     }

     if (entity.type === 'TABLE') {
        return CSVToHTML(entity.data.content) + captionHTML;
     }

     return originalText;
    }
  })(editorState.getCurrentContent());
}

function fromHTML(html) {
  /* Remove newlines and indentation */
  html = html.replace(/\n\s*/g, '');
  return convertFromHTML({
    htmlToStyle(nodeName, node, currentStyle) {
      // if (nodeName === 'strong') {
      //   return currentStyle.add('BOLD');
      // } else {
        return currentStyle;
      // }
    },
    htmlToEntity(nodeName, node) {
      if (nodeName === 'a') {
        return Entity.create(
          'LINK',
          'MUTABLE',
          {
            href: node.href,
            target: node.target
          }
        )
      }

      if (nodeName === 'figure') {
        const mediaEl = node.children[0];
        const src = mediaEl.getAttribute('src');
        const caption = node.children[1] && node.children[1].innerText;

        if (mediaEl instanceof HTMLTableElement) {
          return Entity.create(
            'TABLE',
            'IMMUTABLE',
            { content: HTMLToCSV(`<table>${node.innerHTML}</table>`), caption }
          )
        }

        let type = 'PHOTO';
        if (mediaEl instanceof HTMLImageElement) {
          type = 'PHOTO'
        } else if (mediaEl instanceof HTMLIFrameElement) {
          if (mediaEl.getAttribute('data-instgrm-payload-id')) {
            type = 'INSTAGRAM';
          } else {
            type = 'YOUTUBE';
          }
        }
        return Entity.create(
          type,
          'IMMUTABLE',
          { src, caption }
        )
      }
    },
    textToEntity(text) {
        const result = [];
        text.replace(/@(\w+)/g, (match, name, offset) => {
            const entityKey = Entity.create(
              'AT-MENTION',
              'IMMUTABLE',
              { name }
            );
            result.push({
              entity: entityKey,
              offset,
              length: match.length,
              result: match
            });
        });
        return result;
    },
    htmlToBlock(nodeName, node) {
      if (nodeName === 'blockquote') {
        return {
          type: 'blockquote',
          data: {}
        };
      }


      if (nodeName === 'figure') {
        return {
          type: 'atomic',
        };
      }

      if (nodeName === 'table') {
        return {
          type: 'atomic',
        };
      }

    }
  })(html);
}

export { toHTML as convertToHTML };
export { fromHTML as convertFromHTML };

export default {
  convertToHTML: toHTML,
  convertFromHTML: fromHTML
}
