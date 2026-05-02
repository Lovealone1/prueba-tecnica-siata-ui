import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

export function OtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { email, intent, ttl, registration_data } = (location.state as { 
    email: string; 
    intent: "LOGIN" | "REGISTER"; 
    ttl: number;
    registration_data?: any;
  }) || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(ttl || 300);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const resendMutation = useMutation({
    mutationFn: () => authService.requestOtp({ email, intent }),
    onSuccess: (data) => {
      setTimeLeft(data.ttl_seconds);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (otpString: string) =>
      authService.verifyOtp({
        email,
        intent,
        otp: otpString,
        registration_data: intent === "REGISTER" ? registration_data : undefined
      }),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate("/dashboard");
    },
  });

  if (!email) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullOtp = newOtp.join("");
    if (fullOtp.length === 6) {
      verifyMutation.mutate(fullOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "");
    
    if (!pastedData) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    if (pastedData.length === 6) {
      verifyMutation.mutate(pastedData);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex font-inter">
      {/* Left Panel: Consistent Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden">
        <img
          src="/assets/images/auth-bg.png"
          alt="Logistics Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl font-extrabold tracking-tighter font-manrope">SIATA Logistics</span>
          </div>
          <h2 className="text-5xl font-extrabold mb-6 leading-tight font-manrope">
            Seguridad y control <br />
            en cada movimiento.
          </h2>
          <p className="text-xl text-blue-100 max-w-lg leading-relaxed opacity-90">
            Tu acceso está protegido con cifrado de grado industrial y autenticación dinámica.
          </p>
        </div>
      </div>

      {/* Right Panel: OTP Logic */}
      <div className="w-full lg:w-1/2 flex flex-col bg-surface overflow-y-auto">
        <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 relative">

          {/* Back Button */}
          <button
            onClick={() => navigate("/auth/login")}
            className="absolute top-8 left-8 flex items-center gap-2 text-secondary hover:text-primary font-bold transition-all group"
          >
            <span className="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-xs uppercase tracking-[0.2em]">Volver atrás</span>
          </button>

          <div className="w-full max-w-[480px] flex flex-col items-center">

            {/* Card */}
            <div className="bg-white border border-outline-variant/30 rounded-2xl p-8 md:p-12 shadow-[0px_10px_40px_rgba(0,0,0,0.08)] w-full">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-manrope font-extrabold text-on-surface mb-3 tracking-tight">
                  Verifica tu correo
                </h1>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Hemos enviado un código de seguridad a: <br />
                  <span className="font-black text-primary text-base">{email}</span>
                </p>
              </div>

              {/* OTP Inputs */}
              <div className="flex justify-between gap-2 mb-10">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className={cn(
                      "w-12 h-16 md:w-14 md:h-20 text-center text-3xl font-black rounded-xl border-2 transition-all outline-none",
                      digit
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-outline-variant/40 bg-surface text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/5"
                    )}
                  />
                ))}
              </div>

              {/* Timer & Resend Action */}
              <div className="text-center space-y-6">
                {timeLeft > 0 ? (
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-surface-container-high rounded-full border border-outline-variant/20 shadow-sm">
                    <span className="material-symbols-outlined text-primary animate-pulse text-xl">timer</span>
                    <span className="text-sm font-bold text-on-surface tabular-nums">
                      Reenviar en <span className="text-primary">{formatTime(timeLeft)}</span>
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <p className="text-xs font-bold text-error uppercase tracking-widest">
                      El tiempo ha expirado
                    </p>
                    <button
                      onClick={() => resendMutation.mutate()}
                      disabled={resendMutation.isPending}
                      className="w-full py-4 bg-white border-2 border-primary text-primary font-black uppercase tracking-widest text-xs rounded-xl hover:bg-primary hover:text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
                    >
                      {resendMutation.isPending ? (
                        <span className="animate-spin material-symbols-outlined">progress_activity</span>
                      ) : (
                        <>
                          <span>Solicitar nuevo código</span>
                          <span className="material-symbols-outlined text-xl">refresh</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Verification Status */}
            {verifyMutation.isPending && (
              <div className="mt-8 flex items-center gap-3 bg-primary/5 px-6 py-3 rounded-full border border-primary/10">
                <span className="animate-spin material-symbols-outlined text-primary">progress_activity</span>
                <span className="text-sm font-bold text-primary uppercase tracking-widest">Validando acceso</span>
              </div>
            )}

            {verifyMutation.isError && (
              <div className="mt-8 flex items-center gap-3 bg-error/5 px-6 py-3 rounded-full border border-error/10 animate-in shake duration-500">
                <span className="material-symbols-outlined text-error">error</span>
                <span className="text-sm font-bold text-error uppercase tracking-widest">Código incorrecto</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 text-[10px] text-outline/50 font-bold tracking-[0.2em] uppercase flex flex-col items-center gap-3 mt-auto">
          <p>© 2024 SIATA Logistics Infrastructure</p>
        </footer>
      </div>
    </div>
  );
}
