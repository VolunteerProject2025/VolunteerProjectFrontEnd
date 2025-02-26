import React, { useEffect, useState } from 'react';
import { getPosts, deletePost } from '../postService';
import { Link } from 'react-router-dom';

const PostList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        const result = await getPosts();
        setPosts(result.data);
    };

    const handleDelete = async (id) => {
        await deletePost(id);
        loadPosts();
    };

    return (
        <div>
            <h2>Posts</h2>
            <Link to="/add">Add Post</Link>
            <ul>
                {posts.map(post => (
                    <li key={post._id}>
                        <Link to={`/edit/${post._id}`}>{post.title}</Link>
                        <button onClick={() => handleDelete(post._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostList;