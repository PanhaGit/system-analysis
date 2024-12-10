<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { request } from "../../store/Configstore";

const router = useRouter();

const registerForm = reactive({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
});

const handleRegister = async () => {
    // Basic form validation
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.password_confirmation) {
        alert("Please fill out all fields.");
        return;
    }

    // Passwords match validation
    if (registerForm.password !== registerForm.password_confirmation) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const res = await request("register", "post", registerForm);

        if (res && !res.error) {
            router.push('/'); // Redirect after successful registration
        } else {
            alert("Registration failed. Please try again.");
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again later.");
    }
};
</script>

<template>
    <div class="p-6">
        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="max-w-md mx-auto bg-white rounded-md ">
            <!-- Name Field -->
            <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" v-model="registerForm.name"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <!-- Email Field -->
            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" v-model="registerForm.email"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <!-- Password Field -->
            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" v-model="registerForm.password"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <!-- Confirm Password Field -->
            <div class="mb-4">
                <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm
                    Password</label>
                <input type="password" id="password_confirmation" v-model="registerForm.password_confirmation"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <!-- Submit Button -->
            <button type="submit" class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Register
            </button>
        </form>
        <div class="mt-4 text-center">
            <p class="text-sm text-gray-600">
                Already have an account?
                <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>
            </p>
        </div>
    </div>
</template>
