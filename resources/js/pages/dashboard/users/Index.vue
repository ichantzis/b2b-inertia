<template>
    <AdminLayout>
        <template #header-title>Manage Users</template>
        <InertiaHead title="Admin - Users" />
        <Container>
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-semibold">Users</h1>
                <Link :href="route('dashboard.users.create')">
                    <Button label="Create User" icon="pi pi-plus" />
                </Link>
            </div>

            <Card class="mb-4">
                <template #content>
                    <!-- Αλλαγή grid-cols-3 σε grid-cols-1 md:grid-cols-4 για να χωρέσει το νέο φίλτρο -->
                    <form @submit.prevent="applyFilters" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4">
                        <div>
                            <label for="search" class="block text-sm font-medium mb-1">Search</label>
                            <InputText v-model="filterForm.search" id="search" placeholder="Name or Email"
                                class="w-full" />
                        </div>
                        <div>
                            <label for="role" class="block text-sm font-medium mb-1">Role</label>
                            <Select v-model="filterForm.role" :options="roleOptions" optionLabel="label"
                                optionValue="value" placeholder="All Roles" id="role" class="w-full" showClear />
                        </div>
                        <!-- ΝΕΟ ΠΕΔΙΟ ΦΙΛΤΡΟΥ: Pricing Tier -->
                        <div>
                            <label for="tier" class="block text-sm font-medium mb-1">Pricing Tier</label>
                            <Select v-model="filterForm.pricing_tier_id" :options="tierOptions" optionLabel="label"
                                optionValue="value" placeholder="All Tiers" id="tier" class="w-full" showClear />
                        </div>
                        <div class="flex space-x-2">
                            <Button type="submit" label="Filter" icon="pi pi-filter" />
                            <Button type="button" label="Clear" icon="pi pi-times" outlined @click="clearFilters" />
                        </div>
                    </form>

                    <DataTable :value="users.data" responsiveLayout="scroll" paginator :rows="users.per_page"
                        :totalRecords="users.total" @page="onPage">
                        <Column field="name" header="Name" sortable />
                        <Column field="email" header="Email" sortable />
                        <Column field="role" header="Role" sortable>
                            <template #body="slotProps">
                                <Tag :value="slotProps.data.role" :severity="getRoleSeverity(slotProps.data.role)"
                                    class="capitalize" />
                            </template>
                        </Column>
                        <!-- ΝΕΑ ΣΤΗΛΗ ΓΙΑ ΤΟΝ ΠΙΝΑΚΑ -->
                        <Column header="Pricing Tier" sortable>
                            <template #body="slotProps">
                                <Tag v-if="slotProps.data.pricing_tier" 
                                     :value="`${slotProps.data.pricing_tier.name} (${slotProps.data.pricing_tier.discount_percentage}%)`" 
                                     severity="success" 
                                     class="font-bold text-xs" />
                                <span v-else class="text-gray-400 text-xs font-semibold">Default (0%)</span>
                            </template>
                        </Column>
                        <Column field="created_at" header="Joined" sortable>
                            <template #body="slotProps">
                                {{ formatDate(slotProps.data.created_at) }}
                            </template>
                        </Column>
                        <Column header="Actions">
                            <template #body="slotProps">
                                <Link :href="route('dashboard.users.edit', slotProps.data.id)">
                                    <Button icon="pi pi-pencil" class="p-button-sm p-button-text p-button-info mr-2" />
                                </Link>
                                <Button icon="pi pi-trash" class="p-button-sm p-button-text p-button-danger"
                                    @click="confirmDeleteUser(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>
                    <div v-if="users.links.length > 3" class="mt-4 flex justify-center space-x-1">
                        <Link v-for="(link, k) in users.links" :key="k" class="px-3 py-2 text-sm rounded-md"
                            :class="{ 'bg-primary-500 text-white': link.active, 'hover:bg-gray-200 dark:hover:bg-gray-700': !link.active, 'text-gray-400 cursor-not-allowed': !link.url }"
                            :href="link.url || '#'" v-html="link.label" :as="link.url ? 'a' : 'span'" preserve-scroll
                            preserve-state />
                    </div>
                </template>
            </Card>
        </Container>

        <ConfirmDialog group="deleteUserConfirmation"></ConfirmDialog>
    </AdminLayout>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import { Head as InertiaHead, Link, router, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Container from '@/components/Container.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';

const props = defineProps({
    users: Object,
    filters: Object,
    userRoles: Array,
    pricingTiers: Array, // ΝΕΟ PROP
});

const confirm = useConfirm();

const filterForm = useForm({
    search: props.filters?.search || null,
    role: props.filters?.role || null,
    pricing_tier_id: props.filters?.pricing_tier_id || null, // ΝΕΟ ΠΕΔΙΟ ΣΤΗ ΦΟΡΜΑ
});

const roleOptions = ref(
    props.userRoles.map(role => ({ label: role.charAt(0).toUpperCase() + role.slice(1), value: role }))
);

// Υπολογισμός των επιλογών για το φίλτρο των Tiers
const tierOptions = computed(() => {
    const options = props.pricingTiers ? props.pricingTiers.map(tier => ({
        label: `${tier.name} (${tier.discount_percentage}%)`,
        value: tier.id
    })) : [];
    
    // Προσθήκη επιλογής για τους χρήστες με "Default" τιμολόγηση
    // Χρησιμοποιούμε τη συμβολοσειρά 'default' για να το ξεχωρίσουμε στο backend
    options.unshift({ label: 'Default Pricing (0%)', value: 'default' });
    
    return options;
});

const applyFilters = () => {
    router.get(route('dashboard.users.index'), filterForm.data(), {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
};

const clearFilters = () => {
    filterForm.reset();
    applyFilters();
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
};

const getRoleSeverity = (role) => {
    if (role === 'admin') return 'danger';
    return 'info';
};

const onPage = (event) => {
    router.get(route('dashboard.users.index'), {
        page: event.page + 1,
        search: filterForm.search,
        role: filterForm.role,
        pricing_tier_id: filterForm.pricing_tier_id, // Στέλνουμε και το tier στο pagination
    }, {
        preserveState: true,
        preserveScroll: false,
        replace: true,
    });
};

const confirmDeleteUser = (user) => {
    confirm.require({
        group: 'deleteUserConfirmation',
        message: `Are you sure you want to delete user "${user.name}"? This action cannot be undone.`,
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => {
            router.delete(route('dashboard.users.destroy', user.id), {
                preserveScroll: true,
                onSuccess: () => {},
                onError: (errors) => {
                    console.error("Error deleting user:", errors);
                }
            });
        },
        reject: () => {}
    });
};
</script>