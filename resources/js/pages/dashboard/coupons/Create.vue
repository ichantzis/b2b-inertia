<template>
    <AdminLayout>

        <Head title="Create Coupon" />
        <Container>
            <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h1 class="text-2xl font-bold mb-6">Create Coupon</h1>

                <form @submit.prevent="form.post(route('dashboard.coupons.store'))" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Code</label>
                        <InputText v-model="form.code" class="w-full uppercase" placeholder="e.g. SUMMER2024"
                            @input="form.code = $event.target.value.toUpperCase()" />
                        <small class="text-red-500">{{ form.errors.code }}</small>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Type</label>
                            <Select v-model="form.type" :options="types" optionLabel="label" optionValue="value"
                                class="w-full" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Value</label>
                            <InputText v-model="form.value" type="number" step="0.01" class="w-full" />
                            <small class="text-gray-500" v-if="form.type === 'percent'">Enter percentage (e.g. 15 for
                                15%)</small>
                            <small class="text-gray-500" v-else>Enter amount (e.g. 10 for 10€)</small>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Usage Limit (Optional)</label>
                            <InputText v-model="form.usage_limit" type="number" class="w-full" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Expiry Date (Optional)</label>
                            <InputText type="date" v-model="form.expires_at" class="w-full" />
                        </div>
                    </div>

                    <div class="flex justify-end pt-4">
                        <Button type="submit" label="Create Coupon" icon="pi pi-check" :loading="form.processing" />
                    </div>
                </form>
            </div>
        </Container>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import Container from '@/components/Container.vue'; // Check your path
import { useForm, Head } from '@inertiajs/vue3';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from 'primevue/button';

const form = useForm({
    code: ''.toUpperCase(),
    type: 'fixed',
    value: '',
    usage_limit: '',
    expires_at: ''
});

const types = [
    { label: 'Fixed Amount (€)', value: 'fixed' },
    { label: 'Percentage (%)', value: 'percent' }
];
</script>