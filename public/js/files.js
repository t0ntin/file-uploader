

const overlayEl = document.querySelector('.overlay');
const uploadFormEl = document.querySelector('.upload-form');
const uploadButtonEl = document.querySelector('.upload-button');
const editFolderFormEl = document.querySelector('.edit-folder-form');
const hiddenInputInForm = document.querySelector('.hidden-input-in-edit-folder-form');
const editNameButtonEls = document.querySelectorAll('.edit-name-button');
const deleteFolderButtonEls = document.querySelectorAll('.delete-folder-button');
const deleteFolderFormEl = document.querySelector('.delete-folder-form');
const hiddenInput = document.querySelector('.hidden-input-root-folders');
const hiddenInputInDeleteForm = document.querySelector('.hidden-input-in-delete-folder-form');
const moveButtonEls = document.querySelectorAll('.move-button');
const moveFileFormEl = document.querySelector('.move-file-form');
const hiddenInputInMoveFileForm = document.querySelector('.hidden-input-in-move-file-form');

// EVENT LISTENER FOR UPLOADING FILE
uploadButtonEl.addEventListener('click', openUploadForm);

function openUploadForm() {
  uploadFormEl.classList.toggle('visible');
  overlayEl.classList.toggle('overlay-visible');

}

// EVENT LISTENER FOR EDIT ROOT FOLDER BUTTONS
  editNameButtonEls.forEach((button) => {
    button.addEventListener('click', openEditDialogueRF);
});

// THIS FUNCTION IS FOR EDITING ROOT FOLDERS
function openEditDialogueRF(e) {

  const button = e.target.closest('.edit-name-button');
  const folderId = button.parentElement.querySelector('.hidden-input-root-folders').value;
  // console.log(folderId);
  hiddenInputInForm.value = folderId;
  // console.log(hiddenInputInForm.value);
  editFolderFormEl.classList.toggle('visible');
  overlayEl.classList.toggle('overlay-visible');
}

// EVENT LISTENER FOR FOR ROOT FOLDER DELETE BUTTONS:
deleteFolderButtonEls.forEach((button) => {
  button.addEventListener('click', deleteRootFolder);
});

// DELETES ROOT FOLDERS
function deleteRootFolder(e) {
  const button = e.target.closest('.delete-folder-button');
  const folderId = button.parentElement.querySelector('.hidden-input-root-folders').value;
  hiddenInputInDeleteForm.value = folderId;
  console.log(hiddenInputInDeleteForm.value);
  console.log(deleteFolderFormEl);
  hiddenInputInDeleteForm.value = folderId;
  console.log(hiddenInputInDeleteForm.value);
  deleteFolderFormEl.classList.toggle('visible');
  overlayEl.classList.toggle('overlay-visible');
}
// ========== SUBFOLDERS START HERE =============

// EVENT LISTENER FOR EDITING SUBFOLDER BUTTONS

editNameButtonEls.forEach((button) => {
  button.addEventListener('click', openEditDialogueSF);
})

// THIS FUNCTION IS FOR EDITING SUBFOLDERS
function openEditDialogueSF(e) {
  const button = e.target.closest('.edit-name-button');
  const folderId = button.parentElement.querySelector('.hidden-input-sub-folders').value;
  console.log(folderId);
  hiddenInputInForm.value = folderId;
  editFolderFormEl.classList.toggle('visible');
  overlayEl.classList.toggle('overlay-visible');
}

deleteFolderButtonEls.forEach((button) => {
  button.addEventListener('click', deleteSubfolder);
})

function deleteSubfolder(e) {
  const button = e.target.closest('.delete-folder-button');
  const folderId = button.parentElement.querySelector('.hidden-input-sub-folders').value;
  hiddenInputInDeleteForm.value = folderId;
  console.log(hiddenInputInDeleteForm.value);
  console.log(deleteFolderFormEl);
  hiddenInputInDeleteForm.value = folderId;
  console.log(hiddenInputInDeleteForm.value);
  deleteFolderFormEl.classList.toggle('visible');
  overlayEl.classList.toggle('overlay-visible');
}

moveButtonEls.forEach((button) => {
  button.addEventListener('click', openMoveFileDialogue);
});

function openMoveFileDialogue(e) {
  const button = e.target.closest('.move-button');
  const fileId = button.parentElement.querySelector('.file-id').value
  hiddenInputInMoveFileForm.value = fileId;
  moveFileFormEl.classList.toggle('visible');
  overlayEl.classList.toggle('overlay-visible');


  
}

overlayEl.addEventListener('click', ()=> {
  // overlayEl.classList.toggle('overlay-visible');
  // editFolderFormEl.classList.toggle('visible');
  if (editFolderFormEl.classList.contains('visible')) {
  editFolderFormEl.classList.remove('visible');
  overlayEl.classList.remove('overlay-visible');
  }

  if (deleteFolderFormEl.classList.contains('visible')) {
    deleteFolderFormEl.classList.remove('visible');
    overlayEl.classList.remove('overlay-visible');
  }

  if (uploadFormEl.classList.contains('visible')) {
    uploadFormEl.classList.remove('visible');
    overlayEl.classList.remove('overlay-visible');
  }

  if (moveFileFormEl.classList.contains('visible')) {
    moveFileFormEl.classList.remove('visible');
    overlayEl.classList.remove('overlay-visible');
  }

});