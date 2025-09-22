<script setup>
import BacCalculator from './components/BacCalculator.vue';
</script>

<template>
  <main class="flex items-start justify-center min-h-screen p-4 sm:p-6 lg:p-8">
    <div class="w-full max-w-2xl mx-auto">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white">
          Pro BAC Calculator 🍷
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          An advanced tool to estimate your Blood Alcohol Content.
        </p>
      </header>
      <BacCalculator />
       <footer class="text-center mt-8 text-xs text-gray-400 dark:text-gray-500">
        <p>Developed with Vue.js & Tailwind CSS. This is for entertainment purposes only.</p>
      </footer>
    </div>
  </main>
</template>

