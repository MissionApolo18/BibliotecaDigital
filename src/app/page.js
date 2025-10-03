"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import LoginModal from "./loginModal";
import "../styles/globals.css";
import AdminDash from "./admin/page";

export default function Biblioteca() {
  const [libros, setLibros] = useState([]);
  const [articulo, setarticulo] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [usuario, setUser] = useState(null);

  useEffect(() => {
    // Checar si hay token para usuario/admin
    const token = Cookies.get("token");
    if (token) {
      try {
        const payload = token.split(".")[1];
        const parsed = JSON.parse(atob(payload));
        setUser(parsed);
      } catch (err) {
        console.error("Error leyendo token", err);
        setUser(null);
      }
    }

    const fetchLibros = async () => {
      try {
        const res = await fetch("/api/libros"); // tu API route de libros
        if (!res.ok) throw new Error("Error cargando libros");
        const data = await res.json();
        setLibros(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLibros();
  },
    []);



  // Si es admin, renderiza dashboard directamente
  if (usuario && usuario.rol === "admin") {
    return <AdminDash usuario={usuario} setUser={setUser} />;
  }


  return (
    <main style={{ padding: "2rem" }}>
      <header>
        <h1>📚 Biblioteca Digital</h1>
        <nav>
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Categorías</a></li>
            <li>
              {usuario ? (
                <>
                  <span>Bienvenido, {usuario.nomUsuario}</span>
                  <button
                    className="hover:bg-red-700 bg-red-600 p-2 rounded mt-4"
                    onClick={() => {
                      Cookies.remove("token");
                      setUser(null);
                      window.location.href = "/";
                    }}
                  >
                    🚪 Cerrar Sesión
                  </button>
                </>
              ) : (
                <button onClick={() => setIsLoginOpen(true)}>Mi Cuenta</button>
              )}
            </li>
          </ul>
        </nav>
      </header>

      <div className="grid">
        {libros.map(libro => (
          <div key={libro.idLibro} className="card">
            <h2>{libro.titulo}</h2>
            <p>👤 {libro.autorId}</p>
            <p>📅 {libro.anno}</p>
            <p>🌐 {libro.idioma}</p>
            <p>📂 {libro.categoriaId}</p>
            <p>👀 {libro.vistas} vistas</p>
            <a href={libro.url} target="_blank" rel="noopener noreferrer">📖 Leer PDF</a>
          </div>
        ))}
      </div>

      <div className="grid">
        {articulo.map(articulo => (
          <div key={articulo.id} className="card">
            <h2>{articulo.titulo}</h2>
            <p>👤 {articulo.autor}</p>
            <p>📅 {articulo.anno}</p>
            <p>🌐 {articulo.idioma}</p>
            <p>📂 {articulo.categoria}</p>
            <p>👀 {articulo.vistas} vistas</p>
            <a href={articulo.url} target="_blank" rel="noopener noreferrer">📖 Leer PDF</a>
          </div>
        ))}
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} setUser={setUser} />
    </main>
  );
}
