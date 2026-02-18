import { withCtx, unref, createVNode, withModifiers, toDisplayString, createBlock, openBlock, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { A as AdminLayout } from "./AdminLayout-CbDljQzr.js";
import { a as _sfc_main$1 } from "../ssr.js";
import { useForm, Head } from "@inertiajs/vue3";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Button from "primevue/button";
import "primevue/panelmenu";
import "./ApplicationLogo-rkFqmqnV.js";
import "primevue/toast";
import "primevue/usetoast";
import "primevue/drawer";
import "@inertiajs/vue3/server";
import "@vue/server-renderer";
import "primevue/config";
import "primevue/toastservice";
import "primevue/confirmationservice";
import "@primeuix/themes/aura";
import "@primeuix/themes";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      code: "".toUpperCase(),
      type: "fixed",
      value: "",
      usage_limit: "",
      expires_at: ""
    });
    const types = [
      { label: "Fixed Amount (€)", value: "fixed" },
      { label: "Percentage (%)", value: "percent" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AdminLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Create Coupon" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100"${_scopeId2}><h1 class="text-2xl font-bold mb-6"${_scopeId2}>Create Coupon</h1><form class="space-y-4"${_scopeId2}><div${_scopeId2}><label class="block text-sm font-medium mb-1"${_scopeId2}>Code</label>`);
                  _push3(ssrRenderComponent(unref(InputText), {
                    modelValue: unref(form).code,
                    "onUpdate:modelValue": ($event) => unref(form).code = $event,
                    class: "w-full uppercase",
                    placeholder: "e.g. SUMMER2024",
                    onInput: ($event) => unref(form).code = $event.target.value.toUpperCase()
                  }, null, _parent3, _scopeId2));
                  _push3(`<small class="text-red-500"${_scopeId2}>${ssrInterpolate(unref(form).errors.code)}</small></div><div class="grid grid-cols-2 gap-4"${_scopeId2}><div${_scopeId2}><label class="block text-sm font-medium mb-1"${_scopeId2}>Type</label>`);
                  _push3(ssrRenderComponent(unref(Select), {
                    modelValue: unref(form).type,
                    "onUpdate:modelValue": ($event) => unref(form).type = $event,
                    options: types,
                    optionLabel: "label",
                    optionValue: "value",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div${_scopeId2}><label class="block text-sm font-medium mb-1"${_scopeId2}>Value</label>`);
                  _push3(ssrRenderComponent(unref(InputText), {
                    modelValue: unref(form).value,
                    "onUpdate:modelValue": ($event) => unref(form).value = $event,
                    type: "number",
                    step: "0.01",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  if (unref(form).type === "percent") {
                    _push3(`<small class="text-gray-500"${_scopeId2}>Enter percentage (e.g. 15 for 15%)</small>`);
                  } else {
                    _push3(`<small class="text-gray-500"${_scopeId2}>Enter amount (e.g. 10 for 10€)</small>`);
                  }
                  _push3(`</div></div><div class="grid grid-cols-2 gap-4"${_scopeId2}><div${_scopeId2}><label class="block text-sm font-medium mb-1"${_scopeId2}>Usage Limit (Optional)</label>`);
                  _push3(ssrRenderComponent(unref(InputText), {
                    modelValue: unref(form).usage_limit,
                    "onUpdate:modelValue": ($event) => unref(form).usage_limit = $event,
                    type: "number",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div${_scopeId2}><label class="block text-sm font-medium mb-1"${_scopeId2}>Expiry Date (Optional)</label>`);
                  _push3(ssrRenderComponent(unref(InputText), {
                    type: "date",
                    modelValue: unref(form).expires_at,
                    "onUpdate:modelValue": ($event) => unref(form).expires_at = $event,
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div><div class="flex justify-end pt-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Button), {
                    type: "submit",
                    label: "Create Coupon",
                    icon: "pi pi-check",
                    loading: unref(form).processing
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></form></div>`);
                } else {
                  return [
                    createVNode("div", { class: "max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100" }, [
                      createVNode("h1", { class: "text-2xl font-bold mb-6" }, "Create Coupon"),
                      createVNode("form", {
                        onSubmit: withModifiers(($event) => unref(form).post(_ctx.route("dashboard.coupons.store")), ["prevent"]),
                        class: "space-y-4"
                      }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-sm font-medium mb-1" }, "Code"),
                          createVNode(unref(InputText), {
                            modelValue: unref(form).code,
                            "onUpdate:modelValue": ($event) => unref(form).code = $event,
                            class: "w-full uppercase",
                            placeholder: "e.g. SUMMER2024",
                            onInput: ($event) => unref(form).code = $event.target.value.toUpperCase()
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "onInput"]),
                          createVNode("small", { class: "text-red-500" }, toDisplayString(unref(form).errors.code), 1)
                        ]),
                        createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                          createVNode("div", null, [
                            createVNode("label", { class: "block text-sm font-medium mb-1" }, "Type"),
                            createVNode(unref(Select), {
                              modelValue: unref(form).type,
                              "onUpdate:modelValue": ($event) => unref(form).type = $event,
                              options: types,
                              optionLabel: "label",
                              optionValue: "value",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", { class: "block text-sm font-medium mb-1" }, "Value"),
                            createVNode(unref(InputText), {
                              modelValue: unref(form).value,
                              "onUpdate:modelValue": ($event) => unref(form).value = $event,
                              type: "number",
                              step: "0.01",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            unref(form).type === "percent" ? (openBlock(), createBlock("small", {
                              key: 0,
                              class: "text-gray-500"
                            }, "Enter percentage (e.g. 15 for 15%)")) : (openBlock(), createBlock("small", {
                              key: 1,
                              class: "text-gray-500"
                            }, "Enter amount (e.g. 10 for 10€)"))
                          ])
                        ]),
                        createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                          createVNode("div", null, [
                            createVNode("label", { class: "block text-sm font-medium mb-1" }, "Usage Limit (Optional)"),
                            createVNode(unref(InputText), {
                              modelValue: unref(form).usage_limit,
                              "onUpdate:modelValue": ($event) => unref(form).usage_limit = $event,
                              type: "number",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", { class: "block text-sm font-medium mb-1" }, "Expiry Date (Optional)"),
                            createVNode(unref(InputText), {
                              type: "date",
                              modelValue: unref(form).expires_at,
                              "onUpdate:modelValue": ($event) => unref(form).expires_at = $event,
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ])
                        ]),
                        createVNode("div", { class: "flex justify-end pt-4" }, [
                          createVNode(unref(Button), {
                            type: "submit",
                            label: "Create Coupon",
                            icon: "pi pi-check",
                            loading: unref(form).processing
                          }, null, 8, ["loading"])
                        ])
                      ], 40, ["onSubmit"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Head), { title: "Create Coupon" }),
              createVNode(_sfc_main$1, null, {
                default: withCtx(() => [
                  createVNode("div", { class: "max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100" }, [
                    createVNode("h1", { class: "text-2xl font-bold mb-6" }, "Create Coupon"),
                    createVNode("form", {
                      onSubmit: withModifiers(($event) => unref(form).post(_ctx.route("dashboard.coupons.store")), ["prevent"]),
                      class: "space-y-4"
                    }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium mb-1" }, "Code"),
                        createVNode(unref(InputText), {
                          modelValue: unref(form).code,
                          "onUpdate:modelValue": ($event) => unref(form).code = $event,
                          class: "w-full uppercase",
                          placeholder: "e.g. SUMMER2024",
                          onInput: ($event) => unref(form).code = $event.target.value.toUpperCase()
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "onInput"]),
                        createVNode("small", { class: "text-red-500" }, toDisplayString(unref(form).errors.code), 1)
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-sm font-medium mb-1" }, "Type"),
                          createVNode(unref(Select), {
                            modelValue: unref(form).type,
                            "onUpdate:modelValue": ($event) => unref(form).type = $event,
                            options: types,
                            optionLabel: "label",
                            optionValue: "value",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-sm font-medium mb-1" }, "Value"),
                          createVNode(unref(InputText), {
                            modelValue: unref(form).value,
                            "onUpdate:modelValue": ($event) => unref(form).value = $event,
                            type: "number",
                            step: "0.01",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          unref(form).type === "percent" ? (openBlock(), createBlock("small", {
                            key: 0,
                            class: "text-gray-500"
                          }, "Enter percentage (e.g. 15 for 15%)")) : (openBlock(), createBlock("small", {
                            key: 1,
                            class: "text-gray-500"
                          }, "Enter amount (e.g. 10 for 10€)"))
                        ])
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-sm font-medium mb-1" }, "Usage Limit (Optional)"),
                          createVNode(unref(InputText), {
                            modelValue: unref(form).usage_limit,
                            "onUpdate:modelValue": ($event) => unref(form).usage_limit = $event,
                            type: "number",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-sm font-medium mb-1" }, "Expiry Date (Optional)"),
                          createVNode(unref(InputText), {
                            type: "date",
                            modelValue: unref(form).expires_at,
                            "onUpdate:modelValue": ($event) => unref(form).expires_at = $event,
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ]),
                      createVNode("div", { class: "flex justify-end pt-4" }, [
                        createVNode(unref(Button), {
                          type: "submit",
                          label: "Create Coupon",
                          icon: "pi pi-check",
                          loading: unref(form).processing
                        }, null, 8, ["loading"])
                      ])
                    ], 40, ["onSubmit"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/dashboard/coupons/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
