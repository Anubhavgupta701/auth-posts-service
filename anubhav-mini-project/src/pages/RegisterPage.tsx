import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { motion } from 'motion/react';
import { UserPlus } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      console.log('Success:', data);

      // ✅ If you want to pass email to OTP page
      navigate('/verify-otp', { state: { email } });

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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Anubhav MINI-Project
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Create your account
          </p>
        </div>

        <Card className="border-zinc-100 shadow-xl shadow-zinc-200/50">
          <form onSubmit={handleRegister} className="space-y-5">
            
            <Input
              label="Username"
              type="text"
              placeholder="creative_soul"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* ✅ ERROR MESSAGE */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <p className="text-[10px] text-zinc-400 leading-relaxed">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>

            <Button type="submit" className="w-full h-11" isLoading={isLoading}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-zinc-900 hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};