import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentDate, getCurrentTime } from "@/lib/utils/dates";
import { Food } from "@/lib/data/food-data";
import { Baby } from "@shared/schema";
import { useCallback } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Form schema with validation
const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  foodType: z.string().min(1, "Food type is required"),
  foodName: z.string().min(1, "Food name is required"),
  amount: z.string().min(1, "Amount is required"),
  amountUnit: z.string().min(1, "Unit is required"),
  notes: z.string().optional(),
});

interface FeedingLogFormProps {
  isOpen: boolean;
  onClose: () => void;
  baby: Baby | null;
  initialFood?: Food;
  onFeedingAdded: () => void;
}

const feedingTypes = ['Breast Milk', 'Formula', 'Puree', 'Solid Food'];
const amountUnits = ['ml', 'oz', 'g', 'tbsp'];

export default function FeedingLogForm({ 
  isOpen, 
  onClose, 
  baby, 
  initialFood, 
  onFeedingAdded 
}: FeedingLogFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: getCurrentDate(),
      time: getCurrentTime(),
      foodType: initialFood?.category === 'Dairy' 
        ? 'Formula' 
        : initialFood?.category === 'Fruits' || initialFood?.category === 'Vegetables' 
          ? 'Puree' 
          : 'Breast Milk',
      foodName: initialFood?.name || '',
      amount: '',
      amountUnit: 'ml',
      notes: '',
    },
  });

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    if (!baby?.id) {
      toast({
        title: "Error",
        description: "Please create a baby profile first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const feedingData = {
        date: values.date,
        time: values.time,
        foodType: values.foodType,
        foodName: values.foodName,
        amount: `${values.amount} ${values.amountUnit}`,
        notes: values.notes,
      };
      
      await apiRequest(
        "POST",
        `/api/babies/${baby.id}/feeding-logs`,
        feedingData
      );
      
      toast({
        title: "Feeding logged",
        description: "Feeding entry has been added successfully",
      });
      
      onFeedingAdded();
      onClose();
      form.reset({
        date: getCurrentDate(),
        time: getCurrentTime(),
        foodType: 'Breast Milk',
        foodName: '',
        amount: '',
        amountUnit: 'ml',
        notes: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add feeding log: ${error}`,
        variant: "destructive",
      });
    }
  }, [baby, onFeedingAdded, onClose, form, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add Feeding Entry</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-semibold mb-2">Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-semibold mb-2">Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                        className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="foodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-semibold mb-2">Food Type</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      className="flex flex-wrap gap-2"
                    >
                      {feedingTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={type} 
                            id={`feeding-type-${type}`} 
                            className="hidden" 
                          />
                          <label
                            htmlFor={`feeding-type-${type}`}
                            className={`px-4 py-2 rounded-full text-sm transition-colors duration-150 cursor-pointer ${
                              field.value === type
                                ? 'bg-primary text-white'
                                : 'bg-neutral-200 text-neutral-800'
                            }`}
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="foodName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-semibold mb-2">Food Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Carrot Puree" 
                      {...field} 
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block text-sm font-semibold mb-2">Amount</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 60" 
                        {...field} 
                        className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amountUnit"
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormLabel className="block text-sm font-semibold mb-2">Unit</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountUnits.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-semibold mb-2">Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Optional notes about this feeding" 
                      {...field} 
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      rows={2}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="px-4 py-2 border border-neutral-200 rounded-md text-neutral-600"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="px-6 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-700 transition-colors duration-150"
              >
                Save Entry
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
