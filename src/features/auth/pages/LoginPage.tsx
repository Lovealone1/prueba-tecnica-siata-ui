import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { RequestOtpSchema, type RequestOtpPayload, type AuthIntent } from "../types/auth.types";
import { authService } from "../services/auth.service";
import { cn } from "@/lib/utils";
import { Icon } from "@/utils/icon";

export function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RequestOtpPayload>({
    resolver: zodResolver(RequestOtpSchema),
    defaultValues: {
      intent: "LOGIN",
    },
  });

  const currentIntent = watch("intent");

  const mutation = useMutation({
    mutationFn: (data: RequestOtpPayload) => authService.requestOtp(data),
    onSuccess: (data, variables) => {
      navigate("/auth/otp", {
        state: {
          email: variables.email,
          intent: variables.intent,
          ttl: data.ttl_seconds,
          registration_data: variables.intent === "REGISTER" ? {
            first_name: variables.first_name,
            last_name: variables.last_name,
            phone_number: variables.phone_number
          } : undefined
        }
      });
    },
  });

  const onSubmit = (data: RequestOtpPayload) => {
    mutation.mutate(data);
  };

  const handleIntentChange = (intent: AuthIntent) => {
    setValue("intent", intent);
  };

  return (
    <div className="min-h-screen flex font-inter bg-surface">
      {/* Left Panel: Logistics Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden">
        <img
          src="/assets/images/auth-bg.png"
          alt="Logistics Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="relative z-10 flex flex-col justify-center px-16 text-on-primary">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl font-extrabold tracking-tighter font-manrope">SIATA Logistics</span>
          </div>
          <h2 className="text-5xl font-extrabold mb-6 leading-tight font-manrope">
            Gestión logística <br />
            inteligente y segura.
          </h2>
          <p className="text-xl text-blue-100 max-w-lg leading-relaxed opacity-90">
            Control total sobre tus envíos, almacenes y operaciones portuarias en una sola plataforma.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Right Panel: Auth Card */}
      <div className="w-full lg:w-1/2 flex flex-col bg-surface overflow-y-auto relative">
        {/* Back to Home Button */}
        <div className="absolute top-6 left-6 z-20">
          <Link to="/" className="flex items-center gap-2 text-outline hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
            <Icon name="arrow_back" size="sm" />
            Inicio
          </Link>
        </div>

        {/* Main Content (Centered) */}
        <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 mt-8 lg:mt-0">
          <div className="w-full max-w-[440px] flex flex-col items-center">

            {/* Intent Switcher */}
            <div className="bg-surface-container-high p-1 rounded-2xl flex gap-1 mb-8 w-64 shadow-inner border border-outline-variant/10">
              <button
                onClick={() => handleIntentChange("LOGIN")}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-xl transition-all",
                  currentIntent === "LOGIN"
                    ? "bg-surface-container-lowest text-primary shadow-lg scale-[1.02] border border-primary/10"
                    : "text-outline hover:text-on-surface"
                )}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => handleIntentChange("REGISTER")}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-xl transition-all",
                  currentIntent === "REGISTER"
                    ? "bg-surface-container-lowest text-primary shadow-lg scale-[1.02] border border-primary/10"
                    : "text-outline hover:text-on-surface"
                )}
              >
                Registrarse
              </button>
            </div>
 
            {/* Floating Card */}
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-3xl p-7 md:p-8 shadow-[0px_20px_50px_rgba(0,0,0,0.1)] w-full relative z-10 dark:shadow-black/40">
              <div className="text-center mb-6">
                {currentIntent === "LOGIN" && (
                  <div className="flex justify-center mb-4">
                    <img src="/logo.png" alt="SIATA Logo" className="h-16 w-auto object-contain" />
                  </div>
                )}
                <h1 className="text-2xl font-manrope font-extrabold text-primary mb-1 tracking-tight">
                  {currentIntent === "LOGIN" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
                </h1>
                <p className="text-on-surface-variant text-[13px] leading-relaxed max-w-[280px] mx-auto">
                  {currentIntent === "LOGIN"
                    ? "Ingresa tu correo para recibir tu código"
                    : "Ingresa tus datos para continuar"}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Registration Fields (Unified Style) */}
                {currentIntent === "REGISTER" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Nombre</label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl group-focus-within:text-primary transition-colors">person</span>
                        <input
                          {...register("first_name")}
                          placeholder="Tu nombre"
                          className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-outline/70"
                        />
                      </div>
                      {errors.first_name && <p className="text-error text-[10px] font-bold px-1">{errors.first_name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Apellido</label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl group-focus-within:text-primary transition-colors">badge</span>
                        <input
                          {...register("last_name")}
                          placeholder="Tu apellido"
                          className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-outline/70"
                        />
                      </div>
                      {errors.last_name && <p className="text-error text-[10px] font-bold px-1">{errors.last_name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Teléfono</label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl group-focus-within:text-primary transition-colors">call</span>
                        <input
                          {...register("phone_number")}
                          placeholder="+57 300..."
                          className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-outline/70"
                        />
                      </div>
                      {errors.phone_number && <p className="text-error text-[10px] font-bold px-1">{errors.phone_number.message}</p>}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-wider text-outline px-1">
                    Correo electrónico
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl group-focus-within:text-primary transition-colors">mail</span>
                    <input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder="ejemplo@siata.com"
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border rounded-xl text-on-surface placeholder:text-outline/70 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm",
                        errors.email ? "border-error" : "border-outline-variant/60"
                      )}
                    />
                  </div>
                  {errors.email && <p className="text-error text-[10px] font-bold px-1 mt-1">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 mt-2"
                >
                  {mutation.isPending ? (
                    <span className="animate-spin material-symbols-outlined">progress_activity</span>
                  ) : (
                    <>
                      <span>{currentIntent === "LOGIN" ? "Ingresar" : "Registrarme"}</span>
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Assistance Link */}
            <div className="mt-10 text-center">
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
                ¿No puedes acceder?{" "}
                <a href="#" className="text-primary font-black hover:underline decoration-2 underline-offset-4 transition-all ml-1">Soporte SIATA</a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 text-[10px] text-outline/50 font-bold tracking-[0.2em] uppercase flex flex-col items-center gap-3 mt-auto">
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
            <span className="text-outline/20">/</span>
            <a href="#" className="hover:text-primary transition-colors">Términos</a>
          </div>
          <p>© 2024 SIATA Logistics Infrastructure</p>
        </footer>
      </div>
    </div>
  );
}
