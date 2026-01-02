import React from 'react';
import { Star, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Review } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ReviewCardProps {
  review: Review;
  className?: string;
  style?: React.CSSProperties;
}

export function ReviewCard({ review, className, style }: ReviewCardProps) {
  return (
    <article
      style={style}
      className={cn(
        'bg-card rounded-xl p-4 shadow-card border border-border',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-semibold text-primary">
              {review.userName.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{review.userName}</span>
              {review.isVerified && (
                <CheckCircle className="w-4 h-4 text-success" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(review.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                'w-4 h-4',
                i < review.rating
                  ? 'text-warning fill-warning'
                  : 'text-muted'
              )}
            />
          ))}
        </div>
      </div>
      
      <h4 className="font-semibold mt-3 text-foreground">{review.title}</h4>
      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
        {review.content}
      </p>
      
      {(review.pros.length > 0 || review.cons.length > 0) && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {review.pros.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-success text-sm font-medium mb-1">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Pros</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {review.pros.map((pro, i) => (
                  <li key={i}>• {pro}</li>
                ))}
              </ul>
            </div>
          )}
          {review.cons.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-destructive text-sm font-medium mb-1">
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>Cons</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {review.cons.map((con, i) => (
                  <li key={i}>• {con}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
