<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    width: Number,
    height: Number
});

const isSquare = computed(() => props.width === props.height);

const selectedStyle = ref('floating');
const selectedCanvas = ref('black');
const selectedPoster = ref('black');
const selectedSize = ref('50x70');
const selectedSquareSize = ref('50x50');

const prices = {
    canvas: {
        regular: {
            '40x60': 144,
            '50x70': 180,
            '60x90': 264,
            '70x100': 288,
            '80x120': 348,
            '100x140': 408,
            '100x150': 504,
            '120x160': 588,
            '120x180': 624,
            '50x50': 150,
            '70x70': 276,
            '100x100': 372,
            '120x120': 504
        },
        noframe: {
            '40x60': 96,
            '50x70': 120,
            '60x90': 180,
            '70x100': 198,
            '80x120': 228,
            '100x140': 276,
            '100x150': 324,
            '50x50': 96,
            '70x70': 180,
            '100x100': 240
        },
        poster: {
            '30x40': 72,
            '40x60': 96,
            '50x70': 132,
            '60x80': 156,
            '70x100': 204,
            '80x120': 288,
            '100x140': 432,
            '50x50': 102,
            '60x60': 132,
            '70x70': 168,
            '100x100': 288,
            '120x120': 396
        }
    }
};

const showSize = (size) => {
    const [width, height] = size.split('x').map(Number);
    const isSquareSize = width === height;

    if (isSquare.value && !isSquareSize) return false;
    if (!isSquare.value && isSquareSize) return false;

    if (selectedStyle.value === 'floating') {
        return selectedCanvas.value === 'noframe'
            ? prices.canvas.noframe[size] > 0
            : prices.canvas.regular[size] > 0;
    } else {
        return prices.canvas.poster[size] > 0;
    }
};

// Add computed properties for visibility only
const showCanvasFrames = computed(() => selectedStyle.value === 'floating');
const showPosterFrames = computed(() => selectedStyle.value === 'framed');

const getButtonProps = (currentValue, selectedValue) => ({
    variant: currentValue === selectedValue ? 'outlined' : 'text',
    severity: currentValue === selectedValue ? 'warn' : undefined,
    raised: currentValue === selectedValue,
    class: '!border-2'
});

// Add quantity ref
const quantity = ref(1);

// Add price computation
const currentPrice = computed(() => {
    const size = isSquare.value ? selectedSquareSize.value : selectedSize.value;
    if (selectedStyle.value === 'floating') {
        return selectedCanvas.value === 'noframe'
            ? prices.canvas.noframe[size]
            : prices.canvas.regular[size];
    }
    return prices.canvas.poster[size];
});

const totalPrice = computed(() => {
    return currentPrice.value * quantity.value;
});

// Add formatted total price computed
const formattedTotalPrice = computed(() => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    }).format(totalPrice.value);
});

// Define emits
const emit = defineEmits(['addToCart']);

function addToCart() {
    emit('addToCart', {
        style: selectedStyle.value,
        frame: selectedStyle.value === 'floating' ? selectedCanvas.value : selectedPoster.value,
        size: isSquare.value ? selectedSquareSize.value : selectedSize.value,
        quantity: quantity.value,
        price: currentPrice.value,
        total: totalPrice.value
    });
}

// Add watchers after the refs
watch([selectedStyle, selectedCanvas], () => {
    const size = isSquare.value ? selectedSquareSize.value : selectedSize.value;
    if (!showSize(size)) {
        // Reset to default size if current size is not available
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
            <span class="detail-label">Frame</span>
        </div>

        <div class="style-wrapper">
            <Button v-bind="getButtonProps('floating', selectedStyle)" @click="selectedStyle = 'floating'">
                <img src="/images/frames/floating-frame.svg" alt="Floating Canvas" class="canvas-icon" />
            </Button>
            <Button v-bind="getButtonProps('framed', selectedStyle)" @click="selectedStyle = 'framed'">
                <img src="/images/frames/framed-print-1.svg" alt="Floating Poster" class="canvas-icon" />
            </Button>
        </div>
        <!-- Canvas Frames -->
        <div class="canvas-wrapper" v-show="showCanvasFrames">
            <Button v-bind="getButtonProps('black', selectedCanvas)" @click="selectedCanvas = 'black'">
                <img src="/images/frames/floatblack-frame.png" alt="Black Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('white', selectedCanvas)" @click="selectedCanvas = 'white'">
                <img src="/images/frames/floatwhite-frame.png" alt="White Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('natural', selectedCanvas)" @click="selectedCanvas = 'natural'">
                <img src="/images/frames/floatnatural-frame.png" alt="Natural Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('walnut', selectedCanvas)" @click="selectedCanvas = 'walnut'">
                <img src="/images/frames/floatwalnut-frame.png" alt="Walnut Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('oak', selectedCanvas)" @click="selectedCanvas = 'oak'">
                <img src="/images/frames/Oak_C-jpg.webp" alt="Oak Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('crema', selectedCanvas)" @click="selectedCanvas = 'crema'">
                <img src="/images/frames/Crema_C-300x300.jpg" alt="Crema Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('noframe', selectedCanvas)" @click="selectedCanvas = 'noframe'">
                <img src="/images/frames/floatnoframe.jpg" alt="No Frame" class="frame-icon" />
            </Button>
        </div>
        <!-- Poster Frames -->
        <div class="poster-wrapper" v-show="showPosterFrames">
            <Button v-bind="getButtonProps('black', selectedPoster)" @click="selectedPoster = 'black'">
                <img src="/images/frames/blackprint-frame.jpg" alt="Black Poster Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('white', selectedPoster)" @click="selectedPoster = 'white'">
                <img src="/images/frames/whiteprint-frame.jpg" alt="White Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('natural', selectedPoster)" @click="selectedPoster = 'natural'">
                <img src="/images/frames/natural_frame.jpg" alt="Natural Poster Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('walnut', selectedPoster)" @click="selectedPoster = 'walnut'">
                <img src="/images/frames/Walnut_P-1024x1024.jpg" alt="Walnut Poster Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('oak', selectedPoster)" @click="selectedPoster = 'oak'">
                <img src="/images/frames/Oak_P-jpg.webp" alt="Oak Poster Frame" class="frame-icon" />
            </Button>
            <Button v-bind="getButtonProps('crema', selectedPoster)" @click="selectedPoster = 'crema'">
                <img src="/images/frames/Crema_P-1024x1024.jpg" alt="Crema Poster Frame" class="frame-icon" />
            </Button>
        </div>
        <div class="detail-item">
            <span class="detail-label">Size</span>
        </div>
        <!-- Sizes Vertical/Horizontal -->
        <div class="sizes-wrapper" v-if="!isSquare">
            <Button v-for="size in [
                '30x40', '40x60', '50x70', '60x80', '60x90',
                '70x100', '80x120', '100x140', '100x150',
                '120x160', '120x180'
            ]" :key="size" v-show="showSize(size)" v-bind="getButtonProps(size, selectedSize)"
                @click="selectedSize = size" :label="size" severity="contrast" />
        </div>
        <!-- Sizes Square -->
        <div class="sizes-square-wrapper" v-if="isSquare">
            <Button v-for="size in ['50x50', '60x60', '70x70', '100x100', '120x120']" :key="size"
                v-show="showSize(size)" v-bind="getButtonProps(size, selectedSquareSize)"
                @click="selectedSquareSize = size" :label="size" severity="contrast" />
        </div>

        <!-- Replace cart section with new design -->
        <div class="cart-section">
            <div class="total-section">
                <h2 class="artwork-option">FINAL TOTAL</h2>
                <span class="total-amount">{{ formattedTotalPrice }}</span>
                <div class="cart-actions">
                    <div class="quantity-wrapper">
                        <InputNumber v-model="quantity" :min="1" :max="10" showButtons buttonLayout="horizontal"
                            :step="1" size="small" class="quantity-input"
                            :inputStyle="{ width: '3rem', textAlign: 'center' }" />
                    </div>
                    <Button label="ADD TO CART" icon="pi pi-shopping-cart" severity="primary" raised @click="addToCart"
                        class="add-to-cart-btn" />
                </div>
            </div>
        </div>
    </Form>
</template>

<style scoped>
.tags-wrapper,
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

.total-amount {
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
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

.price-details {
    display: grid;
    gap: 1rem;
}

.detail-value.price,
.detail-value.total {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2196F3;
}

.detail-value.total {
    color: #4CAF50;
}
</style>