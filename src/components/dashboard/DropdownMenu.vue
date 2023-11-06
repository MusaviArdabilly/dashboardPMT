<template>
  <div class="dropdown">
    <button @click="toggleDropdown" class="btn btn-primary">
      <svg svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z"/></svg>
    </button>
    <ul v-if="isOpen" class="filter-dropdown-menu">
      <slot></slot>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    console.log('Dropdown clicked');
    },
  },
};
</script>

<style scoped>
/* Add your CSS styles here */
.dropdown {
  position: relative;
  display: inline-block;
}

.filter-dropdown-menu {
  width: 200px;
  display: block;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  text-decoration: none;
  z-index: 100;
  border-radius: 5px;
}

.v-application ul {
  padding: 0 !important;
  border-radius: 5px;
}
.filter-dropdown-menu li {
  display: block;
  text-align: center;
  list-style: none;
  padding: 10px;
  border-radius: 5px;
}
.filter-dropdown-menu li:hover {
  background: #808080;
  color: #ffffff;
  border-radius: 5px;
}
.filter-dropdown-menu a {
  color: #000000DE;
  font-weight: 500;
}
.filter-dropdown-menu v-btn {
  color: #000000DE;
  font-weight: 500;
}

.btn {
  cursor: pointer;
}
</style>
