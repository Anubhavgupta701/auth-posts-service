import * as React from 'react';
import { PostCard } from '../components/PostCard';
import { motion } from 'motion/react';

interface Post {
  _id: string;
  image: string;
  caption: string;
  createdAt?: string;
}

export const DashboardPage = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchPosts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/posts');
      const data = await res.json();
      if (res.ok) setPosts(data.posts || []);
      else setError(data.message || 'Failed to load posts');
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  React.useEffect(() => {
    const onPostCreated = (e: CustomEvent<Post>) => {
      setPosts((prev) => [e.detail, ...prev]);
    };
    window.addEventListener('post-created', onPostCreated as EventListener);
    return () => window.removeEventListener('post-created', onPostCreated as EventListener);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Your Feed</h2>
          <p className="text-sm text-zinc-500">Stay inspired with the latest from your network.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-sm">
            All
          </button>
          <button className="rounded-full bg-white border border-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">
            Following
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
        {loading ? (
          <p className="text-zinc-500 col-span-2 text-center py-12">Loading posts...</p>
        ) : error ? (
          <p className="text-red-500 col-span-2 text-center py-12">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-zinc-500 col-span-2 text-center py-12">No posts yet. Create your first post!</p>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard image={post.image} caption={post.caption} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
