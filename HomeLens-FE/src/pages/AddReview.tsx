import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Star, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AddReview = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    societyName: '',
    flatNumber: '',
    title: '',
    content: '',
    pros: [''],
    cons: [''],
  });
  const [agreementFile, setAgreementFile] = useState<File | null>(null);
  const [lightBillFile, setLightBillFile] = useState<File | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center gap-3 h-16 px-4 max-w-lg mx-auto">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold">Add Review</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-12 text-center">
          <div className="bg-muted rounded-2xl p-8">
            <h2 className="font-serif text-xl font-semibold mb-3">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to post a review with verified documents
            </p>
            <Button variant="hero" onClick={() => navigate('/auth')}>
              Login / Sign Up
            </Button>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  const handleAddPro = () => {
    setFormData({ ...formData, pros: [...formData.pros, ''] });
  };

  const handleAddCon = () => {
    setFormData({ ...formData, cons: [...formData.cons, ''] });
  };

  const handleRemovePro = (index: number) => {
    const newPros = formData.pros.filter((_, i) => i !== index);
    setFormData({ ...formData, pros: newPros.length ? newPros : [''] });
  };

  const handleRemoveCon = (index: number) => {
    const newCons = formData.cons.filter((_, i) => i !== index);
    setFormData({ ...formData, cons: newCons.length ? newCons : [''] });
  };

  const handleSubmit = () => {
    if (!agreementFile || !lightBillFile) {
      toast.error('Please upload both agreement and light bill');
      return;
    }
    
    toast.success('Review submitted successfully! It will be visible after verification.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-3 h-16 px-4 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold">Add Review</h1>
            <p className="text-xs text-muted-foreground">Step {step} of 3</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-medium mb-2">Society Name</label>
              <Input
                placeholder="e.g. Green Valley Heights"
                value={formData.societyName}
                onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Flat Number</label>
              <Input
                placeholder="e.g. A-101"
                value={formData.flatNumber}
                onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        'w-8 h-8 transition-colors',
                        star <= (hoveredRating || rating)
                          ? 'text-warning fill-warning'
                          : 'text-muted'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!formData.societyName || !formData.flatNumber || !rating}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-medium mb-2">Review Title</label>
              <Input
                placeholder="Give your review a headline"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <Textarea
                placeholder="Share your experience living in this flat..."
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pros</label>
              <div className="space-y-2">
                {formData.pros.map((pro, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Something you liked"
                      value={pro}
                      onChange={(e) => {
                        const newPros = [...formData.pros];
                        newPros[index] = e.target.value;
                        setFormData({ ...formData, pros: newPros });
                      }}
                    />
                    {formData.pros.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePro(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={handleAddPro}>
                  <Plus className="w-4 h-4 mr-1" /> Add Pro
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cons</label>
              <div className="space-y-2">
                {formData.cons.map((con, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Something you didn't like"
                      value={con}
                      onChange={(e) => {
                        const newCons = [...formData.cons];
                        newCons[index] = e.target.value;
                        setFormData({ ...formData, cons: newCons });
                      }}
                    />
                    {formData.cons.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCon(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={handleAddCon}>
                  <Plus className="w-4 h-4 mr-1" /> Add Con
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                variant="hero"
                size="lg"
                onClick={() => setStep(3)}
                disabled={!formData.title || !formData.content}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Document Verification Required</p>
              <p>To ensure authentic reviews, please upload your rental agreement and a recent light bill.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Rental Agreement <span className="text-destructive">*</span>
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  {agreementFile ? (
                    <p className="text-sm text-primary font-medium">{agreementFile.name}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Click to upload</p>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setAgreementFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Light Bill (Last 3 months) <span className="text-destructive">*</span>
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  {lightBillFile ? (
                    <p className="text-sm text-primary font-medium">{lightBillFile.name}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Click to upload</p>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setLightBillFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button
                variant="hero"
                size="lg"
                onClick={handleSubmit}
                className="flex-1"
              >
                Submit Review
              </Button>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default AddReview;
