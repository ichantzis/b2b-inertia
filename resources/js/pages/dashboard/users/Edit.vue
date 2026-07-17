<template>
    <AdminLayout>
        <template #header-title>Edit User</template>
        <InertiaHead :title="`Admin - Edit ${user.name}`" />
        <Container>
            <div class="max-w-4xl mx-auto">
                <div class="flex items-center justify-between mb-6">
                    <h1 class="text-2xl font-semibold text-gray-800">Edit User: {{ user.name }}</h1>
                </div>
                
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <UserForm 
                        :user="user"
                        :user-roles="userRoles" 
                        :pricing-tiers="pricingTiers" 
                        :action="route('dashboard.users.update', user.id)"
                        method="put"
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
    user: Object,
    userRoles: Array,
    pricingTiers: Array,
});
</script>