import { jwtDecode } from "jwt-decode";
export const getRoleFromToken = (code = null) => {
    const token = code || localStorage.getItem('access_token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExtUser = decoded.isExtUser;
        const exp = decoded.exp;
        const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
  
        if (exp < currentTime) {
          // Token is expired
          localStorage.removeItem('access_token'); // Optionally remove expired token
          return null;
        }
        // for testing need to remove before pushing //
        if(decoded.isExtUser == null){
            return 'internal';
        }
        else{
            return 'external';
        }
        //////////////////////////////////////////////
        // Determine role based on 'isExtUser'
        if (isExtUser === 1) {
          return 'external';
        } else {
          return 'internal';
        }
      } catch (error) {
        console.error("Error decoding the JWT token", error);
        return null;
      }
    }
  
    return null;
  };
  