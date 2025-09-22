<script setup>
import { computed } from 'vue';
import { Weight, Ruler, Calendar, Users, Clock } from 'lucide-vue-next';

const props = defineProps({
  userInfo: Object,
  time: Number,
});

const emit = defineEmits(['update:userInfo', 'update:time']);

// Local computed properties to handle v-model with object properties
const userInfo = computed({
  get: () => props.userInfo,
  set: (value) => emit('update:userInfo', value),
});

const time = computed({
    get: () => props.time,
    set: (value) => emit('update:time', value)
})

const weightLabel = computed(() => userInfo.value.units === 'metric' ? 'Weight (kg)' : 'Weight (lbs)');
const heightLabel = computed(() => userInfo.value.units === 'metric' ? 'Height (cm)' : 'Height (in)');
</script>

<template>
  <div class="card">
    <h2 class="text-xl font-bold mb-4">Your Information</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <!-- Unit Toggle -->
      <div class="col-span-2 md:col-span-3">
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium">Units:</label>
          <button @click="userInfo.units = 'metric'" :class="['px-3 py-1 text-sm rounded-md', { 'bg-blue-600 text-white': userInfo.units === 'metric', 'bg-gray-200 dark:bg-gray-600': userInfo.units !== 'metric' }]">Metric</button>
          <button @click="userInfo.units = 'imperial'" :class="['px-3 py-1 text-sm rounded-md', { 'bg-blue-600 text-white': userInfo.units === 'imperial', 'bg-gray-200 dark:bg-gray-600': userInfo.units !== 'imperial' }]">Imperial</button>
        </div>
      </div>

      <!-- Inputs -->
      <div>
        <label for="weight" class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1"><Weight class="w-4 h-4 mr-1"/>{{ weightLabel }}</label>
        <input type="number" id="weight" v-model.number="userInfo.weight" class="input-field" :placeholder="userInfo.units === 'metric' ? '70' : '155'">
      </div>
      <div>
        <label for="height" class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1"><Ruler class="w-4 h-4 mr-1"/>{{ heightLabel }}</label>
        <input type="number" id="height" v-model.number="userInfo.height" class="input-field" :placeholder="userInfo.units === 'metric' ? '175' : '69'">
      </div>
      <div>
        <label for="age" class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1"><Calendar class="w-4 h-4 mr-1"/>Age</label>
        <input type="number" id="age" v-model.number="userInfo.age" class="input-field" placeholder="25">
      </div>
      <div>
        <label for="gender" class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1"><Users class="w-4 h-4 mr-1"/>Gender</label>
        <select id="gender" v-model="userInfo.gender" class="input-field">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
       <div class="col-span-2">
        <label for="time" class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1"><Clock class="w-4 h-4 mr-1"/>Hours Since Drinking</label>
        <input type="number" id="time" v-model.number="time" class="input-field" placeholder="1" min="0">
      </div>
    </div>
  </div>
</template>

