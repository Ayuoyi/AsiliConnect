import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Role = "buyer" | "farmer";

const SignInDialog = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("buyer");
  const [remember, setRemember] = useState(true);
  const [open, setOpen] = useState(false);
  const [nameError, setNameError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError("Please enter your display name");
      return;
    }
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("userName", name.trim());
    if (role === "farmer") storage.setItem("farmerName", name.trim());
    setNameError("");
    setOpen(false);
    // show success toast
    try {
      const goTo = role === "farmer" ? "/farmer-dashboard" : "/buyer-dashboard";
      const titleNode = (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Signed in</span>
        </div>
      );

      const t = toast({
        // toast type expects a stricter title type; cast JSX to any to allow element
        title: titleNode as any,
        description: `Welcome back, ${name.trim()}!`,
      });

      const action = (
        <ToastAction asChild altText="Open dashboard">
          <button onClick={() => {
            try {
              t.dismiss();
            } catch {}
            navigate(goTo);
          }}>Open Dashboard</button>
        </ToastAction>
      );

      // attach the action to the existing toast
      t.update({
        id: t.id,
        title: titleNode as any,
        description: `Welcome back, ${name.trim()}!`,
        action,
      });
    } catch (e) {
      // ignore toast errors
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Sign In</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>Enter a display name to personalize your dashboard.</DialogDescription>
        </DialogHeader>

  <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm">Display name</label>
            <Input value={name} onChange={(e) => { setName((e.target as HTMLInputElement).value); if (nameError) setNameError(""); }} placeholder="Enter your full name" />
            {nameError && <p className="text-xs text-destructive mt-1">{nameError}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember((e.target as HTMLInputElement).checked)} className="w-4 h-4" />
            <label htmlFor="remember" className="text-sm">Remember me</label>
          </div>

          <div>
            <label className="text-sm">Role</label>
            <div className="flex gap-2 mt-2">
              <Button variant={role === "buyer" ? "hero" : "outline"} size="sm" onClick={() => setRole("buyer")}>Buyer</Button>
              <Button variant={role === "farmer" ? "hero" : "outline"} size="sm" onClick={() => setRole("farmer")}>Farmer</Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>Sign In</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
