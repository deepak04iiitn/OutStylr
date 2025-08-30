import { signoutSuccess } from '../redux/user/userSlice';

export const checkTokenExpiry = (dispatch) => {
  // This will run every minute to check if token has expired
  const interval = setInterval(async () => {
    try {
      const response = await fetch('/backend/user/check-auth', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        // Token expired or invalid
        dispatch(signoutSuccess());
        clearInterval(interval);
      }
    } catch (error) {
      // Network error or server down - keep user logged in
      console.log('Token check failed:', error);
    }
  }, 60000); // Check every minute

  return interval;
};