import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Step = 'phone' | 'otp' | 'profile';

const Auth = () => {
  const navigate = useNavigate();
  const { login, verifyOtp, completeProfile, isLoading } = useAuth();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [profileData, setProfileData] = useState({
    username: '',
    age: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    email: '',
  });

  const handlePhoneSubmit = async () => {
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    await login(phone);
    toast.success('OTP sent to your mobile number');
    setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete OTP');
      return;
    }

    const result = await verifyOtp(otpString);
    
    if (result.isNewUser) {
      setStep('profile');
    } else {
      toast.success('Welcome back!');
      navigate('/');
    }
  };

  const handleProfileSubmit = async () => {
    if (!profileData.username || !profileData.age || !profileData.gender) {
      toast.error('Please fill in all required fields');
      return;
    }

    await completeProfile({
      username: profileData.username,
      age: parseInt(profileData.age),
      gender: profileData.gender as 'male' | 'female' | 'other',
      email: profileData.email || undefined,
    });

    toast.success('Profile created successfully!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background">
        <div className="flex items-center gap-3 h-16 px-4 max-w-lg mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (step === 'phone') navigate(-1);
              else if (step === 'otp') setStep('phone');
              else if (step === 'profile') setStep('otp');
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        {step === 'phone' && (
          <div className="animate-fade-in">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6">
              <Phone className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <h1 className="font-serif text-3xl font-bold mb-2">
              Welcome to FlatReview
            </h1>
            <p className="text-muted-foreground mb-8">
              Enter your mobile number to continue
            </p>

            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  +91
                </span>
                <Input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="pl-14"
                  maxLength={10}
                />
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handlePhoneSubmit}
                disabled={isLoading || phone.length !== 10}
              >
                {isLoading ? 'Sending OTP...' : 'Get OTP'}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        )}

        {step === 'otp' && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-3xl font-bold mb-2">
              Verify OTP
            </h1>
            <p className="text-muted-foreground mb-8">
              Enter the 6-digit code sent to +91 {phone}
            </p>

            <div className="flex gap-2 justify-center mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digit && index > 0) {
                      const prevInput = document.getElementById(`otp-${index - 1}`);
                      prevInput?.focus();
                    }
                  }}
                  className={cn(
                    'w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 transition-all',
                    'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                    digit ? 'border-primary bg-primary/5' : 'border-input bg-background'
                  )}
                  maxLength={1}
                />
              ))}
            </div>

            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={handleOtpSubmit}
              disabled={isLoading || otp.some(d => !d)}
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Button>

            <button
              className="w-full text-center text-sm text-primary mt-4"
              onClick={() => {
                toast.info('OTP resent to your mobile number');
              }}
            >
              Didn't receive OTP? Resend
            </button>
          </div>
        )}

        {step === 'profile' && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-3xl font-bold mb-2">
              Complete Your Profile
            </h1>
            <p className="text-muted-foreground mb-8">
              Tell us a bit about yourself
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Username <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="Enter your name"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Age <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="Enter your age"
                  value={profileData.age}
                  onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                  min={18}
                  max={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Gender <span className="text-destructive">*</span>
                </label>
                <Select
                  value={profileData.gender}
                  onValueChange={(value) => setProfileData({ ...profileData, gender: value as 'male' | 'female' | 'other' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email <span className="text-muted-foreground">(Optional)</span>
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full mt-6"
                onClick={handleProfileSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Creating Profile...' : 'Create Profile'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Auth;
