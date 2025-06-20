document.addEventListener('DOMContentLoaded', () => {
    if (errorMessage) {
        Swal.fire({
            icon: 'error',
            title: 'Erro no login',
            text: errorMessage,
        });
    }
});
