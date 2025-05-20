<template>
    <AdminLayout>
        <template #header-title>Edit User: {{ user.name }}</template>
        <InertiaHead :title="`Admin - Edit User ${user.name}`" />
        <Container>
             <div class="max-w-2xl mx-auto">
                <h1 class="text-2xl font-semibold mb-6">Edit User: <span class="font-normal">{{ user.name }}</span></h1>
                <Card>
                    <template #content>
                        <UserForm :user="user" :user-roles="userRoles" @submit="submitForm" :is-edit-mode="true" />
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
import UserForm from './Partials/UserForm.vue'; // Reusable form component

const props = defineProps({
    user: Object,
    userRoles: Array,
});

const submitForm = (formData) => {
    router.put(route('dashboard.users.update', props.user.id), formData, {
        onError: (errors) => {
            console.error("Error updating user:", errors);
        },
        onSuccess: () => {
            // Toast handled by AdminLayout
        }
    });
};
</script>