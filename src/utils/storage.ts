/**
 * Helper utility to get a value from extension storage or localStorage.
 */
export const getStorageItem = async (key: string): Promise<any> => {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    });
  } else {
    const val = localStorage.getItem(key);
    try {
      return val ? JSON.parse(val) : null;
    } catch {
      return val;
    }
  }
};

/**
 * Helper utility to set a value in extension storage or localStorage.
 */
export const setStorageItem = async (key: string, value: any): Promise<void> => {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  } else {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  }
};
