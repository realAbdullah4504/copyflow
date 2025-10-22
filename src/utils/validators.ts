/**
 * Validation utility functions
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters
  return password.length >= 8;
};

export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};
