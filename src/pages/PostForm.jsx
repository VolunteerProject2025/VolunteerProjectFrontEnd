import { useState, useEffect } from 'react';
import { createPost, getPostById, updatePost } from '../hooks/postService';
import { useNavigate, useParams } from 'react-router-dom';

export function PostForm() {
    const [post, setPost] = useState({ title: '', content: '', organization: '', author: '', image: null });
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
        if (e.target.name === 'image') {
            setPost({ ...post, image: e.target.files[0] }); // Lưu file ảnh
        } else {
            setPost({ ...post, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', post.title);
            formData.append('content', post.content);
            formData.append('organization', post.organization);
            formData.append('author', post.author);
            if (post.image) {
                formData.append('image', post.image); // Thêm file ảnh vào FormData
            }

            if (id) {
                await updatePost(id, formData);
            } else {
                await createPost(formData);
            }
            navigate('/post');
        } catch (error) {
            console.error('Error submitting form:', error.response.data);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">{id ? 'Edit Post' : 'Add Post'}</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={post.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea
                        name="content"
                        className="form-control"
                        value={post.content}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Organization</label>
                    <input
                        type="text"
                        name="organization"
                        className="form-control"
                        value={post.organization}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Author</label>
                    <input
                        type="text"
                        name="author"
                        className="form-control"
                        value={post.author}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input
                        type="file"
                        name="image"
                        className="form-control"
                        onChange={handleChange}
                        accept="image/*"
                    />
                    {id && post.image && (
                        <img src={post.image} alt="Current" style={{ maxWidth: '200px', marginTop: '10px' }} />
                    )}
                </div>
                <button type="submit" className="btn btn-primary">
                    {id ? 'Update' : 'Add'}
                </button>
            </form>
        </div>
    );
}

export default PostForm;