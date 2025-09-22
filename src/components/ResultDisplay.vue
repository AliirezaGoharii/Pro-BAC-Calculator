<script setup>
defineProps({
  bacResult: Number,
  status: Object
})
</script>

<template>
    <div class="card transition-colors duration-300" :class="status.color">
         <h2 class="text-xl font-bold mb-2">Result</h2>
        <div v-if="bacResult !== null" class="flex items-center justify-between">
            <span class="font-semibold text-lg">Estimated BAC:</span>
            <span class="text-3xl font-bold">{{ bacResult.toFixed(3) }} %</span>
        </div>
        <p class="mt-2 text-center font-semibold">{{ status.text }}</p>
    </div>
</template>

