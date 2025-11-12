import { useState } from "react";

import "./styles.scss"


interface LoginFormProps{
 onCreate : (name: string) => void
}
export default function LoginForm({onCreate}: LoginFormProps) {

  const [name, setName] = useState<string>("");
  const [error,setError] = useState<string>("");


  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Por favor ingresa un nombre");
      return;
    }

    onCreate(name)

  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError("");
  }

  return (
    <div className="login-wrapper" role="region" aria-label="Login">
      <form className="login" onSubmit={handleSubmit} noValidate>
        
        <input
          id="playerName"
          className="login__input"
          type="text"
          value={name}
          onChange={handleChange}
          placeholder="Nombre"
          aria-required
        />

      {
        error && <div className="login__error" role="alert">{error}</div>
      }
        <div className="login__actions">
          <button type="submit" className="btn btn--primary">
            Crear Sala
          </button>
        </div>
      </form>
    </div>
  );
}
