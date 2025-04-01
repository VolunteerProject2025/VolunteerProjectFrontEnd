import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Navbar,
  Card,
  Badge,
  Row,
  Col,
  Button,
  Form,
  Dropdown,
  Pagination,
  Image,
  InputGroup,
} from "react-bootstrap";
import { Search, Filter, ArrowUp, ArrowDown, BookmarkPlus, Bell, Share } from "react-bootstrap-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/`;

export default function DiscussionsPage() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthContext.Provider");
  }
  const { user, login, logout } = authContext;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [threads, setThreads] = useState([]);
  const [topics, setTopics] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [renderKey, setRenderKey] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const itemsPerPage = 10;

  const getQueryParam = (param) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const topicsResponse = await axios.get(`${API_URL}topics`, { withCredentials: true });
        const topicsData = topicsResponse.data;
        setTopics(topicsData);

        const categorySlug = getQueryParam("category");
        let selectedCategory = null;
        if (categorySlug && topicsData && topicsData.length > 0) {
          selectedCategory = topicsData.find(
            (topic) => topic.slug === categorySlug || topic.name.toLowerCase().replace(/\s+/g, "-") === categorySlug
          );
        }
        if (!selectedCategory && topicsData && topicsData.length > 0) {
          selectedCategory = topicsData[0];
        }
        setCurrentCategory(selectedCategory);

        if (selectedCategory && selectedCategory._id) {
          setIsLoadingThreads(true);
          try {
            const threadsResponse = await axios.get(`${API_URL}threads`, {
              params: {
                topic: selectedCategory._id,
                search: searchQuery,
                sort: sortBy,
                filter: filterBy,
                page: currentPage,
                limit: itemsPerPage,
              },
              withCredentials: true,
            });
            const threadsData = Array.isArray(threadsResponse.data) ? [...threadsResponse.data] : [];
            if (threadsData.length > 0) {
              setThreads([...threadsData]);
            } else {
              console.log("No threads found in response, setting threads to empty array");
              setThreads([]);
            }
            setTotalPages(Math.ceil((threadsResponse.data.total || 0) / itemsPerPage));
            setRenderKey((prev) => prev + 1);
          } catch (error) {
            console.error("Error fetching threads:", error);
            setThreads([]);
          } finally {
            console.log("Finished loading threads, isLoadingThreads should be false");
            setIsLoadingThreads(false);
          }
        } else {
          console.log("No valid category selected, skipping thread loading");
          setThreads([]);
          setIsLoadingThreads(false);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        setThreads([]);
        setIsLoadingThreads(false);
      }
    };
    loadData();
  }, [location.search, searchQuery, sortBy, filterBy, currentPage]);

  useEffect(() => {
    if (threads.length > 0) {
      setRenderKey((prev) => prev + 1);
    }
  }, [threads]);

  const handleCreateThread = () => {
    if (!user) {
      alert("Please log in to create a thread");
      navigate("/login");
      return;
    }
    // Chuyển hướng tới trang NewThreadPage với category hiện tại
    navigate(`/forum/new-thread?category=${currentCategory?.slug || currentCategory?.name.toLowerCase().replace(/\s+/g, "-")}`);
  };

  const handleLike = async (threadId) => {
    if (!user) {
      alert("Please log in to like a thread");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}threads/${threadId}/like`, {}, { withCredentials: true });
      const updatedThread = response.data;
      setThreads(threads.map((t) => (t._id === threadId ? updatedThread : t)));
    } catch (error) {
      console.error("Error liking thread:", error);
      alert("Failed to like thread");
    }
  };

  const handleDislike = async (threadId) => {
    if (!user) {
      alert("Please log in to dislike a thread");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}threads/${threadId}/dislike`, {}, { withCredentials: true });
      const updatedThread = response.data;
      setThreads(threads.map((t) => (t._id === threadId ? updatedThread : t)));
    } catch (error) {
      console.error("Error disliking thread:", error);
      alert("Failed to like thread");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
              {currentCategory?.name || "Loading..."}
            </li>
          </ol>
        </nav>

        <div className="mb-4">
          <div className="d-flex align-items-center mb-2">
            <h1 className="mb-0">{currentCategory?.name || "Loading..."}</h1>
            <Badge bg={currentCategory?.badgeColor || "primary"} className="ms-3">
              {currentCategory?.threadCount || 0} Threads
            </Badge>
          </div>
          <p className="text-muted">{currentCategory?.description || ""}</p>
        </div>

        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text id="search-addon">
                    <Search />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort">
                    <span>Sort: {sortBy.replace("_", " ")}</span>
                    {sortBy.includes("most") ? <ArrowDown className="ms-2" /> : <ArrowUp className="ms-2" />}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSortBy("newest")}>Newest</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy("oldest")}>Oldest</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy("most_replies")}>Most replies</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy("most_views")}>Most views</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy("recently_active")}>Recently active</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col md={3}>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" id="dropdown-filter">
                    <span>Filter: {filterBy.replace("_", " ")}</span>
                    <Filter className="ms-2" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setFilterBy("all")}>All threads</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilterBy("pinned")}>Pinned only</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilterBy("solved")}>Solved only</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilterBy("unanswered")}>Unanswered only</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="text-muted">
              Showing {threads ? threads.length : 0} of {totalPages * itemsPerPage} discussions
            </span>
          </div>
          <Button variant="primary" onClick={handleCreateThread}>
            Start New Discussion
          </Button>
        </div>

        <Card className="shadow-sm mb-4" key={renderKey}>
          {isLoadingThreads ? (
            <div className="p-5 text-center">
              <p className="mb-0">Loading discussions...</p>
            </div>
          ) : Array.isArray(threads) && threads.length > 0 ? (
            threads.map((discussion, index) => {
              if (!discussion || !discussion._id) {
                console.log("Skipping discussion due to missing _id:", discussion);
                return null;
              }
              return (
                <div
                  key={discussion._id}
                  className={`p-3 ${index !== threads.length - 1 ? "border-bottom" : ""}`}
                  onClick={() => navigate(`/forum/thread/detail?id=${discussion._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex">
                    <div className="me-3">
                      <Image
                        src={discussion.authorAvatar || "/placeholder.svg?height=48&width=48"}
                        roundedCircle
                        width={48}
                        height={48}
                        alt={discussion.author || "Unknown"}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div>
                          <h5 className="mb-0">{discussion.title || "Untitled"}</h5>
                          <div className="d-flex align-items-center mt-1">
                            <small className="text-muted">
                              Started by <span className="fw-bold">{discussion.author || "Unknown"}</span> •{" "}
                              {discussion.createdAt
                                ? new Date(discussion.createdAt).toLocaleDateString()
                                : "Unknown date"}
                            </small>
                            {discussion.isPinned && <Badge bg="danger" className="ms-2">Pinned</Badge>}
                            {discussion.isSolved && <Badge bg="success" className="ms-2">Solved</Badge>}
                          </div>
                        </div>
                        <div className="d-flex">
                          <Button
                            variant="link"
                            className="text-muted p-0 me-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(discussion._id);
                            }}
                          >
                            👍 {(discussion.likedBy || []).length || 0}
                          </Button>
                          <Button
                            variant="link"
                            className="text-muted p-0 me-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDislike(discussion._id);
                            }}
                          >
                            👎 {(discussion.dislikedBy || []).length || 0}
                          </Button>
                          <Button
                            variant="link"
                            className="text-muted p-0 me-3"
                            title="Bookmark"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <BookmarkPlus size={16} />
                          </Button>
                          <Button
                            variant="link"
                            className="text-muted p-0 me-3"
                            title="Subscribe"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Bell size={16} />
                          </Button>
                          <Button
                            variant="link"
                            className="text-muted p-0"
                            title="Share"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Share size={16} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted mb-2">{(discussion.content || "").slice(0, 100)}...</p>
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <small className="text-muted">
                            <i className="bi bi-chat"></i> {discussion.replies || 0} replies
                          </small>
                        </div>
                        <div className="me-3">
                          <small className="text-muted">
                            <i className="bi bi-eye"></i> {discussion.views || 0} views
                          </small>
                        </div>
                        <div className="ms-auto">
                          <small className="text-muted">
                            Last reply{" "}
                            {discussion.updatedAt
                              ? new Date(discussion.updatedAt).toLocaleString()
                              : "Unknown"}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-5 text-center">
              <p className="mb-0">No discussions found matching your criteria.</p>
            </div>
          )}
        </Card>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
              <Pagination.Prev
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
                .map((page, index, array) => {
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <Pagination.Ellipsis disabled />
                        <Pagination.Item active={page === currentPage} onClick={() => setCurrentPage(page)}>
                          {page}
                        </Pagination.Item>
                      </React.Fragment>
                    );
                  }
                  return (
                    <Pagination.Item key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
                      {page}
                    </Pagination.Item>
                  );
                })}
              <Pagination.Next
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        )}

        <Card className="shadow-sm mt-4">
          <Card.Body>
            <Row className="text-center">
              <Col md={4}>
                <h4>{currentCategory?.threadCount || 0}</h4>
                <p className="text-muted mb-0">Discussions</p>
              </Col>
              <Col md={4}>
                <h4>{currentCategory?.postCount || 0}</h4>
                <p className="text-muted mb-0">Posts</p>
              </Col>
              <Col md={4}>
                <h4>{currentCategory?.memberCount || 0}</h4>
                <p className="text-muted mb-0">Volunteers</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}