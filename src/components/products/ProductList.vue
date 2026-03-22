<script setup lang="ts">
import type { Product } from "@/api/products";
import ProductCard from "./ProductCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

defineProps<{
  products: Product[];
  loading?: boolean;
  error?: string | null;
}>();

defineEmits<{
  select: [product: Product];
  retry: [];
}>();
</script>

<template>
  <div>
    <!-- Loading skeleton -->
    <div v-if="loading" class="product-grid">
      <div v-for="i in 6" :key="i" class="skeleton-card">
        <div class="skeleton-image" />
        <div class="skeleton-body">
          <div class="skeleton-line skeleton-line--title" />
          <div class="skeleton-line" />
          <div class="skeleton-line skeleton-line--short" />
          <div class="skeleton-footer">
            <div class="skeleton-price" />
            <div class="skeleton-btn" />
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <div class="error-state__icon">⚠️</div>
      <p class="error-state__title">Error al cargar productos</p>
      <p class="error-state__message">{{ error }}</p>
      <BaseButton @click="$emit('retry')">Reintentar</BaseButton>
    </div>

    <!-- Empty -->
    <div v-else-if="products.length === 0" class="empty-state">
      <div class="empty-state__icon">📦</div>
      <p class="empty-state__title">Sin productos disponibles</p>
    </div>

    <!-- Product grid -->
    <div v-else class="product-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

@media (max-width: 640px) {
  .product-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* Skeleton */
.skeleton-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1.5px solid #f0f0f0;
  overflow: hidden;
}

.skeleton-image {
  width: 100%;
  padding-top: 60%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-body {
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  height: 13px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

.skeleton-line--title {
  height: 18px;
  width: 75%;
}
.skeleton-line--short {
  width: 50%;
}

.skeleton-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

.skeleton-price {
  width: 100px;
  height: 22px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

.skeleton-btn {
  width: 130px;
  height: 38px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 12px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Error / Empty states */
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  gap: 12px;
  text-align: center;
}

.error-state__icon,
.empty-state__icon {
  font-size: 48px;
}

.error-state__title,
.empty-state__title {
  font-family: "DM Sans", sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
}

.error-state__message {
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
  color: #6b7280;
  max-width: 300px;
}
</style>
