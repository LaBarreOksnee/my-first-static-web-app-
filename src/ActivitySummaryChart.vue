<script>
  import { Bar } from 'vue-chartjs'
  export default {
    extends: Bar,
    props: {
      chartData: {
        type: Array,
        required: false
      },
      chartLabels: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        options: {
          title: {
            display: true,
            text: 'Activities Per Employee'
          },
          scales: {
            x: {
              stacked: true
            },
            y: {
              stacked: true
            },
            yAxes: [{
              ticks: {
                beginAtZero: false
              },
              gridLines: {
                display: true
              }
            }],
            xAxes: [ {
              gridLines: {
                display: false
              }
            }]
          },
          legend: {
            display: false
          },
          responsive: true,
          maintainAspectRatio: false
        }
      }
    },
    mounted () {
      this.renderChart({
        indexAxis: 'y',
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Activities',
            borderColor: '#249EBF',
            pointBackgroundColor: 'blue',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            backgroundColor: 'blue',
            data: this.chartData
          }
        ]
      }, this.options)
    }
  }
</script>