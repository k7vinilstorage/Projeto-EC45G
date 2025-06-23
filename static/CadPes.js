

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form.info");

    form.addEventListener("submit", function (event) {
        const nome = document.getElementById("nome").value;
        const username = document.getElementById("username").value;
        const senha = document.getElementById("passwd").value;
        const confirmarSenha = document.getElementById("passwdCkeck").value;

        if (nome === "" || username === "" || senha === "" || confirmarSenha === "") {
            event.preventDefault();
            mostrarAlerta("Preencha todos os campos!");
            return;
        }

        if (senha !== confirmarSenha) {
            event.preventDefault();
            mostrarAlerta("As senhas não coincidem!");
            return;
        }

    });
});


function mostrarAlerta(mensagem, title = "Campo invalido", icon = "error") {
    Swal.fire({
        title: title,
        text: mensagem,
        icon: icon,
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
    });
}



document.addEventListener('DOMContentLoaded', () => {
    if (errorMessage) {
        Swal.fire({
            icon: 'error',
            title: 'Erro no cadastro',
            text: errorMessage,
        });
    }
});
