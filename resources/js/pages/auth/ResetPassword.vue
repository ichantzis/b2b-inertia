<script setup>
import { useTemplateRef, onMounted } from 'vue';
import { useForm } from '@inertiajs/vue3';
import GuestLayout from '@/layouts/GuestLayout.vue';

const props = defineProps({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

const emailInput = useTemplateRef('email-input');

const form = useForm({
    token: props.token,
    email: props.email,
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.post(route('password.store'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};

onMounted(() => {
    emailInput.value.$el.focus();
});
</script>

<template>
    <GuestLayout>
        <InertiaHead title="Reset Password" />

        <form
            class="space-y-6"
            @submit.prevent="submit"
        >
            <div class="flex flex-col gap-2">
                <label for="email">Email</label>
                <InputText
                    id="email"
                    ref="email-input"
                    v-model="form.email"
                    type="email"
                    :invalid="Boolean(form.errors.email)"
                    required
                    fluid
                    autocomplete="username"
                />
                <Message
                    v-if="form.errors?.email"
                    severity="error"
                    variant="simple"
                    size="small"
                >
                    {{ form.errors?.email }}
                </Message>
            </div>

            <div class="flex flex-col gap-2">
                <label for="password">Password</label>
                <InputText
                    id="password"
                    v-model="form.password"
                    type="password"
                    :invalid="Boolean(form.errors.password)"
                    required
                    fluid
                    autocomplete="new-password"
                />
                <Message
                    v-if="form.errors?.password"
                    severity="error"
                    variant="simple"
                    size="small"
                >
                    {{ form.errors?.password }}
                </Message>
            </div>

            <div class="flex flex-col gap-2">
                <label for="password_confirmation">Password</label>
                <InputText
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    type="password"
                    :invalid="Boolean(form.errors.password_confirmation)"
                    required
                    fluid
                    autocomplete="new-password"
                />
                <Message
                    v-if="form.errors?.password_confirmation"
                    severity="error"
                    variant="simple"
                    size="small"
                >
                    {{ form.errors?.password_confirmation }}
                </Message>
            </div>

            <div class="flex justify-end items-center pt-2">
                <Button
                    :loading="form.processing"
                    type="submit"
                    label="Reset Password"
                />
            </div>
        </form>
    </GuestLayout>
</template>
