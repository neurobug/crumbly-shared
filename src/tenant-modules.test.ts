import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_FEATURES_BY_PROFILE,
  resolveEffectiveFeatures,
  STAFF_CHECKOUT_MODULE,
} from './tenant-modules';

describe('resolveEffectiveFeatures', () => {
  it('disables child when dependency is off', () => {
    const map = resolveEffectiveFeatures({
      'finance.staff_checkout': { enabled: true },
      'finance.register': { enabled: false },
    });
    assert.equal(map['finance.staff_checkout'].enabled, false);
  });

  it('enables staff checkout when register is on', () => {
    const map = resolveEffectiveFeatures({
      'finance.staff_checkout': { enabled: true },
      'finance.register': { enabled: true },
    });
    assert.equal(map['finance.staff_checkout'].enabled, true);
  });

  it('requires any pos channel for kds', () => {
    const off = resolveEffectiveFeatures({ 'kitchen.kds': { enabled: true } });
    assert.equal(off['kitchen.kds'].enabled, false);

    const on = resolveEffectiveFeatures({
      'kitchen.kds': { enabled: true },
      'pos.dine_in': { enabled: true },
    });
    assert.equal(on['kitchen.kds'].enabled, true);
  });

  it('bakery_full profile enables plant and kds', () => {
    const map = DEFAULT_FEATURES_BY_PROFILE.bakery_full;
    assert.equal(map['production.plant'].enabled, true);
    assert.equal(map['kitchen.kds'].enabled, true);
    assert.equal(map[STAFF_CHECKOUT_MODULE].enabled, false);
    assert.equal(map['fulfillment.scheduled'].enabled, false);
    assert.equal(map['fulfillment.delivery'].enabled, false);
  });

  it('restaurant_delivery profile enables delivery modules', () => {
    const map = DEFAULT_FEATURES_BY_PROFILE.restaurant_delivery;
    assert.equal(map['fulfillment.delivery'].enabled, true);
    assert.equal(map['fulfillment.scheduled'].enabled, true);
    assert.equal(map['kitchen.kds'].enabled, true);
  });
});
