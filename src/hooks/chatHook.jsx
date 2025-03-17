import { useEffect,useState } from "react";
import { getRequest } from "./service";
const API_URL = `${import.meta.env.VITE_API_URL}`;

export const useFetchRecipientUser = (chat,user)=> {
    const [recipientUser,setRecipientUser ]= useState(null)
    const [error,setError] = useState(null)
    useEffect(() => {
        const getUser = async () => {
            if (!chat || !user) {
                return;
            }
          
            
            // Find the ID that's not the current user's ID
            const recipientId = chat.members?.find(id => id !== user._id);
         
            if (!recipientId) {

                return;
            }
            
            // Make sure recipientId is a string
            
            try {
                const response = await getRequest(`${API_URL}/users/find/${recipientId}`);
                if (response.error) {
                    setError(response.error);
                } else {
                    setRecipientUser(response);
                }
            } catch (err) {
                setError(err.message);
            }
        };
        
        getUser();
    }, [chat, user]);
    return{recipientUser, error}
}