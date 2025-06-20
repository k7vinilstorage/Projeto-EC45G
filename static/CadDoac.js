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
            hipoalergenico: document.getElementById('Hipoalergenico').value === 'Sim',
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
                Swal.fire('Sucesso!', 'Doação registrada com sucesso.', 'success');
                form.reset();
            } else {
                Swal.fire('Erro!', data.error || 'Erro ao registrar.', 'error');
            }
        })
        .catch(err => {
            Swal.fire('Erro!', 'Falha na comunicação com o servidor.', 'error');
            console.error(err);
        });

        // Remove a doação antiga se estiver editando
        if (form.dataset.editingId) {
            let doacoes = JSON.parse(localStorage.getItem('doacoes')) || [];
            doacoes = doacoes.filter(d => d.id !== parseInt(form.dataset.editingId));
            localStorage.setItem('doacoes', JSON.stringify(doacoes));
            delete form.dataset.editingId; // Remove o ID de edição
        }

        // Salva a doação
        saveDoacao(dados);
        
        // Atualiza a tabela
        addDoacaoToTable(dados);
        
        // Limpa o formulário
        form.reset();

        calcularTotal();
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

    function saveDoacao(doacao) {
        let doacoes = JSON.parse(localStorage.getItem('doacoes')) || [];
        doacoes.push(doacao);
        localStorage.setItem('doacoes', JSON.stringify(doacoes));
        calcularTotal();
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
                <button class="btn-action btn-edit" onclick="editDoacao(${doacao.id})">Editar</button>
                <button class="btn-action btn-delete" onclick="deleteDoacao(${doacao.id})">Excluir</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    }
});


// Funções globais para os botões de ação
function deleteDoacao(id) {
    if (confirm('Tem certeza que deseja excluir esta doação?')) {
        let doacoes = JSON.parse(localStorage.getItem('doacoes')) || [];
        doacoes = doacoes.filter(doacao => doacao.id !== id);
        localStorage.setItem('doacoes', JSON.stringify(doacoes));
        
        document.querySelector(`tr[data-id="${id}"]`).remove();
        calcularTotal();
    }
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