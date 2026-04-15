import { useState, useEffect } from "react";
import React from "react";
import Navbar from "../../Components/Navbar/Navbar.jsx";

export default function Inicio() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 text-white">
      
      <Navbar />

      {/* HERO */}
      <div className="pt-32 px-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT */}
        <div>
          {/* Badge */}
          <span className="text-orange-400 text-sm border border-orange-400 px-4 py-1 rounded-full">
            PRÁCTICAS BCP
          </span>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mt-6 leading-tight">
            Únete al <br />
            equipo <span className="text-orange-500">BCP</span>
          </h1>

          {/* Description */}
          <p className="text-gray-300 mt-6 max-w-lg">
            Impulsa tu carrera profesional y transforma tu futuro desde hoy. 
            Aprende de los mejores en el banco líder del Perú.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button className="bg-orange-500 px-6 py-3 rounded-xl hover:bg-orange-600 transition shadow-lg">
              Postula ahora →
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-10">
            <div className="bg-white/10 px-6 py-4 rounded-xl border border-white/10">
              <p className="text-2xl font-bold">500</p>
              <p className="text-sm text-gray-300">
                practicantes formados
              </p>
            </div>

            <div className="bg-white/10 px-6 py-4 rounded-xl border border-white/10">
              <p className="text-2xl font-bold">80</p>
              <p className="text-sm text-gray-300">
                % mejora en empleabilidad
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          {/* Card imagen */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <img
              src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
              alt="team"
              className="rounded-xl"
            />
          </div>

          {/* Badge flotante */}
          <div className="absolute bottom-4 left-4 bg-white text-blue-900 px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              ✓
            </span>
            <div>
              <p className="text-sm font-semibold">Líder bancario</p>
              <p className="text-xs">en el Perú</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}