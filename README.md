# 23 Barbería

Carta digital y asesor de cortes para 23 Barbería en Trujillo, Perú. La aplicación usa React, Vite, Tailwind CSS, Framer Motion y MediaPipe Face Landmarker para el análisis facial en el navegador.

## Desarrollo

```bash
npm install
npm run dev
```

Para generar la versión de producción, ejecuta `npm run build`. Vercel puede detectar Vite automáticamente; el directorio de salida es `dist`.

La cámara requiere HTTPS o localhost y autorización del usuario. El modelo de MediaPipe y sus archivos WASM se descargan al usar el asesor, por lo que se necesita conexión a internet. El análisis y la simetría son orientativos. Las reservas se envían por WhatsApp; no se almacenan en un servidor.
