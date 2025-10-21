// frontend/src/utils/token.js
import { jwtDecode } from 'jwt-decode';

export const tokenIsValid = (token) => {
  try {
    if (!token) return false;
    
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};