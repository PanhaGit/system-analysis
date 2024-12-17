<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ChevronDownIcon, PencilIcon } from "@heroicons/vue/20/solid";
import { request } from "../../store/Configstore";
import { getProfile, removeAcccessToken, setProfile } from "../../store/profile";

const route = useRoute();
const router = useRouter();
const user = getProfile();

const url = computed(() => route?.path || "");
const items = [
    { key: "/", label: "ផ្ទាំងគ្រប់គ្រង", icon: "pi pi-home" },
    { key: "/customer", label: "អតិថិជន", icon: "pi pi-users" },
    { key: "/employees", label: "និយោជិត", icon: "pi pi-users" },
    { key: "/order", label: "ការបញ្ជាទិញ", icon: "pi pi-shopping-cart" },
    { key: "/expense", label: "ការចំណាយ", icon: "pi pi-dollar" },
    { key: "/pos", label: "ចំណុចលក់", icon: "pi pi-credit-card" },
    { key: "/account_staff", label: "បុគ្គលិកគណនេយ្យ", icon: "pi pi-user" },
    { key: "/role", label: "តួនាទី", icon: "pi pi-lock" },
];

const currentTime = ref("");

const updateCurrentTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });
};

onMounted(() => {
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    onUnmounted(() => clearInterval(interval));
    if (!user) {
        router.push('/login');
    }
});

const handleLogout = async () => {
    try {
        const res = await request("logout", "post");
        console.log("Response:", res);

        if (res && !res.error) {
            removeAcccessToken();
            setProfile(null);
            router.push("/login");
        }
    } catch (error) {
        console.error("Error Response:", error.response?.data || error.message);
    }
};
</script>

<template>
    <div v-if="user" class="flex h-screen bg-gray-100">
        <!-- Sidebar -->
        <div class="w-64 bg-white p-3 shadow-sm">
            <ul class="relative">
                <li v-for="item in items" :key="item.key" :class="{ 'text-gray-600': url === item.key }">
                    <div v-if="url === item.key"
                        class="w-2 h-10 mt-3 rounded-e-xl bg-activeText absolute transition-all ease-in-out duration-300">
                    </div>

                    <router-link :to="item.key"
                        class="py-3.5 px-2 flex items-center space-x-2 hover:translate-x-2.5 hover:text-black transition-all ease-in-out duration-300"
                        :class="{ 'text-activeText translate-x-2.5 hover:text-activeText': url === item.key }">
                        <i :class="item.icon + ' text-2xl'"></i>
                        <span class="font-khmer_battambang text-lg">{{ item.label }}</span>
                    </router-link>
                </li>
            </ul>
        </div>

        <!-- Main content -->
        <div class="flex-1 flex flex-col">
            <!-- Header -->
            <header class="bg-white mx-3 p-4 shadow-sm">
                <div class="flex items-center justify-between">
                    <!-- Logo and title -->
                    <div class="flex items-center gap-3">
                        <div class="w-28 h-16">
                            <img src="../../assets/image/logo.png" alt="Logo" class="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 class="text-xl font-medium font-khmer_battambang">អាយធី ស្មោះស្នេហ៍</h1>
                            <p class="text-sm">IT Smos sne</p>
                        </div>
                    </div>
                    <!-- Date and User Info -->
                    <div class="flex items-center space-x-4">
                        <p class="text-lg">{{ currentTime }}</p>
                        <div class="flex items-center flex-col relative">
                            <img src="../../assets/image/user.jpg" alt="User" class="w-8 h-8 rounded-full" />
                            <!-- Display user's name if available -->
                            <p v-if="user" class="text-sm mt-2">{{ user?.name }}</p>
                            <!-- drop down -->
                            <div class="absolute right-0 top-4">
                                <Menu as="div" class="relative inline-block text-left">
                                    <div>
                                        <MenuButton
                                            class="inline-flex w-full justify-center rounded-md text-sm font-medium text-black">
                                            <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5 text-black" aria-hidden="true" />
                                        </MenuButton>
                                    </div>

                                    <transition enter-active-class="transition duration-100 ease-out"
                                        enter-from-class="transform scale-95 opacity-0"
                                        enter-to-class="transform scale-100 opacity-100"
                                        leave-active-class="transition duration-75 ease-in"
                                        leave-from-class="transform scale-100 opacity-100"
                                        leave-to-class="transform scale-95 opacity-0">
                                        <MenuItems
                                            class="rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                            <div class="px-1 py-1">
                                                <MenuItem v-slot="{ active }">
                                                <button @click="handleLogout"
                                                    :class="[active ? 'text-center bg-violet-500 text-white' : 'text-gray-900', 'group flex w-full items-center rounded-md px-2 py-2 text-sm']">
                                                    <PencilIcon class="h-5 w-5 text-violet-400" aria-hidden="true" />
                                                    Logout
                                                </button>
                                                </MenuItem>
                                            </div>
                                        </MenuItems>
                                    </transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Content -->
            <main class="flex-1 p-6">
                <router-view />
            </main>
        </div>
    </div>
</template>
