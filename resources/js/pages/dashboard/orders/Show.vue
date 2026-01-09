<template>
    <AdminLayout :title="`Order ${orderForm.order_number}`">
        <InertiaHead :title="`Admin - Order ${orderForm.order_number}`" />
        <Container>
            <PageTitleSection :title="`Order Details: ${orderForm.order_number}`"
                :breadcrumbs="`Dashboard > Orders > ${orderForm.order_number}`" />

            <div class="mt-6">
                <form @submit.prevent="updateOrderDetails">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="md:col-span-2 space-y-6">
                            <Card>
                                <template #title>
                                    <div class="flex justify-between items-center">
                                        <span>Order Information</span>
                                    </div>
                                </template>
                                <template #content>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div class="mb-2"><strong>Order Date:</strong> {{ formatDate(order.created_at)
                                            }}</div>
                                        <div class="mb-2"><strong>Last Updated:</strong> {{ formatDate(order.updated_at)
                                            }}</div>
                                        <div class="border-t border-gray-100 pt-4 mt-4 space-y-3">
                                            <div class="flex justify-between text-sm">
                                                <span class="text-gray-500">Subtotal</span>
                                                <span class="font-medium text-gray-900">
                                                    {{ formatCurrency(parseFloat(order.total_amount) +
                                                    parseFloat(order.discount_amount)) }}
                                                </span>
                                            </div>

                                            <div v-if="Number(order.discount_amount) > 0"
                                                class="flex justify-between text-sm">
                                                <span class="text-green-600 flex items-center">
                                                    <i class="pi pi-tag mr-2 text-xs"></i>
                                                    Discount ({{ order.coupon_code }})
                                                </span>
                                                <span class="font-medium text-green-600">
                                                    -{{ formatCurrency(order.discount_amount) }}
                                                </span>
                                            </div>

                                            <div
                                                class="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                                                <span>Total Amount</span>
                                                <span>{{ formatCurrency(order.total_amount) }}</span>
                                            </div>
                                        </div>
                                        <div class="mb-2"><strong>Payment Method:</strong> {{ order.payment_method }}
                                        </div>
                                        <div>
                                            <label for="status"
                                                class="block text-sm font-medium text-gray-700 dark:text-gray-300">Order
                                                Status</label>
                                            <Select id="status" v-model="orderForm.status" :options="orderStatusOptions"
                                                optionLabel="label" optionValue="value" placeholder="Select Status"
                                                class="w-full mt-1" :class="{ 'p-invalid': orderForm.errors.status }" />
                                            <small v-if="orderForm.errors.status" class="p-error">{{
                                                orderForm.errors.status }}</small>
                                        </div>
                                        <div>
                                            <label for="payment_status"
                                                class="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment
                                                Status</label>
                                            <Select id="payment_status" v-model="orderForm.payment_status"
                                                :options="paymentStatusOptions" optionLabel="label" optionValue="value"
                                                placeholder="Select Payment Status" class="w-full mt-1"
                                                :class="{ 'p-invalid': orderForm.errors.payment_status }" />
                                            <small v-if="orderForm.errors.payment_status" class="p-error">{{
                                                orderForm.errors.payment_status }}</small>
                                        </div>
                                        <div>
                                            <label for="transaction_id"
                                                class="block text-sm font-medium text-gray-700 dark:text-gray-300">Transaction
                                                ID</label>
                                            <InputText id="transaction_id" v-model="orderForm.transaction_id"
                                                class="w-full mt-1"
                                                :class="{ 'p-invalid': orderForm.errors.transaction_id }" />
                                            <small v-if="orderForm.errors.transaction_id" class="p-error">{{
                                                orderForm.errors.transaction_id }}</small>
                                        </div>
                                    </div>
                                </template>
                            </Card>

                            <Card>
                                <template #title>
                                    <div class="flex justify-between items-center">
                                        <span>Billing Details</span>
                                        <Button icon="pi pi-pencil" text rounded size="small"
                                            @click="toggleEditMode('billing')" aria-label="Edit Billing Details" />
                                    </div>
                                </template>
                                <template #content>
                                    <div v-if="!editModes.billing" class="space-y-1 text-sm">
                                        <p>{{ orderForm.billing_first_name }} {{ orderForm.billing_last_name }}</p>
                                        <p>{{ orderForm.billing_email }}</p>
                                        <p>{{ orderForm.billing_address }}</p>
                                        <p>{{ orderForm.billing_city }}, {{ orderForm.billing_state_or_county }} {{
                                            orderForm.billing_postal_code }}</p>
                                        <p>{{ getCountryName(orderForm.billing_country) }}</p>
                                        <p v-if="orderForm.billing_phone">Phone: {{ orderForm.billing_phone }}</p>
                                    </div>
                                    <div v-else class="space-y-4">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label for="billing_first_name">First Name</label>
                                                <InputText id="billing_first_name"
                                                    v-model="orderForm.billing_first_name" class="w-full"
                                                    :class="{ 'p-invalid': orderForm.errors.billing_first_name }" />
                                                <small v-if="orderForm.errors.billing_first_name" class="p-error">{{
                                                    orderForm.errors.billing_first_name }}</small>
                                            </div>
                                            <div>
                                                <label for="billing_last_name">Last Name</label>
                                                <InputText id="billing_last_name" v-model="orderForm.billing_last_name"
                                                    class="w-full"
                                                    :class="{ 'p-invalid': orderForm.errors.billing_last_name }" />
                                                <small v-if="orderForm.errors.billing_last_name" class="p-error">{{
                                                    orderForm.errors.billing_last_name }}</small>
                                            </div>
                                        </div>
                                        <div>
                                            <label for="billing_email">Email</label>
                                            <InputText id="billing_email" type="email" v-model="orderForm.billing_email"
                                                class="w-full"
                                                :class="{ 'p-invalid': orderForm.errors.billing_email }" />
                                            <small v-if="orderForm.errors.billing_email" class="p-error">{{
                                                orderForm.errors.billing_email }}</small>
                                        </div>
                                        <div>
                                            <label for="billing_address">Street Address</label>
                                            <InputText id="billing_address" v-model="orderForm.billing_address"
                                                class="w-full"
                                                :class="{ 'p-invalid': orderForm.errors.billing_address }" />
                                            <small v-if="orderForm.errors.billing_address" class="p-error">{{
                                                orderForm.errors.billing_address }}</small>
                                        </div>
                                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label for="billing_city">City</label>
                                                <InputText id="billing_city" v-model="orderForm.billing_city"
                                                    class="w-full"
                                                    :class="{ 'p-invalid': orderForm.errors.billing_city }" />
                                                <small v-if="orderForm.errors.billing_city" class="p-error">{{
                                                    orderForm.errors.billing_city }}</small>
                                            </div>
                                            <div>
                                                <label for="billing_state_or_county">State/County</label>
                                                <InputText id="billing_state_or_county"
                                                    v-model="orderForm.billing_state_or_county" class="w-full"
                                                    :class="{ 'p-invalid': orderForm.errors.billing_state_or_county }" />
                                                <small v-if="orderForm.errors.billing_state_or_county"
                                                    class="p-error">{{ orderForm.errors.billing_state_or_county
                                                    }}</small>
                                            </div>
                                            <div>
                                                <label for="billing_postal_code">Postal Code</label>
                                                <InputText id="billing_postal_code"
                                                    v-model="orderForm.billing_postal_code" class="w-full"
                                                    :class="{ 'p-invalid': orderForm.errors.billing_postal_code }" />
                                                <small v-if="orderForm.errors.billing_postal_code" class="p-error">{{
                                                    orderForm.errors.billing_postal_code }}</small>
                                            </div>
                                        </div>
                                        <div>
                                            <label for="billingCountryEdit"
                                                class="block font-medium mb-1">Country</label>
                                            <Select inputId="billingCountryEdit"
                                                v-model="orderForm.billing_country_object" :options="countries" filter
                                                optionLabel="name" placeholder="Select a country"
                                                :class="{ 'p-invalid': orderForm.errors.billing_country }"
                                                class="w-full" @change="onBillingCountryChange" dataKey="code">
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
                                            <small v-if="orderForm.errors.billing_country" class="p-error">{{
                                                orderForm.errors.billing_country }}</small>
                                        </div>
                                        <div>
                                            <label for="billing_phone">Phone</label>
                                            <InputText id="billing_phone" v-model="orderForm.billing_phone"
                                                class="w-full"
                                                :class="{ 'p-invalid': orderForm.errors.billing_phone }" />
                                            <small v-if="orderForm.errors.billing_phone" class="p-error">{{
                                                orderForm.errors.billing_phone }}</small>
                                        </div>
                                    </div>

                                    <div v-if="editModes.billing" class="mt-4 pt-4 border-t">
                                        <div class="flex items-center mb-3">
                                            <Checkbox inputId="wantsInvoiceEdit" v-model="orderForm.wants_invoice"
                                                :binary="true" />
                                            <label for="wantsInvoiceEdit" class="ml-2 font-medium">Requires Invoice
                                                Details</label>
                                        </div>
                                        <template v-if="orderForm.wants_invoice">
                                            <div class="space-y-4">
                                                <div>
                                                    <label for="invoice_company_name">Company Name</label>
                                                    <InputText id="invoice_company_name"
                                                        v-model="orderForm.invoice_company_name" class="w-full"
                                                        :class="{ 'p-invalid': orderForm.errors.invoice_company_name }" />
                                                    <small v-if="orderForm.errors.invoice_company_name"
                                                        class="p-error">{{ orderForm.errors.invoice_company_name
                                                        }}</small>
                                                </div>
                                                <div>
                                                    <label for="invoice_vat_number">VAT Number</label>
                                                    <InputText id="invoice_vat_number"
                                                        v-model="orderForm.invoice_vat_number" class="w-full"
                                                        :class="{ 'p-invalid': orderForm.errors.invoice_vat_number }" />
                                                    <small v-if="orderForm.errors.invoice_vat_number" class="p-error">{{
                                                        orderForm.errors.invoice_vat_number }}</small>
                                                </div>
                                                <div>
                                                    <label for="invoice_profession">Profession</label>
                                                    <InputText id="invoice_profession"
                                                        v-model="orderForm.invoice_profession" class="w-full"
                                                        :class="{ 'p-invalid': orderForm.errors.invoice_profession }" />
                                                    <small v-if="orderForm.errors.invoice_profession" class="p-error">{{
                                                        orderForm.errors.invoice_profession }}</small>
                                                </div>
                                                <div>
                                                    <label for="invoice_tax_office">Tax Office</label>
                                                    <InputText id="invoice_tax_office"
                                                        v-model="orderForm.invoice_tax_office" class="w-full"
                                                        :class="{ 'p-invalid': orderForm.errors.invoice_tax_office }" />
                                                    <small v-if="orderForm.errors.invoice_tax_office" class="p-error">{{
                                                        orderForm.errors.invoice_tax_office }}</small>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                    <div v-else-if="!editModes.billing && orderForm.wants_invoice"
                                        class="mt-4 pt-4 border-t space-y-1 text-sm">
                                        <h4 class="font-semibold mb-1">Invoice Details:</h4>
                                        <p v-if="orderForm.invoice_company_name">Company: {{
                                            orderForm.invoice_company_name }}</p>
                                        <p v-if="orderForm.invoice_vat_number">VAT: {{ orderForm.invoice_vat_number }}
                                        </p>
                                        <p v-if="orderForm.invoice_profession">Profession: {{
                                            orderForm.invoice_profession }}</p>
                                        <p v-if="orderForm.invoice_tax_office">Tax Office: {{
                                            orderForm.invoice_tax_office }}</p>
                                    </div>
                                </template>
                            </Card>

                            <Card>
                                <template #title>
                                    <div class="flex justify-between items-center">
                                        <span>Shipping Details</span>
                                        <Button icon="pi pi-pencil" text rounded size="small"
                                            @click="toggleEditMode('shipping')" aria-label="Edit Shipping Details" />
                                    </div>
                                </template>
                                <template #content>
                                    <div v-if="!editModes.shipping" class="space-y-1 text-sm">
                                        <p v-if="!orderForm.shipping_is_different"
                                            class="italic text-gray-500 dark:text-gray-400">Same as billing address.</p>
                                        <template v-else>
                                            <p>{{ orderForm.shipping_first_name }} {{ orderForm.shipping_last_name }}
                                            </p>
                                            <p v-if="orderForm.shipping_email">{{ orderForm.shipping_email }}</p>
                                            <p>{{ orderForm.shipping_address }}</p>
                                            <p>{{ orderForm.shipping_city }}, {{ orderForm.shipping_state_or_county }}
                                                {{ orderForm.shipping_postal_code }}</p>
                                            <p>{{ getCountryName(orderForm.shipping_country) }}</p>
                                            <p v-if="orderForm.shipping_phone">Phone: {{ orderForm.shipping_phone }}</p>
                                        </template>
                                    </div>
                                    <div v-else class="space-y-4">
                                        <div class="flex items-center">
                                            <Checkbox inputId="shippingIsDifferentEdit"
                                                v-model="orderForm.shipping_is_different" :binary="true" />
                                            <label for="shippingIsDifferentEdit" class="ml-2 font-medium">Ship to a
                                                different address</label>
                                        </div>
                                        <template v-if="orderForm.shipping_is_different">
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label for="shipping_first_name">First Name</label>
                                                    <InputText id="shipping_first_name"
                                                        v-model="orderForm.shipping_first_name" class="w-full"
                                                        :class="{ 'p-invalid': orderForm.errors.shipping_first_name }" />
                                                    <small v-if="orderForm.errors.shipping_first_name"
                                                        class="p-error">{{ orderForm.errors.shipping_first_name
                                                        }}</small>
                                                </div>
                                                <div>
                                                    <label for="shipping_last_name">Last Name</label>
                                                    <InputText id="shipping_last_name"
                                                        v-model="orderForm.shipping_last_name" class="w-full"
                                                        :class="{ 'p-invalid': orderForm.errors.shipping_last_name }" />
                                                    <small v-if="orderForm.errors.shipping_last_name" class="p-error">{{
                                                        orderForm.errors.shipping_last_name }}</small>
                                                </div>
                                            </div>
                                            <div>
                                                <label for="shipping_email">Email</label>
                                                <InputText id="shipping_email" type="email"
                                                    v-model="orderForm.shipping_email" class="w-full"
                                                    :class="{ 'p-invalid': orderForm.errors.shipping_email }" />
                                                <small v-if="orderForm.errors.shipping_email" class="p-error">{{
                                                    orderForm.errors.shipping_email }}</small>
                                            </div>
                                            <div>
                                                <label for="shipping_address">Street Address</label>
                                                <InputText id="shipping_address" v-model="orderForm.shipping_address"
                                                    class="w-full"
                                                    :class="{ 'p-invalid': orderForm.errors.shipping_address }" />
                                                <small v-if="orderForm.errors.shipping_address" class="p-error">{{
                                                    orderForm.errors.shipping_address }}</small>
                                            </div>
                                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label for="shipping_city">City</label>
                                                    <InputText id="shipping_city" v-model="orderForm.shipping_city"
                                                        class="w-full"
                                                        :class="{ 'p-invalid': orderForm.errors.shipping_city }" />
                                                    <small v-if="orderForm.errors.shipping_city" class="p-error">{{
                                                        orderForm.errors.shipping_city }}</small>
                                                </div>
                                                <div>
                                                    <label for="shipping_state_or_county">State/County</label>
                                                    <InputText id="shipping_state_or_county"
                                                        v-model="orderForm.shipping_state_or_county" class="w-full"
                                                        :class="{ 'p-invalid': orderForm.errors.shipping_state_or_county }" />
                                                    <small v-if="orderForm.errors.shipping_state_or_county"
                                                        class="p-error">{{ orderForm.errors.shipping_state_or_county
                                                        }}</small>
                                                </div>
                                                <div>
                                                    <label for="shipping_postal_code">Postal Code</label>
                                                    <InputText id="shipping_postal_code"
                                                        v-model="orderForm.shipping_postal_code" class="w-full"
                                                        :class="{ 'p-invalid': orderForm.errors.shipping_postal_code }" />
                                                    <small v-if="orderForm.errors.shipping_postal_code"
                                                        class="p-error">{{ orderForm.errors.shipping_postal_code
                                                        }}</small>
                                                </div>
                                            </div>
                                            <div>
                                                <label for="shippingCountryEdit"
                                                    class="block font-medium mb-1">Country</label>
                                                <Select inputId="shippingCountryEdit"
                                                    v-model="orderForm.shipping_country_object" :options="countries"
                                                    filter optionLabel="name" placeholder="Select a country"
                                                    :class="{ 'p-invalid': orderForm.errors.shipping_country }"
                                                    class="w-full" @change="onShippingCountryChange" dataKey="code">
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
                                                <small v-if="orderForm.errors.shipping_country" class="p-error">{{
                                                    orderForm.errors.shipping_country }}</small>
                                            </div>
                                            <div>
                                                <label for="shipping_phone">Phone</label>
                                                <InputText id="shipping_phone" v-model="orderForm.shipping_phone"
                                                    class="w-full"
                                                    :class="{ 'p-invalid': orderForm.errors.shipping_phone }" />
                                                <small v-if="orderForm.errors.shipping_phone" class="p-error">{{
                                                    orderForm.errors.shipping_phone }}</small>
                                            </div>
                                        </template>
                                    </div>
                                </template>
                            </Card>

                            <Card>
                                <template #title>Order Notes</template>
                                <template #content>
                                    <Textarea v-model="orderForm.notes" rows="4" class="w-full"
                                        placeholder="Admin notes for this order..."
                                        :class="{ 'p-invalid': orderForm.errors.notes }" />
                                    <small v-if="orderForm.errors.notes" class="p-error">{{ orderForm.errors.notes
                                        }}</small>
                                </template>
                            </Card>
                        </div>

                        <div class="md:col-span-1">
                            <Card>
                                <template #title>Order Items ({{ order.items.length }})</template>
                                <template #content>
                                    <div v-if="order.items && order.items.length > 0" class="space-y-4">
                                        <div v-for="item in order.items" :key="item.id"
                                            class="border-b pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
                                            <div class="font-semibold">{{ item.artwork_title || 'Artwork' }}</div>
                                            <div class="text-sm text-gray-600 dark:text-gray-400">
                                                ID: {{ item.artwork_id }} <br>
                                                Type: {{ item.type }}, Frame: {{ item.frame }}, Size: {{ item.size }}
                                                <br>
                                                Qty: {{ item.quantity }} x {{ formatCurrency(item.price) }}
                                            </div>
                                            <div class="text-sm font-medium">Subtotal: {{ formatCurrency(item.quantity *
                                                item.price) }}</div>
                                            <img v-if="item.artwork_data && item.artwork_data.img_thumb"
                                                :src="item.artwork_data.img_thumb" alt="Thumbnail"
                                                class="w-16 h-16 object-cover mt-2 rounded" />
                                        </div>
                                    </div>
                                    <p v-else>No items found for this order.</p>
                                </template>
                            </Card>
                        </div>
                    </div>

                    <div class="mt-8 flex justify-end space-x-3">
                        <Link :href="route('dashboard.orders.index')">
                            <Button label="Back to Orders" severity="secondary" outlined icon="pi pi-arrow-left" />
                        </Link>
                        <Button type="submit" label="Save All Changes" icon="pi pi-check"
                            :loading="orderForm.processing" />
                    </div>
                </form>
                <!-- <div v-if="$page.props.flash.success"
                    class="mt-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded">
                    {{ $page.props.flash.success }}
                </div>
                <div v-if="$page.props.flash.error"
                    class="mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded">
                    {{ $page.props.flash.error }}
                </div> -->
            </div>
        </Container>
    </AdminLayout>
</template>

<script setup>
import { defineProps, ref, reactive, computed, onMounted, watch } from 'vue';
import { Head as InertiaHead, useForm, Link, usePage } from '@inertiajs/vue3';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Container from '@/components/Container.vue';
import PageTitleSection from '@/components/PageTitleSection.vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Checkbox from 'primevue/checkbox';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
    order: Object,
});

const page = usePage();

const toast = useToast();

const editModes = reactive({
    billing: false,
    shipping: false,
});

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

const toggleEditMode = (section) => {
    editModes[section] = !editModes[section];
    if (!editModes[section]) { // If toggling OFF edit mode
        // Reset form fields for that section to original prop values
        // This discards any un-submitted changes in that section
        if (section === 'billing') {
            orderForm.billing_first_name = props.order.billing_first_name;
            orderForm.billing_last_name = props.order.billing_last_name;
            orderForm.billing_email = props.order.billing_email;
            orderForm.billing_address = props.order.billing_address;
            orderForm.billing_city = props.order.billing_city;
            orderForm.billing_state_or_county = props.order.billing_state_or_county;
            orderForm.billing_country = props.order.billing_country; // code
            orderForm.billing_postal_code = props.order.billing_postal_code;
            orderForm.billing_phone = props.order.billing_phone;
            orderForm.wants_invoice = props.order.wants_invoice;
            orderForm.invoice_company_name = props.order.invoice_company_name;
            orderForm.invoice_vat_number = props.order.invoice_vat_number;
            orderForm.invoice_tax_office = props.order.invoice_tax_office;
            orderForm.invoice_profession = props.order.invoice_profession;
            // Re-initialize the _object part
            orderForm.billing_country_object = countries.value.find(c => c.code === props.order.billing_country) || null;
        }
        if (section === 'shipping') {
            orderForm.shipping_is_different = props.order.shipping_is_different;
            orderForm.shipping_first_name = props.order.shipping_first_name;
            orderForm.shipping_last_name = props.order.shipping_last_name;
            orderForm.shipping_email = props.order.shipping_email;
            orderForm.shipping_address = props.order.shipping_address;
            orderForm.shipping_city = props.order.shipping_city;
            orderForm.shipping_state_or_county = props.order.shipping_state_or_county;
            orderForm.shipping_country = props.order.shipping_country; // code
            orderForm.shipping_postal_code = props.order.shipping_postal_code;
            orderForm.shipping_phone = props.order.shipping_phone;
            // Re-initialize the _object part
            orderForm.shipping_country_object = countries.value.find(c => c.code === props.order.shipping_country) || null;
        }
    }
};

const orderForm = useForm({
    _method: 'PUT',
    order_number: props.order.order_number, // For display, not usually editable
    status: props.order.status,
    payment_status: props.order.payment_status,
    notes: props.order.notes || '',
    transaction_id: props.order.transaction_id || '',

    billing_first_name: props.order.billing_first_name,
    billing_last_name: props.order.billing_last_name,
    billing_email: props.order.billing_email,
    billing_address: props.order.billing_address,
    billing_city: props.order.billing_city,
    billing_state_or_county: props.order.billing_state_or_county,
    billing_country: props.order.billing_country,       // Stores the CODE 'AT'
    billing_country_object: null,                     // Stores the { name: 'Austria', code: 'AT' }
    billing_postal_code: props.order.billing_postal_code,
    billing_phone: props.order.billing_phone,

    wants_invoice: props.order.wants_invoice,
    invoice_company_name: props.order.invoice_company_name,
    invoice_vat_number: props.order.invoice_vat_number,
    invoice_tax_office: props.order.invoice_tax_office,
    invoice_profession: props.order.invoice_profession,

    shipping_is_different: props.order.shipping_is_different,
    shipping_first_name: props.order.shipping_first_name,
    shipping_last_name: props.order.shipping_last_name,
    shipping_email: props.order.shipping_email,
    shipping_address: props.order.shipping_address,
    shipping_city: props.order.shipping_city,
    shipping_state_or_county: props.order.shipping_state_or_county,
    shipping_country: props.order.shipping_country,     // Stores the CODE 'AT'
    shipping_country_object: null,                   // Stores the { name: 'Austria', code: 'AT' }
    shipping_postal_code: props.order.shipping_postal_code,
    shipping_phone: props.order.shipping_phone,
});

const countries = ref([
    { name: 'Greece', code: 'GR' },
    { name: 'Austria', code: 'AT' }, { name: 'Belgium', code: 'BE' },
    { name: 'Bulgaria', code: 'BG' }, { name: 'Croatia', code: 'HR' },
    { name: 'Cyprus', code: 'CY' }, { name: 'Czech Republic', code: 'CZ' },
    { name: 'Denmark', code: 'DK' }, { name: 'Estonia', code: 'EE' },
    { name: 'Finland', code: 'FI' }, { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'Hungary', code: 'HU' }, { name: 'Ireland', code: 'IE' },
    { name: 'Italy', code: 'IT' }, { name: 'Latvia', code: 'LV' },
    { name: 'Lithuania', code: 'LT' }, { name: 'Luxembourg', code: 'LU' },
    { name: 'Malta', code: 'MT' }, { name: 'Netherlands', code: 'NL' },
    { name: 'Poland', code: 'PL' }, { name: 'Portugal', code: 'PT' },
    { name: 'Romania', code: 'RO' }, { name: 'Slovakia', code: 'SK' },
    { name: 'Slovenia', code: 'SI' }, { name: 'Spain', code: 'ES' },
    { name: 'Sweden', code: 'SE' }, { name: 'United Kingdom', code: 'GB' },
]);

const orderStatusOptions = ref([
    { label: 'Pending', value: 'pending' }, { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' }, { label: 'Delivered', value: 'delivered' },
    { label: 'Completed', value: 'completed' }, { label: 'Cancelled', value: 'cancelled' },
    { label: 'Refunded', value: 'refunded' },
]);
const paymentStatusOptions = ref([
    { label: 'Pending', value: 'pending' }, { label: 'Paid', value: 'paid' },
    { label: 'Failed', value: 'failed' }, { label: 'Refunded', value: 'refunded' },
]);

const getCountryName = (code) => {
    const country = countries.value.find(c => c.code === code);
    return country ? country.name : code;
};

const initializeCountryObjects = () => {
    // Initialize billing_country_object
    if (orderForm.billing_country) { // Use orderForm's current code
        orderForm.billing_country_object = countries.value.find(c => c.code === orderForm.billing_country) || null;
    } else {
        orderForm.billing_country_object = null;
    }

    // Initialize shipping_country_object
    if (orderForm.shipping_country) { // Use orderForm's current code
        orderForm.shipping_country_object = countries.value.find(c => c.code === orderForm.shipping_country) || null;
    } else {
        orderForm.shipping_country_object = null;
    }
};

onMounted(() => {
    initializeCountryObjects(); // This will run after orderForm is initialized with props.order values
});

const onBillingCountryChange = (event) => {
    if (event.value) {
        orderForm.billing_country = event.value.code;
        orderForm.billing_country_object = event.value; // This is already done by v-model on Select
    } else {
        orderForm.billing_country = null;
        orderForm.billing_country_object = null;
    }
    // If shipping is same as billing, update that too
    if (!orderForm.shipping_is_different) {
        orderForm.shipping_country = orderForm.billing_country;
        orderForm.shipping_country_object = orderForm.billing_country_object;
    }
};

const onShippingCountryChange = (event) => {
    if (event.value) {
        orderForm.shipping_country = event.value.code;
        orderForm.shipping_country_object = event.value; // Done by v-model
    } else {
        orderForm.shipping_country = null;
        orderForm.shipping_country_object = null;
    }
};


const formatCurrency = (value) => {
    if (typeof value !== 'number' && value !== null && value !== undefined) value = parseFloat(value);
    if (isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(value); // Adjust currency
};

const updateOrderDetails = () => {
    // The orderForm already contains all fields.
    // The controller's validation will determine what's actually updatable.
    console.log("Updating order details:", orderForm.data());

    orderForm.put(route('dashboard.orders.update', props.order.id), {
        preserveScroll: true,
        onSuccess: () => {
            Object.keys(editModes).forEach(key => editModes[key] = false); // Close all edit modes on success
            // Flash message is handled by controller's redirect
            // Re-initialize country objects in case data was re-fetched and props updated
            // though Inertia's prop update should trigger watchers if setup correctly,
            // but explicit re-init after form success might be safer if not using watchers for this.
            // However, since the controller redirects, the page reloads with fresh props.
        },
        onError: (errors) => {
            console.error("Order update failed:", errors);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Fill in all required fields.',
                life: 5000
            });
            // Errors will be displayed by the <small> tags
        }
    });
};

// Watch for changes in shipping_is_different to copy/clear shipping details
watch(() => orderForm.shipping_is_different, (isDifferent, oldIsDifferent) => {
    if (!isDifferent) {
        // Copy billing to shipping
        orderForm.shipping_first_name = orderForm.billing_first_name;
        orderForm.shipping_last_name = orderForm.billing_last_name;
        orderForm.shipping_email = orderForm.billing_email;
        orderForm.shipping_address = orderForm.billing_address;
        orderForm.shipping_city = orderForm.billing_city;
        orderForm.shipping_state_or_county = orderForm.billing_state_or_county;
        orderForm.shipping_country = orderForm.billing_country;
        orderForm.shipping_country_object = orderForm.billing_country_object; // Copy the object
        orderForm.shipping_postal_code = orderForm.billing_postal_code;
        orderForm.shipping_phone = orderForm.billing_phone;
    } else if (isDifferent && !oldIsDifferent && editModes.shipping) { // Only clear if actively switched to "different" in edit mode
        // Optionally clear shipping fields, or pre-fill from original props if needed
        orderForm.shipping_first_name = props.order.shipping_first_name || ''; // Reset to original or empty
        orderForm.shipping_last_name = props.order.shipping_last_name || '';
        orderForm.shipping_email = props.order.shipping_email || '';
        orderForm.shipping_address = props.order.shipping_address || '';
        orderForm.shipping_city = props.order.shipping_city || '';
        orderForm.shipping_state_or_county = props.order.shipping_state_or_county || '';
        orderForm.shipping_country = props.order.shipping_country || null;
        orderForm.shipping_country_object = countries.value.find(c => c.code === (props.order.shipping_country || '')) || null;
        orderForm.shipping_postal_code = props.order.shipping_postal_code || '';
        orderForm.shipping_phone = props.order.shipping_phone || '';
    }
});

// If an admin changes a billing field, and shipping_is_different is false,
// ensure the corresponding shipping field also updates.
Object.keys(orderForm.data()).forEach(key => {
    if (key.startsWith('billing_')) {
        watch(() => orderForm[key], (newValue) => {
            if (!orderForm.shipping_is_different) {
                const correspondingShippingKey = key.replace('billing_', 'shipping_');
                if (orderForm.hasOwnProperty(correspondingShippingKey)) {
                    orderForm[correspondingShippingKey] = newValue;
                    // Special handling for country object
                    if (key === 'billing_country') {
                        orderForm.shipping_country_object = countries.value.find(c => c.code === newValue) || null;
                    }
                }
            }
        });
    }
});

// If billing details change AND shipping is not different, update shipping
watch(() => ({ ...orderForm.billingInfo }), (newBilling) => { // Watch a copy of the object
    if (!orderForm.shipping_is_different) {
        orderForm.shipping_first_name = newBilling.first_name; // Adjust keys if billingInfo is nested
        orderForm.shipping_last_name = newBilling.last_name;
        // ... and so on for all shipping fields derived from billing
        orderForm.shipping_country = newBilling.country;
        orderForm.shipping_country_object = countries.value.find(c => c.code === newBilling.country) || null;

    }
}, { deep: true });


</script>

<style scoped>
/* Add any specific styles if needed */
/* label {
    @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}

.p-card .p-card-title {
    /* Ensure title has good spacing if edit icon is added 
    @apply flex justify-between items-center;
} */
</style>