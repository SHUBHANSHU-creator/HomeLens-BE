import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Building2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/layout/BottomNav';
import { FlatCard } from '@/components/cards/FlatCard';
import { mockSocieties, mockFlats } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

const SocietyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const society = mockSocieties.find(s => s.id === id);
  const flats = mockFlats.filter(f => f.societyId === id);

  if (!society) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Society not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Image */}
      <div className="relative h-64">
        <img
          src={society.imageUrl}
          alt={society.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 rounded-full bg-card/90 backdrop-blur-sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <main className="max-w-lg mx-auto px-4 -mt-12 relative z-10">
        {/* Society Info Card */}
        <div className="bg-card rounded-2xl p-5 shadow-card mb-6 animate-slide-up">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                {society.name}
              </h1>
              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{society.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg">
              <Star className="w-5 h-5 text-primary fill-primary" />
              <span className="text-lg font-bold text-primary">
                {society.averageRating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">
                <strong>{society.totalFlats}</strong> flats
              </span>
            </div>
            <div className="text-sm">
              <strong>{society.reviewCount}</strong> reviews
            </div>
          </div>
        </div>

        {/* Amenities */}
        <section className="mb-6">
          <h2 className="font-serif text-lg font-semibold mb-3">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {society.amenities.map((amenity) => (
              <Badge key={amenity} variant="secondary" className="rounded-full">
                {amenity}
              </Badge>
            ))}
          </div>
        </section>

        {/* Flats */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold">Flats</h2>
            <span className="text-sm text-muted-foreground">
              {flats.length} with reviews
            </span>
          </div>
          
          {flats.length > 0 ? (
            <div className="space-y-3">
              {flats.map((flat, index) => (
                <FlatCard
                  key={flat.id}
                  flat={flat}
                  onClick={() => navigate(`/flat/${flat.id}`)}
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-muted rounded-xl p-6 text-center">
              <p className="text-muted-foreground mb-3">No reviews yet for this society</p>
              <Button variant="soft" onClick={() => navigate('/add')}>
                Be the first to review
              </Button>
            </div>
          )}
        </section>

        {/* Add Review CTA */}
        <div className="mt-8 mb-4">
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={() => navigate('/add')}
          >
            Add a Review
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default SocietyDetail;
