import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import '../assets/css/chat.css'

const PotentialChats = () => {
    const {user} =useContext(AuthContext)
    const{ potentialChats, createChat,onlineUsers} = useContext(ChatContext)
    return ( <>
        <div className="all-users">
            {potentialChats && potentialChats.map((u,index)=>{
                return(
                    <div className="single-user" key={index} onClick={()=> createChat(user._id,u._id)}>
                    {u.fullName}
                    <span className={
                        onlineUsers?.some((user) => user?.userId === u?._id) ?
                        "user-online" : ""}></span>
                </div>
                )
            })}
        </div>
    </> );
}
 
export default PotentialChats;