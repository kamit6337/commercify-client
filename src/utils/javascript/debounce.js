// Custom debounce function
const debounce = (func, delay = 500) => {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer); // Clear previous timer
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export default debounce;
