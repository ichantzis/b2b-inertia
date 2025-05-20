<template>
    <form @submit.prevent="submit">
        <div class="space-y-6">
            <div>
                <label for="name" class="block text-sm font-medium mb-1">Name</label>
                <InputText id="name" v-model="form.name" class="w-full" :class="{ 'p-invalid': form.errors.name }" />
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
                <Select id="role" v-model="form.role" :options="roleOptions" optionLabel="label" optionValue="value"
                    placeholder="Select Role" class="w-full" :class="{ 'p-invalid': form.errors.role }" />
                <small v-if="form.errors.role" class="p-error">{{ form.errors.role }}</small>
            </div>
            <Divider />
            <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ isEditMode ? 'Leave password fields blank to keep current password.' : 'Set a password for the new user.' }}
            </p>
            <div>
                <label for="password" class="block text-sm font-medium mb-1">Password</label>
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
                <small v-if="form.errors.password_confirmation" class="p-error">{{ form.errors.password_confirmation
                    }}</small>
            </div>

            <Divider />
            <h3 class="text-lg font-medium">Contact & Address (Optional)</h3>

            <div>
                <label for="phone" class="block text-sm font-medium mb-1">Phone</label>
                <InputText id="phone" v-model="form.phone" class="w-full" :class="{ 'p-invalid': form.errors.phone }" />
                <small v-if="form.errors.phone" class="p-error">{{ form.errors.phone }}</small>
            </div>
            <div>
                <label for="address" class="block text-sm font-medium mb-1">Address</label>
                <InputText id="address" v-model="form.address" class="w-full"
                    :class="{ 'p-invalid': form.errors.address }" />
                <small v-if="form.errors.address" class="p-error">{{ form.errors.address }}</small>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label for="city" class="block text-sm font-medium mb-1">City</label>
                    <InputText id="city" v-model="form.city" class="w-full"
                        :class="{ 'p-invalid': form.errors.city }" />
                    <small v-if="form.errors.city" class="p-error">{{ form.errors.city }}</small>
                </div>
                <div>
                    <label for="country" class="block text-sm font-medium mb-1">Country</label>
                    <InputText id="country" v-model="form.country" class="w-full"
                        :class="{ 'p-invalid': form.errors.country }" />
                    <small v-if="form.errors.country" class="p-error">{{ form.errors.country }}</small>
                </div>
                <div>
                    <label for="postal_code" class="block text-sm font-medium mb-1">Postal Code</label>
                    <InputText id="postal_code" v-model="form.postal_code" class="w-full"
                        :class="{ 'p-invalid': form.errors.postal_code }" />
                    <small v-if="form.errors.postal_code" class="p-error">{{ form.errors.postal_code }}</small>
                </div>
            </div>

            <div class="flex justify-end space-x-3 mt-8">
                <Link :href="route('dashboard.users.index')">
                <Button label="Cancel" severity="secondary" outlined icon="pi pi-times" type="button" />
                </Link>
                <Button type="submit" :label="isEditMode ? 'Update User' : 'Create User'" icon="pi pi-check"
                    :loading="form.processing" />
            </div>
        </div>
    </form>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useForm, Link } from '@inertiajs/vue3';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Divider from 'primevue/divider';

const props = defineProps({
    user: {
        type: Object,
        default: () => ({}),
    },
    userRoles: {
        type: Array,
        required: true,
    },
    isEditMode: {
        type: Boolean,
        default: false,
    }
});

const emit = defineEmits(['submit']);

const form = useForm({
    name: props.user?.name || '',
    email: props.user?.email || '',
    role: props.user?.role || props.userRoles.includes('customer') ? 'customer' : props.userRoles[0], // Default to 'user' or first role
    password: '',
    password_confirmation: '',
    phone: props.user?.phone || '',
    address: props.user?.address || '',
    city: props.user?.city || '',
    country: props.user?.country || '',
    postal_code: props.user?.postal_code || '',
    _method: props.isEditMode ? 'PUT' : 'POST', // To handle form submission method
});

const roleOptions = ref(
    props.userRoles.map(role => ({ label: role.charAt(0).toUpperCase() + role.slice(1), value: role }))
);

const submit = () => {
    // If in edit mode and password is blank, don't send it for update
    const dataToSubmit = { ...form.data() };
    if (props.isEditMode && !dataToSubmit.password) {
        delete dataToSubmit.password;
        delete dataToSubmit.password_confirmation;
    }
    emit('submit', dataToSubmit);
};
</script>