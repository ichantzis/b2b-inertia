<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from 'primevue/confirmdialog';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
    coupons: Object // Paginated object
});

const toast = useToast();

const confirm = useConfirm();

const deleteCoupon = (id) => {
    confirm.require({
        message: 'Are you sure you want to delete this coupon?',
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => {
            router.delete(route('dashboard.coupons.destroy', id));
        }
    });
};

const toggleStatus = (coupon) => {
    router.patch(route('dashboard.coupons.toggle', coupon.id), {}, {
        preserveScroll: true,
        onSuccess: () => {
            toast.add({
                severity: 'success',
                summary: 'Updated',
                detail: `Coupon is now ${!coupon.is_active ? 'Active' : 'Inactive'}`, // Inverted logic because visually it hasn't updated yet in this specific line context, but Inertia reloads it fast. safely: 'Status updated'
                life: 2000
            });
        }
    });
};

const getStatusSeverity = (coupon) => {
    if (!coupon.is_active) return 'danger'; // Inactive
    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return 'warning'; // Expired
    return 'success'; // Active
};

const getStatusLabel = (coupon) => {
    if (!coupon.is_active) return 'Inactive';
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return 'Expired';
    return 'Active';
};
</script>

<template>
    <AdminLayout>

        <Head title="Coupons" />

        <div class="max-w-7xl mx-auto">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Coupons & Discounts</h1>
                    <p class="text-gray-500 text-sm mt-1">Manage promo codes for your store.</p>
                </div>
                <Link :href="route('dashboard.coupons.create')">
                    <Button label="Create Coupon" icon="pi pi-plus" raised />
                </Link>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable :value="coupons.data" stripedRows responsiveLayout="scroll">

                    <Column field="code" header="Code" sortable>
                        <template #body="slotProps">
                            <span class="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded text-sm">
                                {{ slotProps.data.code }}
                            </span>
                        </template>
                    </Column>

                    <Column header="Discount">
                        <template #body="slotProps">
                            <span class="font-medium text-gray-900">
                                <span v-if="slotProps.data.type === 'fixed'">
                                    -{{ parseFloat(slotProps.data.value).toFixed(2) }}€
                                </span>
                                <span v-else>
                                    -{{ parseFloat(slotProps.data.value) }}%
                                </span>
                            </span>
                        </template>
                    </Column>

                    <Column header="Usage">
                        <template #body="slotProps">
                            <div class="text-sm">
                                <span class="font-semibold">{{ slotProps.data.used_count }}</span>
                                <span class="text-gray-400 mx-1">/</span>
                                <span v-if="slotProps.data.usage_limit" class="text-gray-600">{{
                                    slotProps.data.usage_limit }}</span>
                                <span v-else class="text-gray-400 text-xs italic">∞</span>
                            </div>
                        </template>
                    </Column>

                    <Column header="Status" style="width: 100px">
                        <template #body="slotProps">
                            <div @click="toggleStatus(slotProps.data)"
                                class="cursor-pointer transition-transform hover:scale-105 active:scale-95 inline-block"
                                v-tooltip.top="'Click to toggle status'">
                                <Tag :value="getStatusLabel(slotProps.data)"
                                    :severity="getStatusSeverity(slotProps.data)"
                                    :icon="slotProps.data.is_active ? 'pi pi-check-circle' : 'pi pi-times-circle'" />
                            </div>
                        </template>
                    </Column>

                    <Column field="expires_at" header="Expires">
                        <template #body="slotProps">
                            <span v-if="slotProps.data.expires_at" class="text-sm text-gray-600">
                                {{ new Date(slotProps.data.expires_at).toLocaleDateString() }}
                            </span>
                            <span v-else class="text-xs text-gray-400 italic">Never</span>
                        </template>
                    </Column>

                    <Column header="Actions" alignFrozen="right" frozen>
                        <template #body="slotProps">
                            <div class="flex gap-2">
                                <Button icon="pi pi-trash" text rounded severity="danger"
                                    @click="deleteCoupon(slotProps.data.id)" />
                            </div>
                        </template>
                    </Column>

                    <template #empty>
                        <div class="text-center p-8 text-gray-500">
                            No coupons found. Create one to get started!
                        </div>
                    </template>
                </DataTable>
            </div>

        </div>

        <ConfirmDialog />
    </AdminLayout>
</template>