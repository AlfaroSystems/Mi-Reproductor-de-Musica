# 🎵 Mi-Reproductor-de-Musica

Un reproductor de música elegante y minimalista construido con **Electron**, diseñado para ofrecer una experiencia de audio fluida y moderna en el escritorio.

![Versión](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Licencia](https://img.shields.io/badge/license-ISC-green.svg)
![Electron](https://img.shields.io/badge/built%20with-Electron-47848F.svg)

## ✨ Características

- 📂 **Carga de Música:** Importa fácilmente tus archivos MP3 locales.
- 📜 **Gestión de Playlist:** Visualiza tu lista de reproducción y elimina pistas que no desees escuchar.
- 🎮 **Controles Personalizados:** Reproducción, pausa, siguiente, anterior y control de volumen.
- 🔁 **Modos de Repetición:** Elige entre no repetir, repetir una pista o repetir toda la lista.
- 📊 **Barra de Progreso Interactiva:** Navega a cualquier punto de la canción con el buscador visual.
- 🎨 **Interfaz Premium:** Diseño moderno con tipografía *Outfit* y transiciones suaves.
- 🔄 **Actualizaciones Automáticas:** Integración con `electron-updater` para mantener la aplicación al día.

## 🛠️ Tecnologías Usadas

- **Core:** JavaScript, HTML5, CSS3.
- **Framework:** [Electron](https://www.electronjs.org/) (v38.2.0).
- **Fuentes:** Google Fonts (Outfit).
- **Distribución:** Electron Builder & Electron Updater.

## 🚀 Instalación y Desarrollo

Sigue estos pasos para ejecutar el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/AlfaroSystems/Mi-Reproductor-de-Musica.git
   ```
2. **Instalar dependencias:**
   ```bash
   npm install
   ```
3. **Ejecutar la aplicación:**
   ```bash
   npm start
   ```

## 📦 Construcción (Build)

Para generar el instalador de la aplicación:
```bash
npm run build
```

## 📂 Estructura del Proyecto

- `main.js`: Proceso principal de Electron (manejo de ventanas e IPC).
- `preload.js`: Puente seguro entre el proceso principal y el de renderizado.
- `renderer.js`: Lógica de la interfaz de usuario y del reproductor de audio.
- `index.html`: Estructura base de la aplicación.
- `style.css`: Estilos visuales y diseño responsivo.

---
Desarrollado con ❤️ por [Alfaro Systems](https://github.com/AlfaroSystems).