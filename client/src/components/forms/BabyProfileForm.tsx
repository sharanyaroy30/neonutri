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
import { Checkbox } from "@/components/ui/checkbox";
import { Baby } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

const dietaryRestrictions = ['Dairy', 'Gluten', 'Eggs', 'Nuts', 'Soy'];
const feedingTypes = ['Breast Milk', 'Formula', 'Puree', 'Solid Food'];

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(1, "Baby's name is required"),
  birthday: z.string().min(1, "Birthday is required"),
  weight: z.string().min(1, "Weight is required"),
  height: z.string().min(1, "Height is required"),
  feedingType: z.string().min(1, "Feeding type is required"),
  restrictions: z.array(z.string()),
});

interface BabyProfileFormProps {
  baby: Baby | null;
  onProfileSaved: (baby: Baby) => void;
}

export default function BabyProfileForm({ baby, onProfileSaved }: BabyProfileFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: baby?.name || "",
      birthday: baby?.birthday || "",
      weight: baby?.weight || "",
      height: baby?.height || "",
      feedingType: baby?.feedingType || "Breast Milk",
      restrictions: baby?.restrictions || [],
    },
  });

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    try {
      if (baby?.id) {
        // Update existing baby profile
        const response = await apiRequest(
          "PATCH",
          `/api/babies/${baby.id}`,
          values
        );
        const updatedBaby = await response.json();
        onProfileSaved(updatedBaby);
        toast({
          title: "Profile updated",
          description: "Baby profile has been updated successfully",
        });
      } else {
        // Create new baby profile
        const response = await apiRequest(
          "POST",
          "/api/babies",
          values
        );
        const newBaby = await response.json();
        onProfileSaved(newBaby);
        toast({
          title: "Profile created",
          description: "Baby profile has been created successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save profile: ${error}`,
        variant: "destructive",
      });
    }
  }, [baby, onProfileSaved, toast]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-semibold mb-2">Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Baby's name" 
                    {...field} 
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-semibold mb-2">Birthday</FormLabel>
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
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-semibold mb-2">Current Weight (kg)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    {...field} 
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                <FormLabel className="block text-sm font-semibold mb-2">Current Height (cm)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1" 
                    placeholder="0.0" 
                    {...field} 
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="feedingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-semibold mb-2">Feeding Type</FormLabel>
                <FormControl>
                  <RadioGroup 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    className="flex flex-wrap gap-3"
                  >
                    {feedingTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={type} 
                          id={`feeding-${type}`} 
                          className="hidden" 
                        />
                        <label
                          htmlFor={`feeding-${type}`}
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
            name="restrictions"
            render={() => (
              <FormItem>
                <FormLabel className="block text-sm font-semibold mb-2">Dietary Restrictions</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {dietaryRestrictions.map((restriction) => (
                    <FormField
                      key={restriction}
                      control={form.control}
                      name="restrictions"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={restriction}
                            className="flex flex-row items-center space-x-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(restriction)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, restriction])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== restriction
                                        )
                                      )
                                }}
                                className="hidden"
                                id={`restriction-${restriction}`}
                              />
                            </FormControl>
                            <label
                              htmlFor={`restriction-${restriction}`}
                              className={`px-3 py-1 rounded-full text-xs transition-colors duration-150 cursor-pointer ${
                                field.value?.includes(restriction)
                                  ? 'bg-secondary text-white'
                                  : 'bg-neutral-200 text-neutral-800'
                              }`}
                            >
                              {restriction}
                            </label>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button 
            type="submit" 
            className="px-6 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition-colors duration-150"
          >
            Save Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
