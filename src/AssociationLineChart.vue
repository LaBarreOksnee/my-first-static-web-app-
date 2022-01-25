<script>
  import { Line } from 'vue-chartjs'
  export default {
    extends: Line,
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
            text: 'Association Percent Change Month to Month'
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
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Change',
            borderColor: '#FFFFFF',
            pointBackgroundColor: 'red',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            backgroundColor: 'red',
            data: this.chartData,
            type: 'line',
            order: 0
          }
        ]
      }, this.options)
    }
  }
</script>