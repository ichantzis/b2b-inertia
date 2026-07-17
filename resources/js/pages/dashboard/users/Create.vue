<template>
    <AdminLayout>
        <template #header-title>Create New User</template>
        <InertiaHead title="Admin - Create User" />
        <Container>
            <div class="max-w-4xl mx-auto">
                <div class="flex items-center justify-between mb-6">
                    <h1 class="text-2xl font-semibold text-gray-800">Create New User</h1>
                </div>
                
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <UserForm 
                        :user-roles="userRoles" 
                        :pricing-tiers="pricingTiers"
                        :action="route('dashboard.users.store')"
                        method="post"
                    />
                </div>
            </div>
        </Container>
    </AdminLayout>
</template>

<script setup>
import { defineProps } from 'vue';
import { Head as InertiaHead } from '@inertiajs/vue3';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Container from '@/components/Container.vue';
import UserForm from './Partials/UserForm.vue';

defineProps({
    userRoles: Array,
    pricingTiers: Array, // Προσθέτουμε ΜΟΝΟ τα tiers εδώ, όχι το user
});
</script>