<template>
    <div id="app">
        <div>
            <div :class="$style.wrapper">
                <input :class="$style.input" v-model="search" placeholder="Restaurant" @input="searchAction($event)" />
                <button :class="$style.searchBtn" v-on:click.prevent="handleSearch">搜索</button>
            </div>

            <div v-if="filterResult.length > 0">
                <div :class="$style.card" v-for="res in filterResult" :key="res.restaurant.id">
                    <img v-bind:src="res.restaurant.thumb" />
                    <div :class="$style.textWrapper">
                        <p>{{ res.restaurant.name }}</p>

                        <p :class="$style.subTitle">
                            {{ res.restaurant.cuisines }}
                        </p>
                    </div>
                </div>
            </div>
            <div v-if="list.length > 0" class="wrapper">
                <div :class="$style.card" v-for="res in dataShow" :key="res.restaurant.id" v-bind:dataShow="dataShow" v-bind:currentPage="currentPage">
                    <img v-bind:src="res.restaurant.thumb" />
                    <div :class="$style.textWrapper">
                        <p>{{ res.restaurant.name }}</p>

                        <p :class="$style.subTitle">
                            {{ res.restaurant.cuisines }}
                        </p>
                    </div>
                </div>
            </div>
            <div v-if="searchData.length > 0">
                <div :class="$style.card" v-for="res in dataShow" :key="res.restaurant.id" v-bind:dataShow="dataShow" v-bind:currentPage="currentPage">
                    <img v-bind:src="res.restaurant.thumb" />
                    <div :class="$style.textWrapper">
                        <p>{{ res.restaurant.name }}</p>

                        <p :class="$style.subTitle">
                            {{ res.restaurant.cuisines }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div
            :class="$style.paginationWrapper"
            v-bind:dataShow="dataShow"
            v-on:page:update="updatePages"
            v-bind:currentPage="currentPage"
            v-bind:pageSize="4"
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

<script src="./App.js"></script>

<style src="./App.css" module></style>
