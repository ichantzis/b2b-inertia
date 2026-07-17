<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useForm, router } from '@inertiajs/vue3';
import { useToast } from 'primevue/usetoast';
import Tooltip from 'primevue/tooltip';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';

const props = defineProps({
    artwork: Object,
    pricingConfig: {
        type: Object,
        default: () => ({ canvas_framed: [], canvas_noframe: [], poster_framed: [] })
    },
    canViewPrice: {
        type: Boolean,
        default: false
    },
    // ΝΕΟ PROP: Δέχεται το ποσοστό έκπτωσης του χρήστη (π.χ. 15 για 15%)
    userDiscount: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['frameChange']);

const artwork = computed(() => props.artwork);
const canViewPrice = computed(() => props.canViewPrice);

const toast = useToast();

const showPrintInfo = ref(false); 

const isSquare = computed(() => props.artwork?.width === props.artwork?.height);

const selectedType = ref('canvas');
const selectedCanvas = ref('black');
const selectedPrintType = ref('mono');
const selectedSize = ref('50x70');
const selectedSquareSize = ref('50x50');

const frames = [
    { id: 'black', label: 'Black', img: '/images/frames/floatblack-frame.webp' },
    { id: 'white', label: 'White', img: '/images/frames/floatwhite-frame.webp' },
    { id: 'natural', label: 'Natural', img: '/images/frames/floatnatural-frame.webp' },
    { id: 'walnut', label: 'Walnut', img: '/images/frames/floatwalnut-frame.webp' },
    { id: 'oak', label: 'Oak', img: '/images/frames/floatoak-frame.webp' },
    { id: 'crema', label: 'Crema', img: '/images/frames/floatcrema-frame.webp' },
    { id: 'gold', label: 'Gold', img: '/images/frames/floatgold-frame.webp' },
    { id: 'silver', label: 'Silver', img: '/images/frames/floatsilver-frame.webp' },
    { id: 'noframe', label: 'No Frame', img: '/images/frames/floatnoframe.jpg' },
];

const printTypes = [
    { id: 'mono', label: 'Mono Print', img: '/images/frames/mono-print.webp' },
    { id: 'oil', label: 'Oil Print', img: '/images/frames/oil-print.webp' },
];

// Pricing Logic
const prices = computed(() => {
    const arrayToObject = (arr) => {
        if (!Array.isArray(arr)) return {};
        return arr.reduce((acc, item) => {
            if (item.size && item.price) {
                acc[item.size] = {
                    mono: parseFloat(item.price),
                    oil: parseFloat(item.oil_price || item.price)
                };
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

const sortSizes = (sizes) => {
    return sizes.sort((a, b) => {
        const [w1, h1] = a.split('x').map(Number);
        const [w2, h2] = b.split('x').map(Number);
        return (w1 * h1) - (w2 * h2);
    });
};

const currentCategoryPrices = computed(() => {
    if (selectedType.value === 'canvas') {
        return selectedCanvas.value === 'noframe'
            ? prices.value.frame.noframe
            : prices.value.frame.canvas;
    } else {
        return prices.value.frame.poster;
    }
});

const availableRectangularSizes = computed(() => {
    const allSizes = Object.keys(currentCategoryPrices.value);
    const rectSizes = allSizes.filter(size => {
        const [w, h] = size.split('x').map(Number);
        return w !== h;
    });
    return sortSizes(rectSizes);
});

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

    let priceObj = null;

    if (selectedType.value === 'canvas') {
        priceObj = selectedCanvas.value === 'noframe'
            ? prices.value.frame.noframe[size]
            : prices.value.frame.canvas[size];
    } else {
        priceObj = prices.value.frame.poster[size];
    }

    return priceObj && priceObj.mono > 0;
};

const showCanvasFrames = computed(() => selectedType.value === 'canvas');
const showPrintTypes = computed(() => selectedType.value === 'canvas');

const getButtonProps = (currentValue, selectedValue) => ({
    variant: currentValue === selectedValue ? 'outlined' : 'text',
    severity: currentValue === selectedValue ? 'warn' : undefined,
    raised: currentValue === selectedValue,
    class: '!border-2'
});

const quantity = ref(1);

// ΝΕΟ: Υπολογισμός της αρχικής (καταλόγου) τιμής
const basePrice = computed(() => {
    const sizeToUse = isSquare.value ? selectedSquareSize.value : selectedSize.value;

    if (selectedType.value === 'canvas') {
        const frameTypePrices = selectedCanvas.value === 'noframe'
            ? prices.value.frame.noframe
            : prices.value.frame.canvas;

        const priceData = frameTypePrices[sizeToUse];
        if (!priceData) return 0;
        return selectedPrintType.value === 'oil' ? priceData.oil : priceData.mono;
    }

    const posterPrices = prices.value.frame.poster;
    return posterPrices[sizeToUse]?.mono || 0;
});

// ΝΕΟ: Υπολογισμός της εκπτωτικής τιμής (αυτό που πληρώνει τελικά ο πελάτης)
const discountedPrice = computed(() => {
    if (props.userDiscount > 0) {
        return basePrice.value * (1 - (props.userDiscount / 100));
    }
    return basePrice.value;
});

// ΝΕΟ: Το συνολικό ποσό υπολογίζεται με βάση την εκπτωτική τιμή
const totalPrice = computed(() => {
    return discountedPrice.value * quantity.value;
});

const formattedTotalPrice = computed(() => {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    }).format(totalPrice.value);
});

const getArtworkThumb = () => {
    return props.artwork?.img_thumb || props.artwork?.urls?.img_thumb || null;
};

const getArtworkTitle = () => {
    if (typeof props.artwork?.title === 'string') return props.artwork.title;
    return props.artwork?.title?.en || 'Artwork';
};

const addToCartForm = useForm({
    artwork_id: props.artwork?.pictufy_id || null,
    title: null,
    type: selectedType.value,
    frame: selectedCanvas.value,
    print_type: 'mono',
    size: isSquare.value ? selectedSquareSize.value : selectedSize.value,
    quantity: quantity.value,
    img_thumb: null,
    price: basePrice.value, // ΣΗΜΑΝΤΙΚΟ: Στέλνουμε την αρχική τιμή στο Backend!
    total: totalPrice.value
});

const addToCart = () => {
    addToCartForm.artwork_id = String(props.artwork.pictufy_id);
    addToCartForm.title = getArtworkTitle();
    addToCartForm.type = selectedType.value;
    addToCartForm.frame = selectedCanvas.value;
    addToCartForm.print_type = selectedType.value === 'canvas' ? selectedPrintType.value : 'mono';
    addToCartForm.size = isSquare.value ? selectedSquareSize.value : selectedSize.value;
    addToCartForm.quantity = quantity.value;
    addToCartForm.img_thumb = getArtworkThumb();
    addToCartForm.price = basePrice.value; // ΣΗΜΑΝΤΙΚΟ: Στέλνουμε την αρχική τιμή
    addToCartForm.total = totalPrice.value;

    addToCartForm.post(route('cart.store'), {
        preserveScroll: true,
        onSuccess: () => {
            toast.add({ severity: 'success', summary: 'Added to cart', detail: `${quantity.value} x ${addToCartForm.title} added.`, life: 3000 });
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

const handleLogin = () => {
    router.visit(route('login'));
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

    const currentSize = isSquare.value ? selectedSquareSize.value : selectedSize.value;
    if (!showSize(currentSize)) {
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

watch([basePrice, quantity, selectedSize, selectedSquareSize, selectedPrintType], () => {
    addToCartForm.price = basePrice.value; // Ενημερώνουμε με την αρχική τιμή
    addToCartForm.total = totalPrice.value;
    addToCartForm.size = isSquare.value ? selectedSquareSize.value : selectedSize.value;
    addToCartForm.quantity = quantity.value;
    if (selectedType.value === 'canvas') {
        addToCartForm.print_type = selectedPrintType.value;
    }
});

onMounted(() => {
    if (selectedType.value === 'canvas') {
        emit('frameChange', selectedCanvas.value);
    }
    addToCartForm.artwork_id = props.artwork?.pictufy_id ? String(props.artwork.pictufy_id) : '';
    addToCartForm.title = getArtworkTitle();
    addToCartForm.type = selectedType.value;
    addToCartForm.frame = selectedCanvas.value;
    addToCartForm.print_type = selectedType.value === 'canvas' ? selectedPrintType.value : 'mono';
    addToCartForm.size = isSquare.value ? selectedSquareSize.value : selectedSize.value;
    addToCartForm.quantity = quantity.value;
    addToCartForm.img_thumb = getArtworkThumb();
    addToCartForm.price = basePrice.value;
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
        <div class="detail-item">
            <span class="detail-label">Type</span>
        </div>
        <div class="type-wrapper">
            <Button v-bind="getButtonProps('canvas', selectedType)" @click="selectedType = 'canvas'">
                <div class="flex flex-col items-center">
                    <img src="/images/frames/floating-frame.svg" alt="Floating Canvas" class="canvas-icon" />
                    <span class="text-xs mt-1 font-semibold">Canvas</span>
                </div>
            </Button>
        </div>

        <div class="detail-item">
            <span class="detail-label">Frame</span>
        </div>
        <div class="canvas-wrapper" v-show="showCanvasFrames">
            <div v-for="frame in frames" :key="frame.id" class="relative group">
                <Button v-bind="getButtonProps(frame.id, selectedCanvas)" @click="selectedCanvas = frame.id">
                    <img :src="frame.img" :alt="frame.label + ' Frame'" class="frame-icon" />
                </Button>

                <span
                    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {{ frame.label }}
                </span>
            </div>
        </div>

        <template v-if="showPrintTypes">
            <div class="detail-item">
                <div class="flex items-center gap-2">
                    <span class="detail-label !mb-0">Print Type</span>
                    <i class="pi pi-info-circle text-gray-400 hover:text-blue-500 cursor-pointer transition-colors"
                        @click="showPrintInfo = true" v-tooltip.top="'Click for details about print types'"></i>
                </div>
            </div>
            <div class="print-type-wrapper">
                <div v-for="pType in printTypes" :key="pType.id" class="relative group">
                    <Button v-bind="getButtonProps(pType.id, selectedPrintType)" @click="selectedPrintType = pType.id"
                        class="min-w-[8rem]">
                        <div class="flex flex-col items-center">
                            <span class="font-semibold">{{ pType.label }}</span>
                        </div>
                    </Button>
                </div>
            </div>
        </template>

        <div class="detail-item">
            <span class="detail-label">Size</span>
        </div>
        <div class="sizes-wrapper" v-if="!isSquare">
            <Button class="w-24" v-for="size in availableRectangularSizes" :key="size"
                v-bind="getButtonProps(size, selectedSize)" @click="selectedSize = size" :label="size" />
            <div v-if="availableRectangularSizes.length === 0" class="text-sm text-gray-500 italic">
                No sizes available for this selection.
            </div>
        </div>
        <div class="sizes-square-wrapper" v-if="isSquare">
            <Button class="w-24" v-for="size in availableSquareSizes" :key="size"
                v-bind="getButtonProps(size, selectedSquareSize)" @click="selectedSquareSize = size" :label="size" />
            <div v-if="availableSquareSizes.length === 0" class="text-sm text-gray-500 italic">
                No square sizes available.
            </div>
        </div>

        <div class="cart-section">
            <div class="total-section">
                <h2 class="final-total">FINAL TOTAL</h2>
                <div class="flex-1 min-w-0">
                    <p class="text-sm sm:text-base text-muted-color"><span class="font-semibold">Type:</span> {{
                        selectedType }}
                    </p>
                    <p class="text-sm sm:text-base text-muted-color" v-if="selectedType === 'canvas'"><span
                            class="font-semibold">Frame:</span> {{ selectedCanvas }}</p>
                    <p class="text-sm sm:text-base text-muted-color" v-if="selectedType === 'canvas'"><span
                            class="font-semibold">Print:</span> {{ selectedPrintType === 'oil' ? 'Oil Print' : 'Mono Print' }}
                    </p>
                    <p v-if="!isSquare" class="text-sm sm:text-base text-muted-color"><span
                            class="font-semibold">Size:</span>
                        {{ selectedSize }}</p>
                    <p v-else class="text-sm sm:text-base text-muted-color"><span class="font-semibold">Size:</span> {{
                        selectedSquareSize }}</p>
                </div>
                <div v-if="canViewPrice" class="price-container">
                    <span class="total-amount">{{ formattedTotalPrice }}</span>
                    <span class="vat-label cursor-help decoration-dotted underline underline-offset-4"
                        v-tooltip.top="'Price excludes VAT.'">+VAT</span>
                </div>
                <div class="cart-actions">
                    <div v-if="canViewPrice" class="quantity-wrapper">
                        <InputNumber v-model="quantity" :min="1" :max="10" showButtons buttonLayout="horizontal"
                            :step="1" size="small" class="quantity-input"
                            :inputStyle="{ width: '3rem', textAlign: 'center' }" />
                    </div>
                    <Button v-if="canViewPrice" label="ADD TO CART" icon="pi pi-shopping-cart" severity="primary" raised
                        @click="addToCart" :disabled="addToCartForm.processing" class="add-to-cart-btn" />
                    <Button v-else label="LOGIN TO ADD TO CART" icon="pi pi-shopping-cart" severity="primary" raised
                        @click="handleLogin" :disabled="addToCartForm.processing" class="add-to-cart-btn" />
                </div>
            </div>
        </div>
    </Form>

    <Dialog v-model:visible="showPrintInfo" modal header="Canvas Print Types"
        :style="{ width: '90vw', maxWidth: '500px' }" :dismissableMask="true">
        <div class="flex flex-col gap-6">
            <div>
                <h3 class="font-bold text-lg text-gray-800 mb-2">Monoprint on Canvas</h3>
                <p class="text-gray-600 leading-relaxed">
                    Printed on 100% cotton canvas 420gsm with simple protective oil.
                    It brings the colors to life and protects them from fading over time.
                </p>
            </div>

            <div class="border-t pt-6">
                <h3 class="font-bold text-lg text-gray-800 mb-2">Oil Print on Canvas</h3>
                <p class="text-gray-600 leading-relaxed">
                    Printed on 100% cotton canvas 420gsm with protective oil and <span class="font-bold">handmade
                        three-dimensional texture.</span> <br>
                    In addition to the monoprint, it makes the painting slightly <span class="font-bold">embossed</span>
                    and
                    gives <span class="font-bold">the feeling of painting</span> according to the brushstrokes of the
                    work.
                </p>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.tags-wrapper,
.type-wrapper,
.canvas-wrapper,
.print-type-wrapper,
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
}

.total-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.price-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.vat-label {
    font-size: 1rem;
    font-weight: 400;
    color: #64748b;
}

.total-amount {
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
    line-height: 1;
}

.cart-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: flex-start;
}

.quantity-wrapper {
    width: auto;
    min-width: auto;
}

.quantity-input {
    width: 100%;
}

.quantity-input :deep(.p-inputnumber) {
    width: auto;
}

.quantity-input :deep(.p-inputnumber-button) {
    width: 2rem;
}

.quantity-input :deep(.p-inputtext) {
    padding: 0.25rem;
}

.add-to-cart-btn {
    max-width: 150px;
    flex: 1;
}

.text-muted-color {
    color: #555;
}

.font-semibold {
    font-weight: 600;
}
</style>