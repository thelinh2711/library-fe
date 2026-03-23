<!-- src/views/BookView.vue -->
<template>
  <div>
    <!-- Header + Search -->
    <div class="flex justify-between mb-4 items-center">
      <h1 class="text-2xl font-bold">Quản lý sách</h1>

      <div class="flex gap-2 items-center">
        <input
          v-model="bookStore.keyword"
          placeholder="Tìm kiếm..."
          class="border px-3 py-2 rounded"
          @keyup.enter="bookStore.fetchBooks"
        />

        <select v-model="bookStore.category" @change="bookStore.fetchBooks" class="border px-3 py-2 rounded">
          <option value="">-- Chọn thể loại --</option>
          <option v-for="c in categoryStore.categories" :key="c.id" :value="c.name">{{ c.name }}</option>
        </select>

        <button @click="openCreate" class="bg-blue-500 text-white px-4 py-2 rounded">+ Thêm</button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded shadow p-4">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 text-left">Tiêu đề</th>
            <th class="p-2 text-left">NXB</th>
            <th class="p-2 text-left">Năm</th>
            <th class="p-2 text-left">ISBN</th>
            <th class="p-2 text-left">Số lượng</th>
            <th class="p-2 text-left">Số lượng sẵn có</th>
            <th class="p-2 text-left">Mô tả</th>
            <th class="p-2 text-left">Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="b in bookStore.books" :key="b.id" class="border-t">
            <td class="p-2">{{ b.title }}</td>
            <td class="p-2">{{ b.publisher }}</td>
            <td class="p-2">{{ b.publishYear }}</td>
            <td class="p-2">{{ b.isbn }}</td>
            <td class="p-2">{{ b.quantity }}</td>
            <td class="p-2">{{ b.availableQuantity }}</td>
            <td class="p-2">{{ b.description }}</td>

            <td class="p-2 flex gap-2">
              <button @click="viewDetail(b.id)" class="text-blue-500 hover:text-blue-600" title="Xem chi tiết">
                <Eye class="w-5 h-5"/>
              </button>
              <button @click="openEdit(b)" class="text-yellow-500 hover:text-yellow-600" title="Sửa">
                <Pencil class="w-5 h-5"/>
              </button>
              <button @click="remove(b.id)" class="text-red-500 hover:text-red-600" title="Xoá">
                <Trash2 class="w-5 h-5"/>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-end gap-2 mt-4">
        <button
          :disabled="bookStore.page === 0"
          @click="bookStore.setPage(bookStore.page - 1)"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span class="px-3 py-1">{{ bookStore.page + 1 }} / {{ bookStore.totalPages }}</span>
        <button
          :disabled="bookStore.page + 1 >= bookStore.totalPages"
          @click="bookStore.setPage(bookStore.page + 1)"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Modal Add/Edit -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-500/20 flex items-center justify-center">
      <div class="bg-white p-6 rounded w-96 overflow-y-auto max-h-[90vh]">
        <h2 class="text-xl mb-4">{{ isEdit ? "Sửa" : "Thêm" }} sách</h2>

        <input v-model="form.title" placeholder="Tiêu đề" class="w-full border px-3 py-2 mb-2" />
        <input v-model="form.publisher" placeholder="NXB" class="w-full border px-3 py-2 mb-2" />
        <input v-model.number="form.publishYear" type="number" placeholder="Năm xuất bản" class="w-full border px-3 py-2 mb-2"/>
        <input v-model="form.isbn" placeholder="ISBN" class="w-full border px-3 py-2 mb-2"/>
        <input v-model.number="form.quantity" type="number" placeholder="Số lượng" class="w-full border px-3 py-2 mb-2"/>
        <input v-model.number="form.availableQuantity" type="number" placeholder="Số lượng sẵn có" class="w-full border px-3 py-2 mb-2"/>
        <textarea v-model="form.description" placeholder="Mô tả" class="w-full border px-3 py-2 mb-2"></textarea>

        <!-- Tác giả -->
        <label class="block mb-1">Tác giả</label>
        <div v-for="(a, index) in form.authors" :key="index" class="flex gap-2 mb-2 items-center">
        <select v-model="form.authors[index].authorId" class="border px-2 py-1 flex-1">
            <option value="">-- Chọn tác giả --</option>
            <option v-for="author in authorStore.authors" :key="author.id" :value="author.id">{{ author.name }}</option>
        </select>

        <select v-model="form.authors[index].role" class="border px-2 py-1">
            <option value="MAIN_AUTHOR">Chính</option>
            <option value="CO_AUTHOR">Đồng</option>
        </select>

        <button type="button" @click="removeAuthor(index)" class="text-red-500 px-2">X</button>
        </div>
        <button type="button" @click="addAuthor" class="bg-gray-200 px-2 py-1 rounded mb-4">+ Thêm tác giả</button>

        <!-- Thể loại -->
        <label class="block mb-1">Thể loại</label>
        <div v-for="(c, index) in form.categoryIds" :key="index" class="flex gap-2 mb-2 items-center">
        <select v-model="form.categoryIds[index]" class="border px-2 py-1 flex-1">
            <option value="">-- Chọn thể loại --</option>
            <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>

        <button type="button" @click="removeCategory(index)" class="text-red-500 px-2">X</button>
        </div>
        <button type="button" @click="addCategory" class="bg-gray-200 px-2 py-1 rounded mb-4">+ Thêm thể loại</button>

                <div class="flex justify-end gap-2">
                <button @click="closeModal">Huỷ</button>
                <button @click="save" class="bg-blue-500 text-white px-4 py-2 rounded">Lưu</button>
                </div>
        </div>
    </div>

    <!-- Modal Detail -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-gray-500/20 flex items-center justify-center">
      <div class="bg-white p-6 rounded w-96 overflow-y-auto max-h-[90vh]">
        <h2 class="text-xl mb-4">Chi tiết sách</h2>

        <p><strong>Tiêu đề:</strong> {{ bookStore.bookDetail?.title }}</p>
        <p><strong>NXB:</strong> {{ bookStore.bookDetail?.publisher }}</p>
        <p><strong>Năm:</strong> {{ bookStore.bookDetail?.publishYear }}</p>
        <p><strong>ISBN:</strong> {{ bookStore.bookDetail?.isbn }}</p>
        <p><strong>Số lượng:</strong> {{ bookStore.bookDetail?.quantity }}</p>
        <p><strong>Số lượng sẵn có:</strong> {{ bookStore.bookDetail?.availableQuantity }}</p>
        <p><strong>Mô tả:</strong> {{ bookStore.bookDetail?.description }}</p>

        <p><strong>Tác giả:</strong>
            <span 
                v-for="(a, index) in bookStore.bookDetail?.authors || []" 
                :key="a.id || index"
            >
                {{ a.name }} ({{ a.role }})
                {{ index < bookStore.bookDetail.authors.length - 1 ? ', ' : '' }}
            </span>
            </p>

            <p><strong>Thể loại:</strong>
            <span 
                v-for="(c, index) in bookStore.bookDetail?.categories || []" 
                :key="c.id || index"
            >
                {{ c.name }}
                {{ index < bookStore.bookDetail.categories.length - 1 ? ', ' : '' }}
            </span>
        </p>
        <div class="flex justify-end mt-4">
          <button @click="showDetailModal=false" class="bg-blue-500 text-white px-4 py-2 rounded">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useBookStore } from "@/stores/bookStore";
import { useAuthorStore } from "@/stores/authorStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { Pencil, Trash2, Eye } from "lucide-vue-next";

const bookStore = useBookStore();
const authorStore = useAuthorStore();
const categoryStore = useCategoryStore();

const showModal = ref(false);
const isEdit = ref(false);
const currentId = ref(null);

const showDetailModal = ref(false);

const form = ref({
  title: "",
  publisher: "",
  publishYear: null,
  isbn: "",
  quantity: 0,
  availableQuantity: 0,
  description: "",
  authors: [],
  categoryIds: [],
});

onMounted(async () => {
  await authorStore.fetchAuthors();
  await categoryStore.fetchCategories();
  await bookStore.fetchBooks();
});

const openCreate = () => {
  isEdit.value = false;
  currentId.value = null;
  form.value = {
    title: "",
    publisher: "",
    publishYear: null,
    isbn: "",
    quantity: 0,
    availableQuantity: 0,
    description: "",
    authors: [],
    categoryIds: [],
  };
  showModal.value = true;
};

const openEdit = async (book) => {
  isEdit.value = true;
  currentId.value = book.id;

  await bookStore.fetchBookDetail(book.id); // fetch detail từ BE
  const detail = bookStore.bookDetail;

  form.value = {
    title: detail.title,
    publisher: detail.publisher,
    publishYear: detail.publishYear,
    isbn: detail.isbn,
    quantity: detail.quantity,
    availableQuantity: detail.availableQuantity,
    description: detail.description,
    authors: detail.authors?.map(a => ({ authorId: a.id, role: a.role })) || [],
    categoryIds: detail.categories?.map(c => c.id) || [],
  };

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const save = async () => {
  const payload = {
    ...form.value,
    authors: form.value.authors.filter(a => a.authorId),
    categoryIds: form.value.categoryIds.filter(c => c),
    availableQuantity: form.value.availableQuantity ?? form.value.quantity, // nếu null thì = quantity
  };

  if (isEdit.value) {
    await bookStore.editBook(currentId.value, payload);
  } else {
    await bookStore.addBook(payload);
  }

  closeModal();
};
const remove = async (id) => {
  if (confirm("Bạn có chắc muốn xoá sách này?")) {
    await bookStore.removeBook(id);
  }
};

const viewDetail = async (id) => {
  await bookStore.fetchBookDetail(id);
  showDetailModal.value = true;
};

const addAuthor = () => {
  form.value.authors.push({ authorId: "", role: "MAIN_AUTHOR" });
};

const removeAuthor = (index) => {
  form.value.authors.splice(index, 1);
};

const addCategory = () => {
  form.value.categoryIds.push("");
};

const removeCategory = (index) => {
  form.value.categoryIds.splice(index, 1);
};
</script>