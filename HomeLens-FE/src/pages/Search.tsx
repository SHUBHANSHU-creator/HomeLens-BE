import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/layout/BottomNav';
import { SocietyCard } from '@/components/cards/SocietyCard';
import { mockSocieties } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

const areas = ['All', 'Sector 15', 'DLF Phase 3', 'Golf Course Road', 'Sohna Road', 'Sector 56'];

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');

  const filteredSocieties = mockSocieties.filter(society => {
    const matchesSearch = 
      society.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      society.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      society.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesArea = selectedArea === 'All' || society.area === selectedArea;
    
    return matchesSearch && matchesArea;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Search Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-4">
        <div className="max-w-lg mx-auto space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, area, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Area Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
            {areas.map((area) => (
              <Badge
                key={area}
                variant={selectedArea === area ? 'default' : 'secondary'}
                className="cursor-pointer whitespace-nowrap rounded-full px-4 py-1.5"
                onClick={() => setSelectedArea(area)}
              >
                {area === 'All' ? (
                  area
                ) : (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {area}
                  </span>
                )}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold">Results</h2>
          <span className="text-sm text-muted-foreground">
            {filteredSocieties.length} societies
          </span>
        </div>

        {filteredSocieties.length > 0 ? (
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
        ) : (
          <div className="bg-muted rounded-xl p-8 text-center">
            <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No societies found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Search;
