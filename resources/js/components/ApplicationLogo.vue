<template>
    <div class="flex items-center">
        <img 
            :src="image" 
            alt="Pinakothiki Logo" 
            class="h-6 w-auto sm:h-8 md:h-10 lg:h-12 xl:h-14 transition-all duration-200"
        />
    </div>
</template>
<script setup>
const image = '/images/Pinakothiki-Logo-Header.png';

</script>
