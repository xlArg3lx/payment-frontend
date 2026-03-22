<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView, useRouter } from "vue-router";
import { useCheckoutStore } from "@/stores/checkout";

const router = useRouter();
const store = useCheckoutStore();

onMounted(async () => {
  try {
    const hasTransaction = await store.recoverSession();

    if (hasTransaction && store.transaction) {
      if (store.isFinished) {
        router.push("/result");
      }
    }
  } catch {
    store.CLEAR_SESSION();
  }
});
</script>

<template>
  <RouterView />
</template>
