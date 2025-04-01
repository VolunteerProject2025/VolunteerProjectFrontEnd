import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Navbar,
  Card,
  Form,
  Button,
  Row,
  Col,
  Badge,
  OverlayTrigger,
  Tooltip,
  InputGroup,
} from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom"; 
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/`;

export default function NewThreadPage() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthContext.Provider");
  }
  const { user, logout } = authContext;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [notifyOnReplies, setNotifyOnReplies] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load categories and tags from API
  useEffect(() => {
    const getQueryParam = (param) => {
      const searchParams = new URLSearchParams(location.search);
      return searchParams.get(param);
    };
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          axios.get(`${API_URL}topics`, { withCredentials: true }),
          axios.get(`${API_URL}tags`, { withCredentials: true }),
        ]);
        const categoriesData = categoriesResponse.data;
        setCategories(categoriesResponse.data);
        setTags(tagsResponse.data);

        const categorySlug = getQueryParam("category");
        if (categorySlug && categoriesData.length > 0) {
        const selected = categoriesData.find(
          (cat) => cat.slug === categorySlug || cat.name.toLowerCase().replace(/\s+/g, "-") === categorySlug
        );
        if (selected) {
          setSelectedCategory(selected._id);
        }
      } else if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0]._id);
      }
      } catch (err) {
        setError("Failed to load categories and tags. Please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTagToggle = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagId));
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to create a thread");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const threadData = {
        title,
        content,
        topicId: selectedCategory,
        tagIds: selectedTags,
        notifyOnReplies,
      };

      const response = await axios.post(`${API_URL}threads`, threadData, { withCredentials: true });
      if (response.status === 201) {
        alert("Thread created successfully!");
        navigate(`/forum/thread/detail?id=${response.data._id}`);
      }
    } catch (err) {
      setError("Failed to create thread. Please try again.");
      console.error("Error creating thread:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/forum/discussion?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const ToolbarButton = ({ icon, tooltip, onClick }) => (
    <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-${tooltip}`}>{tooltip}</Tooltip>}>
      <Button variant="outline-secondary" size="sm" className="me-1 mb-1" onClick={onClick} disabled={loading}>
        <i className={`bi bi-${icon}`}></i>
      </Button>
    </OverlayTrigger>
  );

  const renderPreview = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br>");
  };

  if (loading && !categories.length) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-light">
      <Container className="mb-5">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#" onClick={() => navigate("/forum")}>
                Home
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              New Thread
            </li>
          </ol>
        </nav>

        <div className="mb-4">
          <h1>Create New Thread</h1>
          <p className="text-muted">Share your volunteer experiences and questions with the community</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>Thread Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter a descriptive title for your volunteer topic"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Be specific and imagine you're asking a question to another volunteer.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="">Select a volunteer category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <ToolbarButton
                      icon="type-bold"
                      tooltip="Bold"
                      onClick={() => setContent(content + "**bold text**")}
                    />
                    <ToolbarButton
                      icon="type-italic"
                      tooltip="Italic"
                      onClick={() => setContent(content + "*italic text*")}
                    />
                    <ToolbarButton icon="code" tooltip="Code" onClick={() => setContent(content + "`code`")} />
                    <ToolbarButton
                      icon="link"
                      tooltip="Link"
                      onClick={() => setContent(content + "[link text](https://example.com)")}
                    />
                    <ToolbarButton
                      icon="list-ul"
                      tooltip="Bullet List"
                      onClick={() => setContent(content + "\n- List item\n- Another item")}
                    />
                    <ToolbarButton
                      icon="list-ol"
                      tooltip="Numbered List"
                      onClick={() => setContent(content + "\n1. First item\n2. Second item")}
                    />
                    <ToolbarButton
                      icon="image"
                      tooltip="Image"
                      onClick={() => setContent(content + "![alt text](https://example.com/image.jpg)")}
                    />
                  </div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setIsPreview(!isPreview)}
                    disabled={loading}
                  >
                    {isPreview ? "Edit" : "Preview"}
                  </Button>
                </div>
              </div>

              <Form.Group className="mb-4">
                <Form.Label>Thread Content</Form.Label>
                {isPreview ? (
                  <Card className="p-3" style={{ minHeight: "200px" }}>
                    <div dangerouslySetInnerHTML={{ __html: renderPreview(content) }} />
                  </Card>
                ) : (
                  <Form.Control
                    as="textarea"
                    rows={10}
                    placeholder="Share your volunteer experience, question, or idea here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    disabled={loading}
                  />
                )}
                <Form.Text className="text-muted">
                  Provide all the information other volunteers would need to understand your post.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Tags (up to 5)</Form.Label>
                <div className="mb-2">
                  {selectedTags.map((tagId) => {
                    const tag = tags.find((t) => t._id === tagId);
                    return (
                      <Badge key={tagId} bg="primary" className="me-2 mb-2 p-2" style={{ fontSize: "0.9rem" }}>
                        {tag?.name || "Unknown"}
                        <span
                          className="ms-2 cursor-pointer"
                          onClick={() => !loading && handleTagToggle(tagId)}
                          style={{ cursor: loading ? "not-allowed" : "pointer" }}
                        >
                          ×
                        </span>
                      </Badge>
                    );
                  })}
                </div>
                <div className="d-flex flex-wrap">
                  {tags
                    .filter((tag) => !selectedTags.includes(tag._id))
                    .map((tag) => (
                      <Badge
                        key={tag._id}
                        bg="light"
                        text="dark"
                        className="me-2 mb-2 p-2"
                        style={{ fontSize: "0.9rem", cursor: loading ? "not-allowed" : "pointer" }}
                        onClick={() => !loading && handleTagToggle(tag._id)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                </div>
                <Form.Text className="text-muted">
                  Add up to 5 tags to describe what your volunteer thread is about.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  id="notify-replies"
                  label="Notify me when someone replies"
                  checked={notifyOnReplies}
                  onChange={(e) => setNotifyOnReplies(e.target.checked)}
                  disabled={loading}
                />
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => navigate("/forum")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={loading || !user}>
                  {loading ? "Posting..." : "Post Thread"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        <Card className="shadow-sm">
          <Card.Header>
            <h5 className="mb-0">Volunteer Forum Guidelines</h5>
          </Card.Header>
          <Card.Body>
            <ul className="mb-0">
              <li>Be respectful and supportive of fellow volunteers.</li>
              <li>Share specific details about your volunteer experience or question.</li>
              <li>Respect confidentiality of the communities and individuals you serve.</li>
              <li>Use appropriate formatting to make your post easy to read.</li>
              <li>Tag your thread appropriately to reach volunteers with relevant experience.</li>
            </ul>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}