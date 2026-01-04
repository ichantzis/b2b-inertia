<script setup>
import { useForm, usePage } from '@inertiajs/vue3';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';
import { useToast } from 'primevue/usetoast';
import { defineProps, ref, computed } from 'vue';

const props = defineProps({
    user: Object,
});

const toast = useToast();

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
    { name: 'Sweden', code: 'SE' },
]);

// Helper to match the saved code (string) to the object required by Select
const savedCountry = countries.value.find(c => c.code === props.user.country);

const form = useForm({
    company_name: props.user.company_name || '',
    profession: props.user.profession || '',
    vat_number: props.user.vat_number || '',
    tax_office: props.user.tax_office || '',
    address: props.user.address || '',
    city: props.user.city || '',
    postal_code: props.user.postal_code || '',
    country_object: savedCountry || null, // Binds to the dropdown object
    country: props.user.country || '',          // Binds to the string (sent to DB)
    phone: props.user.phone || '',
});

// Update the string value immediately when selection changes
const onCountryChange = () => {
    form.country = form.country_object?.code || '';
};

const submit = () => {
    // Ensure sync one last time before submit (redundant but safe)
    form.country = form.country_object?.code || '';

    form.patch(route('account.profile.update.address'), {
        preserveScroll: true,
        onSuccess: () => {
            toast.add({ severity: 'success', summary: 'Saved', detail: 'Address details updated.', life: 3000 });
        },
    });
};
</script>

<template>
    <section>
        <form @submit.prevent="submit" class="space-y-6">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block font-medium text-sm text-gray-700">Company Name</label>
                    <InputText v-model="form.company_name" class="w-full mt-1" />
                </div>
                <div>
                    <label class="block font-medium text-sm text-gray-700">Profession</label>
                    <InputText v-model="form.profession" class="w-full mt-1" />
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block font-medium text-sm text-gray-700">VAT Number (AFM)</label>
                    <InputText v-model="form.vat_number" class="w-full mt-1" />
                </div>
                <div>
                    <label class="block font-medium text-sm text-gray-700">Tax Office (DOY)</label>
                    <InputText v-model="form.tax_office" class="w-full mt-1" />
                </div>
            </div>

            <div>
                <label class="block font-medium text-sm text-gray-700">Phone</label>
                <InputText v-model="form.phone" class="w-full mt-1" />
            </div>

            <div>
                <label class="block font-medium text-sm text-gray-700">Address</label>
                <InputText v-model="form.address" class="w-full mt-1" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block font-medium text-sm text-gray-700">City</label>
                    <InputText v-model="form.city" class="w-full mt-1" />
                </div>
                <div>
                    <label class="block font-medium text-sm text-gray-700">Postal Code</label>
                    <InputText v-model="form.postal_code" class="w-full mt-1" />
                </div>

                <div>
                    <label class="block font-medium text-sm text-gray-700">Country</label>
                    <Select inputId="addressCountry" v-model="form.country_object" :options="countries" filter
                        optionLabel="name" placeholder="Select a country" :class="{ 'p-invalid': form.errors.country }"
                        class="w-full mt-1" @change="onCountryChange" dataKey="code">
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
                    <small class="text-red-500" v-if="form.errors.country">{{ form.errors.country }}</small>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <Button label="Save" type="submit" :loading="form.processing" />
                <Transition enter-active-class="transition ease-in-out" enter-from-class="opacity-0"
                    leave-active-class="transition ease-in-out" leave-to-class="opacity-0">
                    <p v-if="form.recentlySuccessful" class="text-sm text-gray-600">Saved.</p>
                </Transition>
            </div>
        </form>
    </section>
</template>