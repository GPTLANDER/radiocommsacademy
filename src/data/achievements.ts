import { Achievement, TraineeRank } from '../types';

export const TRAINEE_RANKS: readonly TraineeRank[] = [
  {
    id: 'recruit',
    title: 'Recruit',
    minXp: 0,
    description: 'Fresh trainee entering communications operations.',
  },
  {
    id: 'cadet',
    title: 'Cadet',
    minXp: 100,
    description: 'Recognized trainee with basic procedural foundation.',
  },
  {
    id: 'operator',
    title: 'Operator',
    minXp: 250,
    description: 'Competent radio operator capable of handling routine traffic.',
  },
  {
    id: 'specialist',
    title: 'Specialist',
    minXp: 500,
    description: 'High-speed operator proficient under complex static conditions.',
  },
  {
    id: 'commander',
    title: 'Commander',
    minXp: 1000,
    description: 'Master operator commanding emergency and tactical frequencies.',
  },
];

export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: 'first_transmission',
    title: 'First Transmission',
    description: 'Complete your first knowledge check quiz.',
    iconName: 'Radio',
  },
  {
    id: 'alphabet_explorer',
    title: 'Alphabet Explorer',
    description: 'Learn and mark all 26 NATO phonetic letters as understood.',
    iconName: 'BookOpen',
  },
  {
    id: 'digit_decoder',
    title: 'Digit Decoder',
    description: 'Learn and mark all 10 radio digits as understood.',
    iconName: 'Hash',
  },
  {
    id: 'perfect_mission',
    title: 'Perfect Mission',
    description: 'Score 100% accuracy on any practice mission or quiz.',
    iconName: 'Award',
  },
  {
    id: 'consistent_operator',
    title: 'Consistent Operator',
    description: 'Complete at least three full training sessions.',
    iconName: 'CheckCircle',
  },
];
