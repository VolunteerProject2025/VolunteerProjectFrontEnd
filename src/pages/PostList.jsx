import React, { useEffect, useState } from 'react';
import { getPosts, deletePost } from '../hooks/postService';
import { Link } from 'react-router-dom';
import '../assets/css/events.css';

export function PostList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        const result = await getPosts();
        console.log('API Response:', result.data); // Kiểm tra dữ liệu (tùy chọn)
        setPosts(result.data);
    };

    const handleDelete = async (id) => {
        await deletePost(id);
        loadPosts();
    };

    return (
        <main className="main">


            {/* Events Inner Section */}
            <section className="section events-inner">
                <img className="events-inner__bg" src="img/events_inner-bg.png" alt="img" />
                <div className="container">
                    <div className="row offset-30">
                        <div className="col-xl-10 offset-xl-1">
                            {/* Nút Add Post */}
                            <div className="mb-4">
                                <Link to="/add" className="button button-primary">
                                    <span>Add Post</span>
                                </Link>
                            </div>
                        </div>

                        {posts.map(post => (
                            <div className="col-xl-10 offset-xl-1" key={post._id}>
                                <div className="upcoming-item">
                                    {/* Ngày tháng từ createdAt */}
                                    <div className="upcoming-item__date">
                                        <span>{new Date(post.createdAt).getDate()}</span>
                                        <span>{new Date(post.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' })}</span>
                                    </div>
                                    <div className="upcoming-item__body">
                                        <div className="row align-items-center">
                                            <div className="col-lg-5 col-xl-4">
                                                <div className="upcoming-item__img">
                                                    <img className="img--bg" src="img/event_4.jpg" alt="img" />
                                                </div>
                                            </div>
                                            <div className="col-lg-7 col-xl-8">
                                                <div className="upcoming-item__description">
                                                    <h6 className="upcoming-item__title">
                                                        <Link to={`/edit/${post._id}`}>{post.title}</Link>
                                                    </h6>
                                                    <p>{post.content.substring(0, 100)}...</p>
                                                    <div className="upcoming-item__details">
                                                        <p>
                                                            <svg className="icon">
                                                                <use xlinkHref="#clock"></use>
                                                            </svg>
                                                            <strong>{post.organization ? post.organization.name : 'Unknown'}</strong>
                                                        </p>
                                                        <p>
                                                            <svg className="icon">
                                                                <use xlinkHref="#placeholder"></use>
                                                            </svg>
                                                            <strong>{post.author ? post.author.fullName : 'Unknown'}</strong>
                                                        </p>
                                                    </div>
                                                    {/* Nút Delete */}
                                                    <button
                                                        onClick={() => handleDelete(post._id)}
                                                        className="button button-danger"
                                                    >
                                                        <span>Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}

export default PostList;