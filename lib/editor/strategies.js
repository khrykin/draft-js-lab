'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findEntities = findEntities;
exports.findURLs = findURLs;
exports.findHashTags = findHashTags;

var _draftJs = require('draft-js');

function findWithRegex(regex, contentBlock, callback) {
  var text = contentBlock.getText();
  var matchArr = [];
  var start = 0;
  // eslint-disable-next-line
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

var URL_REGEX = /(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
var HASHTAG_REGEX = /#[A-Za-zА-Яа-я0-9]+/g;

/* --------------------------- Public methods ------------------------------- */

function findEntities(type) {
  return function (contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(function (character) {
      var entityKey = character.getEntity();
      return entityKey !== null && contentState.getEntity(entityKey).getType() === type;
    }, callback);
  };
}

function findURLs(contentBlock, callback) {
  findWithRegex(URL_REGEX, contentBlock, callback);
}

function findHashTags(contentBlock, callback) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}