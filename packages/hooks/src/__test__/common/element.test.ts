import { ref } from 'vue';

import { beforeEach, describe, expect, it } from 'vitest';

import { useElementZoom } from '../../common/element';
import { useStore } from '../../store';

/**
 * 画布缩放边界测试
 *
 * 回归点：V1.1.16 之前上限被写成 `newScale > 150`（应为 1.5），
 * 导致 Ctrl+滚轮可以无限放大。
 */

function wheel(deltaY: number, ctrlKey = true): WheelEvent {
  return { ctrlKey, deltaY } as unknown as WheelEvent;
}

describe('useElementZoom 缩放边界', () => {
  beforeEach(() => {
    const { canvasScale, disabledZoom } = useStore();
    canvasScale.value = 1;
    disabledZoom.value = false;
  });

  it('Ctrl+滚轮向上放大，但不会超过 1.5', () => {
    const { canvasScale, handleZoom } = useElementZoom(ref(null));

    for (let i = 0; i < 40; i++) {
      handleZoom(wheel(-1));
    }

    expect(canvasScale.value).toBeLessThanOrEqual(1.5);
    expect(canvasScale.value).toBeGreaterThan(1.4);
  });

  it('Ctrl+滚轮向下缩小，但不会低于 0.5', () => {
    const { canvasScale, handleZoom } = useElementZoom(ref(null));

    for (let i = 0; i < 40; i++) {
      handleZoom(wheel(1));
    }

    expect(canvasScale.value).toBeGreaterThanOrEqual(0.5);
    expect(canvasScale.value).toBeLessThan(0.6);
  });

  it('未按下 Ctrl 时不缩放', () => {
    const { canvasScale, handleZoom } = useElementZoom(ref(null));

    handleZoom(wheel(-1, false));

    expect(canvasScale.value).toBe(1);
  });

  it('disabledZoom 时不缩放', () => {
    const { canvasScale, handleZoom } = useElementZoom(ref(null));
    const store = useStore();
    store.disabledZoom.value = true;

    handleZoom(wheel(-1));

    expect(canvasScale.value).toBe(1);
    store.disabledZoom.value = false;
  });
});
