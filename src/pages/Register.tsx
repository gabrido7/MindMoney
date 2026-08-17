import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../services/api";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Criar conta">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <Input id="name" label="Nome" required value={name} onChange={(e) => setName(e.target.value)} />

        <Input
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          id="password"
          label="Senha"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
        Já tem conta?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Entrar
        </Link>
      </p>
    </Card>
  );
}
