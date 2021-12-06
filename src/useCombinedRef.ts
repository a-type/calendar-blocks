import { MutableRefObject, Ref, useCallback } from 'react';

export const assignRef = <T>(ref: Ref<T>, el: T) => {
  if (typeof ref === 'function') {
    ref(el);
  } else {
    (ref as MutableRefObject<T>).current = el;
  }
};

/**
 * Combines multiple React Refs into a single Ref that can be
 * passed to an element, which will update all provided Refs.
 */
// @ts-nocheck
const useCombinedRef = <T>(...refs: (Ref<T> | undefined)[]) => {
  const finalRef = useCallback((el: T) => {
    refs.forEach((ref) => {
      if (ref) {
        assignRef(ref, el);
      }
    });
  }, refs);
  return finalRef;
};

export default useCombinedRef;
