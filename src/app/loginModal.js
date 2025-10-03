"use client";

import { useState, useEffect } from "react";
import RegisterForm from "./components/registrer";
import Cookies from "js-cookie";

export default function LoginModal({ isOpen, onClose, setUser }) {
  // Hooks declarados al inicio
  const [mounted, setMounted] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Solo efectos
  useEffect(() => {
    if (isOpen) setMounted(true);
    else setMounted(false);
  }, [isOpen]);

  if (!isOpen) return null; // render condicional OK, después de hooks

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        Cookies.set("token", data.token, { expires: 1 });
        setUser({ email: data.email, nomUsuario: data.nomUsuario });
        onClose();
        window.location.reload()
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-card ${mounted ? "show" : ""}`}>
        <button className="close-btn" onClick={onClose}>✕</button>

        {!showRegister ? (
          <div className={`form-content ${showRegister ? "hide" : ""}`}>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
              <label>Correo</label>
              <input type="text" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
              <label>Contraseña</label>
              <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit">Acceder</button>
            </form>
            <p>
              ¿No tienes una cuenta?{" "}
              <span style={{ cursor: "pointer", fontWeight: "bold", color: "#82545d" }} onClick={() => setShowRegister(true)}>Regístrate</span>
            </p>
          </div>
        ) : (
          <div className={`form-content ${!showRegister ? "hide" : ""}`}>
            <h2>Registro</h2>
            <RegisterForm setUser={setUser} />
            <p>
              ¿Ya tienes cuenta?{" "}
              <span style={{ cursor: "pointer", fontWeight: "bold", color: "#82545d" }} onClick={() => setShowRegister(false)}>Inicia sesión</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
