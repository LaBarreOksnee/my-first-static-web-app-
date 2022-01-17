<template class="container">
    <b-jumbotron bg-variant="info" text-variant="white" border-variant="dark" lead="Number of Associations" class="">
        <template #header>
            {{ ticker }}
        </template>
    </b-jumbotron>
</template>
<script>
import { BJumbotron } from 'bootstrap-vue'

export default {
    name: "Ticker",
    components: {
        BJumbotron 
    },
    props: {
        ticker: Number
    },
}
</script>
<style scoped>

</style>