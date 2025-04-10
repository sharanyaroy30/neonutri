import { Card, CardContent } from "@/components/ui/card";
import BabyProfileForm from "@/components/forms/BabyProfileForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Baby } from "@shared/schema";
import { calculateBabyAge } from "@/lib/utils/dates";
import { Skeleton } from "@/components/ui/skeleton";

export default function BabyProfile() {
  const queryClient = useQueryClient();
  
  const { data: babies, isLoading } = useQuery<Baby[]>({
    queryKey: ['/api/babies'],
  });
  
  // Use the first baby in the list if available
  const baby = babies?.length ? babies[0] : null;
  
  const handleProfileSaved = (updatedBaby: Baby) => {
    queryClient.invalidateQueries({ queryKey: ['/api/babies'] });
  };
  
  return (
    <div className="p-4 md:p-6 lg:p-8 mb-16 lg:mb-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Baby Profile</h2>
        <p className="text-neutral-500">Enter your baby's information to get personalized recommendations</p>
      </div>
      
      <Card className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ) : (
            <BabyProfileForm baby={baby} onProfileSaved={handleProfileSaved} />
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-white rounded-lg shadow p-4 md:p-6">
        <CardContent className="p-0">
          <h3 className="text-lg font-bold mb-4">Baby Summary</h3>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : !baby ? (
            <div className="text-center p-8 text-neutral-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p>Enter your baby's information above to see a summary</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-100 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">{baby.name}</h4>
                    <p className="text-sm text-neutral-500">{calculateBabyAge(baby.birthday)}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-neutral-100 rounded-lg flex items-center">
                <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-700 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Weight</p>
                  <p className="font-semibold font-mono">{baby.weight} kg</p>
                </div>
              </div>
              
              <div className="p-4 bg-neutral-100 rounded-lg flex items-center">
                <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-700 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Height</p>
                  <p className="font-semibold font-mono">{baby.height} cm</p>
                </div>
              </div>
              
              <div className="p-4 bg-neutral-100 rounded-lg flex items-center">
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Feeding Type</p>
                  <p className="font-semibold">{baby.feedingType}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
