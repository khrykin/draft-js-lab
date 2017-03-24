'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moveAtomicBlock = moveAtomicBlock;
exports.removeBlock = removeBlock;
exports.collapseSelectionToTheEnd = collapseSelectionToTheEnd;
exports.getScrollTop = getScrollTop;

var _draftJs = require('draft-js');

function invariant(cond, msg) {
  if (!cond) throw msg;
}

function moveBlockInContentState(contentState, blockToBeMoved, targetBlock, insertionMode) {
  invariant(blockToBeMoved.getKey() !== targetBlock.getKey(), 'Block cannot be moved next to itself.');

  invariant(insertionMode !== 'replace', 'Replacing blocks is not supported.');

  var targetKey = targetBlock.getKey();
  var blockBefore = contentState.getBlockBefore(targetKey);
  var blockAfter = contentState.getBlockAfter(targetKey);

  var blockMap = contentState.getBlockMap();
  var blockMapWithoutBlockToBeMoved = blockMap.delete(blockToBeMoved.getKey());
  var blocksBefore = blockMapWithoutBlockToBeMoved.toSeq().takeUntil(function (v) {
    return v === targetBlock;
  });
  var blocksAfter = blockMapWithoutBlockToBeMoved.toSeq().skipUntil(function (v) {
    return v === targetBlock;
  }).skip(1);

  var newBlocks = void 0;

  if (insertionMode === 'before') {
    invariant(!blockBefore || blockBefore.getKey() !== blockToBeMoved.getKey(), 'Block cannot be moved next to itself.');

    newBlocks = blocksBefore.concat([[blockToBeMoved.getKey(), blockToBeMoved], [targetBlock.getKey(), targetBlock]], blocksAfter).toOrderedMap();
  } else if (insertionMode === 'after') {
    invariant(!blockAfter || blockAfter.getKey() !== blockToBeMoved.getKey(), 'Block cannot be moved next to itself.');

    newBlocks = blocksBefore.concat([[targetBlock.getKey(), targetBlock], [blockToBeMoved.getKey(), blockToBeMoved]], blocksAfter).toOrderedMap();
  }

  return contentState.merge({
    blockMap: newBlocks,
    selectionBefore: contentState.getSelectionAfter(),
    selectionAfter: contentState.getSelectionAfter().merge({
      anchorKey: blockToBeMoved.getKey(),
      focusKey: blockToBeMoved.getKey()
    })
  });
}

function moveAtomicBlock(editorState, atomicBlock, targetRange, insertionMode) {
  var contentState = editorState.getCurrentContent();
  var selectionState = editorState.getSelection();

  var withMovedAtomicBlock = void 0;

  if (insertionMode === 'before' || insertionMode === 'after') {
    var targetBlock = contentState.getBlockForKey(insertionMode === 'before' ? targetRange.getStartKey() : targetRange.getEndKey());

    withMovedAtomicBlock = moveBlockInContentState(contentState, atomicBlock, targetBlock, insertionMode);
  } else {
    var afterRemoval = _draftJs.Modifier.removeRange(contentState, targetRange, 'backward');

    var selectionAfterRemoval = afterRemoval.getSelectionAfter();
    var _targetBlock = afterRemoval.getBlockForKey(selectionAfterRemoval.getFocusKey());

    if (selectionAfterRemoval.getStartOffset() === 0) {
      withMovedAtomicBlock = moveBlockInContentState(afterRemoval, atomicBlock, _targetBlock, 'before');
    } else if (selectionAfterRemoval.getEndOffset() === _targetBlock.getLength()) {
      withMovedAtomicBlock = moveBlockInContentState(afterRemoval, atomicBlock, _targetBlock, 'after');
    } else {
      var afterSplit = _draftJs.Modifier.splitBlock(afterRemoval, selectionAfterRemoval);

      var selectionAfterSplit = afterSplit.getSelectionAfter();
      var _targetBlock2 = afterSplit.getBlockForKey(selectionAfterSplit.getFocusKey());

      withMovedAtomicBlock = moveBlockInContentState(afterSplit, atomicBlock, _targetBlock2, 'before');
    }
  }

  var newContent = withMovedAtomicBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: withMovedAtomicBlock.getSelectionAfter().set('hasFocus', true)
  });

  return _draftJs.EditorState.push(editorState, newContent, 'move-block');
}

/**
 * Removes an atomic block
 */

function removeBlock(editorState, blockKey) {

  var content = editorState.getCurrentContent();

  var beforeKey = content.getKeyBefore(blockKey);
  var beforeBlock = content.getBlockForKey(beforeKey);
  var currentBlock = content.getBlockForKey(blockKey);

  // Note: if the focused block is the first block then it is reduced to an
  // unstyled block with no character
  if (beforeBlock === undefined) {
    var _targetRange = new _draftJs.SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: currentBlock.getLength()
    });
    // change the blocktype and remove the characterList entry with the sticker
    content = _draftJs.Modifier.removeRange(content, _targetRange, 'backward');
    content = _draftJs.Modifier.setBlockType(content, _targetRange, 'unstyled');

    var _newState = _draftJs.EditorState.push(editorState, content, 'remove-block');

    // force to new selection
    var _newSelection = new _draftJs.SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 0
    });
    return _draftJs.EditorState.forceSelection(_newState, _newSelection);
  }

  var targetRange = new _draftJs.SelectionState({
    anchorKey: beforeKey,
    anchorOffset: beforeBlock.getLength(),
    focusKey: blockKey,
    focusOffset: currentBlock.getLength()
  });

  content = _draftJs.Modifier.removeRange(content, targetRange, 'backward');
  var newState = _draftJs.EditorState.push(editorState, content, 'remove-block');

  // force to new selection
  var newSelection = new _draftJs.SelectionState({
    anchorKey: beforeKey,
    anchorOffset: beforeBlock.getLength(),
    focusKey: beforeKey,
    focusOffset: beforeBlock.getLength()
  });

  return _draftJs.EditorState.forceSelection(newState, newSelection);
}

/**
 * Collapses current selection to its end
 */

function collapseSelectionToTheEnd(editorState) {
  var currentSelection = editorState.getSelection();
  var currentKey = currentSelection.getEndKey();
  var currentOffset = currentSelection.getEndOffset();

  var emptySelectionState = _draftJs.SelectionState.createEmpty(currentKey);
  var selectionState = emptySelectionState.merge({
    anchorKey: currentKey,
    focusKey: currentKey,
    focusOffset: currentOffset,
    anchorOffset: currentOffset
  });

  return selectionState;
}

/**
 * Returns cross-browser scrollTop
 */

function getScrollTop() {
  if (typeof pageYOffset != 'undefined') {
    //most browsers except IE before #9
    return pageYOffset;
  }
  var B = document.body; //IE 'quirks'
  var D = document.documentElement; //IE with doctype
  D = D.clientHeight ? D : B;
  return D.scrollTop;
}