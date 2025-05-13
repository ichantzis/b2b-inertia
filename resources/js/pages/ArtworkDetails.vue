<template>
  <InertiaHead :title="currentArtwork?.title?.en || 'Artwork Details'" />
  <Button icon="pi pi-arrow-left" class="back-button" rounded severity="secondary" variant="text" size="large"
    aria-label="Back" @click="goBack" />

  <div class="artwork-details-page" @keydown.left.prevent="prevImage" @keydown.right.prevent="nextImage" tabindex="0"
    @touchstart="handleTouchStart" @touchend="handleTouchEnd">
    <div v-if="currentArtwork" class="artwork-content-container">
      <div class="artwork-display-area">

        <template v-if="galleryImages.length > 0 && galleryImages[currentIndex]">
          <div class="main-image-container" :class="{
            'canvas-mode angled-canvas-mode': galleryImages[currentIndex].isPrimaryArtwork, // Added new class for angled canvas
            'normal-mode': !galleryImages[currentIndex].isPrimaryArtwork
          }">
            <template v-if="galleryImages[currentIndex].isPrimaryArtwork">
              <div class="canvas-frame-wrapper">
                <img :src="selectedCanvas.url" alt="Canvas Frame" class="canvas-frame-image" />
                <img :src="galleryImages[currentIndex].itemImageSrc" class="artwork-on-canvas clickable"
                  :alt="galleryImages[currentIndex].alt"
                  :style="{ top: selectedCanvas.artworkContainerStyle.top, left: selectedCanvas.artworkContainerStyle.left, width: selectedCanvas.artworkContainerStyle.width, height: selectedCanvas.artworkContainerStyle.height, transform: selectedCanvas.artworkTransform, transformOrigin: selectedCanvas.transformOrigin || 'center center' }"
                  @click="openPreview(currentIndex)" />
              </div>
            </template>

            <template v-else>
              <div class="normal-image-view-wrapper">
                <img :src="galleryImages[currentIndex].itemImageSrc" class="normal-image-render clickable"
                  :alt="galleryImages[currentIndex].alt" @click="openPreview(currentIndex)" />
              </div>
            </template>

            <Button icon="pi pi-chevron-left" class="gallery-nav-button left" @click.stop="prevImage"
              :disabled="galleryImages.length <= 1" />
            <Button icon="pi pi-chevron-right" class="gallery-nav-button right" @click.stop="nextImage"
              :disabled="galleryImages.length <= 1" />
          </div>
        </template>
        <template v-else>
          <div class="main-image-container normal-mode">
            <div class="artwork-placeholder-on-canvas">
              Artwork image not available
            </div>
          </div>
        </template>
        <div v-if="galleryImages.length > 1" class="thumbnail-navigation mt-4">
          <Button icon="pi pi-chevron-left" text class="thumb-nav-button" @click="scrollThumbnails('left')"
            :disabled="galleryImages.length <= 1" />
          <div ref="thumbnailRowRef" class="thumbnail-row-container">
            <div v-for="(img, idx) in galleryImages" :key="img.itemImageSrc + idx" class="thumbnail-item"
              :class="{ 'active-thumbnail': currentIndex === idx }" @click="selectThumbnail(idx)">
              <img :src="img.thumbnailImageSrc" class="thumbnail-image-render" :alt="img.alt" />
            </div>
          </div>
          <Button icon="pi pi-chevron-right" text class="thumb-nav-button" @click="scrollThumbnails('right')"
            :disabled="galleryImages.length <= 1" />
        </div>
      </div>

      <div class="artwork-information">
        <div class="artwork-header">
          <h1 class="artwork-title-text">{{ currentArtwork.title?.en || 'Untitled' }}</h1>
          <h2 class="artwork-artist-name">{{ currentArtwork.artist }}</h2>
        </div>

        <div class="artwork-details-grid">
          <div class="detail-item">
            <span class="detail-label">ID</span>
            <span class="detail-value">{{ currentArtwork.id }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Category</span>
            <span class="detail-value clickable-category" @click="navigateToCategory(currentArtwork.category)">
              {{ currentArtwork.category }}
            </span>
          </div>
          <!-- <div class="detail-item" v-if="currentArtwork.width && currentArtwork.height">
            <span class="detail-label">Dimensions</span>
            <span class="detail-value">{{ Math.round(currentArtwork.width / 10) }} x {{ Math.round(currentArtwork.height
              / 10)
            }} cm (approx)</span>
          </div>
          <div class="detail-item" v-if="currentArtwork.artwork_type">
            <span class="detail-label">Type</span>
            <span class="detail-value">{{ currentArtwork.artwork_type }}</span>
          </div> -->
        </div>
        <div class="tags-wrapper" v-if="parsedKeywords.length > 0">
          <Tag v-for="(tag, index) in parsedKeywords" :key="index" :value="tag" severity="secondary" rounded />
        </div>

        <Divider />

        <ArtworkCustomizer :artwork="currentArtwork" />
      </div>
    </div>
    <div v-else class="flex justify-center items-center h-64">
      <p>Loading artwork details or artwork not found...</p>
    </div>


    <Dialog v-model:visible="previewVisible" modal :dismissableMask="true" class="image-preview-dialog"
      :closable="false" headerClass="p-dialog-custom-header" contentClass="p-dialog-custom-content" :pt="{
        mask: { style: 'backdrop-filter: blur(5px); background-color: rgba(0,0,0,0.85);' }
      }">
      <div class="dialog-container" @keydown="handleDialogKey" @touchstart="handleTouchStart" @touchend="handleTouchEnd"
        tabindex="-1" ref="dialogContainerRef">
        <Button icon="pi pi-times" class="dialog-custom-close-btn" @click="previewVisible = false" text rounded
          aria-label="Close" />

        <div class="dialog-gallery-content">

          <Button icon="pi pi-chevron-left" @click.stop="prevImage" class="dialog-nav-btn left"
            :disabled="galleryImages.length <= 1" />

          <template v-if="galleryImages.length > 0 && galleryImages[currentIndex]">
            <template v-if="galleryImages[currentIndex].isPrimaryArtwork">
              <div>
                <img :src="selectedCanvas.url" alt="Canvas Frame" />
                <img :src="galleryImages[currentIndex].itemImageSrc" class="artwork-on-canvas"
                  :alt="galleryImages[currentIndex].alt"
                  :style="{ top: selectedCanvas.artworkContainerStyle.top, left: selectedCanvas.artworkContainerStyle.left, width: selectedCanvas.artworkContainerStyle.width, height: selectedCanvas.artworkContainerStyle.height, transform: selectedCanvas.artworkTransform, transformOrigin: selectedCanvas.transformOrigin || 'center center' }" />
              </div>
            </template>
            <template v-else>
              <img :src="galleryImages[currentIndex].itemImageSrc" class="preview-image-render"
                :alt="galleryImages[currentIndex].alt" />
            </template>
          </template>
          <template v-else>
            <div class="artwork-placeholder-on-canvas">Image not available</div>
          </template>

          <Button icon="pi pi-chevron-right" @click.stop="nextImage" class="dialog-nav-btn right"
            :disabled="galleryImages.length <= 1" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
// ... (imports remain the same)
import { ref, computed, onMounted } from 'vue';
import { router, Head as InertiaHead } from '@inertiajs/vue3';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog';
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import ArtworkCustomizer from '@/components/ArtworkCustomizer.vue';
import defaultCanvasImg from '@/../../public/images/frames/CANVAS_2X3_VERTICAL_OLIVE.png'; // Your previous canvas
import verticalCanvasImg from '@/../../public/images/frames/Canvas_VERTICAL.png'; // Your previous canvas
import verticalWalnutImg from '@/../../public/images/frames/VERTICAL_WALNUT.jpg';
import verticalNaturalImg from '@/../../public/images/frames/VERTICAL_NATURAL.jpg';
import horizontalCanvasImg from '@/../../public/images/frames/CANVAS_2X3_HORIZONTAL_BLACK.png'; // Your previous canvas
import squareCanvasImg from '@/../../public/images/frames/100X100_ANGLED_WHITE.png'; // Your previous canvas
// import defaultCanvasImg from '@/../../public/images/frames/Canvas_100x70_VERTICAL_FRONT.png'; // Your previous canvas
// Import your new angled canvas - ensure this path is correct for your project setup
// For Vite/Vue CLI, placing in `public` and using absolute path `/` is common.
// If using imports for assets, ensure your build process handles it.
import { slugify } from '@/composables/utils.js';


defineOptions({ layout: HeaderLayout });

const props = defineProps({
  artwork: Object
});

// *** IMPORTANT: Update this to your new angled canvas path ***
// const canvasDynamicUrl = ref('@/../../public//images/frames/CANVAS_2X3_VERTICAL_OLIVE.png'); 
const canvasDynamicUrl = ref(defaultCanvasImg); // If you want to switch or have a default

const canvasImagePaths = {
  vertical: verticalCanvasImg,
  horizontal: horizontalCanvasImg,
  square: squareCanvasImg,
  default: defaultCanvasImg // Fallback
};

const currentArtwork = computed(() => props.artwork);

const primaryArtworkGeometryType = computed(() => {
  if (currentArtwork.value && currentArtwork.value.geometry) {
    const geo = currentArtwork.value.geometry.toLowerCase().split(',')[0].trim();
    if (['vertical', 'horizontal', 'square'].includes(geo)) {
      return geo;
    }
    if (geo === 'panorama') return 'horizontal'; // Treat panorama as horizontal for canvas selection
  }
  // Determine from aspect ratio if geometry is not explicit or unclear
  if (currentArtwork.value && currentArtwork.value.width && currentArtwork.value.height) {
    const ratio = currentArtwork.value.width / currentArtwork.value.height;
    if (ratio > 1.1) return 'horizontal';
    if (ratio < 0.9) return 'vertical';
    return 'square';
  }
  return 'vertical'; // Default if no info
});

const selectedCanvas = computed(() => {
  const geometry = primaryArtworkGeometryType.value;
  let details = {
    url: canvasImagePaths.default,
    aspectRatioClass: 'aspect-ratio-2-3', // Default for vertical olive canvas
    isAngled: true, // Default assumption for olive canvas
    transformOrigin: 'center center',
    // IMPORTANT: Default positioning and transform for the VERTICAL OLIVE canvas
    // These MUST be fine-tuned by measuring your specific CANVAS_2X3_VERTICAL_OLIVE.jpg
    artworkContainerStyle: { top: '10%', left: '15%', width: '70%', height: '75%' }, // Example
    // artworkTransform: 'perspective(1000px) rotateY(14deg)', // Example
  };

  switch (geometry) {
    case 'vertical':
      details.url = canvasImagePaths.vertical;
      details.aspectRatioClass = 'aspect-ratio-2-3'; // e.g., for CANVAS_2X3_VERTICAL_OLIVE.jpg
      details.isAngled = false; // Assuming the olive one is angled
      // Fine-tune these for CANVAS_2X3_VERTICAL_OLIVE.jpg
      // details.artworkContainerStyle = { top: '21.3%', left: '33.6%', width: '37.1%!important', height: '58.4%!important' }; // Angled versiom
      details.artworkContainerStyle = { top: '23%', left: '30.6%', width: '37.3%!important', height: '53.4%!important' };
      // details.artworkTransform = 'perspective(1000px) rotateY(14deg)'; // Needs exact values
      // details.transformOrigin = 'center left'; // Example, might need adjustment
      break;
    case 'horizontal':
      details.url = canvasImagePaths.horizontal;
      details.aspectRatioClass = 'aspect-ratio-3-2'; // e.g., for CANVAS_2X3_HORIZONTAL_BLACK.jpg
      details.isAngled = true; // Assuming the black horizontal one is flat
      // Fine-tune these for CANVAS_2X3_HORIZONTAL_BLACK.jpg (likely simpler if not angled)
      details.artworkContainerStyle = { top: '31%', left: '23.9%', width: '56.8%!important', height: '38.8%!important' }; // Needs exact values
      details.artworkTransform = 'perspective(1000px) rotateY(17deg)'; // Needs exact values
      break;
    case 'square':
      details.url = canvasImagePaths.square;
      details.aspectRatioClass = 'aspect-ratio-1-1'; // e.g., for 100X100_ANGLED_WHITE.jpg
      details.isAngled = true; // Assuming the "ANGLED" in filename means it needs perspective
      // Fine-tune these for 100X100_ANGLED_WHITE.jpg
      details.artworkContainerStyle = { top: '23.7%', left: '28.9%', width: '49.8%!important', height: '51.6%!important' }; // Needs exact values
      details.artworkTransform = 'perspective(1000px) rotateY(18deg)'; // Needs exact values
      // details.transformOrigin = 'center center';
      break;
  }
  return details;
});


// ... (parsedKeywords, galleryImages computed properties remain the same as your last version)
const parsedKeywords = computed(() => {
  const raw = currentArtwork.value?.keywords?.en || '';
  return raw.split(',').map(k => k.trim()).filter(Boolean).slice(0, 10);
});

const galleryImages = computed(() => {
  const images = [];
  const art = currentArtwork.value;
  if (!art || !art.urls) return images;
  const urls = art.urls;

  if (urls.img_high) {
    images.push({
      itemImageSrc: urls.img_medium || urls.img_high,
      thumbnailImageSrc: urls.img_thumb || urls.img_high,
      alt: art.title?.en || 'Main Artwork View',
      isPrimaryArtwork: true
    });
  }
  if (urls.interiors && typeof urls.interiors === 'object') {
    Object.values(urls.interiors).forEach(interior => {
      if (interior.url) {
        images.push({
          itemImageSrc: interior.url,
          thumbnailImageSrc: interior.url,
          alt: interior['short-name'] || 'Interior View',
          isPrimaryArtwork: false
        });
      }
    });
  }
  return images;
});

const previewVisible = ref(false);
const currentIndex = ref(0);
const touchStartX = ref(0);
const thumbnailRowRef = ref(null);

function goBack() {
  const referrer = document.referrer;
  const currentOrigin = window.location.origin;

  // Attempt 1: If there's a referrer and it's from the same origin, use browser back.
  // This is usually the most natural "back" if the user navigated within your app.
  // Also check history.length > 1 to ensure there's something to go back to.
  if (referrer) {
    try {
      const referrerOrigin = new URL(referrer).origin;
      if (referrerOrigin === currentOrigin && window.history.length > 1) {
        window.history.back();
        return;
      }
    } catch (e) {
      console.warn('Could not parse document.referrer URL:', e);
    }
  }

  // Attempt 2: Check Inertia's state in history (less direct, but often useful)
  // Inertia's state often contains a `url` property for the current page.
  // We can't directly get the "previous" Inertia URL from here easily without a custom stack.
  // However, if we know we are not on the first page of the history stack for the current SPA session.
  if (window.history.length > 1) {
    // If referrer is empty but history length > 1, it might be an in-app navigation
    // where referrer was lost or not set (e.g. router.replace).
    // In this case, window.history.back() might still be the best bet if it doesn't
    // take them out of the app. This is tricky without more context on how they got there.
    // A common pattern: If the user opened the link in a new tab, referrer is empty.
    // In such cases, going "back" isn't meaningful, so fallback is better.

    // A slightly more cautious approach if referrer is empty:
    // Only go back if there's substantial history, suggesting multiple in-app navigations.
    if (window.history.length > 2) { // Keep your original threshold if preferred
      window.history.back();
      return;
    }
  }


  // Attempt 3: Fallback to a predefined route if other methods are not suitable.
  router.visit(route('collections.index'), {
    preserveState: false, // Or true, depending on desired behavior
    preserveScroll: true,
    onError: (errors) => {
      console.error('Failed to navigate to collections.index:', errors);
      // Absolute fallback if 'collections.index' route fails for some reason
      router.visit(route('welcome'));
    }
  });
}

const generateCategorySlug = (categoryName) => {
  if (!categoryName || typeof categoryName !== 'string') {
    return '';
  }
  let slug = slugify(categoryName);
  // // Replace spaces with hyphens to match example format like "text-&-quotes" or "creative-edit"
  // slug = slug.replace(/\s+/g, '-');
  // Prepend "cat_"
  return `cat_${currentArtwork.value.artwork_type}_${slug}`;
};

const navigateToCategory = (categoryName) => {
  const categorySlug = generateCategorySlug(categoryName);
  if (categorySlug && categoryName) { // Ensure categoryName is not empty to avoid "cat_" slug
    // Assumes 'artworks' is the correct route name from web.php
    // and it accepts 'filters' as a parameter.
    router.visit(route('artworks', { filters: categorySlug }));
  }
};

function openPreview(index) {
  if (galleryImages.value[index]) {
    currentIndex.value = index;
    previewVisible.value = true;
  }
}
function updateCurrentImage() {
  if (galleryImages.value.length > 0) {
    scrollThumbnailIntoView();
  }
}
function nextImage() {
  if (galleryImages.value.length <= 1) return;
  currentIndex.value = (currentIndex.value + 1) % galleryImages.value.length;
  updateCurrentImage();
}
function prevImage() {
  if (galleryImages.value.length <= 1) return;
  currentIndex.value = (currentIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length;
  updateCurrentImage();
}
function handleTouchStart(e) {
  touchStartX.value = e.changedTouches[0].screenX;
}
function handleTouchEnd(e) {
  const touchEndX = e.changedTouches[0].screenX;
  if (touchStartX.value - touchEndX > 50) {
    nextImage();
  } else if (touchEndX - touchStartX.value > 50) {
    prevImage();
  }
}
function handleDialogKey(e) {
  if (e.key === 'ArrowLeft') prevImage();
  else if (e.key === 'ArrowRight') nextImage();
  else if (e.key === 'Escape') previewVisible.value = false;
}
function selectThumbnail(idx) {
  currentIndex.value = idx;
  updateCurrentImage();
}
function scrollThumbnailIntoView() {
  if (thumbnailRowRef.value && thumbnailRowRef.value.children[currentIndex.value]) {
    const activeThumbnail = thumbnailRowRef.value.children[currentIndex.value];
    activeThumbnail.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}
function scrollThumbnails(direction) {
  if (thumbnailRowRef.value) {
    const scrollAmount = thumbnailRowRef.value.clientWidth * 0.7;
    thumbnailRowRef.value.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
}

</script>

<style scoped>
.artwork-details-page {
  padding: 1rem;
  max-width: 100vw;
  /* Ensure it doesn't exceed viewport width */
  box-sizing: border-box;
  outline: none;
  /* For tabindex focus, can be removed if not needed */
}

.artwork-content-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 100%;
  /* Full width within its parent */
  overflow-x: hidden;
  /* Prevent horizontal scroll on this container */
  background: #ffffff;
  border-radius: 8px;
  padding: clamp(1rem, 2.5vw, 2rem);
  /* Responsive padding */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

@media (min-width: 1024px) {

  /* lg breakpoint */
  .artwork-content-container {
    flex-direction: row;
    align-items: flex-start;
    /* Align items to the top */
  }
}

.artwork-display-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Center canvas frame and thumbnails */
}

.artwork-information {
  width: 100%;
  padding: 0.5rem;
  /* Small padding for the info column content */
}

@media (min-width: 1024px) {
  .artwork-display-area {
    width: 60%;
    /* Adjust width split as desired */
    max-width: 700px;
    /* Optional: max-width for display area */
    position: sticky;
    /* Make image area sticky on large screens */
    top: 1rem;
    /* Adjust top offset as needed for sticky position */
    align-self: flex-start;
    /* Ensure it aligns with the top of info column */
  }

  .artwork-information {
    width: 40%;
  }
}

/* Common container for main image area to define boundaries and relative positioning */
.main-image-container {
  position: relative;
  width: 100%;
  max-width: 550px;
  /* Max width for the image display block */
  margin: 0 auto;
  /* Center the block */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  /* Transparent for canvas mode */
  border-radius: 8px;
  /* overflow: hidden; /* Can hide parts of nav buttons if they protrude */
}

/* Specific styling for when in canvas mode, especially the angled one */
.main-image-container.canvas-mode.angled-canvas-mode {
  /* This aspect ratio MUST match your angled canvas image file exactly */
  /* e.g., if CANVAS_2X3_VERTICAL_OLIVE.jpg is 2000px wide and 3000px tall, ratio is 2/3 */
  aspect-ratio: 1 / 1;
  background-color: #f0f0f0;
  /* Fallback bg if frame image is transparent or fails */
  perspective: 1000px;
  /* Adjust perspective "depth": smaller is more extreme */
  perspective-origin: center center;
  /* Or adjust as needed */
}

/* Styling for when displaying normal images (interiors) */
.main-image-container.normal-mode {
  aspect-ratio: 1 / 1;
  /* Or 4/3, 16/9 - a sensible default for various images */
  max-height: 550px;
  /* Constraint for normal images */
  background-color: #f9fafb;
  /* Light background for normal image view */
}


/* Canvas Frame Styling (when galleryImages[currentIndex].isPrimaryArtwork is true) */
.canvas-frame-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* Fill the parent .main-image-container */
  width: 100%;
  height: 100%;
  border-radius: 8px;
  /* If the container itself should be rounded */
  overflow: hidden;
  /* Important if the frame image is larger than container */
  /* For 3D transformations of children if needed */
  transform-style: preserve-3d;
}

.canvas-frame-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* Or 'cover'. 'Contain' ensures the whole frame image is visible */
  /* If frame image has transparent areas and should scale, 'contain' is good */
  border-radius: 8px;
  /* If the image file itself has rounded corners */
}

.artwork-on-canvas {
  position: absolute;
  /* top: 21.3%;
  left: 33.6%;
  width: 37.1% !important;
  height: 58.4% !important; */
  object-fit: fill !important;
  /* Fill the container */
}



/* Placeholder for when artwork image isn't available */
.artwork-placeholder-on-canvas {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 0.9rem;
  background-color: #f0f0f0;
  border-radius: 8px;
  text-align: center;
  padding: 1rem;
}

/* Ensure placeholder also fills container in normal mode if positioned absolutely */
.main-image-container.normal-mode .artwork-placeholder-on-canvas {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}


/* Normal Image View Styling (for interiors) */
.normal-image-view-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* Fill the parent .main-image-container */
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
}

.normal-image-render {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: zoom-in;
  border-radius: 4px;
}

.clickable {
  /* Generic class for zoom-in cursor */
  cursor: zoom-in;
}

.clickable-category {
  cursor: pointer;
  text-decoration: none; /* Optional: to make it look more like a link */
}
.clickable-category:hover {
  color: var(--p-primary-color, #007bff); /* Optional: hover effect */
}


/* Gallery Navigation Buttons (common for both modes, positioned on .main-image-container) */
.gallery-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.25rem;
  z-index: 10;
  /* Above the images */
  opacity: 0;
  transition: opacity 0.2s ease-in-out, background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Show nav buttons when hovering the parent container */
.main-image-container:hover .gallery-nav-button {
  opacity: 1;
}

.gallery-nav-button:hover {
  background-color: rgba(0, 0, 0, 0.6);
}

.gallery-nav-button.left {
  left: 0.75rem;
}

.gallery-nav-button.right {
  right: 0.75rem;
}

.gallery-nav-button:disabled {
  opacity: 0.2 !important;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.2) !important;
}


/* Thumbnail Navigation Styling */
.thumbnail-navigation {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 550px;
  /* Match main image container max-width */
  margin: 1rem auto 0 auto;
  /* Center below main image */
}

.thumb-nav-button {
  font-size: 1.25rem;
  color: #555;
  /* Darker color for better visibility */
  flex-shrink: 0;
}

.thumb-nav-button:disabled {
  color: #ccc;
  cursor: default;
}

.thumbnail-row-container {
  display: flex;
  flex-grow: 1;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.25rem 0;
  /* Small vertical padding for aesthetics */
  -ms-overflow-style: none;
  /* Hide scrollbar for IE and Edge */
  scrollbar-width: none;
  /* Hide scrollbar for Firefox */
}

.thumbnail-row-container::-webkit-scrollbar {
  display: none;
  /* Hide scrollbar for Chrome, Safari, and Opera */
}

.thumbnail-item {
  position: relative;
  flex-shrink: 0;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 6px;
  transition: border-color 0.2s ease, transform 0.2s ease;
  height: 64px;
  width: 64px;
  overflow: hidden;
  background-color: #e9ecef;
  /* Placeholder bg for thumbnails */
}

.thumbnail-item.active-thumbnail {
  border-color: var(--p-primary-color, #007bff);
  /* Use PrimeVue primary color or fallback */
  transform: scale(1.05);
  /* Slight zoom for active thumbnail */
}

.thumbnail-image-render {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Ensure thumbnail image covers its area */
  border-radius: 4px;
  /* Inner radius if border is visible */
  display: block;
}


/* Dialog Styling */
.image-preview-dialog .p-dialog-content {
  /* Target PrimeVue's generated class */
  background: transparent !important;
  padding: 0 !important;
  border: none !important;
  box-shadow: none !important;
  overflow: auto;
  /* Important for clean look */
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-gallery-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  /* let it size itself, up to a limit of the viewport */
  width: 90vw;
  height: auto;
  max-width: 90vw;
  max-height: 90vh;

  /* if you do want scrollbars when the image really is enormous: */
  /* overflow: auto; */
}


.preview-image-render {
  display: block;

  /* maintain aspect ratio, but never exceed the container */
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;

  /* guarantees no cropping — it’ll letterbox inside the box */
  object-fit: contain;
  /* or object-fit: scale-down; */
  border-radius: 4px;
}

.dialog-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(30, 30, 30, 0.6) !important;
  color: white !important;
  border: none !important;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  z-index: 1301;
  /* Ensure above dialog content, PrimeVue dialogs can have high z-index */
  opacity: 0.7;
  transition: opacity 0.2s, background-color 0.2s;
}

.dialog-nav-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.7) !important;
}

.dialog-nav-btn.left {
  left: 1rem;
}

.dialog-nav-btn.right {
  right: 1rem;
}

.dialog-nav-btn:disabled {
  display: none;
}

/* Hide if disabled */

.dialog-close-btn {
  position: absolute !important;
  /* Important to override PrimeVue styles if necessary */
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(30, 30, 30, 0.6) !important;
  color: white !important;
  z-index: 1301;
  width: 2.5rem;
  height: 2.5rem;
}

.dialog-close-btn:hover {
  background-color: rgba(0, 0, 0, 0.7) !important;
}


/* General Artwork Information Styles */
.back-button {
  /* If you re-enable it */
  margin-bottom: 1rem;
  align-self: flex-start;
}

.artwork-header {
  margin-bottom: 1.5rem;
}

.artwork-title-text {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  /* Responsive title size */
  font-weight: 700;
  color: #2d3748;
  /* Tailwind gray-800 */
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.artwork-artist-name {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  /* Responsive artist name */
  color: #4a5568;
  /* Tailwind gray-600 */
  font-weight: 500;
}

.artwork-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  /* Responsive grid for details */
  gap: 1rem;
  margin: 1.5rem 0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.8rem;
  color: #718096;
  /* Tailwind gray-500 */
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 0.95rem;
  color: #2d3748;
  font-weight: 500;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

/* --- DIALOG SPECIFIC STYLING --- */
/* PrimeVue class for custom header styling */
:global(.p-dialog-custom-header) {
  /* Use :global for classes applied by PrimeVue internally */
  display: none !important;
}

/* PrimeVue class for custom content styling */
:global(.p-dialog-custom-content) {
  padding: 0 !important;
  border: none !important;
  box-shadow: none !important;
  overflow: auto !important;
  background: transparent !important;
  /* Ensure no default background */
}

.dialog-container {
  position: relative;
  /* For absolute positioning of close button */
  width: 100%;
  /* Occupy the space given by Dialog component (which is full screen by default for modal) */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  /* For tabindex focus */
  padding: 1rem;
  /* Add some padding so content doesn't touch edges */
  box-sizing: border-box;
}

.dialog-custom-close-btn {
  position: absolute !important;
  top: clamp(0.5rem, 3vh, 1.5rem);
  /* Responsive based on viewport height */
  right: clamp(0.5rem, 3vw, 1.5rem);
  /* Responsive based on viewport width */
  background-color: rgba(40, 40, 40, 0.6) !important;
  /* Slightly darker, more contrast */
  color: white !important;
  z-index: 1302;
  /* Ensure above gallery content */
  width: 2.75rem;
  height: 2.75rem;
  /* Slightly larger */
  border-radius: 50%;
}

.dialog-custom-close-btn:hover,
.dialog-custom-close-btn:focus {
  background-color: rgba(0, 0, 0, 0.7) !important;
}

.dialog-gallery-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  /* Max size relative to the .dialog-container's padding */
  max-width: 100%;
  /* Will be constrained by dialog-container's effective max-width */
  max-height: 100%;
  /* Will be constrained by dialog-container's effective max-height */
  box-sizing: border-box;
}

/* Aspect ratio classes for dialog canvas mode */
.dialog-gallery-content.dialog-canvas-mode {
  background-color: transparent;
  /* Transparent background for canvas view in dialog */
}

.dialog-gallery-content.dialog-canvas-mode.aspect-ratio-2-3 {
  aspect-ratio: 1 / 1;
}

.dialog-gallery-content.dialog-canvas-mode.aspect-ratio-3-2 {
  aspect-ratio: 1 / 1;
}

.dialog-gallery-content.dialog-canvas-mode.aspect-ratio-1-1 {
  aspect-ratio: 1 / 1;
}

.dialog-gallery-content.dialog-canvas-mode.aspect-ratio-default {
  aspect-ratio: 1 / 1;
}

.dialog-gallery-content.dialog-canvas-mode.perspective-view {
  perspective: 1000px;
  /* Same as main view, or adjust for dialog size */
  perspective-origin: center center;
}

/* Canvas elements within the Dialog */
/* These will use the same classes: .canvas-frame-wrapper, .canvas-frame-image, 
   .artwork-transform-origin-container, .artwork-on-canvas. 
   Their parent (.dialog-gallery-content in canvas-mode) dictates their overall size and perspective.
*/
.dialog-gallery-content .canvas-frame-wrapper {
  /* Already position:absolute, width:100%, height:100% from shared styles */
}

/* Normal image render inside dialog */
.dialog-gallery-content.dialog-normal-mode {
  /* No specific aspect ratio needed, image will define it up to container bounds */
}

.preview-image-render {
  /* This is for normal interior images in dialog */
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  /* Ensures entire image is visible and maintains aspect ratio */
  border-radius: 4px;
}

.dialog-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(30, 30, 30, 0.5) !important;
  color: white !important;
  border: none !important;
  border-radius: 50%;
  width: clamp(2.5rem, 6vw, 3.5rem);
  height: clamp(2.5rem, 6vw, 3.5rem);
  z-index: 10;
  opacity: 0.6;
  transition: opacity 0.2s, background-color 0.2s;
}

.dialog-nav-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.6) !important;
}

.dialog-nav-btn.left {
  left: clamp(0.25rem, 1.5vw, 0.75rem);
  /* Closer to the edge of the image content */
}

.dialog-nav-btn.right {
  right: clamp(0.25rem, 1.5vw, 0.75rem);
}

.dialog-nav-btn:disabled {
  display: none;
}
</style>