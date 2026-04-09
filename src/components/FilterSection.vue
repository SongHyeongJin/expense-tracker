<template>
  <div class="filter-bar d-flex gap-2 mb-3 overflow-auto pb-2">
    <input
      type="date"
      class="form-control form-control-sm w-auto"
      v-model="localFilters.startDate"
      @change="emitFilter"
    />
    <input
      type="date"
      class="form-control form-control-sm w-auto"
      v-model="localFilters.endDate"
      @change="emitFilter"
    />
    <select
      class="form-select form-select-sm w-auto"
      v-model="localFilters.type"
      @change="emitFilter"
    >
      <option value="">전체</option>
      <option value="INCOME">수입</option>
      <option value="EXPENSE">지출</option>
    </select>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
const emit = defineEmits(['filter-change']);

const localFilters = reactive({
  startDate: '',
  endDate: '',
  type: '',
});

const emitFilter = () => {
  emit('filter-change', { ...localFilters });
};
</script>
