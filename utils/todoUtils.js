const todoDataValidation = ({ todo }) => {
    return new Promise((resolve, reject) => {
      if (!todo) {
        return reject("Todo field is required.");
      }
  
      if (typeof todo !== "string") {
        return reject("Todo must be a string.");
      }
  
      const trimmedTodo = todo.trim();
      
      if (trimmedTodo.length === 0) {
        return reject("Todo cannot be an empty string or whitespace.");
      }
  
      if (trimmedTodo.length < 2) {
        return reject("Todo is too short. It should be at least 2 characters long.");
      }
  
      if (trimmedTodo.length > 100) {
        return reject("Todo is too long. It should not exceed 100 characters.");
      }
  
      if (!/^[a-zA-Z0-9\s,.!?]+$/.test(trimmedTodo)) {
        return reject("Todo contains invalid characters. Only letters, numbers, spaces, and basic punctuation are allowed.");
      }
  
      resolve();
    });
  };
  
  module.exports = todoDataValidation;
  