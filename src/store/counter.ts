import { defineStore } from "pinia";

export const userCounterStore = defineStore("counter", () => {
  //ref变量 → state 属性
  const count = ref(0);

  // computed计算属性 → getters
  const double = computed(() => {
    return count.value * 2;
  });

  // function → actions
  function increment() {
    count.value++;
  }

  return { count, double, increment };
});
