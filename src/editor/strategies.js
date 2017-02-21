import { Entity } from 'draft-js';


function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const URL_REGEX = /(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
const HASHTAG_REGEX = /\#[A-Za-zА-Яа-я0-9]+/g;


/* --------------------------- Public methods ------------------------------- */


export function findEntities(type) {
  return (contentBlock, callback) => {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          Entity.get(entityKey).getType() === type
        );
      },
      callback
    );
  }
}

export function findURLs(contentBlock, callback) {
  findWithRegex(URL_REGEX, contentBlock, callback);
}

export function findHashTags(contentBlock, callback) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}
