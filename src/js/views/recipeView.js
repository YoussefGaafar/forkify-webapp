// This is the View Class for loading the Recipe

import View from './View.js';
import icons from 'url:../../../assets/icons.svg';
import fracty from 'fracty';

class RecipeView extends View {
  // Protected Data Members
  _parentElement = document.querySelector('.recipe'); // recipeContainer
  _errorMessage = `We couldn't find that recipe. Please try another one!`;
  _successMessage = '';

  addHandlerRender(handler) {
    // addHandlerRender is the 'Publisher' because it emits or triggers an event by calling the handler passed to it.
    // Once one of these events occurs, it 'Publishes' the event by calling the provided handler function.
    // NOTE: We can wrap multiple event listeners FOR THE SAME callback fn using the below code
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }

  addHandlerUpdateServings(handler) {
    // Event Delegation
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--tiny'); // These are the increase/decrease servings button
      if (!btn) return; // Guard Clause
      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo); // Calls the handler only when the update servings is 1 or above
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // Event Delegation
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    return `
      <figure class="recipe__fig">
            <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
            <h1 class="recipe__title">
              <span>${this._data.title}</span>
            </h1>
          </figure>

          <div class="recipe__details">
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--minutes">${
                this._data.cookingTime
              }</span>
              <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--people">${
                this._data.servings
              }</span>
              <span class="recipe__info-text">servings</span>

              <div class="recipe__info-buttons">
                <button data-update-to="${
                  this._data.servings - 1
                }" class="btn--tiny btn--update-servings">
                  <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                  </svg>
                </button>
                <button data-update-to="${
                  this._data.servings + 1
                }" class="btn--tiny btn--update-servings">
                  <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                  </svg>
                </button>
              </div>
            </div>

            <div class="recipe__user-generated ${
              this._data.key ? '' : 'hidden'
            }">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
            <button class="btn--round btn--bookmark">
              <svg class="">
                <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
              </svg>
            </button>
          </div>

          <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
            ${this._data.ingredients
              .map(this._generateMarkupIngredient)
              .join('')}
          </div>

          <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
              This recipe was carefully designed and tested by
              <span class="recipe__publisher">${
                this._data.publisher
              }</span>. Please check out
              directions at their website.
            </p>
            <a
              class="btn--small recipe__btn"
              href="${this._data.sourceUrl}"
              target="_blank"
            >
              <span>Directions</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
            </a>
          </div>
    `;
  }

  _generateMarkupIngredient(ing) {
    return `
    <li class="recipe__ingredient">
        <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ing.quantity ? fracty(ing.quantity).toString() : ''
        }</div>
        <div class="recipe__description">
        <span class="recipe__unit">${ing.unit ?? ''}</span>
        ${ing.description ?? ''}
        </div>
    </li>
    `;
  }
}

// We are exporting a RecipeView instance (Object) to avoid exporting the whole class and instantiating it inside the controller class.
export default new RecipeView();
