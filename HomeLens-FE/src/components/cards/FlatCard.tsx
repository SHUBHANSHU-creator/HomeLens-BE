import React from 'react';
import { Star, Bed, Bath, Square } from 'lucide-react';
import { Flat } from '@/types';
import { cn } from '@/lib/utils';

interface FlatCardProps {
  flat: Flat;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function FlatCard({ flat, onClick, className, style }: FlatCardProps) {
  return (
    <article
      onClick={onClick}
      style={style}
      className={cn(
        'bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer border border-border hover:border-primary/30',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-foreground">{flat.flatNumber}</h4>
          <p className="text-sm text-muted-foreground">Floor {flat.floor}</p>
        </div>
        <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
          <Star className="w-3.5 h-3.5 text-primary fill-primary" />
          <span className="text-sm font-semibold text-primary">
            {flat.averageRating.toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-3 text-muted-foreground">
        <div className="flex items-center gap-1">
          <Bed className="w-4 h-4" />
          <span className="text-sm">{flat.bedrooms} BHK</span>
        </div>
        <div className="flex items-center gap-1">
          <Bath className="w-4 h-4" />
          <span className="text-sm">{flat.bathrooms}</span>
        </div>
        <div className="flex items-center gap-1">
          <Square className="w-4 h-4" />
          <span className="text-sm">{flat.area} sqft</span>
        </div>
      </div>
      
      <p className="text-xs text-primary mt-2 font-medium">
        {flat.reviewCount} reviews
      </p>
    </article>
  );
}
