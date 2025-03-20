import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { getRequest, postRequest } from "../hooks/service";
import { AuthContext } from '../context/AuthContext';
import { io } from "socket.io-client";
const API_URL = `${import.meta.env.VITE_API_URL}`;

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatLoading, setIsUserChatLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    
    // Socket initialization - only when user changes
    useEffect(() => {
        if (!user?._id) return;
        
        const newSocket = io(`${API_URL}`, {
            withCredentials: true,
        });
        
        setSocket(newSocket);

        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, [user]);

    // Track online users
    useEffect(() => {
        if (!socket || !user?._id) return;

        // Register this user as online
        socket.emit('addNewUser', user._id);
        
        // Listen for online users updates
        socket.on('getOnlineUsers', (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off('getOnlineUsers');
        };
    }, [socket, user]);

    // Send message when newMessage is set
    useEffect(() => {
        if (socket === null) return;

        const recipientId = currentChat?.members?.find(id => id !== user?._id);

        socket.emit("sendMessage", {
            ...newMessage,
            recipientId,
            // Add group chat info if it's a group chat
            isGroupChat: currentChat?.isGroupChat || false,
            members: currentChat?.members || []
        });
    }, [newMessage, socket, currentChat, user]);

    // Receive message
    useEffect(() => {
        if (!socket) return;

        const messageHandler = (message) => {
            if (currentChat?._id === message.chatId) {
                setMessages(prev => prev ? [...prev, message] : [message]);
            }
        };

        socket.on('getMessage', messageHandler);
        
        return () => {
            socket.off('getMessage', messageHandler);
        };
    }, [socket, currentChat]);

    // Get potential users to chat with
    useEffect(() => {
        const getUsers = async () => {
            if (!user?._id) return;

            try {
                const response = await getRequest(`${API_URL}/users`);

                if (response.error) {
                    return setUserChatsError(response);
                }

                const pChats = response.filter((u) => {
                    // Skip current user
                    if (user._id === u._id) return false;

                    // Check if a chat already exists with this user
                    if (userChats) {
                        const isChatCreated = userChats.some(chat => 
                            chat.members.includes(u._id)
                        );
                        return !isChatCreated;
                    }
                    return true;
                });

                setPotentialChats(pChats);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        getUsers();
    }, [userChats, user]);

    // Get user chats
    useEffect(() => {
        const getUserChats = async () => {
            if (!user?._id) return;

            setIsUserChatLoading(true);
            setUserChatsError(null);

            try {
                const response = await getRequest(`${API_URL}/chat/${user?._id}`);

                setIsUserChatLoading(false);

                if (response.error) {
                    return setUserChatsError(response);
                }

                setUserChats(response);
            } catch (error) {
                setIsUserChatLoading(false);
                console.error("Error fetching user chats:", error);
                setUserChatsError("Failed to fetch chats");
            }
        };

        getUserChats();
    }, [user]);

    // Get messages for current chat
    useEffect(() => {
        const getMessages = async () => {
            if (!currentChat?._id) return;

            setIsMessageLoading(true);
            setMessagesError(null);

            try {
                const response = await getRequest(`${API_URL}/message/${currentChat._id}`);

                setIsMessageLoading(false);

                if (response.error) {
                    return setMessagesError(response);
                }

                setMessages(response);
            } catch (error) {
                setIsMessageLoading(false);
                console.error("Error fetching messages:", error);
                setMessagesError("Failed to fetch messages");
            }
        };

        getMessages();
    }, [currentChat]);

    // Search for users
    const searchUsers = useCallback(async (searchTerm) => {
        if (!searchTerm || !user?._id) return [];

        try {
            const response = await getRequest(`${API_URL}/users/search?term=${searchTerm}`);

            if (response.error) {
                console.error("Error searching users:", response);
                return [];
            }

            // Filter out current user and users with existing chats
            return response.filter((u) => {
                // Skip current user
                if (user._id === u._id) return false;

                // Only include users without existing chats
                if (userChats) {
                    const isChatCreated = userChats.some(chat => 
                        chat.members.includes(u._id)
                    );
                    return !isChatCreated;
                }
                return true;
            });
        } catch (error) {
            console.error("Error searching users:", error);
            return [];
        }
    }, [user, userChats]);

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) {
          return setSendTextMessageError('You must type something');
        }
      
        setSendTextMessageError(null);
      
        try {
          const chatIdStr = String(currentChatId);
          const senderIdStr = String(sender._id);
          
          const response = await postRequest(
            `${API_URL}/message`,
            {
              chatId: chatIdStr,
              senderId: senderIdStr,
              text: textMessage
            }
          );
      
          if (response.error) {
            return setSendTextMessageError(response);
          }
      
          // Update messages locally
          setMessages(prev => prev ? [...prev, response] : [response]);
          
          // Prepare message for socket transmission
          const messageForSocket = {
            ...response,
            // Add group chat info if this is a group chat
            isGroupChat: currentChat?.isGroupChat || false,
            members: currentChat?.members || []
          };
          
          // Set new message for socket transmission
          setNewMessage(messageForSocket);
        } catch (error) {
          setSendTextMessageError("Failed to send message");
          console.error("Error sending message:", error);
        }
      }, [currentChat]);
 
    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, []);

    const createChat = useCallback(async (firstId, secondId) => {
        try {
            const firstIdStr = String(firstId);
            const secondIdStr = String(secondId);

            const response = await postRequest(
                `${API_URL}/chat`,
                {
                    firstId: firstIdStr,
                    secondId: secondIdStr
                }
            );

            if (response.error) {
                setUserChatsError(response);
                return null;
            }

            setUserChats(prev => prev ? [...prev, response] : [response]);
            return response;
        } catch (error) {
            setUserChatsError("Failed to create chat");
            console.error("Error creating chat:", error);
            return null;
        }
    }, []);
    const createGroupChat = useCallback(async (name, members) => {
        try {
          // Ensure current user is included in members
          const memberIds = [...members];
          if (!memberIds.includes(user._id)) {
            memberIds.push(user._id);
          }
      
          const response = await postRequest(
            `${API_URL}/chat/group`,
            {
              name,
              members: memberIds
            }
          );
      
          if (response.error) {
            console.error("Error creating group chat:", response.error);
            return null;
          }
      
          // Update userChats to include the new group chat
          setUserChats(prev => {
            // Check if the chat is already in the list
            const exists = prev?.some(chat => chat._id === response._id);
            if (exists) return prev;
            return prev ? [...prev, response] : [response];
          });
          
          // Automatically set this as the current chat
          setCurrentChat(response);
          
          return response;
        } catch (error) {
          console.error("Error creating group chat:", error);
          return null;
        }
      }, [user, API_URL]);
      
      // Function to fetch user details by ID (for group chat messages)
      const fetchUserById = useCallback(async (userId) => {
        try {
          const response = await getRequest(`${API_URL}/users/find/${userId}`);
          if (response.error) {
            console.error("Error fetching user:", response.error);
            return null;
          }
          return response;
        } catch (error) {
          console.error("Error fetching user:", error);
          return null;
        }
      }, [API_URL]);
    return (
        <ChatContext.Provider
            value={{
                userChats,
                isUserChatLoading,
                userChatsError,
                potentialChats,
                updateCurrentChat,
                createChat,
                messages,
                isMessageLoading,
                messagesError,
                currentChat,
                sendTextMessage,
                onlineUsers,
                searchUsers,
                createGroupChat,
                fetchUserById
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};