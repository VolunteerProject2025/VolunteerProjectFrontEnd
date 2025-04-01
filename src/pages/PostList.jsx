import { useEffect, useState, useContext } from 'react';
import { getPosts, deletePost, likePost, addComment, editComment, deleteComment } from '../hooks/postService';
import { Link, useNavigate } from 'react-router-dom';
import { FaClock, FaMapMarkerAlt, FaHeart, FaShare, FaComment, FaEllipsisV, FaTrash, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { TwitterShareButton, TwitterIcon, FacebookIcon } from 'react-share';
import { AuthContext } from '../context/AuthContext';
import '../assets/css/events.css';

export function PostList() {
    const [posts, setPosts] = useState([]);
    const [commentInput, setCommentInput] = useState({});
    const [editingComment, setEditingComment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [commentMenuOpen, setCommentMenuOpen] = useState(null);
    const [showComments, setShowComments] = useState({});
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const currentUserId = user?._id || null;
    const userRole = user?.role || 'Guest';

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const result = await getPosts();
                setPosts(Array.isArray(result.data) ? result.data : []);
            } catch (err) {
                console.error('Error fetching posts:', err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    setError('Please log in to view posts');
                } else {
                    setError(err.response?.data?.message || 'Failed to load posts');
                }
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [navigate, user]);

    const loadPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getPosts();
            setPosts(Array.isArray(result.data) ? result.data : []);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to load posts');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (userRole !== 'Organization') {
            alert('Only users with the Organization role can delete posts.');
            return;
        }
        try {
            await deletePost(id);
            await loadPosts();
            setMenuOpen(null);
            alert('Post moved to trash successfully!');
        } catch (error) {
            alert('Failed to move post to trash: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleLike = async (postId) => {
        if (!currentUserId) {
            alert('Please log in to like this post!');
            navigate('/login');
            return;
        }
        try {
            const response = await likePost(postId, { userId: currentUserId });
            setPosts(posts.map(post => 
                post._id === postId ? response.data : post
            ));
        } catch (error) {
            alert('Failed to like post: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleComment = async (postId, parentId = null) => {
        if (!commentInput[postId]) {
            alert('Please enter a comment.');
            return;
        }
        if (!currentUserId) {
            alert('Please log in to comment on this post!');
            navigate('/login');
            return;
        }
        setLoading(true);
        try {
            const response = await addComment(postId, { 
                content: commentInput[postId], 
                userId: currentUserId,
                parentId
            });
            setPosts(posts.map(post => 
                post._id === postId ? response.data : post
            ));
            setCommentInput({ ...commentInput, [postId]: '' });
            setShowComments({ ...showComments, [postId]: true });
        } catch (error) {
            alert('Failed to add comment: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleEditComment = (postId, commentId, content) => {
        setEditingComment({ postId, commentId, content });
        setCommentInput({ ...commentInput, [commentId]: content }); // Sử dụng commentId làm key để lưu nội dung chỉnh sửa
        setCommentMenuOpen(null);
    };

    const handleSaveEditComment = async (postId, commentId) => {
        if (!commentInput[commentId]) {
            alert('Please enter some content to save.');
            return;
        }
        setLoading(true);
        try {
            const response = await editComment(postId, commentId, { content: commentInput[commentId] });
            setPosts(posts.map(post => 
                post._id === postId ? response.data : post
            ));
            setEditingComment(null);
            setCommentInput({ ...commentInput, [commentId]: '' });
        } catch (error) {
            alert('Failed to edit comment: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        setLoading(true);
        try {
            const response = await deleteComment(postId, commentId);
            setPosts(posts.map(post => 
                post._id === postId ? response.data : post
            ));
            setCommentMenuOpen(null);
        } catch (error) {
            alert('Failed to delete comment: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleReply = (postId, commentId, authorName) => {
        setCommentInput({ ...commentInput, [postId]: `@${authorName || 'User'} ` });
        setShowComments({ ...showComments, [postId]: true });
    };

    const toggleComments = (postId) => {
        setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const toggleMenu = (postId) => {
        setMenuOpen(prev => (prev === postId ? null : postId));
    };

    const toggleCommentMenu = (commentId) => {
        setCommentMenuOpen(prev => (prev === commentId ? null : commentId));
    };

    const renderComments = (comments, postId, parentId = null, level = 0) => {
        return comments
            .filter(comment => (comment.parentId ? comment.parentId.toString() : null) === parentId)
            .map(comment => (
                <div key={comment._id} className={`comment level-${level}`}>
                    {level > 0 && <div className="comment-connector"></div>}
                    <img
                        src={comment.author?.avatar || 'https://via.placeholder.com/40'}
                        alt="Avatar"
                        className="comment-avatar"
                    />
                    <div className="comment-content">
                        <div className="comment-header">
                            <p className="comment-author">
                                {comment.author?.fullName || 'Unknown User'}
                            </p>
                            {(comment.author?._id === currentUserId || userRole === 'Organization') && (
                                <div className="comment-menu">
                                    <button
                                        className="comment-menu-button"
                                        onClick={() => toggleCommentMenu(comment._id)}
                                    >
                                        <FaEllipsisV />
                                    </button>
                                    {commentMenuOpen === comment._id && (
                                        <div className="comment-dropdown-menu">
                                            {comment.author?._id === currentUserId && (
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleEditComment(postId, comment._id, comment.content)}
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                            )}
                                            {(comment.author?._id === currentUserId || userRole === 'Organization') && (
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleDeleteComment(postId, comment._id)}
                                                >
                                                    <FaTrash /> Delete
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {editingComment?.commentId === comment._id ? (
                            <div className="edit-comment-form">
                                <input
                                    type="text"
                                    value={commentInput[comment._id] || ''}
                                    onChange={(e) => setCommentInput({ ...commentInput, [comment._id]: e.target.value })}
                                    placeholder="Edit your comment..."
                                    className="edit-comment-input"
                                    autoFocus
                                />
                                <div className="edit-comment-actions">
                                    <button
                                        onClick={() => handleSaveEditComment(postId, comment._id)}
                                        className="save-edit-button"
                                        disabled={loading}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingComment(null)}
                                        className="cancel-edit-button"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="comment-text">{comment.content}</p>
                                <div className="comment-footer">
                                    <button
                                        onClick={() => handleReply(postId, comment._id, comment.author?.fullName)}
                                        className="reply-button"
                                    >
                                        Reply
                                    </button>
                                    <p className="comment-time">
                                        {comment.relativeTime || new Date(comment.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </>
                        )}
                        {renderComments(comments, postId, comment._id, level + 1)}
                    </div>
                </div>
            ));
    };

    return (
        <main className="main post-list">
            <section className="events-inner">
                <div className="container">
                    {userRole === 'Organization' && (
                        <div className="add-post" style={{ marginBottom: '20px', display: 'block !important' }}>
                            <Link 
                                to="/add" 
                                className="button button-primary"
                                style={{
                                    display: 'inline-block !important',
                                    padding: '10px 20px',
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '5px',
                                    fontSize: '16px'
                                }}
                            >
                                Add Post
                            </Link>
                        </div>
                    )}

                    {loading && (
                        <div className="loading-overlay">
                            <div className="spinner"></div>
                            <p>Loading...</p>
                        </div>
                    )}

                    {error && (
                        <div style={{ textAlign: 'center', color: 'red', padding: '20px' }}>
                            <p>{error}</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="button button-primary"
                            >
                                Reload Page
                            </button>
                        </div>
                    )}

                    {posts.length === 0 && !loading && !error ? (
                        <p className="no-posts">No posts available.</p>
                    ) : (
                        <div className="posts-grid">
                            {posts.map(post => {
                                const shareUrl = `${window.location.origin}/post/${post._id}`;
                                const shareTitle = post.title || 'Untitled Post';
                                const shareDescription = post.content || 'No content available';
                                const shareImage = post.image ? `http://localhost:3000${post.image}` : 'https://via.placeholder.com/200';
                                const hashtags = [
                                    'Volunteer',
                                    'Event',
                                    'Community',
                                    post.organization?.name || 'Org'
                                ].filter(Boolean);

                                const shareContent = `${shareTitle} - ${shareDescription} ${shareUrl} ${hashtags.map(h => `#${h}`).join(' ')}`;

                                const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}"e=${encodeURIComponent(shareContent)}`;
                                console.log('Facebook Share URL:', facebookShareUrl);

                                const twitterShareContent = shareContent.length > 280 
                                    ? `${shareTitle} - ${shareDescription.substring(0, 200)}... ${shareUrl}` 
                                    : shareContent;
                                console.log('Twitter Share Content:', twitterShareContent);

                                return (
                                    <div key={post._id} className="post-card">
                                        <div className="post-header">
                                            <div className="post-date">
                                                <span>{new Date(post.createdAt).getDate()}</span>
                                                <span>{new Date(post.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' })}</span>
                                            </div>
                                            <div className="post-menu">
                                                <button 
                                                    className="menu-button" 
                                                    onClick={() => toggleMenu(post._id)}
                                                >
                                                    <FaEllipsisV />
                                                </button>
                                                {menuOpen === post._id && userRole === 'Organization' && (
                                                    <div 
                                                        className="dropdown-menu" 
                                                        style={{ 
                                                            position: 'absolute', 
                                                            top: '100%', 
                                                            right: '0', 
                                                            display: 'block'
                                                        }}
                                                    >
                                                        <button 
                                                            className="dropdown-item" 
                                                            onClick={() => handleDelete(post._id)}
                                                        >
                                                            <FaTrash /> Move to Trash
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <img
                                            className="post-image"
                                            src={shareImage}
                                            alt={shareTitle}
                                            loading="lazy"
                                        />
                                        <div className="post-content">
                                            <h6 className="post-title">
                                                <Link to={`/edit/${post._id}`}>{shareTitle}</Link>
                                            </h6>
                                            <p className="post-excerpt" style={{ whiteSpace: 'pre-wrap' }}>
                                                {shareDescription}
                                            </p>
                                            <div className="post-details">
                                                <p><FaClock /> {post.organization?.name || 'Unknown'}</p>
                                                <p><FaMapMarkerAlt /> {post.author?.fullName || 'Unknown'}</p>
                                            </div>
                                            <div className="post-actions">
                                                <motion.button
                                                    onClick={() => handleLike(post._id)}
                                                    className="action-button like-button"
                                                    style={{ color: post.likes.includes(currentUserId) ? '#e0245e' : '#6b7280' }}
                                                    whileTap={{ scale: 1.2 }}
                                                >
                                                    <FaHeart /> <span>{post.likes.length}</span>
                                                </motion.button>
                                                <div className="share-container">
                                                    <button 
                                                        className="action-button share-button"
                                                        onClick={(e) => e.preventDefault()}
                                                    >
                                                        <FaShare /> <span>Share</span>
                                                    </button>
                                                    <div className="share-options">
                                                        <button
                                                            onClick={() => {
                                                                console.log('Opening Facebook Share:', facebookShareUrl);
                                                                window.open(facebookShareUrl, '_blank', 'width=600,height=400');
                                                            }}
                                                        >
                                                            <FacebookIcon size={32} round />
                                                        </button>
                                                        <TwitterShareButton
                                                            url={shareUrl}
                                                            title={twitterShareContent}
                                                            beforeOnClick={() => {
                                                                console.log('Sharing to Twitter:', { url: shareUrl, title: twitterShareContent });
                                                                return Promise.resolve();
                                                            }}
                                                            onShareWindowClose={() => console.log('Twitter share window closed')}
                                                        >
                                                            <TwitterIcon size={32} round />
                                                        </TwitterShareButton>
                                                    </div>
                                                </div>
                                                <button 
                                                    className="action-button"
                                                    onClick={() => toggleComments(post._id)}
                                                >
                                                    <FaComment /> <span>{post.comments.length}</span>
                                                </button>
                                            </div>
                                            {showComments[post._id] && (
                                                <div className="comments-section">
                                                    {post.comments && post.comments.length > 0 ? (
                                                        renderComments(post.comments, post._id)
                                                    ) : (
                                                        <p className="no-comments">No comments yet.</p>
                                                    )}
                                                    <div className="comment-input">
                                                        <input
                                                            type="text"
                                                            value={commentInput[post._id] || ''}
                                                            onChange={(e) => setCommentInput({ ...commentInput, [post._id]: e.target.value })}
                                                            placeholder="Write a comment..."
                                                        />
                                                        <button
                                                            onClick={() => handleComment(post._id)}
                                                            className="button button-primary"
                                                            disabled={loading}
                                                        >
                                                            Comment
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default PostList;