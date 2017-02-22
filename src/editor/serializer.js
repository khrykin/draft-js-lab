import React from 'react';
// import Instagram from 'react-instagram-embed';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { Entity } from 'draft-js';


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
          captionHTML
        );
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

    }
  })(html);
}

export { toHTML as convertToHTML };
export { fromHTML as convertFromHTML };

export default {
  convertToHTML: toHTML,
  convertFromHTML: fromHTML
}
