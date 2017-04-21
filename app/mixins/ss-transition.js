import Ember from 'ember';

export default Ember.Mixin.create({
  transitionMode: null,
  transitionDuration: null,
  transitionScope: null,

  init() {
    this._super(...arguments);
    let transitionMode = this.get('transitionMode');
    if (Ember.isBlank(transitionMode)) {
      Ember.Logger.warn("transitionMode isn't specificed. It should be a string (i.e. fade). Using default");
    }
    let transitionDuration = this.get('transitionDuration');
    if (Ember.isBlank(transitionDuration)) {
      Ember.Logger.warn("transitionDuration isn't specificed. It should be an integer for milliseconds (i.e. 500).Using default");
    }
  },

  transitionIn() {
    if (this.isVisible() && !this.isAnimatingOut()) {
      return;
    }

    if (this.isAnimatingIn()) {
      return;
    }

    this._animateIn();
  },

  transitionOut() {
    if (this.isHidden()) {
      return;
    }

    if (this.isAnimatingOut()) {
      return;
    }

    this._animateOut();
  },

  isAnimatingIn() {
    let scope = this._scope();
    if (scope.length === 0) {
      return false;
    }
    return scope.hasClass('visible') &&
           scope.hasClass('animating') &&
           scope.hasClass('in');
  },

  isAnimatingOut() {
    let scope = this._scope();
    if (scope.length === 0) {
      return false;
    }
    return scope.hasClass('visible') &&
           scope.hasClass('animating') &&
           scope.hasClass('out');
  },

  isVisible() {
    let scope = this._scope();
    if (scope.length === 0) {
      return false;
    }
    return scope.hasClass('visible') &&
           scope.hasClass('active');
  },

  isHidden() {
    let scope = this._scope();
    if (scope.length === 0) {
      return false;
    }
    return scope.hasClass('hidden');
  },

  // private methods
  _scope() {
    let scope = this.get('transitionScope');
    if (Ember.isPresent(scope)) {
      if (typeof this.$ === 'function') {
        return this.$(scope);
      }
      return window.$(scope);
    }
    return this.$();
  },

  _animateIn() {
    this._addBaseProperties();
    let scope = this._scope();
    if (scope.length === 0) {
      return;
    }
    scope.removeClass('hidden out');
    let animationMode = this._animationMode();
    scope.addClass(`visible animating ${animationMode} in`);
    Ember.run.later(this, this._animatedIn, this._animationDuration());
  },

  _animatedIn() {
    if (this.get('isDestroyed') || this.get('isDestroying')) {
      return;
    }
    // Check we are still animating in
    if (this.isHidden()) {
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
    if (scope.length === 0) {
      return;
    }
    let animationMode = this._animationMode();
    scope.addClass('visible active');
    scope.removeClass(`animating ${animationMode} in`);
  },

  _animateOut() {
    this._addBaseProperties();
    let scope = this._scope();
    if (scope.length === 0) {
      return;
    }
    scope.removeClass('in');
    let animationMode = this._animationMode();
    scope.addClass(`visible animating ${animationMode} out`);
    Ember.run.later(this, this._animatedOut, this._animationDuration());
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

    if (this.isHidden()) {
      return;
    }
    // We are still animating, switch to visible
    this._hide();
  },

  _hide() {
    let scope = this._scope();
    if (scope.length === 0) {
      return;
    }
    let animationMode = this._animationMode();
    scope.addClass('hidden');
    scope.removeClass(`visible active animating ${animationMode} out`);
  },

  _addBaseProperties() {
    let scope = this._scope();
    if (scope.length === 0) {
      return;
    }
    let animationDuration = this._animationDuration();
    let style = scope.prop('style');
    let formatted = `${animationDuration}ms`;
    if (Ember.isBlank(style.animationDuration) || style.animationDuration !== formatted) {
      scope.css('animation-duration', formatted);
    }

    scope.addClass('transition');
  },

  _animationDuration() {
    let animationDuration = this.get('transitionDuration');
    if (Ember.isBlank(animationDuration)) {
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
    if (Ember.isBlank(animationMode)) {
      return 'fade';
    }
    return animationMode;
  }

});
