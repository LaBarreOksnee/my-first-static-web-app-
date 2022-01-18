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
      },
      deltaData: {
        type: Array,
        required: false
      }
    },
    data () {
      return {
        options: {
          title: {
            display: true,
            text: 'Association Count and Percent Change Month by Month'
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
            display: true
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
            label: 'Associations',
            borderColor: '#249EBF',
            pointBackgroundColor: 'blue',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            backgroundColor: 'blue',
            data: this.chartData
          },
          {
            label: 'Change (divide by 1000)',
            borderColor: '#FFFFFF',
            pointBackgroundColor: 'red',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            backgroundColor: 'red',
            data: this.deltaData,
            type: 'line',
            order: 0
          }
        ]
      }, this.options)
    }
  }
</script>