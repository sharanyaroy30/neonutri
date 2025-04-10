export interface Milestone {
  name: string;
  ageRange: string;
  description: string;
  completed: boolean;
  completedDate: string | null;
}

export const defaultMilestones: Milestone[] = [
  { 
    name: 'First Solids', 
    ageRange: '4-6 months', 
    description: 'Introduction of first solid foods like rice cereal or simple vegetable purees.',
    completed: false,
    completedDate: null
  },
  { 
    name: 'Sitting Independently', 
    ageRange: '5-7 months', 
    description: 'Baby can sit in high chair for meals without support, improving feeding posture.',
    completed: false,
    completedDate: null
  },
  { 
    name: 'Pincer Grasp', 
    ageRange: '8-10 months', 
    description: 'Development of fine motor skills allowing baby to pick up small pieces of food.',
    completed: false,
    completedDate: null
  },
  { 
    name: 'Self-Feeding', 
    ageRange: '9-12 months', 
    description: 'Baby begins to use spoon or fork with assistance to feed themselves.',
    completed: false,
    completedDate: null
  },
  { 
    name: 'Drinking from Cup', 
    ageRange: '12-15 months', 
    description: 'Transition from bottle to sippy cup or regular cup with assistance.',
    completed: false,
    completedDate: null
  }
];
