// Oculta automáticamente los mensajes flash después de 5 segundos
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    document.querySelectorAll('.alert-success, .alert-error').forEach(function (el) {
      el.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(function () {
        el.style.display = 'none';
      }, 300);
    });
  }, 3000);
});
