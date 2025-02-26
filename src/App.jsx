import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PostList from './components/PostList';
import PostForm from './components/PostForm';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route exact path="/" element={<PostList />} />
                    <Route path="/add" element={<PostForm />} />
                    <Route path="/edit/:id" element={<PostForm />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;