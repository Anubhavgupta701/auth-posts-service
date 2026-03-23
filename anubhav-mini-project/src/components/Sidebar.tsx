import { Home, Compass, Heart, User, Settings, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const menuItems = [
  { icon: Home, label: 'Feed', active: true },
  
];

export const Sidebar = () => {
  return (
    <aside className="hidden w-64 flex-col border-r border-zinc-100 bg-white p-6 lg:flex sticky top-16 h-[calc(100vh-64px)]">
      <div className="space-y-6">
        <div>
          <p className="px-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Menu
          </p>
          <div className="mt-4 space-y-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ x: 4 }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  item.active
                    ? 'bg-zinc-900 text-white shadow-md shadow-zinc-200'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-50 p-4">
          <p className="text-sm font-semibold text-zinc-900">Pro Feature</p>
          <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
            Unlock advanced analytics and scheduled posting.
          </p>
          <button className="mt-3 w-full rounded-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm border border-zinc-200 hover:bg-zinc-50 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};
