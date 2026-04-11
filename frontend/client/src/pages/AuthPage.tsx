import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User as UserIcon,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLoginMutation, useForgotPasswordMutation } from "@/store/authApi";
import { User } from "@/store/authSlice";
import logoImg from "@assets/HIgher_taste_logo_1771483400145.png";
import { toast } from "sonner";

const AuthPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  // Form States
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Credentials required");

    try {
      await login({ email, password }).unwrap();
      toast.success("Welcome back!");
      setLocation("/");
    } catch (err: any) {
      console.error("Auth error:", err);
      toast.error(err.data?.message || err.error || "Authentication failed");
    }
  };

  const isLoading = isLoginLoading;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9fa] relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-[1000px] px-4 md:px-6 py-8"
      >
        <Card className="border-none shadow-2xl rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row min-h-[600px]">
              
              {/* Left Side - Illustration/Gradient Panel */}
              <div className="hidden md:flex md:w-[45%] bg-primary relative p-12 flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
                
                {/* Decorative elements */}
                <div className="absolute top-[20%] right-[-20%] w-[300px] h-[300px] rounded-full border border-white/10" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[200px] h-[200px] rounded-full bg-white/5" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-10">
                    <img src={logoImg} alt="Higher Taste" className="h-10 w-auto bg-white rounded p-1" />
                    <div className="text-white">
                      <p className="font-bold text-xl leading-tight">The Higher</p>
                      <p className="font-medium text-white/70">Taste</p>
                    </div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                      <motion.div
                        key="login-text"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                          Internal Catering Operations Hub
                        </h2>
                        <p className="text-white/80 text-lg leading-relaxed">
                          Streamline your catering processes, manage orders, and deliver exceptional service with our centralized management system.
                        </p>
                      </motion.div>
                  </AnimatePresence>
                </div>

                <div className="relative z-10">
                  <div className="p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                    <p className="text-white/90 text-sm italic">
                      "Excellence in every serving, precision in every order."
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto max-h-[800px]">
                <div className="mb-10 block md:hidden">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={logoImg} alt="Higher Taste" className="h-8 w-auto bg-primary rounded p-1" />
                    <h1 className="text-2xl font-bold text-primary">The Higher Taste</h1>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Welcome Back
                      </h3>
                      <p className="text-muted-foreground">
                        Please enter your administrator credentials to access the hub.
                      </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-foreground/70 tracking-wide uppercase">
                          Email Address
                        </Label>
                        <div className="relative group">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                            <Mail size={16} />
                          </div>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="mukunda@hkmvizag.org" 
                            className="pl-9 h-11 bg-white border-muted focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl text-sm"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-xs font-semibold text-foreground/70 tracking-wide uppercase">Password</Label>
                        </div>
                        <div className="relative group">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                            <Lock size={16} />
                          </div>
                          <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="pl-9 pr-10 h-11 bg-white border-muted focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl text-sm"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Signing in...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              Login to Dashboard
                              <ArrowRight size={18} />
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 flex justify-center gap-6 text-muted-foreground/60 text-xs font-medium">
          <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Support</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
