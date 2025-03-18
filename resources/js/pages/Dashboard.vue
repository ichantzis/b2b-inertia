<script setup>
import HeaderLayout from '@/layouts/HeaderLayout.vue';

defineOptions({ layout: HeaderLayout });
</script>

<template>
    <InertiaHead title="Dashboard" />

    <Container vertical>
        <Card>
            <template #content>
                <p class="m-0">You are logged in!</p>
            </template>
        </Card>
    </Container>
</template>
