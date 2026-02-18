import { ref, computed, withCtx, unref, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, Fragment, renderList, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { H as HeaderLayout } from "./HeaderLayout-zh2NGVuN.js";
import { _ as _export_sfc, a as _sfc_main$1, P as PageTitleSection } from "../ssr.js";
import { _ as _sfc_main$2 } from "./FramedArtworkPreview-NDj3wDB4.js";
import Button from "primevue/button";
import Tag from "primevue/tag";
import { u as useCountries } from "./useCountries-DisC8OA1.js";
import "primevue/toast";
import "primevue/drawer";
import "primevue/overlaybadge";
import "./ApplicationLogo-rkFqmqnV.js";
import "primevue/menu";
import "primevue/menubar";
import "primevue/panelmenu";
import "primevue/popover";
import "primevue/usetoast";
import "primevue/inputtext";
import "@inertiajs/vue3/server";
import "@vue/server-renderer";
import "primevue/config";
import "primevue/toastservice";
import "primevue/confirmationservice";
import "@primeuix/themes/aura";
import "@primeuix/themes";
import "./SQUARE_WALNUT-87wNLTxN.js";
const _sfc_main = {
  __name: "CheckoutComplete",
  __ssrInlineRender: true,
  props: {
    order: Object
  },
  setup(__props) {
    const props = __props;
    const { getCountryName } = useCountries();
    const showFullDetails = ref(false);
    const toggleDetails = () => {
      showFullDetails.value = !showFullDetails.value;
    };
    const printOrder = () => {
      window.print();
    };
    const orderItems = computed(() => {
      var _a;
      return ((_a = props.order) == null ? void 0 : _a.items) || [];
    });
    const billingCountryName = computed(() => {
      var _a;
      return getCountryName((_a = props.order) == null ? void 0 : _a.billing_country);
    });
    const shippingCountryName = computed(() => {
      var _a;
      return getCountryName((_a = props.order) == null ? void 0 : _a.shipping_country);
    });
    const subtotal = computed(() => {
      let total = 0;
      if (orderItems.value) {
        orderItems.value.forEach((item) => {
          total += parseFloat(item.price) * parseInt(item.quantity);
        });
      }
      return total;
    });
    const shippingCost = computed(() => {
      var _a;
      return ((_a = props.order) == null ? void 0 : _a.shipping_cost) || 0;
    });
    function formatCurrency(value) {
      if (typeof value !== "number") {
        value = parseFloat(value) || 0;
      }
      return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
    }
    function getPaymentMethodIcon(method) {
      switch (method) {
        case "stripe":
          return "pi pi-credit-card";
        case "cod":
          return "pi pi-wallet";
        case "bank_transfer":
          return "pi pi-bank";
        default:
          return "pi pi-question-circle";
      }
    }
    function getPaymentMethodLabel(method) {
      const labels = {
        stripe: "Credit/Debit Card (Stripe)",
        cod: "Cash On Delivery",
        bank_transfer: "Bank Transfer"
      };
      return labels[method] || method.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
    function getPaymentStatusSeverity(status) {
      switch (status == null ? void 0 : status.toLowerCase()) {
        case "paid":
        case "completed":
          return "success";
        case "pending":
          return "warning";
        case "failed":
        case "cancelled":
          return "danger";
        default:
          return "info";
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(HeaderLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Order Complete" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(PageTitleSection, { title: "Order Complete" }, null, _parent3, _scopeId2));
                  _push3(`<div class="main-content" data-v-bf5bd6c2${_scopeId2}><div class="content-wrapper" data-v-bf5bd6c2${_scopeId2}><div class="card p-6 md:p-8" data-v-bf5bd6c2${_scopeId2}><span class="text-surface-700 dark:text-surface-100 text-xl" data-v-bf5bd6c2${_scopeId2}>Thanks, ${ssrInterpolate(__props.order.billing_first_name || "Customer")}!</span><div class="text-surface-900 dark:text-surface-0 font-bold text-4xl my-2" data-v-bf5bd6c2${_scopeId2}>Successful Order! </div><p class="text-surface-700 dark:text-surface-100 text-xl mt-0 mb-6 p-0" data-v-bf5bd6c2${_scopeId2}> Your order is being processed. We&#39;ll contact you soon for further payment details. </p><div style="${ssrRenderStyle({ "height": "3px", "background": "linear-gradient(90deg, var(--p-primary-color) 0%, rgba(var(--p-primary-rgb), 0) 50%)" })}" data-v-bf5bd6c2${_scopeId2}></div><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-8" data-v-bf5bd6c2${_scopeId2}><div class="mb-4 sm:mb-0" data-v-bf5bd6c2${_scopeId2}><span class="font-medium text-xl text-surface-900 dark:text-surface-0 mr-2" data-v-bf5bd6c2${_scopeId2}>Order number:</span><span class="font-medium text-xl text-primary-500" data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(__props.order.order_number)}</span></div><div data-v-bf5bd6c2${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Button), {
                    label: "Details",
                    icon: "pi pi-list",
                    outlined: "",
                    class: "mr-2",
                    onClick: toggleDetails
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Button), {
                    label: "Print",
                    icon: "pi pi-print",
                    outlined: "",
                    onClick: printOrder
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div><div class="rounded border-surface-200 dark:border-surface-700 border" data-v-bf5bd6c2${_scopeId2}><ul class="list-none p-0 m-0" data-v-bf5bd6c2${_scopeId2}><!--[-->`);
                  ssrRenderList(orderItems.value, (item) => {
                    var _a, _b, _c;
                    _push3(`<li class="p-4 border-surface-200 dark:border-surface-700 flex items-start sm:items-center border-b last:border-b-0" data-v-bf5bd6c2${_scopeId2}><div class="flex items-center w-full sm:w-auto mb-4 sm:mb-0" data-v-bf5bd6c2${_scopeId2}><div class="flex-shrink-0 w-16 sm:w-24 mr-4" data-v-bf5bd6c2${_scopeId2}>`);
                    _push3(ssrRenderComponent(_sfc_main$2, {
                      "artwork-image": ((_a = item.artwork_data) == null ? void 0 : _a.img_thumb) || ((_b = item.artwork_data) == null ? void 0 : _b.img_medium) || "/images/placeholder.png",
                      frame: item.frame,
                      size: item.size,
                      type: item.type
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div data-v-bf5bd6c2${_scopeId2}><h4 class="font-medium text-surface-900 dark:text-surface-0" data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(((_c = item.artwork_data) == null ? void 0 : _c.title) || "Artwork")}</h4><div class="text-sm text-surface-600 dark:text-surface-400 mt-1 space-y-0.5" data-v-bf5bd6c2${_scopeId2}><p data-v-bf5bd6c2${_scopeId2}>ID: ${ssrInterpolate(item.artwork_id || item.pictufy_id || item.id)}</p><p data-v-bf5bd6c2${_scopeId2}>Type: ${ssrInterpolate(item.type)}</p><p data-v-bf5bd6c2${_scopeId2}>Print: ${ssrInterpolate(item.print_type === "oil" ? "Oil Print" : "Mono Print")}</p><p data-v-bf5bd6c2${_scopeId2}>Frame: ${ssrInterpolate(item.frame)}</p><p data-v-bf5bd6c2${_scopeId2}>Size: ${ssrInterpolate(item.size)}</p></div></div></div><div class="w-full sm:w-auto sm:ml-auto text-left sm:text-right pt-2 sm:pt-0 mt-2 sm:mt-0" data-v-bf5bd6c2${_scopeId2}><span class="block text-sm text-surface-500 text-right" data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(item.quantity)} x ${ssrInterpolate(formatCurrency(item.price))}</span><span class="block font-bold text-lg text-surface-900 dark:text-surface-0 text-right" data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(formatCurrency(item.quantity * item.price))}</span></div></li>`);
                  });
                  _push3(`<!--]--></ul></div><div class="flex flex-col lg:flex-row gap-6 mt-8 pb-4" data-v-bf5bd6c2${_scopeId2}><div class="w-full lg:w-1/2 space-y-6" data-v-bf5bd6c2${_scopeId2}><div data-v-bf5bd6c2${_scopeId2}><h3 class="font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3" data-v-bf5bd6c2${_scopeId2}>Billing Address</h3><div class="flex flex-col text-surface-700 dark:text-surface-200 space-y-1" data-v-bf5bd6c2${_scopeId2}><span data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(__props.order.billing_first_name)} ${ssrInterpolate(__props.order.billing_last_name)}</span><span data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(__props.order.billing_address)}</span><span data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(__props.order.billing_city)}, ${ssrInterpolate(__props.order.billing_state_or_county)} ${ssrInterpolate(__props.order.billing_postal_code)}</span><span data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(billingCountryName.value)}</span><span data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(__props.order.billing_email)}</span>`);
                  if (__props.order.billing_phone) {
                    _push3(`<span data-v-bf5bd6c2${_scopeId2}>Phone: ${ssrInterpolate(__props.order.billing_phone)}</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div></div><div data-v-bf5bd6c2${_scopeId2}><h3 class="font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3" data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(__props.order.shipping_is_different ? "Shipping Address" : "Shipping (Same as Billing) ")}</h3>`);
                  if (__props.order.shipping_is_different) {
                    _push3(`<div class="flex flex-col text-surface-700 dark:text-surface-200 space-y-1" data-v-bf5bd6c2${_scopeId2}><span data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(__props.order.shipping_first_name)} ${ssrInterpolate(__props.order.shipping_last_name)}</span><span data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(__props.order.shipping_address)}</span><span data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(__props.order.shipping_city)}, ${ssrInterpolate(__props.order.shipping_state_or_county)} ${ssrInterpolate(__props.order.shipping_postal_code)}</span><span data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(shippingCountryName.value)}</span>`);
                    if (__props.order.shipping_phone) {
                      _push3(`<span data-v-bf5bd6c2${_scopeId2}>Phone: ${ssrInterpolate(__props.order.shipping_phone)}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (__props.order.shipping_email && __props.order.shipping_email !== __props.order.billing_email) {
                      _push3(`<span data-v-bf5bd6c2${_scopeId2}>Email: ${ssrInterpolate(__props.order.shipping_email)}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    _push3(`<div class="text-surface-700 dark:text-surface-200 italic" data-v-bf5bd6c2${_scopeId2}> Shipping address is the same as billing address. </div>`);
                  }
                  _push3(`</div>`);
                  if (__props.order.wants_invoice) {
                    _push3(`<div data-v-bf5bd6c2${_scopeId2}><h3 class="font-semibold text-lg text-surface-900 dark:text-surface-0 mt-4 mb-3" data-v-bf5bd6c2${_scopeId2}> Invoice Details</h3><div class="flex flex-col text-surface-700 dark:text-surface-200 space-y-1" data-v-bf5bd6c2${_scopeId2}>`);
                    if (__props.order.invoice_company_name) {
                      _push3(`<span data-v-bf5bd6c2${_scopeId2}>Company: ${ssrInterpolate(__props.order.invoice_company_name)}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (__props.order.invoice_vat_number) {
                      _push3(`<span data-v-bf5bd6c2${_scopeId2}>VAT: ${ssrInterpolate(__props.order.invoice_vat_number)}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (__props.order.invoice_profession) {
                      _push3(`<span data-v-bf5bd6c2${_scopeId2}>Profession: ${ssrInterpolate(__props.order.invoice_profession)}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (__props.order.invoice_tax_office) {
                      _push3(`<span data-v-bf5bd6c2${_scopeId2}>Tax Office: ${ssrInterpolate(__props.order.invoice_tax_office)}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="w-full lg:w-1/2 space-y-6" data-v-bf5bd6c2${_scopeId2}><div data-v-bf5bd6c2${_scopeId2}><h3 class="font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3" data-v-bf5bd6c2${_scopeId2}>Payment </h3><div class="flex items-center" data-v-bf5bd6c2${_scopeId2}><i class="${ssrRenderClass([getPaymentMethodIcon(__props.order.payment_method), "mr-2 text-2xl text-surface-700 dark:text-surface-200"])}" data-v-bf5bd6c2${_scopeId2}></i><div class="flex flex-col" data-v-bf5bd6c2${_scopeId2}><span class="text-surface-700 dark:text-surface-200 mb-1" data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(getPaymentMethodLabel(__props.order.payment_method))}</span>`);
                  if (__props.order.payment_method === "stripe") {
                    _push3(`<span class="text-surface-700 dark:text-surface-200 font-medium" data-v-bf5bd6c2${_scopeId2}>**** **** **** ${ssrInterpolate(__props.order.card_last_four || "XXXX")}</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<span class="text-sm capitalize" data-v-bf5bd6c2${_scopeId2}>Status: `);
                  _push3(ssrRenderComponent(unref(Tag), {
                    value: __props.order.payment_status,
                    severity: getPaymentStatusSeverity(__props.order.payment_status)
                  }, null, _parent3, _scopeId2));
                  _push3(`</span></div></div></div><div class="mt-6" data-v-bf5bd6c2${_scopeId2}><h3 class="font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3" data-v-bf5bd6c2${_scopeId2}>Summary </h3><ul class="list-none p-0 m-0 w-full" data-v-bf5bd6c2${_scopeId2}><li class="flex justify-between mb-2" data-v-bf5bd6c2${_scopeId2}><span class="text-surface-700 dark:text-surface-200" data-v-bf5bd6c2${_scopeId2}>Subtotal</span><span class="text-surface-700 dark:text-surface-200 font-medium text-base" data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(formatCurrency(subtotal.value))}</span></li><li class="flex justify-between mb-2" data-v-bf5bd6c2${_scopeId2}><span class="text-surface-700 dark:text-surface-200" data-v-bf5bd6c2${_scopeId2}>Shipping</span><span class="text-surface-700 dark:text-surface-200 font-medium text-base" data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(formatCurrency(shippingCost.value))}</span></li>`);
                  if (__props.order.discount_amount > 0) {
                    _push3(`<li class="flex justify-between text-green-600 font-medium" data-v-bf5bd6c2${_scopeId2}><span data-v-bf5bd6c2${_scopeId2}> Discount `);
                    if (__props.order.coupon_code) {
                      _push3(`<span class="text-xs ml-1 bg-green-100 px-2 py-0.5 rounded text-green-700" data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(__props.order.coupon_code)}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</span><span data-v-bf5bd6c2${_scopeId2}>-${ssrInterpolate(formatCurrency(__props.order.discount_amount))}</span></li>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<li class="flex justify-between border-t border-surface-200 dark:border-surface-700 pt-3 mt-2" data-v-bf5bd6c2${_scopeId2}><span class="text-surface-900 dark:text-surface-0 font-semibold text-lg" data-v-bf5bd6c2${_scopeId2}>Total</span><span class="text-surface-900 dark:text-surface-0 font-bold text-xl" data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(formatCurrency(__props.order.total_amount))}</span></li></ul></div></div></div>`);
                  if (__props.order.notes) {
                    _push3(`<div class="mt-8 pt-4 border-t border-surface-200 dark:border-surface-700" data-v-bf5bd6c2${_scopeId2}><h3 class="font-semibold text-lg text-surface-900 dark:text-surface-0 mb-2" data-v-bf5bd6c2${_scopeId2}>Order Notes</h3><p class="text-surface-700 dark:text-surface-200" data-v-bf5bd6c2${_scopeId2}>${ssrInterpolate(__props.order.notes)}</p></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div></div></div>`);
                } else {
                  return [
                    createVNode(PageTitleSection, { title: "Order Complete" }),
                    createVNode("div", { class: "main-content" }, [
                      createVNode("div", { class: "content-wrapper" }, [
                        createVNode("div", { class: "card p-6 md:p-8" }, [
                          createVNode("span", { class: "text-surface-700 dark:text-surface-100 text-xl" }, "Thanks, " + toDisplayString(__props.order.billing_first_name || "Customer") + "!", 1),
                          createVNode("div", { class: "text-surface-900 dark:text-surface-0 font-bold text-4xl my-2" }, "Successful Order! "),
                          createVNode("p", { class: "text-surface-700 dark:text-surface-100 text-xl mt-0 mb-6 p-0" }, " Your order is being processed. We'll contact you soon for further payment details. "),
                          createVNode("div", { style: { "height": "3px", "background": "linear-gradient(90deg, var(--p-primary-color) 0%, rgba(var(--p-primary-rgb), 0) 50%)" } }),
                          createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between py-8" }, [
                            createVNode("div", { class: "mb-4 sm:mb-0" }, [
                              createVNode("span", { class: "font-medium text-xl text-surface-900 dark:text-surface-0 mr-2" }, "Order number:"),
                              createVNode("span", { class: "font-medium text-xl text-primary-500" }, toDisplayString(__props.order.order_number), 1)
                            ]),
                            createVNode("div", null, [
                              createVNode(unref(Button), {
                                label: "Details",
                                icon: "pi pi-list",
                                outlined: "",
                                class: "mr-2",
                                onClick: toggleDetails
                              }),
                              createVNode(unref(Button), {
                                label: "Print",
                                icon: "pi pi-print",
                                outlined: "",
                                onClick: printOrder
                              })
                            ])
                          ]),
                          createVNode("div", { class: "rounded border-surface-200 dark:border-surface-700 border" }, [
                            createVNode("ul", { class: "list-none p-0 m-0" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(orderItems.value, (item) => {
                                var _a, _b, _c;
                                return openBlock(), createBlock("li", {
                                  key: item.id,
                                  class: "p-4 border-surface-200 dark:border-surface-700 flex items-start sm:items-center border-b last:border-b-0"
                                }, [
                                  createVNode("div", { class: "flex items-center w-full sm:w-auto mb-4 sm:mb-0" }, [
                                    createVNode("div", { class: "flex-shrink-0 w-16 sm:w-24 mr-4" }, [
                                      createVNode(_sfc_main$2, {
                                        "artwork-image": ((_a = item.artwork_data) == null ? void 0 : _a.img_thumb) || ((_b = item.artwork_data) == null ? void 0 : _b.img_medium) || "/images/placeholder.png",
                                        frame: item.frame,
                                        size: item.size,
                                        type: item.type
                                      }, null, 8, ["artwork-image", "frame", "size", "type"])
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("h4", { class: "font-medium text-surface-900 dark:text-surface-0" }, toDisplayString(((_c = item.artwork_data) == null ? void 0 : _c.title) || "Artwork"), 1),
                                      createVNode("div", { class: "text-sm text-surface-600 dark:text-surface-400 mt-1 space-y-0.5" }, [
                                        createVNode("p", null, "ID: " + toDisplayString(item.artwork_id || item.pictufy_id || item.id), 1),
                                        createVNode("p", null, "Type: " + toDisplayString(item.type), 1),
                                        createVNode("p", null, "Print: " + toDisplayString(item.print_type === "oil" ? "Oil Print" : "Mono Print"), 1),
                                        createVNode("p", null, "Frame: " + toDisplayString(item.frame), 1),
                                        createVNode("p", null, "Size: " + toDisplayString(item.size), 1)
                                      ])
                                    ])
                                  ]),
                                  createVNode("div", { class: "w-full sm:w-auto sm:ml-auto text-left sm:text-right pt-2 sm:pt-0 mt-2 sm:mt-0" }, [
                                    createVNode("span", { class: "block text-sm text-surface-500 text-right" }, toDisplayString(item.quantity) + " x " + toDisplayString(formatCurrency(item.price)), 1),
                                    createVNode("span", { class: "block font-bold text-lg text-surface-900 dark:text-surface-0 text-right" }, toDisplayString(formatCurrency(item.quantity * item.price)), 1)
                                  ])
                                ]);
                              }), 128))
                            ])
                          ]),
                          createVNode("div", { class: "flex flex-col lg:flex-row gap-6 mt-8 pb-4" }, [
                            createVNode("div", { class: "w-full lg:w-1/2 space-y-6" }, [
                              createVNode("div", null, [
                                createVNode("h3", { class: "font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3" }, "Billing Address"),
                                createVNode("div", { class: "flex flex-col text-surface-700 dark:text-surface-200 space-y-1" }, [
                                  createVNode("span", null, toDisplayString(__props.order.billing_first_name) + " " + toDisplayString(__props.order.billing_last_name), 1),
                                  createVNode("span", null, toDisplayString(__props.order.billing_address), 1),
                                  createVNode("span", null, toDisplayString(__props.order.billing_city) + ", " + toDisplayString(__props.order.billing_state_or_county) + " " + toDisplayString(__props.order.billing_postal_code), 1),
                                  createVNode("span", null, toDisplayString(billingCountryName.value), 1),
                                  createVNode("span", null, toDisplayString(__props.order.billing_email), 1),
                                  __props.order.billing_phone ? (openBlock(), createBlock("span", { key: 0 }, "Phone: " + toDisplayString(__props.order.billing_phone), 1)) : createCommentVNode("", true)
                                ])
                              ]),
                              createVNode("div", null, [
                                createVNode("h3", { class: "font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3" }, toDisplayString(__props.order.shipping_is_different ? "Shipping Address" : "Shipping (Same as Billing) "), 1),
                                __props.order.shipping_is_different ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "flex flex-col text-surface-700 dark:text-surface-200 space-y-1"
                                }, [
                                  createVNode("span", null, toDisplayString(__props.order.shipping_first_name) + " " + toDisplayString(__props.order.shipping_last_name), 1),
                                  createVNode("span", null, toDisplayString(__props.order.shipping_address), 1),
                                  createVNode("span", null, toDisplayString(__props.order.shipping_city) + ", " + toDisplayString(__props.order.shipping_state_or_county) + " " + toDisplayString(__props.order.shipping_postal_code), 1),
                                  createVNode("span", null, toDisplayString(shippingCountryName.value), 1),
                                  __props.order.shipping_phone ? (openBlock(), createBlock("span", { key: 0 }, "Phone: " + toDisplayString(__props.order.shipping_phone), 1)) : createCommentVNode("", true),
                                  __props.order.shipping_email && __props.order.shipping_email !== __props.order.billing_email ? (openBlock(), createBlock("span", { key: 1 }, "Email: " + toDisplayString(__props.order.shipping_email), 1)) : createCommentVNode("", true)
                                ])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "text-surface-700 dark:text-surface-200 italic"
                                }, " Shipping address is the same as billing address. "))
                              ]),
                              __props.order.wants_invoice ? (openBlock(), createBlock("div", { key: 0 }, [
                                createVNode("h3", { class: "font-semibold text-lg text-surface-900 dark:text-surface-0 mt-4 mb-3" }, " Invoice Details"),
                                createVNode("div", { class: "flex flex-col text-surface-700 dark:text-surface-200 space-y-1" }, [
                                  __props.order.invoice_company_name ? (openBlock(), createBlock("span", { key: 0 }, "Company: " + toDisplayString(__props.order.invoice_company_name), 1)) : createCommentVNode("", true),
                                  __props.order.invoice_vat_number ? (openBlock(), createBlock("span", { key: 1 }, "VAT: " + toDisplayString(__props.order.invoice_vat_number), 1)) : createCommentVNode("", true),
                                  __props.order.invoice_profession ? (openBlock(), createBlock("span", { key: 2 }, "Profession: " + toDisplayString(__props.order.invoice_profession), 1)) : createCommentVNode("", true),
                                  __props.order.invoice_tax_office ? (openBlock(), createBlock("span", { key: 3 }, "Tax Office: " + toDisplayString(__props.order.invoice_tax_office), 1)) : createCommentVNode("", true)
                                ])
                              ])) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "w-full lg:w-1/2 space-y-6" }, [
                              createVNode("div", null, [
                                createVNode("h3", { class: "font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3" }, "Payment "),
                                createVNode("div", { class: "flex items-center" }, [
                                  createVNode("i", {
                                    class: [getPaymentMethodIcon(__props.order.payment_method), "mr-2 text-2xl text-surface-700 dark:text-surface-200"]
                                  }, null, 2),
                                  createVNode("div", { class: "flex flex-col" }, [
                                    createVNode("span", { class: "text-surface-700 dark:text-surface-200 mb-1" }, toDisplayString(getPaymentMethodLabel(__props.order.payment_method)), 1),
                                    __props.order.payment_method === "stripe" ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: "text-surface-700 dark:text-surface-200 font-medium"
                                    }, "**** **** **** " + toDisplayString(__props.order.card_last_four || "XXXX"), 1)) : createCommentVNode("", true),
                                    createVNode("span", { class: "text-sm capitalize" }, [
                                      createTextVNode("Status: "),
                                      createVNode(unref(Tag), {
                                        value: __props.order.payment_status,
                                        severity: getPaymentStatusSeverity(__props.order.payment_status)
                                      }, null, 8, ["value", "severity"])
                                    ])
                                  ])
                                ])
                              ]),
                              createVNode("div", { class: "mt-6" }, [
                                createVNode("h3", { class: "font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3" }, "Summary "),
                                createVNode("ul", { class: "list-none p-0 m-0 w-full" }, [
                                  createVNode("li", { class: "flex justify-between mb-2" }, [
                                    createVNode("span", { class: "text-surface-700 dark:text-surface-200" }, "Subtotal"),
                                    createVNode("span", { class: "text-surface-700 dark:text-surface-200 font-medium text-base" }, toDisplayString(formatCurrency(subtotal.value)), 1)
                                  ]),
                                  createVNode("li", { class: "flex justify-between mb-2" }, [
                                    createVNode("span", { class: "text-surface-700 dark:text-surface-200" }, "Shipping"),
                                    createVNode("span", { class: "text-surface-700 dark:text-surface-200 font-medium text-base" }, toDisplayString(formatCurrency(shippingCost.value)), 1)
                                  ]),
                                  __props.order.discount_amount > 0 ? (openBlock(), createBlock("li", {
                                    key: 0,
                                    class: "flex justify-between text-green-600 font-medium"
                                  }, [
                                    createVNode("span", null, [
                                      createTextVNode(" Discount "),
                                      __props.order.coupon_code ? (openBlock(), createBlock("span", {
                                        key: 0,
                                        class: "text-xs ml-1 bg-green-100 px-2 py-0.5 rounded text-green-700"
                                      }, toDisplayString(__props.order.coupon_code), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("span", null, "-" + toDisplayString(formatCurrency(__props.order.discount_amount)), 1)
                                  ])) : createCommentVNode("", true),
                                  createVNode("li", { class: "flex justify-between border-t border-surface-200 dark:border-surface-700 pt-3 mt-2" }, [
                                    createVNode("span", { class: "text-surface-900 dark:text-surface-0 font-semibold text-lg" }, "Total"),
                                    createVNode("span", { class: "text-surface-900 dark:text-surface-0 font-bold text-xl" }, toDisplayString(formatCurrency(__props.order.total_amount)), 1)
                                  ])
                                ])
                              ])
                            ])
                          ]),
                          __props.order.notes ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "mt-8 pt-4 border-t border-surface-200 dark:border-surface-700"
                          }, [
                            createVNode("h3", { class: "font-semibold text-lg text-surface-900 dark:text-surface-0 mb-2" }, "Order Notes"),
                            createVNode("p", { class: "text-surface-700 dark:text-surface-200" }, toDisplayString(__props.order.notes), 1)
                          ])) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Head), { title: "Order Complete" }),
              createVNode(_sfc_main$1, null, {
                default: withCtx(() => [
                  createVNode(PageTitleSection, { title: "Order Complete" }),
                  createVNode("div", { class: "main-content" }, [
                    createVNode("div", { class: "content-wrapper" }, [
                      createVNode("div", { class: "card p-6 md:p-8" }, [
                        createVNode("span", { class: "text-surface-700 dark:text-surface-100 text-xl" }, "Thanks, " + toDisplayString(__props.order.billing_first_name || "Customer") + "!", 1),
                        createVNode("div", { class: "text-surface-900 dark:text-surface-0 font-bold text-4xl my-2" }, "Successful Order! "),
                        createVNode("p", { class: "text-surface-700 dark:text-surface-100 text-xl mt-0 mb-6 p-0" }, " Your order is being processed. We'll contact you soon for further payment details. "),
                        createVNode("div", { style: { "height": "3px", "background": "linear-gradient(90deg, var(--p-primary-color) 0%, rgba(var(--p-primary-rgb), 0) 50%)" } }),
                        createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between py-8" }, [
                          createVNode("div", { class: "mb-4 sm:mb-0" }, [
                            createVNode("span", { class: "font-medium text-xl text-surface-900 dark:text-surface-0 mr-2" }, "Order number:"),
                            createVNode("span", { class: "font-medium text-xl text-primary-500" }, toDisplayString(__props.order.order_number), 1)
                          ]),
                          createVNode("div", null, [
                            createVNode(unref(Button), {
                              label: "Details",
                              icon: "pi pi-list",
                              outlined: "",
                              class: "mr-2",
                              onClick: toggleDetails
                            }),
                            createVNode(unref(Button), {
                              label: "Print",
                              icon: "pi pi-print",
                              outlined: "",
                              onClick: printOrder
                            })
                          ])
                        ]),
                        createVNode("div", { class: "rounded border-surface-200 dark:border-surface-700 border" }, [
                          createVNode("ul", { class: "list-none p-0 m-0" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(orderItems.value, (item) => {
                              var _a, _b, _c;
                              return openBlock(), createBlock("li", {
                                key: item.id,
                                class: "p-4 border-surface-200 dark:border-surface-700 flex items-start sm:items-center border-b last:border-b-0"
                              }, [
                                createVNode("div", { class: "flex items-center w-full sm:w-auto mb-4 sm:mb-0" }, [
                                  createVNode("div", { class: "flex-shrink-0 w-16 sm:w-24 mr-4" }, [
                                    createVNode(_sfc_main$2, {
                                      "artwork-image": ((_a = item.artwork_data) == null ? void 0 : _a.img_thumb) || ((_b = item.artwork_data) == null ? void 0 : _b.img_medium) || "/images/placeholder.png",
                                      frame: item.frame,
                                      size: item.size,
                                      type: item.type
                                    }, null, 8, ["artwork-image", "frame", "size", "type"])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("h4", { class: "font-medium text-surface-900 dark:text-surface-0" }, toDisplayString(((_c = item.artwork_data) == null ? void 0 : _c.title) || "Artwork"), 1),
                                    createVNode("div", { class: "text-sm text-surface-600 dark:text-surface-400 mt-1 space-y-0.5" }, [
                                      createVNode("p", null, "ID: " + toDisplayString(item.artwork_id || item.pictufy_id || item.id), 1),
                                      createVNode("p", null, "Type: " + toDisplayString(item.type), 1),
                                      createVNode("p", null, "Print: " + toDisplayString(item.print_type === "oil" ? "Oil Print" : "Mono Print"), 1),
                                      createVNode("p", null, "Frame: " + toDisplayString(item.frame), 1),
                                      createVNode("p", null, "Size: " + toDisplayString(item.size), 1)
                                    ])
                                  ])
                                ]),
                                createVNode("div", { class: "w-full sm:w-auto sm:ml-auto text-left sm:text-right pt-2 sm:pt-0 mt-2 sm:mt-0" }, [
                                  createVNode("span", { class: "block text-sm text-surface-500 text-right" }, toDisplayString(item.quantity) + " x " + toDisplayString(formatCurrency(item.price)), 1),
                                  createVNode("span", { class: "block font-bold text-lg text-surface-900 dark:text-surface-0 text-right" }, toDisplayString(formatCurrency(item.quantity * item.price)), 1)
                                ])
                              ]);
                            }), 128))
                          ])
                        ]),
                        createVNode("div", { class: "flex flex-col lg:flex-row gap-6 mt-8 pb-4" }, [
                          createVNode("div", { class: "w-full lg:w-1/2 space-y-6" }, [
                            createVNode("div", null, [
                              createVNode("h3", { class: "font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3" }, "Billing Address"),
                              createVNode("div", { class: "flex flex-col text-surface-700 dark:text-surface-200 space-y-1" }, [
                                createVNode("span", null, toDisplayString(__props.order.billing_first_name) + " " + toDisplayString(__props.order.billing_last_name), 1),
                                createVNode("span", null, toDisplayString(__props.order.billing_address), 1),
                                createVNode("span", null, toDisplayString(__props.order.billing_city) + ", " + toDisplayString(__props.order.billing_state_or_county) + " " + toDisplayString(__props.order.billing_postal_code), 1),
                                createVNode("span", null, toDisplayString(billingCountryName.value), 1),
                                createVNode("span", null, toDisplayString(__props.order.billing_email), 1),
                                __props.order.billing_phone ? (openBlock(), createBlock("span", { key: 0 }, "Phone: " + toDisplayString(__props.order.billing_phone), 1)) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("div", null, [
                              createVNode("h3", { class: "font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3" }, toDisplayString(__props.order.shipping_is_different ? "Shipping Address" : "Shipping (Same as Billing) "), 1),
                              __props.order.shipping_is_different ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "flex flex-col text-surface-700 dark:text-surface-200 space-y-1"
                              }, [
                                createVNode("span", null, toDisplayString(__props.order.shipping_first_name) + " " + toDisplayString(__props.order.shipping_last_name), 1),
                                createVNode("span", null, toDisplayString(__props.order.shipping_address), 1),
                                createVNode("span", null, toDisplayString(__props.order.shipping_city) + ", " + toDisplayString(__props.order.shipping_state_or_county) + " " + toDisplayString(__props.order.shipping_postal_code), 1),
                                createVNode("span", null, toDisplayString(shippingCountryName.value), 1),
                                __props.order.shipping_phone ? (openBlock(), createBlock("span", { key: 0 }, "Phone: " + toDisplayString(__props.order.shipping_phone), 1)) : createCommentVNode("", true),
                                __props.order.shipping_email && __props.order.shipping_email !== __props.order.billing_email ? (openBlock(), createBlock("span", { key: 1 }, "Email: " + toDisplayString(__props.order.shipping_email), 1)) : createCommentVNode("", true)
                              ])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "text-surface-700 dark:text-surface-200 italic"
                              }, " Shipping address is the same as billing address. "))
                            ]),
                            __props.order.wants_invoice ? (openBlock(), createBlock("div", { key: 0 }, [
                              createVNode("h3", { class: "font-semibold text-lg text-surface-900 dark:text-surface-0 mt-4 mb-3" }, " Invoice Details"),
                              createVNode("div", { class: "flex flex-col text-surface-700 dark:text-surface-200 space-y-1" }, [
                                __props.order.invoice_company_name ? (openBlock(), createBlock("span", { key: 0 }, "Company: " + toDisplayString(__props.order.invoice_company_name), 1)) : createCommentVNode("", true),
                                __props.order.invoice_vat_number ? (openBlock(), createBlock("span", { key: 1 }, "VAT: " + toDisplayString(__props.order.invoice_vat_number), 1)) : createCommentVNode("", true),
                                __props.order.invoice_profession ? (openBlock(), createBlock("span", { key: 2 }, "Profession: " + toDisplayString(__props.order.invoice_profession), 1)) : createCommentVNode("", true),
                                __props.order.invoice_tax_office ? (openBlock(), createBlock("span", { key: 3 }, "Tax Office: " + toDisplayString(__props.order.invoice_tax_office), 1)) : createCommentVNode("", true)
                              ])
                            ])) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "w-full lg:w-1/2 space-y-6" }, [
                            createVNode("div", null, [
                              createVNode("h3", { class: "font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3" }, "Payment "),
                              createVNode("div", { class: "flex items-center" }, [
                                createVNode("i", {
                                  class: [getPaymentMethodIcon(__props.order.payment_method), "mr-2 text-2xl text-surface-700 dark:text-surface-200"]
                                }, null, 2),
                                createVNode("div", { class: "flex flex-col" }, [
                                  createVNode("span", { class: "text-surface-700 dark:text-surface-200 mb-1" }, toDisplayString(getPaymentMethodLabel(__props.order.payment_method)), 1),
                                  __props.order.payment_method === "stripe" ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "text-surface-700 dark:text-surface-200 font-medium"
                                  }, "**** **** **** " + toDisplayString(__props.order.card_last_four || "XXXX"), 1)) : createCommentVNode("", true),
                                  createVNode("span", { class: "text-sm capitalize" }, [
                                    createTextVNode("Status: "),
                                    createVNode(unref(Tag), {
                                      value: __props.order.payment_status,
                                      severity: getPaymentStatusSeverity(__props.order.payment_status)
                                    }, null, 8, ["value", "severity"])
                                  ])
                                ])
                              ])
                            ]),
                            createVNode("div", { class: "mt-6" }, [
                              createVNode("h3", { class: "font-semibold text-lg text-surface-900 dark:text-surface-0 mb-3" }, "Summary "),
                              createVNode("ul", { class: "list-none p-0 m-0 w-full" }, [
                                createVNode("li", { class: "flex justify-between mb-2" }, [
                                  createVNode("span", { class: "text-surface-700 dark:text-surface-200" }, "Subtotal"),
                                  createVNode("span", { class: "text-surface-700 dark:text-surface-200 font-medium text-base" }, toDisplayString(formatCurrency(subtotal.value)), 1)
                                ]),
                                createVNode("li", { class: "flex justify-between mb-2" }, [
                                  createVNode("span", { class: "text-surface-700 dark:text-surface-200" }, "Shipping"),
                                  createVNode("span", { class: "text-surface-700 dark:text-surface-200 font-medium text-base" }, toDisplayString(formatCurrency(shippingCost.value)), 1)
                                ]),
                                __props.order.discount_amount > 0 ? (openBlock(), createBlock("li", {
                                  key: 0,
                                  class: "flex justify-between text-green-600 font-medium"
                                }, [
                                  createVNode("span", null, [
                                    createTextVNode(" Discount "),
                                    __props.order.coupon_code ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: "text-xs ml-1 bg-green-100 px-2 py-0.5 rounded text-green-700"
                                    }, toDisplayString(__props.order.coupon_code), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("span", null, "-" + toDisplayString(formatCurrency(__props.order.discount_amount)), 1)
                                ])) : createCommentVNode("", true),
                                createVNode("li", { class: "flex justify-between border-t border-surface-200 dark:border-surface-700 pt-3 mt-2" }, [
                                  createVNode("span", { class: "text-surface-900 dark:text-surface-0 font-semibold text-lg" }, "Total"),
                                  createVNode("span", { class: "text-surface-900 dark:text-surface-0 font-bold text-xl" }, toDisplayString(formatCurrency(__props.order.total_amount)), 1)
                                ])
                              ])
                            ])
                          ])
                        ]),
                        __props.order.notes ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-8 pt-4 border-t border-surface-200 dark:border-surface-700"
                        }, [
                          createVNode("h3", { class: "font-semibold text-lg text-surface-900 dark:text-surface-0 mb-2" }, "Order Notes"),
                          createVNode("p", { class: "text-surface-700 dark:text-surface-200" }, toDisplayString(__props.order.notes), 1)
                        ])) : createCommentVNode("", true)
                      ])
                    ])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/CheckoutComplete.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CheckoutComplete = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bf5bd6c2"]]);
export {
  CheckoutComplete as default
};
