import React from 'react';
import { Star, MapPin, Building2 } from 'lucide-react';
import { Society } from '@/types';
import { cn } from '@/lib/utils';

interface SocietyCardProps {
  society: Society;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function SocietyCard({ society, onClick, className, style }: SocietyCardProps) {
  return (
    <article
      onClick={onClick}
      style={style}
      className={cn(
        'bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group animate-fade-in',
        className
      )}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={society.imageUrl}
          alt={society.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-lg">
          <Star className="w-4 h-4 text-warning fill-warning" />
          <span className="text-sm font-semibold">{society.averageRating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-serif font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
          {society.name}
        </h3>
        
        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-sm truncate">{society.area}, {society.city}</span>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">{society.totalFlats} flats</span>
          </div>
          <span className="text-sm text-primary font-medium">
            {society.reviewCount} reviews
          </span>
        </div>
      </div>
    </article>
  );
}
