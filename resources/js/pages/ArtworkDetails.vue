<template>
  <InertiaHead :title="artwork.title.en" />

  <div class="artwork-details" @keydown.left.prevent="prevImage" @keydown.right.prevent="nextImage" tabindex="0"
    @touchstart="handleTouchStart" @touchend="handleTouchEnd">
    <Button icon="pi pi-arrow-left" class="back-button" rounded text aria-label="Back" @click="goBack" />

    <div v-if="artwork" class="artwork-container">
      <div class="artwork-image">
        <div class="custom-gallery">
          <div class="gallery-main-wrapper">
            <img :src="galleryImages[currentIndex]?.itemImageSrc" class="galleria-main-image clickable"
              @click="openPreview(currentIndex)" :alt="galleryImages[currentIndex]?.alt" />
            <Button icon="pi pi-chevron-left" class="gallery-nav-button left" @click.stop="prevImage" />
            <Button icon="pi pi-chevron-right" class="gallery-nav-button right" @click.stop="nextImage" />
          </div>
          <div class="thumbnail-nav">
            <Button icon="pi pi-chevron-left" text class="thumb-nav-button" @click="scrollThumbnails('left')" />
            <div ref="thumbnailRow" class="thumbnail-row">
              <div v-for="(img, idx) in galleryImages" :key="idx" class="thumbnail-wrapper">
                <img :src="img.thumbnailImageSrc" class="galleria-thumbnail" @click="selectThumbnail(idx)"
                  :alt="img.alt" />
                <div v-if="currentIndex !== idx" class="thumbnail-overlay" />
              </div>
            </div>
            <Button icon="pi pi-chevron-right" text class="thumb-nav-button" @click="scrollThumbnails('right')" />
          </div>
        </div>
      </div>

      <div class="artwork-info">
        <div class="artwork-header">
          <h1 class="artwork-title">{{ artwork.title.en || 'Untitled' }}</h1>
          <h2 class="artwork-artist">{{ artwork.artist }}</h2>
        </div>

        <div class="artwork-details-grid">
          <div class="detail-item">
            <span class="detail-label">ID</span>
            <span class="detail-value">{{ artwork.id }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Category</span>
            <span class="detail-value">{{ artwork.category }}</span>
          </div>
          <div class="detail-item" v-if="artwork.dimensions">
            <span class="detail-label">Dimensions</span>
            <span class="detail-value">{{ artwork.dimensions }}</span>
          </div>
          <div class="detail-item" v-if="artwork.year">
            <span class="detail-label">Year</span>
            <span class="detail-value">{{ artwork.year }}</span>
          </div>
        </div>
        <div class="tags-wrapper">
          <Tag v-for="(tag, index) in parsedKeywords" :key="index" :value="tag" severity="secondary" rounded />
        </div>

        <Divider />

        <!-- Form select -->
        <ArtworkCustomizer 
        :artwork="artwork"
        />

      </div>
    </div>

    <Dialog v-model:visible="previewVisible" modal class="preview-dialog" :dismissableMask="true"
      :pt="{ content: { onKeydown: handleDialogKey, onTouchstart: handleTouchStart, onTouchend: handleTouchEnd } }">
      <div class="dialog-gallery">
        <Button icon="pi pi-chevron-left" @click="prevImage" />
        <img :src="galleryImages[currentIndex]?.itemImageSrc" class="preview-image" />
        <Button icon="pi pi-chevron-right" @click="nextImage" />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog';
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import ArtworkCustomizer from '@/components/ArtworkCustomizer.vue';

defineOptions({ layout: HeaderLayout })

const props = defineProps({
  artwork: Object
});

const artwork = computed(() => props.artwork);
console.log(artwork.value);


const parsedKeywords = computed(() => {
  const raw = artwork.value?.keywords?.en || '';
  return raw.split(',').map(k => k.trim()).filter(Boolean);
});

const galleryImages = computed(() => {
  const images = [];
  const urls = artwork.value?.urls;
  if (!urls) return images;

  if (urls.img_high) {
    images.push({
      itemImageSrc: urls.img_high,
      thumbnailImageSrc: urls.img_thumb,
      alt: artwork.value.title.en || 'Main view'
    });
  }

  if (urls.interiors && typeof urls.interiors === 'object') {
    Object.values(urls.interiors).forEach(interior => {
      images.push({
        itemImageSrc: interior.url,
        thumbnailImageSrc: interior.url,
        alt: interior['short-name'] || 'Interior view'
      });
    });
  }

  return images;
});

const previewVisible = ref(false);
const previewImage = ref('');
const currentIndex = ref(0);
const touchStartX = ref(0);
const thumbnailRow = ref(null);

function goBack() {
  if (window.history.length > 2) {
    router.visit(window.history.back());
  } else {
    router.visit(route('welcome'));
  }
}

function openPreview(index) {
  currentIndex.value = index;
  previewVisible.value = true;
  previewImage.value = galleryImages.value[index]?.itemImageSrc;
}

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % galleryImages.value.length;
  previewImage.value = galleryImages.value[currentIndex.value]?.itemImageSrc;
  scrollThumbnailIntoView();
}

function prevImage() {
  currentIndex.value = (currentIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length;
  previewImage.value = galleryImages.value[currentIndex.value]?.itemImageSrc;
  scrollThumbnailIntoView();
}

function handleTouchStart(e) {
  touchStartX.value = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
  const touchEndX = e.changedTouches[0].screenX;
  if (touchStartX.value - touchEndX > 50) nextImage();
  else if (touchEndX - touchStartX.value > 50) prevImage();
}

function handleDialogKey(e) {
  if (e.key === 'ArrowLeft') prevImage();
  else if (e.key === 'ArrowRight') nextImage();
}

function selectThumbnail(idx) {
  currentIndex.value = idx;
  scrollThumbnailIntoView();
}

function scrollThumbnailIntoView() {
  if (thumbnailRow.value) {
    const wrapper = thumbnailRow.value.children[currentIndex.value];
    wrapper?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

function scrollThumbnails(direction) {
  if (thumbnailRow.value) {
    const scrollAmount = 150;
    thumbnailRow.value.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
}

function handleAddToCart(item) {
  // Handle cart functionality here
  console.log('Adding to cart:', item);
}
</script>

<style scoped>
.artwork-details {
  padding: 1rem;
  max-width: 100vw;
  box-sizing: border-box;
  outline: none;
}

.artwork-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 100%;
  overflow-x: hidden;
  background: white;
  border-radius: 8px;
  padding: 2rem;
}

@media (min-width: 768px) {
  .artwork-container {
    flex-direction: row;
    align-items: flex-start;
  }
}

.artwork-image,
.artwork-info {
  width: 100%;
  padding: 1rem;
}

@media (min-width: 768px) {

  .artwork-image,
  .artwork-info {
    width: 50%;
  }
}

.gallery-main-wrapper {
  position: relative;
  width: 100%;
  height: 500px;
  /* Fixed height */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  /* Prevent image overflow */
}

@media (max-width: 768px) {
  .gallery-main-wrapper {
    height: 350px;
    /* Smaller height on mobile */
  }
}

.galleria-main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* Maintain aspect ratio */
  cursor: zoom-in;
  border-radius: 8px;
  padding: 1rem;
  /* Add some padding inside container */
}

.gallery-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 1.5rem;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.2s;
}

.gallery-main-wrapper:hover .gallery-nav-button {
  opacity: 1;
}

.gallery-nav-button.left {
  left: 1rem;
}

.gallery-nav-button.right {
  right: 1rem;
}

.thumbnail-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
}

.thumbnail-wrapper {
  position: relative;
}

.thumbnail-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  pointer-events: none;
}

.galleria-thumbnail {
  max-height: 60px;
  min-width: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}

.preview-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.dialog-gallery {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  flex-wrap: nowrap;
}

.dialog-nav-button {
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  border: none;
  font-size: 2rem;
  padding: 0.75rem;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

@media (max-width: 768px) {
  .dialog-gallery {
    padding: 1rem;
  }

  .dialog-nav-button {
    font-size: 1.5rem;
    padding: 0.5rem;
  }
}

.preview-dialog ::v-deep(.p-dialog-content) {
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  width: 100% !important;
}

.back-button {
  margin-bottom: 1rem;
}

.artwork-header {
  margin-bottom: 2rem;
}

.artwork-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.artwork-artist{
  font-size: 1.25rem;
  color: #666;
  font-weight: 500;
}

.artwork-details-grid {
  display: grid;
  gap: 1.5rem;
  margin: 2rem 0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.875rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block: 1rem;
}

.thumbnail-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.thumb-nav-button {
  font-size: 1.25rem;
  color: #444;
}
</style>
