<template>
  <div>
    <b-jumbotron bg-variant="info" text-variant="white" border-variant="dark" v-bind:header="epicData.ticker.value" lead="Number of Accounts">
    </b-jumbotron>
    {{ epicData.ticker.id }}
  </div>
</template>

<script>
import epicData from "./assets/epicdata.json";

export default {
  name: "App",
  data() {
    return {
      epicData: epicData
    };
  }
};
</script>
