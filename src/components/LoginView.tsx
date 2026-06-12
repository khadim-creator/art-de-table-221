import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Lock, ShieldCheck, MailPlus, Sparkles } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { loginWithGoogle, registerWithEmail, loginWithEmail, setView } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [errorMess, setErrorMess] = useState('');
  const [successMess, setSuccessMess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMess('');
    setSuccessMess('');

    if (!email || !password) {
      setErrorMess("Veuillez remplir l'ensemble des champs requis.");
      return;
    }

    try {
      setLoading(true);
      if (isRegister) {
        if (!name) {
          setErrorMess("Le nom complet est obligatoire pour l'inscription.");
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, name);
        setSuccessMess("Compte créé avec succès ! Bienvenue chez Art de Table.");
        setTimeout(() => setView('dashboard'), 2000);
      } else {
        await loginWithEmail(email, password);
        setSuccessMess("Connexion réussie ! Heureux de vous revoir.");
        setTimeout(() => setView('dashboard'), 2000);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('auth/invalid-credential')) {
        setErrorMess("Identifiants incorrects. Veuillez re-essayer.");
      } else if (err.message && err.message.includes('auth/weak-password')) {
        setErrorMess("Le mot de passe doit contenir au moins 6 caractères.");
      } else if (err.message && err.message.includes('auth/email-already-in-use')) {
        setErrorMess("Cette adresse email est déjà rattachée à un compte existant.");
      } else {
        setErrorMess(err.message || "Une erreur s'est produite lors de l'authentification.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setErrorMess('');
      setLoading(true);
      await loginWithGoogle();
      setView('dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F9] pt-32 pb-24 flex items-center justify-center text-left">
      <div className="max-w-md w-full mx-auto px-4">
        
        {/* Main Box frame */}
        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#D4AF37] uppercase font-semibold block">
              Maison Art de Table
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2D2D]">
              {isRegister ? "S'inscrire sur le store" : "Accès Compte Client"}
            </h2>
            <div className="h-0.5 w-12 bg-[#E8A5A5] mx-auto rounded" />
            <p className="text-[11px] text-gray-400 font-light max-w-xs mx-auto leading-relaxed">
              {isRegister 
                ? "Créez votre profil en quelques secondes pour suivre vos maquettes de boîtes et de flacons d'exception réels." 
                : "Connectez-vous pour finaliser votre commande d'atelier ou valider vos devis."
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Feedback messages */}
            {errorMess && (
              <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl font-light border border-red-100 leading-snug">
                ⚠️ {errorMess}
              </div>
            )}
            {successMess && (
              <div className="p-3.5 bg-green-50 text-green-700 text-xs rounded-xl font-bold border border-green-100 leading-snug">
                ✓ {successMess}
              </div>
            )}

            {/* Field if register */}
            {isRegister && (
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold block">
                  Nom Complet *
                </label>
                <div className="relative">
                  <input
                    id="login-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Alassane Sy"
                    className="w-full pl-10 pr-4 py-4 bg-gray-50 rounded-xl text-base border border-transparent focus:border-[#E8A5A5] focus:bg-white outline-none transition"
                  />
                  <User className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold block">
                Adresse Courriel *
              </label>
              <div className="relative">
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Ex: client@gmail.com"
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 rounded-xl text-base border border-transparent focus:border-[#E8A5A5] focus:bg-white outline-none transition"
                />
                <Mail className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1 text-left">
              <div className="flex justify-between items-center mb-0.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                  Mot de passe *
                </label>
                {!isRegister && (
                  <button
                    id="login-forgot-btn"
                    type="button"
                    onClick={() => alert("Simulé - Un message de réinitialisation a été transmis par email d'assistance.")}
                    className="text-[9px] font-mono text-gray-400 hover:text-[#E8A5A5] transition underline focus:outline-none"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="login-pass-input"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 rounded-xl text-base border border-transparent focus:border-[#E8A5A5] focus:bg-white outline-none transition"
                />
                <Lock className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Action manual submit button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D2D2D] hover:bg-black text-white text-sm uppercase tracking-widest font-semibold py-4 min-h-[48px] rounded-xl transition duration-300 shadow hover:shadow-black/10 cursor-pointer disabled:opacity-50"
            >
              {loading 
                ? "Enregistrement en cours..." 
                : (isRegister ? "Créer mon Compte" : "Se Connecter")
              }
            </button>

          </form>

          {/* Social Google alternative panel */}
          <div className="space-y-4 pt-2 border-t border-gray-50">
            <button
              id="login-google-btn"
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-650 text-sm uppercase tracking-widest font-semibold py-4 min-h-[48px] rounded-xl transition border border-gray-200 flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_Logo.svg"
                className="w-4 h-4"
                alt="Google G logo"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if logo fails
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span>Se connecter via Google SSO</span>
            </button>

            {/* Stepper switcher button */}
            <div className="text-center font-light text-xs text-gray-400">
              {isRegister ? (
                <p>
                  Vous appartenez déjà à la Maison ?{" "}
                  <button
                    id="login-switch-signin"
                    onClick={() => setIsRegister(false)}
                    className="text-[#E8A5A5] font-semibold hover:underline"
                  >
                    Connectez-vous ici
                  </button>
                </p>
              ) : (
                <p>
                  Nouveau chez Art de Table ?{" "}
                  <button
                    id="login-switch-signup"
                    onClick={() => setIsRegister(true)}
                    className="text-[#E8A5A5] font-semibold hover:underline"
                  >
                    Inscrivez-vous ici
                  </button>
                </p>
              )}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
};
