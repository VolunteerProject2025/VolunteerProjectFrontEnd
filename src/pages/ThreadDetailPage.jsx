import { useState, useRef, useEffect } from "react";
import { Container, Navbar, Card, Badge, Row, Col, Button, Form, Image, Dropdown } from "react-bootstrap";
import {
  HandThumbsUp,
  HandThumbsDown,
  Share,
  BookmarkPlus,
  Bell,
  Flag,
  ThreeDots,
  Reply,
  Quote,
  Link45deg,
  Award,
} from "react-bootstrap-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useProfile } from "../hooks/profileHook";
import { AuthContext } from '../context/AuthContext';
import { useContext } from "react";
import axios from "axios";

export default function ThreadDetailPage() {
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserImg, setCurrentUserImg] = useState(null) // Lưu userId
  const replyFormRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const threadId = params.get("id");
  const { userProfile } = useProfile();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
          withCredentials: true,
        });
        setCurrentUserId(response.data.user.userId || response.data.user._id);
        setCurrentUserImg(response.data.user.img_profile)
      } catch (err) {
        console.error("Error fetching auth user:", err);
        setCurrentUserId(null);
      }
    };
    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    if (!threadId) return;
    const fetchData = async () => {
      try {
        const threadRes = await axios.get(`http://localhost:3000/threads/${threadId}`, {
          withCredentials: true,
        });
        setThread(threadRes.data);

        const commentRes = await axios.get(`http://localhost:3000/commentfs/${threadId}`, {
          withCredentials: true,
        });
        setComments(commentRes.data);
      } catch (err) {
        console.error("Error loading thread or comments:", err.message);
      }
    };
    fetchData();
  }, [threadId]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      alert("Please enter a comment");
      return;
    }
    if (!threadId) {
      alert("Thread ID is missing");
      return;
    }
    if (!currentUserId) {
      alert("Please log in to post a comment.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/commentfs",
        {
          content: replyContent,
          threadId: threadId,
          parentId: replyingTo,
        },
        { withCredentials: true }
      );

      setReplyContent("");
      setShowReplyForm(false);
      setReplyingTo(null);

      const res = await axios.get(`http://localhost:3000/commentfs/${threadId}`, {
        withCredentials: true,
      });
      setComments(res.data);

      const threadRes = await axios.get(`http://localhost:3000/threads/${threadId}`, {
        withCredentials: true,
      });
      setThread(threadRes.data);
    } catch (err) {
      alert(`Failed to post comment: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleReplyClick = (commentId = null) => {
    setReplyingTo(commentId);
    setShowReplyForm(true);
    setTimeout(() => {
      replyFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleLike = async () => {
    try {
      await axios.post(`http://localhost:3000/threads/${threadId}/like`, {}, { withCredentials: true });

      const res = await axios.get(`http://localhost:3000/threads/${threadId}`, {
        withCredentials: true,
      });
      setThread(res.data);
    } catch (err) {
      console.error("Failed to like:", err.message);
    }
  };

  const handleDislike = async () => {
    try {
      await axios.post(`http://localhost:3000/threads/${threadId}/dislike`, {}, { withCredentials: true });

      const res = await axios.get(`http://localhost:3000/threads/${threadId}`, {
        withCredentials: true,
      });
      setThread(res.data);
    } catch (err) {
      console.error("Failed to dislike:", err.message);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      await axios.post(`http://localhost:3000/commentfs/${commentId}/like`, {}, { withCredentials: true });

      const res = await axios.get(`http://localhost:3000/commentfs/${threadId}`, {
        withCredentials: true,
      });
      setComments(res.data);
    } catch (err) {
      console.error("Failed to like comment:", err.message);
    }
  };

  const handleCommentDislike = async (commentId) => {
    try {
      await axios.post(`http://localhost:3000/commentfs/${commentId}/dislike`, {}, { withCredentials: true });

      const res = await axios.get(`http://localhost:3000/commentfs/${threadId}`, {
        withCredentials: true,
      });
      setComments(res.data);
    } catch (err) {
      console.error("Failed to dislike comment:", err.message);
    }
  };

  const renderComments = (commentsList, parentId = null, depth = 0) => {
    const filtered = commentsList.filter((c) => c.parentId === parentId);
    if (!filtered.length) return null;

    return filtered.map((comment) => {
      const isCurrentUser = currentUserId && comment.authorId?._id && comment.authorId._id.toString() === currentUserId.toString();

      return (
        <div
          key={comment._id}
          className={`mb-3 ${depth > 0 ? "ms-4 ps-2 border-start border-2" : ""}`}
          id={`comment-${comment._id}`}
        >
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex">
                <div className="me-3">
                  <Image
                    src={comment.authorAvatar || "/placeholder.svg?height=48&width=48"}
                    roundedCircle
                    width={48}
                    height={48}
                    alt={comment.author}
                  />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-0 fw-bold">
                        {comment.author}
                        {comment.authorId && thread.authorId && comment.authorId._id?.toString() === thread.authorId.toString() && (
                          <Badge bg="primary" className="ms-2">OP</Badge>
                        )}
                        {isCurrentUser && (
                          <Badge bg="success" className="ms-2">You</Badge>
                        )}
                      </h6>
                      <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
                    </div>
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="link" className="text-muted p-0">
                        <ThreeDots size={16} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#"><Quote className="me-2" /> Quote</Dropdown.Item>
                        <Dropdown.Item href="#"><Link45deg className="me-2" /> Copy Link</Dropdown.Item>
                        <Dropdown.Item href="#"><Flag className="me-2" /> Report</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="mb-3">{comment.content}</div>
                  <div className="d-flex align-items-center">
                    <Button variant="link" className="text-muted p-0 me-3" onClick={() => handleCommentLike(comment._id)}>
                      <HandThumbsUp size={16} className="me-1" /> <small>{comment.likedBy?.length || 0}</small>
                    </Button>
                    <Button variant="link" className="text-muted p-0 me-3" onClick={() => handleCommentDislike(comment._id)}>
                      <HandThumbsDown size={16} className="me-1" /> <small>{comment.dislikedBy?.length || 0}</small>
                    </Button>
                    <Button variant="link" className="text-muted p-0" onClick={() => handleReplyClick(comment._id)}>
                      <Reply size={14} className="me-1" /> <small>Reply</small>
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
          {renderComments(commentsList, comment._id, depth + 1)}
        </div>
      );
    });
  };

  if (!thread) return <p className="text-center mt-5">Loading thread...</p>;

  return (
    <div className="min-h-screen bg-light">
      <Container className="mb-5">
        <h1 className="mb-0">{thread.title}</h1>
        <div className="d-flex mb-3">
          <Badge bg="primary" className="me-2">{thread.category}</Badge>
          {Array.isArray(thread.tagIds) &&
            thread.tagIds.map((tag, idx) => (
              <Badge key={idx} bg="secondary" className="me-2">
                {typeof tag === "string" ? tag : tag.name}
              </Badge>
            ))}
        </div>
        <div className="d-flex text-muted small mb-3">
          <div className="me-3"><i className="bi bi-chat"></i> {thread.replies} replies</div>
          <div className="me-3"><i className="bi bi-eye"></i> {thread.views} views</div>
          <div>Created {new Date(thread.createdAt).toLocaleDateString()}</div>
        </div>

        <Card className="shadow-sm mb-4">
          <Card.Body>
            <div className="d-flex">
              <div className="me-4 text-center" style={{ minWidth: "120px" }}>
                <Image src={thread.authorAvatar || "/placeholder.svg"} roundedCircle width={80} height={80} className="mb-2" />
                <h6 className="mb-1">
                  {thread.author}
                  <Badge bg="primary" className="ms-2">OP</Badge>
                  {currentUserId && thread.authorId.toString() === currentUserId.toString() && (
                    <Badge bg="success" className="ms-2">You</Badge>
                  )}
                </h6>
                <small className="text-muted d-block">Volunteer since {thread.memberSince}</small>
                <small className="text-muted d-block">Events: {thread.postCount}</small>
              </div>
              <div className="flex-grow-1">
                <div className="mb-4">
                  {thread.content?.split("\n").map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <div className="d-flex align-items-center">
                  <Button variant="link" className="text-muted p-0 me-3" onClick={handleLike}>
                    <HandThumbsUp size={16} className="me-1" /> <span>{thread.likedBy?.length || 0}</span>
                  </Button>
                  <Button variant="link" className="text-muted p-0 me-3" onClick={handleDislike}>
                    <HandThumbsDown size={16} className="me-1" /> <span>{thread.dislikedBy?.length || 0}</span>
                  </Button>
                  <Button variant="link" className="text-muted p-0" onClick={() => handleReplyClick(null)}>
                    <Reply size={16} className="me-1" /> <span>Reply</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>{thread.replies} Replies</h3>
          <Button variant="primary" onClick={() => handleReplyClick(null)}>
            Reply to Thread
          </Button>
        </div>

        <div className="mb-4">{renderComments(comments)}</div>

        {showReplyForm && (
          <div ref={replyFormRef}>
            <Card className="shadow-sm mb-4">
              <Card.Header>
                <h5 className="mb-0">{replyingTo ? "Reply to Comment" : "Reply to Thread"}</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleReplySubmit}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Write your reply here..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <Button variant="outline-secondary" onClick={() => setShowReplyForm(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Post Reply
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
}