import { ref } from 'vue';
import axios from 'axios';
import Swal from "sweetalert2";

export default function useUsers() {
    const user = ref(null);
    const users = ref([]);
    const is_loading = ref(false);
    const is_success = ref(false);
    const errors = ref({});
    const pagination = ref({});
    const querySearch = ref({
        search: null,
        page: 1,
    });

    const getUsers = async (params = {}) => {
        is_loading.value = true;

        let query_str = { ...querySearch.value, ...params };
        await axios
            .get('/api/users?page=' + querySearch.value.page, {params: query_str})
            .then((response) => {
                users.value = response.data.data;
                pagination.value = response.data.meta;
                is_loading.value = false;
            })
    }

    const storeUser = async (data) => {
        is_loading.value = true;
        errors.value = "";
        
        try{
            await axios
                .post(`/api/users`, data)
                .then((response) => {
                    Swal.fire({
                        title: "Success",
                        icon: "success",
                        text: response.data.message,
                    });
                    errors.value = {};
                    is_loading.value = false;
                    is_success.value = true;                
                });
        } catch (e) {
            if(e.response.status == 422) {
                errors.value = e.response.data;
                is_success.value = false;
                is_loading.value = false;
            }
        }
    }

    const updateUser = async (data) => {
        errors.value = "";
        is_loading.value = true;
        user.value = data;
        
        try{
            await axios
                .patch(`/api/users/${user.value.id}`, user.value)
                .then((response) => {
                    Swal.fire({
                        title: "Success",
                        icon: "success",
                        text: response.data.message,
                    });
                    errors.value = {};
                    is_loading.value = false;
                    is_success.value = true;                
                });
        } catch (e) {
            if(e.response.status == 422) {
                errors.value = e.response.data;
                is_success.value = false;
                is_loading.value = false;
            }
        }
    }

    const destoryUser = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.value) {
                axios
                    .delete(`/api/users/${id}`)
                    .then((response) => {
                        getUsers();
                        Swal.fire("Deleted", response.data.message, "success");
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!",
                        });
                    });
            }
        });
    }


    return {
        user,
        users,
        is_loading,
        is_success,
        errors,
        pagination, 
        querySearch,
        storeUser,
        updateUser,
        destoryUser,
        getUsers,
    }
}