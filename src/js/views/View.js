/**
 * @class View
 * @description This is the parent class for all view components in the application.
 * It contains common methods and properties shared across all views.
 * Each specific view extends this class to inherit these functionalities.
 *
 * @abstract
 * @property {Object} _data - The data to be rendered in the view. It is updated with each render call.
 * @property {HTMLElement} _parentElement - The DOM element where the rendered markup will be inserted. Must be defined in child classes.
 * @property {string} _errorMessage - Default error message. Can be overridden in child classes.
 * @property {string} _successMessage - Default success message. Can be overridden in child classes.
 * @author Youssef Gaafar
 */

import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  /**
   * Clears the inner HTML of the parent element.
   * @private
   * @description This method is used to clear the parent element before rendering new content.
   * @this {View} Refers to the instance of the `View` class or its child class calling this method.
   */
  _clearParent() {
    // Emptying the Parent element HTML content
    this._parentElement.innerHTML = '';
  }

  /**
   * Renders the provided data into the DOM.
   * @param {Object|Array} data - The data to render. Could be an object (e.g., recipe) or an array (e.g., search results).
   * @param {boolean} [render=true] - If false, returns the generated markup string instead of rendering it to the DOM.
   * @returns {undefined|string} Undefined if rendering to the DOM, or a string if `render` is false.
   * @description This method checks if the provided data exists. If not, it renders an error message.
   * Otherwise, it generates markup using the `_generateMarkup` method (defined in child classes) and inserts it into the DOM.
   * @this {View} Refers to the instance of the `View` class or its child class calling this method.
   */
  render(data, render = true) {
    // NOTE: the render boolean is set for checking if we want to render the markup or just return it as a string, this returned markup (when render is false), will be used in the previewView
    // Checks if the data exists (null or undefined) OR if it's an empty array.
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    // This method will render the provided recipe
    // NOTE: this._data will contain our recipe data, which is identical to model.state.recipe in the model component
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clearParent();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Updates the DOM with new data by only changing modified elements and attributes.
   * @param {Object|Array} data - The updated data to render.
   * @description This method compares the current DOM tied to `this._parentElement`
   * with new virtual DOM elements to optimize rendering.
   * @this {View} Refers to the instance of the `View` class or its child class calling this method.
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(); // Here we will generate a new markup with the updated set of attributes and we will compare this new markup to the old one and only change the texts and attributes that has been changed.

    const newDOM = document.createRange().createContextualFragment(newMarkup); // These two chained methods will convert the newMarkup string into a real DOM Node Object, so this newDOM will be like a virtual DOM of the real DOM that the page is using, but this newDOM lives in the memory.

    const newElements = Array.from(newDOM.querySelectorAll('*')); // Selecting all of the Elements of the newDOM
    const curElements = Array.from(this._parentElement.querySelectorAll('*')); // Selecting all of the Elements of the Parent Element

    // Comparing the newElements and the currentElements to update the currentElements attributes and text only
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // Using the isEqualNode method to compare between nodes.
      // We want to change only the Nodes that contain texts not the Entire Element, we will use a property in Nodes that is Node.nodeValue
      // Update Changed Texts (.firstChild)
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl);
        // console.log(newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Update Changed Attributes, we are replacing all of the attributes in the currentElement by the attributes of the newElement in case they aren't equal
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  /**
   * Renders a loading spinner in the parent element.
   * @description Displays a spinner icon to indicate loading status. Clears existing content in the parent element before rendering.
   * @this {View} Refers to the instance of the `View` class or its child class calling this method.
   */
  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
    this._clearParent();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Renders an error message in the parent element.
   * @param {string} [message=this._errorMessage] - The error message to display. Defaults to `_errorMessage`.
   * @description Displays an error message when something goes wrong. The message can be customized or overridden by child classes.
   */
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
        <div>
            <svg>
            <use href="${icons}#icon-alert-triangle"></use>
            </svg>
        </div>
        <p>${message}</p>
    </div>
    `;
    this._clearParent();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Renders a success message in the parent element.
   * @param {string} [message=this._successMessage] - The success message to display. Defaults to `_successMessage`.
   * @description Displays a success message, such as when a recipe is successfully saved or bookmarked.
   */
  renderSuccessMessage(message = this._successMessage) {
    const markup = `
    <div class="message">
        <div>
            <svg>
                <use href="${icons}#icon-smile"></use>
            </svg>
        </div>
        <p>${message}</p>
    </div>
    `;
    this._clearParent();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
