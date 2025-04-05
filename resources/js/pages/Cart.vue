<script setup>
import { computed, ref } from 'vue';
import { Head, Link, router, usePage } from '@inertiajs/vue3';
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Divider from 'primevue/divider';
import Image from 'primevue/image';
import Card from 'primevue/card';
import Message from 'primevue/message';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

defineOptions({
    layout: HeaderLayout,
});

const props = defineProps({
    cartItems: {
        type: Array,
        default: () => [],
    },
    // cartTotal is likely calculated client-side based on items or passed separately if needed
});

const page = usePage();
const toast = useToast();

// --- State for cart item quantities ---
// PrimeVue's InputNumber v-model needs a direct reference.
// We create refs for each item's quantity to manage updates locally
// before sending them to the backend.
const itemQuantities = ref({});
props.cartItems.forEach(item => {
    itemQuantities.value[item.id] = item.quantity;
});

// --- Computed Properties ---
const cartIsEmpty = computed(() => !props.cartItems || props.cartItems.length === 0);

const cartSubtotal = computed(() => {
    return props.cartItems.reduce((sum, item) => {
        const price = parseFloat(item.artwork_data?.price || 0);
        const quantity = itemQuantities.value[item.id] || item.quantity; // Use local quantity if available
        return sum + (price * quantity);
    }, 0);
});

// Placeholder for shipping - implement your logic
const shippingCost = computed(() => cartSubtotal.value > 0 ? 5.00 : 0);

const cartTotal = computed(() => cartSubtotal.value + shippingCost.value);

// --- Methods ---
const updateQuantity = (itemId) => {
    const newQuantity = itemQuantities.value[itemId];
    router.put(route('cart.update', itemId), {
        quantity: newQuantity,
    }, {
        preserveScroll: true,
        onSuccess: () => {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Cart updated', life: 3000 });
            // Note: Inertia might automatically update props.cartItems if the controller returns the updated cart
        },
        onError: (errors) => {
             // Revert local quantity on error
             const originalItem = props.cartItems.find(item => item.id === itemId);
             if (originalItem) {
                 itemQuantities.value[itemId] = originalItem.quantity;
             }
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update quantity.', life: 3000 });
            console.error('Quantity update error:', errors);
        },
    });
};

const removeItem = (itemId) => {
    router.delete(route('cart.destroy', itemId), {
        preserveScroll: true,
        onSuccess: () => {
            toast.add({ severity: 'info', summary: 'Removed', detail: 'Item removed from cart', life: 3000 });
            // Remove item from local quantity state
            delete itemQuantities.value[itemId];
             // Note: Inertia should update props.cartItems automatically
        },
         onError: (errors) => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove item.', life: 3000 });
            console.error('Remove item error:', errors);
        },
    });
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(value);
};

</script>

<template layout="HeaderLayout">
     <Head title="Your Cart" />
     <Toast position="top-center" />

    <Container vertical>
         <PageTitleSection>
            <template #title>Your Shopping Cart</template>
         </PageTitleSection>

         <div v-if="cartIsEmpty" class="text-center py-12">
             <Message severity="info" :closable="false">Your cart is currently empty.</Message>
             <Link :href="route('artworks')">
                 <Button label="Continue Shopping" icon="pi pi-arrow-right" iconPos="right" class="mt-6" />
             </Link>
         </div>

        <div v-else class="grid grid-cols-12 gap-4 md:gap-8">
            <div class="col-span-12 lg:col-span-8">
                <div class="space-y-4">
                    <div v-for="item in cartItems" :key="item.id" class="flex flex-col md:flex-row items-start md:items-center gap-4 border dynamic-border p-4 rounded">
                         <Image
                            :src="item.artwork_data?.img_thumb || '/images/placeholder.png'"
                            :alt="item.artwork_data?.title || 'Artwork Image'"
                            width="100"
                            imageClass="object-contain rounded"
                            preview
                        />

                        <div class="flex-1 min-w-0">
                             <h3 class="font-semibold text-lg mb-1 truncate">{{ item.artwork_data?.title || 'Untitled' }}</h3>
                             <p class="text-sm text-muted-color mb-1">ID: {{ item.artwork_id }}</p>
                             <p class="text-sm text-muted-color">Type: {{ item.type }} | Frame: {{ item.frame }} | Size: {{ item.size }}</p>
                        </div>

                         <div class="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                            <InputNumber
                                v-model="itemQuantities[item.id]"
                                showButtons
                                buttonLayout="horizontal"
                                :min="1"
                                @update:modelValue="updateQuantity(item.id)"
                                inputClass="w-16 text-center"
                                decrementButtonClass="p-button-secondary p-button-outlined"
                                incrementButtonClass="p-button-secondary p-button-outlined"
                                incrementButtonIcon="pi pi-plus"
                                decrementButtonIcon="pi pi-minus"
                                pt:root:class="!w-auto"
                             />
                             <div class="font-semibold w-24 text-center md:text-right">
                                {{ formatCurrency(parseFloat(item.artwork_data?.price || 0) * itemQuantities[item.id]) }}
                             </div>
                            <Button
                                icon="pi pi-times"
                                severity="danger"
                                text
                                rounded
                                aria-label="Remove Item"
                                @click="removeItem(item.id)"
                            />
                        </div>
                     </div>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-4">
                 <Card>
                    <template #title>Order Summary</template>
                    <template #content>
                         <div class="space-y-3">
                             <div class="flex justify-between">
                                 <span>Subtotal</span>
                                 <span>{{ formatCurrency(cartSubtotal) }}</span>
                             </div>
                             <div class="flex justify-between">
                                 <span>Shipping</span>
                                 <span>{{ formatCurrency(shippingCost) }}</span>
                             </div>
                            <Divider />
                             <div class="flex justify-between font-bold text-lg">
                                 <span>Total</span>
                                 <span>{{ formatCurrency(cartTotal) }}</span>
                             </div>
                         </div>
                    </template>
                     <template #footer>
                        <!-- <Link :href="route('checkout.index')" class="w-full"> -->
                             <Button label="Proceed to Checkout" class="w-full" icon="pi pi-lock" iconPos="right" />
                        <!-- </Link> -->
                     </template>
                 </Card>
            </div>
        </div>
    </Container>
</template>