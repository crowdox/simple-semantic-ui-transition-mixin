import Ember from 'ember';
import SSTransition from 'manage/mixins/ss-transition';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ss-test', 'Integration | Mixin | ss transition', {
  integration: true,
  setup() {
    this.register('component:ss-test', Ember.Component.extend(SSTransition, {
      classNames: ['ss', 'test']
    }));
    this.register('template:components/ss-test', hbs`{{yield}}`);
  }
});

let buildCSS = function(style) {
  let keys = Object.keys(style);
  let styles = [];
  for (let key of keys) {
    if (isNaN(key) && Ember.isPresent(style[key])) {
      styles.push(`${key}: ${style[key]}`);
    }
  }
  return styles.join(";");
};

test('can render with mixin', function(assert) {
  assert.expect(1);
  this.render(hbs`{{ss-test}}`);
  assert.ok(this.$('.ss.test').length, 1);
});

test('detects active', function(assert) {
  assert.expect(4);
  this.render(hbs`{{ss-test class="visible active"}}`);
  let ssTestElement = this.$('.ss.test');
  let ssTest = this.container.cache['-view-registry:main'][ssTestElement.attr('id')];
  // Everything should start false
  assert.equal(ssTest.isAnimatingIn(), false);
  assert.equal(ssTest.isAnimatingOut(), false);
  assert.equal(ssTest.isVisible(), true);
  assert.equal(ssTest.isHidden(), false);
});

test('detects hidden', function(assert) {
  assert.expect(4);
  this.render(hbs`{{ss-test class="hidden"}}`);
  let ssTestElement = this.$('.ss.test');
  let ssTest = this.container.cache['-view-registry:main'][ssTestElement.attr('id')];
  // Everything should start false
  assert.equal(ssTest.isAnimatingIn(), false);
  assert.equal(ssTest.isAnimatingOut(), false);
  assert.equal(ssTest.isVisible(), false);
  assert.equal(ssTest.isHidden(), true);
});

test('detects animating in', function(assert) {
  assert.expect(4);
  this.render(hbs`{{ss-test class="visible animating in"}}`);
  let ssTestElement = this.$('.ss.test');
  let ssTest = this.container.cache['-view-registry:main'][ssTestElement.attr('id')];
  // Everything should start false
  assert.equal(ssTest.isAnimatingIn(), true);
  assert.equal(ssTest.isAnimatingOut(), false);
  assert.equal(ssTest.isVisible(), false);
  assert.equal(ssTest.isHidden(), false);
});

test('detects animating out', function(assert) {
  assert.expect(4);
  this.render(hbs`{{ss-test class="visible animating out"}}`);
  let ssTestElement = this.$('.ss.test');
  let ssTest = this.container.cache['-view-registry:main'][ssTestElement.attr('id')];
  // Everything should start false
  assert.equal(ssTest.isAnimatingIn(), false);
  assert.equal(ssTest.isAnimatingOut(), true);
  assert.equal(ssTest.isVisible(), false);
  assert.equal(ssTest.isHidden(), false);
});

test('check properties', function(assert) {
  assert.expect(18);
  this.render(hbs`{{ss-test}}`);
  let ssTestElement = this.$('.ss.test');
  let ssTest = this.container.cache['-view-registry:main'][ssTestElement.attr('id')];
  // Everything should start false
  assert.equal(ssTest.isAnimatingIn(), false);
  assert.equal(ssTest.isAnimatingOut(), false);
  assert.equal(ssTest.isVisible(), false);
  assert.equal(ssTest.isHidden(), false);

  // Now force show
  ssTest._show();
  assert.equal(ssTest.isAnimatingIn(), false);
  assert.equal(ssTest.isAnimatingOut(), false);
  assert.equal(ssTest.isVisible(), true);
  assert.equal(ssTest.isHidden(), false);

  // Now force hide
  ssTest._hide();
  assert.equal(ssTest.isAnimatingIn(), false);
  assert.equal(ssTest.isAnimatingOut(), false);
  assert.equal(ssTest.isVisible(), false);
  assert.equal(ssTest.isHidden(), true);

  // Test default properties
  assert.equal(ssTest._animationDuration(), 500);
  assert.equal(ssTest._animationMode(), 'fade');

  // Test base properties
  assert.equal(buildCSS(ssTestElement.get(0).style), "");
  assert.equal(ssTestElement.hasClass('transition'), false);

  ssTest._addBaseProperties();
  assert.equal(buildCSS(ssTestElement.get(0).style), "animationDuration: 500ms");
  assert.equal(ssTestElement.hasClass('transition'), true);
});

test('transitions in', function(assert) {
  assert.expect(12);
  this.render(hbs`{{ss-test}}`);
  let ssTestElement = this.$('.ss.test');
  let ssTest = this.container.cache['-view-registry:main'][ssTestElement.attr('id')];

  assert.equal(ssTest.isAnimatingIn(), false);
  assert.equal(ssTest.isAnimatingOut(), false);
  assert.equal(ssTest.isVisible(), false);
  assert.equal(ssTest.isHidden(), false);

  ssTest.transitionIn();
  assert.equal(ssTest.isAnimatingIn(), true);
  assert.equal(ssTest.isAnimatingOut(), false);
  assert.equal(ssTest.isVisible(), false);
  assert.equal(ssTest.isHidden(), false);

  let done = assert.async();
  setTimeout(() => {
    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isVisible(), true);
    assert.equal(ssTest.isHidden(), false);
    done();
  }, 600);
});

test('transitions out', function(assert) {
  assert.expect(16);
  this.render(hbs`{{ss-test}}`);
  let ssTestElement = this.$('.ss.test');
  let ssTest = this.container.cache['-view-registry:main'][ssTestElement.attr('id')];

  assert.equal(ssTest.isAnimatingIn(), false);
  assert.equal(ssTest.isAnimatingOut(), false);
  assert.equal(ssTest.isVisible(), false);
  assert.equal(ssTest.isHidden(), false);

  ssTest._show();
  assert.equal(ssTest.isAnimatingIn(), false);
  assert.equal(ssTest.isAnimatingOut(), false);
  assert.equal(ssTest.isVisible(), true);
  assert.equal(ssTest.isHidden(), false);

  ssTest.transitionOut();
  assert.equal(ssTest.isAnimatingIn(), false);
  assert.equal(ssTest.isAnimatingOut(), true);
  assert.equal(ssTest.isVisible(), true);
  assert.equal(ssTest.isHidden(), false);

  let done = assert.async();
  setTimeout(() => {
    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isVisible(), false);
    assert.equal(ssTest.isHidden(), true);
    done();
  }, 600);
});

test('transitions in then out cancels in', function(assert) {
  assert.expect(16);
  this.render(hbs`{{ss-test}}`);
  let ssTestElement = this.$('.ss.test');
  let ssTest = this.container.cache['-view-registry:main'][ssTestElement.attr('id')];

  assert.equal(ssTest.isAnimatingIn(), false);
  assert.equal(ssTest.isAnimatingOut(), false);
  assert.equal(ssTest.isVisible(), false);
  assert.equal(ssTest.isHidden(), false);

  ssTest.transitionIn();
  assert.equal(ssTest.isAnimatingIn(), true);
  assert.equal(ssTest.isAnimatingOut(), false);
  assert.equal(ssTest.isVisible(), false);
  assert.equal(ssTest.isHidden(), false);

  let done = assert.async();
  // Wait half the transition time in
  setTimeout(() => {
    ssTest.transitionOut();
    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), true);
    assert.equal(ssTest.isVisible(), false);
    assert.equal(ssTest.isHidden(), false);

    // Wait the full time now
    setTimeout(() => {
      assert.equal(ssTest.isAnimatingIn(), false);
      assert.equal(ssTest.isAnimatingOut(), false);
      assert.equal(ssTest.isVisible(), false);
      assert.equal(ssTest.isHidden(), true);
      done();
    }, 600);
  }, 250);
});

test('transitions out then in cancels out', function(assert) {
  assert.expect(20);
  this.render(hbs`{{ss-test}}`);
  let ssTestElement = this.$('.ss.test');
  let ssTest = this.container.cache['-view-registry:main'][ssTestElement.attr('id')];

  assert.equal(ssTest.isAnimatingIn(), false);
  assert.equal(ssTest.isAnimatingOut(), false);
  assert.equal(ssTest.isVisible(), false);
  assert.equal(ssTest.isHidden(), false);

  ssTest._show();
  assert.equal(ssTest.isAnimatingIn(), false);
  assert.equal(ssTest.isAnimatingOut(), false);
  assert.equal(ssTest.isVisible(), true);
  assert.equal(ssTest.isHidden(), false);

  ssTest.transitionOut();
  assert.equal(ssTest.isAnimatingIn(), false);
  assert.equal(ssTest.isAnimatingOut(), true);
  assert.equal(ssTest.isVisible(), true);
  assert.equal(ssTest.isHidden(), false);

  let done = assert.async();
  // Wait half the transition time in
  setTimeout(() => {
    ssTest.transitionIn();
    assert.equal(ssTest.isAnimatingIn(), true);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isVisible(), true);
    assert.equal(ssTest.isHidden(), false);

    // Wait the full time now
    setTimeout(() => {
      assert.equal(ssTest.isAnimatingIn(), false);
      assert.equal(ssTest.isAnimatingOut(), false);
      assert.equal(ssTest.isVisible(), true);
      assert.equal(ssTest.isHidden(), false);
      done();
    }, 600);
  }, 250);
});

