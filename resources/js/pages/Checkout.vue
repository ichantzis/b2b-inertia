<template>
    <HeaderLayout>

        <Head title="Checkout" />
        <Container>
            <PageTitleSection title="Checkout" />

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
                <div class="lg:col-span-2">
                    <form @submit.prevent="submit" class="space-y-6">
                        <Card>
                            <template #title>
                                <h2 class="text-lg font-semibold">Billing Information</h2>
                            </template>
                            <template #content>
                                <div class="space-y-6">
                                    <div>
                                        <label for="billingEmail" class="block font-medium mb-1">Email</label>
                                        <InputText id="billingEmail" type="email" v-model="form.billingInfo.email"
                                            :class="{ 'p-invalid': form.errors['billingInfo.email'] }" class="w-full" />
                                        <small v-if="form.errors['billingInfo.email']" class="p-error">{{
                                            form.errors['billingInfo.email'] }}</small>
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label for="billingFirstName" class="block font-medium mb-1">First
                                                Name</label>
                                            <InputText id="billingFirstName" v-model="form.billingInfo.firstName"
                                                :class="{ 'p-invalid': form.errors['billingInfo.firstName'] }"
                                                class="w-full" />
                                            <small v-if="form.errors['billingInfo.firstName']" class="p-error">{{
                                                form.errors['billingInfo.firstName'] }}</small>
                                        </div>
                                        <div>
                                            <label for="billingLastName" class="block font-medium mb-1">Last
                                                Name</label>
                                            <InputText id="billingLastName" v-model="form.billingInfo.lastName"
                                                :class="{ 'p-invalid': form.errors['billingInfo.lastName'] }"
                                                class="w-full" />
                                            <small v-if="form.errors['billingInfo.lastName']" class="p-error">{{
                                                form.errors['billingInfo.lastName'] }}</small>
                                        </div>
                                    </div>
                                    <div>
                                        <label for="billingCountry" class="block font-medium mb-1">Country</label>
                                        <Select inputId="billingCountry" v-model="form.billingInfo.country_object"
                                            :options="countries" filter optionLabel="name"
                                            placeholder="Select a country"
                                            :class="{ 'p-invalid': form.errors['billingInfo.country'] }" class="w-full"
                                            @change="onBillingCountryChange" dataKey="code">
                                            <template #value="slotProps">
                                                <div v-if="slotProps.value" class="flex items-center">
                                                    <span v-if="slotProps.value.code"
                                                        :class="`fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`"
                                                        style="font-size: 1.2rem;"></span>
                                                    <div v-else class="mr-2 inline-block rounded-sm"
                                                        style="width: 20px; height:15px; background-color: #f0f0f0;">
                                                    </div>
                                                    <div>{{ slotProps.value.name }}</div>
                                                </div>
                                                <span v-else>{{ slotProps.placeholder }}</span>
                                            </template>
                                            <template #option="slotProps">
                                                <div class="flex items-center">
                                                    <span v-if="slotProps.option.code"
                                                        :class="`fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`"
                                                        style="font-size: 1.2rem;"></span>
                                                    <div v-else class="mr-2 inline-block rounded-sm"
                                                        style="width: 20px; height:15px; background-color: #f0f0f0;">
                                                    </div>
                                                    <div>{{ slotProps.option.name }}</div>
                                                </div>
                                            </template>
                                        </Select>
                                        <small v-if="form.errors['billingInfo.country']" class="p-error">{{
                                            form.errors['billingInfo.country'] }}</small>
                                    </div>
                                    <div>
                                        <label for="billingStreetAddress" class="block font-medium mb-1">Street
                                            Address</label>
                                        <InputText id="billingStreetAddress" v-model="form.billingInfo.streetAddress"
                                            :class="{ 'p-invalid': form.errors['billingInfo.streetAddress'] }"
                                            class="w-full" />
                                        <small v-if="form.errors['billingInfo.streetAddress']" class="p-error">{{
                                            form.errors['billingInfo.streetAddress'] }}</small>
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label for="billingCity" class="block font-medium mb-1">City/Town</label>
                                            <InputText id="billingCity" v-model="form.billingInfo.city"
                                                :class="{ 'p-invalid': form.errors['billingInfo.city'] }"
                                                class="w-full" />
                                            <small v-if="form.errors['billingInfo.city']" class="p-error">{{
                                                form.errors['billingInfo.city'] }}</small>
                                        </div>
                                        <div>
                                            <label for="billingStateOrCounty"
                                                class="block font-medium mb-1">State/County</label>
                                            <InputText id="billingStateOrCounty"
                                                v-model="form.billingInfo.stateOrCounty"
                                                :class="{ 'p-invalid': form.errors['billingInfo.stateOrCounty'] }"
                                                class="w-full" />
                                            <small v-if="form.errors['billingInfo.stateOrCounty']" class="p-error">{{
                                                form.errors['billingInfo.stateOrCounty'] }}</small>
                                        </div>
                                        <div>
                                            <label for="billingPostalCode"
                                                class="block font-medium mb-1">Postcode/ZIP</label>
                                            <InputText id="billingPostalCode" v-model="form.billingInfo.postalCode"
                                                :class="{ 'p-invalid': form.errors['billingInfo.postalCode'] }"
                                                class="w-full" />
                                            <small v-if="form.errors['billingInfo.postalCode']" class="p-error">{{
                                                form.errors['billingInfo.postalCode'] }}</small>
                                        </div>
                                    </div>
                                    <div>
                                        <label for="billingPhone" class="block font-medium mb-1">Phone</label>
                                        <InputText id="billingPhone" v-model="form.billingInfo.phone"
                                            :class="{ 'p-invalid': form.errors['billingInfo.phone'] }" class="w-full" />
                                        <small v-if="form.errors['billingInfo.phone']" class="p-error">{{
                                            form.errors['billingInfo.phone'] }}</small>
                                    </div>

                                    <Divider />

                                    <div class="flex items-center py-2">
                                        <Checkbox inputId="wantsInvoice" v-model="form.wantsInvoice" :binary="true" />
                                        <label for="wantsInvoice" class="ml-2 font-medium">I require an invoice (for
                                            company/professional)</label>
                                    </div>

                                    <Fieldset legend="Invoice Details" v-if="form.wantsInvoice" :toggleable="false"
                                        class="mt-4">
                                        <div class="space-y-4 p-fluid">
                                            <div>
                                                <label for="invoiceCompanyName" class="block font-medium mb-1">Company
                                                    Name</label>
                                                <InputText id="invoiceCompanyName"
                                                    v-model="form.invoiceDetails.companyName"
                                                    :class="{ 'p-invalid': form.errors['invoiceDetails.companyName'] }"
                                                    class="w-full" />
                                                <small v-if="form.errors['invoiceDetails.companyName']"
                                                    class="p-error">{{
                                                        form.errors['invoiceDetails.companyName']
                                                    }}</small>
                                            </div>
                                            <div>
                                                <label for="invoiceVatNumber" class="block font-medium mb-1">VAT
                                                    Number</label>
                                                <InputText id="invoiceVatNumber" v-model="form.invoiceDetails.vatNumber"
                                                    :class="{ 'p-invalid': form.errors['invoiceDetails.vatNumber'] }"
                                                    class="w-full" />
                                                <small v-if="form.errors['invoiceDetails.vatNumber']" class="p-error">{{
                                                    form.errors['invoiceDetails.vatNumber'] }}</small>
                                            </div>
                                            <div>
                                                <label for="invoiceProfession" class="block font-medium mb-1">Profession
                                                    / Business Activity</label>
                                                <InputText id="invoiceProfession"
                                                    v-model="form.invoiceDetails.profession"
                                                    :class="{ 'p-invalid': form.errors['invoiceDetails.profession'] }"
                                                    class="w-full" />
                                                <small v-if="form.errors['invoiceDetails.profession']"
                                                    class="p-error">{{
                                                        form.errors['invoiceDetails.profession']
                                                    }}</small>
                                            </div>
                                            <div>
                                                <label for="invoiceTaxOffice" class="block font-medium mb-1">Tax Office
                                                    (ΔΟΥ - Optional)</label>
                                                <InputText id="invoiceTaxOffice" v-model="form.invoiceDetails.taxOffice"
                                                    :class="{ 'p-invalid': form.errors['invoiceDetails.taxOffice'] }"
                                                    class="w-full" />
                                                <small v-if="form.errors['invoiceDetails.taxOffice']" class="p-error">{{
                                                    form.errors['invoiceDetails.taxOffice'] }}</small>
                                            </div>
                                        </div>
                                    </Fieldset>
                                </div>
                            </template>
                        </Card>

                        <Card>
                            <template #content>
                                <div class="flex items-center">
                                    <Checkbox inputId="shippingIsDifferent" v-model="form.shippingIsDifferent"
                                        :binary="true" />
                                    <label for="shippingIsDifferent" class="ml-2 font-medium">Ship to a different
                                        address?</label>
                                </div>
                            </template>
                        </Card>


                        <Card v-if="form.shippingIsDifferent">
                            <template #title>
                                <h2 class="text-lg font-semibold">Shipping Information</h2>
                            </template>
                            <template #content>
                                <div class="space-y-6">
                                    <div>
                                        <label for="shippingEmail" class="block font-medium mb-1">Shipping Contact Email
                                            (Optional)</label>
                                        <InputText id="shippingEmail" type="email" v-model="form.shippingInfo.email"
                                            :class="{ 'p-invalid': form.errors['shippingInfo.email'] }"
                                            class="w-full" />
                                        <small v-if="form.errors['shippingInfo.email']" class="p-error">{{
                                            form.errors['shippingInfo.email'] }}</small>
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label for="shippingFirstName" class="block font-medium mb-1">First
                                                Name</label>
                                            <InputText id="shippingFirstName" v-model="form.shippingInfo.firstName"
                                                :class="{ 'p-invalid': form.errors['shippingInfo.firstName'] }"
                                                class="w-full" />
                                            <small v-if="form.errors['shippingInfo.firstName']" class="p-error">{{
                                                form.errors['shippingInfo.firstName'] }}</small>
                                        </div>
                                        <div>
                                            <label for="shippingLastName" class="block font-medium mb-1">Last
                                                Name</label>
                                            <InputText id="shippingLastName" v-model="form.shippingInfo.lastName"
                                                :class="{ 'p-invalid': form.errors['shippingInfo.lastName'] }"
                                                class="w-full" />
                                            <small v-if="form.errors['shippingInfo.lastName']" class="p-error">{{
                                                form.errors['shippingInfo.lastName'] }}</small>
                                        </div>
                                    </div>
                                    <div>
                                        <label for="shippingCountry" class="block font-medium mb-1">Country</label>
                                        <Select inputId="shippingCountry" v-model="form.shippingInfo.country_object"
                                            :options="countries" filter optionLabel="name"
                                            placeholder="Select a country"
                                            :class="{ 'p-invalid': form.errors['shippingInfo.country'] }" class="w-full"
                                            @change="onShippingCountryChange" dataKey="code">
                                            <template #value="slotProps">
                                                <div v-if="slotProps.value" class="flex items-center">
                                                    <span v-if="slotProps.value.code"
                                                        :class="`fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`"
                                                        style="font-size: 1.2rem;"></span>
                                                    <div v-else class="mr-2 inline-block rounded-sm"
                                                        style="width: 20px; height:15px; background-color: #f0f0f0;">
                                                    </div>
                                                    <div>{{ slotProps.value.name }}</div>
                                                </div>
                                                <span v-else>{{ slotProps.placeholder }}</span>
                                            </template>
                                            <template #option="slotProps">
                                                <div class="flex items-center">
                                                    <span v-if="slotProps.option.code"
                                                        :class="`fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`"
                                                        style="font-size: 1.2rem;"></span>
                                                    <div v-else class="mr-2 inline-block rounded-sm"
                                                        style="width: 20px; height:15px; background-color: #f0f0f0;">
                                                    </div>
                                                    <div>{{ slotProps.option.name }}</div>
                                                </div>
                                            </template>
                                        </Select>
                                        <small v-if="form.errors['shippingInfo.country']" class="p-error">{{
                                            form.errors['shippingInfo.country'] }}</small>
                                    </div>
                                    <div>
                                        <label for="shippingStreetAddress" class="block font-medium mb-1">Street
                                            Address</label>
                                        <InputText id="shippingStreetAddress" v-model="form.shippingInfo.streetAddress"
                                            :class="{ 'p-invalid': form.errors['shippingInfo.streetAddress'] }"
                                            class="w-full" />
                                        <small v-if="form.errors['shippingInfo.streetAddress']" class="p-error">{{
                                            form.errors['shippingInfo.streetAddress'] }}</small>
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label for="shippingCity" class="block font-medium mb-1">City/Town</label>
                                            <InputText id="shippingCity" v-model="form.shippingInfo.city"
                                                :class="{ 'p-invalid': form.errors['shippingInfo.city'] }"
                                                class="w-full" />
                                            <small v-if="form.errors['shippingInfo.city']" class="p-error">{{
                                                form.errors['shippingInfo.city'] }}</small>
                                        </div>
                                        <div>
                                            <label for="shippingStateOrCounty"
                                                class="block font-medium mb-1">State/County</label>
                                            <InputText id="shippingStateOrCounty"
                                                v-model="form.shippingInfo.stateOrCounty"
                                                :class="{ 'p-invalid': form.errors['shippingInfo.stateOrCounty'] }"
                                                class="w-full" />
                                            <small v-if="form.errors['shippingInfo.stateOrCounty']" class="p-error">{{
                                                form.errors['shippingInfo.stateOrCounty'] }}</small>
                                        </div>
                                        <div>
                                            <label for="shippingPostalCode"
                                                class="block font-medium mb-1">Postcode/ZIP</label>
                                            <InputText id="shippingPostalCode" v-model="form.shippingInfo.postalCode"
                                                :class="{ 'p-invalid': form.errors['shippingInfo.postalCode'] }"
                                                class="w-full" />
                                            <small v-if="form.errors['shippingInfo.postalCode']" class="p-error">{{
                                                form.errors['shippingInfo.postalCode'] }}</small>
                                        </div>
                                    </div>
                                    <div>
                                        <label for="shippingPhone" class="block font-medium mb-1">Phone
                                            (Optional)</label>
                                        <InputText id="shippingPhone" v-model="form.shippingInfo.phone"
                                            :class="{ 'p-invalid': form.errors['shippingInfo.phone'] }"
                                            class="w-full" />
                                        <small v-if="form.errors['shippingInfo.phone']" class="p-error">{{
                                            form.errors['shippingInfo.phone'] }}</small>
                                    </div>
                                </div>
                            </template>
                        </Card>

                        <Card>
                            <template #title>
                                <h2 class="text-lg font-semibold">Order Notes</h2>
                            </template>
                            <template #content>
                                <TextArea id="notes" v-model="form.notes" rows="3"
                                    placeholder="Notes about your order, e.g. special notes for delivery."
                                    :class="{ 'p-invalid': form.errors.notes }" class="w-full" />
                                <small v-if="form.errors.notes" class="p-error">{{ form.errors.notes }}</small>
                            </template>
                        </Card>

                    </form>
                </div>

                <div class="lg:col-span-1">
                    <Card>
                        <template #title>
                            <h2 class="text-lg font-semibold">Your Order</h2>
                        </template>
                        <template #content>
                            <div class="space-y-4">
                                <div v-for="item in cartItems" :key="item.id" class="flex justify-between items-start">
                                    <div>
                                        <div class="font-medium">{{ item.artwork_data.title || 'Artwork' }}</div>
                                        <div class="text-sm text-gray-600">Type: {{ item.type }}</div>
                                        <div class="text-sm text-gray-600">Frame: {{ item.frame }}</div>
                                        <div class="text-sm text-gray-600">Size: {{ item.size }}</div>
                                        <div class="text-sm text-gray-600">Qty: {{ item.quantity }}</div>
                                    </div>
                                    <div>{{ formatCurrency(item.artwork_data.price * item.quantity) }}</div>
                                </div>
                            </div>
                            <Divider />
                            <div class="mt-4 pt-4">
                                <div class="flex gap-2">
                                    <InputText v-model="couponCode" placeholder="Coupon"
                                        class="w-full p-inputtext-sm" :disabled="!!appliedCoupon" />
                                    <Button v-if="!appliedCoupon" label="Apply" size="small" :loading="isCheckingCoupon"
                                        @click="applyCoupon" :disabled="!couponCode" />
                                    <Button v-else icon="pi pi-times" severity="danger" outlined size="small"
                                        @click="removeCoupon" />
                                </div>
                                <small class="text-red-500 block mt-1" v-if="couponError">{{ couponError }}</small>
                                <small class="text-green-600 block mt-1" v-if="appliedCoupon">Code {{ appliedCoupon.code
                                    }} applied!</small>

                                <div class="space-y-2 mt-4 text-sm">
                                    <div class="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{{ formatCurrency(cartTotal) }}</span>
                                    </div>

                                    <div v-if="appliedCoupon" class="flex justify-between text-green-600 font-medium">
                                        <span>Discount ({{ appliedCoupon.code }})</span>
                                        <span>-{{ formatCurrency(discountAmount) }}</span>
                                    </div>

                                    <div class="flex justify-between font-bold text-lg pt-2 border-t">
                                        <span>Total</span>
                                        <span>{{ formatCurrency(finalTotal) }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-3 mt-6">
                                <label class="block font-medium">Payment Method</label>
                                <div class="flex flex-col md:flex-row md:gap-6">
                                    <!-- Removed stripe payment method-->
                                    <!-- <div class="flex items-center">
                                        <RadioButton inputId="pmStripe" name="paymentMethod" value="stripe"
                                            v-model="form.paymentMethod" />
                                        <label for="pmStripe" class="ml-2">Card (Stripe)</label>
                                    </div> -->
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
                                <small v-if="form.errors.paymentMethod" class="p-error">{{ form.errors.paymentMethod
                                    }}</small>
                            </div>

                            <Button label="Place Order" icon="pi pi-check" type="submit" @click="submit"
                                class="mt-4 w-full" :loading="form.processing" />
                        </template>
                    </Card>
                </div>
            </div>
        </Container>
    </HeaderLayout>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useForm, usePage } from '@inertiajs/vue3';
import { Head } from '@inertiajs/vue3';
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';
import InputText from 'primevue/inputtext';
import TextArea from 'primevue/textarea';
import Select from 'primevue/select';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Checkbox from 'primevue/checkbox';
import Fieldset from 'primevue/fieldset';

// Props
const { cartItems, cartTotal, user } = defineProps({
    cartItems: Array,
    cartTotal: Number,
    user: Object,
});

const page = usePage();
// const initialCountry = countries.value.find(c => c.code === user.country) || null;

const form = useForm({
    billingInfo: {
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        country: user.country || '', // This will store the CODE (e.g., 'AT')
        country_object: null, // Temporary holder for the selected country object from <Select>
        streetAddress: user.address || '',
        city: user.city || '',
        stateOrCounty: user.state_or_county || '',
        postalCode: user.postal_code || '',
        phone: user.phone || '',
    },
    wantsInvoice: false, // New flag for requesting invoice details
    invoiceDetails: {    // New object for invoice specific fields
        companyName: user.company_name || '',
        vatNumber: user.vat_number || '',
        taxOffice: user.tax_office || '',   // Optional
        profession: user.profession || '',
    },
    shippingIsDifferent: false,
    shippingInfo: {
        firstName: '', lastName: '', email: '', country: '', // This will store the CODE
        country_object: null, // Temporary holder
        streetAddress: '', city: '', stateOrCounty: '', postalCode: '', phone: '',
    },
    coupon_code: null,
    paymentMethod: 'bank_transfer',
    items: cartItems,
    totalAmount: cartTotal,
    notes: '',
});

// European countries list
const countries = ref([
    { name: 'Greece', code: 'GR' },
    { name: 'Austria', code: 'AT' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Bulgaria', code: 'BG' },
    { name: 'Croatia', code: 'HR' },
    { name: 'Cyprus', code: 'CY' },
    { name: 'Czech Republic', code: 'CZ' }, // Note: PrimeVue flag CSS might use 'cz'
    { name: 'Denmark', code: 'DK' },
    { name: 'Estonia', code: 'EE' },
    { name: 'Finland', code: 'FI' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'Hungary', code: 'HU' },
    { name: 'Ireland', code: 'IE' },
    { name: 'Italy', code: 'IT' },
    { name: 'Latvia', value: 'LV' }, // Should be code: 'LV'
    { name: 'Lithuania', code: 'LT' },
    { name: 'Luxembourg', code: 'LU' },
    { name: 'Malta', code: 'MT' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Poland', code: 'PL' },
    { name: 'Portugal', code: 'PT' },
    { name: 'Romania', code: 'RO' },
    { name: 'Slovakia', code: 'SK' },
    { name: 'Slovenia', code: 'SI' },
    { name: 'Spain', code: 'ES' },
    { name: 'Sweden', code: 'SE' },
    // Add other countries as needed
]);

// Coupon code
// Script Section
import axios from 'axios';

const couponCode = ref('');
const couponError = ref('');
const appliedCoupon = ref(null); // Stores object { code, type, value }
const isCheckingCoupon = ref(false);

const applyCoupon = async () => {
    if (!couponCode.value) return;

    isCheckingCoupon.value = true;
    couponError.value = '';

    try {
        const response = await axios.post(route('checkout.validate.coupon'), {
            code: couponCode.value
        });

        appliedCoupon.value = response.data; // { code: 'SUMMER', value: 10, type: 'fixed' ...}

        // Update the form so it sends the code to the backend logic
        form.coupon_code = response.data.code;

    } catch (error) {
        couponError.value = error.response?.data?.message || 'Invalid coupon';
        appliedCoupon.value = null;
        form.coupon_code = null;
    } finally {
        isCheckingCoupon.value = false;
    }
};

const removeCoupon = () => {
    // 1. Reset the input field
    couponCode.value = '';
    
    // 2. Clear error messages
    couponError.value = '';
    
    // 3. Clear the applied coupon object (hides the green success text & discount line)
    appliedCoupon.value = null;
    
    // 4. IMPORTANT: Clear the value in the form object so it doesn't get sent to the backend
    form.coupon_code = null;
};

// Computed property for the Final Total display
const discountAmount = computed(() => {
    if (!appliedCoupon.value) return 0;

    // Assuming you have a 'cartTotal' ref or prop
    if (appliedCoupon.value.type === 'fixed') {
        return Number(appliedCoupon.value.value);
    } else {
        return (cartTotal * Number(appliedCoupon.value.value)) / 100;
    }
});

const finalTotal = computed(() => {
    return Math.max(0, cartTotal - discountAmount.value);
});

const formatPrice = (value) => {
    let val = (value / 1).toFixed(2).replace('.', ',')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' €'
};

// Alternative: Using the browser's built-in Intl API (Cleaner & localized)
/*
const formatPrice = (value) => {
    return new Intl.NumberFormat('el-GR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    }).format(value);
};
*/

// Submit handler
function submit() {
    console.log('Submitting form:', form);
    
    form.post(route('checkout.store'));
}

// Currency formatter
function formatCurrency(value) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format(value);
}

// Function to initialize country_object based on country code from user profile or existing form data
const initializeCountryObjects = () => {
    if (form.billingInfo.country) {
        form.billingInfo.country_object = countries.value.find(c => c.code === form.billingInfo.country) || null;
    }
    if (form.shippingInfo.country) { // if shipping is different and pre-filled
        form.shippingInfo.country_object = countries.value.find(c => c.code === form.shippingInfo.country) || null;
    }
};

const onBillingCountryChange = (event) => {
    // event.value will be the selected country object (e.g., { name: 'Austria', code: 'AT' })
    if (event.value) {
        form.billingInfo.country = event.value.code; // Store the code in the actual form field
        form.billingInfo.country_object = event.value; // Keep the object for display in Select
    } else {
        form.billingInfo.country = '';
        form.billingInfo.country_object = null;
    }
    // If shipping is same as billing, update shipping country too
    if (!form.shippingIsDifferent) {
        form.shippingInfo.country = form.billingInfo.country;
        form.shippingInfo.country_object = form.billingInfo.country_object;
    }
};

// Similar function for shipping country if you have a separate dropdown for it
const onShippingCountryChange = (event) => {
    if (event.value) {
        form.shippingInfo.country = event.value.code;
        form.shippingInfo.country_object = event.value;
    } else {
        form.shippingInfo.country = '';
        form.shippingInfo.country_object = null;
    }
};

// Watcher to copy billing to shipping if not different
watch(() => form.shippingIsDifferent, (isDifferent) => {
    if (!isDifferent) {
        form.shippingInfo = { ...form.billingInfo }; // This will copy country code and country_object
    } else {
        // Reset shipping info, including country_object
        form.shippingInfo = {
            firstName: '', lastName: '', email: '',
            country: '', country_object: null, // Reset country fields
            streetAddress: '', city: '', stateOrCounty: '', postalCode: '', phone: ''
        };
    }
});

// Also watch billingInfo if shipping is not different
watch(() => form.billingInfo, (newBillingInfo) => {
    if (!form.shippingIsDifferent) {
        // Ensure country_object is also copied or derived if only code is copied
        form.shippingInfo = { ...newBillingInfo };
        if (newBillingInfo.country && !newBillingInfo.country_object) {
            form.shippingInfo.country_object = countries.value.find(c => c.code === newBillingInfo.country) || null;
        }
    }
}, { deep: true });

// Clear invoice details if wantsInvoice is false
// watch(() => form.wantsInvoice, (wants) => {
//     if (!wants) {
//         form.invoiceDetails = {
//             companyName: '', vatNumber: '', taxOffice: '', profession: ''
//         };
//     }
// });

onMounted(() => {
    // ... your existing onMounted logic for pre-filling ...
    initializeCountryObjects(); // Initialize after other pre-fills
});
</script>