import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Baby, FeedingLog as FeedingLogType } from "@shared/schema";
import { useState } from "react";
import { formatDate, formatTime, getCurrentDate, getLastSevenDays, formatDayShort } from "@/lib/utils/dates";
import { getFeedingCountForDay, getTodayFeedingCount, getMostCommonFood, getAvgTimeBetweenFeedings } from "@/lib/utils/nutrition";
import { Skeleton } from "@/components/ui/skeleton";
import FeedingLogForm from "@/components/forms/FeedingLogForm";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function FeedingLog() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showAddFeedingModal, setShowAddFeedingModal] = useState(false);
  const [filters, setFilters] = useState({
    date: "",
    foodType: "",
  });
  
  const { data: babies, isLoading: isLoadingBabies } = useQuery<Baby[]>({
    queryKey: ['/api/babies'],
  });
  
  // Use the first baby in the list if available
  const baby = babies?.length ? babies[0] : null;
  
  const { data: feedingLogs, isLoading: isLoadingLogs } = useQuery<FeedingLogType[]>({
    queryKey: ['/api/babies', baby?.id, 'feeding-logs'],
    enabled: !!baby?.id,
  });
  
  const handleFeedingAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/babies', baby?.id, 'feeding-logs'] });
  };
  
  const handleDeleteFeedingEntry = async (id: number) => {
    if (confirm('Are you sure you want to delete this feeding entry?')) {
      try {
        await apiRequest("DELETE", `/api/feeding-logs/${id}`, undefined);
        toast({
          title: "Feeding deleted",
          description: "Feeding entry has been deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/babies', baby?.id, 'feeding-logs'] });
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to delete feeding entry: ${error}`,
          variant: "destructive",
        });
      }
    }
  };
  
  const getFilteredFeedingLog = () => {
    if (!feedingLogs) return [];
    
    return feedingLogs.filter(entry => {
      let matchesDate = true;
      let matchesType = true;
      
      if (filters.date) {
        matchesDate = entry.date === filters.date;
      }
      
      if (filters.foodType) {
        matchesType = entry.foodType === filters.foodType;
      }
      
      return matchesDate && matchesType;
    });
  };
  
  const resetFilters = () => {
    setFilters({
      date: "",
      foodType: "",
    });
  };
  
  const isLoading = isLoadingBabies || isLoadingLogs;
  const filteredFeedingLog = getFilteredFeedingLog();

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 mb-16 lg:mb-0">
        <div className="mb-6 flex flex-wrap justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-1" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32 mt-2 md:mt-0" />
        </div>
        
        <Card className="mb-6">
          <div className="p-4 md:p-6 border-b border-neutral-200">
            <div className="flex flex-wrap gap-4 justify-between">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <div className="p-8">
            <Skeleton className="h-12 w-12 mx-auto mb-3" />
            <Skeleton className="h-5 w-64 mx-auto mb-4" />
            <Skeleton className="h-10 w-40 mx-auto" />
          </div>
        </Card>
      </div>
    );
  }
  
  if (!baby) {
    return (
      <div className="p-4 md:p-6 lg:p-8 mb-16 lg:mb-0">
        <div className="mb-6 flex flex-wrap justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">Feeding Log</h2>
            <p className="text-neutral-500">Track and monitor your baby's feeding history</p>
          </div>
        </div>
        
        <Card className="bg-white rounded-lg shadow p-6 text-center">
          <div className="bg-neutral-100 rounded-lg p-8 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold mb-2">Complete Your Baby's Profile</p>
            <p className="text-neutral-500">Please create a profile for your baby to track feeding history.</p>
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
      <div className="mb-6 flex flex-wrap justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">Feeding Log</h2>
          <p className="text-neutral-500">Track and monitor your baby's feeding history</p>
        </div>
        <Button 
          onClick={() => setShowAddFeedingModal(true)} 
          className="mt-2 md:mt-0 px-4 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition-colors duration-150 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Feeding
        </Button>
      </div>
      
      <Card className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 md:p-6 border-b border-neutral-200">
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="flex items-center">
              <label htmlFor="dateFilter" className="mr-2 text-sm font-semibold">Date:</label>
              <Input 
                id="dateFilter" 
                type="date" 
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
                className="px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <label htmlFor="foodTypeFilter" className="text-sm font-semibold">Food Type:</label>
              <Select 
                value={filters.foodType}
                onValueChange={(value) => setFilters({...filters, foodType: value})}
              >
                <SelectTrigger id="foodTypeFilter" className="px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="Breast Milk">Breast Milk</SelectItem>
                  <SelectItem value="Formula">Formula</SelectItem>
                  <SelectItem value="Puree">Puree</SelectItem>
                  <SelectItem value="Solid Food">Solid Food</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={resetFilters} 
              variant="ghost"
              className="px-3 py-2 text-sm text-primary font-semibold hover:text-primary-dark transition-colors duration-150"
            >
              Reset Filters
            </Button>
          </div>
        </div>
        
        {filteredFeedingLog.length === 0 ? (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-neutral-500">No feeding records found for the selected filters.</p>
            <Button 
              onClick={() => setShowAddFeedingModal(true)} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition-colors duration-150"
            >
              Add First Feeding
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-neutral-100">
                  <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Food Type</th>
                  <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Food Name</th>
                  <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Notes</th>
                  <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredFeedingLog.map((entry) => (
                  <tr key={entry.id} className="hover:bg-neutral-100 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="font-semibold block">{formatDate(entry.date)}</span>
                      <span className="text-sm text-neutral-500">{formatTime(entry.time)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          entry.foodType === 'Breast Milk' ? 'bg-primary-100 text-primary-700' :
                          entry.foodType === 'Formula' ? 'bg-secondary-100 text-secondary-700' :
                          entry.foodType === 'Puree' ? 'bg-accent-100 text-accent-700' :
                          'bg-neutral-500 text-white'
                        }`}
                      >
                        {entry.foodType}
                      </span>
                    </td>
                    <td className="px-6 py-4">{entry.foodName}</td>
                    <td className="px-6 py-4 font-mono">{entry.amount}</td>
                    <td className="px-6 py-4 text-sm text-neutral-500">{entry.notes || '-'}</td>
                    <td className="px-6 py-4">
                      <Button 
                        onClick={() => handleDeleteFeedingEntry(entry.id)} 
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
        )}
      </Card>
      
      {feedingLogs && feedingLogs.length > 0 && (
        <Card className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-primary text-white">
            <h3 className="text-lg font-semibold">Feeding Statistics</h3>
            <p className="text-sm opacity-80">Summary of recent feeding data</p>
          </div>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-neutral-100 rounded-lg text-center">
                <p className="text-neutral-500 text-sm mb-1">Total Feedings Today</p>
                <p className="font-bold text-3xl text-primary">{getTodayFeedingCount(feedingLogs)}</p>
              </div>
              
              <div className="p-4 bg-neutral-100 rounded-lg text-center">
                <p className="text-neutral-500 text-sm mb-1">Most Common Food</p>
                <p className="font-bold text-xl">{getMostCommonFood(feedingLogs) || '-'}</p>
              </div>
              
              <div className="p-4 bg-neutral-100 rounded-lg text-center">
                <p className="text-neutral-500 text-sm mb-1">Avg. Time Between Feedings</p>
                <p className="font-bold text-xl">{getAvgTimeBetweenFeedings(feedingLogs) || '-'}</p>
              </div>
            </div>
            
            <div className="h-64 bg-neutral-100 rounded-lg p-4 relative">
              <h4 className="font-semibold mb-4">Feeding Pattern (Last 7 Days)</h4>
              
              <div className="absolute inset-0 p-4 pt-10">
                <div className="flex h-full items-end justify-between">
                  {getLastSevenDays().map((day, index) => (
                    <div key={index} className="flex flex-col items-center w-full">
                      <div className="w-full px-1">
                        <div 
                          className="chart-bar bg-primary rounded-t w-full transition-all duration-500"
                          style={{height: `${Math.min(getFeedingCountForDay(feedingLogs, day) * 10, 100)}%`}}
                        >
                        </div>
                      </div>
                      <span className="text-xs text-neutral-500 mt-2">{formatDayShort(day)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <FeedingLogForm 
        isOpen={showAddFeedingModal}
        onClose={() => setShowAddFeedingModal(false)}
        baby={baby}
        onFeedingAdded={handleFeedingAdded}
      />
    </div>
  );
}
