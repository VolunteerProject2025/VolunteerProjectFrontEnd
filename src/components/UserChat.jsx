import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../hooks/chatHook";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import '../assets/css/chat.css'

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user)
    const {onlineUsers} = useContext(ChatContext)
    const isOnline =  onlineUsers?.some((user) => user?.userId === recipientUser?._id)  
      const lastMessage = chat?.messages?.length > 0 ? chat.messages[chat.messages.length - 1] : null;
    const formattedTime = lastMessage ? moment(lastMessage.createdAt).calendar() : "No messages yet";
    return (<Stack direction="horizontal" gap={3} className="user-card align-items-center p-2 justify-content-between"role="button">
        <div className="d-flex">
            <div className="me-2">
                
            </div>
            <div className="text-content">
                <div className="name">{recipientUser?.fullName}</div>
                <div className="text">Text Message</div>
            </div>
        </div>
        <div className="d-flex flex-column align-items-end">
        <div className="date">{formattedTime}</div> 
            <span className={isOnline ? "user-online" : ""}></span>
        </div>
    </Stack>);
}

export default UserChat;