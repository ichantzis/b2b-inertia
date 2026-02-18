import { withCtx, unref, createTextVNode, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./UserLayout-pdID7Qc2.js";
import { Head, Link } from "@inertiajs/vue3";
import Tag from "primevue/tag";
import "./HeaderLayout-zh2NGVuN.js";
import "primevue/toast";
import "primevue/drawer";
import "primevue/overlaybadge";
import "primevue/button";
import "./ApplicationLogo-rkFqmqnV.js";
import "primevue/menu";
import "primevue/menubar";
import "primevue/panelmenu";
import "../ssr.js";
import "@inertiajs/vue3/server";
import "@vue/server-renderer";
import "primevue/config";
import "primevue/toastservice";
import "primevue/confirmationservice";
import "@primeuix/themes/aura";
import "@primeuix/themes";
import "primevue/popover";
import "primevue/usetoast";
import "primevue/inputtext";
const _sfc_main = {
  __name: "Orders",
  __ssrInlineRender: true,
  props: { orders: Object },
  setup(__props) {
    const getStatusSeverity = (status) => {
      switch (status) {
        case "completed":
          return "success";
        case "processing":
          return "info";
        case "pending":
          return "warn";
        case "cancelled":
          return "danger";
        default:
          return "info";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "My Orders" }, null, _parent2, _scopeId));
            _push2(`<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"${_scopeId}><div class="p-6 border-b border-gray-100"${_scopeId}><h2 class="text-xl font-bold text-gray-800"${_scopeId}>Order History</h2></div>`);
            if (__props.orders.data.length === 0) {
              _push2(`<div class="p-16 text-center"${_scopeId}><i class="pi pi-shopping-bag text-4xl text-gray-300 mb-4"${_scopeId}></i><h3 class="text-lg font-medium text-gray-900 mb-1"${_scopeId}>No orders yet</h3><p class="text-gray-500 mb-6"${_scopeId}>Looks like you haven&#39;t placed any orders yet.</p>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/",
                class: "text-indigo-600 font-medium hover:underline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Start Browsing`);
                  } else {
                    return [
                      createTextVNode("Start Browsing")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<div${_scopeId}><!--[-->`);
              ssrRenderList(__props.orders.data, (order) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: order.id,
                  href: _ctx.route("account.orders.show", order.order_number),
                  class: "block p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group no-underline"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4"${_scopeId2}><div${_scopeId2}><div class="flex items-center gap-3 mb-1"${_scopeId2}><span class="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors"${_scopeId2}> Order #${ssrInterpolate(order.order_number)}</span>`);
                      _push3(ssrRenderComponent(unref(Tag), {
                        value: order.status.toUpperCase(),
                        severity: getStatusSeverity(order.status),
                        class: "text-xs"
                      }, null, _parent3, _scopeId2));
                      _push3(`</div><div class="text-sm text-gray-500"${_scopeId2}>Placed on ${ssrInterpolate(order.date)}</div></div><div class="flex items-center gap-4 text-right"${_scopeId2}><div${_scopeId2}><div class="font-bold text-lg text-gray-900"${_scopeId2}>${ssrInterpolate(order.total_formatted)}</div><div class="text-xs text-gray-500"${_scopeId2}>${ssrInterpolate(order.item_count)} items</div></div><i class="pi pi-chevron-right text-gray-300 group-hover:text-indigo-400"${_scopeId2}></i></div></div><div class="flex gap-2"${_scopeId2}><!--[-->`);
                      ssrRenderList(order.preview_items, (item, idx) => {
                        _push3(`<div class="w-12 h-12 rounded bg-gray-100 overflow-hidden"${_scopeId2}><img${ssrRenderAttr("src", item.thumb)} class="w-full h-full object-cover"${ssrRenderAttr("alt", item.title)}${_scopeId2}></div>`);
                      });
                      _push3(`<!--]-->`);
                      if (order.item_count > 3) {
                        _push3(`<div class="w-12 h-12 rounded bg-gray-50 border flex items-center justify-center text-xs text-gray-500 font-medium"${_scopeId2}> +${ssrInterpolate(order.item_count - 3)}</div>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div>`);
                    } else {
                      return [
                        createVNode("div", { class: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4" }, [
                          createVNode("div", null, [
                            createVNode("div", { class: "flex items-center gap-3 mb-1" }, [
                              createVNode("span", { class: "font-bold text-gray-900 group-hover:text-indigo-600 transition-colors" }, " Order #" + toDisplayString(order.order_number), 1),
                              createVNode(unref(Tag), {
                                value: order.status.toUpperCase(),
                                severity: getStatusSeverity(order.status),
                                class: "text-xs"
                              }, null, 8, ["value", "severity"])
                            ]),
                            createVNode("div", { class: "text-sm text-gray-500" }, "Placed on " + toDisplayString(order.date), 1)
                          ]),
                          createVNode("div", { class: "flex items-center gap-4 text-right" }, [
                            createVNode("div", null, [
                              createVNode("div", { class: "font-bold text-lg text-gray-900" }, toDisplayString(order.total_formatted), 1),
                              createVNode("div", { class: "text-xs text-gray-500" }, toDisplayString(order.item_count) + " items", 1)
                            ]),
                            createVNode("i", { class: "pi pi-chevron-right text-gray-300 group-hover:text-indigo-400" })
                          ])
                        ]),
                        createVNode("div", { class: "flex gap-2" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(order.preview_items, (item, idx) => {
                            return openBlock(), createBlock("div", {
                              key: idx,
                              class: "w-12 h-12 rounded bg-gray-100 overflow-hidden"
                            }, [
                              createVNode("img", {
                                src: item.thumb,
                                class: "w-full h-full object-cover",
                                alt: item.title
                              }, null, 8, ["src", "alt"])
                            ]);
                          }), 128)),
                          order.item_count > 3 ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "w-12 h-12 rounded bg-gray-50 border flex items-center justify-center text-xs text-gray-500 font-medium"
                          }, " +" + toDisplayString(order.item_count - 3), 1)) : createCommentVNode("", true)
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode(unref(Head), { title: "My Orders" }),
              createVNode("div", { class: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" }, [
                createVNode("div", { class: "p-6 border-b border-gray-100" }, [
                  createVNode("h2", { class: "text-xl font-bold text-gray-800" }, "Order History")
                ]),
                __props.orders.data.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "p-16 text-center"
                }, [
                  createVNode("i", { class: "pi pi-shopping-bag text-4xl text-gray-300 mb-4" }),
                  createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-1" }, "No orders yet"),
                  createVNode("p", { class: "text-gray-500 mb-6" }, "Looks like you haven't placed any orders yet."),
                  createVNode(unref(Link), {
                    href: "/",
                    class: "text-indigo-600 font-medium hover:underline"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Start Browsing")
                    ]),
                    _: 1
                  })
                ])) : (openBlock(), createBlock("div", { key: 1 }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.orders.data, (order) => {
                    return openBlock(), createBlock(unref(Link), {
                      key: order.id,
                      href: _ctx.route("account.orders.show", order.order_number),
                      class: "block p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group no-underline"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4" }, [
                          createVNode("div", null, [
                            createVNode("div", { class: "flex items-center gap-3 mb-1" }, [
                              createVNode("span", { class: "font-bold text-gray-900 group-hover:text-indigo-600 transition-colors" }, " Order #" + toDisplayString(order.order_number), 1),
                              createVNode(unref(Tag), {
                                value: order.status.toUpperCase(),
                                severity: getStatusSeverity(order.status),
                                class: "text-xs"
                              }, null, 8, ["value", "severity"])
                            ]),
                            createVNode("div", { class: "text-sm text-gray-500" }, "Placed on " + toDisplayString(order.date), 1)
                          ]),
                          createVNode("div", { class: "flex items-center gap-4 text-right" }, [
                            createVNode("div", null, [
                              createVNode("div", { class: "font-bold text-lg text-gray-900" }, toDisplayString(order.total_formatted), 1),
                              createVNode("div", { class: "text-xs text-gray-500" }, toDisplayString(order.item_count) + " items", 1)
                            ]),
                            createVNode("i", { class: "pi pi-chevron-right text-gray-300 group-hover:text-indigo-400" })
                          ])
                        ]),
                        createVNode("div", { class: "flex gap-2" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(order.preview_items, (item, idx) => {
                            return openBlock(), createBlock("div", {
                              key: idx,
                              class: "w-12 h-12 rounded bg-gray-100 overflow-hidden"
                            }, [
                              createVNode("img", {
                                src: item.thumb,
                                class: "w-full h-full object-cover",
                                alt: item.title
                              }, null, 8, ["src", "alt"])
                            ]);
                          }), 128)),
                          order.item_count > 3 ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "w-12 h-12 rounded bg-gray-50 border flex items-center justify-center text-xs text-gray-500 font-medium"
                          }, " +" + toDisplayString(order.item_count - 3), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      _: 2
                    }, 1032, ["href"]);
                  }), 128))
                ]))
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/account/Orders.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
