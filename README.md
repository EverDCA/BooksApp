

---

````markdown
# 📚 Node.js CRUD con MySQL y Tailwind CSS

Este es un proyecto CRUD de libros usando **Node.js**, **Express**, **MySQL**, **EJS** y **Tailwind CSS**. Permite agregar, editar, eliminar y listar libros con un diseño moderno y responsivo.

---

## 🚀 Tecnologías utilizadas

- Node.js + Express
- EJS (como motor de plantillas)
- MySQL (gestión de base de datos)
- Tailwind CSS (estilos)
- express-session y express-flash (para sesiones y mensajes)

---

## 📦 Requisitos previos

- Node.js y npm instalados
- MySQL en funcionamiento

---

## 🛠️ Instalación

1. **Clona este repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/nodejs-crud.git
   cd nodejs-crud
````

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura tu base de datos MySQL:**

   Crea una base de datos llamada `library` (o cambia el nombre en tu archivo de conexión) y ejecuta una tabla como esta:

   ```sql
   CREATE TABLE books (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     author VARCHAR(255) NOT NULL
   );
   ```

4. **Configura la conexión en `lib/db.js`:**

   ```js
   const mysql = require('mysql2');
   const connection = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '',
     database: 'library'
   });

   connection.connect();
   module.exports = connection;
   ```

---

## 🎨 Compilar Tailwind CSS

El proyecto usa Tailwind con entrada/salida en `./public/`.

Para iniciar el watcher de estilos:

```bash
npm run buildcss
```

Esto observará el archivo `public/input.css` y generará automáticamente `public/output.css`.

Asegúrate de tener este contenido en tu `input.css`:

```css
@import "tailwindcss";

```

---

## 🧾 Scripts

* `npm start` – Inicia el servidor en modo desarrollo.
* `npm run buildcss` – Compila Tailwind CSS en modo `--watch`.

---

## 🖥️ Ejecutar la aplicación

Primero, compila los estilos:

```bash
npm run buildcss
```

Luego, en otra terminal:

```bash
npm start
```

La app estará disponible en [http://localhost:3000](http://localhost:3000)

---

## ✨ Vista previa

* Página principal con mensaje de bienvenida y acceso a libros
* CRUD completo de libros (Agregar, Editar, Eliminar, Ver)
* Estilos modernos y responsivos con Tailwind CSS

---

## 📁 Estructura del proyecto

```
.
├── bin/
├── lib/
│   └── db.js
├── public/
│   ├── input.css
│   └── output.css
├── routes/
│   ├── index.js
│   ├── books.js
│   └── users.js
├── views/
│   ├── partials/
│   │   └── navbar.ejs
│   ├── index.ejs
│   ├── books/
│   │   ├── list.ejs
│   │   ├── add.ejs
│   │   └── edit.ejs
│   └── error.ejs
└── app.js
```

---


