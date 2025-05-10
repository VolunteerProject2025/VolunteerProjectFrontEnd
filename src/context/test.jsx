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

    // Socket initialization
    useEffect(() => {
        const newSocket = io(`${API_URL}`, {
            withCredentials: true,
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    // Track online users
    useEffect(() => {
        if (socket === null || !user?._id) {
            return;
        }
        
        socket.emit('addNewUser', user._id);
        socket.on('getOnlineUsers', (res) => {
            setOnlineUsers(res); // Changed from [res] to res assuming the server sends an array
        });
        
        return () => {
            socket.off('getOnlineUsers');
        };
    }, [socket, user]);

    // Send message
    useEffect(() => {
        if (socket === null || !newMessage) {
            return;
        }
        
        const recipientId = currentChat?.members?.find((id) => id !== user?._id);
        if (recipientId) {
            socket.emit('sendMessage', { ...newMessage, recipientId });
        }
    }, [newMessage, socket, currentChat, user]);

    // Receive message
    useEffect(() => {
        if (socket === null) {
            return;
        }
        
        socket.on('getMessage', res => {
            if (currentChat?._id !== res.chatId) {
                return;
            }
            setMessages((prev) => prev ? [...prev, res] : [res]);
        });
        
        return () => {
            socket.off('getMessage');
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
                    let isChatCreated = false;
                    
                    // Skip current user
                    if (user._id === u._id) {
                        return false;
                    }
                    
                    // Check if a chat already exists with this user
                    if (userChats) {
                        isChatCreated = userChats.some((chat) => {
                            return chat.members[0] === u._id || chat.members[1] === u._id;
                        });
                    }
                    
                    return !isChatCreated;
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
            setUserChats(null);

            try {
                const response = await getRequest(`${API_URL}/chat/${user._id}`);
                
                setIsUserChatLoading(false);

                if (response.error) {
                    return setUserChatsError(response);
                }
                
                setUserChats(response);
            } catch (error) {
                setIsUserChatLoading(false);
                console.error("Error fetching user chats:", error);
            }
        };

        getUserChats();
    }, [user]); // Fixed the dependency array issue here

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
            }
        };

        getMessages();
    }, [currentChat]); // Fixed the dependency array issue here

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) {
            return setSendTextMessageError('You must type something');
        }
        
        try {
            const response = await postRequest(
                `${API_URL}/message`, 
                JSON.stringify({
                    chatId: currentChatId,
                    senderId: sender._id,
                    text: textMessage
                })
            );

            if (response.error) {
                return setSendTextMessageError(response);
            }
            
            setNewMessage(response);
            setMessages((prev) => prev ? [...prev, response] : [response]);
            setTextMessage('');
        } catch (error) {
            setSendTextMessageError("Failed to send message");
            console.error("Error sending message:", error);
        }
    }, []);

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, []);

    const createChat = useCallback(async (firstId, secondId) => {
        try {
            const response = await postRequest(
                `${API_URL}/chat`, 
                JSON.stringify({
                    firstId,
                    secondId
                })
            );

            if (response.error) {
                return setUserChatsError(response);
            }
            
            setUserChats((prev) => prev ? [...prev, response] : [response]);
            return response;
        } catch (error) {
            setUserChatsError("Failed to create chat");
            console.error("Error creating chat:", error);
        }
    }, []);

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
                onlineUsers
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};