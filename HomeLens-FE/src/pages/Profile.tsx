import { useNavigate } from 'react-router-dom';
import { User, FileText, Star, Settings, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { mockReviews } from '@/data/mockData';
import { ReviewCard } from '@/components/cards/ReviewCard';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center justify-center h-16 px-4">
            <h1 className="font-semibold">Profile</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-xl font-semibold mb-2">Welcome!</h2>
          <p className="text-muted-foreground mb-6">
            Login to view your profile, reviews, and manage your documents
          </p>
          <Button variant="hero" size="lg" onClick={() => navigate('/auth')}>
            Login / Sign Up
          </Button>
        </main>

        <BottomNav />
      </div>
    );
  }

  const userReviews = mockReviews.filter(r => r.userId === user?.id);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 max-w-lg mx-auto">
          <h1 className="font-semibold">Profile</h1>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-5 shadow-card mb-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">
                {user?.username?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-lg">{user?.username || 'User'}</h2>
              <p className="text-sm text-muted-foreground">{user?.phone}</p>
              {user?.email && (
                <p className="text-sm text-muted-foreground">{user.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{userReviews.length}</p>
              <p className="text-xs text-muted-foreground">Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {user?.isVerified ? '✓' : '—'}
              </p>
              <p className="text-xs text-muted-foreground">Verified</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-xs text-muted-foreground">Documents</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl shadow-card mb-6 divide-y divide-border">
          <button
            className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors"
            onClick={() => navigate('/add')}
          >
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-primary" />
              <span className="font-medium">Add New Review</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <button className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-medium">My Documents</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* My Reviews */}
        <section>
          <h2 className="font-serif text-lg font-semibold mb-4">My Reviews</h2>
          
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="bg-muted rounded-xl p-6 text-center">
              <p className="text-muted-foreground mb-3">You haven't posted any reviews yet</p>
              <Button variant="soft" onClick={() => navigate('/add')}>
                Write Your First Review
              </Button>
            </div>
          )}
        </section>

        {/* Logout */}
        <Button
          variant="ghost"
          className="w-full mt-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
