import {
  Modifier,
  EditorState,
  SelectionState
} from 'draft-js';

/**
 * Removes an atomic block
 */

export function removeBlock(editorState, blockKey) {
 // const editorState = store.getEditorState();
 let content = editorState.getCurrentContent();

 const beforeKey = content.getKeyBefore(blockKey);
 const beforeBlock = content.getBlockForKey(beforeKey);

 // Note: if the focused block is the first block then it is reduced to an
 // unstyled block with no character
 if (beforeBlock === undefined) {
   const targetRange = new SelectionState({
     anchorKey: blockKey,
     anchorOffset: 0,
     focusKey: blockKey,
     focusOffset: 1,
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
   focusOffset: 1,
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
