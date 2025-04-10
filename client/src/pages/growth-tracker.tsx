import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Baby, GrowthRecord, Milestone } from "@shared/schema";
import { useState } from "react";
import { formatDate, formatDateShort, getCurrentDate } from "@/lib/utils/dates";
import { Skeleton } from "@/components/ui/skeleton";
import GrowthRecordForm from "@/components/forms/GrowthRecordForm";
import GrowthChart from "@/components/ui/growth-chart";
import MilestoneCard from "@/components/ui/milestone-card";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TrashIcon } from "lucide-react";

export default function GrowthTracker() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [chartType, setChartType] = useState<'weight' | 'height'>('weight');
  
  const { data: babies, isLoading: isLoadingBabies } = useQuery<Baby[]>({
    queryKey: ['/api/babies'],
  });
  
  // Use the first baby in the list if available
  const baby = babies?.length ? babies[0] : null;
  
  const { data: growthRecords, isLoading: isLoadingRecords } = useQuery<GrowthRecord[]>({
    queryKey: ['/api/babies', baby?.id, 'growth-records'],
    enabled: !!baby?.id,
  });
  
  const { data: milestones, isLoading: isLoadingMilestones } = useQuery<Milestone[]>({
    queryKey: ['/api/babies', baby?.id, 'milestones'],
    enabled: !!baby?.id,
  });
  
  const handleRecordAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/babies', baby?.id, 'growth-records'] });
    queryClient.invalidateQueries({ queryKey: ['/api/babies'] });
  };
  
  const handleDeleteGrowthRecord = async (id: number) => {
    if (confirm('Are you sure you want to delete this growth record?')) {
      try {
        await apiRequest("DELETE", `/api/growth-records/${id}`, undefined);
        toast({
          title: "Record deleted",
          description: "Growth record has been deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/babies', baby?.id, 'growth-records'] });
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to delete growth record: ${error}`,
          variant: "destructive",
        });
      }
    }
  };
  
  const handleMilestoneToggle = async (milestone: Milestone, completed: boolean) => {
    try {
      const updates = {
        completed,
        completedDate: completed ? getCurrentDate() : null,
      };
      
      await apiRequest("PATCH", `/api/milestones/${milestone.id}`, updates);
      
      toast({
        title: completed ? "Milestone completed" : "Milestone reopened",
        description: `${milestone.name} has been ${completed ? 'marked as completed' : 'unmarked'}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/babies', baby?.id, 'milestones'] });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update milestone: ${error}`,
        variant: "destructive",
      });
    }
  };
  
  const isLoading = isLoadingBabies || isLoadingRecords || isLoadingMilestones;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 mb-16 lg:mb-0">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="space-y-6">
          <Card>
            <div className="px-6 py-4 bg-secondary">
              <Skeleton className="h-6 w-64 bg-white/20" />
              <Skeleton className="h-4 w-40 mt-1 bg-white/20" />
            </div>
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
              <Skeleton className="h-32 w-full mt-4" />
            </CardContent>
          </Card>
          
          <Card>
            <div className="px-6 py-4 bg-primary">
              <Skeleton className="h-6 w-64 bg-white/20" />
              <Skeleton className="h-4 w-40 mt-1 bg-white/20" />
            </div>
            <CardContent className="p-4 md:p-6">
              <Skeleton className="h-10 w-48 mb-4" />
              <Skeleton className="h-64 w-full mb-6" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-48 w-full mt-4" />
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
          <h2 className="text-2xl font-bold mb-2">Growth Tracker</h2>
          <p className="text-neutral-500">Monitor your baby's growth milestones and progress</p>
        </div>
        
        <Card className="bg-white rounded-lg shadow p-6 text-center">
          <div className="bg-neutral-100 rounded-lg p-8 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold mb-2">Complete Your Baby's Profile</p>
            <p className="text-neutral-500">Please create a profile for your baby to track growth milestones.</p>
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
        <h2 className="text-2xl font-bold mb-2">Growth Tracker</h2>
        <p className="text-neutral-500">Monitor your baby's growth milestones and progress</p>
      </div>
      
      <div className="space-y-6">
        {/* Add New Measurement */}
        <Card className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-secondary text-white">
            <h3 className="text-lg font-semibold">Add New Measurement</h3>
            <p className="text-sm opacity-80">Track your baby's growth over time</p>
          </div>
          <CardContent className="p-4 md:p-6">
            <GrowthRecordForm baby={baby} onRecordAdded={handleRecordAdded} />
          </CardContent>
        </Card>
        
        {/* Growth Charts */}
        <Card className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-primary text-white">
            <h3 className="text-lg font-semibold">Growth Charts</h3>
            <p className="text-sm opacity-80">Visualize your baby's growth progress</p>
          </div>
          <CardContent className="p-4 md:p-6">
            <div className="flex mb-4">
              <Button 
                onClick={() => setChartType('weight')}
                variant={chartType === 'weight' ? "default" : "outline"}
                className={`px-4 py-2 rounded-l-md text-sm font-semibold transition-colors duration-150 ${
                  chartType === 'weight'
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-800'
                }`}
              >
                Weight
              </Button>
              <Button 
                onClick={() => setChartType('height')}
                variant={chartType === 'height' ? "default" : "outline"}
                className={`px-4 py-2 rounded-r-md text-sm font-semibold transition-colors duration-150 ${
                  chartType === 'height'
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-800'
                }`}
              >
                Height
              </Button>
            </div>
            
            <GrowthChart records={growthRecords || []} chartType={chartType} />
            
            {growthRecords && growthRecords.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Growth Records</h4>
                  <span className="text-sm text-neutral-500">{`${growthRecords.length} records`}</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left bg-neutral-100">
                        <th className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Weight (kg)</th>
                        <th className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Height (cm)</th>
                        <th className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Notes</th>
                        <th className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {[...growthRecords].reverse().map((record) => (
                        <tr key={record.id} className="hover:bg-neutral-100 transition-colors duration-150">
                          <td className="px-4 py-3">{formatDate(record.date)}</td>
                          <td className="px-4 py-3 font-mono">{record.weight}</td>
                          <td className="px-4 py-3 font-mono">{record.height}</td>
                          <td className="px-4 py-3 text-sm text-neutral-500">{record.notes || '-'}</td>
                          <td className="px-4 py-3">
                            <Button 
                              onClick={() => handleDeleteGrowthRecord(record.id)} 
                              variant="ghost"
                              className="text-red-500 hover:text-red-700 transition-colors duration-150 p-0"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Developmental Milestones */}
        <Card className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-accent text-white">
            <h3 className="text-lg font-semibold">Developmental Milestones</h3>
            <p className="text-sm opacity-80">Track important feeding and growth milestones</p>
          </div>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              {milestones && milestones.map((milestone) => (
                <MilestoneCard 
                  key={milestone.id} 
                  milestone={milestone} 
                  onMilestoneToggle={handleMilestoneToggle} 
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
