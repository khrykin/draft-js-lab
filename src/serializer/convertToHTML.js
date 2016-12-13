import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { convertToRaw } from 'draft-js';
import filter from 'lodash/filter';
import sortedUniq from 'lodash/sortedUniq';

function defaultBlockMapFn(block, entityMap) {
  switch (block.type) {
    case 'header-one':
      return props => <h1>{props.children}</h1>;
    case 'header-two':
      return props => <h2>{props.children}</h2>;
    case 'atomic':
      const entity = entityMap[block.entityRanges[0].key];
      const { caption, src } = entity.data;
      return props => {
        return (
          <figure>
            <img src={src} />
            <div>{caption}</div>
          </figure>
        );
      }
    default:
      return props => <p>{props.children}</p>
  }
}

function defaultStyleMapFn(style, entityMap) {

}

function defaultStyleMapFn(style, entityMap) {
  switch (style) {
    case 'BOLD':
        return props => <b>{props.children}</b>
      break;
    case 'ITALIC':
        return props => <i>{props.children}</i>
      break;
    case 'UNDERLINE':
        return props => <span style={{ textDecoration: 'underline' }}>{props.children}</span>
      break;
    default:
      return props => <span>{ props.children }</span>;
  }
}

export function collectBreakpointsFromRanges(ranges) {
  let breakpoints = [];
  ranges.map(({ offset, length }) => {
    breakpoints.push(offset);
    breakpoints.push(offset + length)
  });
  return sortedUniq(breakpoints.sort());
}

export function createReferenceGridFromBreakpoints(breakpoints) {
  let grid = [];

  for (let i = 0; i < breakpoints.length - 1; i++) {
    const start = breakpoints[i];
    const end = breakpoints[i + 1];
    grid.push({ start, end });
  }

  return grid;
}

function getStylesForRange(styleRanges, range) {
  let presentStyles = [];

  for (let i = 0; i < styleRanges.length; i++) {
    const styleRange = styleRanges[i];
    const { offset, length, style } = styleRange;

    const present =
      range.start >= offset &&
      range.end <= offset + length
    ;

    if (present) {
      presentStyles.push(style);
    }
  }

  return presentStyles;
}

function applyStyles(styles, string, key, styleMapFn) {
  let out = string;
  styles.map((style, i) => {
    const Component = styleMapFn(style);
    out = <Component key={key} children={out} />
  });
  return out;
}

function processInlineStyleRanges(text, inlineStyleRanges, styleMapFn) {

  const breakpoints = collectBreakpointsFromRanges(inlineStyleRanges);
  const breakpointsRanges = createReferenceGridFromBreakpoints(breakpoints);

  console.log('breakpoints', breakpoints);


  const unstyledOffset = text.substring(0, breakpoints[0]);
  const unstyledTail = text.substring(breakpoints[breakpoints.length - 1], text.length);


  let out = unstyledOffset.length ? [ unstyledOffset ] : [];

  console.log('unstyledOffset', unstyledOffset);
  console.log('unstyledTail', unstyledTail);

  let currentStyle = null;

  let currentChildren = '';

  let currentStart = 0;

  breakpointsRanges.map((range, i) => {
    const presentStyles = getStylesForRange(inlineStyleRanges, range);

    console.log(`breakpoint range [${range.start}, ${range.end}]`);
    if (!presentStyles.length) return;

    console.log('currentStyle', currentStyle);
    console.log('presentStyles[0]', presentStyles[0]);

    const currentStyleEnded = currentStyle !== presentStyles[0];

    // if (currentStyleEnded) {
      const Component = styleMapFn(presentStyles[0]);
      const substring = text.substring(range.start, range.end);
      const styledFragment = applyStyles(presentStyles, substring, i, styleMapFn);
      out.push(styledFragment);
    // }

    currentStyle = presentStyles[0];
    currentStart = range.start;

    console.log('presentStyles', presentStyles);
  });

  //
  // inlineStyleRanges.map((range, i) => {
  //   const Component = styleMapFn(range.style);
  //   const substring = text.substr(range.offset, range.length);
  //
  //   let children = substring;
  //
  //   // const innerStyleRanges = filter(inlineStyleRanges, rng => {
  //   //   if (rng === range) return;
  //   //   const { offset, length } = rng;
  //   //
  //   //   const hasEntireStyleRange =
  //   //     offset >= range.offset &&
  //   //     offset <= range.offset + range.length &&
  //   //     offset + length <= range.offset + range.length
  //   //     ;
  //   //
  //   //   const hasStartOfStyleRange =
  //   //     offset >= range.offset &&
  //   //     offset <= range.offset + range.length &&
  //   //     offset + length > range.offset + range.length
  //   //     ;
  //   //
  //   //   const hasEndOfStyleRange =
  //   //     offset < range.offset &&
  //   //     offset + length > range.offset &&
  //   //     offset + length < range.offset + range.length
  //   //     ;
  //   //
  //   //   const hasMiddleOfStyleRange =
  //   //     offset < range.offset &&
  //   //     offset + length > range.offset + length
  //   //     ;
  //   //
  //   //   return hasEntireStyleRange || hasStartOfStyleRange || hasEndOfStyleRange || hasMiddleOfStyleRange;
  //   // });
  //   //
  //   // if (innerStyleRanges.length) {
  //   //   console.log('style ' + range.style + ' has inner ranges', innerStyleRanges)
  //   // }
  //
  //   const styledFragment = <Component key={i} children={children} />;
  //   out.push(styledFragment);
  // });
  if (unstyledTail.length) out.push(unstyledTail);
  return out;
}

export default function convertToHTML(
  editorState,
  blockMapFn = defaultBlockMapFn,
  styleMapFn = defaultStyleMapFn
) {
  const raw = convertToRaw(editorState);
  const { entityMap, blocks } = raw;
  let out = '';

  blocks.map(block => {
    const { text, inlineStyleRanges, entityRanges, type } = block;
    if (!text || !text.length) return;

    const Component = blockMapFn(block, entityMap);

    /* TODO process inlineStyleRanges */
    /* TODO process entityRanges */

    let children = block.text;

    if (inlineStyleRanges.length) {
      children = processInlineStyleRanges(children, inlineStyleRanges, styleMapFn);
    }

    out += renderToStaticMarkup(<Component {...block} children={children} />);
  });

  return out;
};
