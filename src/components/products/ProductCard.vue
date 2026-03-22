<script setup lang="ts">
import type { Product } from "@/api/products";
import { formatCurrency } from "@/utils/currency";

defineProps<{ product: Product }>();
defineEmits<{ select: [product: Product] }>();
</script>

<template>
  <div class="product-card">
    <div class="product-card__image-wrapper">
      <img :src="product.imageUrl" :alt="product.name" class="product-card__image" loading="lazy" />
      <div v-if="!product.isAvailable" class="product-card__overlay">
        <span class="product-card__sold-out">Agotado</span>
      </div>
      <div
        class="product-card__stock-badge"
        :class="{ 'product-card__stock-badge--low': product.stock <= 3 && product.stock > 0 }"
      >
        <span v-if="product.stock > 0">{{ product.stock }} disponibles</span>
        <span v-else>Sin stock</span>
      </div>
    </div>

    <div class="product-card__body">
      <h3 class="product-card__name">{{ product.name }}</h3>
      <p class="product-card__description">{{ product.description }}</p>

      <div class="product-card__footer">
        <div class="product-card__price">
          <span class="product-card__price-label">Precio</span>
          <span class="product-card__price-value">{{ formatCurrency(product.priceCents) }}</span>
        </div>

        <button
          v-if="product.isAvailable"
          class="product-card__cta"
          @click="$emit('select', product)"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="1" y="4" width="22" height="16" rx="2" stroke-width="2" />
            <line x1="1" y1="10" x2="23" y2="10" stroke-width="2" />
          </svg>
          Pagar con tarjeta
        </button>

        <span v-else class="product-card__unavailable">No disponible</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1.5px solid #f0f0f0;
  overflow: hidden;
  transition: all 0.25s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  border-color: rgba(201, 168, 76, 0.35);
}

.product-card__image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 60%;
  overflow: hidden;
  background: #f8f7f4;
}

.product-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-card__image {
  transform: scale(1.04);
}

.product-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card__sold-out {
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #ffffff;
  background: rgba(239, 68, 68, 0.8);
  padding: 6px 14px;
  border-radius: 20px;
}

.product-card__stock-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  font-family: "DM Sans", sans-serif;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.55);
  color: #ffffff;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.product-card__stock-badge--low {
  background: rgba(0, 0, 0, 0.55);
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.3);
}

.product-card__body {
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.product-card__name {
  font-family: "DM Sans", sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.3;
  margin: 0;
}

.product-card__description {
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card__footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

.product-card__price {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product-card__price-label {
  font-family: "DM Sans", sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #9ca3af;
}

.product-card__price-value {
  font-family: "DM Sans", sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: -0.5px;
}

.product-card__cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  padding: 11px 16px;
  background: linear-gradient(135deg, #c9a84c, #e8c56a);
  color: #0a0a0f;
  border: none;
  border-radius: 12px;
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(201, 168, 76, 0.3);
}

.product-card__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(201, 168, 76, 0.4);
}

.product-card__unavailable {
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  color: #9ca3af;
}
</style>
