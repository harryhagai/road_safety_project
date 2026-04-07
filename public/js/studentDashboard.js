document.addEventListener('DOMContentLoaded', function () {
    const chartElement = document.getElementById('studentPerformanceChart');

    if (!chartElement || typeof Chart === 'undefined') {
        return;
    }

    const labels = JSON.parse(chartElement.dataset.labels || '[]');
    const fullLabels = JSON.parse(chartElement.dataset.fullLabels || '[]');
    const averages = JSON.parse(chartElement.dataset.averages || '[]');

    if (!labels.length || !averages.length) {
        return;
    }

    new Chart(chartElement, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Score',
                data: averages,
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.14)',
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointHoverRadius: 5,
                pointBackgroundColor: '#0d6efd'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function (items) {
                            const index = items[0] && typeof items[0].dataIndex === 'number' ? items[0].dataIndex : 0;
                            return fullLabels[index] || labels[index];
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0,
                        font: {
                            size: window.innerWidth < 576 ? 9 : 11
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        font: {
                            size: window.innerWidth < 576 ? 9 : 11
                        }
                    }
                }
            }
        }
    });
});
