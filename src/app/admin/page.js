"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import "../../styles/globals.css"; // Asegúrate de tener este archivo

export default function AdminDash() {
  const router = useRouter();
  const [seccionActiva, setSeccionActiva] = useState("inicio");

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.rol !== "admin") {
        router.push("/");
      }
    } catch (err) {
      console.error("Token inválido", err);
      router.push("/");
    }
  }, [router]);

  const cerrarSesion = () => {
    Cookies.remove("token");
    window.location.href = "/"; // redirige al login
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Bienvenido</h2>
        <button onClick={() => setSeccionActiva("inicio")}>🏠 Inicio</button>
        <button onClick={() => setSeccionActiva("agregarLibro")}>📕Agregar Libro</button>
        <button onClick={() => setSeccionActiva("usuarios")}>👥 Usuarios</button>
        <button onClick={() => setSeccionActiva("estadisticas")}>📊 Estadísticas</button>
        <button className="cerrar-sesion" onClick={cerrarSesion}>🚪 Cerrar sesión</button>
      </aside>

      {/* Contenido */}
      <main className="admin-content">
        {seccionActiva === "inicio" && <div>Bienvenido al panel de administración</div>}
        {seccionActiva === "usuarios" && <div>👥 Gestión de usuarios</div>}
        {seccionActiva === "estadisticas" && <div>📊 Estadísticas</div>}
        {seccionActiva === "agregarLibro" && <div>📕 Agregar Libro (pendiente)</div>}
      </main>
    </div>
  );
}
