// app/components/dialogs/share-deck-dialog.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Check, Copy, Link as LinkIcon } from 'lucide-react';

interface ShareDeckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deck: any;
}

export function ShareDeckDialog({ open, onOpenChange, deck }: ShareDeckDialogProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Set the share URL after component mounts
  useEffect(() => {
    setShareUrl(`${window.location.origin}/decks/${deck.id}`);
  }, [deck.id]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!shareUrl) return null; // Don't render until shareUrl is set

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Deck</DialogTitle>
          <DialogDescription>
            Share your deck with other 42 students
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div>Public Access</div>
              <div className="text-sm text-muted-foreground">
                Allow anyone with the link to view this deck
              </div>
            </div>
            <Switch checked={deck.isPublic} disabled />
          </div>

          <div className="flex space-x-2">
            <Input
              value={shareUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              size="icon"
              onClick={copyToClipboard}
              variant="outline"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Share via</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full justify-start">
                <LinkIcon className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}