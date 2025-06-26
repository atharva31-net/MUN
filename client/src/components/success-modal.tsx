import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Info } from "lucide-react";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SuccessModal({ open, onClose }: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="bg-green-500 -m-6 mb-6 px-6 py-4 rounded-t-lg">
          <DialogTitle className="flex items-center text-white">
            <CheckCircle className="h-6 w-6 mr-3" />
            Registration Successful!
          </DialogTitle>
          <p className="text-green-100 text-sm mt-1">Your application has been submitted</p>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-700">
            Thank you for registering for the Model United Nations Conference. You will receive a confirmation email shortly with further details.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-2">Next Steps:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Check your email for confirmation</li>
                  <li>Complete payment if required</li>
                  <li>Review conference materials</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
              Got it, thanks!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
