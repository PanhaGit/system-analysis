<script setup>
import { ref } from "vue";
import Dashboard from "../../components/dashboard/Dashboard.vue";
const data = ref([
    {
        id: 1,
        title: "ផ្ទាំងគ្រប់គ្រង",
        icon: "pi pi-home",
        backgroundColor: "#FFB847",
        member: "10 នាក់",
    },
    {
        id: 2,
        title: "ផ្ទាំងអតិថិជន",
        icon: "pi pi-users",
        backgroundColor: "#47DAFF",
        member: "20 នាក់",
    },
    {
        id: 3,
        title: "ផ្ទាំងបុគ្គលិក",
        icon: "pi pi-users",
        backgroundColor: "#FF4747",
        member: "15 នាក់",
    },
    {
        id: 4,
        title: "ផ្ទាំងការបញ្ជាទិញ",
        icon: "pi pi-shopping-cart",
        backgroundColor: "#8447FF",
        member: "30 នាក់",
    },
    {
        id: 5,
        title: "ផ្ទាំងការចំណាយ",
        icon: "pi pi-dollar",
        backgroundColor: "#FF47F9",
        member: "5 នាក់",
    },
    {
        id: 6,
        title: "ផ្ទាំងការលក់(POS)",
        icon: "pi pi-credit-card",
        backgroundColor: "lightgray",
        member: "50 នាក់",
    },
    {
        id: 7,
        title: "ផ្ទាំងគ្រប់គ្រង់គណនីបុគ្គលិក",
        icon: "pi pi-user",
        backgroundColor: "lightblue",
        member: "12 នាក់",
    },
    {
        id: 8,
        title: "ផ្ទាំងគ្រប់គ្រង់តួនាទីបុគ្គលិក",
        icon: "pi pi-lock",
        backgroundColor: "lightgreen",
        member: "8 នាក់",
    },
]);
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Dashboard v-for="item in data" :key="item.id" :title="item.title" :member="item.member"
            :backgroundColor="item.backgroundColor" :icon="item.icon" />
    </div>

</template>
