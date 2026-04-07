document.addEventListener('DOMContentLoaded', function () {
    const chartCard = document.querySelector('.teacher-dashboard-chart--pie');
    const canvas = document.getElementById('teacherMarksProgressChart');
    const assessmentCanvas = document.getElementById('teacherStudentAssessmentChart');
    const assessmentDataNode = document.getElementById('teacherStudentAssessmentChartData');

    if (typeof Chart === 'undefined') {
        return;
    }

    Chart.defaults.font.family = "'Segoe UI', sans-serif";
    Chart.defaults.color = '#5f7698';

    if (chartCard && canvas) {
        const entered = Number(chartCard.dataset.entered || 0);
        const pending = Number(chartCard.dataset.pending || 0);
        const hasData = entered > 0 || pending > 0;

        if (hasData) {
            new Chart(canvas, {
                type: 'pie',
                data: {
                    labels: ['Entered', 'Pending'],
                    datasets: [
                        {
                            data: [entered, pending],
                            backgroundColor: ['#0d6efd', '#67a5ff'],
                            borderColor: '#ffffff',
                            borderWidth: 4,
                            hoverOffset: 6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: '#12345c',
                            padding: 10,
                            displayColors: true
                        }
                    }
                }
            });
        }
    }

    if (assessmentCanvas && assessmentDataNode) {
        const assessmentData = JSON.parse(assessmentDataNode.textContent || '{}');
        const labels = Array.isArray(assessmentData.labels) ? assessmentData.labels : [];
        const assessed = Array.isArray(assessmentData.assessed) ? assessmentData.assessed : [];
        const totalStudents = Number(assessmentData.totalStudents || 0);

        if (labels.length && assessed.length) {
            new Chart(assessmentCanvas, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Students Assessed',
                            data: assessed,
                            backgroundColor: '#67a5ff',
                            borderColor: '#0d6efd',
                            borderWidth: 1.5,
                            borderRadius: 10,
                            borderSkipped: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: totalStudents > 0 ? totalStudents : undefined,
                            ticks: {
                                precision: 0,
                                stepSize: 1
                            },
                            grid: {
                                color: 'rgba(13, 110, 253, 0.08)'
                            }
                        },
                        y: {
                            ticks: {
                                color: '#58708f',
                                font: {
                                    size: 11
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: '#12345c',
                            callbacks: {
                                label: function (context) {
                                    return context.parsed.x + ' of ' + totalStudents + ' students assessed';
                                }
                            }
                        }
                    }
                }
            });
        }
    }
});
