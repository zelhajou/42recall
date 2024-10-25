// app/components/dialogs/edit-deck-dialog.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const COMMON_42_PROJECTS = [
  'Libft',
  'ft_printf',
  'get_next_line',
  'Born2beroot',
  'FdF',
  'minitalk',
  'push_swap',
  'minishell',
  'philosophers',
  'NetPractice',
  'cub3d/miniRT',
  'CPP Modules',
  'inception',
  'ft_irc',
  'ft_transcendence'
] as const;

const TOPICS = [
  'C Functions',
  'System Calls',
  'Data Structures',
  'Algorithms',
  'Shell Commands',
  'Networking',
  'Memory Management',
  'Process Management',
  'Docker',
  'Git Commands',
  'Project Tips',
  'Common Errors'
] as const;

interface EditDeckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deck: any; // Replace with proper type
}

export function EditDeckDialog({ open, onOpenChange, deck }: EditDeckDialogProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
      title: deck.title,
      description: deck.description || '',
      project: deck.project || 'none',
      topic: deck.topic || 'none',
      isPublic: deck.isPublic,
    });
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
  
      try {
        const response = await fetch(`/api/decks/${deck.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            project: formData.project === 'none' ? null : formData.project,
            topic: formData.topic === 'none' ? null : formData.topic,
            isPublic: formData.isPublic,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update deck');
        }
  
        onOpenChange(false);
        router.refresh();
      } catch (error) {
        console.error('Error updating deck:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Deck</DialogTitle>
            <DialogDescription>
              Update your deck's information.
            </DialogDescription>
          </DialogHeader>
  
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <div className="space-y-4 overflow-y-auto flex-1 pr-6 -mr-6">
              <Input
                placeholder="Deck Title"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
              
              <Select
                value={formData.project}
                onValueChange={(value) => setFormData(prev => ({ ...prev, project: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Project</SelectItem>
                  {COMMON_42_PROJECTS.map((project) => (
                    <SelectItem key={project} value={project.toLowerCase()}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
  
              <Select
                value={formData.topic}
                onValueChange={(value) => setFormData(prev => ({ ...prev, topic: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Topic</SelectItem>
                  {TOPICS.map((topic) => (
                    <SelectItem key={topic} value={topic.toLowerCase()}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Textarea
                placeholder="Deck Description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
  
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, isPublic: checked }))}
                />
                <label>Make deck public</label>
              </div>
            </div>
  
            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }