<<<<<<< HEAD
/*

=======
>>>>>>> 6c36bf017c7d13e743c661ff20d9061ec6207793
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form.info");

    form.addEventListener("submit", function (event) {
        const nome = document.getElementById("nome").value;
        const username = document.getElementById("username").value;
        const senha = document.getElementById("passwd").value;
        const confirmarSenha = document.getElementById("passwdCkeck").value;

<<<<<<< HEAD
        if (nome === "" || username === "" || senha === "" || confirmarSenha === "") {
=======
        if (nome === ""  username === ""  senha === "" || confirmarSenha === "") {
>>>>>>> 6c36bf017c7d13e743c661ff20d9061ec6207793
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


function mostrarAlerta(mensagem) {
    Swal.fire({
        title: "Campo invalido",
        text: mensagem,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
    });
}

*/

document.addEventListener('DOMContentLoaded', () => {
    if (errorMessage) {
        Swal.fire({
            icon: 'error',
            title: 'Erro no cadastro',
            text: errorMessage,
        });
    }
});
