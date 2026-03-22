<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white flex flex-col p-5">
      <h2 class="text-2xl font-bold mb-6">Admin</h2>

      <router-link
        to="/admin"
        class="px-3 py-2 rounded hover:bg-gray-700 block"
        active-class="bg-gray-700"
      >
        Dashboard
      </router-link>

      <router-link
        to="/admin/books"
        class="px-3 py-2 rounded hover:bg-gray-700 block"
        active-class="bg-gray-700"
      >
        Books
      </router-link>

      <router-link
        to="/admin/categories"
        class="px-3 py-2 rounded hover:bg-gray-700 block"
        active-class="bg-gray-700"
      >
        Categories
      </router-link>

      <router-link
        to="/admin/authors"
        class="px-3 py-2 rounded hover:bg-gray-700 block"
        active-class="bg-gray-700"
      >
        Authors
      </router-link>

      <button
        @click="logout"
        class="mt-auto bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
      >
        Logout
      </button>
    </aside>

    <!-- Content -->
    <main class="flex-1 p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const logout = () => {
  localStorage.removeItem("accessToken");
  router.push("/login");
};
</script>