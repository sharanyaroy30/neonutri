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
import { Textarea } from "@/components/ui/textarea";
import { getCurrentDate } from "@/lib/utils/dates";
import { Baby } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

// Form schema with validation
const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  weight: z.string().min(1, "Weight is required"),
  height: z.string().min(1, "Height is required"),
  notes: z.string().optional(),
});

interface GrowthRecordFormProps {
  baby: Baby | null;
  onRecordAdded: () => void;
}

export default function GrowthRecordForm({ baby, onRecordAdded }: GrowthRecordFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: getCurrentDate(),
      weight: baby?.weight || "",
      height: baby?.height || "",
      notes: "",
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
      await apiRequest(
        "POST",
        `/api/babies/${baby.id}/growth-records`,
        values
      );
      
      toast({
        title: "Record added",
        description: "Growth record has been added successfully",
      });
      
      onRecordAdded();
      form.reset({
        date: getCurrentDate(),
        weight: values.weight,
        height: values.height,
        notes: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add growth record: ${error}`,
        variant: "destructive",
      });
    }
  }, [baby, onRecordAdded, form, toast]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-semibold mb-2">Weight (kg)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    {...field} 
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-semibold mb-2">Height (cm)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1" 
                    placeholder="0.0" 
                    {...field} 
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="flex items-end">
            <Button 
              type="submit" 
              className="w-full px-4 py-2 bg-secondary text-white rounded-md font-semibold hover:bg-secondary-700 transition-colors duration-150"
            >
              Add Record
            </Button>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-semibold mb-2">Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Optional notes about this measurement" 
                  {...field} 
                  className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                  rows={2}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
