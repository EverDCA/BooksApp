-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 04-06-2025 a las 21:44:16
-- Versión del servidor: 8.4.3
-- Versión de PHP: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_libros`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `authors`
--

CREATE TABLE `authors` (
  `id_author` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `state` tinyint DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `authors`
--

INSERT INTO `authors` (`id_author`, `name`, `state`) VALUES
(1, 'Gabriel García Márquez', 1),
(2, 'Isabel Allende', 1),
(3, 'Mario Vargas Llosa', 1),
(4, 'Jorge Luis Borges', 1),
(5, 'Julio Cortázar', 1),
(6, 'Carlos Fuentes', 1),
(7, 'Laura Esquivel', 1),
(8, 'Juan Rulfo', 1),
(9, 'Pablo Neruda', 1),
(10, 'Octavio Paz', 1),
(11, 'Miguel de Cervantes', 1),
(12, 'Federico García Lorca', 1),
(13, 'Rosario Castellanos', 1),
(14, 'Machado de Assis', 1),
(15, 'Clarice Lispector', 1),
(16, 'Rubén Darío', 1),
(17, 'Alfonsina Storni', 1),
(18, 'Sor Juana Inés de la Cruz', 1),
(19, 'Manuel Puig', 1),
(20, 'Ricardo Piglia', 1),
(21, 'Eduardo Galeano', 1),
(22, 'Roberto Bolaño', 1),
(23, 'Juan José Saer', 1),
(24, 'Homero Aridjis', 1),
(25, 'Elena Poniatowska', 1),
(26, 'Ana María Matute', 1),
(27, 'Carmen Laforet', 1),
(28, 'Antonio Muñoz Molina', 1),
(29, 'Javier Marías', 1),
(30, 'Almudena Grandes', 1),
(31, 'Enrique Vila-Matas', 1),
(32, 'Rosa Montero', 1),
(33, 'Luis Sepúlveda', 1),
(34, 'Sergio Ramírez', 1),
(35, 'Gioconda Belli', 1),
(36, 'Cristina Peri Rossi', 1),
(37, 'Eduardo Mendoza', 1),
(38, 'Juan Marsé', 1),
(39, 'Manuel Rivas', 1),
(40, 'Bernardo Atxaga', 1),
(41, 'Juan Benet', 1),
(42, 'Francisco Umbral', 1),
(43, 'Antonio Gala', 1),
(44, 'José Saramago', 1),
(45, 'Camilo José Cela', 1),
(46, 'Miguel Delibes', 1),
(47, 'María Dueñas', 1),
(48, 'Dolores Redondo', 1),
(49, 'Javier Cercas', 1),
(50, 'Carlos Ruiz Zafón', 1),
(51, 'Jenzon', 1),
(52, 'parry', 1),
(53, 'Ever', 1),
(54, 'Ever', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `books`
--

CREATE TABLE `books` (
  `id_book` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `isbn` varchar(20) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `year_published` int NOT NULL,
  `num_pages` int NOT NULL,
  `id_author` int DEFAULT NULL,
  `id_category` int DEFAULT NULL,
  `id_publisher` int DEFAULT NULL,
  `state` tinyint DEFAULT '1',
  `cover_url` varchar(255) COLLATE utf8mb4_spanish2_ci DEFAULT NULL COMMENT 'URL de la imagen de portada del libro',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `books`
--

INSERT INTO `books` (`id_book`, `name`, `isbn`, `year_published`, `num_pages`, `id_author`, `id_category`, `id_publisher`, `state`, `cover_url`, `createdAt`, `updatedAt`) VALUES
(1, 'qweeqw', 'qwe', 123123, 123123, 1, 2, 15, 0, '', '2025-06-04 19:14:15', '2025-06-04 21:14:42'),
(2, 'qweawd', '12321', 123, 123123, 1, 1, 14, 0, '', '2025-06-04 21:10:00', '2025-06-04 21:14:39'),
(3, '123231', '12321', 123213, 123123, 2, 1, 16, 0, 'https://images.cdn2.buscalibre.com/fit-in/360x360/1a/d0/1ad00b45cfb9ee36f629b922d55ced81.jpg', '2025-06-04 21:14:32', '2025-06-04 21:14:38'),
(4, 'El Principito', '3211321', 2000, 100, 4, 4, 3, 1, 'https://images.cdn2.buscalibre.com/fit-in/360x360/1a/d0/1ad00b45cfb9ee36f629b922d55ced81.jpg', '2025-06-04 21:35:35', '2025-06-04 21:35:35'),
(5, 'El Viejo Y El Mar', '789564321', 1998, 84, 5, 9, 2, 1, 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1408408108i/3284191.jpg', '2025-06-04 21:36:24', '2025-06-04 21:36:24'),
(6, 'La Odisea', '21321', 1996, 185, 17, 6, 6, 1, 'https://i.pinimg.com/736x/6a/01/b4/6a01b45fca3e739f84d485463dbd27e3.jpg', '2025-06-04 21:37:04', '2025-06-04 21:37:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id_category` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `state` tinyint DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id_category`, `name`, `state`) VALUES
(1, 'Novela', 1),
(2, 'Poesía', 1),
(3, 'Ensayo', 1),
(4, 'Cuento', 1),
(5, 'Teatro', 1),
(6, 'Historia', 1),
(7, 'Biografía', 1),
(8, 'Ciencia Ficción', 1),
(9, 'Fantasía', 1),
(10, 'Misterio', 1),
(11, 'Romance', 1),
(12, 'Aventura', 1),
(13, 'Terror', 1),
(14, 'Infantil', 1),
(15, 'Juvenil', 1),
(16, 'Autoayuda', 1),
(17, 'Filosofía', 1),
(18, 'Política', 1),
(19, 'Viajes', 1),
(20, 'Humor', 1),
(21, 'Crónica', 1),
(22, 'Memorias', 1),
(23, 'Educativo', 1),
(24, 'Divulgación', 1),
(25, 'Religión', 1),
(26, 'Arte', 1),
(27, 'Cocina', 1),
(28, 'Deportes', 1),
(29, 'Salud', 1),
(30, 'Tecnología', 1),
(31, 'Negocios', 1),
(32, 'Psicología', 1),
(33, 'Sociología', 1),
(34, 'Ecología', 1),
(35, 'Derecho', 1),
(36, 'Economía', 1),
(37, 'Policiaca', 1),
(38, 'Erótica', 1),
(39, 'Mitología', 1),
(40, 'Cómic', 1),
(41, 'Manga', 1),
(42, 'Guía', 1),
(43, 'Diccionario', 1),
(44, 'Manual', 1),
(45, 'Antología', 1),
(46, 'Epistolar', 1),
(47, 'Satírico', 1),
(48, 'Drama', 1),
(49, 'Realismo Mágico', 1),
(50, 'Distopía', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `loans`
--

CREATE TABLE `loans` (
  `id_loan` int NOT NULL,
  `id_user` int NOT NULL,
  `id_book` int NOT NULL,
  `loan_date` datetime NOT NULL,
  `return_date` datetime DEFAULT NULL,
  `state` tinyint DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `loans`
--

INSERT INTO `loans` (`id_loan`, `id_user`, `id_book`, `loan_date`, `return_date`, `state`) VALUES
(1, 1, 1, '2025-06-04 19:14:41', '2025-06-04 19:14:46', 0),
(2, 1, 1, '2025-06-04 19:15:17', '2025-06-04 19:18:41', 0),
(3, 1, 1, '2025-06-04 19:20:34', '2025-06-04 19:21:11', 0),
(4, 1, 1, '2025-06-04 19:22:18', '2025-06-04 19:38:26', 0),
(5, 1, 1, '2025-06-04 19:41:36', '2025-06-04 19:53:08', 0),
(6, 1, 1, '2025-06-04 19:53:14', '2025-06-04 20:41:59', 0),
(7, 3, 1, '2025-06-04 20:13:40', '2025-06-04 20:44:16', 0),
(8, 1, 1, '2025-06-04 20:42:11', '2025-06-04 20:42:13', 0),
(9, 1, 1, '2025-06-04 20:42:28', '2025-06-04 20:42:37', 0),
(10, 1, 1, '2025-06-04 20:42:48', '2025-06-04 20:42:51', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publishers`
--

CREATE TABLE `publishers` (
  `id_publisher` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `state` tinyint DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `publishers`
--

INSERT INTO `publishers` (`id_publisher`, `name`, `state`) VALUES
(1, 'Alfaguara', 1),
(2, 'Planeta', 1),
(3, 'Anagrama', 1),
(4, 'Seix Barral', 1),
(5, 'Tusquets', 1),
(6, 'Siruela', 1),
(7, 'Destino', 1),
(8, 'Espasa', 1),
(9, 'Debolsillo', 1),
(10, 'Salamandra', 1),
(11, 'Lumen', 1),
(12, 'Acantilado', 1),
(13, 'Alianza', 1),
(14, 'Edhasa', 1),
(15, 'RBA', 1),
(16, 'Ediciones B', 1),
(17, 'Plaza & Janés', 1),
(18, 'Grijalbo', 1),
(19, 'Maeva', 1),
(20, 'Minotauro', 1),
(21, 'Nordica', 1),
(22, 'Impedimenta', 1),
(23, 'Libros del Asteroide', 1),
(24, 'Blackie Books', 1),
(25, 'Errata Naturae', 1),
(26, 'Páginas de Espuma', 1),
(27, 'Galaxia Gutenberg', 1),
(28, 'Cátedra', 1),
(29, 'Crítica', 1),
(30, 'Paidós', 1),
(31, 'Ariel', 1),
(32, 'Turner', 1),
(33, 'Sexto Piso', 1),
(34, 'Reservoir Books', 1),
(35, 'Duomo', 1),
(36, 'La Esfera de los Libros', 1),
(37, 'Ediciones SM', 1),
(38, 'Edebé', 1),
(39, 'Vicens Vives', 1),
(40, 'Santillana', 1),
(41, 'Ediciones Akal', 1),
(42, 'Ediciones Sirio', 1),
(43, 'Kalandraka', 1),
(44, 'Ediciones Nobel', 1),
(45, 'Ediciones Martínez Roca', 1),
(46, 'Ediciones Cátedra', 1),
(47, 'Ediciones Rialp', 1),
(48, 'Ediciones Susaeta', 1),
(49, 'Ediciones Omega', 1),
(50, 'Ediciones Urano', 1),
(51, 'YoMero', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id_user` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `state` tinyint DEFAULT '1',
  `role` enum('usuario','bibliotecario','admin') COLLATE utf8mb4_spanish2_ci NOT NULL DEFAULT 'usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id_user`, `name`, `email`, `password`, `state`, `role`) VALUES
(1, 'Ever', 'Evdacar18@gmail.com', '$2b$10$PT92mdPeYZEXY2MGKx6fH./ZV0Ui8ssdRUeo8V0PEsa8ppUirwo0S', 1, 'admin'),
(3, 'Samuel', 'Samuel12@gmail.com', '$2b$10$b/5fWcgBAOlvKJWTFPKVs.Vnsoik4ljQ1LVYpuD2u34dai.FmYgTm', 1, 'usuario'),
(4, 'Daniel', 'Dan12@gmail.com', '$2b$10$5PaJCxlALgeu.L63IoE5tOeORRehtdnGrGHdzi9OEXVeOzH5dKL7G', 1, 'admin');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `authors`
--
ALTER TABLE `authors`
  ADD PRIMARY KEY (`id_author`);

--
-- Indices de la tabla `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id_book`),
  ADD KEY `id_author` (`id_author`),
  ADD KEY `id_category` (`id_category`),
  ADD KEY `id_publisher` (`id_publisher`);

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id_category`);

--
-- Indices de la tabla `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`id_loan`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_book` (`id_book`);

--
-- Indices de la tabla `publishers`
--
ALTER TABLE `publishers`
  ADD PRIMARY KEY (`id_publisher`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `authors`
--
ALTER TABLE `authors`
  MODIFY `id_author` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT de la tabla `books`
--
ALTER TABLE `books`
  MODIFY `id_book` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id_category` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `loans`
--
ALTER TABLE `loans`
  MODIFY `id_loan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `publishers`
--
ALTER TABLE `publishers`
  MODIFY `id_publisher` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`id_author`) REFERENCES `authors` (`id_author`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `books_ibfk_2` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id_category`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `books_ibfk_3` FOREIGN KEY (`id_publisher`) REFERENCES `publishers` (`id_publisher`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `loans_ibfk_2` FOREIGN KEY (`id_book`) REFERENCES `books` (`id_book`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
