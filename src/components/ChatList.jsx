import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { useFetchRecipientUser } from "../hooks/chatHook";
import moment from "moment";

const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
};

// Modified ChatItem to handle group chats
const ChatItem = ({ chat, user, onClick }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUsers} = useContext(ChatContext);
    const [lastMessage, setLastMessage] = useState(null);
    // Determine if this is a group chat
    const isGroupChat = chat.isGroupChat || false;
    
    // For group chats, we'll use the group name; for direct chats, use recipient user name
    const chatName = isGroupChat ? chat.name : recipientUser?.fullName;
    
    // For group chats, we can't show online status of a single user
    const isOnline = !isGroupChat && onlineUsers?.some((user) => user?.userId === recipientUser?._id);

    useEffect(() => {
        const fetchLastMessage = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/message/${chat._id}`, { credentials: "include" });
                const messages = await response.json();
                if (messages.length > 0) {
                    setLastMessage(messages[messages.length - 1]);
                }
            } catch (error) {
                console.error("Error fetching last message:", error);
            }
        };

        fetchLastMessage();
    }, [chat]);
    
    // Get the last message for the chat preview
    const messagePreview = lastMessage ?
        (lastMessage.text.length > 25 ? lastMessage.text.substring(0, 25) + "..." : lastMessage.text) :
        "No messages yet";
    const formattedTime = lastMessage ? moment(lastMessage.createdAt).calendar() : "";

    // Check if there are unread messages (implement your own logic)
    const hasUnreadMessages = false; // Replace with your logic

    return (
        <li className="p-2 border-bottom" style={{ backgroundColor: "#eee", cursor: "pointer" }} onClick={onClick}>
            <div className="d-flex justify-content-between">
                <div className="d-flex flex-row">
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-1-strong"
                        style={{ 
                            width: "60px", 
                            height: "60px", 
                            backgroundColor: isGroupChat ? "#8e44ad" : "#ccc", // Different color for group chats
                            fontSize: "24px" 
                        }}
                    >
                        {isGroupChat ? "G" : getInitials(recipientUser?.fullName)}
                    </div>
                    <div className="pt-1">
                        <p className="fw-bold mb-0">
                            {chatName || "Unknown"}
                            {isGroupChat && <span className="ms-1 badge bg-info">Group</span>}
                        </p>
                        <p className="small text-muted">{messagePreview}</p>
                    </div>
                </div>
                <div className="pt-1">
                    <p className="small text-muted mb-1">{formattedTime}</p>
                    {hasUnreadMessages && <span className="badge bg-danger float-end">1</span>}
                    {isOnline && <span className="badge bg-success float-end me-1">Online</span>}
                    {isGroupChat && <small className="text-muted d-block text-end">{chat.members?.length || 0} members</small>}
                </div>
            </div>
        </li>
    );
};

// User item component for displaying search results and potential chats
const UserItem = ({ user, currentUser, onlineUsers, onClick, onSelect, isSelected }) => {
    const isOnline = onlineUsers?.some((u) => u?.userId === user?._id);
    
    return (
        <li className="p-2 border-bottom" style={{ backgroundColor: isSelected ? "#e3f2fd" : "#eee", cursor: "pointer" }}>
            <div className="d-flex justify-content-between">
                <div className="d-flex flex-row" onClick={onClick}>
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-1-strong"
                        style={{ width: "60px", height: "60px", backgroundColor: "#ccc", fontSize: "24px" }}
                    >
                        {getInitials(user?.fullName)}
                    </div>
                    <div className="pt-1">
                        <p className="fw-bold mb-0">{user.fullName}</p>
                        <p className="small text-muted">Click to start a chat</p>
                    </div>
                </div>
                <div className="pt-1 d-flex align-items-center">
                    {isOnline && <span className="badge bg-success me-2">Online</span>}
                    <div className="form-check">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => onSelect(user)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            </div>
        </li>
    );
};

// ChatUser component to represent users we already have chats with
const ChatUser = ({ chat, user, onSelect, isSelected }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUsers } = useContext(ChatContext);
    const isOnline = onlineUsers?.some((u) => u?.userId === recipientUser?._id);
    
    if (!recipientUser && !chat.isGroupChat) return null;
    
    return (
        <li className="p-2 border-bottom" style={{ backgroundColor: isSelected ? "#e3f2fd" : "#eee", cursor: "pointer" }}>
            <div className="d-flex justify-content-between">
                <div className="d-flex flex-row">
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-1-strong"
                        style={{ 
                            width: "60px", 
                            height: "60px", 
                            backgroundColor: chat.isGroupChat ? "#8e44ad" : "#ccc", 
                            fontSize: "24px" 
                        }}
                    >
                        {chat.isGroupChat ? "G" : getInitials(recipientUser?.fullName)}
                    </div>
                    <div className="pt-1">
                        <p className="fw-bold mb-0">
                            {chat.isGroupChat ? chat.name : recipientUser?.fullName}
                            {chat.isGroupChat && <span className="ms-1 badge bg-info">Group</span>}
                        </p>
                        <p className="small text-muted">Select for group</p>
                    </div>
                </div>
                <div className="pt-1 d-flex align-items-center">
                    {isOnline && <span className="badge bg-success me-2">Online</span>}
                    <div className="form-check">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => onSelect(chat.isGroupChat ? { _id: chat._id, isGroup: true, name: chat.name } : recipientUser)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            </div>
        </li>
    );
};

const ChatList = () => {
    const { user } = useContext(AuthContext);
    const {
        potentialChats,
        createChat,
        onlineUsers,
        searchUsers,
        userChats,
        isUserChatLoading,
        updateCurrentChat,
        createGroupChat
    } = useContext(ChatContext);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [filteredChats, setFilteredChats] = useState([]);
    const [isGroupMode, setIsGroupMode] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState("");
    
    // Handle search input changes
    const handleSearch = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.trim().length > 0) {
            setIsSearching(true);
            // Search for users
            const results = await searchUsers(term);
            setSearchResults(results);
            
            // Filter existing chats based on the search term
            if (userChats) {
                // Enhanced filtering to include group chat names
                const filtered = userChats.filter(chat => {
                    if (chat.isGroupChat && chat.name) {
                        return chat.name.toLowerCase().includes(term.toLowerCase());
                    }
                    return true; // For non-group chats, keep them in results (recipientUser filtering would happen separately)
                });
                setFilteredChats(filtered);
            }
            
            setIsSearching(false);
        } else {
            setSearchResults([]);
            setFilteredChats(userChats || []);
        }
    };

    // Initialize filtered chats when userChats changes
    useEffect(() => {
        setFilteredChats(userChats || []);
    }, [userChats]);

    // Toggle user selection for group creation
    const toggleUserSelection = (user) => {
        if (selectedUsers.some(u => u._id === user._id)) {
            setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    // Create a new group chat with selected users
    const createGrChat = async () => {
        if (selectedUsers.length < 2 || !groupName.trim()) {
          alert("Please select at least 2 users and provide a group name");
          return;
        }
      
        try {
          // Get the member IDs
          const memberIds = selectedUsers.map(u => {
            // Handle both regular users and existing chat members
            if (u.isGroup) {
              return null; // Skip groups, we don't want to add groups to groups
            }
            return u._id;
          }).filter(id => id !== null); // Remove any nulls
          
          // Add current user's ID if not already included
          if (!memberIds.includes(user._id)) {
            memberIds.push(user._id);
          }
          
          console.log("Creating group with members:", memberIds);
          
          // Use the createGroupChat function from ChatContext
          const newChat = await createGroupChat(groupName, memberIds);
          
          if (newChat) {
            // Reset group creation state
            setIsGroupMode(false);
            setSelectedUsers([]);
            setGroupName("");
            
            // Automatically select the new group chat
            updateCurrentChat(newChat);
            
            alert("Group created successfully!");
          } else {
            alert("Failed to create group");
          }
        } catch (error) {
          console.error("Error creating group:", error);
          alert("An error occurred while creating the group");
        }
      };

    // Cancel group creation mode
    const cancelGroupCreation = () => {
        setIsGroupMode(false);
        setSelectedUsers([]);
        setGroupName("");
    };

    // Determine what users to display based on search
    const displayUsers = searchTerm.trim().length > 0 ? searchResults : potentialChats;
    const chatsToDisplay = searchTerm.trim().length > 0 ? filteredChats : userChats;

    return (
        <div className="card mb-4">
            <div className="card-header p-3">
                {isGroupMode ? (
                    <div>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter group name..."
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                            <button 
                                className="btn btn-secondary btn-sm"
                                onClick={cancelGroupCreation}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-primary btn-sm" 
                                onClick={createGrChat}
                                disabled={selectedUsers.length < 2 || !groupName.trim()}
                            >
                                Create Group ({selectedUsers.length} selected)
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search users and conversations..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <button 
                            className="btn btn-primary btn-sm float-end"
                            onClick={() => setIsGroupMode(true)}
                        >
                            Create Group
                        </button>
                    </div>
                )}
            </div>

            <div className="card-body" style={{ maxHeight: "600px", overflowY: "auto" }}>
                {isSearching ? (
                    <div className="text-center p-3">Searching...</div>
                ) : isGroupMode ? (
                    <ul className="list-unstyled mb-0">
                        <div className="p-2 bg-light border-bottom">
                            <h6 className="mb-0">Select Users for Group</h6>
                        </div>
                        
                        {/* Display potential users for selection */}
                        {potentialChats && potentialChats.length > 0 && (
                            <>
                                <div className="p-2 bg-light border-bottom mt-2">
                                    <h6 className="mb-0 small">New Contacts</h6>
                                </div>
                                {potentialChats.map((u, index) => (
                                    <UserItem
                                        key={`potential-${index}`}
                                        user={u}
                                        currentUser={user}
                                        onlineUsers={onlineUsers}
                                        onClick={() => {}}
                                        onSelect={toggleUserSelection}
                                        isSelected={selectedUsers.some(selected => selected._id === u._id)}
                                    />
                                ))}
                            </>
                        )}
                        
                        {/* Display existing chat users for selection */}
                        {userChats && userChats.length > 0 && (
                            <>
                                <div className="p-2 bg-light border-bottom mt-2">
                                    <h6 className="mb-0 small">Existing Contacts</h6>
                                </div>
                                {userChats.map((chat, index) => (
                                    <ChatUser
                                        key={`existing-${index}`}
                                        chat={chat}
                                        user={user}
                                        onSelect={toggleUserSelection}
                                        isSelected={selectedUsers.some(selected => {
                                            // Handle both regular users and groups
                                            if (chat.isGroupChat) {
                                                return selected._id === chat._id && selected.isGroup;
                                            } else {
                                                // For regular chats, find the recipient ID
                                                const recipientId = chat.members.find(id => id !== user._id);
                                                return selected._id === recipientId;
                                            }
                                        })}
                                    />
                                ))}
                            </>
                        )}
                    </ul>
                ) : (
                    <ul className="list-unstyled mb-0">
                        {/* Section Header for Conversations */}
                        {chatsToDisplay && chatsToDisplay.length > 0 && (
                            <div className="p-2 bg-light border-bottom">
                                <h6 className="mb-0">My Conversations</h6>
                            </div>
                        )}
                        
                        {/* Display Filtered Conversations */}
                        {isUserChatLoading ? (
                            <li className="p-2 text-center">Loading chats...</li>
                        ) : chatsToDisplay && chatsToDisplay.length > 0 ? (
                            chatsToDisplay.map((chat, index) => (
                                <div key={`chat-${index}`}>
                                    <ChatItem chat={chat} user={user} onClick={() => updateCurrentChat(chat)} />
                                </div>
                            ))
                        ) : !searchTerm && (
                            <li className="p-2 text-center">No conversations yet</li>
                        )}
                        
                        {/* Section Header for Users */}
                        {displayUsers && displayUsers.length > 0 && (
                            <div className="p-2 bg-light border-bottom mt-3">
                                <h6 className="mb-0">{searchTerm ? "Search Results" : "Suggested Contacts"}</h6>
                            </div>
                        )}
                        
                        {/* Display Users/Search Results */}
                        {displayUsers && displayUsers.map((u, index) => (
                            <UserItem
                                key={`user-${index}`}
                                user={u}
                                currentUser={user}
                                onlineUsers={onlineUsers}
                                onClick={() => createChat(user._id, u._id)}
                                onSelect={() => {}}
                                isSelected={false}
                            />
                        ))}
                        
                        {/* No Results Message */}
                        {searchTerm && displayUsers?.length === 0 && filteredChats?.length === 0 && !isSearching && (
                            <li className="p-2 text-center">No users or conversations found</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ChatList;