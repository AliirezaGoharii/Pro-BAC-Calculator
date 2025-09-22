<script setup>
import { ref } from 'vue';
import { useLocalStorage } from '../composables/useLocalStorage.js';
// FINAL FIX: Changed 'GlassCo' to the correct icon name 'CupSoda'
import { Plus, Trash2, Beer, Wine, CupSoda, Martini } from 'lucide-vue-next';

const props = defineProps({
  consumedDrinks: Array
});
const emit = defineEmits(['add-drink', 'remove-drink', 'clear-drinks']);

// --- Pre-defined and Custom Drinks ---
const standardDrinks = ref([
    { name: 'Beer (5%)', volume: 330, abv: 5, icon: Beer },
    { name: 'Wine (12%)', volume: 150, abv: 12, icon: Wine },
    // FINAL FIX: Used the correct icon component 'CupSoda' for a shot glass
    { name: 'Shot (40%)', volume: 45, abv: 40, icon: CupSoda },
    { name: 'Cocktail (15%)', volume: 200, abv: 15, icon: Martini },
]);
const customDrinks = useLocalStorage('bac-custom-drinks', []);

// --- State for adding new drinks ---
const showCustomForm = ref(false);
const newDrink = ref({ name: '', volume: null, abv: null, quantity: 1 });

const addStandardDrink = (drink) => {
  emit('add-drink', { ...drink, quantity: 1 });
}

const addCustomDrink = () => {
    if (!newDrink.value.name || !newDrink.value.volume || !newDrink.value.abv || newDrink.value.quantity <= 0) {
        console.error("Custom drink form is incomplete.");
        return; // Silently return without showing an alert/confirm
    }
    const drinkToAdd = { ...newDrink.value, icon: Martini };
    emit('add-drink', drinkToAdd);
    // save custom drink type for future use
    if (!customDrinks.value.some(d => d.name.toLowerCase() === drinkToAdd.name.toLowerCase())) {
        customDrinks.value.push({ name: drinkToAdd.name, volume: drinkToAdd.volume, abv: drinkToAdd.abv, icon: Martini });
    }
    // Reset form
    newDrink.value = { name: '', volume: null, abv: null, quantity: 1 };
    showCustomForm.value = false;
};

const removeDrink = (index) => {
  emit('remove-drink', index);
};
</script>

<template>
  <div class="card">
    <h2 class="text-xl font-bold mb-4">Manage Drinks</h2>
    
    <!-- Quick Add Buttons -->
    <div class="mb-4">
        <h3 class="text-md font-semibold mb-2">Quick Add</h3>
        <div class="flex flex-wrap gap-2">
            <button v-for="drink in [...standardDrinks, ...customDrinks]" :key="drink.name" @click="addStandardDrink(drink)" class="btn btn-secondary flex items-center text-sm">
                <component :is="drink.icon" class="w-4 h-4 mr-2"/> {{ drink.name }}
            </button>
            <button @click="showCustomForm = !showCustomForm" class="btn btn-primary flex items-center text-sm">
                 <Plus class="w-4 h-4 mr-1"/> Custom
            </button>
        </div>
    </div>

    <!-- Custom Drink Form (collapsible) -->
     <transition name="fade">
        <div v-if="showCustomForm" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
             <form @submit.prevent="addCustomDrink" class="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-xs font-medium mb-1">Name</label>
                    <input type="text" v-model="newDrink.name" placeholder="e.g., IPA Beer" class="input-field"/>
                </div>
                <div>
                    <label class="block text-xs font-medium mb-1">Volume (ml)</label>
                    <input type="number" v-model.number="newDrink.volume" placeholder="500" class="input-field"/>
                </div>
                <div>
                    <label class="block text-xs font-medium mb-1">ABV (%)</label>
                    <input type="number" v-model.number="newDrink.abv" placeholder="6.5" class="input-field"/>
                </div>
                 <div>
                    <label class="block text-xs font-medium mb-1">Quantity</label>
                    <input type="number" v-model.number="newDrink.quantity" placeholder="1" min="1" class="input-field"/>
                </div>
                <div class="col-span-2 md:col-span-4">
                    <button type="submit" class="btn btn-primary w-full">Add Custom Drink</button>
                </div>
             </form>
        </div>
     </transition>

    <!-- Consumed Drinks List -->
    <div>
        <div class="flex justify-between items-center mb-2">
            <h3 class="text-md font-semibold">Your Consumed Drinks</h3>
            <button v-if="consumedDrinks.length > 0" @click="$emit('clear-drinks')" class="btn btn-danger btn-sm flex items-center text-xs py-1 px-2">
                <Trash2 class="w-3 h-3 mr-1"/> Clear All
            </button>
        </div>
        <div v-if="consumedDrinks.length === 0" class="text-center text-gray-400 p-4 border-2 border-dashed rounded-lg">
             Your list is empty. Add some drinks!
        </div>
        <ul v-else class="space-y-2 max-h-60 overflow-y-auto pr-2">
            <li v-for="(drink, index) in consumedDrinks" :key="index" class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                <div class="flex items-center">
                    <component :is="drink.icon" class="w-5 h-5 mr-3 text-gray-500"/>
                    <span class="font-medium">{{ drink.quantity }}x {{ drink.name }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">({{ drink.volume }}ml @ {{ drink.abv }}%)</span>
                </div>
                <button @click="removeDrink(index)" class="text-red-500 hover:text-red-700">
                    <Trash2 class="w-5 h-5"/>
                </button>
            </li>
        </ul>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform-origin: top;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scaleY(0.9);
}
</style>

