import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User as UserIcon,
  Check,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSignupMutation } from "@/store/authApi";
import logoImg from "@assets/HIgher_taste_logo_1771483400145.png";
import { toast } from "sonner";


const SignupPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("staff");
  const [phone, setPhone] = useState("");
  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return toast.error("Please fill in all required fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    try {
      await signup({ 
        username: email, 
        name, 
        email, 
        password, 
        role,
        phone 
      }).unwrap();

      toast.success("Account created successfully! You can now log in.");
      setLocation("/login");
    } catch (err: any) {
      console.error("Signup failed:", err);
      const message = err.data?.message || err.error || "Something went wrong. Please try again.";
      toast.error(message);
    }
  };



  // UI-only password strength indicator (visual logic)
  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 33;
    if (password.length < 10) return 66;
    return 100;
  };

  const getPasswordColor = () => {
    const strength = getPasswordStrength();
    if (strength <= 33) return "bg-red-500 shadow-red-500/20";
    if (strength <= 66) return "bg-yellow-500 shadow-yellow-500/20";
    return "bg-green-500 shadow-green-500/20";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9fa] relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-[1000px] px-4 md:px-6 py-8"
      >
        <Card className="border-none shadow-2xl rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row min-h-[600px]">
              
              {/* Left Side - Illustration/Gradient Panel */}
              <div className="hidden md:flex md:w-[45%] bg-primary relative p-12 flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
                
                {/* Decorative elements */}
                <div className="absolute top-[-5%] left-[-10%] w-[150px] h-[150px] rounded-full border border-white/10" />
                <div className="absolute top-[40%] right-[-5%] w-[80px] h-[80px] rounded-full bg-white/10" />
                <div className="absolute bottom-[10%] right-[10%] w-0 h-0 border-l-[100px] border-l-transparent border-t-[80px] border-t-white/5 border-r-[80px] border-r-transparent" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-10">
                    <img src={logoImg} alt="Higher Taste" className="h-10 w-auto bg-white rounded p-1" />
                    <div className="text-white">
                      <p className="font-bold text-xl leading-tight">The Higher</p>
                      <p className="font-medium text-white/70">Taste</p>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                    Join Our Operational Excellence
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 min-w-10 rounded-lg bg-white/10 flex items-center justify-center text-white border border-white/10">
                        <ShieldCheck size={22} />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-base">Secure & Centralized</h4>
                        <p className="text-white/70 text-sm">Enterprise-grade security for your operations and catering data.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 min-w-10 rounded-lg bg-white/10 flex items-center justify-center text-white border border-white/10">
                        <Briefcase size={22} />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-base">End-to-End Workflow</h4>
                        <p className="text-white/70 text-sm">Managing every step from quotes to dispatch and billing.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-10">
                  <div className="p-5 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
                    <div className="flex gap-1 mb-2">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="h-1 w-6 rounded bg-primary-foreground/30 overflow-hidden">
                           <div className="h-full bg-white rounded transition-all duration-1000" style={{ width: i === 5 ? '80%' : '100%' }} />
                        </div>
                      ))}
                    </div>
                    <p className="text-white font-bold text-xs">JOIN 200+ STAFF MEMBERS ALREADY ACTIVE</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="flex-1 p-8 md:px-12 lg:px-16 flex flex-col justify-center max-h-[800px] overflow-y-auto">
                <div className="mb-8 block md:hidden">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={logoImg} alt="Higher Taste" className="h-8 w-auto bg-primary rounded p-1" />
                    <h1 className="text-2xl font-bold text-primary">The Higher Taste</h1>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Create Account</h3>
                  <p className="text-muted-foreground text-sm">Fill in your details to set up your team profile.</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-semibold text-foreground/70 tracking-wide uppercase">Full Name</Label>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                          <UserIcon size={16} />
                        </div>
                        <Input 
                          id="name" 
                          placeholder="Arjun Das" 
                          className="pl-9 h-11 bg-white border-muted focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl text-sm"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="role" className="text-xs font-semibold text-foreground/70 tracking-wide uppercase">Organization Role</Label>
                      <Select defaultValue="staff" value={role} onValueChange={setRole}>
                        <SelectTrigger className="h-11 bg-white border-muted focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl text-sm pl-3">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-muted shadow-xl">
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="staff">Operational Staff</SelectItem>
                          <SelectItem value="viewer">Viewer/Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-foreground/70 tracking-wide uppercase">Company Email</Label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                        <Mail size={16} />
                      </div>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="arjun@highertaste.com" 
                        className="pl-9 h-11 bg-white border-muted focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl text-sm"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-semibold text-foreground/70 tracking-wide uppercase">WhatsApp Number</Label>
                      <div className="relative group">
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="8247806856" 
                          className="h-11 bg-white border-muted focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl text-sm pl-4"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-xs font-semibold text-foreground/70 tracking-wide uppercase">Password</Label>
                      <div className="relative group">
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10 h-11 bg-white border-muted focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl text-sm"
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {/* Password strength bar */}
                      <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${getPasswordColor()} transition-all`}
                          initial={{ width: 0 }}
                          animate={{ width: `${getPasswordStrength()}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">Min 8 chars, 1 number & 1 special char</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirm" className="text-xs font-semibold text-foreground/70 tracking-wide uppercase">Confirm</Label>
                      <Input 
                        id="confirm" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-11 bg-white border-muted focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-base shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                      disabled={isSignupLoading}
                    >
                      {isSignupLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating Account...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          Start Using Higher Taste
                          <ArrowRight size={18} />
                        </div>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-8 pt-6 border-t border-muted text-center">
                  <p className="text-muted-foreground text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-bold hover:underline inline-flex items-center gap-1 group">
                      Log in here
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </p>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignupPage;
