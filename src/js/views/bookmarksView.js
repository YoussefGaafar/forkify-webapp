// This View will render the Bookmarked Recipes in the bookmarks element

import View from './View.js';
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list'); // Unordered List Element
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it :)`;
  _successMessage = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
