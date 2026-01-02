export interface User {
  id: string;
  phone: string;
  username?: string;
  email?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  isVerified: boolean;
  createdAt: Date;
}

export interface Society {
  id: string;
  name: string;
  address: string;
  city: string;
  area: string;
  pincode: string;
  imageUrl: string;
  totalFlats: number;
  reviewCount: number;
  averageRating: number;
  amenities: string[];
}

export interface Flat {
  id: string;
  societyId: string;
  flatNumber: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  reviewCount: number;
  averageRating: number;
}

export interface Review {
  id: string;
  flatId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  agreementUrl?: string;
  lightBillUrl?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  area: string;
}
