import { withCtx, unref, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { A as AdminLayout } from "./AdminLayout-CbDljQzr.js";
import { a as _sfc_main$1 } from "../ssr.js";
import _sfc_main$2 from "./UserForm--1n_WD30.js";
import "primevue/panelmenu";
import "./ApplicationLogo-rkFqmqnV.js";
import "primevue/toast";
import "primevue/usetoast";
import "primevue/button";
import "primevue/drawer";
import "@inertiajs/vue3/server";
import "@vue/server-renderer";
import "primevue/config";
import "primevue/toastservice";
import "primevue/confirmationservice";
import "@primeuix/themes/aura";
import "@primeuix/themes";
import "primevue/inputtext";
import "primevue/password";
import "primevue/select";
import "primevue/divider";
import "./useCountries-DisC8OA1.js";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    userRoles: Array
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AdminLayout, _attrs, {
        "header-title": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Create New User`);
          } else {
            return [
              createTextVNode("Create New User")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Admin - Create User" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="max-w-4xl mx-auto"${_scopeId2}><div class="flex items-center justify-between mb-6"${_scopeId2}><h1 class="text-2xl font-semibold text-gray-800"${_scopeId2}>Create New User</h1></div><div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_sfc_main$2, {
                    "user-roles": __props.userRoles,
                    action: _ctx.route("dashboard.users.store"),
                    method: "post"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "max-w-4xl mx-auto" }, [
                      createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                        createVNode("h1", { class: "text-2xl font-semibold text-gray-800" }, "Create New User")
                      ]),
                      createVNode("div", { class: "bg-white rounded-xl shadow-sm border border-gray-100 p-6" }, [
                        createVNode(_sfc_main$2, {
                          "user-roles": __props.userRoles,
                          action: _ctx.route("dashboard.users.store"),
                          method: "post"
                        }, null, 8, ["user-roles", "action"])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Head), { title: "Admin - Create User" }),
              createVNode(_sfc_main$1, null, {
                default: withCtx(() => [
                  createVNode("div", { class: "max-w-4xl mx-auto" }, [
                    createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                      createVNode("h1", { class: "text-2xl font-semibold text-gray-800" }, "Create New User")
                    ]),
                    createVNode("div", { class: "bg-white rounded-xl shadow-sm border border-gray-100 p-6" }, [
                      createVNode(_sfc_main$2, {
                        "user-roles": __props.userRoles,
                        action: _ctx.route("dashboard.users.store"),
                        method: "post"
                      }, null, 8, ["user-roles", "action"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/dashboard/users/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
