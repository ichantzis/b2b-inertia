<template>
    <div>
        <div class="grid grid-cols-12 gap-4 mb-2 font-semibold text-gray-500 text-sm px-2">
            <div class="col-span-5">Size (WxH)</div>
            <div class="col-span-5">Price (€)</div>
            <div class="col-span-2 text-center">Action</div>
        </div>

        <template v-for="(item, index) in modelValue" :key="index">
            
            <div v-if="shouldShowDivider(index)" class="col-span-12 flex items-center gap-4 my-4">
                <Divider align="left" type="solid" class="m-0">
                    <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Square Sizes</span>
                </Divider>
            </div>

            <div class="grid grid-cols-12 gap-4 mb-2 items-center">
                <div class="col-span-5">
                    <InputText 
                        v-model="item.size" 
                        placeholder="WxH (e.g. 40x60)" 
                        class="w-full p-inputtext-sm"
                        :class="{ 'p-invalid': errors[index] }"
                        @blur="handleSizeBlur(index)"
                        @input="errors[index] = null" 
                    />
                    <small v-if="errors[index]" class="text-red-500 text-xs block mt-1">
                        {{ errors[index] }}
                    </small>
                </div>

                <div class="col-span-5">
                    <InputNumber 
                        v-model="item.price" 
                        mode="currency" 
                        currency="EUR" 
                        locale="el-GR"
                        class="w-full p-inputtext-sm"
                        :min="0"
                    />
                </div>

                <div class="col-span-2 text-center">
                    <Button 
                        icon="pi pi-trash" 
                        severity="danger" 
                        text 
                        rounded 
                        @click="removeItem(index)"
                        aria-label="Remove"
                    />
                </div>
            </div>
        </template>

        <div class="mt-4">
            <Button 
                label="Add New Size" 
                icon="pi pi-plus" 
                size="small" 
                outlined 
                @click="addItem" 
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import { Divider } from 'primevue';

const props = defineProps({
    modelValue: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);
const errors = ref({});

// Helper validation regex
const isValidSize = (s) => /^\d+x\d+$/.test(s);

// Helper to check if square
const isSquare = (s) => {
    if (!isValidSize(s)) return false;
    const [w, h] = s.split('x').map(Number);
    return w === h;
};

// Divider Logic
const shouldShowDivider = (index) => {
    if (index === 0) return false;
    
    const currentItem = props.modelValue[index];
    const prevItem = props.modelValue[index - 1];

    if (!currentItem || !prevItem) return false;

    // Show divider if Previous is Rectangle AND Current is Square
    const prevIsSquare = isSquare(prevItem.size);
    const currIsSquare = isSquare(currentItem.size);

    return !prevIsSquare && currIsSquare;
};

const handleSizeBlur = (index) => {
    const item = props.modelValue[index];
    if (!item.size) return;

    let rawSize = item.size.toLowerCase().trim();
    
    // Format Check
    if (!rawSize.includes('x')) {
        errors.value[index] = "Format must be WxH (e.g. 50x70)";
        return;
    }

    // 1. Normalize dimensions (Ensure Width < Height for rectangles)
    const [d1, d2] = rawSize.split('x').map(n => parseInt(n));
    
    if (isNaN(d1) || isNaN(d2)) {
        errors.value[index] = "Invalid numbers";
        return;
    }

    const w = Math.min(d1, d2);
    const h = Math.max(d1, d2);
    const normalizedSize = `${w}x${h}`;

    // 2. Check for Duplicates
    const isDuplicate = props.modelValue.some((existingItem, i) => {
        return i !== index && existingItem.size === normalizedSize;
    });

    if (isDuplicate) {
        errors.value[index] = "Size already exists";
        return;
    }

    // 3. Update Item ONLY (No Sorting)
    const newList = [...props.modelValue];
    newList[index] = { ...item, size: normalizedSize };

    emit('update:modelValue', newList);
    errors.value = {}; 
};

const addItem = () => {
    // Add new item to the end (Bottom of the list)
    const newArray = [...props.modelValue, { size: '', price: 0 }];
    emit('update:modelValue', newArray);
};

const removeItem = (index) => {
    const newArray = props.modelValue.filter((_, i) => i !== index);
    emit('update:modelValue', newArray);
};
</script>