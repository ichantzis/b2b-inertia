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
            'canvas-mode angled-canvas-mode': galleryImages[currentIndex].isPrimaryArtwork,
            'normal-mode': !galleryImages[currentIndex].isPrimaryArtwork
          }">
            <template v-if="galleryImages[currentIndex].isPrimaryArtwork">
              <div class="canvas-frame-wrapper">
                <img v-if="selectedCanvas.url" :src="selectedCanvas.url" alt="Canvas Frame"
                  class="canvas-frame-image" />
                <img :src="galleryImages[currentIndex].itemImageSrc" class="artwork-on-canvas clickable"
                  :alt="galleryImages[currentIndex].alt"
                  :style="{ top: selectedCanvas.artworkContainerStyle.top, left: selectedCanvas.artworkContainerStyle.left, width: selectedCanvas.artworkContainerStyle.width, height: selectedCanvas.artworkContainerStyle.height, transform: selectedCanvas.artworkTransform, transformOrigin: selectedCanvas.transformOrigin || 'center center', boxShadow: selectedCanvas.artworkShadow }"
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
          <h2 class="artwork-artist-name">
            <Tag v-if="currentArtwork.artist_username" :value="currentArtwork.artist" severity="info"
              @click="navigateToArtist(currentArtwork.artist_username)" :pt="{
                root: { class: 'text-lg md:text-xl cursor-pointer hover:brightness-95 transition-all' }
              }" />

            <span v-else>{{ currentArtwork.artist }}</span>
          </h2>
        </div>

        <div class="artwork-details-grid">
          <div class="detail-item">
            <span class="detail-label">ID</span>
            <span class="detail-value">{{ currentArtwork.id }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Category</span>
            <span class="detail-value clickable-category">
              <Tag :value="currentArtwork.category" severity="warn" @click="navigateToCategory(currentArtwork.category)"
                :pt="{
                  root: { class: 'text-sm md:text-base' }
                }" />
            </span>
          </div>
        </div>
        <div class="tags-wrapper" v-if="parsedKeywords.length > 0">
          <Tag v-for="(tag, index) in parsedKeywords" :key="index" :value="tag" severity="secondary" rounded
            @click="navigateToArtworksWithTag(tag)"
            class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150" tabindex="0"
            @keydown.enter="navigateToArtworksWithTag(tag)" @keydown.space="navigateToArtworksWithTag(tag)"
            role="link" />
        </div>

        <Divider />

        <ArtworkCustomizer :artwork="currentArtwork" :pricing-config="pricingConfig" :can-view-price="canViewPrice"
          :require-login-for-prices="requireLoginForPrices" @frame-change="handleFrameStyleChange" />
      </div>
    </div>
    <div v-else class="flex justify-center items-center h-64">
      <p>Loading artwork details or artwork not found...</p>
    </div>


    <Dialog v-model:visible="previewVisible" modal :dismissableMask="true" class="image-preview-dialog"
      :closable="false" headerClass="p-dialog-custom-header" contentClass="p-dialog-custom-content" :pt="{
        root: {
          style: {
            justifyContent: 'center',
            width: '-webkit-fill-available',
            height: '-webkit-fill-available',
            maxHeight: 'none',
            background: '#ffffff0f',
            boxShadow: 'none',
            border: 'none'
          }
        },
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
              <div class="canvas-frame-wrapper" :class="{ 'no-frame-mode': !selectedCanvas.url }"> <img
                  v-if="selectedCanvas.url" :src="selectedCanvas.url" alt="Canvas Frame" class="canvas-frame-image" />
                <img :src="galleryImages[currentIndex].itemImageSrc" class="artwork-on-canvas"
                  :alt="galleryImages[currentIndex].alt"
                  :style="{ top: selectedCanvas.artworkContainerStyle.top, left: selectedCanvas.artworkContainerStyle.left, width: selectedCanvas.artworkContainerStyle.width, height: selectedCanvas.artworkContainerStyle.height, transform: selectedCanvas.artworkTransform, transformOrigin: selectedCanvas.transformOrigin || 'center center', boxShadow: selectedCanvas.artworkShadow }" />
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
import { ref, computed, onMounted, watch } from 'vue';
import { router, Head as InertiaHead, usePage } from '@inertiajs/vue3';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog';
import HeaderLayout from '@/layouts/HeaderLayout.vue';
import ArtworkCustomizer from '@/components/ArtworkCustomizer.vue';
import { slugify } from '@/composables/utils.js';

// Αρχικές εικόνες πλαισίου (μπορεί να χρειαστεί να προσθέσετε κι άλλες)
import defaultCanvasImg from '@/../../public/images/frames/CANVAS_2X3_VERTICAL_OLIVE.png'; // Παλιό προεπιλεγμένο, τώρα 'olive'
import verticalCanvasImg from '@/../../public/images/frames/Canvas_VERTICAL.png'; // Για 'noframe' vertical
import verticalWalnutImg from '@/../../public/images/frames/vertical/VERTICAL_WALNUT.webp';
import verticalBlacklImg from '@/../../public/images/frames/vertical/VERTICAL_BLACK.webp';
import verticalNaturalImg from '@/../../public/images/frames/vertical/VERTICAL_NATURAL.webp';
import verticalCremaImg from '@/../../public/images/frames/vertical/VERTICAL_CREMA.webp';
import verticalGoldImg from '@/../../public/images/frames/vertical/VERTICAL_GOLD.webp';
import verticalMockaImg from '@/../../public/images/frames/vertical/VERTICAL_MOCKA.webp';
import verticalOakImg from '@/../../public/images/frames/vertical/VERTICAL_OAK.webp';
import verticalSilverImg from '@/../../public/images/frames/vertical/VERTICAL_SILVER.webp';
import verticalWhiteImg from '@/../../public/images/frames/vertical/VERTICAL_WHITE.webp';
import horizontalBlackImg from '@/../../public/images/frames/horizontal/HORIZONTAL_BLACK.webp';
import horizontalWhiteImg from '@/../../public/images/frames/horizontal/HORIZONTAL_WHITE.webp';
import horizontalNaturalImg from '@/../../public/images/frames/horizontal/HORIZONTAL_NATURAL.webp';
import horizontalWalnutImg from '@/../../public/images/frames/horizontal/HORIZONTAL_WALNUT.webp';
import horizontalCremaImg from '@/../../public/images/frames/horizontal/HORIZONTAL_CREMA.webp';
import horizontalGoldImg from '@/../../public/images/frames/horizontal/HORIZONTAL_GOLD.webp';
import horizontalMockaImg from '@/../../public/images/frames/horizontal/HORIZONTAL_MOCKA.webp';
import horizontalOakImg from '@/../../public/images/frames/horizontal/HORIZONTAL_OAK.webp';
import horizontalSilverImg from '@/../../public/images/frames/horizontal/HORIZONTAL_SILVER.webp';
import squareCanvasImg from '@/../../public/images/frames/square/SQUARE_BLACK.webp';
import squareBlackImg from '@/../../public/images/frames/square/SQUARE_BLACK.webp';
import squareWhiteImg from '@/../../public/images/frames/square/SQUARE_WHITE.webp';
import squareNaturalImg from '@/../../public/images/frames/square/SQUARE_NATURAL.webp';
import squareCremaImg from '@/../../public/images/frames/square/SQUARE_CREMA.webp';
import squareGoldImg from '@/../../public/images/frames/square/SQUARE_GOLD.webp';
import squareMockaImg from '@/../../public/images/frames/square/SQUARE_MOCKA.webp';
import squareOakImg from '@/../../public/images/frames/square/SQUARE_OAK.webp';
import squareSilverImg from '@/../../public/images/frames/square/SQUARE_SILVER.webp';
import squareWalnutImg from '@/../../public/images/frames/square/SQUARE_WALNUT.webp';
import squareNoFrameImg from '@/../../public/images/frames/SQUARE_NO-FRAME.jpg';

// --- ΝΕΕΣ ΕΙΣΑΓΩΓΕΣ ΓΙΑ ΑΛΛΑ ΧΡΩΜΑΤΑ/ΓΕΩΜΕΤΡΙΕΣ (ΠΡΟΣΘΕΣΤΕ ΤΙΣ ΔΙΚΕΣ ΣΑΣ ΕΔΩ) ---
// Παραδείγματα (αντικαταστήστε με τις πραγματικές διαδρομές):
// import verticalBlackFrame from '@/../../public/images/frames/VERTICAL_BLACK_FRAME.png';
// import verticalWhiteFrame from '@/../../public/images/frames/VERTICAL_WHITE_FRAME.png';
// import horizontalWhiteFrame from '@/../../public/images/frames/HORIZONTAL_WHITE_FRAME.png';
// ... και ούτω καθεξής για όλα τα χρώματα και τις γεωμετρίες (oak, crema, κλπ.)

defineOptions({ layout: HeaderLayout });

const props = defineProps({
  artwork: Object,
  error: String,
  requireLoginForPrices: Boolean,
  pricingConfig: Object
});

const page = usePage();
const user = computed(() => page.props.auth.user);

// Logic to determine if price/cart is visible
const canViewPrice = computed(() => {
    if (!props.requireLoginForPrices) return true; // If setting is off, everyone can see
    return !!user.value; // If setting is on, only logged-in users can see
});

const currentArtwork = computed(() => props.artwork);

// Νέα ref για το τρέχον επιλεγμένο στυλ πλαισίου από το Customizer
// Αρχικοποιείται σε 'black' για να ταιριάζει με την αρχική τιμή του selectedCanvas στο ArtworkCustomizer
const currentFrameStyle = ref('black');

// Δομή δεδομένων για τις διαδρομές εικόνων πλαισίου
// **ΣΗΜΑΝΤΙΚΟ**: Αντικαταστήστε τις placeholder διαδρομές ('path/to/...') με τις πραγματικές διαδρομές των εικόνων σας.
const frameColorImagePaths = {
  vertical: {
    black: verticalBlacklImg,
    white: verticalWhiteImg,
    mocka: verticalMockaImg,
    silver: verticalSilverImg,
    natural: verticalNaturalImg,
    walnut: verticalWalnutImg,
    oak: verticalOakImg,
    crema: verticalCremaImg,
    gold: verticalGoldImg,
    noframe: null,
    default: defaultCanvasImg // Fallback για vertical (π.χ., olive)
  },
  horizontal: {
    black: horizontalBlackImg,
    white: horizontalWhiteImg,
    mocka: horizontalMockaImg,
    silver: horizontalSilverImg,
    gold: horizontalGoldImg,
    natural: horizontalNaturalImg,
    walnut: horizontalWalnutImg,
    oak: horizontalOakImg,
    crema: horizontalCremaImg,
    noframe: null,
    default: horizontalBlackImg // Fallback για horizontal (π.χ., black)
  },
  square: {
    white: squareWhiteImg,
    black: squareBlackImg,
    mocka: squareMockaImg,
    silver: squareSilverImg,
    gold: squareGoldImg,
    natural: squareNaturalImg,
    walnut: squareWalnutImg,
    oak: squareOakImg,
    crema: squareCremaImg,
    noframe: null,
    default: squareCanvasImg // Fallback για square (π.χ., white)
  }
};


const primaryArtworkGeometryType = computed(() => {
  // ... (η λογική παραμένει ίδια)
  if (currentArtwork.value && currentArtwork.value.geometry) {
    const geo = currentArtwork.value.geometry.toLowerCase().split(',')[0].trim();
    if (['vertical', 'horizontal', 'square'].includes(geo)) {
      return geo;
    }
    if (geo === 'panorama') return 'horizontal';
  }
  if (currentArtwork.value && currentArtwork.value.width && currentArtwork.value.height) {
    const ratio = currentArtwork.value.width / currentArtwork.value.height;
    if (ratio > 1.1) return 'horizontal';
    if (ratio < 0.9) return 'vertical';
    return 'square';
  }
  return 'vertical';
});

const selectedCanvas = computed(() => {
  const geometry = primaryArtworkGeometryType.value;
  const style = currentFrameStyle.value; // Το στυλ που έρχεται από το Customizer

  let imageUrl;
  // Προσπάθεια εύρεσης της συγκεκριμένης εικόνας πλαισίου
  if (frameColorImagePaths[geometry] && frameColorImagePaths[geometry][style]) {
    imageUrl = frameColorImagePaths[geometry][style];
  } else if (frameColorImagePaths[geometry] && frameColorImagePaths[geometry].default) {
    imageUrl = frameColorImagePaths[geometry].default; // Fallback στο default της γεωμετρίας
  } else {
    imageUrl = defaultCanvasImg; // Γενικό fallback 
  }

  // Οι λεπτομέρειες styling βασίζονται κυρίως στη γεωμετρία.
  // **ΣΗΜΑΝΤΙΚΟ**: Αν διαφορετικά χρώματα πλαισίου για την ΙΔΙΑ γεωμετρία
  // έχουν διαφορετικές διαστάσεις, προοπτική ή πάχος περιγράμματος,
  // τότε οι τιμές artworkContainerStyle και artworkTransform θα πρέπει επίσης να προσαρμοστούν.
  // Μια πιο προηγμένη προσέγγιση θα ήταν να αποθηκεύονται αυτές οι τιμές μέσα στο frameColorImagePaths
  // για κάθε συνδυασμό χρώματος/γεωμετρίας.
  // Προς το παρόν, υποθέτουμε ότι η τοποθέτηση είναι σταθερή ανά γεωμετρία, εκτός από το 'noframe'.

  let details = {
    url: imageUrl,
    aspectRatioClass: 'aspect-ratio-default', // Θα αντικατασταθεί παρακάτω
    isAngled: false, // Προεπιλογή, θα αλλάξει ανάλογα με τη γεωμετρία/στυλ
    transformOrigin: 'center center',
    artworkContainerStyle: { top: '10%', left: '15%', width: '70%', height: '75%' }, // Γενική προεπιλογή
    artworkTransform: 'none', // Γενική προεπιλογή
    artworkShadow: '',
  };

  switch (geometry) {
    case 'vertical':
      details.aspectRatioClass = 'aspect-ratio-2-3';
      if (style === 'noframe') {
        details.url = frameColorImagePaths.vertical.noframe; // Εξασφάλιση σωστής εικόνας για noframe
        details.isAngled = false;
        details.artworkContainerStyle = { top: '11.5%', left: '23.85%', width: '50.5%', height: '76.3%!important', };
        details.artworkTransform = 'none';
        details.artworkShadow = '-5px 5px 10px rgba(0, 0, 0, 0.3), 5px -5px 10px rgba(0,0,0,0.1) inset, 0px 0px 30px rgba(0, 0, 0, 0.2)';
      } else {
        // Γενικές ρυθμίσεις για vertical πλαισία (π.χ. olive, walnut, natural, black, white)
        details.isAngled = false;
        details.artworkContainerStyle = { top: '11.5%', left: '23.85%', width: '50.5%!important', height: '76.3%!important' };
        details.artworkTransform = 'perspective(1000px)';
        details.transformOrigin = 'center left';
      }
      break;
    case 'horizontal':
      details.aspectRatioClass = 'aspect-ratio-3-2';
      if (style === 'noframe') {
        details.url = frameColorImagePaths.horizontal.noframe;
        details.isAngled = false;
        // *** ΠΡΟΣΑΡΜΟΣΤΕ ΤΟ artworkContainerStyle ΓΙΑ HORIZONTAL NOFRAME ***
        details.artworkContainerStyle = { top: '24.2%', left: '13.8%', width: '71.12%', height: '50%' }; // Placeholder
        details.artworkTransform = 'none';
        details.artworkShadow = '-5px 5px 10px rgba(0, 0, 0, 0.3), 5px -5px 10px rgba(0,0,0,0.1) inset, 0px 0px 30px rgba(0, 0, 0, 0.2)';
      } else {
        // Γενικές ρυθμίσεις για horizontal πλαισία (π.χ. black)
        // Βασισμένο στο αρχικό παράδειγμα του black angled canvas
        details.isAngled = false;
        details.artworkContainerStyle = { top: '24.2%', left: '13.8%', width: '71.12%', height: '50%' };
        details.artworkTransform = 'perspective(1000px)';
      }
      break;
    case 'square':
      details.aspectRatioClass = 'aspect-ratio-1-1';
      if (style === 'noframe') {
        details.url = frameColorImagePaths.square.noframe;
        details.isAngled = false;
        // *** ΠΡΟΣΑΡΜΟΣΤΕ ΤΟ artworkContainerStyle ΓΙΑ SQUARE NOFRAME ***
        details.artworkContainerStyle = { top: '13.65%', left: '14.68%', width: '69.7%', height: '69.7%' }; // Placeholder
        details.artworkTransform = 'none';
        details.artworkShadow = '-5px 5px 10px rgba(0, 0, 0, 0.3), 5px -5px 10px rgba(0,0,0,0.1) inset, 0px 0px 30px rgba(0, 0, 0, 0.2)';
      } else {
        // Γενικές ρυθμίσεις για square πλαισία (π.χ. white)
        // Βασισμένο στο αρχικό παράδειγμα του white angled canvas
        details.isAngled = false;
        details.artworkContainerStyle = { top: '13.65%', left: '14.68%', width: '69.7%', height: '69.7%' };
        details.artworkTransform = 'perspective(1000px)';
      }
      break;
    default: // Fallback αν η γεωμετρία είναι άγνωστη
      details.url = frameColorImagePaths.vertical.default; // Ή ένα γενικό default
      details.artworkContainerStyle = { top: '10%', left: '15%', width: '70%', height: '75%' };
      details.artworkTransform = 'none';
  }
  return details;
});


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

// Μέθοδος χειρισμού για την αλλαγή στυλ πλαισίου
function handleFrameStyleChange(newStyle) {
  currentFrameStyle.value = newStyle;
  if (galleryImages.value.length > 0) { // Έλεγχος ότι υπάρχουν εικόνες
    currentIndex.value = 0; // Επαναφορά του δείκτη στην πρώτη εικόνα
    updateCurrentImage();     // Κλήση για ενημέρωση της UI (π.χ. scroll thumbnail)
  }
}

function goBack() {
  const referrer = document.referrer;
  const currentOrigin = window.location.origin;
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
  if (window.history.length > 1) {
    if (window.history.length > 2) {
      window.history.back();
      return;
    }
  }
  router.visit(route('collections.index'), {
    preserveState: false,
    preserveScroll: true,
    onError: (errors) => {
      console.error('Failed to navigate to collections.index:', errors);
      router.visit(route('welcome'));
    }
  });
}

const generateCategorySlug = (categoryName) => {
  if (!categoryName || typeof categoryName !== 'string') {
    return '';
  }
  let slug = slugify(categoryName);
  return `cat_${currentArtwork.value.artwork_type}_${slug}`;
};

const navigateToArtist = (artistSlug) => {
  if (artistSlug) {
    router.visit(route('artist.show', { artist_slug: artistSlug }));
  }
};

const navigateToCategory = (categoryName) => {
  const categorySlug = generateCategorySlug(categoryName);
  if (categorySlug && categoryName) {
    router.visit(route('artworks', { filters: categorySlug }));
  }
};

const navigateToArtworksWithTag = (tag) => {
  if (!tag) return;

  // We want to navigate to the general 'artworks' route
  // without any existing collection or list filters from the current artwork details page.
  // The 'filters' parameter for the 'artworks' route is for path-based filters (category, geometry etc.)
  // The search term will be a query parameter.
  router.visit(route('artworks'), { // Assuming 'artworks' is the name of your general artworks listing route
    data: { search: tag.trim() }, // Pass the tag as the 'search' query parameter
    preserveState: false, // Typically false for a new search context
    preserveScroll: false, // Scroll to top of new page
  });
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

// --- IMAGE PRELOADING LOGIC ---
// This ensures that when a user clicks a color, the image is already cached
const preloadFrameImages = (geometry) => {
  const frames = frameColorImagePaths[geometry];
  if (!frames) return;

  Object.values(frames).forEach(src => {
    if (src) {
      const img = new Image();
      img.src = src;
    }
  });
};

// Watch for geometry changes to preload relevant frames
watch(primaryArtworkGeometryType, (newGeometry) => {
  if (newGeometry) {
    // Use setTimeout to not block the main thread during initial render
    setTimeout(() => preloadFrameImages(newGeometry), 1000);
  }
}, { immediate: true });

// --- RECENTLY VIEWED LOGIC ---
onMounted(() => {
  if (props.artwork) {
    addToRecentlyViewed(props.artwork);
  }
});

const addToRecentlyViewed = (item) => {
  // Console log to debug the actual structure if images still fail
  console.log("Raw Artwork Item:", item);

  const key = 'recently_viewed_items';
  let viewed = JSON.parse(localStorage.getItem(key) || '[]');

  // 1. Fix ID: API usually returns 'id', not 'artwork_id'
  const id = item.id || item.artwork_id;

  if (!id) {
    console.warn("Skipping recently viewed: No ID found on item");
    return;
  }

  // 2. Fix Title: Handle { en: "Name" } object
  let titleStr = item.title;
  if (typeof titleStr === 'object' && titleStr !== null) {
    titleStr = titleStr.en || Object.values(titleStr)[0] || 'Untitled';
  }

  // 3. Fix Image: Try multiple common API fields
  // We try 'thumb', then 'medium_url', then 'url' (if it's an image link), then 'files'
  const image = item.urls.img_thumb ||
    item.urls.img_medium ||
    item.urls.img_high ||
    '/images/placeholder.png'; // Fallback

  // Remove if already exists to prevent duplicates
  viewed = viewed.filter(i => i.artwork_id !== id);

  // Add new item
  viewed.unshift({
    artwork_id: id,
    title: titleStr,
    artist: item.artist,
    image: image
  });

  // Limit to 20 items
  if (viewed.length > 20) {
    viewed = viewed.slice(0, 20);
  }

  localStorage.setItem(key, JSON.stringify(viewed));
};

</script>

<style scoped>
.artwork-details-page {
  padding: 0rem 1rem;
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
  /* This aspect ratio should match your primary canvas image container's desired display */
  aspect-ratio: 1 / 1;
  /* Or another ratio if your frames are not meant to be in a square container */
  background-color: #f0f0f0;
  /* Fallback bg if frame image is transparent or fails */
  perspective: 1000px;
  /* Adjust perspective "depth": smaller is more extreme */
  perspective-origin: center center;
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
  /* This applies to both main view and dialog view */
  position: absolute;
  /* For main view, relative to .main-image-container */
  /* For dialog view, relative to .dialog-gallery-content .canvas-frame-wrapper if that's how it's nested */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  transform-style: preserve-3d;
  /* For 3D transformations of children */
}

.canvas-frame-image {
  /* This applies to both main view and dialog view */
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* Ensures the whole frame image is visible, respecting its aspect ratio */
  border-radius: 8px;
  /* If the image file itself has rounded corners */
}

.artwork-on-canvas {
  /* This applies to both main view and dialog view */
  position: absolute;
  /* top, left, width, height, transform are dynamically set via :style binding */
  object-fit: fill !important;
  /* Fill the container defined by dynamic styles */
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


/* Normal Image View Styling (for interiors in main view) */
.normal-image-view-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
}

.normal-image-render {
  /* For interior images in main view */
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
  text-decoration: none;
  /* Optional: to make it look more like a link */
}

.clickable-category:hover {
  color: var(--p-primary-color, #007bff);
  /* Optional: hover effect */
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
  opacity: 0;
  transition: opacity 0.2s ease-in-out, background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

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
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.thumbnail-row-container::-webkit-scrollbar {
  display: none;
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
}

.thumbnail-item.active-thumbnail {
  border-color: var(--p-primary-color, #007bff);
  transform: scale(1.05);
}

.thumbnail-image-render {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  display: block;
}


/* --- DIALOG SPECIFIC STYLING --- */
/* PrimeVue class for hiding default header */
:global(.p-dialog-custom-header) {
  display: none !important;
}

/* PrimeVue class for custom content styling of the dialog itself */
:global(.p-dialog-custom-content) {
  padding: 0 !important;
  /* Remove PrimeVue's default padding */
  border: none !important;
  box-shadow: none !important;
  /* overflow: hidden !important;  Changed from auto to hidden to prevent double scrollbars */
  background: transparent !important;
}

.p-dialog {
  background: #ffffff61 !important;
  height: -webkit-fill-available !important;
  width: -webkit-fill-available !important;
}

/* This is the direct child of .p-dialog-custom-content (the one we bind to ref="dialogContainerRef") */
.dialog-container {
  position: relative;
  width: 100%;
  /* Fill the .p-dialog-custom-content area */
  height: 100%;
  /* Fill the .p-dialog-custom-content area */
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  /* For tabindex focus */
  padding: 1rem;
  /* Padding inside the dialog so content doesn't touch edges */
  box-sizing: border-box;
}

.dialog-custom-close-btn {
  /* The X button */
  position: absolute !important;
  top: clamp(0.5rem, 3vh, 1.5rem);
  right: clamp(0.5rem, 3vw, 1.5rem);
  background-color: rgba(40, 40, 40, 0.6) !important;
  color: white !important;
  z-index: 1302;
  /* Ensures it's above other dialog content */
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
}

.dialog-custom-close-btn:hover,
.dialog-custom-close-btn:focus {
  background-color: rgba(0, 0, 0, 0.7) !important;
}

/* This is the content area within .dialog-container that holds the image or canvas */
.dialog-gallery-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* Fill the padded .dialog-container */
  height: 100%;
  /* Fill the padded .dialog-container */
  max-width: 100%;
  /* Should not exceed its parent */
  max-height: 100%;
  /* Should not exceed its parent */
  box-sizing: border-box;
}

/* Styling for the canvas frame display within the dialog */
.dialog-gallery-content .canvas-frame-wrapper {
  position: relative;
  /* Crucial for positioning .artwork-on-canvas absolutely */
  display: block;
  /* Or 'flex' if its children need it, 'block' is usually fine */
  width: auto;
  /* Let aspect-ratio and max-constraints determine size */
  height: auto;
  /* Let aspect-ratio and max-constraints determine size */
  max-width: -webkit-fill-available;
  /* Fit within .dialog-gallery-content */
  max-height: -webkit-fill-available;
  /* Fit within .dialog-gallery-content */
  /* Enforce a square container for the frame, consistent with main view's .main-image-container.canvas-mode */
  aspect-ratio: 1 / 1;
  perspective: 1000px;
  /* For 3D transforms */
  perspective-origin: center center;
  overflow: hidden;
  /* Good practice */
  /* For debugging sizing: background-color: rgba(0, 255, 0, 0.1); */
}

/* Only applies when there is NO frame image */
.dialog-gallery-content .canvas-frame-wrapper.no-frame-mode {
  /* Force it to fill the flex parent (dialog-gallery-content) */
  width: 100% !important;
  height: 100% !important;

  /* Remove any size limits */
  max-width: none !important;
  max-height: none !important;

  /* Reset aspect ratio so it doesn't force a square */
  /* aspect-ratio: unset !important; */

  /* Ensure it doesn't collapse */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important
}

.dialog-gallery-content .canvas-frame-wrapper.no-frame-mode img {
  width: auto !important;
  left: auto !important;
}

/* The actual frame image texture within the dialog's canvas-frame-wrapper */
.dialog-gallery-content .canvas-frame-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* Respects aspect ratio of the frame image itself */
}

/* The artwork image placed onto the canvas frame within the dialog */
.dialog-gallery-content .artwork-on-canvas {
  position: absolute;
  /* top, left, width, height, transform are dynamically set via :style binding */
  object-fit: fill !important;
  /* As per existing style */
}

/* For normal interior images displayed in the dialog */
.dialog-gallery-content .preview-image-render {
  display: block;
  max-width: 100%;
  /* Fit within .dialog-gallery-content */
  max-height: 100%;
  /* Fit within .dialog-gallery-content */
  width: auto;
  height: auto;
  object-fit: contain;
  /* Respects aspect ratio of the interior image */
  border-radius: 4px;
}

.dialog-nav-btn {
  /* Navigation arrows within the dialog */
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
  /* Above the displayed image/canvas but below close button if necessary */
  opacity: 0.6;
  transition: opacity 0.2s, background-color 0.2s;
}

.dialog-nav-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.6) !important;
}

.dialog-nav-btn.left {
  left: clamp(0.25rem, 1.5vw, 0.75rem);
}

.dialog-nav-btn.right {
  right: clamp(0.25rem, 1.5vw, 0.75rem);
}

.dialog-nav-btn:disabled {
  display: none;
  /* Hide if disabled */
}


/* General Artwork Information Styles */
.back-button {
  margin-bottom: 1rem;
  align-self: flex-start;
}

.artwork-header {
  margin-bottom: 1.5rem;
}

.artwork-title-text {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.artwork-artist-name {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: #4a5568;
  font-weight: 500;
}

.artwork-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 1.2rem;
  color: #2d3748;
  font-weight: 500;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1.5rem 0;
}
</style>