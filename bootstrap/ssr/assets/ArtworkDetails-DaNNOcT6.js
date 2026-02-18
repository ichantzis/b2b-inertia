import { computed, ref, watch, onMounted, withCtx, unref, mergeProps, createVNode, toDisplayString, withDirectives, createBlock, createCommentVNode, openBlock, Fragment, renderList, vShow, createTextVNode, useSSRContext, resolveDynamicComponent, withModifiers } from "vue";
import { ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderAttrs, ssrGetDirectiveProps, ssrRenderVNode, ssrRenderClass } from "vue/server-renderer";
import { useForm, router, usePage, Head, Link } from "@inertiajs/vue3";
import axios from "axios";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Divider from "primevue/divider";
import { _ as _export_sfc, a as _sfc_main$2 } from "../ssr.js";
import Dialog from "primevue/dialog";
import DataView from "primevue/dataview";
import ProgressSpinner from "primevue/progressspinner";
import { H as HeaderLayout } from "./HeaderLayout-zh2NGVuN.js";
import __unplugin_directives_0 from "primevue/tooltip";
import __unplugin_components_0 from "@primevue/forms/form";
import { useToast } from "primevue/usetoast";
import InputNumber from "primevue/inputnumber";
import { s as slugify } from "./utils--JrDKSqM.js";
import { s as squareCanvasImg, a as squareCremaImg, b as squareOakImg, c as squareWalnutImg, d as squareNaturalImg, e as squareGoldImg, f as squareSilverImg, g as squareMockaImg, h as squareWhiteImg, i as horizontalBlackImg, j as horizontalCremaImg, k as horizontalOakImg, l as horizontalWalnutImg, m as horizontalNaturalImg, n as horizontalGoldImg, o as horizontalSilverImg, p as horizontalMockaImg, q as horizontalWhiteImg, r as defaultCanvasImg, v as verticalGoldImg, t as verticalCremaImg, u as verticalOakImg, w as verticalWalnutImg, x as verticalNaturalImg, y as verticalSilverImg, z as verticalMockaImg, A as verticalWhiteImg, B as verticalBlacklImg } from "./SQUARE_WALNUT-87wNLTxN.js";
import "@inertiajs/vue3/server";
import "@vue/server-renderer";
import "primevue/config";
import "primevue/toastservice";
import "primevue/confirmationservice";
import "@primeuix/themes/aura";
import "@primeuix/themes";
import "primevue/toast";
import "primevue/drawer";
import "primevue/overlaybadge";
import "./ApplicationLogo-rkFqmqnV.js";
import "primevue/menu";
import "primevue/menubar";
import "primevue/panelmenu";
import "primevue/popover";
import "primevue/inputtext";
const _sfc_main$1 = {
  __name: "ArtworkCustomizer",
  __ssrInlineRender: true,
  props: {
    artwork: Object,
    pricingConfig: {
      type: Object,
      default: () => ({ canvas_framed: [], canvas_noframe: [], poster_framed: [] })
    },
    canViewPrice: {
      type: Boolean,
      default: false
    }
  },
  emits: ["frameChange"],
  setup(__props, { emit: __emit }) {
    var _a;
    const props = __props;
    const emit = __emit;
    computed(() => props.artwork);
    const canViewPrice = computed(() => props.canViewPrice);
    const toast = useToast();
    const showPrintInfo = ref(false);
    const isSquare = computed(() => {
      var _a2, _b;
      return ((_a2 = props.artwork) == null ? void 0 : _a2.width) === ((_b = props.artwork) == null ? void 0 : _b.height);
    });
    const selectedType = ref("canvas");
    const selectedCanvas = ref("black");
    const selectedPrintType = ref("mono");
    const selectedSize = ref("50x70");
    const selectedSquareSize = ref("50x50");
    const frames = [
      { id: "black", label: "Black", img: "/images/frames/floatblack-frame.webp" },
      { id: "white", label: "White", img: "/images/frames/floatwhite-frame.webp" },
      { id: "natural", label: "Natural", img: "/images/frames/floatnatural-frame.webp" },
      { id: "walnut", label: "Walnut", img: "/images/frames/floatwalnut-frame.webp" },
      { id: "oak", label: "Oak", img: "/images/frames/floatoak-frame.webp" },
      { id: "crema", label: "Crema", img: "/images/frames/floatcrema-frame.webp" },
      { id: "gold", label: "Gold", img: "/images/frames/floatgold-frame.webp" },
      { id: "silver", label: "Silver", img: "/images/frames/floatsilver-frame.webp" },
      { id: "noframe", label: "No Frame", img: "/images/frames/floatnoframe.jpg" }
    ];
    const printTypes = [
      { id: "mono", label: "Mono Print", img: "/images/frames/mono-print.webp" },
      { id: "oil", label: "Oil Print", img: "/images/frames/oil-print.webp" }
    ];
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
        const [w1, h1] = a.split("x").map(Number);
        const [w2, h2] = b.split("x").map(Number);
        return w1 * h1 - w2 * h2;
      });
    };
    const currentCategoryPrices = computed(() => {
      if (selectedType.value === "canvas") {
        return selectedCanvas.value === "noframe" ? prices.value.frame.noframe : prices.value.frame.canvas;
      } else {
        return prices.value.frame.poster;
      }
    });
    const availableRectangularSizes = computed(() => {
      const allSizes = Object.keys(currentCategoryPrices.value);
      const rectSizes = allSizes.filter((size) => {
        const [w, h] = size.split("x").map(Number);
        return w !== h;
      });
      return sortSizes(rectSizes);
    });
    const availableSquareSizes = computed(() => {
      const allSizes = Object.keys(currentCategoryPrices.value);
      const sqSizes = allSizes.filter((size) => {
        const [w, h] = size.split("x").map(Number);
        return w === h;
      });
      return sortSizes(sqSizes);
    });
    const showSize = (size) => {
      const [width, height] = size.split("x").map(Number);
      const isSquareSize = width === height;
      if (isSquare.value && !isSquareSize) return false;
      if (!isSquare.value && isSquareSize) return false;
      let priceObj = null;
      if (selectedType.value === "canvas") {
        priceObj = selectedCanvas.value === "noframe" ? prices.value.frame.noframe[size] : prices.value.frame.canvas[size];
      } else {
        priceObj = prices.value.frame.poster[size];
      }
      return priceObj && priceObj.mono > 0;
    };
    const showCanvasFrames = computed(() => selectedType.value === "canvas");
    const showPrintTypes = computed(() => selectedType.value === "canvas");
    const getButtonProps = (currentValue, selectedValue) => ({
      variant: currentValue === selectedValue ? "outlined" : "text",
      severity: currentValue === selectedValue ? "warn" : void 0,
      raised: currentValue === selectedValue,
      class: "!border-2"
    });
    const quantity = ref(1);
    const currentPrice = computed(() => {
      var _a2;
      const sizeToUse = isSquare.value ? selectedSquareSize.value : selectedSize.value;
      if (selectedType.value === "canvas") {
        const frameTypePrices = selectedCanvas.value === "noframe" ? prices.value.frame.noframe : prices.value.frame.canvas;
        const priceData = frameTypePrices[sizeToUse];
        if (!priceData) return 0;
        return selectedPrintType.value === "oil" ? priceData.oil : priceData.mono;
      }
      const posterPrices = prices.value.frame.poster;
      return ((_a2 = posterPrices[sizeToUse]) == null ? void 0 : _a2.mono) || 0;
    });
    const totalPrice = computed(() => {
      return currentPrice.value * quantity.value;
    });
    const formattedTotalPrice = computed(() => {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2
      }).format(totalPrice.value);
    });
    const getArtworkThumb = () => {
      var _a2, _b, _c;
      return ((_a2 = props.artwork) == null ? void 0 : _a2.img_thumb) || ((_c = (_b = props.artwork) == null ? void 0 : _b.urls) == null ? void 0 : _c.img_thumb) || null;
    };
    const getArtworkTitle = () => {
      var _a2, _b, _c;
      if (typeof ((_a2 = props.artwork) == null ? void 0 : _a2.title) === "string") return props.artwork.title;
      return ((_c = (_b = props.artwork) == null ? void 0 : _b.title) == null ? void 0 : _c.en) || "Artwork";
    };
    const addToCartForm = useForm({
      artwork_id: ((_a = props.artwork) == null ? void 0 : _a.pictufy_id) || null,
      title: null,
      type: selectedType.value,
      frame: selectedCanvas.value,
      print_type: "mono",
      size: isSquare.value ? selectedSquareSize.value : selectedSize.value,
      quantity: quantity.value,
      img_thumb: null,
      price: currentPrice.value,
      total: totalPrice.value
    });
    const addToCart = () => {
      addToCartForm.artwork_id = String(props.artwork.pictufy_id);
      addToCartForm.title = getArtworkTitle();
      addToCartForm.type = selectedType.value;
      addToCartForm.frame = selectedCanvas.value;
      addToCartForm.print_type = selectedType.value === "canvas" ? selectedPrintType.value : "mono";
      addToCartForm.size = isSquare.value ? selectedSquareSize.value : selectedSize.value;
      addToCartForm.quantity = quantity.value;
      addToCartForm.img_thumb = getArtworkThumb();
      addToCartForm.price = currentPrice.value;
      addToCartForm.total = totalPrice.value;
      addToCartForm.post(route("cart.store"), {
        preserveScroll: true,
        onSuccess: () => {
          toast.add({ severity: "success", summary: "Added to cart", detail: `${quantity.value} x ${addToCartForm.title} added.`, life: 3e3 });
        },
        onError: (errors) => {
          console.error("Failed to add item:", errors);
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Could not add item to cart. Please try again.",
            life: 5e3
          });
        }
      });
    };
    const handleLogin = () => {
      router.visit(route("login"));
    };
    watch(selectedCanvas, (newFrameColor) => {
      if (selectedType.value === "canvas") {
        emit("frameChange", newFrameColor);
      }
      addToCartForm.frame = newFrameColor;
    });
    watch(selectedType, (newType) => {
      if (newType === "canvas") {
        emit("frameChange", selectedCanvas.value);
        addToCartForm.type = newType;
        addToCartForm.frame = selectedCanvas.value;
      }
      const currentSize = isSquare.value ? selectedSquareSize.value : selectedSize.value;
      if (!showSize(currentSize)) {
        const availablePrices = prices.value.frame[newType === "canvas" ? selectedCanvas.value === "noframe" ? "noframe" : "canvas" : "poster"];
        const availableSizes = Object.keys(availablePrices);
        if (isSquare.value) {
          selectedSquareSize.value = availableSizes.find((s) => {
            const parts = s.split("x");
            return parts.length === 2 && parts[0] === parts[1];
          }) || "50x50";
        } else {
          selectedSize.value = availableSizes.find((s) => {
            const parts = s.split("x");
            return parts.length === 2 && parts[0] !== parts[1];
          }) || "50x70";
        }
      }
    });
    watch([currentPrice, quantity, selectedSize, selectedSquareSize, selectedPrintType], () => {
      addToCartForm.price = currentPrice.value;
      addToCartForm.total = totalPrice.value;
      addToCartForm.size = isSquare.value ? selectedSquareSize.value : selectedSize.value;
      addToCartForm.quantity = quantity.value;
      if (selectedType.value === "canvas") {
        addToCartForm.print_type = selectedPrintType.value;
      }
    });
    onMounted(() => {
      var _a2;
      if (selectedType.value === "canvas") {
        emit("frameChange", selectedCanvas.value);
      }
      addToCartForm.artwork_id = ((_a2 = props.artwork) == null ? void 0 : _a2.pictufy_id) ? String(props.artwork.pictufy_id) : "";
      addToCartForm.title = getArtworkTitle();
      addToCartForm.type = selectedType.value;
      addToCartForm.frame = selectedCanvas.value;
      addToCartForm.print_type = selectedType.value === "canvas" ? selectedPrintType.value : "mono";
      addToCartForm.size = isSquare.value ? selectedSquareSize.value : selectedSize.value;
      addToCartForm.quantity = quantity.value;
      addToCartForm.img_thumb = getArtworkThumb();
      addToCartForm.price = currentPrice.value;
      addToCartForm.total = totalPrice.value;
    });
    watch([selectedType, selectedCanvas], () => {
      const size = isSquare.value ? selectedSquareSize.value : selectedSize.value;
      if (!showSize(size)) {
        if (isSquare.value) {
          selectedSquareSize.value = "50x50";
        } else {
          selectedSize.value = "50x70";
        }
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Form = __unplugin_components_0;
      const _directive_tooltip = __unplugin_directives_0;
      let _temp0;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Form, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="detail-item" data-v-de1d052e${_scopeId}><span class="detail-label" data-v-de1d052e${_scopeId}>Type</span></div><div class="type-wrapper" data-v-de1d052e${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Button), mergeProps(getButtonProps("canvas", selectedType.value), {
              onClick: ($event) => selectedType.value = "canvas"
            }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-col items-center" data-v-de1d052e${_scopeId2}><img src="/images/frames/floating-frame.svg" alt="Floating Canvas" class="canvas-icon" data-v-de1d052e${_scopeId2}><span class="text-xs mt-1 font-semibold" data-v-de1d052e${_scopeId2}>Canvas</span></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex flex-col items-center" }, [
                      createVNode("img", {
                        src: "/images/frames/floating-frame.svg",
                        alt: "Floating Canvas",
                        class: "canvas-icon"
                      }),
                      createVNode("span", { class: "text-xs mt-1 font-semibold" }, "Canvas")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="detail-item" data-v-de1d052e${_scopeId}><span class="detail-label" data-v-de1d052e${_scopeId}>Frame</span></div><div class="canvas-wrapper" style="${ssrRenderStyle(showCanvasFrames.value ? null : { display: "none" })}" data-v-de1d052e${_scopeId}><!--[-->`);
            ssrRenderList(frames, (frame) => {
              _push2(`<div class="relative group" data-v-de1d052e${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Button), mergeProps({ ref_for: true }, getButtonProps(frame.id, selectedCanvas.value), {
                onClick: ($event) => selectedCanvas.value = frame.id
              }), {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<img${ssrRenderAttr("src", frame.img)}${ssrRenderAttr("alt", frame.label + " Frame")} class="frame-icon" data-v-de1d052e${_scopeId2}>`);
                  } else {
                    return [
                      createVNode("img", {
                        src: frame.img,
                        alt: frame.label + " Frame",
                        class: "frame-icon"
                      }, null, 8, ["src", "alt"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`<span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10" data-v-de1d052e${_scopeId}>${ssrInterpolate(frame.label)}</span></div>`);
            });
            _push2(`<!--]--></div>`);
            if (showPrintTypes.value) {
              _push2(`<!--[--><div class="detail-item" data-v-de1d052e${_scopeId}><div class="flex items-center gap-2" data-v-de1d052e${_scopeId}><span class="detail-label !mb-0" data-v-de1d052e${_scopeId}>Print Type</span><i${ssrRenderAttrs(_temp0 = mergeProps({ class: "pi pi-info-circle text-gray-400 hover:text-blue-500 cursor-pointer transition-colors" }, ssrGetDirectiveProps(_ctx, _directive_tooltip, "Click for details about print types", void 0, { top: true })))} data-v-de1d052e${_scopeId}>${"textContent" in _temp0 ? ssrInterpolate(_temp0.textContent) : _temp0.innerHTML ?? ""}</i></div></div><div class="print-type-wrapper" data-v-de1d052e${_scopeId}><!--[-->`);
              ssrRenderList(printTypes, (pType) => {
                _push2(`<div class="relative group" data-v-de1d052e${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Button), mergeProps({ ref_for: true }, getButtonProps(pType.id, selectedPrintType.value), {
                  onClick: ($event) => selectedPrintType.value = pType.id,
                  class: "min-w-[8rem]"
                }), {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex flex-col items-center" data-v-de1d052e${_scopeId2}><span class="font-semibold" data-v-de1d052e${_scopeId2}>${ssrInterpolate(pType.label)}</span></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "flex flex-col items-center" }, [
                          createVNode("span", { class: "font-semibold" }, toDisplayString(pType.label), 1)
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div>`);
              });
              _push2(`<!--]--></div><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="detail-item" data-v-de1d052e${_scopeId}><span class="detail-label" data-v-de1d052e${_scopeId}>Size</span></div>`);
            if (!isSquare.value) {
              _push2(`<div class="sizes-wrapper" data-v-de1d052e${_scopeId}><!--[-->`);
              ssrRenderList(availableRectangularSizes.value, (size) => {
                _push2(ssrRenderComponent(unref(Button), mergeProps({
                  class: "w-24",
                  key: size,
                  ref_for: true
                }, getButtonProps(size, selectedSize.value), {
                  onClick: ($event) => selectedSize.value = size,
                  label: size
                }), null, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
              if (availableRectangularSizes.value.length === 0) {
                _push2(`<div class="text-sm text-gray-500 italic" data-v-de1d052e${_scopeId}> No sizes available for this selection. </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (isSquare.value) {
              _push2(`<div class="sizes-square-wrapper" data-v-de1d052e${_scopeId}><!--[-->`);
              ssrRenderList(availableSquareSizes.value, (size) => {
                _push2(ssrRenderComponent(unref(Button), mergeProps({
                  class: "w-24",
                  key: size,
                  ref_for: true
                }, getButtonProps(size, selectedSquareSize.value), {
                  onClick: ($event) => selectedSquareSize.value = size,
                  label: size
                }), null, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
              if (availableSquareSizes.value.length === 0) {
                _push2(`<div class="text-sm text-gray-500 italic" data-v-de1d052e${_scopeId}> No square sizes available. </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="cart-section" data-v-de1d052e${_scopeId}><div class="total-section" data-v-de1d052e${_scopeId}><h2 class="final-total" data-v-de1d052e${_scopeId}>FINAL TOTAL</h2><div class="flex-1 min-w-0" data-v-de1d052e${_scopeId}><p class="text-sm sm:text-base text-muted-color" data-v-de1d052e${_scopeId}><span class="font-semibold" data-v-de1d052e${_scopeId}>Type:</span> ${ssrInterpolate(selectedType.value)}</p>`);
            if (selectedType.value === "canvas") {
              _push2(`<p class="text-sm sm:text-base text-muted-color" data-v-de1d052e${_scopeId}><span class="font-semibold" data-v-de1d052e${_scopeId}>Frame:</span> ${ssrInterpolate(selectedCanvas.value)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (selectedType.value === "canvas") {
              _push2(`<p class="text-sm sm:text-base text-muted-color" data-v-de1d052e${_scopeId}><span class="font-semibold" data-v-de1d052e${_scopeId}>Print:</span> ${ssrInterpolate(selectedPrintType.value === "oil" ? "Oil Print" : "Mono Print")}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (!isSquare.value) {
              _push2(`<p class="text-sm sm:text-base text-muted-color" data-v-de1d052e${_scopeId}><span class="font-semibold" data-v-de1d052e${_scopeId}>Size:</span> ${ssrInterpolate(selectedSize.value)}</p>`);
            } else {
              _push2(`<p class="text-sm sm:text-base text-muted-color" data-v-de1d052e${_scopeId}><span class="font-semibold" data-v-de1d052e${_scopeId}>Size:</span> ${ssrInterpolate(selectedSquareSize.value)}</p>`);
            }
            _push2(`</div>`);
            if (canViewPrice.value) {
              _push2(`<div class="price-container" data-v-de1d052e${_scopeId}><span class="total-amount" data-v-de1d052e${_scopeId}>${ssrInterpolate(formattedTotalPrice.value)}</span><span${ssrRenderAttrs(mergeProps({ class: "vat-label cursor-help decoration-dotted underline underline-offset-4" }, ssrGetDirectiveProps(_ctx, _directive_tooltip, "Price excludes VAT.", void 0, { top: true })))} data-v-de1d052e${_scopeId}>+VAT</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="cart-actions" data-v-de1d052e${_scopeId}>`);
            if (canViewPrice.value) {
              _push2(`<div class="quantity-wrapper" data-v-de1d052e${_scopeId}>`);
              _push2(ssrRenderComponent(unref(InputNumber), {
                modelValue: quantity.value,
                "onUpdate:modelValue": ($event) => quantity.value = $event,
                min: 1,
                max: 10,
                showButtons: "",
                buttonLayout: "horizontal",
                step: 1,
                size: "small",
                class: "quantity-input",
                inputStyle: { width: "3rem", textAlign: "center" }
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (canViewPrice.value) {
              _push2(ssrRenderComponent(unref(Button), {
                label: "ADD TO CART",
                icon: "pi pi-shopping-cart",
                severity: "primary",
                raised: "",
                onClick: addToCart,
                disabled: unref(addToCartForm).processing,
                class: "add-to-cart-btn"
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(Button), {
                label: "LOGIN TO ADD TO CART",
                icon: "pi pi-shopping-cart",
                severity: "primary",
                raised: "",
                onClick: handleLogin,
                disabled: unref(addToCartForm).processing,
                class: "add-to-cart-btn"
              }, null, _parent2, _scopeId));
            }
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "detail-item" }, [
                createVNode("span", { class: "detail-label" }, "Type")
              ]),
              createVNode("div", { class: "type-wrapper" }, [
                createVNode(unref(Button), mergeProps(getButtonProps("canvas", selectedType.value), {
                  onClick: ($event) => selectedType.value = "canvas"
                }), {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex flex-col items-center" }, [
                      createVNode("img", {
                        src: "/images/frames/floating-frame.svg",
                        alt: "Floating Canvas",
                        class: "canvas-icon"
                      }),
                      createVNode("span", { class: "text-xs mt-1 font-semibold" }, "Canvas")
                    ])
                  ]),
                  _: 1
                }, 16, ["onClick"])
              ]),
              createVNode("div", { class: "detail-item" }, [
                createVNode("span", { class: "detail-label" }, "Frame")
              ]),
              withDirectives(createVNode("div", { class: "canvas-wrapper" }, [
                (openBlock(), createBlock(Fragment, null, renderList(frames, (frame) => {
                  return createVNode("div", {
                    key: frame.id,
                    class: "relative group"
                  }, [
                    createVNode(unref(Button), mergeProps({ ref_for: true }, getButtonProps(frame.id, selectedCanvas.value), {
                      onClick: ($event) => selectedCanvas.value = frame.id
                    }), {
                      default: withCtx(() => [
                        createVNode("img", {
                          src: frame.img,
                          alt: frame.label + " Frame",
                          class: "frame-icon"
                        }, null, 8, ["src", "alt"])
                      ]),
                      _: 2
                    }, 1040, ["onClick"]),
                    createVNode("span", { class: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10" }, toDisplayString(frame.label), 1)
                  ]);
                }), 64))
              ], 512), [
                [vShow, showCanvasFrames.value]
              ]),
              showPrintTypes.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                createVNode("div", { class: "detail-item" }, [
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode("span", { class: "detail-label !mb-0" }, "Print Type"),
                    withDirectives(createVNode("i", {
                      class: "pi pi-info-circle text-gray-400 hover:text-blue-500 cursor-pointer transition-colors",
                      onClick: ($event) => showPrintInfo.value = true
                    }, null, 8, ["onClick"]), [
                      [
                        _directive_tooltip,
                        "Click for details about print types",
                        void 0,
                        { top: true }
                      ]
                    ])
                  ])
                ]),
                createVNode("div", { class: "print-type-wrapper" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(printTypes, (pType) => {
                    return createVNode("div", {
                      key: pType.id,
                      class: "relative group"
                    }, [
                      createVNode(unref(Button), mergeProps({ ref_for: true }, getButtonProps(pType.id, selectedPrintType.value), {
                        onClick: ($event) => selectedPrintType.value = pType.id,
                        class: "min-w-[8rem]"
                      }), {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex flex-col items-center" }, [
                            createVNode("span", { class: "font-semibold" }, toDisplayString(pType.label), 1)
                          ])
                        ]),
                        _: 2
                      }, 1040, ["onClick"])
                    ]);
                  }), 64))
                ])
              ], 64)) : createCommentVNode("", true),
              createVNode("div", { class: "detail-item" }, [
                createVNode("span", { class: "detail-label" }, "Size")
              ]),
              !isSquare.value ? (openBlock(), createBlock("div", {
                key: 1,
                class: "sizes-wrapper"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(availableRectangularSizes.value, (size) => {
                  return openBlock(), createBlock(unref(Button), mergeProps({
                    class: "w-24",
                    key: size,
                    ref_for: true
                  }, getButtonProps(size, selectedSize.value), {
                    onClick: ($event) => selectedSize.value = size,
                    label: size
                  }), null, 16, ["onClick", "label"]);
                }), 128)),
                availableRectangularSizes.value.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-sm text-gray-500 italic"
                }, " No sizes available for this selection. ")) : createCommentVNode("", true)
              ])) : createCommentVNode("", true),
              isSquare.value ? (openBlock(), createBlock("div", {
                key: 2,
                class: "sizes-square-wrapper"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(availableSquareSizes.value, (size) => {
                  return openBlock(), createBlock(unref(Button), mergeProps({
                    class: "w-24",
                    key: size,
                    ref_for: true
                  }, getButtonProps(size, selectedSquareSize.value), {
                    onClick: ($event) => selectedSquareSize.value = size,
                    label: size
                  }), null, 16, ["onClick", "label"]);
                }), 128)),
                availableSquareSizes.value.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-sm text-gray-500 italic"
                }, " No square sizes available. ")) : createCommentVNode("", true)
              ])) : createCommentVNode("", true),
              createVNode("div", { class: "cart-section" }, [
                createVNode("div", { class: "total-section" }, [
                  createVNode("h2", { class: "final-total" }, "FINAL TOTAL"),
                  createVNode("div", { class: "flex-1 min-w-0" }, [
                    createVNode("p", { class: "text-sm sm:text-base text-muted-color" }, [
                      createVNode("span", { class: "font-semibold" }, "Type:"),
                      createTextVNode(" " + toDisplayString(selectedType.value), 1)
                    ]),
                    selectedType.value === "canvas" ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm sm:text-base text-muted-color"
                    }, [
                      createVNode("span", { class: "font-semibold" }, "Frame:"),
                      createTextVNode(" " + toDisplayString(selectedCanvas.value), 1)
                    ])) : createCommentVNode("", true),
                    selectedType.value === "canvas" ? (openBlock(), createBlock("p", {
                      key: 1,
                      class: "text-sm sm:text-base text-muted-color"
                    }, [
                      createVNode("span", { class: "font-semibold" }, "Print:"),
                      createTextVNode(" " + toDisplayString(selectedPrintType.value === "oil" ? "Oil Print" : "Mono Print"), 1)
                    ])) : createCommentVNode("", true),
                    !isSquare.value ? (openBlock(), createBlock("p", {
                      key: 2,
                      class: "text-sm sm:text-base text-muted-color"
                    }, [
                      createVNode("span", { class: "font-semibold" }, "Size:"),
                      createTextVNode(" " + toDisplayString(selectedSize.value), 1)
                    ])) : (openBlock(), createBlock("p", {
                      key: 3,
                      class: "text-sm sm:text-base text-muted-color"
                    }, [
                      createVNode("span", { class: "font-semibold" }, "Size:"),
                      createTextVNode(" " + toDisplayString(selectedSquareSize.value), 1)
                    ]))
                  ]),
                  canViewPrice.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "price-container"
                  }, [
                    createVNode("span", { class: "total-amount" }, toDisplayString(formattedTotalPrice.value), 1),
                    withDirectives((openBlock(), createBlock("span", { class: "vat-label cursor-help decoration-dotted underline underline-offset-4" }, [
                      createTextVNode("+VAT")
                    ])), [
                      [
                        _directive_tooltip,
                        "Price excludes VAT.",
                        void 0,
                        { top: true }
                      ]
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "cart-actions" }, [
                    canViewPrice.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "quantity-wrapper"
                    }, [
                      createVNode(unref(InputNumber), {
                        modelValue: quantity.value,
                        "onUpdate:modelValue": ($event) => quantity.value = $event,
                        min: 1,
                        max: 10,
                        showButtons: "",
                        buttonLayout: "horizontal",
                        step: 1,
                        size: "small",
                        class: "quantity-input",
                        inputStyle: { width: "3rem", textAlign: "center" }
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : createCommentVNode("", true),
                    canViewPrice.value ? (openBlock(), createBlock(unref(Button), {
                      key: 1,
                      label: "ADD TO CART",
                      icon: "pi pi-shopping-cart",
                      severity: "primary",
                      raised: "",
                      onClick: addToCart,
                      disabled: unref(addToCartForm).processing,
                      class: "add-to-cart-btn"
                    }, null, 8, ["disabled"])) : (openBlock(), createBlock(unref(Button), {
                      key: 2,
                      label: "LOGIN TO ADD TO CART",
                      icon: "pi pi-shopping-cart",
                      severity: "primary",
                      raised: "",
                      onClick: handleLogin,
                      disabled: unref(addToCartForm).processing,
                      class: "add-to-cart-btn"
                    }, null, 8, ["disabled"]))
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Dialog), {
        visible: showPrintInfo.value,
        "onUpdate:visible": ($event) => showPrintInfo.value = $event,
        modal: "",
        header: "Canvas Print Types",
        style: { width: "90vw", maxWidth: "500px" },
        dismissableMask: true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-6" data-v-de1d052e${_scopeId}><div data-v-de1d052e${_scopeId}><h3 class="font-bold text-lg text-gray-800 mb-2" data-v-de1d052e${_scopeId}>Monoprint on Canvas</h3><p class="text-gray-600 leading-relaxed" data-v-de1d052e${_scopeId}> Printed on 100% cotton canvas 420gsm with simple protective oil. It brings the colors to life and protects them from fading over time. </p></div><div class="border-t pt-6" data-v-de1d052e${_scopeId}><h3 class="font-bold text-lg text-gray-800 mb-2" data-v-de1d052e${_scopeId}>Oil Print on Canvas</h3><p class="text-gray-600 leading-relaxed" data-v-de1d052e${_scopeId}> Printed on 100% cotton canvas 420gsm with protective oil and <span class="font-bold" data-v-de1d052e${_scopeId}>handmade three-dimensional texture.</span> <br data-v-de1d052e${_scopeId}> In addition to the monoprint, it makes the painting slightly <span class="font-bold" data-v-de1d052e${_scopeId}>embossed</span> and gives <span class="font-bold" data-v-de1d052e${_scopeId}>the feeling of painting</span> according to the brushstrokes of the work. </p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col gap-6" }, [
                createVNode("div", null, [
                  createVNode("h3", { class: "font-bold text-lg text-gray-800 mb-2" }, "Monoprint on Canvas"),
                  createVNode("p", { class: "text-gray-600 leading-relaxed" }, " Printed on 100% cotton canvas 420gsm with simple protective oil. It brings the colors to life and protects them from fading over time. ")
                ]),
                createVNode("div", { class: "border-t pt-6" }, [
                  createVNode("h3", { class: "font-bold text-lg text-gray-800 mb-2" }, "Oil Print on Canvas"),
                  createVNode("p", { class: "text-gray-600 leading-relaxed" }, [
                    createTextVNode(" Printed on 100% cotton canvas 420gsm with protective oil and "),
                    createVNode("span", { class: "font-bold" }, "handmade three-dimensional texture."),
                    createTextVNode(),
                    createVNode("br"),
                    createTextVNode(" In addition to the monoprint, it makes the painting slightly "),
                    createVNode("span", { class: "font-bold" }, "embossed"),
                    createTextVNode(" and gives "),
                    createVNode("span", { class: "font-bold" }, "the feeling of painting"),
                    createTextVNode(" according to the brushstrokes of the work. ")
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ArtworkCustomizer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ArtworkCustomizer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-de1d052e"]]);
const _sfc_main = /* @__PURE__ */ Object.assign({ layout: HeaderLayout }, {
  __name: "ArtworkDetails",
  __ssrInlineRender: true,
  props: {
    artwork: Object,
    error: String,
    requireLoginForPrices: Boolean,
    pricingConfig: Object
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const user = computed(() => page.props.auth.user);
    const metaDescription = computed(() => {
      var _a, _b, _c, _d;
      const rawDesc = ((_a = currentArtwork.value) == null ? void 0 : _a.description) || "";
      const strippedDesc = rawDesc.replace(/<[^>]*>?/gm, "");
      const finalDesc = strippedDesc || `Buy ${((_c = (_b = currentArtwork.value) == null ? void 0 : _b.title) == null ? void 0 : _c.en) || "Art"} by ${(_d = currentArtwork.value) == null ? void 0 : _d.artist}. High-quality art prints available on canvas and framed.`;
      return finalDesc.length > 160 ? finalDesc.substring(0, 157) + "..." : finalDesc;
    });
    const metaImage = computed(() => {
      var _a, _b;
      return ((_a = currentArtwork.value) == null ? void 0 : _a.img_medium) || ((_b = currentArtwork.value) == null ? void 0 : _b.img_thumb) || "";
    });
    const canonicalUrl = computed(() => {
      var _a, _b;
      if (!((_a = currentArtwork.value) == null ? void 0 : _a.id)) return window.location.href;
      return route("artwork.details", {
        id: currentArtwork.value.id,
        slug: slugify(((_b = currentArtwork.value.title) == null ? void 0 : _b.en) || "artwork")
      });
    });
    const jsonLd = computed(() => {
      var _a, _b, _c, _d, _e, _f;
      return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": (_a = props.artwork) == null ? void 0 : _a.title,
        "image": [
          (_b = props.artwork) == null ? void 0 : _b.img_high,
          (_c = props.artwork) == null ? void 0 : _c.img_medium
        ],
        "description": ((_d = props.artwork) == null ? void 0 : _d.description) || `Artwork by ${(_e = props.artwork) == null ? void 0 : _e.artist}`,
        "sku": (_f = props.artwork) == null ? void 0 : _f.pictufy_id,
        // "brand": {
        //   "@type": "Brand",
        //   "name": "Pictufy"
        // },
        "offers": {
          "@type": "Offer",
          "url": window.location.href,
          //" priceCurrency": "EUR",
          //" price": "99.00", // You need to inject the starting price here from props if available
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      };
    });
    const canViewPrice = computed(() => {
      if (!props.requireLoginForPrices) return true;
      return !!user.value;
    });
    const currentArtwork = computed(() => props.artwork);
    const relatedArtworks = ref([]);
    const youMayLikeArtworks = ref([]);
    const isLoadingRelated = ref(false);
    const fetchRelatedContent = async () => {
      if (!currentArtwork.value || !currentArtwork.value.id) return;
      isLoadingRelated.value = true;
      try {
        const response = await axios.get(route("artwork.related", currentArtwork.value.pictufy_id));
        if (response.data) {
          console.log("Related artworks response:", response.data);
          relatedArtworks.value = response.data.related || [];
          youMayLikeArtworks.value = response.data.youMayLike || [];
        }
      } catch (error) {
        console.error("Failed to fetch related artworks", error);
      } finally {
        isLoadingRelated.value = false;
      }
    };
    const currentFrameStyle = ref("black");
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
        // Fallback για vertical (π.χ., olive)
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
        // Fallback για horizontal (π.χ., black)
      },
      square: {
        white: squareWhiteImg,
        black: squareCanvasImg,
        mocka: squareMockaImg,
        silver: squareSilverImg,
        gold: squareGoldImg,
        natural: squareNaturalImg,
        walnut: squareWalnutImg,
        oak: squareOakImg,
        crema: squareCremaImg,
        noframe: null,
        default: squareCanvasImg
        // Fallback για square (π.χ., white)
      }
    };
    const INTERIOR_WHITELIST = {
      vertical: ["31", "52", "75", "87", "94", "124", "1194", "1226", "1506", "1598"],
      horizontal: ["36", "86", "645", "1162", "1600", "1870"],
      square: ["39", "64", "129", "170", "652", "899", "1041", "1596"]
    };
    const primaryArtworkGeometryType = computed(() => {
      if (currentArtwork.value && currentArtwork.value.geometry) {
        const geo = currentArtwork.value.geometry.toLowerCase().split(",")[0].trim();
        if (["vertical", "horizontal", "square"].includes(geo)) {
          return geo;
        }
        if (geo === "panorama") return "horizontal";
      }
      if (currentArtwork.value && currentArtwork.value.width && currentArtwork.value.height) {
        const ratio = currentArtwork.value.width / currentArtwork.value.height;
        if (ratio > 1.1) return "horizontal";
        if (ratio < 0.9) return "vertical";
        return "square";
      }
      return "vertical";
    });
    const selectedCanvas = computed(() => {
      const geometry = primaryArtworkGeometryType.value;
      const style = currentFrameStyle.value;
      let imageUrl;
      if (frameColorImagePaths[geometry] && frameColorImagePaths[geometry][style]) {
        imageUrl = frameColorImagePaths[geometry][style];
      } else if (frameColorImagePaths[geometry] && frameColorImagePaths[geometry].default) {
        imageUrl = frameColorImagePaths[geometry].default;
      } else {
        imageUrl = defaultCanvasImg;
      }
      let details = {
        url: imageUrl,
        aspectRatioClass: "aspect-ratio-default",
        // Θα αντικατασταθεί παρακάτω
        isAngled: false,
        // Προεπιλογή, θα αλλάξει ανάλογα με τη γεωμετρία/στυλ
        transformOrigin: "center center",
        artworkContainerStyle: { top: "10%", left: "15%", width: "70%", height: "75%" },
        // Γενική προεπιλογή
        artworkTransform: "none",
        // Γενική προεπιλογή
        artworkShadow: ""
      };
      switch (geometry) {
        case "vertical":
          details.aspectRatioClass = "aspect-ratio-2-3";
          if (style === "noframe") {
            details.url = frameColorImagePaths.vertical.noframe;
            details.isAngled = false;
            details.artworkContainerStyle = { top: "11.5%", left: "23.85%", width: "50.5%", height: "76.3%!important" };
            details.artworkTransform = "none";
            details.artworkShadow = "-5px 5px 10px rgba(0, 0, 0, 0.3), 5px -5px 10px rgba(0,0,0,0.1) inset, 0px 0px 30px rgba(0, 0, 0, 0.2)";
          } else {
            details.isAngled = false;
            details.artworkContainerStyle = { top: "11.5%", left: "23.85%", width: "50.5%!important", height: "76.3%!important" };
            details.artworkTransform = "perspective(1000px)";
            details.transformOrigin = "center left";
          }
          break;
        case "horizontal":
          details.aspectRatioClass = "aspect-ratio-3-2";
          if (style === "noframe") {
            details.url = frameColorImagePaths.horizontal.noframe;
            details.isAngled = false;
            details.artworkContainerStyle = { top: "24.2%", left: "13.8%", width: "71.12%", height: "50%" };
            details.artworkTransform = "none";
            details.artworkShadow = "-5px 5px 10px rgba(0, 0, 0, 0.3), 5px -5px 10px rgba(0,0,0,0.1) inset, 0px 0px 30px rgba(0, 0, 0, 0.2)";
          } else {
            details.isAngled = false;
            details.artworkContainerStyle = { top: "24.2%", left: "13.8%", width: "71.12%", height: "50%" };
            details.artworkTransform = "perspective(1000px)";
          }
          break;
        case "square":
          details.aspectRatioClass = "aspect-ratio-1-1";
          if (style === "noframe") {
            details.url = frameColorImagePaths.square.noframe;
            details.isAngled = false;
            details.artworkContainerStyle = { top: "13.65%", left: "14.68%", width: "69.7%", height: "69.7%" };
            details.artworkTransform = "none";
            details.artworkShadow = "-5px 5px 10px rgba(0, 0, 0, 0.3), 5px -5px 10px rgba(0,0,0,0.1) inset, 0px 0px 30px rgba(0, 0, 0, 0.2)";
          } else {
            details.isAngled = false;
            details.artworkContainerStyle = { top: "13.65%", left: "14.68%", width: "69.7%", height: "69.7%" };
            details.artworkTransform = "perspective(1000px)";
          }
          break;
        default:
          details.url = frameColorImagePaths.vertical.default;
          details.artworkContainerStyle = { top: "10%", left: "15%", width: "70%", height: "75%" };
          details.artworkTransform = "none";
      }
      return details;
    });
    const parsedKeywords = computed(() => {
      var _a;
      const raw = ((_a = currentArtwork.value) == null ? void 0 : _a.keywords) || "";
      return raw.split(",").map((k) => k.trim()).filter(Boolean).slice(0, 10);
    });
    const galleryImages = computed(() => {
      var _a;
      if (!currentArtwork.value) return [];
      const images = [
        {
          itemImageSrc: currentArtwork.value.img_medium || currentArtwork.value.img_high,
          thumbnailImageSrc: currentArtwork.value.img_thumb || currentArtwork.value.img_high,
          alt: ((_a = currentArtwork.value.title) == null ? void 0 : _a.en) || "Main Artwork",
          isPrimaryArtwork: true
        }
      ];
      const geometry = currentArtwork.value.geometry ? currentArtwork.value.geometry.toLowerCase() : "vertical";
      const allowedIds = INTERIOR_WHITELIST[geometry] || [];
      const availableInteriors = currentArtwork.value.interiors || {};
      allowedIds.forEach((id) => {
        const interior = availableInteriors[id];
        if (interior && interior.url) {
          images.push({
            itemImageSrc: interior.url,
            thumbnailImageSrc: interior.url,
            // Using same URL for thumb as interiors usually load fast
            alt: interior["short-name"] || "Interior View",
            isPrimaryArtwork: false
          });
        }
      });
      return images;
    });
    const availableColors = [
      { label: "Red", value: "red", hex: "#FF0000" },
      { label: "Orange", value: "orange", hex: "#FFA500" },
      { label: "Yellow", value: "yellow", hex: "#FFFF00" },
      { label: "Green", value: "green", hex: "#008000" },
      { label: "Turquoise", value: "turquoise", hex: "#40E0D0" },
      { label: "Blue", value: "blue", hex: "#0000FF" },
      { label: "Lilac", value: "lilac", hex: "#C8A2C8" },
      { label: "Pink", value: "pink", hex: "#FFC0CB" },
      { label: "High Key", value: "highkey", hex: "#FFFFFF" },
      { label: "Low Key", value: "lowkey", hex: "#000000" }
    ];
    const artworkColors = computed(() => {
      const art = currentArtwork.value;
      if (!art) return [];
      const activeColors = [];
      const dbMapping = {
        "has_red": "red",
        "has_orange": "orange",
        "has_yellow": "yellow",
        "has_green": "green",
        "has_turquoise": "turquoise",
        "has_blue": "blue",
        "has_lilac": "lilac",
        "has_pink": "pink",
        "is_highkey": "highkey",
        "is_lowkey": "lowkey"
      };
      Object.entries(dbMapping).forEach(([dbColumn, colorValue]) => {
        if (art[dbColumn]) {
          const colorConfig = availableColors.find((c) => c.value === colorValue);
          if (colorConfig) {
            activeColors.push({
              label: colorConfig.label,
              value: colorConfig.value,
              hex: colorConfig.hex
            });
          }
        }
      });
      return activeColors;
    });
    const previewVisible = ref(false);
    const currentIndex = ref(0);
    const touchStartX = ref(0);
    const thumbnailRowRef = ref(null);
    function handleFrameStyleChange(newStyle) {
      currentFrameStyle.value = newStyle;
      if (galleryImages.value.length > 0) {
        currentIndex.value = 0;
        updateCurrentImage();
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
          console.warn("Could not parse document.referrer URL:", e);
        }
      }
      if (window.history.length > 1) {
        if (window.history.length > 2) {
          window.history.back();
          return;
        }
      }
      router.visit(route("collections.index"), {
        preserveState: false,
        preserveScroll: true,
        onError: (errors) => {
          console.error("Failed to navigate to collections.index:", errors);
          router.visit(route("welcome"));
        }
      });
    }
    const generateCategorySlug = (categoryName) => {
      if (!categoryName || typeof categoryName !== "string") {
        return "";
      }
      let slug = slugify(categoryName);
      return `cat_${currentArtwork.value.artwork_type}_${slug}`;
    };
    const navigateToArtist = (artistSlug) => {
      if (artistSlug) {
        router.visit(route("artist.show", { artist_slug: artistSlug }));
      }
    };
    const navigateToCategory = (categoryName) => {
      const categorySlug = generateCategorySlug(categoryName);
      if (categorySlug && categoryName) {
        router.visit(route("artworks", { filters: categorySlug }));
      }
    };
    const navigateToCategoryTrending = () => {
      var _a;
      const categoryName = (_a = currentArtwork.value) == null ? void 0 : _a.category;
      if (!categoryName) return;
      const categorySlug = generateCategorySlug(categoryName);
      if (categorySlug) {
        router.visit(route("artworks", { filters: `trending/${categorySlug}` }));
      }
    };
    const navigateToArtworksWithTag = (tag) => {
      if (!tag) return;
      router.visit(route("artworks"), {
        // Assuming 'artworks' is the name of your general artworks listing route
        data: { search: tag.trim() },
        // Pass the tag as the 'search' query parameter
        preserveState: false,
        // Typically false for a new search context
        preserveScroll: false
        // Scroll to top of new page
      });
    };
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
      if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "ArrowRight") nextImage();
      else if (e.key === "Escape") previewVisible.value = false;
    }
    function scrollThumbnailIntoView() {
      if (thumbnailRowRef.value && thumbnailRowRef.value.children[currentIndex.value]) {
        const activeThumbnail = thumbnailRowRef.value.children[currentIndex.value];
        activeThumbnail.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
    function scrollThumbnails(direction) {
      if (thumbnailRowRef.value) {
        const scrollAmount = thumbnailRowRef.value.clientWidth * 0.7;
        thumbnailRowRef.value.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth"
        });
      }
    }
    const preloadFrameImages = (geometry) => {
      const frames = frameColorImagePaths[geometry];
      if (!frames) return;
      Object.values(frames).forEach((src) => {
        if (src) {
          const img = new Image();
          img.src = src;
        }
      });
    };
    watch(primaryArtworkGeometryType, (newGeometry) => {
      if (newGeometry) {
        setTimeout(() => preloadFrameImages(newGeometry), 1e3);
      }
    }, { immediate: true });
    onMounted(() => {
      if (props.artwork) {
        addToRecentlyViewed(props.artwork);
      }
      fetchRelatedContent();
    });
    const addToRecentlyViewed = (item) => {
      const key = "recently_viewed_items";
      let viewed = JSON.parse(localStorage.getItem(key) || "[]");
      const id = item.pictufy_id || item.id;
      if (!id) {
        console.warn("Skipping recently viewed: No ID found on item");
        return;
      }
      let titleStr = item.title;
      if (typeof titleStr === "object" && titleStr !== null) {
        titleStr = titleStr.en || Object.values(titleStr)[0] || "Untitled";
      }
      const image = item.img_thumb || item.img_medium || item.img_high || "/images/placeholder.png";
      viewed = viewed.filter((i) => i.pictufy_id !== id);
      viewed.unshift({
        pictufy_id: id,
        title: titleStr,
        artist: item.artist,
        image
      });
      if (viewed.length > 20) {
        viewed = viewed.slice(0, 20);
      }
      localStorage.setItem(key, JSON.stringify(viewed));
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
          if (_push2) {
            _push2(`<title data-v-a22d6bdd${_scopeId}>${ssrInterpolate(((_b = (_a2 = currentArtwork.value) == null ? void 0 : _a2.title) == null ? void 0 : _b.en) || "Artwork Details")} | Pictufy</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)} data-v-a22d6bdd${_scopeId}><meta property="og:type" content="product" data-v-a22d6bdd${_scopeId}><meta property="og:url"${ssrRenderAttr("content", canonicalUrl.value)} data-v-a22d6bdd${_scopeId}><meta property="og:title"${ssrRenderAttr("content", (_d = (_c = currentArtwork.value) == null ? void 0 : _c.title) == null ? void 0 : _d.en)} data-v-a22d6bdd${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)} data-v-a22d6bdd${_scopeId}><meta property="og:image"${ssrRenderAttr("content", metaImage.value)} data-v-a22d6bdd${_scopeId}><meta name="twitter:card" content="summary_large_image" data-v-a22d6bdd${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", (_f = (_e = currentArtwork.value) == null ? void 0 : _e.title) == null ? void 0 : _f.en)} data-v-a22d6bdd${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)} data-v-a22d6bdd${_scopeId}><meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)} data-v-a22d6bdd${_scopeId}>`);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent("script"), { type: "application/ld+json" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(JSON.stringify(jsonLd.value))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(JSON.stringify(jsonLd.value)), 1)
                  ];
                }
              }),
              _: 1
            }), _parent2, _scopeId);
            _push2(`<link rel="canonical"${ssrRenderAttr("href", canonicalUrl.value)} data-v-a22d6bdd${_scopeId}>`);
          } else {
            return [
              createVNode("title", null, toDisplayString(((_h = (_g = currentArtwork.value) == null ? void 0 : _g.title) == null ? void 0 : _h.en) || "Artwork Details") + " | Pictufy", 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:type",
                content: "product"
              }),
              createVNode("meta", {
                property: "og:url",
                content: canonicalUrl.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:title",
                content: (_j = (_i = currentArtwork.value) == null ? void 0 : _i.title) == null ? void 0 : _j.en
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: (_l = (_k = currentArtwork.value) == null ? void 0 : _k.title) == null ? void 0 : _l.en
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"]),
              (openBlock(), createBlock(resolveDynamicComponent("script"), { type: "application/ld+json" }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(JSON.stringify(jsonLd.value)), 1)
                ]),
                _: 1
              })),
              createVNode("link", {
                rel: "canonical",
                href: canonicalUrl.value
              }, null, 8, ["href"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Button), {
        icon: "pi pi-arrow-left",
        class: "back-button",
        rounded: "",
        severity: "secondary",
        variant: "text",
        size: "large",
        "aria-label": "Back",
        onClick: goBack
      }, null, _parent));
      _push(`<div class="artwork-details-page" tabindex="0" data-v-a22d6bdd>`);
      if (currentArtwork.value) {
        _push(`<div class="artwork-content-container" data-v-a22d6bdd><div class="artwork-display-area" data-v-a22d6bdd>`);
        if (galleryImages.value.length > 0 && galleryImages.value[currentIndex.value]) {
          _push(`<div class="${ssrRenderClass([{
            "canvas-mode angled-canvas-mode": galleryImages.value[currentIndex.value].isPrimaryArtwork,
            "normal-mode": !galleryImages.value[currentIndex.value].isPrimaryArtwork
          }, "main-image-container"])}" data-v-a22d6bdd>`);
          if (galleryImages.value[currentIndex.value].isPrimaryArtwork) {
            _push(`<div class="canvas-frame-wrapper" data-v-a22d6bdd>`);
            if (selectedCanvas.value.url) {
              _push(`<img${ssrRenderAttr("src", selectedCanvas.value.url)} alt="Canvas Frame" class="canvas-frame-image" fetchpriority="high" decoding="async" data-v-a22d6bdd>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<img${ssrRenderAttr("src", galleryImages.value[currentIndex.value].itemImageSrc)} class="artwork-on-canvas clickable"${ssrRenderAttr("alt", galleryImages.value[currentIndex.value].alt)} style="${ssrRenderStyle({ top: selectedCanvas.value.artworkContainerStyle.top, left: selectedCanvas.value.artworkContainerStyle.left, width: selectedCanvas.value.artworkContainerStyle.width, height: selectedCanvas.value.artworkContainerStyle.height, transform: selectedCanvas.value.artworkTransform, transformOrigin: selectedCanvas.value.transformOrigin || "center center", boxShadow: selectedCanvas.value.artworkShadow })}" fetchpriority="high" decoding="async" data-v-a22d6bdd></div>`);
          } else {
            _push(`<div class="normal-image-view-wrapper" data-v-a22d6bdd><img${ssrRenderAttr("src", galleryImages.value[currentIndex.value].itemImageSrc)} class="normal-image-render clickable"${ssrRenderAttr("alt", galleryImages.value[currentIndex.value].alt)} data-v-a22d6bdd></div>`);
          }
          _push(ssrRenderComponent(unref(Button), {
            icon: "pi pi-chevron-left",
            class: "gallery-nav-button left",
            onClick: prevImage,
            disabled: galleryImages.value.length <= 1
          }, null, _parent));
          _push(ssrRenderComponent(unref(Button), {
            icon: "pi pi-chevron-right",
            class: "gallery-nav-button right",
            onClick: nextImage,
            disabled: galleryImages.value.length <= 1
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="main-image-container normal-mode" data-v-a22d6bdd><div class="artwork-placeholder-on-canvas" data-v-a22d6bdd> Artwork image not available </div></div>`);
        }
        if (galleryImages.value.length > 1) {
          _push(`<div class="thumbnail-navigation mt-4" data-v-a22d6bdd>`);
          _push(ssrRenderComponent(unref(Button), {
            icon: "pi pi-chevron-left",
            text: "",
            class: "thumb-nav-button",
            onClick: ($event) => scrollThumbnails("left"),
            disabled: galleryImages.value.length <= 1
          }, null, _parent));
          _push(`<div class="thumbnail-row-container" data-v-a22d6bdd><!--[-->`);
          ssrRenderList(galleryImages.value, (img, idx) => {
            _push(`<div class="${ssrRenderClass([{ "active-thumbnail": currentIndex.value === idx }, "thumbnail-item"])}" data-v-a22d6bdd><img${ssrRenderAttr("src", img.thumbnailImageSrc)} class="thumbnail-image-render"${ssrRenderAttr("alt", img.alt)} data-v-a22d6bdd></div>`);
          });
          _push(`<!--]--></div>`);
          _push(ssrRenderComponent(unref(Button), {
            icon: "pi pi-chevron-right",
            text: "",
            class: "thumb-nav-button",
            onClick: ($event) => scrollThumbnails("right"),
            disabled: galleryImages.value.length <= 1
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="artwork-information" data-v-a22d6bdd><div class="artwork-header" data-v-a22d6bdd><h1 class="artwork-title-text" data-v-a22d6bdd>${ssrInterpolate(((_a = currentArtwork.value) == null ? void 0 : _a.title) || "Untitled")}</h1></div><div class="artwork-details-grid" data-v-a22d6bdd><div class="detail-item" data-v-a22d6bdd><span class="detail-label" data-v-a22d6bdd>ID</span><span class="detail-value" data-v-a22d6bdd>${ssrInterpolate(currentArtwork.value.pictufy_id)}</span></div><div class="detail-item" data-v-a22d6bdd><span class="detail-label" data-v-a22d6bdd>Category</span><span class="detail-value clickable-category" data-v-a22d6bdd>`);
        _push(ssrRenderComponent(unref(Tag), {
          value: currentArtwork.value.category,
          severity: "warn",
          onClick: ($event) => navigateToCategory(currentArtwork.value.category),
          pt: {
            root: { class: "text-sm md:text-base" }
          }
        }, null, _parent));
        _push(`</span></div></div>`);
        _push(ssrRenderComponent(unref(Divider), null, null, _parent));
        _push(ssrRenderComponent(ArtworkCustomizer, {
          artwork: currentArtwork.value,
          "pricing-config": __props.pricingConfig,
          "can-view-price": canViewPrice.value,
          "require-login-for-prices": __props.requireLoginForPrices,
          onFrameChange: handleFrameStyleChange
        }, null, _parent));
        _push(ssrRenderComponent(unref(Divider), { class: "my-8" }, null, _parent));
        _push(`<div class="product-info-section" data-v-a22d6bdd><h2 class="artwork-option" data-v-a22d6bdd>Product Information</h2><table class="w-full text-left border-collapse" data-v-a22d6bdd><tbody data-v-a22d6bdd><tr class="border-b border-gray-100 last:border-0" data-v-a22d6bdd><td class="py-3 pr-4 font-semibold text-gray-500 align-middle w-24 md:w-32" data-v-a22d6bdd> Artist </td><td class="py-3 align-middle" data-v-a22d6bdd>`);
        if (currentArtwork.value.artist_username) {
          _push(ssrRenderComponent(unref(Tag), {
            value: currentArtwork.value.artist,
            severity: "info",
            onClick: ($event) => navigateToArtist(currentArtwork.value.artist_username),
            pt: { root: { class: "text-base cursor-pointer hover:brightness-95 transition-all" } }
          }, null, _parent));
        } else {
          _push(`<span class="text-gray-900 font-medium" data-v-a22d6bdd>${ssrInterpolate(currentArtwork.value.artist)}</span>`);
        }
        _push(`</td></tr>`);
        if (parsedKeywords.value.length > 0) {
          _push(`<tr class="border-b border-gray-100 last:border-0" data-v-a22d6bdd><td class="py-3 pr-4 font-semibold text-gray-500 align-middle" data-v-a22d6bdd> Keywords </td><td class="py-3 align-middle" data-v-a22d6bdd><div class="flex flex-wrap gap-2" data-v-a22d6bdd><!--[-->`);
          ssrRenderList(parsedKeywords.value, (tag, index) => {
            _push(ssrRenderComponent(unref(Tag), {
              key: index,
              value: tag,
              severity: "secondary",
              rounded: "",
              onClick: ($event) => navigateToArtworksWithTag(tag),
              class: "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 px-3",
              role: "link"
            }, null, _parent));
          });
          _push(`<!--]--></div></td></tr>`);
        } else {
          _push(`<!---->`);
        }
        if (artworkColors.value.length > 0) {
          _push(`<tr class="border-b border-gray-100 last:border-0" data-v-a22d6bdd><td class="py-3 pr-4 font-semibold text-gray-500 align-middle" data-v-a22d6bdd> Colors </td><td class="py-3 align-middle" data-v-a22d6bdd><div class="flex flex-wrap gap-2 items-center" data-v-a22d6bdd><!--[-->`);
          ssrRenderList(artworkColors.value, (color) => {
            _push(`<div class="w-6 h-6 rounded border border-gray-200 cursor-pointer shadow-sm hover:scale-110 transition-transform relative group" style="${ssrRenderStyle({ backgroundColor: color.hex })}" data-v-a22d6bdd><span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10" data-v-a22d6bdd>${ssrInterpolate(color.label)}</span></div>`);
          });
          _push(`<!--]--></div></td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div></div>`);
      } else {
        _push(`<div class="flex justify-center items-center h-64" data-v-a22d6bdd><p data-v-a22d6bdd>Loading artwork details or artwork not found...</p></div>`);
      }
      _push(ssrRenderComponent(unref(Dialog), {
        visible: previewVisible.value,
        "onUpdate:visible": ($event) => previewVisible.value = $event,
        modal: "",
        dismissableMask: true,
        class: "image-preview-dialog",
        closable: false,
        headerClass: "p-dialog-custom-header",
        contentClass: "p-dialog-custom-content",
        pt: {
          root: {
            style: {
              justifyContent: "center",
              width: "-webkit-fill-available",
              height: "-webkit-fill-available",
              maxHeight: "none",
              background: "#ffffff0f",
              boxShadow: "none",
              border: "none"
            }
          },
          mask: { style: "backdrop-filter: blur(5px); background-color: rgba(0,0,0,0.85);" }
        }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="dialog-container" tabindex="-1" data-v-a22d6bdd${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Button), {
              icon: "pi pi-times",
              class: "dialog-custom-close-btn",
              onClick: ($event) => previewVisible.value = false,
              text: "",
              rounded: "",
              "aria-label": "Close"
            }, null, _parent2, _scopeId));
            _push2(`<div class="dialog-gallery-content" data-v-a22d6bdd${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Button), {
              icon: "pi pi-chevron-left",
              onClick: prevImage,
              class: "dialog-nav-btn left",
              disabled: galleryImages.value.length <= 1
            }, null, _parent2, _scopeId));
            if (galleryImages.value.length > 0 && galleryImages.value[currentIndex.value]) {
              _push2(`<!--[-->`);
              if (galleryImages.value[currentIndex.value].isPrimaryArtwork) {
                _push2(`<div class="${ssrRenderClass([{ "no-frame-mode": !selectedCanvas.value.url }, "canvas-frame-wrapper"])}" data-v-a22d6bdd${_scopeId}>`);
                if (selectedCanvas.value.url) {
                  _push2(`<img${ssrRenderAttr("src", selectedCanvas.value.url)} alt="Canvas Frame" class="canvas-frame-image" data-v-a22d6bdd${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<img${ssrRenderAttr("src", galleryImages.value[currentIndex.value].itemImageSrc)} class="artwork-on-canvas"${ssrRenderAttr("alt", galleryImages.value[currentIndex.value].alt)} style="${ssrRenderStyle({ top: selectedCanvas.value.artworkContainerStyle.top, left: selectedCanvas.value.artworkContainerStyle.left, width: selectedCanvas.value.artworkContainerStyle.width, height: selectedCanvas.value.artworkContainerStyle.height, transform: selectedCanvas.value.artworkTransform, transformOrigin: selectedCanvas.value.transformOrigin || "center center", boxShadow: selectedCanvas.value.artworkShadow })}" data-v-a22d6bdd${_scopeId}></div>`);
              } else {
                _push2(`<img${ssrRenderAttr("src", galleryImages.value[currentIndex.value].itemImageSrc)} class="preview-image-render"${ssrRenderAttr("alt", galleryImages.value[currentIndex.value].alt)} data-v-a22d6bdd${_scopeId}>`);
              }
              _push2(`<!--]-->`);
            } else {
              _push2(`<div class="artwork-placeholder-on-canvas" data-v-a22d6bdd${_scopeId}>Image not available</div>`);
            }
            _push2(ssrRenderComponent(unref(Button), {
              icon: "pi pi-chevron-right",
              onClick: nextImage,
              class: "dialog-nav-btn right",
              disabled: galleryImages.value.length <= 1
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", {
                class: "dialog-container",
                onKeydown: handleDialogKey,
                onTouchstart: handleTouchStart,
                onTouchend: handleTouchEnd,
                tabindex: "-1",
                ref: "dialogContainerRef"
              }, [
                createVNode(unref(Button), {
                  icon: "pi pi-times",
                  class: "dialog-custom-close-btn",
                  onClick: ($event) => previewVisible.value = false,
                  text: "",
                  rounded: "",
                  "aria-label": "Close"
                }, null, 8, ["onClick"]),
                createVNode("div", { class: "dialog-gallery-content" }, [
                  createVNode(unref(Button), {
                    icon: "pi pi-chevron-left",
                    onClick: withModifiers(prevImage, ["stop"]),
                    class: "dialog-nav-btn left",
                    disabled: galleryImages.value.length <= 1
                  }, null, 8, ["disabled"]),
                  galleryImages.value.length > 0 && galleryImages.value[currentIndex.value] ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    galleryImages.value[currentIndex.value].isPrimaryArtwork ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: ["canvas-frame-wrapper", { "no-frame-mode": !selectedCanvas.value.url }]
                    }, [
                      selectedCanvas.value.url ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: selectedCanvas.value.url,
                        alt: "Canvas Frame",
                        class: "canvas-frame-image"
                      }, null, 8, ["src"])) : createCommentVNode("", true),
                      createVNode("img", {
                        src: galleryImages.value[currentIndex.value].itemImageSrc,
                        class: "artwork-on-canvas",
                        alt: galleryImages.value[currentIndex.value].alt,
                        style: { top: selectedCanvas.value.artworkContainerStyle.top, left: selectedCanvas.value.artworkContainerStyle.left, width: selectedCanvas.value.artworkContainerStyle.width, height: selectedCanvas.value.artworkContainerStyle.height, transform: selectedCanvas.value.artworkTransform, transformOrigin: selectedCanvas.value.transformOrigin || "center center", boxShadow: selectedCanvas.value.artworkShadow }
                      }, null, 12, ["src", "alt"])
                    ], 2)) : (openBlock(), createBlock("img", {
                      key: 1,
                      src: galleryImages.value[currentIndex.value].itemImageSrc,
                      class: "preview-image-render",
                      alt: galleryImages.value[currentIndex.value].alt
                    }, null, 8, ["src", "alt"]))
                  ], 64)) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "artwork-placeholder-on-canvas"
                  }, "Image not available")),
                  createVNode(unref(Button), {
                    icon: "pi pi-chevron-right",
                    onClick: withModifiers(nextImage, ["stop"]),
                    class: "dialog-nav-btn right",
                    disabled: galleryImages.value.length <= 1
                  }, null, 8, ["disabled"])
                ])
              ], 544)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><section class="bg-black text-white py-16 md:py-24" data-v-a22d6bdd>`);
      _push(ssrRenderComponent(_sfc_main$2, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center" data-v-a22d6bdd${_scopeId}><div class="order-2 md:order-1 relative overflow-hidden rounded-sm my-8" data-v-a22d6bdd${_scopeId}><img src="/images/artwork-1.webp" alt="Interior Decoration" class="w-full h-full object-cover shadow-lg" data-v-a22d6bdd${_scopeId}></div><div class="order-1 md:order-2 px-4 md:px-12 text-center md:text-left" data-v-a22d6bdd${_scopeId}><p class="text-lg leading-relaxed font-light text-gray-200" data-v-a22d6bdd${_scopeId}> In our craft, we take great care to manufacture all paintings with high quality here in Greece. By using only 100% solid wood for the frames, we ensure both their durability and natural beauty. Enhancing the aesthetics of the works, we use only high quality cotton canvas. <br data-v-a22d6bdd${_scopeId}> In addition, you can choose the shade and dimensions that suit you after personal communication. Leave your signature in your space with unique paintings that reflect your quality and taste. </p></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center my-8 md:mb-24" data-v-a22d6bdd${_scopeId}><div class="px-4 md:px-12 text-center md:text-left" data-v-a22d6bdd${_scopeId}><p class="text-lg leading-relaxed font-light text-gray-200" data-v-a22d6bdd${_scopeId}> Bring museum-quality art to your space with an oil print or framed poster that will stand the test of time. All our products are made from excellent quality raw materials which give a solid and compact construction of high aesthetics. </p></div><div class="relative overflow-hidden rounded-sm" data-v-a22d6bdd${_scopeId}><img src="/images/artwork-2.webp" alt="Quality Craftsmanship" class="w-full h-full object-cover shadow-lg" data-v-a22d6bdd${_scopeId}></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center my-8" data-v-a22d6bdd${_scopeId}><div class="order-2 md:order-1 relative overflow-hidden rounded-sm" data-v-a22d6bdd${_scopeId}><img src="/images/artwork-3.webp" alt="Interior Decoration" class="w-full h-full object-cover shadow-lg" data-v-a22d6bdd${_scopeId}></div><div class="order-1 md:order-2 px-4 md:px-12 text-center md:text-left" data-v-a22d6bdd${_scopeId}><p class="text-lg leading-relaxed font-light text-gray-200" data-v-a22d6bdd${_scopeId}> Decorating your space couldn&#39;t be easier and more inspiring. Stand out by choosing from the timeless variety of works in our collection, whether on cotton canvas or Poster* </p><p class="text-xs text-gray-500 mt-4 italic" data-v-a22d6bdd${_scopeId}> *They are characterized mainly by the white border. </p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-12 items-center" }, [
                createVNode("div", { class: "order-2 md:order-1 relative overflow-hidden rounded-sm my-8" }, [
                  createVNode("img", {
                    src: "/images/artwork-1.webp",
                    alt: "Interior Decoration",
                    class: "w-full h-full object-cover shadow-lg"
                  })
                ]),
                createVNode("div", { class: "order-1 md:order-2 px-4 md:px-12 text-center md:text-left" }, [
                  createVNode("p", { class: "text-lg leading-relaxed font-light text-gray-200" }, [
                    createTextVNode(" In our craft, we take great care to manufacture all paintings with high quality here in Greece. By using only 100% solid wood for the frames, we ensure both their durability and natural beauty. Enhancing the aesthetics of the works, we use only high quality cotton canvas. "),
                    createVNode("br"),
                    createTextVNode(" In addition, you can choose the shade and dimensions that suit you after personal communication. Leave your signature in your space with unique paintings that reflect your quality and taste. ")
                  ])
                ])
              ]),
              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-12 items-center my-8 md:mb-24" }, [
                createVNode("div", { class: "px-4 md:px-12 text-center md:text-left" }, [
                  createVNode("p", { class: "text-lg leading-relaxed font-light text-gray-200" }, " Bring museum-quality art to your space with an oil print or framed poster that will stand the test of time. All our products are made from excellent quality raw materials which give a solid and compact construction of high aesthetics. ")
                ]),
                createVNode("div", { class: "relative overflow-hidden rounded-sm" }, [
                  createVNode("img", {
                    src: "/images/artwork-2.webp",
                    alt: "Quality Craftsmanship",
                    class: "w-full h-full object-cover shadow-lg"
                  })
                ])
              ]),
              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-12 items-center my-8" }, [
                createVNode("div", { class: "order-2 md:order-1 relative overflow-hidden rounded-sm" }, [
                  createVNode("img", {
                    src: "/images/artwork-3.webp",
                    alt: "Interior Decoration",
                    class: "w-full h-full object-cover shadow-lg"
                  })
                ]),
                createVNode("div", { class: "order-1 md:order-2 px-4 md:px-12 text-center md:text-left" }, [
                  createVNode("p", { class: "text-lg leading-relaxed font-light text-gray-200" }, " Decorating your space couldn't be easier and more inspiring. Stand out by choosing from the timeless variety of works in our collection, whether on cotton canvas or Poster* "),
                  createVNode("p", { class: "text-xs text-gray-500 mt-4 italic" }, " *They are characterized mainly by the white border. ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section>`);
      if (relatedArtworks.value.length > 0 || youMayLikeArtworks.value.length > 0) {
        _push(`<section class="mt-16 mb-8 content-wrapper" data-v-a22d6bdd>`);
        if (relatedArtworks.value.length > 0) {
          _push(`<div class="mb-12" data-v-a22d6bdd><h3 class="text-2xl text-center font-bold mb-6 text-gray-800" data-v-a22d6bdd>Related Products</h3>`);
          _push(ssrRenderComponent(unref(DataView), {
            value: relatedArtworks.value,
            layout: "grid"
          }, {
            grid: withCtx((slotProps, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="grid grid-cols-12 gap-4 md:gap-8" data-v-a22d6bdd${_scopeId}><!--[-->`);
                ssrRenderList(slotProps.items, (artwork, index) => {
                  _push2(`<div class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 p-2" data-v-a22d6bdd${_scopeId}><div class="rounded flex flex-col artwork-container" data-v-a22d6bdd${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Link), {
                    href: _ctx.route("artwork.details", {
                      id: artwork.pictufy_id || artwork.id,
                      slug: unref(slugify)(artwork.title || "artwork")
                    }),
                    class: "artwork-link"
                  }, {
                    default: withCtx((_, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div class="relative" data-v-a22d6bdd${_scopeId2}>`);
                        if (artwork == null ? void 0 : artwork.img_thumb) {
                          _push3(`<img${ssrRenderAttr("src", artwork.img_thumb)}${ssrRenderAttr("alt", artwork.title || "Untitled")} class="rounded w-full h-auto object-contain max-h-[250px] transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" decoding="async" data-v-a22d6bdd${_scopeId2}>`);
                        } else {
                          _push3(`<div class="no-image" data-v-a22d6bdd${_scopeId2}>No Image Available</div>`);
                        }
                        _push3(`<div class="artwork-overlay" data-v-a22d6bdd${_scopeId2}><div class="overlay-content" data-v-a22d6bdd${_scopeId2}><span class="artwork-title" data-v-a22d6bdd${_scopeId2}>${ssrInterpolate(artwork.title || "Untitled")}</span>`);
                        _push3(ssrRenderComponent(unref(Divider), { layout: "vertical" }, null, _parent3, _scopeId2));
                        _push3(`<span class="artwork-id" data-v-a22d6bdd${_scopeId2}>ID: ${ssrInterpolate(artwork.pictufy_id || artwork.id)}</span></div></div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "relative" }, [
                            (artwork == null ? void 0 : artwork.img_thumb) ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: artwork.img_thumb,
                              alt: artwork.title || "Untitled",
                              class: "rounded w-full h-auto object-contain max-h-[250px] transition-transform duration-300 group-hover:scale-[1.02]",
                              loading: "lazy",
                              decoding: "async"
                            }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "no-image"
                            }, "No Image Available")),
                            createVNode("div", { class: "artwork-overlay" }, [
                              createVNode("div", { class: "overlay-content" }, [
                                createVNode("span", { class: "artwork-title" }, toDisplayString(artwork.title || "Untitled"), 1),
                                createVNode(unref(Divider), { layout: "vertical" }),
                                createVNode("span", { class: "artwork-id" }, "ID: " + toDisplayString(artwork.pictufy_id || artwork.id), 1)
                              ])
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</div></div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                return [
                  createVNode("div", { class: "grid grid-cols-12 gap-4 md:gap-8" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(slotProps.items, (artwork, index) => {
                      return openBlock(), createBlock("div", {
                        key: artwork.id || index,
                        class: "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 p-2"
                      }, [
                        createVNode("div", { class: "rounded flex flex-col artwork-container" }, [
                          createVNode(unref(Link), {
                            href: _ctx.route("artwork.details", {
                              id: artwork.pictufy_id || artwork.id,
                              slug: unref(slugify)(artwork.title || "artwork")
                            }),
                            class: "artwork-link"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "relative" }, [
                                (artwork == null ? void 0 : artwork.img_thumb) ? (openBlock(), createBlock("img", {
                                  key: 0,
                                  src: artwork.img_thumb,
                                  alt: artwork.title || "Untitled",
                                  class: "rounded w-full h-auto object-contain max-h-[250px] transition-transform duration-300 group-hover:scale-[1.02]",
                                  loading: "lazy",
                                  decoding: "async"
                                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "no-image"
                                }, "No Image Available")),
                                createVNode("div", { class: "artwork-overlay" }, [
                                  createVNode("div", { class: "overlay-content" }, [
                                    createVNode("span", { class: "artwork-title" }, toDisplayString(artwork.title || "Untitled"), 1),
                                    createVNode(unref(Divider), { layout: "vertical" }),
                                    createVNode("span", { class: "artwork-id" }, "ID: " + toDisplayString(artwork.pictufy_id || artwork.id), 1)
                                  ])
                                ])
                              ])
                            ]),
                            _: 2
                          }, 1032, ["href"])
                        ])
                      ]);
                    }), 128))
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<div class="flex justify-center my-8" data-v-a22d6bdd>`);
          _push(ssrRenderComponent(unref(Button), {
            label: `See all from ${currentArtwork.value.category}`,
            icon: "pi pi-arrow-right",
            iconPos: "right",
            outlined: "",
            severity: "contrast",
            raised: "",
            class: "w-full md:w-auto px-8 py-3 font-semibold tracking-wide",
            onClick: navigateToCategoryTrending
          }, null, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(unref(Divider), null, null, _parent));
        if (youMayLikeArtworks.value.length > 0) {
          _push(`<div data-v-a22d6bdd><h3 class="text-2xl text-center font-bold mb-6 text-gray-800" data-v-a22d6bdd>You May Also Like</h3>`);
          _push(ssrRenderComponent(unref(DataView), {
            value: youMayLikeArtworks.value,
            layout: "grid"
          }, {
            grid: withCtx((slotProps, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="grid grid-cols-12 gap-4 md:gap-8" data-v-a22d6bdd${_scopeId}><!--[-->`);
                ssrRenderList(slotProps.items, (artwork, index) => {
                  _push2(`<div class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 p-2" data-v-a22d6bdd${_scopeId}><div class="rounded flex flex-col artwork-container" data-v-a22d6bdd${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Link), {
                    href: _ctx.route("artwork.details", {
                      id: artwork.pictufy_id || artwork.id,
                      slug: unref(slugify)(artwork.title || "artwork")
                    }),
                    class: "artwork-link"
                  }, {
                    default: withCtx((_, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div class="relative" data-v-a22d6bdd${_scopeId2}>`);
                        if (artwork == null ? void 0 : artwork.img_thumb) {
                          _push3(`<img${ssrRenderAttr("src", artwork.img_thumb)}${ssrRenderAttr("alt", artwork.title || "Untitled")} class="rounded w-full h-auto object-contain max-h-[250px] transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" decoding="async" data-v-a22d6bdd${_scopeId2}>`);
                        } else {
                          _push3(`<div class="no-image" data-v-a22d6bdd${_scopeId2}>No Image Available</div>`);
                        }
                        _push3(`<div class="artwork-overlay" data-v-a22d6bdd${_scopeId2}><div class="overlay-content" data-v-a22d6bdd${_scopeId2}><span class="artwork-title" data-v-a22d6bdd${_scopeId2}>${ssrInterpolate(artwork.title || "Untitled")}</span>`);
                        _push3(ssrRenderComponent(unref(Divider), { layout: "vertical" }, null, _parent3, _scopeId2));
                        _push3(`<span class="artwork-id" data-v-a22d6bdd${_scopeId2}>ID: ${ssrInterpolate(artwork.pictufy_id || artwork.id)}</span></div></div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "relative" }, [
                            (artwork == null ? void 0 : artwork.img_thumb) ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: artwork.img_thumb,
                              alt: artwork.title || "Untitled",
                              class: "rounded w-full h-auto object-contain max-h-[250px] transition-transform duration-300 group-hover:scale-[1.02]",
                              loading: "lazy",
                              decoding: "async"
                            }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "no-image"
                            }, "No Image Available")),
                            createVNode("div", { class: "artwork-overlay" }, [
                              createVNode("div", { class: "overlay-content" }, [
                                createVNode("span", { class: "artwork-title" }, toDisplayString(artwork.title || "Untitled"), 1),
                                createVNode(unref(Divider), { layout: "vertical" }),
                                createVNode("span", { class: "artwork-id" }, "ID: " + toDisplayString(artwork.pictufy_id || artwork.id), 1)
                              ])
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</div></div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                return [
                  createVNode("div", { class: "grid grid-cols-12 gap-4 md:gap-8" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(slotProps.items, (artwork, index) => {
                      return openBlock(), createBlock("div", {
                        key: artwork.id || index,
                        class: "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 p-2"
                      }, [
                        createVNode("div", { class: "rounded flex flex-col artwork-container" }, [
                          createVNode(unref(Link), {
                            href: _ctx.route("artwork.details", {
                              id: artwork.pictufy_id || artwork.id,
                              slug: unref(slugify)(artwork.title || "artwork")
                            }),
                            class: "artwork-link"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "relative" }, [
                                (artwork == null ? void 0 : artwork.img_thumb) ? (openBlock(), createBlock("img", {
                                  key: 0,
                                  src: artwork.img_thumb,
                                  alt: artwork.title || "Untitled",
                                  class: "rounded w-full h-auto object-contain max-h-[250px] transition-transform duration-300 group-hover:scale-[1.02]",
                                  loading: "lazy",
                                  decoding: "async"
                                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "no-image"
                                }, "No Image Available")),
                                createVNode("div", { class: "artwork-overlay" }, [
                                  createVNode("div", { class: "overlay-content" }, [
                                    createVNode("span", { class: "artwork-title" }, toDisplayString(artwork.title || "Untitled"), 1),
                                    createVNode(unref(Divider), { layout: "vertical" }),
                                    createVNode("span", { class: "artwork-id" }, "ID: " + toDisplayString(artwork.pictufy_id || artwork.id), 1)
                                  ])
                                ])
                              ])
                            ]),
                            _: 2
                          }, 1032, ["href"])
                        ])
                      ]);
                    }), 128))
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section>`);
      } else if (isLoadingRelated.value) {
        _push(`<div class="flex justify-center mt-12 mb-8" data-v-a22d6bdd>`);
        _push(ssrRenderComponent(unref(ProgressSpinner), {
          style: { "width": "40px", "height": "40px" },
          strokeWidth: "4"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/ArtworkDetails.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ArtworkDetails = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a22d6bdd"]]);
export {
  ArtworkDetails as default
};
