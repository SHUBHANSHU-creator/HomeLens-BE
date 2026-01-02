import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Bed, Bath, Square, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/layout/BottomNav';
import { ReviewCard } from '@/components/cards/ReviewCard';
import { mockFlats, mockSocieties, mockReviews } from '@/data/mockData';

const FlatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const flat = mockFlats.find(f => f.id === id);
  const society = flat ? mockSocieties.find(s => s.id === flat.societyId) : null;
  const reviews = mockReviews.filter(r => r.flatId === id);

  if (!flat || !society) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Flat not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-3 h-16 px-4 max-w-lg mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold">{flat.flatNumber}</h1>
            <p className="text-xs text-muted-foreground">{society.name}</p>
          </div>
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="font-semibold text-primary">
              {flat.averageRating.toFixed(1)}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Flat Info */}
        <div className="bg-card rounded-xl p-5 shadow-card mb-6 animate-fade-in">
          <h2 className="font-serif text-xl font-semibold mb-4">Flat Details</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <Bed className="w-5 h-5 mx-auto text-primary mb-1" />
              <span className="text-lg font-bold">{flat.bedrooms}</span>
              <p className="text-xs text-muted-foreground">Bedrooms</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <Bath className="w-5 h-5 mx-auto text-primary mb-1" />
              <span className="text-lg font-bold">{flat.bathrooms}</span>
              <p className="text-xs text-muted-foreground">Bathrooms</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <Square className="w-5 h-5 mx-auto text-primary mb-1" />
              <span className="text-lg font-bold">{flat.area}</span>
              <p className="text-xs text-muted-foreground">Sq.ft</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            Floor {flat.floor} • {flat.reviewCount} verified reviews
          </p>
        </div>

        {/* Reviews */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold">Reviews</h2>
            <span className="text-sm text-muted-foreground">
              {reviews.length} reviews
            </span>
          </div>
          
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-muted rounded-xl p-6 text-center">
              <p className="text-muted-foreground mb-3">No reviews yet for this flat</p>
              <Button variant="soft" onClick={() => navigate('/add')}>
                Be the first to review
              </Button>
            </div>
          )}
        </section>

        {/* Add Review CTA */}
        <div className="mt-8">
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={() => navigate('/add')}
          >
            Write a Review
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default FlatDetail;
