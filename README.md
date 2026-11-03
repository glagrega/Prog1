# Al azar · Banco de preguntas

## Descargar y usar en Mac

En GitHub, pulsa **Code → Download ZIP** y descomprime el archivo. Abre
**vista-previa.html** en tu navegador o ejecuta **Abrir.command**.
No necesitas instalar Node.js, npm ni Excel para usar esta versión.
Conserva el Excel original como respaldo del banco de preguntas.

También hay un paquete reducido listo para usar en `descargas/Al-azar-mac.zip`.

Para servir el proyecto localmente, si tienes Python 3, abre una Terminal en
la carpeta descomprimida y ejecuta:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8080/vista-previa.html`. Detén el servidor con Control+C.
Usa la misma dirección y puerto para conservar el banco guardado en ese navegador.
El guardado de archivos abiertos directamente puede variar según el navegador.


Aplicación web minimalista en español para cargar preguntas desde Excel y elegir una al azar. HTML, CSS y JavaScript con Vite; lectura de Excel con `read-excel-file`.

## Uso

1. Selecciona o arrastra un archivo **.xlsx**, de hasta 10 MB.
2. Usa la primera hoja, con una columna llamada **Pregunta** (también se admite Preguntas). Sin encabezado, se utiliza la primera columna. Escribe una pregunta de texto por fila.
3. Pulsa **Elegir una pregunta**. Puedes seguir sorteando: cada selección es independiente y puede repetirse.

Se omiten filas vacías y preguntas duplicadas. Cada carga válida reemplaza el banco anterior; si un archivo falla, se conserva el banco actual. Los archivos .xls antiguos deben guardarse como .xlsx desde Excel o LibreOffice.

El archivo se procesa en el navegador, sin enviarse a un servidor. El banco se guarda en el almacenamiento local del navegador y se restaura al recargar. No se comparte entre dispositivos ni usuarios; borrar los datos del navegador elimina el banco. Si no hay almacenamiento disponible, funciona durante la sesión. No incluye cuentas, backend ni base de datos.

## Desarrollo

Requisitos: Node.js 22.12+ (validado con Node.js 24) y npm.

```sh
cd /workspace/Prog1
npm ci
npm run dev
```

## Verificación y compilación

```sh
npm test
npm run build
npm run preview
```

`dist/` contiene la aplicación estática para desplegar. El servidor de desarrollo usa el puerto 5173 por defecto; la vista previa de producción, 4173.

## Archivos

- `src/main.js`: interfaz, importación y persistencia local.
- `src/questions.js`: extracción de preguntas y sorteo.
- `src/style.css`: diseño adaptable.
- `test/questions.test.js`: pruebas de importación y selección.

## Vista previa sin servidor

`npm run build` también genera `vista-previa.html` en la raíz. Este archivo incluye los estilos y JavaScript, y se puede abrir directamente sin Vite ni conexión a Internet. En el visor de archivos, selecciona **vista-previa.html** en lugar del `index.html` fuente. Se regenera con cada compilación; no lo edites manualmente. El visor debe permitir JavaScript y la selección de archivos para usar la carga de Excel.
