<template class="container">
    <b-jumbotron bg-variant="info" text-variant="white" border-variant="dark" lead="Number of Associations" class="text-center">
        <template #header>
            {{ ticker }}<b-icon-arrow-up v-if="up" class="text-success"/><b-icon-arrow-down v-else class="text-danger"/>
        </template>
    </b-jumbotron>
</template>
<script>
import { BJumbotron, BIconArrowUp, BIconArrowDown } from 'bootstrap-vue'

export default {
    name: "Ticker",
    components: {
        BJumbotron, BIconArrowUp, BIconArrowDown
    },
    props: {
        ticker: Number,
        up: Boolean
    },
}
</script>
<style scoped>

</style>