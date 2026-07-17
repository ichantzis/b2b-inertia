<template>
    <form @submit.prevent="submit">
        <div class="space-y-6">
            <div>
                <h3 class="text-lg font-medium text-gray-900 mb-3">Account Details</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="name" class="block text-sm font-medium mb-1">Full Name</label>
                        <InputText id="name" v-model="form.name" class="w-full"
                            :class="{ 'p-invalid': form.errors.name }" />
                        <small v-if="form.errors.name" class="p-error">{{ form.errors.name }}</small>
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium mb-1">Email</label>
                        <InputText id="email" type="email" v-model="form.email" class="w-full"
                            :class="{ 'p-invalid': form.errors.email }" />
                        <small v-if="form.errors.email" class="p-error">{{ form.errors.email }}</small>
                    </div>

                    <div>
                        <label for="role" class="block text-sm font-medium mb-1">Role</label>
                        <Select id="role" v-model="form.role" :options="roleOptions" optionLabel="label"
                            optionValue="value" placeholder="Select Role" class="w-full"
                            :class="{ 'p-invalid': form.errors.role }" />
                        <small v-if="form.errors.role" class="p-error">{{ form.errors.role }}</small>
                    </div>

                    <div>
                        <label for="pricing_tier_id" class="block text-sm font-medium mb-1">Pricing Tier</label>
                        <Select id="pricing_tier_id" v-model="form.pricing_tier_id" :options="tierOptions" optionLabel="label"
                            optionValue="value" placeholder="Select Pricing Tier" class="w-full"
                            :class="{ 'p-invalid': form.errors.pricing_tier_id }" />
                        <small v-if="form.errors.pricing_tier_id" class="p-error">{{ form.errors.pricing_tier_id }}</small>
                    </div>

                    <div>
                        <label for="phone" class="block text-sm font-medium mb-1">Phone</label>
                        <InputText id="phone" v-model="form.phone" class="w-full"
                            :class="{ 'p-invalid': form.errors.phone }" />
                        <small v-if="form.errors.phone" class="p-error">{{ form.errors.phone }}</small>
                    </div>
                </div>


                <Divider />
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ isEditMode ? 'Leave password fields blank to keep current password.' : 'Set a password for the new user.A password reset link will be sent to the user' }}
                    </p>
                    <label for="password" class="block text-sm font-medium mb-1">
                        {{ isEditMode ? 'New Password (Optional)' : 'Password' }}
                    </label>
                    <Password id="password" v-model="form.password" class="w-full"
                        :inputProps="{ autocomplete: 'new-password' }" :class="{ 'p-invalid': form.errors.password }"
                        toggleMask :feedback="!isEditMode" />
                    <small v-if="form.errors.password" class="p-error">{{ form.errors.password }}</small>
                </div>

                <div>
                    <label for="password_confirmation" class="block text-sm font-medium mb-1">Confirm Password</label>
                    <Password id="password_confirmation" v-model="form.password_confirmation" class="w-full"
                        :inputProps="{ autocomplete: 'new-password' }" :feedback="false" toggleMask
                        :class="{ 'p-invalid': form.errors.password_confirmation }" />
                </div>

            </div>

            <Divider />

            <div>
                <h3 class="text-lg font-medium text-gray-900 mb-3">Billing & Address</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label for="company_name" class="block text-sm font-medium mb-1">Company Name</label>
                        <InputText id="company_name" v-model="form.company_name" class="w-full"
                            :class="{ 'p-invalid': form.errors.company_name }" />
                        <small v-if="form.errors.company_name" class="p-error">{{ form.errors.company_name }}</small>
                    </div>
                    <div>
                        <label for="profession" class="block text-sm font-medium mb-1">Profession</label>
                        <InputText id="profession" v-model="form.profession" class="w-full"
                            :class="{ 'p-invalid': form.errors.profession }" />
                        <small v-if="form.errors.profession" class="p-error">{{ form.errors.profession }}</small>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label for="vat_number" class="block text-sm font-medium mb-1">VAT Number (AFM)</label>
                        <InputText id="vat_number" v-model="form.vat_number" class="w-full"
                            :class="{ 'p-invalid': form.errors.vat_number }" />
                        <small v-if="form.errors.vat_number" class="p-error">{{ form.errors.vat_number }}</small>
                    </div>
                    <div>
                        <label for="tax_office" class="block text-sm font-medium mb-1">Tax Office (DOY)</label>
                        <InputText id="tax_office" v-model="form.tax_office" class="w-full"
                            :class="{ 'p-invalid': form.errors.tax_office }" />
                        <small v-if="form.errors.tax_office" class="p-error">{{ form.errors.tax_office }}</small>
                    </div>
                </div>

                <div>
                    <label for="address" class="block text-sm font-medium mb-1">Street Address</label>
                    <InputText id="address" v-model="form.address" class="w-full"
                        :class="{ 'p-invalid': form.errors.address }" />
                    <small v-if="form.errors.address" class="p-error">{{ form.errors.address }}</small>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                        <label for="city" class="block text-sm font-medium mb-1">City</label>
                        <InputText id="city" v-model="form.city" class="w-full"
                            :class="{ 'p-invalid': form.errors.city }" />
                        <small v-if="form.errors.city" class="p-error">{{ form.errors.city }}</small>
                    </div>
                    <div>
                        <label for="postal_code" class="block text-sm font-medium mb-1">Postal Code</label>
                        <InputText id="postal_code" v-model="form.postal_code" class="w-full"
                            :class="{ 'p-invalid': form.errors.postal_code }" />
                        <small v-if="form.errors.postal_code" class="p-error">{{ form.errors.postal_code }}</small>
                    </div>

                    <div>
                        <label for="country" class="block text-sm font-medium mb-1">Country</label>
                        <Select inputId="country" v-model="form.country_object" :options="countries" filter
                            optionLabel="name" placeholder="Select Country" class="w-full"
                            :class="{ 'p-invalid': form.errors.country }" @change="onCountryChange" dataKey="code">
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
                        <small v-if="form.errors.country" class="p-error">{{ form.errors.country }}</small>
                    </div>
                </div>
            </div>

            <div class="flex justify-end space-x-3 mt-8">
                <Link :href="route('dashboard.users.index')">
                    <Button label="Cancel" severity="secondary" outlined icon="pi pi-times" type="button" />
                </Link>
                <Button type="submit" :label="submitLabel" icon="pi pi-check" :loading="form.processing" />
            </div>
        </div>
    </form>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import { useForm, Link } from '@inertiajs/vue3';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import { useCountries } from '@/composables/useCountries';

const props = defineProps({
    user: {
        type: Object,
        default: () => ({}),
    },
    userRoles: {
        type: Array,
        required: true,
    },
    pricingTiers: { 
        type: Array, 
        default: () => [] 
    },
    // The specific Inertia URL to submit to
    action: {
        type: String,
        required: true,
    },
    // 'post' or 'put'
    method: {
        type: String,
        default: 'post',
    }
});

const { countries } = useCountries();

const isEditMode = computed(() => props.method.toLowerCase() === 'put');
const submitLabel = computed(() => isEditMode.value ? 'Update User' : 'Create User');

//Default to 'GR' if props.user.country is empty
const defaultCountryCode = 'GR';
const userCountryCode = props.user?.country || defaultCountryCode;

// Find the object. If userCountryCode is 'GR', this finds the Greece object.
const savedCountry = countries.value.find(c => c.code === userCountryCode) || countries.value.find(c => c.code === defaultCountryCode);

const form = useForm({
    name: props.user?.name || '',
    email: props.user?.email || '',
    role: props.user?.role || (props.userRoles.includes('customer') ? 'customer' : props.userRoles[0]),
    pricing_tier_id: props.user?.pricing_tier_id ?? 0,
    password: '',
    password_confirmation: '',

    // Contact Info
    phone: props.user?.phone || '',

    // Billing Info
    company_name: props.user?.company_name || '',
    profession: props.user?.profession || '',
    vat_number: props.user?.vat_number || '',
    tax_office: props.user?.tax_office || '',

    // Address Info
    address: props.user?.address || '',
    city: props.user?.city || '',
    postal_code: props.user?.postal_code || '',
    country: props.user?.country || '',
    country_object: savedCountry, // Bind to Select
});

const roleOptions = computed(() =>
    props.userRoles.map(role => ({ label: role.charAt(0).toUpperCase() + role.slice(1), value: role }))
);

const tierOptions = computed(() => {
    const options = props.pricingTiers.map(tier => ({
        label: `${tier.name} (${tier.discount_percentage}% OFF)`,
        value: tier.id
    }));
    
    options.unshift({ label: 'Default Pricing (0% OFF)', value: 0 });
    
    return options;
});

const onCountryChange = () => {
    form.country = form.country_object?.code || '';
};

const submit = () => {
    // Sync country one last time
    form.country = form.country_object?.code || '';

    // If in edit mode and password is blank, remove it so it doesn't try to update
    if (isEditMode.value && !form.password) {
        // We can't delete from form object easily, but Inertia ignores fields if we use transform
        // Simpler approach: The backend handles nullable password logic.
    }

    form.transform((data) => ({
        ...data,
        pricing_tier_id: data.pricing_tier_id === 0 ? null : data.pricing_tier_id
    })).submit(props.method, props.action, {
        onSuccess: () => {
            if (!isEditMode.value) form.reset();
        }
    });
};
</script>