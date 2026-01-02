import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { SocietyCard } from '@/components/cards/SocietyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockSocieties } from '@/data/mockData';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSocieties = mockSocieties.filter(society =>
    society.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    society.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topRated = [...mockSocieties].sort((a, b) => b.averageRating - a.averageRating).slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search societies, areas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>

        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-2xl gradient-primary p-6 mb-8 animate-fade-in">
          <div className="relative z-10">
            <h2 className="font-serif text-2xl font-bold text-primary-foreground mb-2">
              Find Your Perfect Home
            </h2>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Read honest reviews from verified residents before you move in
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/search')}
              className="gap-1"
            >
              Explore Now
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-foreground/10 rounded-full" />
          <div className="absolute right-8 bottom-16 w-16 h-16 bg-primary-foreground/10 rounded-full" />
        </section>

        {/* Top Rated Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold">Top Rated</h2>
            <Button variant="ghost" size="sm" className="text-primary gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {topRated.map((society, index) => (
              <SocietyCard
                key={society.id}
                society={society}
                onClick={() => navigate(`/society/${society.id}`)}
                className="min-w-[280px] flex-shrink-0"
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        </section>

        {/* Near You Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold">Near You</h2>
            <span className="text-sm text-muted-foreground">
              {filteredSocieties.length} societies
            </span>
          </div>
          <div className="space-y-4">
            {filteredSocieties.map((society, index) => (
              <SocietyCard
                key={society.id}
                society={society}
                onClick={() => navigate(`/society/${society.id}`)}
                style={{ animationDelay: `${index * 50}ms` }}
              />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
