// This AddRecipe class will be used to toggle the Add Recipe Form.

import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload'); // The Whole Form
  _successMessage = 'Recipe was successfully uploaded :)';

  _windowElement = document.querySelector('.add-recipe-window'); // The Form Window
  _overlayElement = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    // That's why we are adding here a constructor because we want the ShowWindow Handler to run on Page load
    // NOTE: When super() is called, it initializes the this context for the derived class. This means that this will refer to the instance of the derived class. Without calling super(), you cannot use 'this' in the constructor of the derived class, and it will result in a reference error.
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlayElement.classList.toggle('hidden');
    this._windowElement.classList.toggle('hidden');
  }

  // resetForm() {
  //   // Clear and re-render the form
  //   this._parentElement.innerHTML = '';
  //   this._parentElement.insertAdjacentHTML(
  //     'afterbegin',
  //     this._generateMarkup()
  //   );
  // }

  _addHandlerShowWindow() {
    // We want this function to be called when the Page loads to keep listening for the Add Recipe button, without Controller Component interfering
    this._parentElement.reset();
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlayElement.addEventListener(
      'click',
      this.toggleWindow.bind(this)
    );
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const formDataArray = [...new FormData(this)]; // This API was introduced in ES2019
      const data = Object.fromEntries(formDataArray);
      handler(data);
    });
  }

  _generateMarkup() {
    return `
      <form class="upload">
        <div class="upload__column">
            <h3 class="upload__heading">Recipe data</h3>
            <label>Title</label>
            <input value="" required name="title" type="text" />
            <label>URL</label>
            <input value="" required name="sourceUrl" type="text" />
            <label>Image URL</label>
            <input value="" required name="image" type="text" />
            <label>Publisher</label>
            <input value="" required name="publisher" type="text" />
            <label>Prep time</label>
            <input value="" required name="cookingTime" type="number" />
            <label>Servings</label>
            <input value="" required name="servings" type="number" />
          </div>
        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <input
            value=""
            type="text"
            required
            name="ingredient-1"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 2</label>
          <input
            value=""
            type="text"
            name="ingredient-2"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 3</label>
          <input
            value=""
            type="text"
            name="ingredient-3"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 4</label>
          <input
            type="text"
            name="ingredient-4"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 5</label>
          <input
            type="text"
            name="ingredient-5"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 6</label>
          <input
            type="text"
            name="ingredient-6"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
        </div>
        <button class="btn upload__btn">
          <svg>
            <use href="src/img/icons.svg#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
      </form>
    `;
  }
}

export default new AddRecipeView();
