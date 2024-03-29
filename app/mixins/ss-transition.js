import { later } from '@ember/runloop';
import { isBlank, isPresent } from '@ember/utils';
import Mixin from '@ember/object/mixin';
import jQuery from 'jquery';

export default Mixin.create({
  transitionMode: null,
  transitionDuration: null,
  transitionScope: null,

  init() {
    this._super(...arguments);
    let transitionMode = this.get('transitionMode');
    if (isBlank(transitionMode)) {
      if (window.console != null && window.console.warn != null) {
        window.console.warn("transitionMode isn't specified. It should be a string (i.e. fade). Using default");
      }
    }
    let transitionDuration = this.get('transitionDuration');
    if (isBlank(transitionDuration)) {
      if (window.console != null && window.console.warn != null) {
        window.console.warn("transitionDuration isn't specified. It should be an integer for milliseconds (i.e. 500).Using default");
      }
    }
  },

  transitionIn() {
    if (this.isElementVisible() && !this.isAnimatingOut()) {
      return;
    }

    if (this.isAnimatingIn()) {
      return;
    }

    this._animateIn();
  },

  transitionOut() {
    if (this.isElementHidden()) {
      return;
    }

    if (this.isAnimatingOut()) {
      return;
    }

    this._animateOut();
  },

  isAnimatingIn() {
    let scope = this._scope();
    if (scope == null || scope.length === 0) {
      return false;
    }
    return scope.hasClass('visible') &&
           scope.hasClass('animating') &&
           scope.hasClass('in');
  },

  isAnimatingOut() {
    let scope = this._scope();
    if (scope == null || scope.length === 0) {
      return false;
    }
    return scope.hasClass('visible') &&
           scope.hasClass('animating') &&
           scope.hasClass('out');
  },

  isElementVisible() {
    let scope = this._scope();
    if (scope == null || scope.length === 0) {
      return false;
    }
    return scope.hasClass('visible') &&
           scope.hasClass('active');
  },

  isElementHidden() {
    let scope = this._scope();
    if (scope == null || scope.length === 0) {
      return false;
    }
    return scope.hasClass('hidden');
  },

  // private methods
  _scope() {
    let scope = this.get('transitionScope');
    if (isPresent(scope)) {
      if (this.element != null) {
        return jQuery(scope, this.element);
      }
      return jQuery(scope);
    }
    return jQuery(this.element);
  },

  _animateIn() {
    this._addBaseProperties();
    let scope = this._scope();
    if (scope == null || scope.length === 0) {
      return;
    }
    scope.removeClass('hidden out');
    let animationMode = this._animationMode();
    scope.addClass(`visible animating ${animationMode} in`);
    later(this, this._animatedIn, this._animationDuration());
  },

  _animatedIn() {
    if (this.get('isDestroyed') || this.get('isDestroying')) {
      return;
    }
    // Check we are still animating in
    if (this.isElementHidden()) {
      return;
    }
    if (this.isAnimatingOut()) {
      return;
    }

    if (!this.isAnimatingIn()) {
      return;
    }
    // We are still animating, switch to visible
    this._show();
  },

  _show() {
    let scope = this._scope();
    if (scope == null || scope.length === 0) {
      return;
    }
    let animationMode = this._animationMode();
    scope.addClass('visible active');
    scope.removeClass(`animating ${animationMode} in`);
    this.shown();
  },

  // Shown event
  shown() { },

  _animateOut() {
    this._addBaseProperties();
    let scope = this._scope();
    if (scope == null || scope.length === 0) {
      return;
    }
    scope.removeClass('in');
    let animationMode = this._animationMode();
    scope.addClass(`visible animating ${animationMode} out`);
    later(this, this._animatedOut, this._animationDuration());
  },

  _animatedOut() {
    if (this.get('isDestroyed') || this.get('isDestroying')) {
      return;
    }
    // Check we are still animating out
    if (this.isAnimatingIn()) {
      return;
    }

    if (!this.isAnimatingOut()) {
      return;
    }

    if (this.isElementHidden()) {
      return;
    }
    // We are still animating, switch to visible
    this._hide();
  },

  _hide() {
    let scope = this._scope();
    if (scope == null || scope.length === 0) {
      return;
    }
    let animationMode = this._animationMode();
    scope.addClass('hidden');
    scope.removeClass(`visible active animating ${animationMode} out`);
    this.hidden();
  },

  // Hidden event
  hidden() { },

  _addBaseProperties() {
    let scope = this._scope();
    if (scope == null || scope.length === 0) {
      return;
    }
    let animationDuration = this._animationDuration();
    let style = scope.prop('style');
    let formatted = `${animationDuration}ms`;
    if (isBlank(style.animationDuration) || style.animationDuration !== formatted) {
      scope.css('animation-duration', formatted);
    }

    scope.addClass('transition');
  },

  _animationDuration() {
    let animationDuration = this.get('transitionDuration');
    if (isBlank(animationDuration)) {
      return 500;
    }
    animationDuration = parseInt(animationDuration, 10);
    if (isNaN(animationDuration)) {
      return 500;
    }
    return animationDuration;
  },

  _animationMode() {
    let animationMode = this.get('transitionMode');
    if (isBlank(animationMode)) {
      return 'fade';
    }
    return animationMode;
  }

});
