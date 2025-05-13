<template>
    <HeaderLayout>

        <Head title="Checkout" />
        <Container>
            <PageTitleSection title="Checkout" />

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="col-span-2">
                    <Card>
                        <template #title>
                            <h2 class="text-lg font-semibold">Shipping Information</h2>
                        </template>
                        <template #subtitle>
                            <p class="text-sm text-gray-600">
                                Please fill in your shipping information.
                            </p>
                        </template>
                        <template #content>
                            <form @submit.prevent="submit" class="space-y-6">

                                <div>
                                    <label for="email" class="block font-medium mb-1">Email</label>
                                    <InputText id="email" type="email" v-model="form.shippingInfo.email"
                                        :class="{ 'p-invalid': form.errors['shippingInfo.email'] }" class="w-full" />
                                    <small v-if="form.errors['shippingInfo.email']" class="p-error">
                                        {{ form.errors['shippingInfo.email'] }}
                                    </small>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label for="firstName" class="block font-medium mb-1">First Name</label>
                                        <InputText id="firstName" v-model="form.shippingInfo.firstName"
                                            :class="{ 'p-invalid': form.errors['shippingInfo.firstName'] }" class="w-full" />
                                        <small v-if="form.errors['shippingInfo.firstName']" class="p-error">
                                            {{ form.errors['shippingInfo.firstName'] }}
                                        </small>
                                    </div>
                                    <div>
                                        <label for="lastName" class="block font-medium mb-1">Last Name</label>
                                        <InputText id="lastName" v-model="form.shippingInfo.lastName"
                                            :class="{ 'p-invalid': form.errors['shippingInfo.lastName'] }" class="w-full" />
                                        <small v-if="form.errors['shippingInfo.lastName']" class="p-error">
                                            {{ form.errors['shippingInfo.lastName'] }}
                                        </small>
                                    </div>
                                </div>

                                <div>
                                    <label for="country" class="block font-medium mb-1">Country</label>
                                    <Dropdown id="country" v-model="form.shippingInfo.country" :options="countries"
                                        optionLabel="label" optionValue="value" placeholder="Select a country"
                                        :class="{ 'p-invalid': form.errors['shippingInfo.country'] }" class="w-full" />
                                    <small v-if="form.errors['shippingInfo.country']" class="p-error">
                                        {{ form.errors['shippingInfo.country'] }}
                                    </small>
                                </div>

                                <div>
                                    <label for="streetAddress" class="block font-medium mb-1">Street Address</label>
                                    <InputText id="streetAddress" v-model="form.shippingInfo.streetAddress"
                                        :class="{ 'p-invalid': form.errors['shippingInfo.streetAddress'] }" class="w-full" />
                                    <small v-if="form.errors['shippingInfo.streetAddress']" class="p-error">
                                        {{ form.errors['shippingInfo.streetAddress'] }}
                                    </small>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label for="city" class="block font-medium mb-1">City/Town</label>
                                        <InputText id="city" v-model="form.shippingInfo.city"
                                            :class="{ 'p-invalid': form.errors['shippingInfo.city'] }" class="w-full" />
                                        <small v-if="form.errors['shippingInfo.city']" class="p-error">
                                            {{ form.errors['shippingInfo.city'] }}
                                        </small>
                                    </div>
                                    <div>
                                        <label for="stateOrCounty" class="block font-medium mb-1">State/County</label>
                                        <InputText id="stateOrCounty" v-model="form.shippingInfo.stateOrCounty"
                                            :class="{ 'p-invalid': form.errors['shippingInfo.stateOrCounty'] }"
                                            class="w-full" />
                                        <small v-if="form.errors['shippingInfo.stateOrCounty']" class="p-error">
                                            {{ form.errors['shippingInfo.stateOrCounty'] }}
                                        </small>
                                    </div>
                                    <div>
                                        <label for="postalCode" class="block font-medium mb-1">Postcode/ZIP</label>
                                        <InputText id="postalCode" v-model="form.shippingInfo.postalCode"
                                            :class="{ 'p-invalid': form.errors['shippingInfo.postalCode'] }"
                                            class="w-full" />
                                        <small v-if="form.errors['shippingInfo.postalCode']" class="p-error">
                                            {{ form.errors['shippingInfo.postalCode'] }}
                                        </small>
                                    </div>
                                </div>

                                <div>
                                    <label for="phone" class="block font-medium mb-1">Phone</label>
                                    <InputText id="phone" v-model="form.shippingInfo.phone"
                                        :class="{ 'p-invalid': form.errors['shippingInfo.phone'] }" class="w-full" />
                                    <small v-if="form.errors['shippingInfo.phone']" class="p-error">
                                        {{ form.errors['shippingInfo.phone'] }}
                                    </small>
                                </div>

                                <div>
                                    <label for="notes" class="block font-medium mb-1">Order Notes</label>
                                    <TextArea id="notes" v-model="form.shippingInfo.notes" rows="3"
                                        :class="{ 'p-invalid': form.errors['shippingInfo.notes'] }" class="w-full" />
                                    <small v-if="form.errors['shippingInfo.notes']" class="p-error">
                                        {{ form.errors['shippingInfo.notes'] }}
                                    </small>
                                </div>

                                <Divider />

                            </form>
                        </template>
                    </Card>
                </div>

                <div>
                    <Card>
                        <template #title>
                            <h2 class="text-lg font-semibold">Your Order</h2>
                        </template>
                        <template #subtitle>
                            <p class="text-sm text-gray-600">
                                Review your order before proceeding to payment.
                            </p>
                        </template>
                        <template #content>
                            <div class="space-y-4">
                                <div v-for="item in cartItems" :key="item.id" class="flex justify-between items-start">
                                    <div>
                                        <div class="font-medium">
                                            {{ item.artwork_data.title || 'Artwork' }}
                                        </div>
                                        <div class="text-sm text-gray-600">
                                            Size: {{ item.size }}, Frame: {{ item.frame }}
                                        </div>
                                        <div class="text-sm text-gray-600">
                                            Qty: {{ item.quantity }}
                                        </div>
                                    </div>
                                    <div>{{ formatCurrency(item.artwork_data.price * item.quantity) }}</div>
                                </div>
                            </div>
                            <Divider />
                            <div class="flex justify-between font-semibold">
                                <span>Subtotal</span>
                                <span>{{ formatCurrency(cartTotal) }}</span>
                            </div>

                            <div class="space-y-3 mt-6">
                                <label class="block font-medium">Payment Method</label>
                                <div class="flex flex-col md:flex-row md:gap-6">
                                    <div class="flex items-center">
                                        <RadioButton inputId="pmStripe" name="paymentMethod" value="stripe"
                                            v-model="form.paymentMethod" />
                                        <label for="pmStripe" class="ml-2">Card (Stripe)</label>
                                    </div>
                                    <div class="flex items-center">
                                        <RadioButton inputId="pmCod" name="paymentMethod" value="cod"
                                            v-model="form.paymentMethod" />
                                        <label for="pmCod" class="ml-2">Cash on Delivery</label>
                                    </div>
                                    <div class="flex items-center">
                                        <RadioButton inputId="pmBank" name="paymentMethod" value="bank_transfer"
                                            v-model="form.paymentMethod" />
                                        <label for="pmBank" class="ml-2">Bank Transfer</label>
                                    </div>
                                </div>
                                <small v-if="form.errors.paymentMethod" class="p-error">
                                    {{ form.errors.paymentMethod }}
                                </small>
                            </div>

                            <Button label="Place Order" icon="pi pi-check" type="submit" class="mt-4 w-full"
                                :loading="form.processing" @click="submit" />
                        </template>
                    </Card>
                </div>
            </div>
        </Container>
    </HeaderLayout>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3';
import { Head } from '@inertiajs/vue3';
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';
import InputText from 'primevue/inputtext';
import TextArea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Divider from 'primevue/divider';

// Props
const { cartItems, cartTotal } = defineProps({
    cartItems: Array,
    cartTotal: Number,
});

// Form state
const form = useForm({
    shippingInfo: {
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        streetAddress: '',
        city: '',
        stateOrCounty: '',
        postalCode: '',
        phone: '',
        notes: '',
    },
    paymentMethod: 'stripe',
    items: cartItems,
    totalAmount: cartTotal,
});

// European countries list
const countries = [
    { label: 'Austria', value: 'AT' },
    { label: 'Belgium', value: 'BE' },
    { label: 'Bulgaria', value: 'BG' },
    { label: 'Croatia', value: 'HR' },
    { label: 'Cyprus', value: 'CY' },
    { label: 'Czech Republic', value: 'CZ' },
    { label: 'Denmark', value: 'DK' },
    { label: 'Estonia', value: 'EE' },
    { label: 'Finland', value: 'FI' },
    { label: 'France', value: 'FR' },
    { label: 'Germany', value: 'DE' },
    { label: 'Greece', value: 'GR' },
    { label: 'Hungary', value: 'HU' },
    { label: 'Ireland', value: 'IE' },
    { label: 'Italy', value: 'IT' },
    { label: 'Latvia', value: 'LV' },
    { label: 'Lithuania', value: 'LT' },
    { label: 'Luxembourg', value: 'LU' },
    { label: 'Malta', value: 'MT' },
    { label: 'Netherlands', value: 'NL' },
    { label: 'Poland', value: 'PL' },
    { label: 'Portugal', value: 'PT' },
    { label: 'Romania', value: 'RO' },
    { label: 'Slovakia', value: 'SK' },
    { label: 'Slovenia', value: 'SI' },
    { label: 'Spain', value: 'ES' },
    { label: 'Sweden', value: 'SE' },
];

// Submit handler
function submit() {
    form.post(route('checkout.store'));
}

// Currency formatter
function formatCurrency(value) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format(value);
}
</script>