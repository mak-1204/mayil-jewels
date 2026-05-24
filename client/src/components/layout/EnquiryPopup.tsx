import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { addFirebaseEnquiry } from "@/lib/firebase";
import { toast } from "sonner";

export default function EnquiryPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem("enquiryPopupShown");
    
    if (!hasSeenPopup) {
      // Set a timer for 1 minute (60000 ms)
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("enquiryPopupShown", "true");
      }, 60000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please fill in both name and phone number");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addFirebaseEnquiry({ name, phone });
      toast.success("Thank you for your enquiry! We will get in touch soon.");
      setIsOpen(false);
    } catch (err: any) {
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-[var(--brand)] text-center">Interested in our Collection?</DialogTitle>
          <DialogDescription className="text-center">
            Leave your details below and our experts will get in touch with you shortly.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile Number</label>
            <input
              type="tel"
              required
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[var(--brand)] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--brand)]/90 transition-colors disabled:opacity-70 mt-2"
          >
            {isSubmitting ? "Submitting..." : "Request Call Back"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
