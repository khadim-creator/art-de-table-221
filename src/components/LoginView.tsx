import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';

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
      } else {
        await loginWithEmail(email, password);
        setSuccessMess("Connexion réussie ! Heureux de vous revoir.");
      }
      setTimeout(() => setView('dashboard'), 1400);
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
      setErrorMess("Impossible de finaliser la connexion Google pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-left">
      <div className="section-container section-spacer">
        <div className="mx-auto w-full max-w-2xl">
          <section className="rounded-[2rem] border border-[#A67C52]/14 bg-white p-6 shadow-[0_18px_55px_rgba(140,104,69,0.10)] sm:p-8 md:p-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#A67C52]">
                  Accès personnel
                </p>
                <h2 className="font-serif text-2xl font-bold text-[#2D2D2D] sm:text-3xl">
                  {isRegister ? "Créer mon compte" : "Se connecter"}
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-stone-500">
                  {isRegister
                    ? "Créez un espace client simple pour centraliser vos commandes."
                    : "Entrez votre adresse mail et votre mot de passe pour accéder à votre compte."}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-[#FFF9F4] p-1">
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className={`flex-1 rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                    !isRegister ? 'bg-white text-[#2A1B13] shadow-sm' : 'text-[#8C6845]'
                  }`}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className={`flex-1 rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                    isRegister ? 'bg-white text-[#2A1B13] shadow-sm' : 'text-[#8C6845]'
                  }`}
                >
                  Inscription
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMess && (
                  <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-xs leading-relaxed text-red-700">
                    {errorMess}
                  </div>
                )}
                {successMess && (
                  <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-xs leading-relaxed text-green-700">
                    {successMess}
                  </div>
                )}

                {isRegister && (
                  <div className="space-y-2.5">
                    <label className="form-label">Nom complet *</label>
                    <div className="relative">
                      <input
                        id="login-name-input"
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ex: Alassane Sy"
                        className="form-input"
                        style={{ paddingLeft: '3.5rem' }}
                      />
                      <User className="absolute left-4 top-1/2 icon-sm -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                )}

                <div className="space-y-2.5">
                  <label className="form-label">Adresse mail *</label>
                  <div className="relative">
                    <input
                      id="login-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Ex: client@gmail.com"
                      className="form-input"
                      style={{ paddingLeft: '3.5rem' }}
                    />
                    <Mail className="absolute left-4 top-1/2 icon-sm -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <label className="form-label">Mot de passe *</label>
                    {!isRegister && (
                      <button
                        id="login-forgot-btn"
                        type="button"
                        onClick={() => alert("Simulé - Un message de réinitialisation a été transmis par email d'assistance.")}
                        className="text-[10px] font-mono uppercase tracking-[0.16em] text-stone-400 transition hover:text-[#8C6845]"
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
                      className="form-input"
                      style={{ paddingLeft: '3.5rem' }}
                    />
                    <Lock className="absolute left-4 top-1/2 icon-sm -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex h-12 w-full items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                  <span>{loading ? 'Traitement en cours...' : isRegister ? 'Créer mon compte' : 'Se connecter'}</span>
                  {!loading && <ArrowRight className="icon-sm" />}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
