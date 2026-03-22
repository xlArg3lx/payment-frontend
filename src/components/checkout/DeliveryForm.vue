<script setup lang="ts">
import BaseInput from "@/components/ui/BaseInput.vue";

export interface DeliveryFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
}

const props = defineProps<{
  modelValue: DeliveryFormData;
  errors: Record<string, string>;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: DeliveryFormData];
}>();

function update(field: keyof DeliveryFormData, value: string) {
  emit("update:modelValue", { ...props.modelValue, [field]: value });
}
</script>

<template>
  <div class="delivery-form">
    <div class="delivery-form__fields">
      <div class="delivery-form__row">
        <BaseInput
          :model-value="modelValue.name"
          label="Nombre completo"
          placeholder="Juan Pérez"
          :error="errors.name"
          @update:model-value="update('name', $event)"
        />
        <BaseInput
          :model-value="modelValue.email"
          label="Correo electrónico"
          type="email"
          placeholder="juan@correo.com"
          :error="errors.email"
          @update:model-value="update('email', $event)"
        />
      </div>

      <BaseInput
        :model-value="modelValue.phone"
        label="Teléfono"
        placeholder="3001234567"
        :maxlength="10"
        :error="errors.phone"
        @update:model-value="update('phone', $event)"
      />

      <BaseInput
        :model-value="modelValue.address"
        label="Dirección de entrega"
        placeholder="Calle 123 # 45-67, Apto 201"
        :error="errors.address"
        @update:model-value="update('address', $event)"
      />

      <div class="delivery-form__row">
        <BaseInput
          :model-value="modelValue.city"
          label="Ciudad"
          placeholder="Bogotá"
          :error="errors.city"
          @update:model-value="update('city', $event)"
        />
        <BaseInput
          :model-value="modelValue.department"
          label="Departamento"
          placeholder="Cundinamarca"
          :error="errors.department"
          @update:model-value="update('department', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.delivery-form__fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.delivery-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 480px) {
  .delivery-form__row {
    grid-template-columns: 1fr;
  }
}
</style>
