<template>
    <div>
        <div>
            <input v-model="search" placeholder="Restaurant" />
            <button type="primary" @click="Search">搜索</button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
    data() {
        return {
            search: '',
            list: [],
            searchData: []
        };
    },

    components: {}
};
</script>
