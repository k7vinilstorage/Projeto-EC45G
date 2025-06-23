// script.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('doacaoForm');
    const tableBody = document.querySelector('#historicoTable tbody');

    loadDoacoes();

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const dados = {
            doador: document.getElementById('doador').value,
            marca: document.getElementById('marca').value,
            tipo: document.getElementById('tipo').value,
            hipoalergenico: document.getElementById('Hipoalergenico').value == 'sim',
            fluxo: document.getElementById('fluxo').value,
            indicacao: document.getElementById('indicacao').value,
            quantidade: parseInt(document.getElementById('quantidade').value),
            id: Date.now(),
            date: dataFormatadaAtual()
        };

        fetch('/registrar-doacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                Swal.fire('Sucesso!', 'Doação registrada com sucesso.', 'success').then(() => {
                    location.reload();
                });
                
                
            } else {
                Swal.fire('Erro!', data.error || 'Erro ao registrar.', 'error').then(() => {
                    location.reload();
                });
            }
        })
        .catch(err => {
            Swal.fire('Erro!', 'Falha na comunicação com o servidor.', 'error');
            console.error(err);
        });

        
    });

    function dataFormatadaAtual() {
        const agora = new Date();

        const dia = String(agora.getDate()).padStart(2, '0');
        const mes = String(agora.getMonth() + 1).padStart(2, '0'); // Janeiro = 0
        const ano = agora.getFullYear();

        const hora = String(agora.getHours()).padStart(2, '0');
        const minuto = String(agora.getMinutes()).padStart(2, '0');

        return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    }
    
    function loadDoacoes() {
        const doacoes = JSON.parse(localStorage.getItem('doacoes')) || [];
        doacoes.forEach(doacao => addDoacaoToTable(doacao));
        calcularTotal();
    }
    
    function addDoacaoToTable(doacao) {
        const row = document.createElement('tr');
        row.dataset.id = doacao.id;
        
        row.innerHTML = `
            <td>${doacao.doador}</td>
            <td>${doacao.marca}</td>
            <td>${doacao.tipo}</td>
            <td>${doacao.Hipoalergenico}</td>
            <td>${doacao.fluxo}</td>
            <td>${doacao.indicacao}</td>
            <td>${doacao.quantidade}</td>
            <td>${doacao.date}</td>
            <td>
                <button class="btn-action btn-delete" onclick="deleteDoacao(${doacao.id})">Excluir</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    }
});


// Funções globais para os botões de ação
function deleteDoacao(id) {
    Swal.fire({
        title: 'Tem certeza?',
        text: 'Essa ação não pode ser desfeita!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
        fetch('/excluir', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => {
            if (response.ok) {
            Swal.fire('Excluído!', 'A doação foi removida.', 'success').then(() => {
                // Remove a linha da tabela;
                location.reload();
            });
            
            } else {
                Swal.fire('Erro', 'Não foi possível excluir.', 'error').then(() => {
                    // Remove a linha da tabela;
                    location.reload();
                });
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            Swal.fire('Erro', 'Ocorreu um erro ao tentar excluir.', 'error');
        });
        }
    });
}

function editDoacao(id) {
    const doacoes = JSON.parse(localStorage.getItem('doacoes')) || [];
    const doacao = doacoes.find(d => d.id === id);
    
    if (doacao) {
        // Preenche o formulário com os dados existentes
        document.getElementById('doador').value = doacao.doador;
        document.getElementById('marca').value = doacao.marca;
        document.getElementById('tipo').value = doacao.tipo;
        document.getElementById('Hipoalergenico').value = doacao.Hipoalergenico;
        document.getElementById('fluxo').value = doacao.fluxo;
        document.getElementById('indicacao').value = doacao.indicacao;
        document.getElementById('quantidade').value = doacao.quantidade;
        
        // Remove a linha da tabela (mas mantém nos dados até salvar)
        document.querySelector(`tr[data-id="${id}"]`)?.remove();
        
        // Armazena o ID que está sendo editado para uso no submit
        document.getElementById('doacaoForm').dataset.editingId = id;
    }
}

function calcularTotal() {
    const doacoes = JSON.parse(localStorage.getItem('doacoes')) || [];
    const total = doacoes.reduce((sum, doacao) => sum + parseInt(doacao.quantidade), 0);
    document.getElementById('totalDoacoes').textContent = total;
}