// Save the original console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

// Overwrite the console methods to redirect to alert
console.log = function(message) {
  alert('Log: ' + message);
  originalConsoleLog.apply(console, arguments);
};

console.error = function(message) {
  alert('Error: ' + message);
  originalConsoleError.apply(console, arguments);
};

console.warn = function(message) {
  alert('Warn: ' + message);
  originalConsoleWarn.apply(console, arguments);
};

console.info = function(message) {
  alert('Info: ' + message);
  originalConsoleInfo.apply(console, arguments);
};
