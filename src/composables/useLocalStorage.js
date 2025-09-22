import { ref, watch } from 'vue';

/**
 * A Vue composable to create a ref that is automatically persisted to localStorage.
 * @param {string} key The localStorage key.
 * @param {*} defaultValue The default value to use if nothing is in localStorage.
 * @returns A ref synced with localStorage.
 */
export function useLocalStorage(key, defaultValue) {
  const data = ref(defaultValue);
  
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    data.value = JSON.parse(storedValue);
  }

  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true });

  return data;
}

