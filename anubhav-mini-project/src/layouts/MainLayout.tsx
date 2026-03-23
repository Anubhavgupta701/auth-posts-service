import * as React from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { CreatePostModal } from '../components/CreatePostModal';
import { motion, AnimatePresence } from 'motion/react';

interface MainLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export const MainLayout = ({ children, onLogout }: MainLayoutProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const handleCreatePost = (post: { _id: string; image: string; caption: string }) => {
    window.dispatchEvent(new CustomEvent('post-created', { detail: post }));
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 selection:bg-zinc-900 selection:text-white">
      <Navbar onLogout={onLogout} onCreatePost={() => setIsCreateModalOpen(true)} />
      
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};
