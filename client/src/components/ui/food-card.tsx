import { Card, CardContent } from "@/components/ui/card";
import { Food } from "@/lib/data/food-data";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface FoodCardProps {
  food: Food;
  onLogFeeding: (food: Food) => void;
}

export default function FoodCard({ food, onLogFeeding }: FoodCardProps) {
  return (
    <Card className="border border-neutral-200 rounded-lg overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 bg-neutral-100">
        <img src={food.image} alt={food.name} className="object-cover w-full h-full" />
      </div>
      <CardContent className="p-4">
        <h4 className="font-semibold mb-1">{food.name}</h4>
        <p className="text-sm text-neutral-500 mb-3">{food.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {food.nutrients.map((nutrient, i) => (
            <span key={i} className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">
              {nutrient}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">{`Age: ${food.ageRange}`}</span>
          <Button
            onClick={() => onLogFeeding(food)}
            variant="ghost"
            className="text-sm text-primary font-semibold hover:text-primary-dark transition-colors duration-150 flex items-center" 
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Log Feeding
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
