'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Radio } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

import { authService, Role } from '@/services/auth.service';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setAuth } = useAuth()

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  function handleChange(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    if (form.password.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    try {
      setLoading(true);

      const response = await authService.register({
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
        role: Role.USER,
      });

      setAuth(
        response.data.accessToken,
        response.data.user,
      )

      toast.success('Conta criada com sucesso!');

      router.push('/')
    } catch (error: any) {
      console.error('Register error:', error);

      toast.error(
        error?.message ||
        'Não foi possível criar a conta.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0c0d0c] text-white">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT */}
        <div className="relative hidden overflow-hidden border-r border-white/8 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(216,255,62,.10),transparent_35%)]" />

          <div className="relative flex w-full flex-col justify-between p-10">
            <Logo />

            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#d8ff3e]">
                Your sound. Your space.
              </p>

              <h1 className="max-w-lg text-6xl font-semibold leading-[0.95] tracking-[-0.06em]">
                Encontre o seu
                <br />
                som.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-6 text-white/40">
                Crie seu perfil, publique suas músicas e faça parte
                de uma comunidade focada em novos sons.
              </p>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/20">
              BAD VIBES FOREVER © 2026
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-md">

            <div className="mb-10 lg:hidden">
              <Logo />
            </div>

            <div className="mb-8">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8ff3e]">
                Comece agora
              </p>

              <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                Criar conta
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Entre para descobrir e publicar novos sons.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <Field
                label="Nome"
                type="text"
                placeholder="Seu nome"
                value={form.name}
                onChange={(value) =>
                  handleChange('name', value)
                }
              />

              <Field
                label="Nome de usuário"
                type="text"
                placeholder="@seuusername"
                value={form.username}
                onChange={(value) =>
                  handleChange('username', value)
                }
              />

              <Field
                label="Email"
                type="email"
                placeholder="voce@email.com"
                value={form.email}
                onChange={(value) =>
                  handleChange('email', value)
                }
              />

              <PasswordField
                label="Senha"
                show={showPassword}
                setShow={setShowPassword}
                value={form.password}
                onChange={(value) =>
                  handleChange('password', value)
                }
              />

              <PasswordField
                label="Confirmar senha"
                show={showConfirmPassword}
                setShow={setShowConfirmPassword}
                value={form.confirmPassword}
                onChange={(value) =>
                  handleChange('confirmPassword', value)
                }
              />

              <label className="flex gap-3 pt-2 text-xs leading-5 text-white/40">
                <input
                  required
                  type="checkbox"
                  className="mt-1 accent-[#d8ff3e]"
                />

                <span>
                  Concordo com os termos de uso e a política de
                  privacidade do Bad Vibes Forever.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d8ff3e] text-sm font-bold text-[#101110] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? 'Criando conta...'
                  : 'Criar minha conta'}

                {!loading && (
                  <ArrowRight className="size-4" />
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-white/40">
              Já tem uma conta?{' '}

              <Link
                href="/login"
                className="font-medium text-[#d8ff3e] hover:underline"
              >
                Entrar
              </Link>
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      className="flex w-fit items-center gap-3"
    >
      <div className="flex size-9 items-center justify-center rounded-full bg-[#d8ff3e] text-[#101110]">
        <Radio className="size-4" />
      </div>

      <span className="font-mono text-[13px] font-bold leading-tight tracking-[-0.05em]">
        BAD VIBES
        <br />
        FOREVER
      </span>
    </Link>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-white/60">
        {label}
      </label>

      <input
        required
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition-colors placeholder:text-white/20 focus:border-[#d8ff3e]/60"
      />
    </div>
  );
}

function PasswordField({
  label,
  show,
  setShow,
  value,
  onChange,
}: {
  label: string;
  show: boolean;
  setShow: (value: boolean) => void;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-white/60">
        {label}
      </label>

      <div className="relative">
        <input
          required
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-12 text-sm outline-none transition-colors placeholder:text-white/20 focus:border-[#d8ff3e]/60"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
        >
          {show ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}