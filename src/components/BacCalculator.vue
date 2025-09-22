<script setup>
import { reactive, watch, computed } from 'vue';
import { useLocalStorage } from '../composables/useLocalStorage';
import UserInfoInput from './UserInfoInput.vue';
import DrinkManager from './DrinkManager.vue';
import ResultDisplay from './ResultDisplay.vue';

// --- State Management ---
// All primary data is managed here in a single reactive object
const state = reactive({
  // User Info with default values, loaded from localStorage
  userInfo: useLocalStorage('bac-user-info', {
    weight: 70,
    height: 175,
    age: 25,
    gender: 'male',
    units: 'metric' // 'metric' or 'imperial'
  }),
  // Time since drinking started
  time: useLocalStorage('bac-time', 1),
  // List of drinks consumed
  consumedDrinks: useLocalStorage('bac-consumed-drinks', []),
  // The final calculated BAC result
  bacResult: null
});


// --- Calculation Logic ---
const calculateBAC = () => {
  // Destructure for easier access
  const { weight, height, age, gender, units } = state.userInfo;
  
  if (!weight || !height || !age || state.consumedDrinks.length === 0) {
    state.bacResult = null;
    return;
  }

  // Convert imperial to metric for calculation if needed
  const weightInKg = units === 'imperial' ? weight * 0.453592 : weight;
  const heightInCm = units === 'imperial' ? height * 2.54 : height;

  if (weightInKg <= 0 || heightInCm <= 0 || age <= 0) {
      state.bacResult = 0;
      return;
  }

  // Watson formula for Total Body Water (TBW) in Liters
  let totalBodyWater;
  if (gender === 'male') {
    totalBodyWater = 2.447 - (0.09156 * age) + (0.1074 * heightInCm) + (0.3362 * weightInKg);
  } else { // female
    totalBodyWater = -2.097 + (0.1069 * heightInCm) + (0.2466 * weightInKg);
  }

  if (totalBodyWater <= 0) {
      state.bacResult = 0;
      return;
  }
  
  // Constants
  const metabolismRate = 0.015; // BAC reduction per hour
  const alcoholDensity = 0.789; // g/mL

  // Calculate total alcohol consumed in grams
  const totalAlcoholGrams = state.consumedDrinks.reduce((total, drink) => {
    const alcoholVolume = (drink.volume * drink.quantity) * (drink.abv / 100);
    return total + (alcoholVolume * alcoholDensity);
  }, 0);
  
  // Calculate raw BAC before metabolism
  const rawBac = (totalAlcoholGrams / (totalBodyWater * 1000)) * 100;
  // Adjust for time passed
  const finalBac = rawBac - (state.time * metabolismRate);

  state.bacResult = Math.max(0, finalBac);
};


// --- Computed property for result status ---
const resultStatus = computed(() => {
    if (state.bacResult === null) return { text: 'Enter your data and add drinks to see the result.', color: 'bg-gray-100 dark:bg-gray-700' };
    
    const bac = state.bacResult;
    if (bac <= 0.02) {
        return { text: 'You are likely sober.', color: 'bg-green-100 dark:bg-green-900 border-green-500' };
    } else if (bac > 0.02 && bac <= 0.08) {
        return { text: 'Feeling tipsy. It is illegal and unsafe to drive.', color: 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500' };
    } else if (bac > 0.08 && bac <= 0.20) {
        return { text: 'Drunk. Significant impairment of motor skills.', color: 'bg-orange-100 dark:bg-orange-900 border-orange-500' };
    } else {
        return { text: 'Very Drunk. High risk of alcohol poisoning.', color: 'bg-red-100 dark:bg-red-900 border-red-500' };
    }
});


// --- Watchers to trigger recalculation on any data change ---
watch(state, calculateBAC, { deep: true, immediate: true });

// --- Event Handlers ---
const handleAddDrink = (drink) => {
  state.consumedDrinks.push(drink);
};

const handleRemoveDrink = (index) => {
  state.consumedDrinks.splice(index, 1);
};

const handleClearDrinks = () => {
    state.consumedDrinks = [];
}
</script>

<template>
  <div class="space-y-6">
    <UserInfoInput v-model:userInfo="state.userInfo" v-model:time="state.time" />
    <DrinkManager 
      @add-drink="handleAddDrink" 
      @remove-drink="handleRemoveDrink"
      @clear-drinks="handleClearDrinks"
      :consumedDrinks="state.consumedDrinks" 
    />
    <ResultDisplay :bacResult="state.bacResult" :status="resultStatus" />
  </div>
</template>

