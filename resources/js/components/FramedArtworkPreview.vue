<template>
    <div class="relative w-full h-full select-none aspect-square">
        <img 
            v-if="selectedCanvas.url" 
            :src="selectedCanvas.url" 
            class="absolute inset-0 w-full h-full object-contain pointer-events-none" 
            alt="Frame"
        />
        
        <img 
            v-if="artworkImage"
            :src="artworkImage" 
            class="absolute object-cover"
            :style="artworkStyle"
            alt="Artwork"
        />

        <div v-else class="absolute inset-0 flex items-center justify-center bg-gray-100 text-xs text-gray-400">
            No Img
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

// --- Imports Εικόνων Κορνίζας (Αντιγραφή από ArtworkDetails) ---
import defaultCanvasImg from '@/../../public/images/frames/CANVAS_2X3_VERTICAL_OLIVE.png';
import verticalCanvasImg from '@/../../public/images/frames/Canvas_VERTICAL.png';
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

const props = defineProps({
    artworkImage: String,
    frame: String,   // π.χ. "Black", "No Frame", "Walnut"
    size: String,    // π.χ. "50x70"
    type: String     // π.χ. "Canvas (Framed)" (προαιρετικό, για extra checks)
});

// Mapping δεδομένων
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
    default: defaultCanvasImg 
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
    default: horizontalBlackImg
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
    default: squareCanvasImg
  }
};

// Υπολογισμός Γεωμετρίας από το μέγεθος (π.χ. "50x70")
const geometry = computed(() => {
    if (!props.size) return 'vertical';
    
    const parts = props.size.toLowerCase().split('x');
    if (parts.length !== 2) return 'vertical';

    const w = parseFloat(parts[0]);
    const h = parseFloat(parts[1]);

    if (isNaN(w) || isNaN(h)) return 'vertical';
    if (w === h) return 'square';
    if (w > h) return 'horizontal';
    return 'vertical';
});

// Κανονικοποίηση ονόματος χρώματος (π.χ. "No Frame" -> "noframe", "Black" -> "black")
const normalizedFrameStyle = computed(() => {
    if (!props.frame) return 'black'; // Default
    const raw = props.frame.toLowerCase().replace(/\s+/g, ''); // "No Frame" -> "noframe"
    return raw;
});

// Επιλογή σωστής εικόνας και styles (ίδια λογική με ArtworkDetails)
const selectedCanvas = computed(() => {
    const geo = geometry.value;
    const style = normalizedFrameStyle.value;

    let imageUrl;
    if (frameColorImagePaths[geo] && frameColorImagePaths[geo][style]) {
        imageUrl = frameColorImagePaths[geo][style];
    } else if (frameColorImagePaths[geo] && frameColorImagePaths[geo].default) {
        imageUrl = frameColorImagePaths[geo].default;
    } else {
        imageUrl = defaultCanvasImg;
    }

    // Default configuration
    let details = {
        url: imageUrl,
        artworkContainerStyle: { top: '10%', left: '15%', width: '70%', height: '75%' },
        artworkShadow: '',
    };

    // Specific Configurations per Geometry/Style
    switch (geo) {
        case 'vertical':
            if (style === 'noframe') {
                details.url = frameColorImagePaths.vertical.noframe;
                details.artworkContainerStyle = { top: '11.5%', left: '23.85%', width: '50.5%', height: '76.3%' };
                details.artworkShadow = '-2px 2px 5px rgba(0, 0, 0, 0.3)';
            } else {
                details.artworkContainerStyle = { top: '11.5%', left: '23.85%', width: '50.5%', height: '76.5%' };
            }
            break;
        case 'horizontal':
            if (style === 'noframe') {
                details.url = frameColorImagePaths.horizontal.noframe;
                details.artworkContainerStyle = { top: '24.2%', left: '13.8%', width: '71.12%', height: '50%' };
                details.artworkShadow = '-2px 2px 5px rgba(0, 0, 0, 0.3)';
            } else {
                details.artworkContainerStyle = { top: '24.4%', left: '13.9%', width: '71.3%', height: '50%' };
            }
            break;
        case 'square':
            if (style === 'noframe') {
                details.url = frameColorImagePaths.square.noframe;
                details.artworkContainerStyle = { top: '13.65%', left: '14.68%', width: '69.7%', height: '69.7%' };
                details.artworkShadow = '-2px 2px 5px rgba(0, 0, 0, 0.3)';
            } else {
                details.artworkContainerStyle = { top: '13.65%', left: '14.68%', width: '69.7%', height: '69.7%' };
            }
            break;
    }

    return details;
});

const aspectRatioClass = computed(() => {
    switch (geometry.value) {
        case 'horizontal': return 'aspect-[3/2]';
        case 'square': return 'aspect-square';
        default: return 'aspect-[2/3]';
    }
});

const artworkStyle = computed(() => {
    return {
        top: selectedCanvas.value.artworkContainerStyle.top,
        left: selectedCanvas.value.artworkContainerStyle.left,
        width: selectedCanvas.value.artworkContainerStyle.width,
        height: selectedCanvas.value.artworkContainerStyle.height,
        boxShadow: selectedCanvas.value.artworkShadow,
    };
});
</script>