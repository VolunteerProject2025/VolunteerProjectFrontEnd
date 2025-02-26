import React, { useState, useEffect } from 'react';
import { createPost, getPostById, updatePost } from '../postService';
import { useNavigate, useParams } from 'react-router-dom';

const PostForm = () => {
    const [post, setPost] = useState({ title: '', content: '', organization: '', author: '' });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            loadPost();
        }
    }, [id]);

    const loadPost = async () => {
        const result = await getPostById(id);
        setPost(result.data);
    };

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await updatePost(id, post);
            } else {
                await createPost(post);
            }
            navigate('/');
        } catch (error) {
            console.error('Error submitting form:', error.response.data);
        }
    };

    return (
        <div>
            <h2>{id ? 'Edit Post' : 'Add Post'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input type="text" name="title" value={post.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Content</label>
                    <textarea name="content" value={post.content} onChange={handleChange} required></textarea>
                </div>
                <div>
                    <label>Organization</label>
                    <input type="text" name="organization" value={post.organization} onChange={handleChange} required />
                </div>
                <div>
                    <label>Author</label>
                    <input type="text" name="author" value={post.author} onChange={handleChange} required />
                </div>
                <button type="submit">{id ? 'Update' : 'Add'}</button>
            </form>
        </div>
    );
};

export default PostForm;