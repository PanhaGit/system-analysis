<template>
    <div>
        <Result v-if="isServerError" :status="serverStatus" :title="info[serverStatus].message"
            :sub-title="info[serverStatus].sub">
            <template #extra>
                <Button type="primary">Back Home</Button>
            </template>
        </Result>

        <Spin v-else :spinning="loading">
            <slot />
        </Spin>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Spin, Result, Button } from "ant-design-vue";
import { getServerStatus } from "../../../store/serverStore";

const loading = ref(false);
const serverStatus = getServerStatus();

const info = {
    404: {
        message: "404-Route Not Found",
        sub: "404-Route Not Found. Please confirm your current route that requests to the server",
    },
    403: {
        message: "403-Unauthorized",
        sub: "Sorry, you are not authorized to access this page.",
    },
    500: {
        message: "500-Internal Server Error",
        sub: "Please contact the administrator.",
    },
    error: {
        message: "Cannot connect to server",
        sub: "Please contact the administrator.",
    },
};
const isServerError = computed(() => {
    return ["403", "500", "404", "error"].includes(serverStatus);
});
</script>
