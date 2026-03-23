import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://auth-posts-service-3.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // ✅ Save token
      localStorage.setItem('token', data.accessToken);

      // ✅ Save user (optional)
      localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ Redirect to dashboard
      navigate('/dashboard');

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Anubhav MINI-Project
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Welcome back! Please sign in
          </p>
        </div>

        {/* Card */}
        <Card className="border-zinc-100 shadow-xl shadow-zinc-200/50">
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            

               
            

            {/* Button */}
            <Button type="submit" className="w-full h-11" isLoading={isLoading}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500">
              New user?{' '}
              <Link
                to="/register"
                className="font-semibold text-zinc-900 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};