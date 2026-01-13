// Utility functions for the application

/**
 * Extracts variables from text in the format {{variableName}}
 * @param {string} text - The text to parse
 * @returns {string[]} - Array of unique variable names
 */
export const extractVariables = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  const regex = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
  const variables = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const variableName = match[1];
    if (!variables.includes(variableName)) {
      variables.push(variableName);
    }
  }
  
  return variables;
};

/**
 * Validates if a string is a valid JavaScript variable name
 * @param {string} name - The variable name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidVariableName = (name) => {
  if (!name || typeof name !== 'string') return false;
  
  // JavaScript variable name rules:
  // - Must start with letter, underscore, or dollar sign
  // - Can contain letters, numbers, underscores, or dollar signs
  // - Cannot be a reserved keyword
  const regex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  const reservedKeywords = [
    'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
    'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function',
    'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch',
    'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
    'let', 'static', 'enum', 'implements', 'package', 'protected', 'interface',
    'private', 'public'
  ];
  
  return regex.test(name) && !reservedKeywords.includes(name);
};

/**
 * Calculates text dimensions for auto-sizing
 * @param {string} text - The text to measure
 * @param {object} style - Style object with font properties
 * @returns {object} - Object with width and height
 */
export const calculateTextDimensions = (text, style = {}) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Set font properties
  const fontSize = style.fontSize || '14px';
  const fontFamily = style.fontFamily || 'Arial, sans-serif';
  context.font = `${fontSize} ${fontFamily}`;
  
  // Calculate width
  const metrics = context.measureText(text);
  const width = Math.ceil(metrics.width);
  
  // Estimate height based on font size and line breaks
  const lines = text.split('\n').length;
  const lineHeight = parseInt(fontSize) * 1.2; // Approximate line height
  const height = Math.ceil(lines * lineHeight);
  
  return { width, height };
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generates a unique ID
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} - Unique ID
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} - Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};