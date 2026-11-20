/**
 * 防抖函数，用于限制处理函数的执行频率。
 * @param handler - 要防抖的函数。
 * @param delay - 防抖延迟时间，单位为毫秒。
 * @returns 返回一个防抖处理后的函数。
 */
export interface DebouncedFunction<T extends (...args: unknown[]) => void> {
  (...args: Parameters<T>): void;
  /** 取消所有挂起的调用 */
  cancel: () => void;
  /** 立即执行挂起的调用（若有） */
  flush: () => void;
}

export function debounce<T extends (...args: unknown[]) => void>(
  handler: T,
  delay: number,
): DebouncedFunction<T> {
  let timer: null | number = null;
  let lastArgs: null | Parameters<T> = null;

  const run = (): void => {
    timer = null;
    const pending = lastArgs;
    lastArgs = null;
    if (pending) {
      handler(...pending);
    }
  };

  const debounced = ((...args: Parameters<T>): void => {
    lastArgs = args;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(run, delay) as unknown as number;
  }) as DebouncedFunction<T>;

  debounced.cancel = (): void => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastArgs = null;
  };

  debounced.flush = (): void => {
    if (!timer) {
      return;
    }
    clearTimeout(timer);
    run();
  };

  return debounced;
}
