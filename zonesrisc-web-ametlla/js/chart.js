new Chart(document.getElementById('topChart'), {
  type: 'doughnut',
  data: {
    labels: window.zonesRisc.map(z => z.name),
    datasets: [{
      data: window.zonesRisc.map(z => z.mentions),
      backgroundColor: [
        '#dc2626', '#991b1b', '#7f1d1d', '#f97316', '#f87171',
        '#fca5a5', '#fecaca', '#fde68a', '#fbbf24', '#fef3c7'
      ],
      borderColor: '#ffffff',
      borderWidth: 4,
      hoverOffset: 10
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { size: 13 },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'bold',
          size: 16
        },
        formatter: (value) => value > 0 ? value : '',
        anchor: 'center',
        align: 'center'
      }
    }
  },
  plugins: [ChartDataLabels]
});