import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, User } from 'lucide-react';
import { Card } from './ui/Card';
import { motion } from 'motion/react';

interface PostCardProps {
  image: string;
  caption: string;
  username?: string;
  avatar?: string;
  timestamp?: string;
  likes?: number;
}

export const PostCard = ({ image, caption, username = 'User', avatar, timestamp, likes = 0 }: PostCardProps) => {
  return (
    <Card className="p-0 overflow-hidden border-zinc-100/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-full border border-zinc-100 bg-zinc-100 flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt={username} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="h-5 w-5 text-zinc-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">{username}</p>
            {timestamp && (
              <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-tight">{timestamp}</p>
            )}
          </div>
        </div>
        <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="aspect-square w-full overflow-hidden bg-zinc-50">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          src={image}
          alt={caption || 'Post content'}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button className="text-zinc-600 hover:text-red-500 transition-colors">
              <Heart className="h-6 w-6" />
            </button>
            <button className="text-zinc-600 hover:text-zinc-900 transition-colors">
              <MessageCircle className="h-6 w-6" />
            </button>
            <button className="text-zinc-600 hover:text-zinc-900 transition-colors">
              <Share2 className="h-6 w-6" />
            </button>
          </div>
          <button className="text-zinc-600 hover:text-zinc-900 transition-colors">
            <Bookmark className="h-6 w-6" />
          </button>
        </div>

        {likes > 0 && (
          <p className="text-sm font-bold text-zinc-900 mb-1">{likes.toLocaleString()} likes</p>
        )}
        {caption && (
          <p className="text-sm text-zinc-600 leading-relaxed">
            {username && <span className="font-bold text-zinc-900 mr-2">{username}</span>}
            {caption}
          </p>
        )}
      </div>
    </Card>
  );
};
