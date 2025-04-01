import { useEffect, useState } from "react";
import {
  Container,
  Navbar,
  Nav,
  Card,
  Badge,
  Row,
  Col,
  Button,
  Form,
  ListGroup,
  Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [threads, setThreads] = useState([]);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicRes = await axios.get("http://localhost:3000/topics");
        const threadRes = await axios.get("http://localhost:3000/threads");
        const tagRes = await axios.get("http://localhost:3000/tags");
  
        const topics = Array.isArray(topicRes.data) ? topicRes.data.map((topic) => ({
          ...topic,
          lastUpdated: topic.lastUpdated
            ? new Date(topic.lastUpdated).toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "short",
              })
            : "No activity",
        })) : [];
  
        const threads = Array.isArray(threadRes.data) ? threadRes.data.slice(0, 5).map((thread) => ({
          id: thread._id,
          title: thread.title,
          preview: thread.content?.slice(0, 120) + "...",
          author: thread.author,
          authorAvatar: thread.authorAvatar || "/placeholder.svg",
          postedAt: new Date(thread.createdAt).toLocaleDateString(),
          category: thread.topicId?.name || "General",
          replies: thread.replies || 0,
          views: thread.views || 0,
          isPinned: thread.isPinned,
        })) : [];
  
        const tags = Array.isArray(tagRes.data) ? tagRes.data.map((tag) => ({
          id: tag._id,
          name: tag.name,
        })) : [];
  
        setCategories(topics);
        setThreads(threads);
        setTags(tags);
      } catch (err) {
        console.error("Error fetching forum data:", err.message);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div className="min-h-screen bg-light">
      {/* Navigation */}
      <Container className="mb-5">
        {/* Forum Header */}
        <div className="text-center mb-4">
          <h1>Welcome to Volunteer Hub</h1>
          <p className="text-muted">
            Connect with fellow volunteers and share your experiences
          </p>
        </div>

        {/* Forum Categories */}
        <h2 className="mb-3">Volunteer Categories</h2>
        <Row xs={1} md={2} lg={3} className="g-4 mb-5">
          {categories.map((category) => (
            <Col key={category._id}>
              <Card
                className="h-100 shadow-sm"
                onClick={() =>
                  navigate(
                    `/forum/discussion?category=${category.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Card.Title>{category.name}</Card.Title>
                    <Badge bg={category.badgeColor || "secondary"} pill>
                      {category.threadCount}
                    </Badge>
                  </div>
                  <Card.Text>{category.description}</Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white">
                  <small className="text-muted">
                    Last updated {category.lastUpdated}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Recent Discussions */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Recent Discussions</h2>
          <Button variant="primary" onClick={() => navigate("/forum/new-thread")}>
            New Thread
          </Button>
        </div>

        <Card className="shadow-sm mb-5">
          <ListGroup variant="flush">
            {threads.map((thread) => (
              <ListGroup.Item
                key={thread.id}
                className="py-3"
                onClick={() =>
                  navigate(`/forum/thread/detail?id=${thread.id}`)
                }
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex">
                  <div className="me-3">
                    <Image
                      src={thread.authorAvatar}
                      roundedCircle
                      width={48}
                      height={48}
                      alt={thread.author}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5>{thread.title}</h5>
                      <Badge
                        bg={thread.isPinned ? "danger" : "secondary"}
                        className="ms-2"
                      >
                        {thread.isPinned ? "Pinned" : thread.category}
                      </Badge>
                    </div>
                    <p className="text-muted mb-1">{thread.preview}</p>
                    <div className="d-flex align-items-center">
                      <small className="text-muted">
                        Posted by{" "}
                        <span className="fw-bold">{thread.author}</span> •{" "}
                        {thread.postedAt}
                      </small>
                      <div className="ms-auto d-flex align-items-center">
                        <span className="me-3">
                          <i className="bi bi-chat"></i> {thread.replies}
                        </span>
                        <span>
                          <i className="bi bi-eye"></i> {thread.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>

        {/* Popular Tags */}
        <h2 className="mb-3">Popular Volunteer Tags</h2>
        <div className="mb-5">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              bg="light"
              text="dark"
              className="me-2 mb-2 p-2"
              style={{ fontSize: "0.9rem" }}
            >
              {tag.name}
            </Badge>
          ))}
        </div>

        {/* Forum Stats (static for now) */}
        <Row className="text-center mb-4">
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h3>1,245</h3>
                <p className="text-muted mb-0">Volunteers</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h3>5,678</h3>
                <p className="text-muted mb-0">Threads</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h3>32,901</h3>
                <p className="text-muted mb-0">Posts</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
