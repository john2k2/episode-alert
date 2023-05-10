"use client";
import React, { useState, useEffect } from "react";

const Main = () => {
  const [capitulos, setCapitulos] = useState([]);

  const gruposAnime = capitulos.reduce((grupos, item) => {
    if (!grupos[item.nombre]) {
      grupos[item.nombre] = [];
    }
    grupos[item.nombre].push(item);
    return grupos;
  }, {});

  const marcarComoLeido = (capitulo) => {
    const index = capitulos.findIndex((c) => c.id === capitulo.id);
    if (index !== -1) {
      const updatedCapitulos = [...capitulos];
      updatedCapitulos[index] = { ...capitulos[index], leido: true };
      setCapitulos(updatedCapitulos);
      localStorage.setItem("capitulosLeidos", JSON.stringify(updatedCapitulos));
    }
  };

  useEffect(() => {
    // Verificar y cargar el estado de leído desde el localStorage
    const capitulosLeidos = JSON.parse(localStorage.getItem("capitulosLeidos"));
    if (capitulosLeidos) {
      setCapitulos(capitulosLeidos);
    }
  }, []);

  useEffect(() => {
    // Realizar la solicitud HTTP al servidor para obtener los datos
    fetch("http://localhost:3001/")
      .then((response) => response.json())
      .then((data) => setCapitulos(data))
      .catch((error) =>
        console.error("Error al obtener los datos del servidor:", error)
      );
  }, []);

  return (
    <>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center gap-4">
        {Object.keys(gruposAnime).map((nombreAnime) => (
          <div className="mt-8 " key={nombreAnime}>
            <img
              src={gruposAnime[nombreAnime][0].imagen_url}
              alt={nombreAnime}
              className="w-48 h-auto hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
            />
            <h2 className="text-xl font-bold mt-4 w-52 text-left overflow-hidden whitespace-nowrap overflow-ellipsis hover:whitespace-normal hover:overflow-visible">
              {nombreAnime}
            </h2>
            <div className="w-52 mb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-hover:shadow-lg scrollbar-track-hover:shadow-lg transition duration-300 ease-in-out">
              <ul>
                {gruposAnime[nombreAnime].map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className={`text-sm text left font-medium transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 ${
                        item.leido ? "text-red-500" : "text-green-500"
                      }`}
                      onClick={() => marcarComoLeido(item)}
                    >
                      {item.nombre_capitulo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Main;
