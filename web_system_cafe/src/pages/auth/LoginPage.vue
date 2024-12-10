<script setup>
import { ref } from "vue";


const email = ref("");
const password = ref("");

const handleLogin = () => {

    console.log("Logging in", email.value, password.value);
};
</script>

<template>
    <div class="p-5">
        <!-- Login Form -->
        <form @submit.prevent="handleLogin">
            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    v-model="email" required />
            </div>
            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    v-model="password" required />
            </div>
            <button type="submit" class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Login
            </button>
        </form>
        <div class="mt-4 text-center">
            <p class="text-sm text-gray-600">
                Don't have an account?
                <router-link to="/register" class="text-blue-500 hover:underline">Sign Up</router-link>
            </p>
        </div>
    </div>
</template>
