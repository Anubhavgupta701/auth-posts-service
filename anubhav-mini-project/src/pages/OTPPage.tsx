import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Toast } from '../components/ui/Toast';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export const OTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (otp.length !== 6) {
      setToast({ message: 'Please enter a valid 6-digit code.', type: 'error' });
      return;
    }

    if (!email) {
      setToast({ message: 'Email is missing. Please register again.', type: 'error' });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('https://auth-posts-service-3.onrender.com/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setToast({ message: 'Verification successful! Redirecting to login...', type: 'success' });
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err: any) {
      setToast({ message: err.message || 'Invalid OTP. Please try again.', type: 'error' });
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
        <button
          onClick={() => navigate('/register')}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to registration
        </button>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Anubhav MINI-Project</h1>
          <p className="mt-2 text-sm text-zinc-500">Enter the verification code sent to your email.</p>
        </div>

        <Card className="border-zinc-100 shadow-xl shadow-zinc-200/50">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Input
                label="Verification Code"
                type="text"
                maxLength={6}
                placeholder="000000"
                className="text-center text-2xl tracking-[0.5em] font-bold h-14"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            <Button type="submit" className="w-full h-11" isLoading={isLoading}>
              Verify & Continue
            </Button>

            <div className="text-center">
              <button type="button" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                Didn't receive the code? <span className="text-zinc-900 underline">Resend</span>
              </button>
            </div>
          </form>
        </Card>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
