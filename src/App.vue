<template>
  <div class="container">
    <div>
      <ticker :ticker="getTickerFromAssociationsArray(all_associations)" :up="getUpOrDown(all_associations)"></ticker>
      <br/>
      <p>
        <span>Select the number of months to display:
          <select v-model="history">
            <option value=0>ALL</option>
            <option>12</option>
            <option>24</option>
            <option>36</option>
            <option>48</option>
          </select>
        </span>
      </p>
      <br/>
      <bar-chart v-if="loaded" :key="history" :chart-data="trimArray(all_associations)" :chart-labels="trimArray(this.getDatesFromArray(this.message))"></bar-chart>
      <line-chart v-if="loaded" :key="1+history" :chart-data="trimArray(getAssociationDifferences(all_associations))" :chart-labels="trimArray(this.getDatesFromArray(this.message))"></line-chart>
      <br/>
      <activity-summary-chart v-if="loaded" :chart-data="getValuesFromDict(summaryActivities)" :chartLabels="getKeysFromDict(summaryActivities)"></activity-summary-chart>
    </div>
  </div> 
</template>

<script>
import BarChart from './Chart.vue'
import LineChart from './AssociationLineChart.vue'
import Ticker from './Ticker'
import ActivitySummaryChart from './ActivitySummaryChart.vue'

export default {
  name: "App",  
  components: {
    BarChart,
    LineChart,
    Ticker,
    ActivitySummaryChart
  },
  props: {
    
  },
  data () {
    return {
      package: null,
      packageName: '',
      period: 'last-month',
      loaded: false,
      all_associations: [],
      associations: [],
      activities: [],
      labels: [],
      message: {},
      activities_message: [],
      summaryActivities: {},
      showError: false,
      errorMessage: 'Please enter a package name',
      ticker: null,
      username: '',
      authenticated: false,
      history: 0
    }
  },
  async mounted() {
    this.loaded = false;
    const response = await fetch("/api/message");
    const data = await response.text();
    this.message = this.convertToArray(data);
    this.all_associations = this.getAssociationsFromArray(this.message);
    this.labels = this.getDatesFromArray(this.message);

    const activities_resp = await fetch("/api/activities");
    const activities_data = await activities_resp.text();
    this.activities_message = this.convertToArray(activities_data);
    this.activities = this.parseActivitiesArray(this.activities_message);
    this.summaryActivities = this.getSummaryActivityData(this.activities);

    this.authenticated = this.getUserInfo();
    this.loaded = true;
  },
  methods: {
    trimArray: function(arr) {
      var arr2 = new Array();
      if (this.history > 0) {
        arr2 = arr.slice(Math.max(arr.length - this.history, 0));
      } else {
        arr2 = arr;
      }
      return arr2;
    },
    getUserInfo: function() {
      var  username = ''
      try { 
        username = JSON.parse(localStorage["auth@aad"])["userDetails"];
        this.authenticated = true;
        this.username = username;
      } catch (SyntaxError) {
        this.authenticated = false;
      }
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
      return arr;
    },
    getAssociationsFromArray: function(arr) {
      var data = new Array();
      for (let i = 0; i < arr.length; i++) {
        let value = "";
        if (arr[i] !== undefined) {
          value = arr[i]["Associations"];
          data[i] = parseInt(value);
        }
      }
      return data;
    },
    parseActivitiesArray: function(arr) {
      let arr2 = new Array();
      for (let i=0; i<arr.length; i++) {
        let set = {};
        set.ActivityCode = arr[i]["ActivityCode"];
        set.FollowupStartDate = arr[i]["FollowupStartDate"];
        set.WhoOwnerCode = arr[i]["WhoOwnerCode"];
        arr2[i] = set;
      }
      return arr2;
    },
    getTickerFromAssociationsArray: function(arr) {
      const ticker = arr.slice(-1)[0];
      return ticker;
    },
    getDatesFromArray: function(arr) {
      var data = new Array();
      for (let i = 0; i < arr.length; i++) {
        let value = "";
        if (arr[i] !== undefined) {
          value = arr[i]["Date"];
          data[i] = value;
        }
      }
      return data;
    },
    getAssociationDifferences: function(arr) {
      var differences = new Number;
      var percentages = new Array;
      for (let i=0; i<arr.length; i++) {
        if (i===0) {
          differences[i] = 0;
          percentages[i] = 0;
        } else {
          try {
            differences = (arr[i] - arr[i-1])/arr[i]*100;
            percentages[i] = differences.toFixed(2);
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
    },
    getSummaryActivityData: function(arr) {
      let summaryDict = {};
      let summaryCount = 1;
      for (let i=0; i<arr.length; i++) {
        let key = arr[i]["WhoOwnerCode"];
        if (summaryDict[key] === undefined) {
          summaryDict[key] = key;
          summaryDict[key] = { Name: key, Count: summaryCount }
        } else {
          let value = summaryDict[key]["Count"];
          summaryDict[key]["Count"] = value + 1;
        }
      }
      console.log(summaryDict);
      return summaryDict;
    },
    getKeysFromDict: function(dict) {
      let keys = [];
      let values = [];
      let i = 0;
      for (const [key, value] of Object.entries(dict)) {
        console.log(key);
        keys[i] = value.Name;
        values[i] = value.Count;
        i++;
      }
      console.log(keys);
      console.log(values);
      return keys;
    }, 
    getValuesFromDict: function(dict) {
      let keys = [];
      let values = [];
      let i = 0;
      for (const [key, value] of Object.entries(dict)) {
        console.log(key);
        keys[i] = value.Name;
        values[i] = value.Count;
        i++;
      }
      console.log(keys);
      console.log(values);
      return values;
    }
  }
}

</script>
