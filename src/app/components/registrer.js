import { useState } from 'react';
import Cookies from 'js-cookie';

export default function RegisterForm({ setUser }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nomUsuario, setNomUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setContrasena] = useState('');
  const [confirmContrasena, setConfirmContrasena] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch('/api/usuarios/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido,
          nomUsuario,
          correo,
          password,
          rol: "user", // valor por defecto
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Login automático: guardar token y actualizar estado de usuario
        if (data.token) Cookies.set('token', data.token, { expires: 1 });
        setUser({ correo, nomUsuario, rol: data.rol || "user" });

        // Redirigir según rol
        if (data.rol === 'admin') {
          window.location.href = '/';
        } else {
          window.location.href = '/';
        }
      } else {
        setError(data.error || "Error al registrar");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };


  return (
    <form onSubmit={handleRegister} className="glass-card flex flex-col gap-3 p-4">
      <h2 className="text-center font-bold text-white">Registro</h2>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="p-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none"
      />
      <input
        type="text"
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        required
        className="p-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none"
      />
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={nomUsuario}
        onChange={(e) => setNomUsuario(e.target.value)}
        required
        className="p-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none"
      />
      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
        className="p-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setContrasena(e.target.value)}
        required
        className="p-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none"
      />
      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmContrasena}
        onChange={(e) => setConfirmContrasena(e.target.value)}
        required
        className="p-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none"
      />
      <button
        type="submit"
        className="bg-rose-500 hover:bg-rose-600 transition-colors p-2 rounded-xl text-white font-semibold"
      >
        Registrarse
      </button>
    </form>
  );
}
