<script setup>
import { reactive } from 'vue';
import { request } from '../../store/Configstore';
import { setAcccessToken, setProfile } from '../../store/profile';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
const router = useRouter();


const login = reactive({
    email: '',
    password: ''
});



const handleLogin = async () => {
    try {
        const param = {
            email: login.email,
            password: login.password,
        };
        const res = await request('login', 'post', param);
        console.log(res);
        if (res && !res.error) {
            setAcccessToken(res.token);
            setProfile(JSON.stringify(res.user));
            message.success(res.message)

            router.push('/');
        } else {
            message.warning(res.message)
        }
    } catch (error) {
        message.error(error)
    }
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
                    v-model="login.email" required />
            </div>
            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    v-model="login.password" required />
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
