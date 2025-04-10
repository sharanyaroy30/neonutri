export interface Food {
  id: string;
  name: string;
  description: string;
  category: string;
  ageRange: string;
  nutrients: string[];
  image: string;
}

export const foodCategories = ['All', 'Fruits', 'Vegetables', 'Proteins', 'Grains', 'Dairy'];

export const foods: Food[] = [
  {
    id: "1",
    name: 'Avocado Puree',
    description: 'Smooth, creamy puree rich in healthy fats and nutrients.',
    category: 'Fruits',
    ageRange: '6+ months',
    nutrients: ['Healthy Fats', 'Potassium', 'Vitamin E'],
    image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: "2",
    name: 'Sweet Potato Mash',
    description: 'Naturally sweet puree packed with beta-carotene.',
    category: 'Vegetables',
    ageRange: '6+ months',
    nutrients: ['Vitamin A', 'Fiber', 'Potassium'],
    image: 'https://images.unsplash.com/photo-1596451190630-186aff535bf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: "3",
    name: 'Banana Oatmeal',
    description: 'Hearty breakfast with natural sweetness and whole grains.',
    category: 'Grains',
    ageRange: '8+ months',
    nutrients: ['Fiber', 'B Vitamins', 'Iron'],
    image: 'https://images.unsplash.com/photo-1590137876181-2a5a7e340308?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: "4",
    name: 'Steamed Carrot Sticks',
    description: 'Soft finger food perfect for developing motor skills.',
    category: 'Vegetables',
    ageRange: '9+ months',
    nutrients: ['Vitamin A', 'Fiber', 'Antioxidants'],
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: "5",
    name: 'Greek Yogurt',
    description: 'Creamy protein-rich dairy option for older babies.',
    category: 'Dairy',
    ageRange: '8+ months',
    nutrients: ['Protein', 'Calcium', 'Probiotics'],
    image: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: "6",
    name: 'Soft Cooked Lentils',
    description: 'Protein-packed legumes that are easily mashable.',
    category: 'Proteins',
    ageRange: '8+ months',
    nutrients: ['Protein', 'Iron', 'Zinc'],
    image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: "7",
    name: 'Apple Sauce',
    description: 'Smooth fruit puree with natural sweetness and vitamin C.',
    category: 'Fruits',
    ageRange: '6+ months',
    nutrients: ['Vitamin C', 'Fiber', 'Antioxidants'],
    image: 'https://images.unsplash.com/photo-1576697935066-a5bd244ae2dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: "8",
    name: 'Mashed Peas',
    description: 'Nutrient-rich vegetable puree with a vibrant color.',
    category: 'Vegetables',
    ageRange: '6+ months',
    nutrients: ['Vitamin K', 'Folate', 'Protein'],
    image: 'https://images.unsplash.com/photo-1612505972399-7fda478ea5a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: "9",
    name: 'Quinoa Porridge',
    description: 'Complete protein grain that is gentle on baby digestive system.',
    category: 'Grains',
    ageRange: '8+ months',
    nutrients: ['Complete Protein', 'Iron', 'Magnesium'],
    image: 'https://images.unsplash.com/photo-1518779618904-a940d8161415?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }
];

export function getFilteredFoods(category: string): Food[] {
  if (category === 'All') {
    return foods;
  }
  return foods.filter(food => food.category === category);
}

export function getFoodById(id: string): Food | undefined {
  return foods.find(food => food.id === id);
}
