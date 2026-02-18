import { ref, computed, unref, withCtx, createTextVNode, createVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { usePage, Head, Link, router } from "@inertiajs/vue3";
import { H as HeaderLayout } from "./HeaderLayout-zh2NGVuN.js";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import Divider from "primevue/divider";
import Card from "primevue/card";
import Message from "primevue/message";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { a as _sfc_main$1, P as PageTitleSection } from "../ssr.js";
import { _ as _sfc_main$2 } from "./FramedArtworkPreview-NDj3wDB4.js";
import "primevue/drawer";
import "primevue/overlaybadge";
import "./ApplicationLogo-rkFqmqnV.js";
import "primevue/menu";
import "primevue/menubar";
import "primevue/panelmenu";
import "primevue/popover";
import "primevue/inputtext";
import "@inertiajs/vue3/server";
import "@vue/server-renderer";
import "primevue/config";
import "primevue/toastservice";
import "primevue/confirmationservice";
import "@primeuix/themes/aura";
import "@primeuix/themes";
import "./SQUARE_WALNUT-87wNLTxN.js";
const _sfc_main = /* @__PURE__ */ Object.assign({
  layout: HeaderLayout
}, {
  __name: "Cart",
  __ssrInlineRender: true,
  props: {
    cartItems: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    usePage();
    const toast = useToast();
    const itemQuantities = ref({});
    props.cartItems.forEach((item) => {
      itemQuantities.value[item.id] = item.quantity;
    });
    const cartIsEmpty = computed(() => !props.cartItems || props.cartItems.length === 0);
    const cartSubtotal = computed(() => {
      return props.cartItems.reduce((sum, item) => {
        var _a;
        const price = parseFloat(((_a = item.artwork_data) == null ? void 0 : _a.price) || 0);
        const quantity = itemQuantities.value[item.id] || item.quantity;
        return sum + price * quantity;
      }, 0);
    });
    const shippingCost = computed(() => cartSubtotal.value > 100 ? 0 : 5);
    const cartTotal = computed(() => cartSubtotal.value + shippingCost.value);
    const updateQuantity = (itemId, newValue) => {
      itemQuantities.value[itemId] = newValue;
      const originalItem = props.cartItems.find((item) => item.id === itemId);
      if (originalItem && Number(originalItem.quantity) === Number(newValue)) {
        return;
      }
      router.put(route("cart.update", itemId), {
        quantity: newValue
      }, {
        preserveScroll: true,
        preserveState: true,
        // No onSuccess needed if you removed backend toast & use global watcher
        onError: (errors) => {
          if (originalItem) {
            itemQuantities.value[itemId] = originalItem.quantity;
          }
          toast.add({ severity: "error", summary: "Error", detail: "Failed to update.", life: 3e3 });
          console.error("Update error:", errors);
        }
      });
    };
    const removeItem = (itemId) => {
      router.delete(route("cart.destroy", itemId), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          toast.add({ severity: "info", summary: "Removed", detail: "Item removed from cart", life: 3e3 });
          delete itemQuantities.value[itemId];
        },
        onError: (errors) => {
          toast.add({ severity: "error", summary: "Error", detail: "Failed to remove item.", life: 3e3 });
          console.error("Remove item error:", errors);
        }
      });
    };
    const formatCurrency = (value, showSymbol = true) => {
      if (typeof value !== "number") {
        value = parseFloat(value) || 0;
      }
      const options = showSymbol ? { style: "currency", currency: "EUR" } : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
      return new Intl.NumberFormat("el-GR", options).format(value);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Your Cart" }, null, _parent));
      _push(ssrRenderComponent(unref(Toast), { position: "top-center" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        class: "mt-10 mb-10",
        vertical: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(PageTitleSection, null, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Your Shopping Cart`);
                } else {
                  return [
                    createTextVNode("Your Shopping Cart")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (cartIsEmpty.value) {
              _push2(`<div class="text-center py-12"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Message), {
                severity: "info",
                closable: false
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Your cart is currently empty.`);
                  } else {
                    return [
                      createTextVNode("Your cart is currently empty.")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("artworks")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Button), {
                      label: "Continue Shopping",
                      icon: "pi pi-arrow-right",
                      iconPos: "right",
                      class: "mt-6"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(Button), {
                        label: "Continue Shopping",
                        icon: "pi pi-arrow-right",
                        iconPos: "right",
                        class: "mt-6"
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<div class="grid grid-cols-12 gap-6 md:gap-8"${_scopeId}><div class="col-span-12 lg:col-span-8"${_scopeId}><div class="space-y-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.cartItems, (item) => {
                var _a, _b, _c, _d;
                _push2(`<div class="flex flex-row items-center gap-3 sm:gap-4 border dynamic-border p-3 sm:p-4 rounded-lg shadow-sm"${_scopeId}><div class="flex-shrink-0 w-16 sm:w-24"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$2, {
                  "artwork-image": ((_a = item.artwork_data) == null ? void 0 : _a.img_thumb) || "/images/placeholder.png",
                  frame: item.frame,
                  size: item.size,
                  type: item.type
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="flex-1 min-w-0"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  class: "font-medium truncate hover:text-primary hover:underline transition-colors no-underline text-inherit",
                  href: _ctx.route("artwork.details", { id: item.artwork_id, slug: (_b = item.artwork_data) == null ? void 0 : _b.slug })
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    var _a2, _b2;
                    if (_push3) {
                      _push3(`<h3${_scopeId2}>${ssrInterpolate(((_a2 = item.artwork_data) == null ? void 0 : _a2.title) || "Untitled")}</h3>`);
                    } else {
                      return [
                        createVNode("h3", null, toDisplayString(((_b2 = item.artwork_data) == null ? void 0 : _b2.title) || "Untitled"), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<p class="text-xs text-muted-color mb-1 hidden sm:block"${_scopeId}>ID: ${ssrInterpolate(item.artwork_id)}</p><p class="text-xs sm:text-sm text-muted-color"${_scopeId}>Type: ${ssrInterpolate(item.type)}</p><p class="text-xs sm:text-sm text-muted-color"${_scopeId}>Print: ${ssrInterpolate(item.print_type === "oil" ? "Oil Print" : "Mono Print")}</p><p class="text-xs sm:text-sm text-muted-color"${_scopeId}>Frame: ${ssrInterpolate(item.frame)}</p><p class="text-xs sm:text-sm text-muted-color"${_scopeId}>Size: ${ssrInterpolate(item.size)}</p><p class="block sm:hidden mt-1 text-sm text-muted-color"${_scopeId}>${ssrInterpolate(itemQuantities.value[item.id])} x <span class="font-semibold"${_scopeId}>€${ssrInterpolate(formatCurrency(((_c = item.artwork_data) == null ? void 0 : _c.price) || 0, false))}</span></p></div><div class="flex flex-row items-center justify-end gap-2 sm:gap-4 ml-auto"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(InputNumber), {
                  modelValue: itemQuantities.value[item.id],
                  "onUpdate:modelValue": (newValue) => updateQuantity(item.id, newValue),
                  min: 1,
                  showButtons: "",
                  buttonLayout: "horizontal",
                  inputClass: "w-12 text-center",
                  decrementButtonClass: "p-button-secondary",
                  incrementButtonClass: "p-button-secondary"
                }, null, _parent2, _scopeId));
                _push2(`<div class="font-semibold w-16 sm:w-24 text-right hidden sm:block"${_scopeId}>${ssrInterpolate(formatCurrency(parseFloat(((_d = item.artwork_data) == null ? void 0 : _d.price) || 0) * itemQuantities.value[item.id]))}</div>`);
                _push2(ssrRenderComponent(unref(Button), {
                  icon: "pi pi-times-circle",
                  severity: "secondary",
                  text: "",
                  rounded: "",
                  "aria-label": "Remove Item",
                  onClick: ($event) => removeItem(item.id),
                  "pt:root:class": "!p-1 !w-7 !h-7 sm:!p-2 sm:!w-8 sm:!h-8"
                }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
              });
              _push2(`<!--]--></div></div><div class="col-span-12 lg:col-span-4"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Card), { class: "sticky top-28" }, {
                title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<h4 class="text-xl font-semibold"${_scopeId2}>Order Summary</h4>`);
                  } else {
                    return [
                      createVNode("h4", { class: "text-xl font-semibold" }, "Order Summary")
                    ];
                  }
                }),
                content: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="space-y-3"${_scopeId2}><div class="flex justify-between"${_scopeId2}><span${_scopeId2}>Subtotal</span><span${_scopeId2}>${ssrInterpolate(formatCurrency(cartSubtotal.value))}</span></div><div class="flex justify-between"${_scopeId2}><span${_scopeId2}>Shipping</span><span${_scopeId2}>${ssrInterpolate(formatCurrency(shippingCost.value))}</span></div>`);
                    _push3(ssrRenderComponent(unref(Divider), null, null, _parent3, _scopeId2));
                    _push3(`<div class="flex justify-between font-bold text-lg"${_scopeId2}><span${_scopeId2}>Total</span><span${_scopeId2}>${ssrInterpolate(formatCurrency(cartTotal.value))}</span></div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "space-y-3" }, [
                        createVNode("div", { class: "flex justify-between" }, [
                          createVNode("span", null, "Subtotal"),
                          createVNode("span", null, toDisplayString(formatCurrency(cartSubtotal.value)), 1)
                        ]),
                        createVNode("div", { class: "flex justify-between" }, [
                          createVNode("span", null, "Shipping"),
                          createVNode("span", null, toDisplayString(formatCurrency(shippingCost.value)), 1)
                        ]),
                        createVNode(unref(Divider)),
                        createVNode("div", { class: "flex justify-between font-bold text-lg" }, [
                          createVNode("span", null, "Total"),
                          createVNode("span", null, toDisplayString(formatCurrency(cartTotal.value)), 1)
                        ])
                      ])
                    ];
                  }
                }),
                footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Link), {
                      href: _ctx.route("checkout.index"),
                      class: "w-full"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Button), {
                            label: "Proceed to Checkout",
                            class: "w-full",
                            icon: "pi pi-lock",
                            iconPos: "right"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(Button), {
                              label: "Proceed to Checkout",
                              class: "w-full",
                              icon: "pi pi-lock",
                              iconPos: "right"
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(Link), {
                        href: _ctx.route("checkout.index"),
                        class: "w-full"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Button), {
                            label: "Proceed to Checkout",
                            class: "w-full",
                            icon: "pi pi-lock",
                            iconPos: "right"
                          })
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            }
          } else {
            return [
              createVNode(PageTitleSection, null, {
                title: withCtx(() => [
                  createTextVNode("Your Shopping Cart")
                ]),
                _: 1
              }),
              cartIsEmpty.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "text-center py-12"
              }, [
                createVNode(unref(Message), {
                  severity: "info",
                  closable: false
                }, {
                  default: withCtx(() => [
                    createTextVNode("Your cart is currently empty.")
                  ]),
                  _: 1
                }),
                createVNode(unref(Link), {
                  href: _ctx.route("artworks")
                }, {
                  default: withCtx(() => [
                    createVNode(unref(Button), {
                      label: "Continue Shopping",
                      icon: "pi pi-arrow-right",
                      iconPos: "right",
                      class: "mt-6"
                    })
                  ]),
                  _: 1
                }, 8, ["href"])
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "grid grid-cols-12 gap-6 md:gap-8"
              }, [
                createVNode("div", { class: "col-span-12 lg:col-span-8" }, [
                  createVNode("div", { class: "space-y-4" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.cartItems, (item) => {
                      var _a, _b, _c, _d;
                      return openBlock(), createBlock("div", {
                        key: item.id,
                        class: "flex flex-row items-center gap-3 sm:gap-4 border dynamic-border p-3 sm:p-4 rounded-lg shadow-sm"
                      }, [
                        createVNode("div", { class: "flex-shrink-0 w-16 sm:w-24" }, [
                          createVNode(_sfc_main$2, {
                            "artwork-image": ((_a = item.artwork_data) == null ? void 0 : _a.img_thumb) || "/images/placeholder.png",
                            frame: item.frame,
                            size: item.size,
                            type: item.type
                          }, null, 8, ["artwork-image", "frame", "size", "type"])
                        ]),
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode(unref(Link), {
                            class: "font-medium truncate hover:text-primary hover:underline transition-colors no-underline text-inherit",
                            href: _ctx.route("artwork.details", { id: item.artwork_id, slug: (_b = item.artwork_data) == null ? void 0 : _b.slug })
                          }, {
                            default: withCtx(() => {
                              var _a2;
                              return [
                                createVNode("h3", null, toDisplayString(((_a2 = item.artwork_data) == null ? void 0 : _a2.title) || "Untitled"), 1)
                              ];
                            }),
                            _: 2
                          }, 1032, ["href"]),
                          createVNode("p", { class: "text-xs text-muted-color mb-1 hidden sm:block" }, "ID: " + toDisplayString(item.artwork_id), 1),
                          createVNode("p", { class: "text-xs sm:text-sm text-muted-color" }, "Type: " + toDisplayString(item.type), 1),
                          createVNode("p", { class: "text-xs sm:text-sm text-muted-color" }, "Print: " + toDisplayString(item.print_type === "oil" ? "Oil Print" : "Mono Print"), 1),
                          createVNode("p", { class: "text-xs sm:text-sm text-muted-color" }, "Frame: " + toDisplayString(item.frame), 1),
                          createVNode("p", { class: "text-xs sm:text-sm text-muted-color" }, "Size: " + toDisplayString(item.size), 1),
                          createVNode("p", { class: "block sm:hidden mt-1 text-sm text-muted-color" }, [
                            createTextVNode(toDisplayString(itemQuantities.value[item.id]) + " x ", 1),
                            createVNode("span", { class: "font-semibold" }, "€" + toDisplayString(formatCurrency(((_c = item.artwork_data) == null ? void 0 : _c.price) || 0, false)), 1)
                          ])
                        ]),
                        createVNode("div", { class: "flex flex-row items-center justify-end gap-2 sm:gap-4 ml-auto" }, [
                          createVNode(unref(InputNumber), {
                            modelValue: itemQuantities.value[item.id],
                            "onUpdate:modelValue": (newValue) => updateQuantity(item.id, newValue),
                            min: 1,
                            showButtons: "",
                            buttonLayout: "horizontal",
                            inputClass: "w-12 text-center",
                            decrementButtonClass: "p-button-secondary",
                            incrementButtonClass: "p-button-secondary"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode("div", { class: "font-semibold w-16 sm:w-24 text-right hidden sm:block" }, toDisplayString(formatCurrency(parseFloat(((_d = item.artwork_data) == null ? void 0 : _d.price) || 0) * itemQuantities.value[item.id])), 1),
                          createVNode(unref(Button), {
                            icon: "pi pi-times-circle",
                            severity: "secondary",
                            text: "",
                            rounded: "",
                            "aria-label": "Remove Item",
                            onClick: ($event) => removeItem(item.id),
                            "pt:root:class": "!p-1 !w-7 !h-7 sm:!p-2 sm:!w-8 sm:!h-8"
                          }, null, 8, ["onClick"])
                        ])
                      ]);
                    }), 128))
                  ])
                ]),
                createVNode("div", { class: "col-span-12 lg:col-span-4" }, [
                  createVNode(unref(Card), { class: "sticky top-28" }, {
                    title: withCtx(() => [
                      createVNode("h4", { class: "text-xl font-semibold" }, "Order Summary")
                    ]),
                    content: withCtx(() => [
                      createVNode("div", { class: "space-y-3" }, [
                        createVNode("div", { class: "flex justify-between" }, [
                          createVNode("span", null, "Subtotal"),
                          createVNode("span", null, toDisplayString(formatCurrency(cartSubtotal.value)), 1)
                        ]),
                        createVNode("div", { class: "flex justify-between" }, [
                          createVNode("span", null, "Shipping"),
                          createVNode("span", null, toDisplayString(formatCurrency(shippingCost.value)), 1)
                        ]),
                        createVNode(unref(Divider)),
                        createVNode("div", { class: "flex justify-between font-bold text-lg" }, [
                          createVNode("span", null, "Total"),
                          createVNode("span", null, toDisplayString(formatCurrency(cartTotal.value)), 1)
                        ])
                      ])
                    ]),
                    footer: withCtx(() => [
                      createVNode(unref(Link), {
                        href: _ctx.route("checkout.index"),
                        class: "w-full"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Button), {
                            label: "Proceed to Checkout",
                            class: "w-full",
                            icon: "pi pi-lock",
                            iconPos: "right"
                          })
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ]),
                    _: 1
                  })
                ])
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Cart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
