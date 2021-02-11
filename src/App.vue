<template>
    <div id="app">
        <div>
            <input class="mx-auto" v-model="search" placeholder="Restaurant" />
            <button v-on:click.prevent="handleSearch">搜索</button>
            <div class="wrapper">
                <div class="card" v-for="(res, index) in list.restaurants" :key="index">
                    <img v-bind:src="res.restaurant.thumb" />
                    <p>{{ res.restaurant.name }}</p>
                    <hr />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import 'babel-polyfill';
import './app';

export default {
    data() {
        return {
            search: '',
            list: [],
            searchData: []
        };
    },
    beforeMount() {
        this.getList();
    },

    //API key:
    //60d56787e708233b058e166f08d7ba50
    methods: {
        //get orignal list on zomato
        async getList() {
            let result = await axios({
                method: 'post',
                url: 'https://developers.zomato.com/api/v2.1/locations?query=Adelaide',
                // data: formData,
                headers: { 'Content-Type': 'application/json', 'user-key': 'a31bd76da32396a27b6906bf0ca707a2' }
            })
                .then(response => {
                    const location = response.data.location_suggestions[0];
                    let res_list = axios({
                        method: 'post',
                        url: `https://developers.zomato.com/api/v2.1/search?entity_id=${location.entity_id}&entity_type=${location.entity_type}`,
                        headers: { 'Content-Type': 'application/json', 'user-key': 'a31bd76da32396a27b6906bf0ca707a2' }
                    })
                        .then(function(res) {
                            console.log(res.data);
                            return res.data;
                        })
                        .catch(function(error) {
                            console.log(error);
                        });

                    return res_list;
                })
                .catch(function(response) {});
            console.log(result);
            return (this.list = result);
        }

        // async
    }
};
</script>

<style module>
html,
body {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 16px;
    margin-bottom: 16px;
}
</style>
