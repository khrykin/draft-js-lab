import convertToHTML, { collectBreakpointsFromRanges, createReferenceGridFromBreakpoints } from '../convertToHTML';

import { convertFromRaw } from 'draft-js';

const raw = {
  "entityMap": {
    "0": {
      "type": "PHOTO",
      "mutability": "IMMUTABLE",
      "data": {
        "caption": "Caption",
        "src": "image.jpg"
      }
    },
    "1": {
      "type": "LINK",
      "mutability": "MUTABLE",
      "data": {
        "href": "http://www.ski-o.ru",
        "target": "__blank",
        "url": "http://www.ski-o.ru/"
      }
    }
  },
  "blocks": [
    {
      "key": "0",
      "text": "Hello",
      "type": "header-one",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "1",
      "text": "Hello there",
      "type": "header-one",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "2",
      "text": "Hello there 2",
      "type": "header-two",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
     "key": "34vmb",
     "text": " ",
     "type": "atomic",
     "depth": 0,
     "inlineStyleRanges": [],
     "entityRanges": [
       {
         "offset": 0,
         "length": 1,
         "key": 0
       }
     ],
     "data": {}
   },
   {
     "key": "5eu6r",
     "text": "Plain Text, Bold text, Italic text",
     "type": "unstyled",
     "depth": 0,
     "inlineStyleRanges": [
       {
         "offset": 12,
         "length": 9,
         "style": "BOLD"
       },
       {
         "offset": 17,
         "length": 17,
         "style": "ITALIC"
       },
       {
         "offset": 19,
         "length": 1,
         "style": "UNDERLINE"
       }
     ],
     "entityRanges": [],
     "data": {}
   },
   {
     "key": "83lse",
     "text": "Example link hello",
     "type": "unstyled",
     "depth": 0,
     "inlineStyleRanges": [],
     "entityRanges": [
       {
         "offset": 0,
         "length": 12,
         "key": 1
       }
     ],
     "data": {}
   }
  ]
};

describe('serializer', () => {
  describe('convertToHTML', () => {
    it('should convert test examples to html', () => {

      const editorState = convertFromRaw(raw);
      const html = convertToHTML(editorState);
      expect(html).toEqual(
        '<h1>Hello</h1>' +
        '<h1>Hello there</h1>' +
        '<h2>Hello there 2</h2>' +
        '<figure>' +
          '<img src="image.jpg"/>' +
          '<caption>Caption</caption>' +
        '</figure>'
      )
    })
  })

  describe('collectBreakpointsFromRanges', () => {
    it ('should collect breakpoints', () => {
      const ranges = [
        {
         "offset": 13,
         "length": 9,
         "style": "BOLD"
        },
        {
         "offset": 18,
         "length": 17,
         "style": "ITALIC"
        },
        {
         "offset": 20,
         "length": 1,
         "style": "UNDERLINE"
        }
      ];

      expect(collectBreakpointsFromRanges(ranges))
      .toEqual([ 13, 18, 20, 21, 22, 35 ]);
    });
  });


});
