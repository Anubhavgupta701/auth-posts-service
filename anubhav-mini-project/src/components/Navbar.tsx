import { LogOut, Bell, Search, PlusCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { motion } from 'motion/react';

interface NavbarProps {
  onLogout: () => void;
  onCreatePost: () => void;
}

export const Navbar = ({ onLogout, onCreatePost }: NavbarProps) => {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-zinc-900">Anubhav MINI-Project</span>
        </div>

        <div className="hidden flex-1 items-center justify-center px-8 md:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search inspiration..."
              className="h-10 w-full rounded-full border border-zinc-100 bg-zinc-50 pl-10 pr-4 text-sm focus:border-zinc-300 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex"
            onClick={onCreatePost}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create
          </Button>
          <div className="h-8 w-px bg-zinc-100 mx-2 hidden sm:block" />
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="h-5 w-5 text-zinc-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="border-zinc-200 text-zinc-600 hover:text-red-600 hover:border-red-100 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};
