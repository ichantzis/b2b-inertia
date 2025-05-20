<template>
    <AdminLayout>
        <template #header-title>Create New User</template>
        <InertiaHead title="Admin - Create User" />
        <Container>
            <div class="max-w-2xl mx-auto">
                <h1 class="text-2xl font-semibold mb-6">Create New User</h1>
                <Card>
                    <template #content>
                        <UserForm :user-roles="userRoles" @submit="submitForm" />
                    </template>
                </Card>
            </div>
        </Container>
    </AdminLayout>
</template>

<script setup>
import { defineProps } from 'vue';
import { Head as InertiaHead, router } from '@inertiajs/vue3';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Container from '@/components/Container.vue';
import Card from 'primevue/card';
import UserForm from './Partials/UserForm.vue'; // We will create this next

const props = defineProps({
    userRoles: Array,
});

const submitForm = (formData) => {
    router.post(route('dashboard.users.store'), formData, {
        onError: (errors) => {
            console.error("Error creating user:", errors);
            // Form component should display errors
        },
        onSuccess: () => {
            // Toast will be shown via AdminLayout based on flash message
        }
    });
};
</script>