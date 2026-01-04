<template>
    <UserLayout>
        <Head title="Addresses" />

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-6">My Addresses</h2>

            <div class="grid md:grid-cols-2 gap-6">
                <div class="border border-indigo-100 bg-indigo-50/50 rounded-xl p-5 relative">
                    <div class="absolute top-4 right-4">
                        <Tag value="Default Billing" severity="info" />
                    </div>
                    
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <i class="pi pi-home"></i>
                        </div>
                        <span class="font-bold text-gray-800">{{ user.company_name || 'My Company' }}</span>
                    </div>

                    <div class="text-sm text-gray-600 space-y-1.5 pl-1">
                        <p class="font-medium text-gray-900">{{ user.name }}</p>
                        <p>{{ user.address }}</p>
                        <p>{{ user.postal_code }} {{ user.city }}</p>
                        <p>{{ user.country }}</p>
                        <div class="flex items-center gap-2 mt-3 pt-3 border-t border-indigo-100 text-gray-500">
                            <i class="pi pi-phone text-xs"></i> {{ user.phone }}
                        </div>
                    </div>

                    <div class="mt-6">
                         <Link :href="route('account.profile.edit')" class="text-sm text-indigo-600 font-semibold hover:underline">
                            Edit details in Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </UserLayout>
</template>

<script setup>
import UserLayout from '@/layouts/UserLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import Tag from 'primevue/tag';

defineProps({ user: Object });
</script>