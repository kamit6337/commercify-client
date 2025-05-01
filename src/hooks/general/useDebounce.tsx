import { useCallback, useRef } from "react";

/**
 * A generic debounce function that delays the invocation of the provided function.
 * @param func - The function to debounce.
 * @param delay - The delay in milliseconds.
 */
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 1000
) => {
  let timeout: ReturnType<typeof setTimeout> | null;

  return (...args: Parameters<T>): void => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), delay);
  };
};

/**
 * A custom hook to debounce a function.
 * @param callback - The function to debounce.
 * @param delay - The debounce delay in milliseconds.
 * @returns - A debounced version of the function.
 */
const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
) => {
  const callbackRef = useRef(callback);

  // Update the callback reference if the function changes
  callbackRef.current = callback;

  const debouncedFunction = useCallback(
    debounce((...args: Parameters<T>) => {
      callbackRef.current(...args);
    }, delay),
    [delay]
  );

  return debouncedFunction;
};

export default useDebounce;
