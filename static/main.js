document.addEventListener('DOMContentLoaded', function() {
    // Dados compartilhados
    let datasets = [];

    fetch('/getDataGraphic')
        .then(response => response.json())
        .then(data => {
            // Guarda apenas os datasets
            datasets = data.datasets;

            
        
    
            const barData = {
                labels: ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'],
                datasets: datasets
            };

            // Configuração do gráfico de barras
            const barConfig = {
                type: 'bar',
                data: barData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                pointStyle: 'circle',
                                font: {
                                    size: 20
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${context.raw.toLocaleString()}`;
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Doações Anuais por Bimestre (em unidades)',
                            font: {
                                size: 25
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    size: 20
                                },
                                callback: function(value) {
                                    return value.toLocaleString();
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        }
                    },
                    animation: {
                        duration: 1500
                    }
                }
            };

            // Calcular totais anuais para o gráfico de donut
            const donutLabels = barData.datasets.map(dataset => dataset.label);
            const donutDataValues = barData.datasets.map(dataset => {
                return dataset.data.reduce((a, b) => a + b, 0);
            });
            const donutColors = barData.datasets.map(dataset => dataset.backgroundColor);

            // Configuração do gráfico de donut
            const donutConfig = {
                type: 'doughnut',
                data: {
                    labels: donutLabels,
                    datasets: [{
                        data: donutDataValues,
                        backgroundColor: donutColors,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                pointStyle: 'circle',
                                font: {
                                    size: 20
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.raw.toLocaleString()}`;
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Total de doações por Ano (em unidades)',
                            font: {
                                size: 25
                            }
                        }
                    },
                    animation: {
                        duration: 1500
                    }
                }
            };

            // Criar os gráficos
            const barCtx = document.getElementById('barChart');
            const barChart = new Chart(barCtx, barConfig);

            const donutCtx = document.getElementById('donutChart');
            const donutChart = new Chart(donutCtx, donutConfig);

            // Função para redimensionar gráficos
            function resizeCharts() {
                barChart.resize();
                donutChart.resize();
            }

            // Configurar observador de redimensionamento
            const resizeObserver = new ResizeObserver(resizeCharts);
            const chartContainers = document.querySelectorAll('.chart-container');
            chartContainers.forEach(container => {
                resizeObserver.observe(container);
            });

            // Redimensionar inicialmente
            setTimeout(resizeCharts, 100);
        })
    .catch(error => console.error('Erro ao carregar dados do gráfico:', error));
});


function validaEredireciona() {
    Swal.fire({
        title: 'Insira as datas',
        html:
            '<input id="dataInicial" type="date" class="swal2-input" placeholder="Data Inicial">' +
            '<input id="dataFinal" type="date" class="swal2-input" placeholder="Data Final">',
        confirmButtonText: 'Gerar',
        focusConfirm: false,
        preConfirm: () => {
            const dataInicial = document.getElementById('dataInicial').value;
            const dataFinal = document.getElementById('dataFinal').value;

            if (!dataInicial || !dataFinal) {
                Swal.showValidationMessage('Preencha ambas as datas');
                return false;
            }

            const dtInicial = new Date(dataInicial);
            const dtFinal = new Date(dataFinal);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            if (dtInicial >= dtFinal) {
                Swal.showValidationMessage('A data inicial deve ser menor que a data final');
                return false;
            }

            if (dtFinal >= hoje) {
                Swal.showValidationMessage('A data final deve ser menor que a data atual');
                return false;
            }

            return { dataInicial, dataFinal };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { dataInicial, dataFinal } = result.value;
            const url = `${geraRelatUrl}?data_inicial=${encodeURIComponent(dataInicial)}&data_final=${encodeURIComponent(dataFinal)}`;
            window.location.href = url;
        }
    });
}

