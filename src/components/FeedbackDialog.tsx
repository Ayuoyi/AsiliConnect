import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface FeedbackDialogProps {
  productId: string;
  productName: string;
}

const FeedbackDialog = ({ productId, productName }: FeedbackDialogProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!comment.trim()) {
      setError("Please enter a comment");
      return;
    }

    const storageKey = "feedbacks";
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const item = {
      id: `${productId}-${Date.now()}`,
      productId,
      productName,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };
    existing.push(item);
    localStorage.setItem(storageKey, JSON.stringify(existing));
    setError("");
    setOpen(false);
    toast({ title: "Feedback saved", description: `Thanks — your feedback for ${productName} was recorded.` });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label={`Leave feedback for ${productName}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.036 0-2.019-.137-2.93-.39L3 21l1.39-4.07C3.9 15.26 3 13.72 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave feedback</DialogTitle>
          <DialogDescription>Share your experience with {productName}.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm">Rating</label>
            <div>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="mt-2 w-full">
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Terrible</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm">Comment</label>
            <Textarea value={comment} onChange={(e) => { setComment((e.target as HTMLTextAreaElement).value); if (error) setError(""); }} placeholder="Share details about quality, delivery, and overall satisfaction" />
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
