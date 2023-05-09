import React, { useState, useEffect } from "react";
import { VscLoading } from "react-icons/vsc";

const Navbar = () => {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    // Verificar y cargar el estado de mensaje desde el localStorage
    const mensajeGuardado = localStorage.getItem("mensajeActualizacion");
    if (mensajeGuardado) {
      setMensaje(mensajeGuardado);
    }
  }, []);

  const actualizarCapitulos = () => {
    setCargando(true);
    fetch("http://localhost:3001/actualizar-capitulos")
      .then((response) => response.json())
      .then((data) => {
        setMensaje(data.mensaje);
        setCargando(false);
      })
      .catch((error) => {
        console.error(error);
        setCargando(false);
      });
  };

  useEffect(() => {
    // Almacenar el estado de mensaje en el localStorage
    localStorage.setItem("mensajeActualizacion", mensaje);
  }, [mensaje]);

  return (
    <div>
      <div className="flex justify-center items-center bg-gray-800 text-white text-2xl font-bold py-2 ">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={actualizarCapitulos}
        >
          Actualizar Capítulos
        </button>
        <div className="ml-4">
          {cargando ? (
            <VscLoading className="animate-spin" />
          ) : (
            <p
              className={`${
                mensaje === "Capítulos actualizados"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {mensaje}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
