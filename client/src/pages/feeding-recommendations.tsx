import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FoodCard from "@/components/ui/food-card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Baby } from "@shared/schema";
import { useState } from "react";
import { getAgeGroup } from "@/lib/utils/dates";
import { getFeedingSchedule, getNutritionistNote } from "@/lib/utils/nutrition";
import { Food, foodCategories, getFilteredFoods } from "@/lib/data/food-data";
import { Skeleton } from "@/components/ui/skeleton";
import FeedingLogForm from "@/components/forms/FeedingLogForm";
import { Link } from "wouter";
import { CheckIcon } from "lucide-react";

export default function FeedingRecommendations() {
  const queryClient = useQueryClient();
  const [selectedFoodCategory, setSelectedFoodCategory] = useState('All');
  const [showFeedingModal, setShowFeedingModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | undefined>(undefined);
  
  const { data: babies, isLoading } = useQuery<Baby[]>({
    queryKey: ['/api/babies'],
  });
  
  // Use the first baby in the list if available
  const baby = babies?.length ? babies[0] : null;
  
  const ageGroup = baby ? getAgeGroup(baby.birthday) : '';
  const feedingSchedule = getFeedingSchedule(ageGroup);
  const nutritionistNote = getNutritionistNote(ageGroup);
  const filteredFoods = getFilteredFoods(selectedFoodCategory);
  
  const handleLogFeeding = (food: Food) => {
    setSelectedFood(food);
    setShowFeedingModal(true);
  };
  
  const handleFeedingAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/babies'] });
    queryClient.invalidateQueries({ queryKey: ['/api/babies', baby?.id, 'feeding-logs'] });
  };
  
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 mb-16 lg:mb-0">
        <div className="mb-6">
          <Skeleton className="h-8 w-72 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="space-y-6">
          <Card>
            <div className="px-6 py-4 bg-primary">
              <Skeleton className="h-6 w-64 bg-white/20" />
              <Skeleton className="h-4 w-32 mt-1 bg-white/20" />
            </div>
            <CardContent className="p-4 md:p-6">
              <div className="grid gap-4">
                {[0, 1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <div className="px-6 py-4 bg-secondary">
              <Skeleton className="h-6 w-64 bg-white/20" />
              <Skeleton className="h-4 w-32 mt-1 bg-white/20" />
            </div>
            <CardContent className="p-4 md:p-6">
              <Skeleton className="h-10 w-full mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (!baby) {
    return (
      <div className="p-4 md:p-6 lg:p-8 mb-16 lg:mb-0">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Feeding Recommendations</h2>
          <p className="text-neutral-500">Personalized food suggestions based on your baby's profile</p>
        </div>
        
        <Card className="bg-white rounded-lg shadow p-6 text-center">
          <div className="bg-neutral-100 rounded-lg p-8 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold mb-2">Complete Your Baby's Profile</p>
            <p className="text-neutral-500">Please create a profile for your baby to get personalized feeding recommendations.</p>
          </div>
          <Link href="/profile">
            <Button className="px-6 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-700 transition-colors duration-150">
              Go to Profile
            </Button>
          </Link>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6 lg:p-8 mb-16 lg:mb-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Feeding Recommendations</h2>
        <p className="text-neutral-500">Personalized food suggestions based on your baby's profile</p>
      </div>
      
      <div className="space-y-6">
        {/* Feeding Schedule */}
        <Card className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-primary text-white">
            <h3 className="text-lg font-semibold">Recommended Feeding Schedule</h3>
            <p className="text-sm opacity-80">{ageGroup}</p>
          </div>
          <CardContent className="p-4 md:p-6">
            <div className="grid gap-4">
              {feedingSchedule.map((timeSlot, index) => (
                <div key={index} className="p-4 border border-neutral-200 rounded-lg flex items-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="font-mono font-bold text-primary-700">{timeSlot.time}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{timeSlot.title}</h4>
                    <p className="text-neutral-500 text-sm">{timeSlot.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Food Recommendations */}
        <Card className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-secondary text-white">
            <h3 className="text-lg font-semibold">Recommended Foods</h3>
            <p className="text-sm opacity-80">Based on nutritional needs for your baby's age</p>
          </div>
          <CardContent className="p-4 md:p-6">
            <div className="flex mb-4 overflow-x-auto py-2">
              {foodCategories.map((category) => (
                <Button 
                  key={category}
                  onClick={() => setSelectedFoodCategory(category)}
                  variant={selectedFoodCategory === category ? "default" : "outline"}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap mr-2 transition-colors duration-150 ${
                    selectedFoodCategory === category
                      ? 'bg-secondary text-white'
                      : 'bg-neutral-100 text-neutral-800'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFoods.map((food) => (
                <FoodCard 
                  key={food.id} 
                  food={food} 
                  onLogFeeding={handleLogFeeding}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Daily Nutrition Summary */}
        <Card className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-accent text-white">
            <h3 className="text-lg font-semibold">Daily Nutrition Plan</h3>
            <p className="text-sm opacity-80">Recommended nutrients for optimal development</p>
          </div>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Protein</h4>
                  <span className="text-sm font-mono text-neutral-500">11g / day</span>
                </div>
                <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{width: '65%'}}></div>
                </div>
              </div>
              
              <div className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Iron</h4>
                  <span className="text-sm font-mono text-neutral-500">7mg / day</span>
                </div>
                <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{width: '45%'}}></div>
                </div>
              </div>
              
              <div className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Calcium</h4>
                  <span className="text-sm font-mono text-neutral-500">260mg / day</span>
                </div>
                <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{width: '80%'}}></div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-neutral-200 pt-4">
              <h4 className="font-semibold mb-3">Nutritionist's Notes</h4>
              <ul className="space-y-2 text-neutral-500">
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                  <span>{nutritionistNote}</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <FeedingLogForm 
        isOpen={showFeedingModal}
        onClose={() => setShowFeedingModal(false)}
        baby={baby}
        initialFood={selectedFood}
        onFeedingAdded={handleFeedingAdded}
      />
    </div>
  );
}
