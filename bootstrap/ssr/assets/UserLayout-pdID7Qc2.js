import { withCtx, unref, createVNode, createTextVNode, toDisplayString, renderSlot, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderSlot } from "vue/server-renderer";
import { H as HeaderLayout } from "./HeaderLayout-zh2NGVuN.js";
import { Link, router } from "@inertiajs/vue3";
const _sfc_main = {
  __name: "UserLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const logout = () => {
      router.post(route("logout"));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(HeaderLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-gray-50 min-h-screen py-10"${_scopeId}><div class="container mx-auto px-4"${_scopeId}><div class="flex flex-col lg:flex-row gap-8"${_scopeId}><aside class="w-full lg:w-72 flex-shrink-0"${_scopeId}><div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24"${_scopeId}><div class="p-6 bg-gradient-to-br from-indigo-50 to-white border-b border-gray-100"${_scopeId}><div class="flex items-center gap-4"${_scopeId}><div class="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md"${_scopeId}>${ssrInterpolate(_ctx.$page.props.auth.user.name.charAt(0).toUpperCase())}</div><div class="overflow-hidden"${_scopeId}><div class="font-bold text-gray-900 truncate"${_scopeId}>${ssrInterpolate(_ctx.$page.props.auth.user.name)}</div><div class="text-xs text-gray-500 truncate"${_scopeId}>${ssrInterpolate(_ctx.$page.props.auth.user.email)}</div></div></div></div><nav class="p-2 space-y-1"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("account.orders.index"),
              class: ["flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all no-underline", _ctx.$page.url.startsWith("/account/orders") ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"]
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<i class="${ssrRenderClass([_ctx.$page.url.startsWith("/account/orders") ? "text-indigo-600" : "text-gray-400", "pi pi-shopping-bag mr-3 text-lg"])}"${_scopeId2}></i> My Orders `);
                } else {
                  return [
                    createVNode("i", {
                      class: ["pi pi-shopping-bag mr-3 text-lg", _ctx.$page.url.startsWith("/account/orders") ? "text-indigo-600" : "text-gray-400"]
                    }, null, 2),
                    createTextVNode(" My Orders ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("account.profile.edit"),
              class: ["flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all no-underline", _ctx.$page.url.startsWith("/account/profile") ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"]
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<i class="${ssrRenderClass([_ctx.$page.url.startsWith("/account/profile") ? "text-indigo-600" : "text-gray-400", "pi pi-user mr-3 text-lg"])}"${_scopeId2}></i> Profile Details `);
                } else {
                  return [
                    createVNode("i", {
                      class: ["pi pi-user mr-3 text-lg", _ctx.$page.url.startsWith("/account/profile") ? "text-indigo-600" : "text-gray-400"]
                    }, null, 2),
                    createTextVNode(" Profile Details ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="my-2 border-t border-gray-100 mx-2"${_scopeId}></div><button class="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"${_scopeId}><i class="pi pi-sign-out mr-3 text-lg text-red-500"${_scopeId}></i> Log Out </button></nav></div></aside><main class="flex-1"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</main></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-gray-50 min-h-screen py-10" }, [
                createVNode("div", { class: "container mx-auto px-4" }, [
                  createVNode("div", { class: "flex flex-col lg:flex-row gap-8" }, [
                    createVNode("aside", { class: "w-full lg:w-72 flex-shrink-0" }, [
                      createVNode("div", { class: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24" }, [
                        createVNode("div", { class: "p-6 bg-gradient-to-br from-indigo-50 to-white border-b border-gray-100" }, [
                          createVNode("div", { class: "flex items-center gap-4" }, [
                            createVNode("div", { class: "w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md" }, toDisplayString(_ctx.$page.props.auth.user.name.charAt(0).toUpperCase()), 1),
                            createVNode("div", { class: "overflow-hidden" }, [
                              createVNode("div", { class: "font-bold text-gray-900 truncate" }, toDisplayString(_ctx.$page.props.auth.user.name), 1),
                              createVNode("div", { class: "text-xs text-gray-500 truncate" }, toDisplayString(_ctx.$page.props.auth.user.email), 1)
                            ])
                          ])
                        ]),
                        createVNode("nav", { class: "p-2 space-y-1" }, [
                          createVNode(unref(Link), {
                            href: _ctx.route("account.orders.index"),
                            class: ["flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all no-underline", _ctx.$page.url.startsWith("/account/orders") ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"]
                          }, {
                            default: withCtx(() => [
                              createVNode("i", {
                                class: ["pi pi-shopping-bag mr-3 text-lg", _ctx.$page.url.startsWith("/account/orders") ? "text-indigo-600" : "text-gray-400"]
                              }, null, 2),
                              createTextVNode(" My Orders ")
                            ]),
                            _: 1
                          }, 8, ["href", "class"]),
                          createVNode(unref(Link), {
                            href: _ctx.route("account.profile.edit"),
                            class: ["flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all no-underline", _ctx.$page.url.startsWith("/account/profile") ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"]
                          }, {
                            default: withCtx(() => [
                              createVNode("i", {
                                class: ["pi pi-user mr-3 text-lg", _ctx.$page.url.startsWith("/account/profile") ? "text-indigo-600" : "text-gray-400"]
                              }, null, 2),
                              createTextVNode(" Profile Details ")
                            ]),
                            _: 1
                          }, 8, ["href", "class"]),
                          createVNode("div", { class: "my-2 border-t border-gray-100 mx-2" }),
                          createVNode("button", {
                            onClick: logout,
                            class: "w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                          }, [
                            createVNode("i", { class: "pi pi-sign-out mr-3 text-lg text-red-500" }),
                            createTextVNode(" Log Out ")
                          ])
                        ])
                      ])
                    ]),
                    createVNode("main", { class: "flex-1" }, [
                      renderSlot(_ctx.$slots, "default")
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/UserLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
