<template>
  <bar-chart v-if="loaded" :chart-data="associations" :chart-labels="labels"></bar-chart>
</template>

<script>
import BarChart from './Chart.vue'

export default {
  name: "App",  
  components: {
    BarChart
  },
  props: {},
  data () {
    return {
      package: null,
      packageName: '',
      period: 'last-month',
      loaded: false,
      associations: [],
      labels: [],
      showError: false,
      errorMessage: 'Please enter a package name'
    }
  },
  async mounted() {
    this.loaded = false
    //console.log("Before");
    const response = await fetch("/api/message");
    const data = await response.text();
    this.message = this.convertToArray(data);
    this.associations = this.getAssociationsFromArray(this.message);
    this.labels = this.getDatesFromArray(this.message);
    this.loaded = true
    //console.log(this.message);
  },
  methods: {
    convertToArray: function (data, delimiter=',') {
      // slice from start of text to the first \n index
      // use split to create an array from string by delimiter
      data = data.replace(/(\r)/gm, "");
      const headers = data.slice(0, data.indexOf("\n")).split(delimiter);

      // slice from \n index + 1 to the end of the text
      // use split to create an array of each csv value row
      const rows = data.slice(data.indexOf("\n") + 1).split("\n");

      // Map the rows
      // split values from each row into an array
      // use headers.reduce to create an object
      // object properties derived from headers:values
      // the object passed as an element of the array
      const arr = rows.map(function (row) {
        var values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
          object[header.trim()] = values[index];
          return object;
        }, {});
        return el;
      });

      // return the array
      return arr;
    },
    getAssociationsFromArray: function(arr) {
      var data = new Array();
      for (let i = 0; i < arr.length; i++) {
        let value = "";
        if (arr[i] !== undefined) {
          value = arr[i]["Associations"];
          //console.log(value);
          data[i] = parseInt(value);
        }
      }
      //console.log(data);
      return data;
    },
    getDatesFromArray: function(arr) {
      var data = new Array();
      for (let i = 0; i < arr.length; i++) {
        let value = "";
        if (arr[i] !== undefined) {
          value = arr[i]["Date"];
          //console.log(value);
          data[i] = value;
        }
      }
      console.log(data);
      return data;
    }
  }
}

</script>
