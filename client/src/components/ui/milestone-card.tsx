import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils/dates";
import { Milestone } from "@shared/schema";

interface MilestoneCardProps {
  milestone: Milestone;
  onMilestoneToggle: (milestone: Milestone, completed: boolean) => void;
}

export default function MilestoneCard({ milestone, onMilestoneToggle }: MilestoneCardProps) {
  return (
    <div 
      className={`border border-neutral-200 rounded-lg overflow-hidden transition-opacity duration-150 ${
        milestone.completed ? 'opacity-50' : ''
      }`}
    >
      <div 
        className={`p-3 ${
          milestone.completed 
            ? 'bg-neutral-200' 
            : 'bg-accent-100'
        } transition-colors duration-150`}
      >
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">{milestone.name}</h4>
          <span className="text-xs font-mono bg-white rounded-full px-2 py-1">{milestone.ageRange}</span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-neutral-500 mb-3">{milestone.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs">
            {milestone.completed 
              ? `Completed on ${formatDate(milestone.completedDate!)}` 
              : 'Not yet completed'
            }
          </span>
          <label className="flex items-center cursor-pointer">
            <span className="text-sm mr-2">Completed</span>
            <Checkbox 
              checked={milestone.completed}
              onCheckedChange={(checked) => onMilestoneToggle(milestone, checked as boolean)}
              className="h-5 w-5 text-accent border-neutral-200 rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
