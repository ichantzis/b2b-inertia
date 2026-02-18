import __unplugin_directives_0 from "primevue/tooltip";
import { withCtx, unref, createVNode, toDisplayString, createBlock, openBlock, mergeProps, withDirectives, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttrs, ssrGetDirectiveProps } from "vue/server-renderer";
import { A as AdminLayout } from "./AdminLayout-CbDljQzr.js";
import { Head, Link, router } from "@inertiajs/vue3";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import { useToast } from "primevue/usetoast";
import "primevue/panelmenu";
import "./ApplicationLogo-rkFqmqnV.js";
import "../ssr.js";
import "@inertiajs/vue3/server";
import "@vue/server-renderer";
import "primevue/config";
import "primevue/toastservice";
import "primevue/confirmationservice";
import "@primeuix/themes/aura";
import "@primeuix/themes";
import "primevue/toast";
import "primevue/drawer";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    coupons: Object
    // Paginated object
  },
  setup(__props) {
    const toast = useToast();
    const confirm = useConfirm();
    const deleteCoupon = (id) => {
      confirm.require({
        message: "Are you sure you want to delete this coupon?",
        header: "Confirm Deletion",
        icon: "pi pi-exclamation-triangle",
        acceptClass: "p-button-danger",
        accept: () => {
          router.delete(route("dashboard.coupons.destroy", id));
        }
      });
    };
    const toggleStatus = (coupon) => {
      router.patch(route("dashboard.coupons.toggle", coupon.id), {}, {
        preserveScroll: true,
        onSuccess: () => {
          toast.add({
            severity: "success",
            summary: "Updated",
            detail: `Coupon is now ${!coupon.is_active ? "Active" : "Inactive"}`,
            // Inverted logic because visually it hasn't updated yet in this specific line context, but Inertia reloads it fast. safely: 'Status updated'
            life: 2e3
          });
        }
      });
    };
    const getStatusSeverity = (coupon) => {
      if (!coupon.is_active) return "danger";
      if (coupon.expires_at && new Date(coupon.expires_at) < /* @__PURE__ */ new Date()) return "warning";
      return "success";
    };
    const getStatusLabel = (coupon) => {
      if (!coupon.is_active) return "Inactive";
      if (coupon.expires_at && new Date(coupon.expires_at) < /* @__PURE__ */ new Date()) return "Expired";
      return "Active";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_tooltip = __unplugin_directives_0;
      _push(ssrRenderComponent(AdminLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Coupons" }, null, _parent2, _scopeId));
            _push2(`<div class="max-w-7xl mx-auto"${_scopeId}><div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-gray-800"${_scopeId}>Coupons &amp; Discounts</h1><p class="text-gray-500 text-sm mt-1"${_scopeId}>Manage promo codes for your store.</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("dashboard.coupons.create")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Button), {
                    label: "Create Coupon",
                    icon: "pi pi-plus",
                    raised: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Button), {
                      label: "Create Coupon",
                      icon: "pi pi-plus",
                      raised: ""
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DataTable), {
              value: __props.coupons.data,
              stripedRows: "",
              responsiveLayout: "scroll"
            }, {
              empty: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-center p-8 text-gray-500"${_scopeId2}> No coupons found. Create one to get started! </div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-center p-8 text-gray-500" }, " No coupons found. Create one to get started! ")
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Column), {
                    field: "code",
                    header: "Code",
                    sortable: ""
                  }, {
                    body: withCtx((slotProps, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded text-sm"${_scopeId3}>${ssrInterpolate(slotProps.data.code)}</span>`);
                      } else {
                        return [
                          createVNode("span", { class: "font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded text-sm" }, toDisplayString(slotProps.data.code), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), { header: "Discount" }, {
                    body: withCtx((slotProps, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="font-medium text-gray-900"${_scopeId3}>`);
                        if (slotProps.data.type === "fixed") {
                          _push4(`<span${_scopeId3}> -${ssrInterpolate(parseFloat(slotProps.data.value).toFixed(2))}€ </span>`);
                        } else {
                          _push4(`<span${_scopeId3}> -${ssrInterpolate(parseFloat(slotProps.data.value))}% </span>`);
                        }
                        _push4(`</span>`);
                      } else {
                        return [
                          createVNode("span", { class: "font-medium text-gray-900" }, [
                            slotProps.data.type === "fixed" ? (openBlock(), createBlock("span", { key: 0 }, " -" + toDisplayString(parseFloat(slotProps.data.value).toFixed(2)) + "€ ", 1)) : (openBlock(), createBlock("span", { key: 1 }, " -" + toDisplayString(parseFloat(slotProps.data.value)) + "% ", 1))
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), { header: "Usage" }, {
                    body: withCtx((slotProps, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-sm"${_scopeId3}><span class="font-semibold"${_scopeId3}>${ssrInterpolate(slotProps.data.used_count)}</span><span class="text-gray-400 mx-1"${_scopeId3}>/</span>`);
                        if (slotProps.data.usage_limit) {
                          _push4(`<span class="text-gray-600"${_scopeId3}>${ssrInterpolate(slotProps.data.usage_limit)}</span>`);
                        } else {
                          _push4(`<span class="text-gray-400 text-xs italic"${_scopeId3}>∞</span>`);
                        }
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-sm" }, [
                            createVNode("span", { class: "font-semibold" }, toDisplayString(slotProps.data.used_count), 1),
                            createVNode("span", { class: "text-gray-400 mx-1" }, "/"),
                            slotProps.data.usage_limit ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-gray-600"
                            }, toDisplayString(slotProps.data.usage_limit), 1)) : (openBlock(), createBlock("span", {
                              key: 1,
                              class: "text-gray-400 text-xs italic"
                            }, "∞"))
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), {
                    header: "Status",
                    style: { "width": "100px" }
                  }, {
                    body: withCtx((slotProps, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div${ssrRenderAttrs(mergeProps({ class: "cursor-pointer transition-transform hover:scale-105 active:scale-95 inline-block" }, ssrGetDirectiveProps(_ctx, _directive_tooltip, "Click to toggle status", void 0, { top: true })))}${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(Tag), {
                          value: getStatusLabel(slotProps.data),
                          severity: getStatusSeverity(slotProps.data),
                          icon: slotProps.data.is_active ? "pi pi-check-circle" : "pi pi-times-circle"
                        }, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          withDirectives((openBlock(), createBlock("div", {
                            onClick: ($event) => toggleStatus(slotProps.data),
                            class: "cursor-pointer transition-transform hover:scale-105 active:scale-95 inline-block"
                          }, [
                            createVNode(unref(Tag), {
                              value: getStatusLabel(slotProps.data),
                              severity: getStatusSeverity(slotProps.data),
                              icon: slotProps.data.is_active ? "pi pi-check-circle" : "pi pi-times-circle"
                            }, null, 8, ["value", "severity", "icon"])
                          ], 8, ["onClick"])), [
                            [
                              _directive_tooltip,
                              "Click to toggle status",
                              void 0,
                              { top: true }
                            ]
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), {
                    field: "expires_at",
                    header: "Expires"
                  }, {
                    body: withCtx((slotProps, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (slotProps.data.expires_at) {
                          _push4(`<span class="text-sm text-gray-600"${_scopeId3}>${ssrInterpolate(new Date(slotProps.data.expires_at).toLocaleDateString())}</span>`);
                        } else {
                          _push4(`<span class="text-xs text-gray-400 italic"${_scopeId3}>Never</span>`);
                        }
                      } else {
                        return [
                          slotProps.data.expires_at ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-sm text-gray-600"
                          }, toDisplayString(new Date(slotProps.data.expires_at).toLocaleDateString()), 1)) : (openBlock(), createBlock("span", {
                            key: 1,
                            class: "text-xs text-gray-400 italic"
                          }, "Never"))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Column), {
                    header: "Actions",
                    alignFrozen: "right",
                    frozen: ""
                  }, {
                    body: withCtx((slotProps, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex gap-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(Button), {
                          icon: "pi pi-trash",
                          text: "",
                          rounded: "",
                          severity: "danger",
                          onClick: ($event) => deleteCoupon(slotProps.data.id)
                        }, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex gap-2" }, [
                            createVNode(unref(Button), {
                              icon: "pi pi-trash",
                              text: "",
                              rounded: "",
                              severity: "danger",
                              onClick: ($event) => deleteCoupon(slotProps.data.id)
                            }, null, 8, ["onClick"])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Column), {
                      field: "code",
                      header: "Code",
                      sortable: ""
                    }, {
                      body: withCtx((slotProps) => [
                        createVNode("span", { class: "font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded text-sm" }, toDisplayString(slotProps.data.code), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), { header: "Discount" }, {
                      body: withCtx((slotProps) => [
                        createVNode("span", { class: "font-medium text-gray-900" }, [
                          slotProps.data.type === "fixed" ? (openBlock(), createBlock("span", { key: 0 }, " -" + toDisplayString(parseFloat(slotProps.data.value).toFixed(2)) + "€ ", 1)) : (openBlock(), createBlock("span", { key: 1 }, " -" + toDisplayString(parseFloat(slotProps.data.value)) + "% ", 1))
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), { header: "Usage" }, {
                      body: withCtx((slotProps) => [
                        createVNode("div", { class: "text-sm" }, [
                          createVNode("span", { class: "font-semibold" }, toDisplayString(slotProps.data.used_count), 1),
                          createVNode("span", { class: "text-gray-400 mx-1" }, "/"),
                          slotProps.data.usage_limit ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-gray-600"
                          }, toDisplayString(slotProps.data.usage_limit), 1)) : (openBlock(), createBlock("span", {
                            key: 1,
                            class: "text-gray-400 text-xs italic"
                          }, "∞"))
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), {
                      header: "Status",
                      style: { "width": "100px" }
                    }, {
                      body: withCtx((slotProps) => [
                        withDirectives((openBlock(), createBlock("div", {
                          onClick: ($event) => toggleStatus(slotProps.data),
                          class: "cursor-pointer transition-transform hover:scale-105 active:scale-95 inline-block"
                        }, [
                          createVNode(unref(Tag), {
                            value: getStatusLabel(slotProps.data),
                            severity: getStatusSeverity(slotProps.data),
                            icon: slotProps.data.is_active ? "pi pi-check-circle" : "pi pi-times-circle"
                          }, null, 8, ["value", "severity", "icon"])
                        ], 8, ["onClick"])), [
                          [
                            _directive_tooltip,
                            "Click to toggle status",
                            void 0,
                            { top: true }
                          ]
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), {
                      field: "expires_at",
                      header: "Expires"
                    }, {
                      body: withCtx((slotProps) => [
                        slotProps.data.expires_at ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "text-sm text-gray-600"
                        }, toDisplayString(new Date(slotProps.data.expires_at).toLocaleDateString()), 1)) : (openBlock(), createBlock("span", {
                          key: 1,
                          class: "text-xs text-gray-400 italic"
                        }, "Never"))
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Column), {
                      header: "Actions",
                      alignFrozen: "right",
                      frozen: ""
                    }, {
                      body: withCtx((slotProps) => [
                        createVNode("div", { class: "flex gap-2" }, [
                          createVNode(unref(Button), {
                            icon: "pi pi-trash",
                            text: "",
                            rounded: "",
                            severity: "danger",
                            onClick: ($event) => deleteCoupon(slotProps.data.id)
                          }, null, 8, ["onClick"])
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(unref(ConfirmDialog), null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Head), { title: "Coupons" }),
              createVNode("div", { class: "max-w-7xl mx-auto" }, [
                createVNode("div", { class: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-2xl font-bold text-gray-800" }, "Coupons & Discounts"),
                    createVNode("p", { class: "text-gray-500 text-sm mt-1" }, "Manage promo codes for your store.")
                  ]),
                  createVNode(unref(Link), {
                    href: _ctx.route("dashboard.coupons.create")
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Button), {
                        label: "Create Coupon",
                        icon: "pi pi-plus",
                        raised: ""
                      })
                    ]),
                    _: 1
                  }, 8, ["href"])
                ]),
                createVNode("div", { class: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" }, [
                  createVNode(unref(DataTable), {
                    value: __props.coupons.data,
                    stripedRows: "",
                    responsiveLayout: "scroll"
                  }, {
                    empty: withCtx(() => [
                      createVNode("div", { class: "text-center p-8 text-gray-500" }, " No coupons found. Create one to get started! ")
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(Column), {
                        field: "code",
                        header: "Code",
                        sortable: ""
                      }, {
                        body: withCtx((slotProps) => [
                          createVNode("span", { class: "font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded text-sm" }, toDisplayString(slotProps.data.code), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Column), { header: "Discount" }, {
                        body: withCtx((slotProps) => [
                          createVNode("span", { class: "font-medium text-gray-900" }, [
                            slotProps.data.type === "fixed" ? (openBlock(), createBlock("span", { key: 0 }, " -" + toDisplayString(parseFloat(slotProps.data.value).toFixed(2)) + "€ ", 1)) : (openBlock(), createBlock("span", { key: 1 }, " -" + toDisplayString(parseFloat(slotProps.data.value)) + "% ", 1))
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Column), { header: "Usage" }, {
                        body: withCtx((slotProps) => [
                          createVNode("div", { class: "text-sm" }, [
                            createVNode("span", { class: "font-semibold" }, toDisplayString(slotProps.data.used_count), 1),
                            createVNode("span", { class: "text-gray-400 mx-1" }, "/"),
                            slotProps.data.usage_limit ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-gray-600"
                            }, toDisplayString(slotProps.data.usage_limit), 1)) : (openBlock(), createBlock("span", {
                              key: 1,
                              class: "text-gray-400 text-xs italic"
                            }, "∞"))
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Column), {
                        header: "Status",
                        style: { "width": "100px" }
                      }, {
                        body: withCtx((slotProps) => [
                          withDirectives((openBlock(), createBlock("div", {
                            onClick: ($event) => toggleStatus(slotProps.data),
                            class: "cursor-pointer transition-transform hover:scale-105 active:scale-95 inline-block"
                          }, [
                            createVNode(unref(Tag), {
                              value: getStatusLabel(slotProps.data),
                              severity: getStatusSeverity(slotProps.data),
                              icon: slotProps.data.is_active ? "pi pi-check-circle" : "pi pi-times-circle"
                            }, null, 8, ["value", "severity", "icon"])
                          ], 8, ["onClick"])), [
                            [
                              _directive_tooltip,
                              "Click to toggle status",
                              void 0,
                              { top: true }
                            ]
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Column), {
                        field: "expires_at",
                        header: "Expires"
                      }, {
                        body: withCtx((slotProps) => [
                          slotProps.data.expires_at ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-sm text-gray-600"
                          }, toDisplayString(new Date(slotProps.data.expires_at).toLocaleDateString()), 1)) : (openBlock(), createBlock("span", {
                            key: 1,
                            class: "text-xs text-gray-400 italic"
                          }, "Never"))
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Column), {
                        header: "Actions",
                        alignFrozen: "right",
                        frozen: ""
                      }, {
                        body: withCtx((slotProps) => [
                          createVNode("div", { class: "flex gap-2" }, [
                            createVNode(unref(Button), {
                              icon: "pi pi-trash",
                              text: "",
                              rounded: "",
                              severity: "danger",
                              onClick: ($event) => deleteCoupon(slotProps.data.id)
                            }, null, 8, ["onClick"])
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["value"])
                ])
              ]),
              createVNode(unref(ConfirmDialog))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/dashboard/coupons/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
