import 'babel-polyfill';
import './app';

import axios from 'axios';
import { mapGetters } from 'vuex';

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
                this.list = this.list.filter(item => {
                    const resName = item.restaurant.name.toLowerCase();
                    if (resName.includes(inputValue)) {
                        return item;
                    }
                    // console.log(typeof resName.includes(inputValue));
                });
                this.updateList();
            }
        },

        async handleSearch() {
            this.list = [];
            this.currentPage = 0;
            this.dataShow = [];
            this.filterResult = [];

            // console.log('list', this.list.length);
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
            // console.log(result);
            this.search = '';

            this.searchData = result;
            this.updateList();

            return this.searchData;
        },

        updatePage(pageNumber) {
            this.currentPage = pageNumber;
            this.updateList();
        },
        updateList() {
            if (this.list.length > 0) {
                this.dataShow = this.list.slice(this.currentPage * this.pageSize, this.currentPage * this.pageSize + this.pageSize);
            }
            console.log('update', this.searchData);
            if (this.searchData.length > 0) {
                // console.log(this.searchData);
                this.dataShow = this.searchData.slice(this.currentPage * this.pageSize, this.currentPage * this.pageSize + this.pageSize);
            }
            console.log(this.dataShow);

            // if we have no data, go back a page
            if (this.dataShow.length == 0 && this.currentPage > 0) {
                this.updatePage(this.currentPage - 1);
            }
        },
        updatePages(pageNumber) {
            this.$emit('page:update', pageNumber);
        },

        totalPages() {
            // console.log(this.list);
            if (this.list.length > 0) {
                return Math.ceil(this.list.length / this.pageSize);
            }
            if (this.searchData.length > 0) {
                return Math.ceil(this.searchData.length / this.pageSize);
            }
        },
        showPreviousLink() {
            return this.currentPage == 0 ? true : false;
        },
        showNextLink() {
            return this.currentPage == this.totalPages() - 1 ? true : false;
        }
    }
};
