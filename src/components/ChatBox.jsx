import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { useFetchRecipientUser } from "../hooks/chatHook";
import moment from "moment";
import InputEmoji from "react-input-emoji";

const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
};

const ChatBox = () => {
    const { user } = useContext(AuthContext);
    const { currentChat, messages, isMessageLoading, sendTextMessage } = useContext(ChatContext);
    const { recipientUser } = useFetchRecipientUser(currentChat, user);
    const [textMessage, setTextMessage] = useState('');
    const scroll = useRef();

    // Determine if this is a group chat
    const isGroupChat = currentChat?.isGroupChat || false;
    
    // For group chats, we'll use the group name; for direct chats, use recipient user name
    const chatName = isGroupChat ? currentChat.name : recipientUser?.fullName;

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!currentChat) return (
        <div className="card w-100 text-center p-5">
            <p className="mb-0">No conversation selected yet...</p>
        </div>
    );

    if (isMessageLoading) return (
        <div className="card w-100 text-center p-5">
            <p className="mb-0">Loading chat...</p>
        </div>
    );

    // Helper function to get sender info based on sender ID
    const getSenderInfo = (senderId) => {
        if (senderId === user?._id) {
            return {
                name: 'You',
                initials: getInitials(user?.fullName)
            };
        }
        
        // For group chats, we need to fetch the sender's info
        // This is a simplified version - you might want to implement a proper function
        // to fetch user details based on ID
        if (isGroupChat) {
            // In a real implementation, you would have group members data
            // For now, we'll just return a placeholder
            return {
                name: `User ${senderId.substring(0, 4)}`,
                initials: '?'
            };
        }
        
        // For direct chats, return recipient info
        return {
            name: recipientUser?.fullName,
            initials: getInitials(recipientUser?.fullName)
        };
    };

    return (
        <div className="card w-100">
            <div className="card-header d-flex justify-content-between p-3">
                <div className="d-flex align-items-center">
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center me-2 shadow-1-strong"
                        style={{ 
                            width: "40px", 
                            height: "40px", 
                            backgroundColor: isGroupChat ? "#8e44ad" : "#ccc", 
                            fontSize: "16px" 
                        }}
                    >
                        {isGroupChat ? "G" : getInitials(recipientUser?.fullName)}
                    </div>
                    <h5 className="mb-0">
                        {chatName || "Unknown"}
                        {isGroupChat && <span className="ms-2 badge bg-info">Group</span>}
                    </h5>
                </div>
                <div>
                    {isGroupChat && (
                        <small className="text-muted">
                            {currentChat.members?.length || 0} members
                        </small>
                    )}
                </div>
            </div>
            
            <div className="card-body" style={{ height: "400px", overflowY: "auto" }}>
                <ul className="list-unstyled">
                    {messages && messages.map((message, index) => {
                        const senderInfo = getSenderInfo(message.senderId);
                        const isCurrentUser = message.senderId === user?._id;
                        
                        return (
                            <li 
                                key={index} 
                                className={`d-flex justify-content-${isCurrentUser ? 'end' : 'start'} mb-4`}
                                ref={index === messages.length - 1 ? scroll : null}
                            >
                                {!isCurrentUser && (
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-1-strong"
                                        style={{ width: "60px", height: "60px", backgroundColor: "#ccc", fontSize: "24px" }}
                                    >
                                        {senderInfo.initials}
                                    </div>
                                )}
                                
                                <div className={`card ${isCurrentUser ? 'bg-primary text-white' : ''}`}>
                                    <div className="card-header d-flex justify-content-between p-2">
                                        <p className="fw-bold mb-0">
                                            {senderInfo.name}
                                        </p>
                                        <p className="text-muted small mb-0">
                                            <i className="far fa-clock"></i> {moment(message.createdAt).calendar()}
                                        </p>
                                    </div>
                                    <div className="card-body p-2">
                                        <p className="mb-0">{message.text}</p>
                                    </div>
                                </div>
                                
                                {isCurrentUser && (
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center ms-3 shadow-1-strong"
                                        style={{ width: "60px", height: "60px", backgroundColor: "#ccc", fontSize: "24px" }}
                                    >
                                        {senderInfo.initials}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
            
            <div className="card-footer d-flex">
                <InputEmoji
                    value={textMessage}
                    onChange={setTextMessage}
                    fontFamily="nunito"
                    borderColor="rgba(72,112,223,0.2)"
                    className="form-control"
                />
                <button 
                    className="btn btn-primary ms-2"
                    onClick={() => {
                        if (textMessage.trim()) {
                            sendTextMessage(textMessage, user, currentChat._id, setTextMessage);
                            setTextMessage('');
                        }
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};
 
export default ChatBox;