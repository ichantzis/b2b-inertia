<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
    artwork: Object,
    pricingConfig: {
        type: Object,
        default: () => ({ canvas_framed: [], canvas_noframe: [], poster_framed: [] })
    },
    canViewPrice: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['frameChange']);

const artwork = computed(() => props.artwork);
const canViewPrice = computed(() => props.canViewPrice);

const toast = useToast();

const isSquare = computed(() => props.artwork?.width === props.artwork?.height);

const selectedType = ref('canvas');
const selectedCanvas = ref('black');
const selectedSize = ref('50x70');
const selectedSquareSize = ref('50x50');

// TRANSFORM DB CONFIG TO COMPONENT FORMAT
const prices = computed(() => {
    const arrayToObject = (arr) => {
        if (!Array.isArray(arr)) return {};
        return arr.reduce((acc, item) => {
            if (item.size && item.price) {
                acc[item.size] = parseFloat(item.price);
            }
            return acc;
        }, {});
    };

    const config = props.pricingConfig || {};

    return {
        frame: {
            canvas: arrayToObject(config.canvas_framed),
            noframe: arrayToObject(config.canvas_noframe),
            poster: arrayToObject(config.poster_framed)
        }
    };
});

// const prices = {
//     frame: {
//         canvas: {
//             '40x60': 144,
//             '50x70': 180,
//             '60x90': 264,
//             '70x100': 288,
//             '80x120': 348,
//             '100x140': 408,
//             '100x150': 504,
//             '120x160': 588,
//             '120x180': 624,
//             '50x50': 150,
//             '70x70': 276,
//             '100x100': 372,
//             '120x120': 504
//         },
//         noframe: {
//             '40x60': 96,
//             '50x70': 120,
//             '60x90': 180,
//             '70x100': 198,
//             '80x120': 228,
//             '100x140': 276,
//             '100x150': 324,
//             '50x50': 96,
//             '70x70': 180,
//             '100x100': 240
//         },
//         poster: {
//             '30x40': 72,
//             '40x60': 96,
//             '50x70': 132,
//             '60x80': 156,
//             '70x100': 204,
//             '80x120': 288,
//             '100x140': 432,
//             '50x50': 102,
//             '60x60': 132,
//             '70x70': 168,
//             '100x100': 288,
//             '120x120': 396
//         }
//     }
// };

// Helper to sort sizes naturally (e.g. 30x40 < 40x60)
const sortSizes = (sizes) => {
    return sizes.sort((a, b) => {
        const [w1, h1] = a.split('x').map(Number);
        const [w2, h2] = b.split('x').map(Number);
        return (w1 * h1) - (w2 * h2); // Sort by total area
    });
};

// Get the raw price object for the CURRENT selection (Canvas vs NoFrame vs Poster)
const currentCategoryPrices = computed(() => {
    if (selectedType.value === 'canvas') {
        return selectedCanvas.value === 'noframe' 
            ? prices.value.frame.noframe 
            : prices.value.frame.canvas;
    } else {
        return prices.value.frame.poster;
    }
});

// Filter for Rectangular sizes (Width != Height)
const availableRectangularSizes = computed(() => {
    const allSizes = Object.keys(currentCategoryPrices.value);
    const rectSizes = allSizes.filter(size => {
        const [w, h] = size.split('x').map(Number);
        return w !== h;
    });
    return sortSizes(rectSizes);
});

// Filter for Square sizes (Width == Height)
const availableSquareSizes = computed(() => {
    const allSizes = Object.keys(currentCategoryPrices.value);
    const sqSizes = allSizes.filter(size => {
        const [w, h] = size.split('x').map(Number);
        return w === h;
    });
    return sortSizes(sqSizes);
});


const showSize = (size) => {
    const [width, height] = size.split('x').map(Number);
    const isSquareSize = width === height;

    if (isSquare.value && !isSquareSize) return false;
    if (!isSquare.value && isSquareSize) return false;

    if (selectedType.value === 'canvas') {
        // Must use prices.value here
        return selectedCanvas.value === 'noframe'
            ? (prices.value.frame.noframe[size] > 0)
            : (prices.value.frame.canvas[size] > 0);
    } else {
        return prices.value.frame.poster[size] > 0;
    }
};

const showCanvasFrames = computed(() => selectedType.value === 'canvas');

const getButtonProps = (currentValue, selectedValue) => ({
    variant: currentValue === selectedValue ? 'outlined' : 'text',
    severity: currentValue === selectedValue ? 'warn' : undefined,
    raised: currentValue === selectedValue,
    class: '!border-2'
});

const quantity = ref(1);

const currentPrice = computed(() => {
    const sizeToUse = isSquare.value ? selectedSquareSize.value : selectedSize.value;
    if (selectedType.value === 'canvas') {
        // Must use prices.value here
        const frameTypePrices = selectedCanvas.value === 'noframe' 
            ? prices.value.frame.noframe 
            : prices.value.frame.canvas;
        return frameTypePrices[sizeToUse] || 0;
    }
    // return prices.value.frame.poster[sizeToUse] || 0;
    return 0;
});

const totalPrice = computed(() => {
    return currentPrice.value * quantity.value;
});

const formattedTotalPrice = computed(() => {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    }).format(totalPrice.value);
});

const addToCartForm = useForm({
    artwork_id: props.artwork?.id || null,
    title: props.artwork?.title?.en || null,
    type: selectedType.value,
    frame: selectedCanvas.value,
    size: isSquare.value ? selectedSquareSize.value : selectedSize.value,
    quantity: quantity.value,
    img_thumb: props.artwork?.urls?.img_thumb || null,
    price: currentPrice.value,
    total: totalPrice.value
});

const addToCart = () => {
    addToCartForm.artwork_id = props.artwork.id;
    addToCartForm.title = props.artwork.title?.en || 'Artwork';
    addToCartForm.type = selectedType.value;
    addToCartForm.frame = selectedCanvas.value;
    addToCartForm.size = isSquare.value ? selectedSquareSize.value : selectedSize.value;
    addToCartForm.quantity = quantity.value;
    addToCartForm.img_thumb = props.artwork.urls?.img_thumb;
    addToCartForm.price = currentPrice.value;
    addToCartForm.total = totalPrice.value;

    addToCartForm.post(route('cart.store'), {
        preserveScroll: true,
        onSuccess: () => {
            toast.add({ severity: 'success', summary: 'Added to cart', detail: `${quantity.value} x ${props.artwork.title?.en || 'Artwork'} added.`, life: 3000 });
        },
        onError: (errors) => {
            console.error('Failed to add item:', errors);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Could not add item to cart. Please try again.',
                life: 5000
            });
        }
    });
};

watch(selectedCanvas, (newFrameColor) => {
    if (selectedType.value === 'canvas') {
        emit('frameChange', newFrameColor);
    }
    addToCartForm.frame = newFrameColor;
});

watch(selectedType, (newType) => {
    if (newType === 'canvas') {
        emit('frameChange', selectedCanvas.value);
        addToCartForm.type = newType;
        addToCartForm.frame = selectedCanvas.value;
    }
    
    // Reset size logic
    const currentSize = isSquare.value ? selectedSquareSize.value : selectedSize.value;
    
    // Check if current size is valid in new list using prices.value
    if (!showSize(currentSize)) {
        // Helper to find available sizes in the specific category
        // Must use prices.value.frame[...]
        const availablePrices = prices.value.frame[newType === 'canvas' ? (selectedCanvas.value === 'noframe' ? 'noframe' : 'canvas') : 'poster'];
        const availableSizes = Object.keys(availablePrices);

        if (isSquare.value) {
            selectedSquareSize.value = availableSizes.find(s => {
                const parts = s.split('x');
                return parts.length === 2 && parts[0] === parts[1];
            }) || '50x50';
        } else {
            selectedSize.value = availableSizes.find(s => {
                const parts = s.split('x');
                return parts.length === 2 && parts[0] !== parts[1];
            }) || '50x70';
        }
    }
});

watch([currentPrice, quantity, selectedSize, selectedSquareSize], () => {
    addToCartForm.price = currentPrice.value;
    addToCartForm.total = totalPrice.value;
    addToCartForm.size = isSquare.value ? selectedSquareSize.value : selectedSize.value;
    addToCartForm.quantity = quantity.value;
});

onMounted(() => {
    if (selectedType.value === 'canvas') {
        emit('frameChange', selectedCanvas.value);
    }
    addToCartForm.artwork_id = props.artwork?.id;
    addToCartForm.title = props.artwork?.title?.en;
    addToCartForm.type = selectedType.value;
    addToCartForm.frame = selectedCanvas.value;
    addToCartForm.size = isSquare.value ? selectedSquareSize.value : selectedSize.value;
    addToCartForm.quantity = quantity.value;
    addToCartForm.img_thumb = props.artwork?.urls?.img_thumb;
    addToCartForm.price = currentPrice.value;
    addToCartForm.total = totalPrice.value;
});

watch([selectedType, selectedCanvas], () => {
    const size = isSquare.value ? selectedSquareSize.value : selectedSize.value;
    if (!showSize(size)) {
        if (isSquare.value) {
            selectedSquareSize.value = '50x50';
        } else {
            selectedSize.value = '50x70';
        }
    }
});
</script>

<template>
    <Form>
        <h2 class="artwork-option">Choose an option:</h2>
        <div class="detail-item">
            <span class="detail-label">Type</span>
        </div>

        <div class="type-wrapper">
            <Button v-bind="getButtonProps('canvas', selectedType)" @click="selectedType = 'canvas'">
                <img src="/images/frames/floating-frame.svg" alt="Floating Canvas" class="canvas-icon" />
            </Button>
        </div>

        <div class="detail-item">
            <span class="detail-label">Frame</span>
        </div>
        <div class="canvas-wrapper" v-show="showCanvasFrames">
            <Button v-bind="getButtonProps('black', selectedCanvas)" @click="selectedCanvas = 'black'">
                <img src="/images/frames/floatblack-frame.webp" alt="Black Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('white', selectedCanvas)" @click="selectedCanvas = 'white'">
                <img src="/images/frames/floatwhite-frame.webp" alt="White Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('natural', selectedCanvas)" @click="selectedCanvas = 'natural'">
                <img src="/images/frames/floatnatural-frame.webp" alt="Natural Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('walnut', selectedCanvas)" @click="selectedCanvas = 'walnut'">
                <img src="/images/frames/floatwalnut-frame.webp" alt="Walnut Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('oak', selectedCanvas)" @click="selectedCanvas = 'oak'">
                <img src="/images/frames/floatoak-frame.webp" alt="Oak Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('crema', selectedCanvas)" @click="selectedCanvas = 'crema'">
                <img src="/images/frames/floatcrema-frame.webp" alt="Crema Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('gold', selectedCanvas)" @click="selectedCanvas = 'gold'">
                <img src="/images/frames/floatgold-frame.webp" alt="Gold Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('silver', selectedCanvas)" @click="selectedCanvas = 'silver'">
                <img src="/images/frames/floatsilver-frame.webp" alt="Silver Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('noframe', selectedCanvas)" @click="selectedCanvas = 'noframe'">
                <img src="/images/frames/floatnoframe.jpg" alt="No Frame" class="frame-icon" />
            </Button>
        </div>

        <div class="detail-item">
            <span class="detail-label">Size</span>
        </div>
        <div class="sizes-wrapper" v-if="!isSquare">
            <Button 
                v-for="size in availableRectangularSizes" 
                :key="size" 
                v-bind="getButtonProps(size, selectedSize)"
                @click="selectedSize = size" 
                :label="size" 
            />
             <div v-if="availableRectangularSizes.length === 0" class="text-sm text-gray-500 italic">
                No sizes available for this selection.
            </div>
        </div>
        <div class="sizes-square-wrapper" v-if="isSquare">
            <Button 
                v-for="size in availableSquareSizes" 
                :key="size"
                v-bind="getButtonProps(size, selectedSquareSize)"
                @click="selectedSquareSize = size" 
                :label="size" 
                severity="contrast" 
            />
            <div v-if="availableSquareSizes.length === 0" class="text-sm text-gray-500 italic">
                No square sizes available.
            </div>
        </div>

        <div class="cart-section">
            <div class="total-section">
                <h2 class="final-total">FINAL TOTAL</h2>
                <div class="flex-1 min-w-0">
                    <p class="text-sm sm:text-base text-muted-color"><span class="font-semibold">Type:</span> {{
                        selectedType }}</p>
                    <p class="text-sm sm:text-base text-muted-color" v-if="selectedType === 'canvas'"><span
                            class="font-semibold">Frame:</span> {{ selectedCanvas }}</p>
                    <p v-if="!isSquare" class="text-sm sm:text-base text-muted-color"><span
                            class="font-semibold">Size:</span> {{ selectedSize }}</p>
                    <p v-else class="text-sm sm:text-base text-muted-color"><span class="font-semibold">Size:</span> {{
                        selectedSquareSize }}</p>
                </div>
                <span v-if="canViewPrice" class="total-amount">{{ formattedTotalPrice }}</span>
                <div class="cart-actions">
                    <div v-if="canViewPrice" class="quantity-wrapper">
                        <InputNumber v-model="quantity" :min="1" :max="10" showButtons buttonLayout="horizontal"
                            :step="1" size="small" class="quantity-input"
                            :inputStyle="{ width: '3rem', textAlign: 'center' }" />
                    </div>
                    <Button v-if="canViewPrice" label="ADD TO CART" icon="pi pi-shopping-cart" severity="primary" raised @click="addToCart"
                        :disabled="addToCartForm.processing" class="add-to-cart-btn" />
                    <Button v-else label="LOGIN TO ADD TO CART" icon="pi pi-shopping-cart" severity="primary" raised
                        :disabled="addToCartForm.processing" class="add-to-cart-btn" />
                </div>
            </div>
        </div>
    </Form>
</template>

<style scoped>
/* Styles παραμένουν τα ίδια */
.tags-wrapper,
.type-wrapper,
.canvas-wrapper,
.poster-wrapper,
.sizes-wrapper,
.sizes-square-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-block: 1rem;
}

.canvas-icon {
    display: block;
    width: 80px;
    height: 60px;
}

.frame-icon {
    display: block;
    width: 50px;
    height: 50px;
}

.size-icon {
    width: 80px;
    height: 35px;
}

.artwork-option {
    font-size: 1.25rem;
    color: #666;
    font-weight: 500;
    margin-block: 1rem;
}

.final-total {
    font-size: 1.25rem;
    color: #666;
    font-weight: 500;
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

.cart-section {
    margin-top: 2rem;
    padding: 1.5rem;
    /* background-color: #f9f9f9; */
    /* border-radius: 8px; */
    /* box-shadow: 0 2px 8px rgba(0,0,0,0.1); */
}

.total-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    /* Αυξήθηκε το κενό για καλύτερη οπτική διάκριση */
}

.total-amount {
    font-size: 2rem;
    /* Αυξήθηκε για έμφαση */
    font-weight: 700;
    /* Bold για έμφαση */
    color: #2c3e50;
    /* Πιο σκούρο χρώμα για αντίθεση */
}

.cart-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: flex-start;
    /* Ευθυγράμμιση στην αρχή */
}

.quantity-wrapper {
    /* Δεν χρειάζεται συγκεκριμένο πλάτος εδώ, το InputNumber θα το διαχειριστεί */
    width: auto;
    /* Προσαρμόζεται στο περιεχόμενο */
    min-width: auto;
    /* Αποφυγή υπερβολικά μικρού πλάτους */
}

.quantity-input {
    width: 100%;
    /* Το InputNumber θα πάρει το πλάτος του wrapper του */
}

/* Στοχεύστε τα εσωτερικά στοιχεία του PrimeVue InputNumber αν χρειάζεται */
.quantity-input :deep(.p-inputnumber) {
    width: auto;
    /* Ή ένα συγκεκριμένο πλάτος αν προτιμάτε, π.χ., '120px' */
}

.quantity-input :deep(.p-inputnumber-button) {
    width: 2rem;
    /* Ή όσο χρειάζεται για να φαίνονται καλά τα κουμπιά */
}

.quantity-input :deep(.p-inputtext) {
    padding: 0.25rem;
    /* Μικρότερο padding για compact εμφάνιση */
}


.add-to-cart-btn {
    /* Το κουμπί θα πάρει το υπόλοιπο διαθέσιμο πλάτος αν είναι το μόνο flex-grow στοιχείο,
       ή μπορείτε να του δώσετε ένα συγκεκριμένο πλάτος/max-width */
    max-width: 150px;
    /* Μέγιστο πλάτος για το κουμπί */
    flex: 1;
    /* Επιτρέπει στο κουμπί να μεγαλώσει αν υπάρχει χώρος, αλλά όχι πάνω από το max-width */
}


/* Εάν έχετε αυτές τις κλάσεις για λεπτομέρειες τιμών, κρατήστε τις */
.price-details {
    display: grid;
    gap: 1rem;
}

.detail-value.price,
.detail-value.total {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2196F3;
    /* Παράδειγμα χρώματος */
}

.detail-value.total {
    color: #4CAF50;
    /* Παράδειγμα χρώματος για το σύνολο */
}

/* Text styling for summary below FINAL TOTAL */
.text-muted-color {
    color: #555;
    /* Ένα απαλό γκρι για τις λεπτομέρειες */
}

.font-semibold {
    font-weight: 600;
    /* Για τις ετικέτες όπως Type, Frame, Size */
}
</style>