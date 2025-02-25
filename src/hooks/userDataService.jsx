
const API_URL = `${import.meta.env.VITE_API_URL}/user`;
import axios from "axios";
export const userDataService = {
    // Function to fetch user data from the backend
    fetchUserData: async () => {
      try {
        const response = await axios.get(`${API_URL}/profile`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
        
        if (response.data && response.data.user) {
          return response.data.user;
        }
        return null;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    }
  };
  
  export default userDataService;
  