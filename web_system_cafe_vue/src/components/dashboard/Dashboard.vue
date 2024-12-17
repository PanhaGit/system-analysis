<script setup>
defineProps({
    title: String,
    member: String,
    backgroundColor: String,
    icon: String,
});
</script>

<template>
    <div :style="{
        backgroundColor: backgroundColor,
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '10px',
    }">
        <div>
            <i :class="icon" style="font-size: 30px; margin-right: 10px; color: white"></i>
            <div>
                <h2 class="font-khmer_battambang text-white text-lg">{{ title }}</h2>
                <p class="font-khmer_battambang text-white">{{ member }}</p>
            </div>
        </div>
    </div>
</template>
