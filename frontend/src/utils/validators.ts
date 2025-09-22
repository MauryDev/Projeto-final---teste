export function isEmailValid(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isPasswordStrong(password: string): boolean {
  return password.length >= 6;
}
