import { withCtx, unref, createTextVNode, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
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
  __name: "Addresses",
  __ssrInlineRender: true,
  props: { user: Object },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Addresses" }, null, _parent2, _scopeId));
            _push2(`<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6"${_scopeId}><h2 class="text-xl font-bold text-gray-800 mb-6"${_scopeId}>My Addresses</h2><div class="grid md:grid-cols-2 gap-6"${_scopeId}><div class="border border-indigo-100 bg-indigo-50/50 rounded-xl p-5 relative"${_scopeId}><div class="absolute top-4 right-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Tag), {
              value: "Default Billing",
              severity: "info"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center gap-3 mb-4"${_scopeId}><div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"${_scopeId}><i class="pi pi-home"${_scopeId}></i></div><span class="font-bold text-gray-800"${_scopeId}>${ssrInterpolate(__props.user.company_name || "My Company")}</span></div><div class="text-sm text-gray-600 space-y-1.5 pl-1"${_scopeId}><p class="font-medium text-gray-900"${_scopeId}>${ssrInterpolate(__props.user.name)}</p><p${_scopeId}>${ssrInterpolate(__props.user.address)}</p><p${_scopeId}>${ssrInterpolate(__props.user.postal_code)} ${ssrInterpolate(__props.user.city)}</p><p${_scopeId}>${ssrInterpolate(__props.user.country)}</p><div class="flex items-center gap-2 mt-3 pt-3 border-t border-indigo-100 text-gray-500"${_scopeId}><i class="pi pi-phone text-xs"${_scopeId}></i> ${ssrInterpolate(__props.user.phone)}</div></div><div class="mt-6"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("account.profile.edit"),
              class: "text-sm text-indigo-600 font-semibold hover:underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Edit details in Profile `);
                } else {
                  return [
                    createTextVNode(" Edit details in Profile ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div></div>`);
          } else {
            return [
              createVNode(unref(Head), { title: "Addresses" }),
              createVNode("div", { class: "bg-white rounded-xl shadow-sm border border-gray-100 p-6" }, [
                createVNode("h2", { class: "text-xl font-bold text-gray-800 mb-6" }, "My Addresses"),
                createVNode("div", { class: "grid md:grid-cols-2 gap-6" }, [
                  createVNode("div", { class: "border border-indigo-100 bg-indigo-50/50 rounded-xl p-5 relative" }, [
                    createVNode("div", { class: "absolute top-4 right-4" }, [
                      createVNode(unref(Tag), {
                        value: "Default Billing",
                        severity: "info"
                      })
                    ]),
                    createVNode("div", { class: "flex items-center gap-3 mb-4" }, [
                      createVNode("div", { class: "w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600" }, [
                        createVNode("i", { class: "pi pi-home" })
                      ]),
                      createVNode("span", { class: "font-bold text-gray-800" }, toDisplayString(__props.user.company_name || "My Company"), 1)
                    ]),
                    createVNode("div", { class: "text-sm text-gray-600 space-y-1.5 pl-1" }, [
                      createVNode("p", { class: "font-medium text-gray-900" }, toDisplayString(__props.user.name), 1),
                      createVNode("p", null, toDisplayString(__props.user.address), 1),
                      createVNode("p", null, toDisplayString(__props.user.postal_code) + " " + toDisplayString(__props.user.city), 1),
                      createVNode("p", null, toDisplayString(__props.user.country), 1),
                      createVNode("div", { class: "flex items-center gap-2 mt-3 pt-3 border-t border-indigo-100 text-gray-500" }, [
                        createVNode("i", { class: "pi pi-phone text-xs" }),
                        createTextVNode(" " + toDisplayString(__props.user.phone), 1)
                      ])
                    ]),
                    createVNode("div", { class: "mt-6" }, [
                      createVNode(unref(Link), {
                        href: _ctx.route("account.profile.edit"),
                        class: "text-sm text-indigo-600 font-semibold hover:underline"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Edit details in Profile ")
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ])
                  ])
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/account/Addresses.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
