<script setup>
import { ref, onMounted, reactive } from 'vue';
import { message, Table, Button, Modal, Form, Input } from 'ant-design-vue';
import { request } from '../../store/Configstore'; // Ensure request is defined in Configstore
import ErrorStatusType from '../../components/layouts/handleError/ErrorStatusType.vue';

const getdata = ref({
    list: []
});

const open = ref(false);
const employeeForm = ref(null);
const currentEmployee = ref(null);
const state = reactive({
    loading: false
})

onMounted(() => {
    getAll();
});

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Employment Date',
        dataIndex: 'employment_date',
        key: 'employment_date',
    },
    {
        title: 'Salary',
        dataIndex: 'salary',
        key: 'salary',
    },
    {
        title: 'Bonus',
        dataIndex: 'bonus',
        key: 'bonus',
    },
    {
        title: 'Date of Birth',
        dataIndex: 'dob',
        key: 'dob',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Created By',
        dataIndex: 'create_by',
        key: 'create_by',
    },
    {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
    },
];

const getAll = async () => {
    state.loading = true;
    try {
        const res = await request('employees', 'get');
        if (res && !res.error) {
            getdata.value.list = res.employees;
        } else {
            message.error('Failed to fetch employee data.');
        }
    } catch (error) {
        message.error('An error occurred: ' + error.message);
    } finally {
        state.loading = false;
    }
};

const handleEdit = (record) => {
    currentEmployee.value = record;
    employeeForm.value.setFieldsValue(record);
    open.value = true;
};

const handleDelete = (record) => {
    message.info(`Delete clicked for ${record.name}`);

};

const handleOk = () => {
    console.log('Modal OK clicked');

    open.value = false;
};

const handleCancel = () => {
    console.log('Modal Cancel clicked');
    open.value = false;
};

const onOpen = () => {
    open.value = true;
};
</script>


<template>
    <div>
        <ErrorStatusType :loading=state.loading>

            <Button type="primary" @click="onOpen">Open Modal</Button>
            <Modal v-model:open="open" title="Basic Modal" @ok="handleOk" @cancel="handleCancel" footer
                layout="vertical">
                <Form ref="employeeForm">
                    <Form.Item label="Name" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Employment Date" name="employment_date">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Salary" name="salary">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Bonus" name="bonus">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Date of Birth" name="dob">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Gender" name="gender">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Table :data-source="getdata.list" :columns="columns" row-key="id" />
        </ErrorStatusType>
    </div>
</template>
