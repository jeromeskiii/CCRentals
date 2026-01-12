export interface PlacedUnit {
  id: string;
  type: string;
  icon: string;
  x: number;
  y: number;
  rotation: number;
  label?: string;
}

export interface UnitType {
  id: string;
  name: string;
  icon: string;
  category: 'toilet' | 'trailer' | 'handwash' | 'fencing' | 'other';
  width: number;
  height: number;
  color: string;
}

export interface Recommendation {
  type: string;
  quantity: number;
  description: string;
  icon: string;
}

export const unitTypes: UnitType[] = [
  {
    id: 'standard-toilet',
    name: 'Standard Toilet',
    icon: '🚻',
    category: 'toilet',
    width: 60,
    height: 80,
    color: '#3B82F6',
  },
  {
    id: 'deluxe-toilet',
    name: 'Deluxe Unit',
    icon: '🚿',
    category: 'toilet',
    width: 70,
    height: 90,
    color: '#8B5CF6',
  },
  {
    id: 'ada-unit',
    name: 'ADA Unit',
    icon: '♿',
    category: 'toilet',
    width: 90,
    height: 100,
    color: '#10B981',
  },
  {
    id: 'handwash',
    name: 'Handwash Station',
    icon: '🧼',
    category: 'handwash',
    width: 50,
    height: 40,
    color: '#F59E0B',
  },
  {
    id: '2-stall-trailer',
    name: '2-Stall Trailer',
    icon: '🚐',
    category: 'trailer',
    width: 120,
    height: 80,
    color: '#EC4899',
  },
  {
    id: '4-stall-trailer',
    name: '4-Stall Trailer',
    icon: '🚌',
    category: 'trailer',
    width: 180,
    height: 80,
    color: '#EC4899',
  },
  {
    id: 'fencing',
    name: 'Fencing Panel',
    icon: '🔗',
    category: 'fencing',
    width: 100,
    height: 20,
    color: '#6B7280',
  },
  {
    id: 'attendant',
    name: 'Attendant Station',
    icon: '👤',
    category: 'other',
    width: 50,
    height: 50,
    color: '#14B8A6',
  },
];
