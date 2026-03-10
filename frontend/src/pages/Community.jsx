import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { Image, Paperclip, Send, Heart, MessageCircle } from 'lucide-react';

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`);
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, { text: newPost, type: 'General update' });
      setNewPost('');
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/posts/${id}/like`);
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <TopNavbar />
        
        <main className="flex-1 p-8 overflow-y-auto w-full max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Community Feed</h1>
            <p className="text-gray-500 mt-1">Share updates, achievements, and discussions with your network.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
            <form onSubmit={handleCreatePost} className="flex flex-col">
              <textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What do you want to share with the alumni network?"
                className="w-full resize-none outline-none text-gray-700 bg-transparent p-2 text-lg"
                rows="3"
              />
              <div className="border-t border-gray-100 mt-2 pt-3 flex justify-between items-center">
                <div className="flex gap-2">
                  <button type="button" className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"><Image size={20} /></button>
                  <button type="button" className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"><Paperclip size={20} /></button>
                </div>
                <button 
                  type="submit"
                  disabled={!newPost.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-full font-semibold flex items-center gap-2 transition-colors"
                >
                  Post <Send size={16} />
                </button>
              </div>
            </form>
          </div>

          {loading ? <div className="text-gray-500 text-center">Loading feed...</div> : (
            <div className="space-y-6">
              {posts.map(post => {
                const isLiked = post.likes.includes(user._id);
                return (
                  <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100/50 rounded-full flex items-center justify-center font-bold text-blue-700 border border-blue-100">
                        {post.user?.profileImage ? <img src={post.user.profileImage} className="rounded-full w-full h-full object-cover"/> : post.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 leading-tight">{post.user?.name}</h4>
                        <p className="text-xs text-gray-500">{post.user?.role} • {new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                        {post.type}
                      </span>
                    </div>

                    <p className="text-gray-800 leading-relaxed whitespace-pre-line mb-4">{post.text}</p>
                    
                    <div className="flex items-center gap-6 border-t border-gray-100 pt-4 text-sm text-gray-500 font-medium">
                      <button 
                         onClick={() => handleLike(post._id)}
                         className={`flex items-center gap-2 hover:text-blue-600 transition-colors ${isLiked ? 'text-blue-600' : ''}`}
                      >
                        <Heart size={18} className={isLiked ? 'fill-blue-600' : ''} />
                        {post.likes.length > 0 && post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
                      </button>
                      <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                        <MessageCircle size={18} /> Comment
                      </button>
                    </div>
                  </div>
                );
              })}
              {posts.length === 0 && (
                <div className="text-center py-12 text-gray-500">No posts yet. Be the first to start a discussion!</div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Community;
