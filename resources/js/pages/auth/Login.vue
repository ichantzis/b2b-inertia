<script setup>
import { ref, useTemplateRef, onMounted } from 'vue';
import { useForm, usePage } from '@inertiajs/vue3';
import GuestLayout from '@/layouts/GuestLayout.vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

defineProps({
    canResetPassword: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});

const page = usePage();
const allowRegistration = page.props.config?.allow_registration;

const emailInput = useTemplateRef('email-input');

// European countries list
const countries = ref([
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
    { name: 'Greece', code: 'GR' },
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

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const submit = () => {
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
    });
};

// Request Access Logic
const showRequestModal = ref(false);
const requestForm = useForm({
    name: '',
    company_name: '',
    email: '',
    phone: '',
    message: '',
    country_object: null, // Binds to the dropdown object
    country: ''           // Binds to the string code (sent to backend)
});

// Sync Dropdown Object with String Code
const onCountryChange = () => {
    requestForm.country = requestForm.country_object?.code || '';
};

const submitRequest = () => {
    requestForm.post(route('access.request'), {
        onSuccess: () => {
            showRequestModal.value = false;
            requestForm.reset();
            // Toast will be handled globally by flash message or add manual toast here
        }
    });
};

onMounted(() => {
    emailInput.value.$el.focus();
});
</script>

<template>
    <GuestLayout>
        <InertiaHead title="Log in" />

        <template v-if="status" #message>
            <Message severity="success" :closable="false" class="shadow-sm">
                {{ status }}
            </Message>
        </template>

        <form class="space-y-6" @submit.prevent="submit">
            <div class="flex flex-col gap-2">
                <label for="email">Email</label>
                <InputText id="email" ref="email-input" v-model="form.email" type="email" required fluid
                    :invalid="Boolean(form.errors.email)" autocomplete="username" />
                <Message v-if="form.errors?.email" severity="error" variant="simple" size="small">
                    {{ form.errors?.email }}
                </Message>
            </div>

            <div class="flex flex-col gap-2">
                <label for="password">Password</label>
                <InputText id="password" v-model="form.password" type="password" required fluid
                    :invalid="Boolean(form.errors.password)" autocomplete="current-password" />
                <Message v-if="form.errors?.password" severity="error" variant="simple" size="small">
                    {{ form.errors?.password }}
                </Message>
            </div>

            <div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <Checkbox id="remember" v-model="form.remember" class="mr-2" :binary="true"></Checkbox>
                        <label for="remember">Remember me</label>
                    </div>
                </div>
            </div>

            <div class="flex justify-end items-center pt-2">
                <InertiaLink v-if="canResetPassword" :href="route('password.request')"
                    class="mr-4 underline text-muted-color hover:text-color">
                    Forgot your password?
                </InertiaLink>
                <Button :loading="form.processing" type="submit" label="Log In" />
            </div>
            <div class="flex justify-end items-center pt-2">
                <InertiaLink v-if="allowRegistration" :href="route('register')"
                    class="underline text-muted-color hover:text-color">
                    Or create an account
                </InertiaLink>

                <div v-else class="text-sm text-gray-600">
                    <span>New B2B Customer? </span>
                    <button type="button" @click="showRequestModal = true"
                        class="underline text-muted-color hover:text-color cursor-pointer">
                        Request Access
                    </button>
                </div>

                <Dialog v-model:visible="showRequestModal" modal header="Request B2B Access"
                    :style="{ width: '90vw', maxWidth: '500px' }">
                    <p class="text-gray-600 mb-4 text-sm">
                        Please fill in your company details. Our team will review your request and create an account for
                        you.
                    </p>

                    <form @submit.prevent="submitRequest" class="flex flex-col gap-3">

                        <div class="flex flex-col gap-1">
                            <label class="font-medium text-sm">Company Name</label>
                            <InputText v-model="requestForm.company_name" class="w-full"
                                :class="{ 'p-invalid': requestForm.errors.company_name }" />
                            <small class="text-red-500" v-if="requestForm.errors.company_name">{{
                                requestForm.errors.company_name }}</small>
                        </div>

                        <div class="flex flex-col gap-1">
                            <label for="reqCountry" class="font-medium text-sm">Country</label>
                            <Select inputId="reqCountry" v-model="requestForm.country_object" :options="countries"
                                filter optionLabel="name" placeholder="Select a country"
                                :class="{ 'p-invalid': requestForm.errors.country }" class="w-full"
                                @change="onCountryChange" dataKey="code">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex items-center">
                                        <span v-if="slotProps.value.code"
                                            :class="`fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`"
                                            style="font-size: 1.2rem;"></span>
                                        <div>{{ slotProps.value.name }}</div>
                                    </div>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <template #option="slotProps">
                                    <div class="flex items-center">
                                        <span v-if="slotProps.option.code"
                                            :class="`fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`"
                                            style="font-size: 1.2rem;"></span>
                                        <div>{{ slotProps.option.name }}</div>
                                    </div>
                                </template>
                            </Select>
                            <small class="text-red-500" v-if="requestForm.errors.country">{{ requestForm.errors.country
                                }}</small>
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="font-medium text-sm">Contact Person</label>
                            <InputText v-model="requestForm.name" class="w-full"
                                :class="{ 'p-invalid': requestForm.errors.name }" />
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="font-medium text-sm">Email</label>
                            <InputText type="email" v-model="requestForm.email" class="w-full"
                                :class="{ 'p-invalid': requestForm.errors.email }" />
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="font-medium text-sm">Phone</label>
                            <InputText v-model="requestForm.phone" class="w-full"
                                :class="{ 'p-invalid': requestForm.errors.phone }" />
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="font-medium text-sm">VAT / Details</label>
                            <Textarea v-model="requestForm.message" rows="3" class="w-full"
                                placeholder="VAT Number or other details..." />
                        </div>

                        <div class="flex justify-end gap-2 mt-2">
                            <Button label="Cancel" text severity="secondary" @click="showRequestModal = false" />
                            <Button label="Send Request" type="submit" :loading="requestForm.processing" />
                        </div>

                    </form>
                </Dialog>

            </div>
        </form>
    </GuestLayout>
</template>
