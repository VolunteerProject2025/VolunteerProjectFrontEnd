import { useEffect, useState, useContext } from 'react';
import { getPosts, deletePost, likePost, addComment } from '../hooks/postService';
import { Link, useNavigate } from 'react-router-dom';
import { FaClock, FaMapMarkerAlt, FaHeart, FaShare, FaComment, FaEllipsisV, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';
import { AuthContext } from '../context/AuthContext';
import '../assets/css/events.css';

export function PostList() {
    const [posts, setPosts] = useState([]);
    const [commentInput, setCommentInput] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [showComments, setShowComments] = useState({});
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const currentUserId = user?._id || null;

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            console.log('Fetching posts, user:', user);
            try {
                const result = await getPosts();
                console.log('Posts fetched successfully:', result.data);
                setPosts(Array.isArray(result.data) ? result.data : []);
            } catch (err) {
                console.error('Error fetching posts:', err);
                console.log('Error response:', err.response?.status, err.response?.data);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    console.log('Unauthorized detected, but not redirecting yet for debugging');
                    setError('Please log in to view posts');
                    // Tạm thời comment để ngăn navigate
                    // navigate('/login');
                } else {
                    setError(err.response?.data?.message || 'Failed to load posts');
                }
                setPosts([]);
            } finally {
                setLoading(false);
                console.log('Fetch completed, loading:', false, 'error:', error);
            }
        };
        fetchPosts();
    }, [navigate, user]); // Thêm user vào dependency để theo dõi trạng thái đăng nhập

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

    const handleShare = (postId) => {
        const shareUrl = `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
    };

    const handleComment = async (postId) => {
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
                userId: currentUserId 
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

    console.log('Rendering PostList, loading:', loading, 'error:', error, 'posts length:', posts.length);

    return (
        <main className="main post-list">
            <section className="events-inner">
                <div className="container">
                    {console.log('Rendering Add Post button')}
                    <div style={{ marginBottom: '20px' }}>
                        <Link
                            to="/add"
                            style={{
                                display: 'inline-block',
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
                                style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white' }}
                            >
                                Reload Page
                            </button>
                        </div>
                    )}

                    {posts.length === 0 && !loading && !error ? (
                        <p className="no-posts">No posts available.</p>
                    ) : (
                        <div className="posts-grid">
                            {posts.map(post => (
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
                                            {menuOpen === post._id && (
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
                                        src={post.image ? `http://localhost:3000${post.image}` : 'img/event_4.jpg'}
                                        alt={post.title}
                                        loading="lazy"
                                    />
                                    <div className="post-content">
                                        <h6 className="post-title">
                                            <Link to={`/edit/${post._id}`}>{post.title}</Link>
                                        </h6>
                                        <p className="post-excerpt" style={{ whiteSpace: 'pre-wrap' }}>
                                            {post.content}
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
                                            <button 
                                                onClick={() => handleShare(post._id)}
                                                className="action-button"
                                            >
                                                <FaShare /> <span>Share</span>
                                            </button>
                                            <div className="share-buttons">
                                                <FacebookShareButton url={`${window.location.origin}/post/${post._id}`} quote={post.title}>
                                                    <FacebookIcon size={32} round />
                                                </FacebookShareButton>
                                                <TwitterShareButton url={`${window.location.origin}/post/${post._id}`} title={post.title}>
                                                    <TwitterIcon size={32} round />
                                                </TwitterShareButton>
                                            </div>
                                            <button 
                                                className="action-button"
                                                onClick={() => toggleComments(post._id)}
                                            >
                                                <FaComment /> <span>{post.comments.length}</span>
                                            </button>
                                        </div>
                                        {showComments[post._id] ? (
                                            <div className="comments-section">
                                                {post.comments && post.comments.length > 0 ? (
                                                    post.comments.map(comment => (
                                                        <div key={comment._id} className="comment">
                                                            <img
                                                                src={comment.author?.avatar || 'https://via.placeholder.com/40'}
                                                                alt="Avatar"
                                                                className="comment-avatar"
                                                            />
                                                            <div className="comment-content">
                                                                <p className="comment-author">
                                                                    {comment.author?.fullName || 'Unknown User'}
                                                                </p>
                                                                <p>{comment.content}</p>
                                                                <p className="comment-time">
                                                                    {comment.relativeTime || new Date(comment.createdAt).toLocaleTimeString()}
                                                                </p>
                                                                <button
                                                                    onClick={() => handleReply(post._id, comment._id, comment.author?.fullName)}
                                                                    className="reply-button"
                                                                >
                                                                    Reply
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
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
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default PostList;