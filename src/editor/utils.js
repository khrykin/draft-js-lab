import {
  Modifier,
  EditorState,
  SelectionState
} from 'draft-js';

function invariant(cond, msg) {
  if (!cond) throw msg;
}

function moveBlockInContentState(
  contentState,
  blockToBeMoved,
  targetBlock,
  insertionMode
) {
  invariant(
    blockToBeMoved.getKey() !== targetBlock.getKey(),
    'Block cannot be moved next to itself.'
  );

  invariant(
    insertionMode !== 'replace',
    'Replacing blocks is not supported.'
  );

  const targetKey = targetBlock.getKey();
  const blockBefore = contentState.getBlockBefore(targetKey);
  const blockAfter = contentState.getBlockAfter(targetKey);

  const blockMap = contentState.getBlockMap();
  const blockMapWithoutBlockToBeMoved = blockMap.delete(blockToBeMoved.getKey());
  const blocksBefore = blockMapWithoutBlockToBeMoved.toSeq().takeUntil(v => v === targetBlock);
  const blocksAfter = blockMapWithoutBlockToBeMoved.toSeq().skipUntil(v => v === targetBlock).skip(1);

  let newBlocks;

  if (insertionMode === 'before') {
    invariant(
      (!blockBefore) || blockBefore.getKey() !== blockToBeMoved.getKey(),
      'Block cannot be moved next to itself.'
    );

    newBlocks = blocksBefore.concat(
      [[blockToBeMoved.getKey(), blockToBeMoved], [targetBlock.getKey(), targetBlock]],
      blocksAfter
    ).toOrderedMap();
  } else if (insertionMode === 'after') {
    invariant(
      (!blockAfter) || blockAfter.getKey() !== blockToBeMoved.getKey(),
      'Block cannot be moved next to itself.'
    );

    newBlocks = blocksBefore.concat(
      [[targetBlock.getKey(), targetBlock], [blockToBeMoved.getKey(), blockToBeMoved]],
      blocksAfter
    ).toOrderedMap();
  }

  return contentState.merge({
    blockMap: newBlocks,
    selectionBefore: contentState.getSelectionAfter(),
    selectionAfter: contentState.getSelectionAfter().merge({
      anchorKey: blockToBeMoved.getKey(),
      focusKey: blockToBeMoved.getKey(),
    }),
  });
}



export function moveAtomicBlock(
  editorState,
  atomicBlock,
  targetRange,
  insertionMode
) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  let withMovedAtomicBlock;

  if (insertionMode === 'before' || insertionMode === 'after') {
    const targetBlock = contentState.getBlockForKey(
      insertionMode === 'before' ?
        targetRange.getStartKey() :
        targetRange.getEndKey()
    );

    withMovedAtomicBlock = moveBlockInContentState(
      contentState,
      atomicBlock,
      targetBlock,
      insertionMode
    );
  } else {
    const afterRemoval = Modifier.removeRange(
      contentState,
      targetRange,
      'backward'
    );

    const selectionAfterRemoval = afterRemoval.getSelectionAfter();
    const targetBlock = afterRemoval.getBlockForKey(
      selectionAfterRemoval.getFocusKey()
    );

    if (selectionAfterRemoval.getStartOffset() === 0) {
      withMovedAtomicBlock = moveBlockInContentState(
        afterRemoval,
        atomicBlock,
        targetBlock,
        'before'
      );
    } else if (selectionAfterRemoval.getEndOffset() === targetBlock.getLength()) {
      withMovedAtomicBlock = moveBlockInContentState(
        afterRemoval,
        atomicBlock,
        targetBlock,
        'after'
      );
    } else {
      const afterSplit = Modifier.splitBlock(
        afterRemoval,
        selectionAfterRemoval
      );

      const selectionAfterSplit = afterSplit.getSelectionAfter();
      const targetBlock = afterSplit.getBlockForKey(
        selectionAfterSplit.getFocusKey()
      );

      withMovedAtomicBlock = moveBlockInContentState(
        afterSplit,
        atomicBlock,
        targetBlock,
        'before'
      );
    }
  }

  const newContent = withMovedAtomicBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: withMovedAtomicBlock.getSelectionAfter().set('hasFocus', true),
  });

  return EditorState.push(editorState, newContent, 'move-block');
}

/**
 * Removes an atomic block
 */

export function removeBlock(editorState, blockKey) {

 let content = editorState.getCurrentContent();

 const beforeKey = content.getKeyBefore(blockKey);
 const beforeBlock = content.getBlockForKey(beforeKey);
 const currentBlock = content.getBlockForKey(blockKey);

 // Note: if the focused block is the first block then it is reduced to an
 // unstyled block with no character
 if (beforeBlock === undefined) {
   const targetRange = new SelectionState({
     anchorKey: blockKey,
     anchorOffset: 0,
     focusKey: blockKey,
     focusOffset: currentBlock.getLength(),
   });
   // change the blocktype and remove the characterList entry with the sticker
   content = Modifier.removeRange(content, targetRange, 'backward');
   content = Modifier.setBlockType(
     content,
     targetRange,
     'unstyled'
   );

   const newState = EditorState.push(editorState, content, 'remove-block');

   // force to new selection
   const newSelection = new SelectionState({
     anchorKey: blockKey,
     anchorOffset: 0,
     focusKey: blockKey,
     focusOffset: 0,
   });
   return EditorState.forceSelection(newState, newSelection);
 }



 const targetRange = new SelectionState({
   anchorKey: beforeKey,
   anchorOffset: beforeBlock.getLength(),
   focusKey: blockKey,
   focusOffset: currentBlock.getLength(),
 });

 content = Modifier.removeRange(content, targetRange, 'backward');
 const newState = EditorState.push(editorState, content, 'remove-block');

 // force to new selection
 const newSelection = new SelectionState({
   anchorKey: beforeKey,
   anchorOffset: beforeBlock.getLength(),
   focusKey: beforeKey,
   focusOffset: beforeBlock.getLength(),
 });

 return EditorState.forceSelection(newState, newSelection);
}

/**
 * Collapses current selection to its end
 */

export function collapseSelectionToTheEnd(editorState) {
  const currentSelection = editorState.getSelection();
  const currentKey = currentSelection.getEndKey();
  const currentOffset = currentSelection.getEndOffset();

  const emptySelectionState = SelectionState.createEmpty(currentKey);
  const selectionState = emptySelectionState.merge({
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

export function getScrollTop(){
  if(typeof pageYOffset != 'undefined'){
    //most browsers except IE before #9
    return pageYOffset;
  }
  const B = document.body; //IE 'quirks'
  let D = document.documentElement; //IE with doctype
  D = D.clientHeight ? D: B;
  return D.scrollTop;
}
