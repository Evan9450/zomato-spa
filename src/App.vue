<template>
    <div id="app">
        <div>
            <div :class="$style.wrapper">
                <input v-model="search" placeholder="Restaurant" @input="searchAction($event)" />
                <button v-on:click.prevent="handleSearch">搜索</button>
            </div>

            <div v-if="filterResult.length > 0">
                <div :class="$style.card" v-for="(res, index) in filterResult" :key="index">
                    <img v-bind:src="res.restaurant.thumb" />
                    {{ res.restaurant.name }}
                    <small>{{ res.restaurant.cuisines }}</small>
                    <!-- <hr /> -->
                </div>
            </div>
            <div v-else class="wrapper">
                <div :class="$style.card" v-for="(res, index) in list" :key="index">
                    <img v-bind:src="res.restaurant.thumb" />
                    {{ res.restaurant.name }}
                    <small>{{ res.restaurant.cuisines }}</small>

                    <!-- <hr /> -->
                </div>
            </div>
        </div>
        <!-- <div>{{ id }}</div> -->
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
            type: '',
            id: '',
            list: [],
            searchData: [],
            filterResult: []
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
                    this.id = location.entity_id;
                    this.type = location.entity_type;
                    let res_list = axios({
                        method: 'post',
                        url: `https://developers.zomato.com/api/v2.1/search?entity_id=${location.entity_id}&entity_type=${location.entity_type}`,
                        headers: { 'Content-Type': 'application/json', 'user-key': 'a31bd76da32396a27b6906bf0ca707a2' }
                    })
                        .then(function(res) {
                            // console.log(res.data);
                            return res.data.restaurants;
                        })
                        .catch(function(error) {
                            console.log('error');
                        });

                    return res_list;
                })
                .catch(function(response) {});
            console.log(result);

            return (this.list = result);
        },

        searchAction(e) {
            const inputValue = e.target.value.toLowerCase();
            console.log(inputValue);

            this.filterResult = this.list.filter(item => {
                const resName = item.restaurant.name.toLowerCase();
                if (resName.includes(inputValue)) {
                    return item;
                }
                // console.log(typeof resName.includes(inputValue));
            });
        },

        async handleSearch() {
            let result = await axios({
                method: 'post',
                url: `https://developers.zomato.com/api/v2.1/search?entity_id=${this.id}&entity_type=${this.type}&q=${this.search}`,
                // data: formData,
                headers: { 'Content-Type': 'application/json', 'user-key': 'a31bd76da32396a27b6906bf0ca707a2' }
            })
                .then(response => {
                    return response.data.restaurants;
                })
                .catch(res => {
                    console.log(res);
                });
            // console.log(result);
            return (this.list = result);
        }
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

.wrapper {
    /* display: flex; */
    text-align: center;
}

.card {
    box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
    /* max-width: 124px; */
    /* text-align: center; */
    height: 100px;
    margin: 12px;
    transition: 0.15s all ease-in-out;
    padding-bottom: 5px;
}
img {
    height: 100px;
}
small {
    font-size: 10px;
    padding: 4px;
}
</style>
