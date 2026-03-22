<template>
  <div class="min-h-screen flex">

    <!-- LEFT -->
    <div class="w-1/2 bg-green-100 flex flex-col justify-center px-16">
      <p class="text-sm text-gray-600 mb-4">
        TRUNG TÂM THÔNG TIN
      </p>

      <h1 class="text-5xl font-bold leading-tight text-gray-800">
        THƯ VIỆN <br />
        PTIT
      </h1>

      <p class="mt-10 text-gray-600">
        Học Viện Công nghệ Bưu chính Viễn thông
      </p>
    </div>

    <!-- RIGHT -->
    <div class="w-1/2 bg-white flex items-center justify-center">
      <div class="w-[400px]">
        <!-- SLOT để nhét form -->
        <slot />
      </div>
    </div>

  </div>
</template>