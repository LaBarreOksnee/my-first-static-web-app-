<template>
  <div>
    <ticker :ticker="getTickerFromAssociationsArray(associations)" :up="getUpOrDown(associations)"></ticker>
    <br/>
    <bar-chart v-if="loaded" :chart-data="associations" :delta-data="getAssociationDifferences(associations)" :chart-labels="labels"></bar-chart>
  </div>
</template>

<script>
import BarChart from './Chart.vue'
import Ticker from './Ticker'

export default {
  name: "App",  
  components: {
    BarChart,
    Ticker
  },
  props: {
    
  },
  data () {
    return {
      package: null,
      packageName: '',
      period: 'last-month',
      loaded: false,
      associations: [],
      labels: [],
      showError: false,
      errorMessage: 'Please enter a package name',
      ticker: null,
      user: Object
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
    getUserInfo: async function() {
      const user = await fetch('/.auth/me');  
      const payload = user.json;
      const { clientPrincipal } = payload;
      this.user = user;
      console.log("User: " + clientPrincipal);
      return true;
    },
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
      return data;
    },
    getTickerFromAssociationsArray: function(arr) {
      const ticker = arr.slice(-1)[0];
      //console.log("Ticker: " + ticker);
      return ticker;
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
      //console.log(data);
      return data;
    },
    getAssociationDifferences: function(arr) {
      var differences = new Array;
      var percentages = new Array;
      for (let i=0; i<arr.length; i++) {
        if (i===0) {
          differences[i] = 0;
          percentages[i] = 0;
        } else {
          try {
            differences[i] = arr[i] - arr[i-1];
            percentages[i] = differences[i]/arr[i]*100*1000;
          } catch (IndexOutOfBoundsException){
            differences[i] = arr[i];
            percentages[i] = 0;
          }
        }
      }
      return percentages;
    },
    getUpOrDown(arr) {
      let up = false;
      if (arr.slice(-1)[0] - arr.slice(-2)[0] >= 0) {
        up = true;
      } else {
        up = false;
      }
      return up;
    }
  }
}

</script>
