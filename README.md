# Para clonar el repositorio
- Crear en tu escritorio una nueva carpeta.
- Abrir tu carpeta en Visual Code
- Iniciar sesión con tu cuenta de GitHub  (Icono de usuario en la parte inferior izquierda)
- Abrir la terminal y seleccionar Git Bash
- Ejecutar o escribir `git clone link`

## Para abrir directamente el archivo clonado
- Ir a Archivo
- Click `Nueva carpeta`
- Buscar tu carpeta del escritorio, abrirla y encuentras el repositorio clonado y lo abres directamente. 

## Instalar dependencias
- Una vez dentro del repositorio clonado
- Escribir en la terminal "npm install o npm i"

## Levantar el repositorio (Verlo en Google)
- Escribir en la terminal `npm run dev`

## Credendiales de firebase
- Hacer una copia del .env.local

## Instalar tailwind
- Escribir en la terminal `npm install -D tailwindcss @tailwindcss/vite`

# Configurar tailwind

## Paso 1
- En `vite.config` 
- Copiar: 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwind()],
})

## Paso 2
- En index.css
- Dejar solo: @import "tailwindcss";



