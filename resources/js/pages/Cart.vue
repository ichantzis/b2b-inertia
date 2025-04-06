<script setup>
import { computed, ref } from 'vue';
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import HeaderLayout from '@/layouts/HeaderLayout.vue'; // Assuming layout path
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Divider from 'primevue/divider';
import Image from 'primevue/image';
import Card from 'primevue/card';
import Message from 'primevue/message';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Container from '@/components/Container.vue'; // Assuming component exists
import PageTitleSection from '@/components/PageTitleSection.vue'; // Assuming component exists

defineOptions({
    layout: HeaderLayout,
});

const props = defineProps({
    cartItems: {
        type: Array,
        default: () => [],
    },
});

const page = usePage();
const toast = useToast();

const itemQuantities = ref({});
props.cartItems.forEach(item => {
    itemQuantities.value[item.id] = item.quantity;
});

const cartIsEmpty = computed(() => !props.cartItems || props.cartItems.length === 0);

const cartSubtotal = computed(() => {
    return props.cartItems.reduce((sum, item) => {
        const price = parseFloat(item.artwork_data?.price || 0);
        const quantity = itemQuantities.value[item.id] || item.quantity;
        return sum + (price * quantity);
    }, 0);
});

const shippingCost = computed(() => cartSubtotal.value > 0 ? 5.00 : 0); // Example cost
const cartTotal = computed(() => cartSubtotal.value + shippingCost.value);

const updateQuantity = (itemId) => {
    const newQuantity = itemQuantities.value[itemId];
    router.put(route('cart.update', itemId), { quantity: newQuantity }, {
        preserveScroll: true,
        preserveState: (page) => Object.keys(page.props.errors).length > 0,
        onSuccess: () => { toast.add({ severity: 'success', summary: 'Success', detail: 'Cart updated', life: 3000 }); },
        onError: (errors) => {
            const originalItem = props.cartItems.find(item => item.id === itemId);
            if (originalItem) { itemQuantities.value[itemId] = originalItem.quantity; }
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update quantity.', life: 3000 });
            console.error('Quantity update error:', errors);
        },
    });
};

const removeItem = (itemId) => {
    router.delete(route('cart.destroy', itemId), {
        preserveScroll: true,
        preserveState: (page) => Object.keys(page.props.errors).length > 0,
        onSuccess: () => {
            toast.add({ severity: 'info', summary: 'Removed', detail: 'Item removed from cart', life: 3000 });
            delete itemQuantities.value[itemId]; // Keep manual deletion for immediate feedback
        },
        onError: (errors) => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove item.', life: 3000 });
            console.error('Remove item error:', errors);
        },
    });
};

// Modified to optionally skip currency symbol for the small screen display
const formatCurrency = (value, showSymbol = true) => {
    if (typeof value !== 'number') {
        value = parseFloat(value) || 0;
    }
    const options = showSymbol ? { style: 'currency', currency: 'EUR' } : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    return new Intl.NumberFormat('el-GR', options).format(value);
};

</script>

<template>

    <Head title="Your Cart" />
    <Toast position="top-center" />

    <Container class="mt-10 mb-10" vertical>
        <PageTitleSection>
            <template #title>Your Shopping Cart</template>
        </PageTitleSection>

        <div v-if="cartIsEmpty" class="text-center py-12">
            <Message severity="info" :closable="false">Your cart is currently empty.</Message>
            <Link :href="route('artworks')">
            <Button label="Continue Shopping" icon="pi pi-arrow-right" iconPos="right" class="mt-6" />
            </Link>
        </div>

        <div v-else class="grid grid-cols-12 gap-6 md:gap-8">
            <div class="col-span-12 lg:col-span-8">
                <div class="space-y-4">
                    <div v-for="item in cartItems" :key="item.id"
                        class="flex flex-row items-center gap-3 sm:gap-4 border dynamic-border p-3 sm:p-4 rounded-lg shadow-sm">

                        <div class="flex-shrink-0 w-16 sm:w-24">
                            <Image :src="item.artwork_data?.img_thumb || '/images/placeholder.png'"
                                :alt="item.artwork_data?.title || 'Artwork Image'" :width="96"
                                imageClass="object-contain rounded border dynamic-border" preview />
                        </div>

                        <div class="flex-1 min-w-0">
                            <h3 class="font-semibold text-sm sm:text-base mb-0 ">{{ item.artwork_data?.title ||
                                'Untitled' }}
                            </h3>
                            <p class="text-xs text-muted-color mb-1 hidden sm:block">ID: {{ item.artwork_id }}</p>
                            <p class="text-xs sm:text-sm text-muted-color">Type: {{ item.type }}</p>
                            <p class="text-xs sm:text-sm text-muted-color">Frame: {{ item.frame }}</p>
                            <p class="text-xs sm:text-sm text-muted-color">Size: {{ item.size }}</p>

                            <p class="block sm:hidden mt-1 text-sm text-muted-color">
                                {{ itemQuantities[item.id] }} x <span class="font-semibold">€{{ formatCurrency(item.artwork_data?.price || 0, false)
                                }}</span>
                            </p>
                        </div>

                        <div class="flex flex-row items-center justify-end gap-2 sm:gap-4 ml-auto">
                            <InputNumber v-model="itemQuantities[item.id]" showButtons buttonLayout="horizontal"
                                :min="1" @update:modelValue="updateQuantity(item.id)"
                                inputClass="w-8 sm:w-10 text-center !text-xs sm:!text-sm"
                                decrementButtonClass="p-button-secondary p-button-outlined !px-1 !py-0 sm:!p-1"
                                incrementButtonClass="p-button-secondary p-button-outlined !px-1 !py-0 sm:!p-1"
                                incrementButtonIcon="pi pi-plus !text-xs" decrementButtonIcon="pi pi-minus !text-xs"
                                pt:root:class="'!w-auto'" />
                            <div class="font-semibold w-16 sm:w-24 text-right hidden sm:block">
                                {{ formatCurrency(parseFloat(item.artwork_data?.price || 0) * itemQuantities[item.id])
                                }}
                            </div>
                            <Button icon="pi pi-times-circle" severity="secondary" text rounded aria-label="Remove Item"
                                @click="removeItem(item.id)" pt:root:class="!p-1 !w-7 !h-7 sm:!p-2 sm:!w-8 sm:!h-8"
                                 />
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-4">
                <Card class="sticky top-28">
                    <template #title>
                        <h4 class="text-xl font-semibold">Order Summary</h4>
                    </template>
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
                        <Link :href="route('checkout.index')" class="w-full">
                        <Button label="Proceed to Checkout" class="w-full" icon="pi pi-lock" iconPos="right" />
                        </Link>
                    </template>
                </Card>
            </div>
        </div>
    </Container>
</template>