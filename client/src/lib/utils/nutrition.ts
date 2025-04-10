import { getAgeGroup } from "./dates";

// Get feeding schedule based on baby's age group
export function getFeedingSchedule(ageGroup: string): Array<{time: string, title: string, description: string}> {
  if (ageGroup === '0-6 months') {
    return [
      { time: '6:00 AM', title: 'Morning Feeding', description: 'Breast milk or formula' },
      { time: '9:00 AM', title: 'Mid-morning Feeding', description: 'Breast milk or formula' },
      { time: '12:00 PM', title: 'Noon Feeding', description: 'Breast milk or formula' },
      { time: '3:00 PM', title: 'Afternoon Feeding', description: 'Breast milk or formula' },
      { time: '6:00 PM', title: 'Evening Feeding', description: 'Breast milk or formula' },
      { time: '9:00 PM', title: 'Night Feeding', description: 'Breast milk or formula' },
      { time: '12:00 AM', title: 'Midnight Feeding', description: 'Breast milk or formula (if needed)' }
    ];
  } else if (ageGroup === '6-12 months') {
    return [
      { time: '7:00 AM', title: 'Breakfast', description: 'Breast milk or formula + infant cereal' },
      { time: '10:00 AM', title: 'Mid-morning Snack', description: 'Fruit puree' },
      { time: '1:00 PM', title: 'Lunch', description: 'Vegetable puree + protein' },
      { time: '4:00 PM', title: 'Afternoon Snack', description: 'Yogurt or mashed fruit' },
      { time: '7:00 PM', title: 'Dinner', description: 'Mixed vegetable and protein puree' },
      { time: '9:30 PM', title: 'Before Bed', description: 'Breast milk or formula' }
    ];
  } else {
    return [
      { time: '7:30 AM', title: 'Breakfast', description: 'Cereal with milk + fruit pieces' },
      { time: '10:30 AM', title: 'Morning Snack', description: 'Cheese or yogurt + crackers' },
      { time: '1:00 PM', title: 'Lunch', description: 'Protein + vegetables + grains' },
      { time: '4:00 PM', title: 'Afternoon Snack', description: 'Fruit pieces + small sandwich' },
      { time: '7:00 PM', title: 'Dinner', description: 'Protein + vegetables + grains' },
      { time: '8:30 PM', title: 'Before Bed', description: 'Milk or formula (if needed)' }
    ];
  }
}

// Get nutritionist's note based on baby's age group
export function getNutritionistNote(ageGroup: string): string {
  if (ageGroup === '0-6 months') {
    return "Breast milk or formula provides all the nutrition your baby needs at this stage. Solid foods should generally be introduced around 6 months when baby shows signs of readiness.";
  } else if (ageGroup === '6-12 months') {
    return "Continue breast milk or formula as the primary source of nutrition, but begin introducing a variety of pureed foods. Start with single-ingredient foods and wait 3-5 days between new foods to watch for allergies.";
  } else {
    return "Offer a wide variety of foods from all food groups. Focus on nutrient-dense options and limit added sugars and salt. Encourage self-feeding and development of fine motor skills.";
  }
}

// Get most common food from feeding logs
export function getMostCommonFood(feedingLogs: any[]): string | null {
  if (feedingLogs.length === 0) return null;
  
  const foodCounts: Record<string, number> = {};
  
  feedingLogs.forEach(entry => {
    foodCounts[entry.foodName] = (foodCounts[entry.foodName] || 0) + 1;
  });
  
  let mostCommonFood = null;
  let highestCount = 0;
  
  for (const food in foodCounts) {
    if (foodCounts[food] > highestCount) {
      mostCommonFood = food;
      highestCount = foodCounts[food];
    }
  }
  
  return mostCommonFood;
}

// Get feeding count for specific day
export function getFeedingCountForDay(feedingLogs: any[], day: string): number {
  return feedingLogs.filter(entry => entry.date === day).length || 0;
}

// Get today's feeding count
export function getTodayFeedingCount(feedingLogs: any[]): number {
  const today = new Date().toISOString().split('T')[0];
  return getFeedingCountForDay(feedingLogs, today);
}

// Estimate average time between feedings
export function getAvgTimeBetweenFeedings(feedingLogs: any[]): string | null {
  if (feedingLogs.length < 2) return null;
  
  // This is a simplified calculation - just returning a placeholder
  return '3.5 hours';
}
