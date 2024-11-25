// This View will render the search results to the Sidebar

import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results'); // Unordered List Element
  _errorMessage = `No recipes found for your query! Please try again ☹️`;
  _successMessage = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
