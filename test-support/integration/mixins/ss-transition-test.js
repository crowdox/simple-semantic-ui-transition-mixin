import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import Component from '@ember/component';
// Relative path works since both survey and manage are in lib/...
import SSTransition from '../../../mixins/ss-transition';

module('Integration | Mixin | ss transition', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('component:ss-test', Component.extend(SSTransition, {
      classNames: ['ss', 'test'],
      layout: hbs`{{yield}}`
    }));
  });

  test('can render with mixin', async function(assert) {
    assert.expect(1);
    await render(hbs`{{ss-test transitionMode="fade" transitionDuration=500}}`);
    assert.dom('.ss.test').exists();
  });

  test('detects active', async function(assert) {
    assert.expect(4);
    await render(hbs`{{ss-test class="visible active" transitionMode="fade" transitionDuration=500}}`);
    let ssTestElement = assert.dom('.ss.test').findTargetElement();
    let ssTest = this.owner.__container__.cache['-view-registry:main'][ssTestElement.id];
    // Everything should start false
    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isElementVisible(), true);
    assert.equal(ssTest.isElementHidden(), false);
  });

  test('detects hidden', async function(assert) {
    assert.expect(4);
    await render(hbs`{{ss-test class="hidden" transitionMode="fade" transitionDuration=500}}`);
    let ssTestElement = assert.dom('.ss.test').findTargetElement();
    let ssTest = this.owner.__container__.cache['-view-registry:main'][ssTestElement.id];
    // Everything should start false
    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isElementVisible(), false);
    assert.equal(ssTest.isElementHidden(), true);
  });

  test('detects animating in', async function(assert) {
    assert.expect(4);
    await render(hbs`{{ss-test class="visible animating in" transitionMode="fade" transitionDuration=500}}`);
    let ssTestElement = assert.dom('.ss.test').findTargetElement();
    let ssTest = this.owner.__container__.cache['-view-registry:main'][ssTestElement.id];
    // Everything should start false
    assert.equal(ssTest.isAnimatingIn(), true);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isElementVisible(), false);
    assert.equal(ssTest.isElementHidden(), false);
  });

  test('detects animating out', async function(assert) {
    assert.expect(4);
    await render(hbs`{{ss-test class="visible animating out" transitionMode="fade" transitionDuration=500}}`);
    let ssTestElement = assert.dom('.ss.test').findTargetElement();
    let ssTest = this.owner.__container__.cache['-view-registry:main'][ssTestElement.id];
    // Everything should start false
    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), true);
    assert.equal(ssTest.isElementVisible(), false);
    assert.equal(ssTest.isElementHidden(), false);
  });

  test('check properties', async function(assert) {
    assert.expect(18);
    await render(hbs`{{ss-test transitionMode="fade" transitionDuration=500}}`);
    let ssTestElement = assert.dom('.ss.test').findTargetElement();
    let ssTest = this.owner.__container__.cache['-view-registry:main'][ssTestElement.id];
    // Everything should start false
    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isElementVisible(), false);
    assert.equal(ssTest.isElementHidden(), false);

    // Now force show
    ssTest._show();
    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isElementVisible(), true);
    assert.equal(ssTest.isElementHidden(), false);

    // Now force hide
    ssTest._hide();
    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isElementVisible(), false);
    assert.equal(ssTest.isElementHidden(), true);

    // Test default properties
    assert.equal(ssTest._animationDuration(), 500);
    assert.equal(ssTest._animationMode(), 'fade');

    // Test base properties
    assert.equal(ssTestElement.style.length, 0);
    assert.dom('.ss.test').doesNotHaveClass('transition');

    ssTest._addBaseProperties();
    assert.equal(ssTestElement.style.getPropertyValue('animation-duration'), "500ms");
    assert.dom('.ss.test').hasClass('transition');
  });

  test('transitions in', async function(assert) {
    assert.expect(12);
    await render(hbs`{{ss-test transitionMode="fade" transitionDuration=500}}`);
    let ssTestElement = assert.dom('.ss.test').findTargetElement();
    let ssTest = this.owner.__container__.cache['-view-registry:main'][ssTestElement.id];

    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isElementVisible(), false);
    assert.equal(ssTest.isElementHidden(), false);

    ssTest.transitionIn();
    assert.equal(ssTest.isAnimatingIn(), true);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isElementVisible(), false);
    assert.equal(ssTest.isElementHidden(), false);

    let done = assert.async();
    setTimeout(() => {
      assert.equal(ssTest.isAnimatingIn(), false);
      assert.equal(ssTest.isAnimatingOut(), false);
      assert.equal(ssTest.isElementVisible(), true);
      assert.equal(ssTest.isElementHidden(), false);
      done();
    }, 600);
  });

  test('transitions out', async function(assert) {
    assert.expect(16);
    await render(hbs`{{ss-test transitionMode="fade" transitionDuration=500}}`);
    let ssTestElement = assert.dom('.ss.test').findTargetElement();
    let ssTest = this.owner.__container__.cache['-view-registry:main'][ssTestElement.id];

    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isElementVisible(), false);
    assert.equal(ssTest.isElementHidden(), false);

    ssTest._show();
    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isElementVisible(), true);
    assert.equal(ssTest.isElementHidden(), false);

    ssTest.transitionOut();
    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), true);
    assert.equal(ssTest.isElementVisible(), true);
    assert.equal(ssTest.isElementHidden(), false);

    let done = assert.async();
    setTimeout(() => {
      assert.equal(ssTest.isAnimatingIn(), false);
      assert.equal(ssTest.isAnimatingOut(), false);
      assert.equal(ssTest.isElementVisible(), false);
      assert.equal(ssTest.isElementHidden(), true);
      done();
    }, 600);
  });

  test('transitions in then out cancels in', async function(assert) {
    assert.expect(16);
    await render(hbs`{{ss-test transitionMode="fade" transitionDuration=500}}`);
    let ssTestElement = assert.dom('.ss.test').findTargetElement();
    let ssTest = this.owner.__container__.cache['-view-registry:main'][ssTestElement.id];

    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isElementVisible(), false);
    assert.equal(ssTest.isElementHidden(), false);

    ssTest.transitionIn();
    assert.equal(ssTest.isAnimatingIn(), true);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isElementVisible(), false);
    assert.equal(ssTest.isElementHidden(), false);

    let done = assert.async();
    // Wait half the transition time in
    setTimeout(() => {
      ssTest.transitionOut();
      assert.equal(ssTest.isAnimatingIn(), false);
      assert.equal(ssTest.isAnimatingOut(), true);
      assert.equal(ssTest.isElementVisible(), false);
      assert.equal(ssTest.isElementHidden(), false);

      // Wait the full time now
      setTimeout(() => {
        assert.equal(ssTest.isAnimatingIn(), false);
        assert.equal(ssTest.isAnimatingOut(), false);
        assert.equal(ssTest.isElementVisible(), false);
        assert.equal(ssTest.isElementHidden(), true);
        done();
      }, 600);
    }, 250);
  });

  test('transitions out then in cancels out', async function(assert) {
    assert.expect(20);
    await render(hbs`{{ss-test transitionMode="fade" transitionDuration=500}}`);
    let ssTestElement = assert.dom('.ss.test').findTargetElement();
    let ssTest = this.owner.__container__.cache['-view-registry:main'][ssTestElement.id];

    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isElementVisible(), false);
    assert.equal(ssTest.isElementHidden(), false);

    ssTest._show();
    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), false);
    assert.equal(ssTest.isElementVisible(), true);
    assert.equal(ssTest.isElementHidden(), false);

    ssTest.transitionOut();
    assert.equal(ssTest.isAnimatingIn(), false);
    assert.equal(ssTest.isAnimatingOut(), true);
    assert.equal(ssTest.isElementVisible(), true);
    assert.equal(ssTest.isElementHidden(), false);

    let done = assert.async();
    // Wait half the transition time in
    setTimeout(() => {
      ssTest.transitionIn();
      assert.equal(ssTest.isAnimatingIn(), true);
      assert.equal(ssTest.isAnimatingOut(), false);
      assert.equal(ssTest.isElementVisible(), true);
      assert.equal(ssTest.isElementHidden(), false);

      // Wait the full time now
      setTimeout(() => {
        assert.equal(ssTest.isAnimatingIn(), false);
        assert.equal(ssTest.isAnimatingOut(), false);
        assert.equal(ssTest.isElementVisible(), true);
        assert.equal(ssTest.isElementHidden(), false);
        done();
      }, 600);
    }, 250);
  });
});
