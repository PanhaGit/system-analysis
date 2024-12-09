<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";  // Import the router
import { globeState } from "../../store/Configstore";
import { storeToRefs } from "pinia";

const router = useRouter();
const state = globeState();

const { error } = storeToRefs(globeState());

const registerForm = reactive({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
});

const handleRegister = async () => {
    if (registerForm.password !== registerForm.password_confirmation) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const res = await state.request("register", "post", registerForm);

        if (res && !res.error) {
            router.push('/');
        }
    } catch (error) {
        console.error(error);
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
                <p v-if="error.name" class="text-red-500 text-xs">{{ error.name[0] }}</p>
            </div>

            <!-- Email Field -->
            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" v-model="registerForm.email"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                <p v-if="error.email" class="text-red-500 text-xs">{{ error.email[0] }}</p>
            </div>

            <!-- Password Field -->
            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" v-model="registerForm.password"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                <p v-if="error.password" class="text-red-500 text-xs">{{ error.password[0] }}</p>
            </div>

            <!-- Confirm Password Field -->
            <div class="mb-4">
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" id="confirmPassword" v-model="registerForm.password_confirmation"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                <p v-if="error.password_confirmation" class="text-red-500 text-xs">{{ error.password_confirmation[0]
                    }}</p>
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
