<template>
    <div id="app">
        <div>
            <div :class="$style.wrapper">
                <input v-model="search" placeholder="Restaurant" @input="searchAction($event)" />
                <button v-on:click.prevent="handleSearch">搜索</button>
            </div>

            <div v-if="filterResult.length > 0">
                <div :class="$style.card" v-for="res in filterResult" :key="res.restaurant.id">
                    <img v-bind:src="res.restaurant.thumb" />
                    {{ res.restaurant.name }}
                    <small>{{ res.restaurant.cuisines }}</small>
                    <!-- <hr /> -->
                </div>
            </div>
            <div v-else class="wrapper">
                <div :class="$style.card" v-for="(res, index) in dataShow" :key="index" v-bind:dataShow="dataShow" v-bind:currentPage="currentPage">
                    <img v-bind:src="res.restaurant.thumb" />
                    <div :class="$style.textWrapper">
                        <p>{{ res.restaurant.name }}</p>

                        <p :class="$style.subTitle">
                            {{ res.restaurant.cuisines }}
                        </p>
                    </div>
                    <!-- <hr /> -->
                </div>
            </div>
            <div v-if="searchData.length > 0">
                <div :class="$style.card" v-for="res in searchData" :key="res.restaurant.id">
                    <img v-bind:src="res.restaurant.thumb" />
                    {{ res.restaurant.name }}
                    <small>{{ res.restaurant.cuisines }}</small>
                    <!-- <hr /> -->
                </div>
            </div>
        </div>
        <div
            :class="$style.paginationWrapper"
            v-bind:dataShow="dataShow"
            v-on:page:update="updatePages"
            v-bind:currentPage="currentPage"
            v-bind:pageSize="pageSize"
            v-if="totalPages() > 0"
            class="pagination-wrapper"
        >
            <button :disabled="showPreviousLink()" :class="$style.pagination_btn" v-on:click="updatePage(currentPage - 1)">PrePage</button>
            {{ currentPage + 1 }} of {{ totalPages() }}
            <button :disabled="showNextLink()" :class="$style.pagination_btn" v-on:click="updatePage(currentPage + 1)">NextPage</button>
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
            filterResult: [],
            // totalPage: [],
            // total item of one page
            pageSize: 4,
            pageNum: 1,
            // display current data
            dataShow: [],
            // defualt page
            currentPage: 0
        };
    },
    beforeMount() {
        this.getList();
        this.updateList();
        // this.totalPages();
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
                        url: `https://developers.zomato.com/api/v2.1/search?entity_id=${this.id}&entity_type=${this.type}`,
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
            this.list = result;
            this.updateList();

            return this.list;
        },

        searchAction(e) {
            const inputValue = e.target.value.toLowerCase();
            console.log(inputValue);

            if (this.list) {
                this.filterResult = this.list.filter(item => {
                    const resName = item.restaurant.name.toLowerCase();
                    if (resName.includes(inputValue)) {
                        return item;
                    }
                    // console.log(typeof resName.includes(inputValue));
                });
            }
        },

        async handleSearch() {
            delete this.list;
            let result = await axios({
                method: 'post',
                url: `https://developers.zomato.com/api/v2.1/search?entity_id=${this.id}&entity_type=${this.type}&q=${this.search}`,
                // data: formData,
                headers: { 'Content-Type': 'application/json', 'user-key': 'a31bd76da32396a27b6906bf0ca707a2' }
            })
                .then(response => {
                    // console.log(response.data.restaurants);
                    return response.data.restaurants;
                })
                .catch(res => {
                    console.log(res);
                });
            console.log(result);
            this.search = '';

            this.searchData = result;

            return this.searchData;
        },

        updatePage(pageNumber) {
            this.currentPage = pageNumber;
            this.updateList();
        },
        updateList() {
            this.dataShow = this.list.slice(this.currentPage * this.pageSize, this.currentPage * this.pageSize + this.pageSize);

            // if we have 0 visible todos, go back a page
            if (this.dataShow.length == 0 && this.currentPage > 0) {
                this.updatePage(this.currentPage - 1);
            }
        },
        updatePages(pageNumber) {
            this.$emit('page:update', pageNumber);
        },

        totalPages() {
            // console.log(this.list);
            return Math.ceil(this.list.length / this.pageSize);
        },
        showPreviousLink() {
            return this.currentPage == 0 ? true : false;
        },
        showNextLink() {
            return this.currentPage == this.totalPages() - 1 ? true : false;
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
    display: flex;
    box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
    height: 100px;
    margin: 12px;
    transition: 0.15s all ease-in-out;
    /* padding-bottom: 5px; */
}
.paginationWrapper {
    text-align: center;
}
.pagination_btn {
    cursor: pointer;
}
.textWrapper {
    flex-direction: column;
    margin-left: 10px;
    margin-right: 10px;
}
.subTitle {
    display: flex;
    justify-content: left;
    font-size: 10px;
    padding: 4px;
}
img {
    height: 100px;
}
</style>
