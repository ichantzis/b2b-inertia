import Toast from "primevue/toast";
import __unplugin_components_2 from "primevue/drawer";
import __unplugin_components_1 from "primevue/overlaybadge";
import Button from "primevue/button";
import { defineComponent, useTemplateRef, resolveComponent, unref, mergeProps, withCtx, createBlock, createCommentVNode, createVNode, openBlock, toDisplayString, useSSRContext, createSlots, renderSlot, createTextVNode, computed, ref, watch, nextTick, onMounted, onUnmounted, Fragment, renderList } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttrs, ssrRenderSlot, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
import { Link, usePage, useForm, router } from "@inertiajs/vue3";
import { _ as _sfc_main$6 } from "./ApplicationLogo-rkFqmqnV.js";
import Menu from "primevue/menu";
import Menubar from "primevue/menubar";
import PanelMenu from "primevue/panelmenu";
import { _ as _export_sfc, a as _sfc_main$5 } from "../ssr.js";
import Popover from "primevue/popover";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "LinksMenu",
  __ssrInlineRender: true,
  setup(__props, { expose: __expose }) {
    const childRef = useTemplateRef("child-ref");
    __expose({
      childRef
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_InertiaLink = resolveComponent("InertiaLink");
      _push(ssrRenderComponent(unref(Menu), mergeProps({ ref: "child-ref" }, _attrs), {
        item: withCtx(({ item, props }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (item.route) {
              _push2(ssrRenderComponent(_component_InertiaLink, {
                href: item.route,
                class: "p-menu-item-link",
                custom: ""
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (item.icon) {
                      _push3(`<span class="${ssrRenderClass([item.icon, "p-menu-item-icon"])}"${_scopeId2}></span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<span class="p-menu-item-label"${_scopeId2}>${ssrInterpolate(item.label)}</span>`);
                  } else {
                    return [
                      item.icon ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: [item.icon, "p-menu-item-icon"]
                      }, null, 2)) : createCommentVNode("", true),
                      createVNode("span", { class: "p-menu-item-label" }, toDisplayString(item.label), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<a${ssrRenderAttrs(mergeProps({
                href: item.url,
                target: item.target
              }, props.action))}${_scopeId}>`);
              if (item.icon) {
                _push2(`<span class="${ssrRenderClass([item.icon, "p-menu-item-icon"])}"${_scopeId}></span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span class="p-menu-item-label"${_scopeId}>${ssrInterpolate(item.label)}</span></a>`);
            }
          } else {
            return [
              item.route ? (openBlock(), createBlock(_component_InertiaLink, {
                key: 0,
                href: item.route,
                class: "p-menu-item-link",
                custom: ""
              }, {
                default: withCtx(() => [
                  item.icon ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: [item.icon, "p-menu-item-icon"]
                  }, null, 2)) : createCommentVNode("", true),
                  createVNode("span", { class: "p-menu-item-label" }, toDisplayString(item.label), 1)
                ]),
                _: 2
              }, 1032, ["href"])) : (openBlock(), createBlock("a", mergeProps({
                key: 1,
                href: item.url,
                target: item.target
              }, props.action), [
                item.icon ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: [item.icon, "p-menu-item-icon"]
                }, null, 2)) : createCommentVNode("", true),
                createVNode("span", { class: "p-menu-item-label" }, toDisplayString(item.label), 1)
              ], 16, ["href", "target"]))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/primevue/LinksMenu.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "LinksMenuBar",
  __ssrInlineRender: true,
  setup(__props, { expose: __expose }) {
    const childRef = useTemplateRef("child-ref");
    __expose({
      childRef
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_InertiaLink = resolveComponent("InertiaLink");
      _push(ssrRenderComponent(unref(Menubar), mergeProps({
        ref: "child-ref",
        breakpoint: "1300px"
      }, _attrs), createSlots({
        item: withCtx(({ item, props, hasSubmenu, root }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (item.route) {
              _push2(ssrRenderComponent(_component_InertiaLink, {
                href: item.route,
                class: ["p-menubar-item-link", {
                  "font-bold! text-muted-color": item.active
                }],
                custom: ""
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (item.icon) {
                      _push3(`<span class="${ssrRenderClass([item.icon, "p-menubar-item-icon"])}"${_scopeId2}></span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<span class="p-menubar-item-label"${_scopeId2}>${ssrInterpolate(item.label)}</span>`);
                  } else {
                    return [
                      item.icon ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: [item.icon, "p-menubar-item-icon"]
                      }, null, 2)) : createCommentVNode("", true),
                      createVNode("span", { class: "p-menubar-item-label" }, toDisplayString(item.label), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<a${ssrRenderAttrs(mergeProps({
                href: item.url,
                target: item.target
              }, props.action, { class: "p-menubar-item-link" }))}${_scopeId}>`);
              if (item.icon) {
                _push2(`<span class="${ssrRenderClass([item.icon, "p-menubar-item-icon"])}"${_scopeId}></span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span class="p-menubar-item-label"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
              if (hasSubmenu) {
                _push2(`<i class="${ssrRenderClass([
                  "pi",
                  root ? "pi-angle-down text-xs" : "pi-angle-right"
                ])}"${_scopeId}></i>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</a>`);
            }
          } else {
            return [
              item.route ? (openBlock(), createBlock(_component_InertiaLink, {
                key: 0,
                href: item.route,
                class: ["p-menubar-item-link", {
                  "font-bold! text-muted-color": item.active
                }],
                custom: ""
              }, {
                default: withCtx(() => [
                  item.icon ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: [item.icon, "p-menubar-item-icon"]
                  }, null, 2)) : createCommentVNode("", true),
                  createVNode("span", { class: "p-menubar-item-label" }, toDisplayString(item.label), 1)
                ]),
                _: 2
              }, 1032, ["href", "class"])) : (openBlock(), createBlock("a", mergeProps({
                key: 1,
                href: item.url,
                target: item.target
              }, props.action, { class: "p-menubar-item-link" }), [
                item.icon ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: [item.icon, "p-menubar-item-icon"]
                }, null, 2)) : createCommentVNode("", true),
                createVNode("span", { class: "p-menubar-item-label" }, toDisplayString(item.label), 1),
                hasSubmenu ? (openBlock(), createBlock("i", {
                  key: 1,
                  class: [
                    "pi",
                    root ? "pi-angle-down text-xs" : "pi-angle-right"
                  ]
                }, null, 2)) : createCommentVNode("", true)
              ], 16, ["href", "target"]))
            ];
          }
        }),
        _: 2
      }, [
        _ctx.$slots.start ? {
          name: "start",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "start", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "start")
              ];
            }
          }),
          key: "0"
        } : void 0,
        _ctx.$slots.end ? {
          name: "end",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "end", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "end")
              ];
            }
          }),
          key: "1"
        } : void 0
      ]), _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/primevue/LinksMenuBar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_PanelMenu = PanelMenu;
  const _component_InertiaLink = resolveComponent("InertiaLink");
  _push(ssrRenderComponent(_component_PanelMenu, mergeProps({
    "pt:root:class": "p-0 m-0 gap-1",
    "pt:panel:class": "p-0 border-0",
    "pt:header:class": "p-0 border-0",
    "pt:itemContent:class": "gap-1"
  }, _attrs), {
    item: withCtx(({ item, active }, _push2, _parent2, _scopeId) => {
      if (_push2) {
        if (item.route) {
          _push2(ssrRenderComponent(_component_InertiaLink, {
            href: item.route,
            class: [
              "p-panelmenu-item-link flex items-center cursor-pointer no-underline px-4 py-2",
              { "font-bold! text-muted-color": item.active }
            ]
          }, {
            default: withCtx((_, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                if (item.icon) {
                  _push3(`<i class="${ssrRenderClass([
                    "mr-2 p-panelmenu-item-icon",
                    item.icon
                  ])}"${_scopeId2}></i>`);
                } else {
                  _push3(`<!---->`);
                }
                _push3(`<span${_scopeId2}>${ssrInterpolate(item.label)}</span>`);
              } else {
                return [
                  item.icon ? (openBlock(), createBlock("i", {
                    key: 0,
                    class: [
                      "mr-2 p-panelmenu-item-icon",
                      item.icon
                    ]
                  }, null, 2)) : createCommentVNode("", true),
                  createVNode("span", null, toDisplayString(item.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
        } else {
          _push2(`<a${ssrRenderAttr("href", item.url)}${ssrRenderAttr("target", item.target)} class="${ssrRenderClass([
            "flex items-center cursor-pointer no-underline px-4 py-2",
            item.items ? "p-panelmenu-header-link" : "p-panelmenu-item-link"
          ])}"${_scopeId}>`);
          if (item.icon) {
            _push2(`<i class="${ssrRenderClass([
              "mr-2 p-panelmenu-item-icon",
              item.icon
            ])}"${_scopeId}></i>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<span${_scopeId}>${ssrInterpolate(item.label)}</span>`);
          if (item.items) {
            _push2(`<span class="${ssrRenderClass([
              "pi p-panelmenu-submenu-icon ml-auto",
              active ? "pi-angle-down" : "pi-angle-right"
            ])}"${_scopeId}></span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</a>`);
        }
      } else {
        return [
          item.route ? (openBlock(), createBlock(_component_InertiaLink, {
            key: 0,
            href: item.route,
            class: [
              "p-panelmenu-item-link flex items-center cursor-pointer no-underline px-4 py-2",
              { "font-bold! text-muted-color": item.active }
            ]
          }, {
            default: withCtx(() => [
              item.icon ? (openBlock(), createBlock("i", {
                key: 0,
                class: [
                  "mr-2 p-panelmenu-item-icon",
                  item.icon
                ]
              }, null, 2)) : createCommentVNode("", true),
              createVNode("span", null, toDisplayString(item.label), 1)
            ]),
            _: 2
          }, 1032, ["href", "class"])) : (openBlock(), createBlock("a", {
            key: 1,
            href: item.url,
            target: item.target,
            class: [
              "flex items-center cursor-pointer no-underline px-4 py-2",
              item.items ? "p-panelmenu-header-link" : "p-panelmenu-item-link"
            ]
          }, [
            item.icon ? (openBlock(), createBlock("i", {
              key: 0,
              class: [
                "mr-2 p-panelmenu-item-icon",
                item.icon
              ]
            }, null, 2)) : createCommentVNode("", true),
            createVNode("span", null, toDisplayString(item.label), 1),
            item.items ? (openBlock(), createBlock("span", {
              key: 1,
              class: [
                "pi p-panelmenu-submenu-icon ml-auto",
                active ? "pi-angle-down" : "pi-angle-right"
              ]
            }, null, 2)) : createCommentVNode("", true)
          ], 10, ["href", "target"]))
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/primevue/LinksPanelMenu.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const LinksPanelMenu = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$1 = {
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-[#1a1a1a] text-gray-400 text-sm mt-auto font-light" }, _attrs))} data-v-c5db722b><div class="border-b border-gray-800" data-v-c5db722b>`);
      _push(ssrRenderComponent(_sfc_main$5, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col md:flex-row items-center justify-between py-10 gap-6" data-v-c5db722b${_scopeId}><div class="text-center md:text-left" data-v-c5db722b${_scopeId}><h3 class="text-xl font-medium text-white mb-2" data-v-c5db722b${_scopeId}>Stay in the loop</h3><p class="text-gray-500" data-v-c5db722b${_scopeId}>Subscribe to receive inspiration, ideas, and news.</p></div><div class="flex w-full md:w-auto gap-3" data-v-c5db722b${_scopeId}>`);
            _push2(ssrRenderComponent(unref(InputText), {
              placeholder: "Your email address",
              class: "w-full md:w-80 bg-[#252525] border-gray-700 text-gray-200 focus:border-gray-500 focus:ring-0"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Button), {
              label: "Subscribe",
              severity: "secondary",
              class: "bg-white text-black border-none hover:bg-gray-200 font-medium px-6"
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col md:flex-row items-center justify-between py-10 gap-6" }, [
                createVNode("div", { class: "text-center md:text-left" }, [
                  createVNode("h3", { class: "text-xl font-medium text-white mb-2" }, "Stay in the loop"),
                  createVNode("p", { class: "text-gray-500" }, "Subscribe to receive inspiration, ideas, and news.")
                ]),
                createVNode("div", { class: "flex w-full md:w-auto gap-3" }, [
                  createVNode(unref(InputText), {
                    placeholder: "Your email address",
                    class: "w-full md:w-80 bg-[#252525] border-gray-700 text-gray-200 focus:border-gray-500 focus:ring-0"
                  }),
                  createVNode(unref(Button), {
                    label: "Subscribe",
                    severity: "secondary",
                    class: "bg-white text-black border-none hover:bg-gray-200 font-medium px-6"
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="py-16" data-v-c5db722b>`);
      _push(ssrRenderComponent(_sfc_main$5, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12" data-v-c5db722b${_scopeId}><div data-v-c5db722b${_scopeId}><h4 class="text-white font-medium text-lg mb-6 tracking-wide" data-v-c5db722b${_scopeId}>PINAKOTHIKI</h4><div class="mb-6 text-gray-400 leading-relaxed" data-v-c5db722b${_scopeId}> || b2b.pinakothiki.gr - Gallery || <br data-v-c5db722b${_scopeId}> Paintings on canvas or poster <br data-v-c5db722b${_scopeId}> Discover Unique Art for your space! <br data-v-c5db722b${_scopeId}> Handmade • Free Shipping • Made in Greece </div><ul class="space-y-4" data-v-c5db722b${_scopeId}><li class="flex items-center gap-3 group" data-v-c5db722b${_scopeId}><i class="pi pi-envelope text-gray-500 group-hover:text-white transition-colors" data-v-c5db722b${_scopeId}></i><a href="mailto:info@pinakothiki.com" class="hover:text-white transition-colors no-underline" data-v-c5db722b${_scopeId}>info@pinakothiki.com</a></li></ul></div><div data-v-c5db722b${_scopeId}><h4 class="text-white font-medium text-lg mb-6 tracking-wide" data-v-c5db722b${_scopeId}>Information</h4><ul class="space-y-3" data-v-c5db722b${_scopeId}><li data-v-c5db722b${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("welcome"),
              class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Home `);
                } else {
                  return [
                    createTextVNode(" Home ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li data-v-c5db722b${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("collections.index"),
              class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Collections `);
                } else {
                  return [
                    createTextVNode(" Collections ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li data-v-c5db722b${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("artists.overview"),
              class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Artists `);
                } else {
                  return [
                    createTextVNode(" Artists ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li data-v-c5db722b${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "#",
              class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` About Us `);
                } else {
                  return [
                    createTextVNode(" About Us ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li data-v-c5db722b${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("contact.index"),
              class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Contact `);
                } else {
                  return [
                    createTextVNode(" Contact ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li></ul></div><div data-v-c5db722b${_scopeId}><h4 class="text-white font-medium text-lg mb-6 tracking-wide" data-v-c5db722b${_scopeId}>Customer Service</h4><ul class="space-y-3" data-v-c5db722b${_scopeId}><li data-v-c5db722b${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "#",
              class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Shipping Policy `);
                } else {
                  return [
                    createTextVNode(" Shipping Policy ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li data-v-c5db722b${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "#",
              class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Returns &amp; Refunds `);
                } else {
                  return [
                    createTextVNode(" Returns & Refunds ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li data-v-c5db722b${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "#",
              class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Terms of Service `);
                } else {
                  return [
                    createTextVNode(" Terms of Service ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li data-v-c5db722b${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "#",
              class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Privacy Policy `);
                } else {
                  return [
                    createTextVNode(" Privacy Policy ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li data-v-c5db722b${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "#",
              class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` FAQ `);
                } else {
                  return [
                    createTextVNode(" FAQ ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li></ul></div><div data-v-c5db722b${_scopeId}><h4 class="text-white font-medium text-lg mb-6 tracking-wide" data-v-c5db722b${_scopeId}>Follow Us</h4><div class="flex gap-4 mb-8" data-v-c5db722b${_scopeId}><a href="#" class="w-10 h-10 flex items-center justify-center bg-[#252525] rounded-full hover:bg-white hover:text-black transition-all duration-300 no-underline group" data-v-c5db722b${_scopeId}><i class="pi pi-facebook text-lg" data-v-c5db722b${_scopeId}></i></a><a href="#" class="w-10 h-10 flex items-center justify-center bg-[#252525] rounded-full hover:bg-white hover:text-black transition-all duration-300 no-underline group" data-v-c5db722b${_scopeId}><i class="pi pi-instagram text-lg" data-v-c5db722b${_scopeId}></i></a><a href="#" class="w-10 h-10 flex items-center justify-center bg-[#252525] rounded-full hover:bg-white hover:text-black transition-all duration-300 no-underline group" data-v-c5db722b${_scopeId}><i class="pi pi-pinterest text-lg" data-v-c5db722b${_scopeId}></i></a></div><h4 class="text-white font-medium text-lg mb-4 tracking-wide" data-v-c5db722b${_scopeId}>Secure Payments</h4><div class="flex gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-300" data-v-c5db722b${_scopeId}><i class="pi pi-credit-card text-2xl hover:text-white transition-colors" data-v-c5db722b${_scopeId}></i><i class="pi pi-wallet text-2xl hover:text-white transition-colors" data-v-c5db722b${_scopeId}></i><i class="pi pi-paypal text-2xl hover:text-white transition-colors" data-v-c5db722b${_scopeId}></i></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12" }, [
                createVNode("div", null, [
                  createVNode("h4", { class: "text-white font-medium text-lg mb-6 tracking-wide" }, "PINAKOTHIKI"),
                  createVNode("div", { class: "mb-6 text-gray-400 leading-relaxed" }, [
                    createTextVNode(" || b2b.pinakothiki.gr - Gallery || "),
                    createVNode("br"),
                    createTextVNode(" Paintings on canvas or poster "),
                    createVNode("br"),
                    createTextVNode(" Discover Unique Art for your space! "),
                    createVNode("br"),
                    createTextVNode(" Handmade • Free Shipping • Made in Greece ")
                  ]),
                  createVNode("ul", { class: "space-y-4" }, [
                    createVNode("li", { class: "flex items-center gap-3 group" }, [
                      createVNode("i", { class: "pi pi-envelope text-gray-500 group-hover:text-white transition-colors" }),
                      createVNode("a", {
                        href: "mailto:info@pinakothiki.com",
                        class: "hover:text-white transition-colors no-underline"
                      }, "info@pinakothiki.com")
                    ])
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("h4", { class: "text-white font-medium text-lg mb-6 tracking-wide" }, "Information"),
                  createVNode("ul", { class: "space-y-3" }, [
                    createVNode("li", null, [
                      createVNode(unref(Link), {
                        href: _ctx.route("welcome"),
                        class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Home ")
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ]),
                    createVNode("li", null, [
                      createVNode(unref(Link), {
                        href: _ctx.route("collections.index"),
                        class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Collections ")
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ]),
                    createVNode("li", null, [
                      createVNode(unref(Link), {
                        href: _ctx.route("artists.overview"),
                        class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Artists ")
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ]),
                    createVNode("li", null, [
                      createVNode(unref(Link), {
                        href: "#",
                        class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" About Us ")
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("li", null, [
                      createVNode(unref(Link), {
                        href: _ctx.route("contact.index"),
                        class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Contact ")
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ])
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("h4", { class: "text-white font-medium text-lg mb-6 tracking-wide" }, "Customer Service"),
                  createVNode("ul", { class: "space-y-3" }, [
                    createVNode("li", null, [
                      createVNode(unref(Link), {
                        href: "#",
                        class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Shipping Policy ")
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("li", null, [
                      createVNode(unref(Link), {
                        href: "#",
                        class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Returns & Refunds ")
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("li", null, [
                      createVNode(unref(Link), {
                        href: "#",
                        class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Terms of Service ")
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("li", null, [
                      createVNode(unref(Link), {
                        href: "#",
                        class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Privacy Policy ")
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("li", null, [
                      createVNode(unref(Link), {
                        href: "#",
                        class: "hover:text-white transition-colors duration-200 no-underline block w-fit"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" FAQ ")
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("h4", { class: "text-white font-medium text-lg mb-6 tracking-wide" }, "Follow Us"),
                  createVNode("div", { class: "flex gap-4 mb-8" }, [
                    createVNode("a", {
                      href: "#",
                      class: "w-10 h-10 flex items-center justify-center bg-[#252525] rounded-full hover:bg-white hover:text-black transition-all duration-300 no-underline group"
                    }, [
                      createVNode("i", { class: "pi pi-facebook text-lg" })
                    ]),
                    createVNode("a", {
                      href: "#",
                      class: "w-10 h-10 flex items-center justify-center bg-[#252525] rounded-full hover:bg-white hover:text-black transition-all duration-300 no-underline group"
                    }, [
                      createVNode("i", { class: "pi pi-instagram text-lg" })
                    ]),
                    createVNode("a", {
                      href: "#",
                      class: "w-10 h-10 flex items-center justify-center bg-[#252525] rounded-full hover:bg-white hover:text-black transition-all duration-300 no-underline group"
                    }, [
                      createVNode("i", { class: "pi pi-pinterest text-lg" })
                    ])
                  ]),
                  createVNode("h4", { class: "text-white font-medium text-lg mb-4 tracking-wide" }, "Secure Payments"),
                  createVNode("div", { class: "flex gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-300" }, [
                    createVNode("i", { class: "pi pi-credit-card text-2xl hover:text-white transition-colors" }),
                    createVNode("i", { class: "pi pi-wallet text-2xl hover:text-white transition-colors" }),
                    createVNode("i", { class: "pi pi-paypal text-2xl hover:text-white transition-colors" })
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="bg-black py-6 border-t border-gray-900" data-v-c5db722b>`);
      _push(ssrRenderComponent(_sfc_main$5, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600" data-v-c5db722b${_scopeId}><p class="font-light" data-v-c5db722b${_scopeId}>© ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Pinakothiki. All rights reserved.</p><div class="flex gap-4" data-v-c5db722b${_scopeId}><span class="hover:text-gray-400 cursor-pointer transition-colors" data-v-c5db722b${_scopeId}><a class="text-grey-700 hover:text-gray-400" href="https://www.oneplusdesign.com/" data-v-c5db722b${_scopeId}>Designed &amp; Developed by OnePlus Design.</a></span></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600" }, [
                createVNode("p", { class: "font-light" }, "© " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " Pinakothiki. All rights reserved.", 1),
                createVNode("div", { class: "flex gap-4" }, [
                  createVNode("span", { class: "hover:text-gray-400 cursor-pointer transition-colors" }, [
                    createVNode("a", {
                      class: "text-grey-700 hover:text-gray-400",
                      href: "https://www.oneplusdesign.com/"
                    }, "Designed & Developed by OnePlus Design.")
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></footer>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Footer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-c5db722b"]]);
const _sfc_main = {
  __name: "HeaderLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const toast = useToast();
    const currentRoute = computed(() => {
      page.url;
      return route().current();
    });
    const cartCount = computed(() => page.props.cartCount || 0);
    const cartItemsPreview = computed(() => {
      var _a;
      return ((_a = page.props.cartItemsPreview) == null ? void 0 : _a.map((item) => {
        var _a2;
        return {
          ...item,
          formattedPrice: ((_a2 = item.artwork_data) == null ? void 0 : _a2.price) ? Number(item.artwork_data.price).toFixed(2) : "0.00"
        };
      })) || [];
    });
    const isCartEmpty = computed(() => cartItemsPreview.value.length === 0);
    const cartSubtotal = computed(() => {
      const total = cartItemsPreview.value.reduce((sum, item) => {
        var _a;
        const price = Number(((_a = item.artwork_data) == null ? void 0 : _a.price) || 0);
        const quantity = Number(item.quantity || 0);
        return sum + price * quantity;
      }, 0);
      return total.toFixed(2);
    });
    const op = ref();
    const cartOp = ref();
    const cartOpTimer = ref(null);
    const userOpTimer = ref(null);
    computed(() => {
      var _a, _b;
      return ((_b = (_a = page.props.auth) == null ? void 0 : _a.user) == null ? void 0 : _b.name) || "User";
    });
    const mainMenuItems = computed(() => {
      var _a, _b, _c;
      const items = [];
      if (((_b = (_a = page.props.auth) == null ? void 0 : _a.user) == null ? void 0 : _b.role) === "admin") {
        items.push({
          label: "Dashboard",
          route: route("dashboard.index"),
          icon: "pi pi-fw pi-sliders-h",
          active: currentRoute.value == "dashboard",
          command: () => {
            mobileMenuOpen.value = false;
          }
        });
      }
      items.push({
        label: "Browse",
        icon: "pi pi-fw pi-objects-column",
        route: route("collections.index"),
        command: () => {
          mobileMenuOpen.value = false;
        },
        expanded: true
        // Add this to show submenu by default
      });
      items.push({
        label: "Products Collection",
        icon: "pi pi-fw pi-images",
        expanded: true,
        // Add this to show submenu by default
        items: [
          {
            label: "All Collections",
            // icon: 'pi pi-fw pi-images',
            route: route("lists.index"),
            command: () => {
              mobileMenuOpen.value = false;
            }
          },
          ...(((_c = page.props.global_data) == null ? void 0 : _c.lists) || []).map((list) => ({
            label: list.name,
            icon: list.cover,
            route: route("lists.show", { slug: list.slug }),
            command: () => {
              mobileMenuOpen.value = false;
            }
          }))
        ]
      });
      items.push({
        label: "Search",
        route: route("artworks"),
        icon: "pi pi-fw pi-search",
        active: currentRoute.value == "artworks",
        command: () => {
          mobileMenuOpen.value = false;
        }
      });
      items.push({
        label: "Artists",
        route: route("artists.overview"),
        icon: "pi pi-fw pi-palette",
        active: currentRoute.value == "artists.overview" || currentRoute.value == "artists.illustrators" || currentRoute.value == "artists.photographers" || currentRoute.value == "artists.by_country" || currentRoute.value == "artists.all",
        command: () => {
          mobileMenuOpen.value = false;
        }
      });
      items.push({
        label: "Contact Us",
        route: route("contact.index"),
        icon: "pi pi-fw pi-envelope",
        active: currentRoute.value == "contact.index",
        command: () => {
          mobileMenuOpen.value = false;
        }
      });
      return items;
    });
    useTemplateRef("user-menu");
    const logoutForm = useForm({});
    const userMenuItems = [
      {
        label: "My Orders",
        route: route("account.orders.index"),
        icon: "pi pi-fw pi-shopping-bag",
        command: () => {
          op.value.hide();
        }
      },
      // {
      //     label: 'Addresses',
      //     route: route('account.addresses.index'),
      //     icon: 'pi pi-fw pi-map-marker',
      //     command: () => {
      //         op.value.hide();
      //     },
      // },
      {
        label: "Profile",
        route: route("account.profile.edit"),
        icon: "pi pi-fw pi-user",
        command: () => {
          op.value.hide();
        }
      },
      {
        label: "Log Out",
        icon: "pi pi-fw pi-sign-out",
        command: () => {
          op.value.hide();
          logoutForm.post(route("logout"));
        }
      }
    ];
    ref(false);
    const showUserPopover = (event) => {
      var _a, _b;
      const isAuthenticated = (_a = page.props.auth) == null ? void 0 : _a.user;
      if (isAuthenticated) {
        clearTimeout(userOpTimer.value);
        (_b = op.value) == null ? void 0 : _b.show(event);
      }
    };
    const handleUserClick = () => {
      var _a;
      const isAuthenticated = (_a = page.props.auth) == null ? void 0 : _a.user;
      if (!isAuthenticated) {
        router.visit(route("login"));
      }
    };
    const hideUserPopover = () => {
      userOpTimer.value = setTimeout(() => {
        var _a;
        (_a = op.value) == null ? void 0 : _a.hide();
      }, 150);
    };
    const clearUserHideTimer = () => {
      clearTimeout(userOpTimer.value);
    };
    const homeMobileMenuItems = computed(() => {
      return [
        {
          label: "Home",
          route: route("welcome"),
          icon: "pi pi-fw pi-home",
          active: currentRoute.value === "welcome",
          command: () => {
            mobileMenuOpen.value = false;
          }
        },
        ...mainMenuItems.value
      ];
    });
    const mobileMenuOpen = ref(false);
    const isHeaderVisible = ref(true);
    ref(0);
    const showCartPopover = (event) => {
      clearTimeout(cartOpTimer.value);
      if (!cartOp.value.isUnstyled) {
        cartOp.value.show(event, event.currentTarget);
      } else {
        cartOp.value.show(event);
      }
    };
    const hideCartPopover = () => {
      cartOpTimer.value = setTimeout(() => {
        var _a;
        (_a = cartOp.value) == null ? void 0 : _a.hide();
      }, 150);
    };
    const clearCartHideTimer = () => {
      clearTimeout(cartOpTimer.value);
    };
    const handleDeleteItem = (itemId) => {
      router.delete(route("cart.destroy", itemId), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Item removed from cart",
            life: 3e3
          });
        },
        onError: (errors) => {
          console.error("Failed to delete item:", errors);
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Could not delete item from cart. Please try again.",
            life: 5e3
          });
        }
      });
    };
    watch(() => page.props.flash, (flashMessages) => {
      if (flashMessages) {
        nextTick(() => {
          try {
            if (flashMessages.success) {
              toast.add({ severity: "success", summary: "Success", detail: flashMessages.success, life: 3e3 });
            }
            if (flashMessages.error) {
              toast.add({ severity: "error", summary: "Error", detail: flashMessages.error, life: 3e3 });
            }
            if (flashMessages.login_success_message) {
              toast.add({ severity: "success", summary: "Logged In", detail: flashMessages.login_success_message, life: 3e3 });
            }
          } catch (error) {
            console.error("Error calling toast.add() inside nextTick:", error);
          }
        });
      }
    }, { deep: true, immediate: true });
    const handlePopstate = () => {
      router.reload({
        only: ["cartCount", "cartItemsPreview"],
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
        },
        onError: (errors) => {
          console.error("Error reloading cart props on popstate:", errors);
        }
      });
    };
    onMounted(() => {
      window.addEventListener("popstate", handlePopstate);
    });
    onUnmounted(() => {
      window.removeEventListener("popstate", handlePopstate);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = resolveComponent("Container");
      const _component_Button = Button;
      const _component_OverlayBadge = __unplugin_components_1;
      const _component_Drawer = __unplugin_components_2;
      const _component_Toast = Toast;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-0424f39f><div class="min-h-screen" data-v-0424f39f><nav class="${ssrRenderClass([
        "dynamic-bg shadow-sm fixed w-full transition-transform duration-300 z-50",
        { "-translate-y-full": !isHeaderVisible.value }
      ])}" data-v-0424f39f>`);
      _push(ssrRenderComponent(_component_Container, { class: "relative max-w-none" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$3, {
              model: mainMenuItems.value,
              key: currentRoute.value,
              "pt:root:class": "px-0 py-4 border-0 rounded-none dynamic-bg",
              "pt:button:class": "hidden"
            }, {
              start: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center lg:hidden" data-v-0424f39f${_scopeId2}><div class="relative" data-v-0424f39f${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Button, {
                    severity: "secondary",
                    icon: "pi pi-bars",
                    "pt:icon:class": "text-xl",
                    text: "",
                    onClick: ($event) => mobileMenuOpen.value = true
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div><div class="shrink-0 flex items-center mr-5" data-v-0424f39f${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Link), {
                    href: _ctx.route("welcome")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_sfc_main$6, { class: "block transition-transform duration-200 h-8 w-auto sm:h-10 md:h-12 lg:h-14" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_sfc_main$6, { class: "block transition-transform duration-200 h-8 w-auto sm:h-10 md:h-12 lg:h-14" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center lg:hidden" }, [
                      createVNode("div", { class: "relative" }, [
                        createVNode(_component_Button, {
                          severity: "secondary",
                          icon: "pi pi-bars",
                          "pt:icon:class": "text-xl",
                          text: "",
                          onClick: ($event) => mobileMenuOpen.value = true
                        }, null, 8, ["onClick"])
                      ])
                    ]),
                    createVNode("div", { class: "shrink-0 flex items-center mr-5" }, [
                      createVNode(unref(Link), {
                        href: _ctx.route("welcome")
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$6, { class: "block transition-transform duration-200 h-8 w-auto sm:h-10 md:h-12 lg:h-14" })
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ])
                  ];
                }
              }),
              end: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center" data-v-0424f39f${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Button, {
                    id: "user-menu-btn",
                    severity: "secondary",
                    icon: "pi pi-user",
                    "pt:root:class": "p-0",
                    "pt:icon:class": "text-xl",
                    text: "",
                    "aria-label": "User menu",
                    onMouseenter: showUserPopover,
                    onMouseleave: hideUserPopover,
                    onClick: handleUserClick
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Link), {
                    href: _ctx.route("cart.index"),
                    class: "ml-4",
                    onMouseenter: showCartPopover,
                    onMouseleave: hideCartPopover,
                    "aria-haspopup": "true",
                    "aria-controls": "cart-popover-content"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (cartCount.value > 0) {
                          _push4(ssrRenderComponent(_component_OverlayBadge, {
                            value: String(cartCount.value)
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_Button, {
                                  id: "cart-menu-btn",
                                  severity: "secondary",
                                  icon: "pi pi-shopping-cart",
                                  "pt:root:class": "p-0",
                                  "pt:icon:class": "text-xl",
                                  text: "",
                                  "aria-label": "Cart menu"
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_Button, {
                                    id: "cart-menu-btn",
                                    severity: "secondary",
                                    icon: "pi pi-shopping-cart",
                                    "pt:root:class": "p-0",
                                    "pt:icon:class": "text-xl",
                                    text: "",
                                    "aria-label": "Cart menu"
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(ssrRenderComponent(_component_Button, {
                            id: "cart-menu-btn",
                            severity: "secondary",
                            icon: "pi pi-shopping-cart",
                            "pt:root:class": "p-0",
                            "pt:icon:class": "text-xl",
                            text: "",
                            "aria-label": "Cart menu"
                          }, null, _parent4, _scopeId3));
                        }
                      } else {
                        return [
                          cartCount.value > 0 ? (openBlock(), createBlock(_component_OverlayBadge, {
                            key: 0,
                            value: String(cartCount.value)
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_Button, {
                                id: "cart-menu-btn",
                                severity: "secondary",
                                icon: "pi pi-shopping-cart",
                                "pt:root:class": "p-0",
                                "pt:icon:class": "text-xl",
                                text: "",
                                "aria-label": "Cart menu"
                              })
                            ]),
                            _: 1
                          }, 8, ["value"])) : (openBlock(), createBlock(_component_Button, {
                            key: 1,
                            id: "cart-menu-btn",
                            severity: "secondary",
                            icon: "pi pi-shopping-cart",
                            "pt:root:class": "p-0",
                            "pt:icon:class": "text-xl",
                            text: "",
                            "aria-label": "Cart menu"
                          }))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Popover), {
                    ref_key: "op",
                    ref: op,
                    target: "#user-menu-btn",
                    showCloseIcon: false,
                    onMouseenter: clearUserHideTimer,
                    onMouseleave: hideUserPopover
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="p-2 w-48" data-v-0424f39f${_scopeId3}>`);
                        _push4(ssrRenderComponent(LinksPanelMenu, {
                          model: userMenuItems,
                          class: "border-none"
                        }, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "p-2 w-48" }, [
                            createVNode(LinksPanelMenu, {
                              model: userMenuItems,
                              class: "border-none"
                            })
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Popover), {
                    ref_key: "cartOp",
                    ref: cartOp,
                    id: "cart-popover-content",
                    target: "#cart-menu-btn",
                    onMouseenter: clearCartHideTimer,
                    onMouseleave: hideCartPopover
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="p-4 w-[300px] max-h-[400px] overflow-y-auto" data-v-0424f39f${_scopeId3}><h4 class="font-semibold mb-3" data-v-0424f39f${_scopeId3}>Shopping Cart</h4>`);
                        if (isCartEmpty.value) {
                          _push4(`<div class="text-center text-muted-color" data-v-0424f39f${_scopeId3}> Your cart is empty. </div>`);
                        } else {
                          _push4(`<div class="flex flex-col gap-3" data-v-0424f39f${_scopeId3}><!--[-->`);
                          ssrRenderList(cartItemsPreview.value, (item) => {
                            var _a, _b;
                            _push4(`<div class="flex items-center gap-2 border-b pb-2 dynamic-border last:border-b-0" data-v-0424f39f${_scopeId3}>`);
                            _push4(ssrRenderComponent(unref(Link), {
                              href: _ctx.route("artwork.details", { id: item.artwork_id, slug: (_a = item.artwork_data) == null ? void 0 : _a.slug }),
                              class: "flex-shrink-0"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                var _a2, _b2;
                                if (_push5) {
                                  if ((_a2 = item.artwork_data) == null ? void 0 : _a2.img_thumb) {
                                    _push5(`<img${ssrRenderAttr("src", item.artwork_data.img_thumb)}${ssrRenderAttr("alt", item.artwork_data.title)} class="w-12 h-12 object-cover rounded hover:opacity-80 transition-opacity" data-v-0424f39f${_scopeId4}>`);
                                  } else {
                                    _push5(`<div class="w-12 h-12 bg-surface-100 rounded flex items-center justify-center text-muted-color text-xs flex-shrink-0" data-v-0424f39f${_scopeId4}> No Img </div>`);
                                  }
                                } else {
                                  return [
                                    ((_b2 = item.artwork_data) == null ? void 0 : _b2.img_thumb) ? (openBlock(), createBlock("img", {
                                      key: 0,
                                      src: item.artwork_data.img_thumb,
                                      alt: item.artwork_data.title,
                                      class: "w-12 h-12 object-cover rounded hover:opacity-80 transition-opacity"
                                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "w-12 h-12 bg-surface-100 rounded flex items-center justify-center text-muted-color text-xs flex-shrink-0"
                                    }, " No Img "))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(`<div class="flex-grow min-w-0" data-v-0424f39f${_scopeId3}>`);
                            _push4(ssrRenderComponent(unref(Link), {
                              class: "font-medium text-sm truncate hover:text-primary hover:underline transition-colors no-underline text-inherit",
                              href: _ctx.route("artwork.details", { id: item.artwork_id, slug: (_b = item.artwork_data) == null ? void 0 : _b.slug })
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                var _a2, _b2;
                                if (_push5) {
                                  _push5(`<p data-v-0424f39f${_scopeId4}>${ssrInterpolate(((_a2 = item.artwork_data) == null ? void 0 : _a2.title) || "Untitled")}</p>`);
                                } else {
                                  return [
                                    createVNode("p", null, toDisplayString(((_b2 = item.artwork_data) == null ? void 0 : _b2.title) || "Untitled"), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(`<p class="text-sm text-muted-color" data-v-0424f39f${_scopeId3}>Type: ${ssrInterpolate(item.type)}</p><p class="text-sm text-muted-color" data-v-0424f39f${_scopeId3}>Print: ${ssrInterpolate(item.print_type === "oil" ? "Oil Print" : "Mono Print")}</p><p class="text-sm text-muted-color" data-v-0424f39f${_scopeId3}>Frame: ${ssrInterpolate(item.frame)}</p><p class="text-sm text-muted-color" data-v-0424f39f${_scopeId3}>Size: ${ssrInterpolate(item.size)}</p><p class="text-sm text-muted-color" data-v-0424f39f${_scopeId3}>${ssrInterpolate(item.quantity)} x €${ssrInterpolate(item.formattedPrice)}</p></div>`);
                            _push4(ssrRenderComponent(_component_Button, {
                              icon: "pi pi-times-circle",
                              text: "",
                              rounded: "",
                              "aria-label": "Delete item",
                              onClick: ($event) => handleDeleteItem(item.id)
                            }, null, _parent4, _scopeId3));
                            _push4(`</div>`);
                          });
                          _push4(`<!--]-->`);
                          if (!isCartEmpty.value) {
                            _push4(`<div class="mt-3 pt-2 dynamic-border" data-v-0424f39f${_scopeId3}><p class="text-sm font-semibold flex justify-between" data-v-0424f39f${_scopeId3}><span data-v-0424f39f${_scopeId3}>Subtotal:</span><span data-v-0424f39f${_scopeId3}>€${ssrInterpolate(cartSubtotal.value)}</span></p></div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(ssrRenderComponent(unref(Link), {
                            href: _ctx.route("cart.index"),
                            class: "block mt-2"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_Button, {
                                  label: "View Full Cart",
                                  severity: "primary",
                                  size: "small",
                                  class: "w-full"
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_Button, {
                                    label: "View Full Cart",
                                    severity: "primary",
                                    size: "small",
                                    class: "w-full"
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        }
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "p-4 w-[300px] max-h-[400px] overflow-y-auto" }, [
                            createVNode("h4", { class: "font-semibold mb-3" }, "Shopping Cart"),
                            isCartEmpty.value ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-center text-muted-color"
                            }, " Your cart is empty. ")) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "flex flex-col gap-3"
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(cartItemsPreview.value, (item) => {
                                var _a, _b;
                                return openBlock(), createBlock("div", {
                                  key: item.id,
                                  class: "flex items-center gap-2 border-b pb-2 dynamic-border last:border-b-0"
                                }, [
                                  createVNode(unref(Link), {
                                    href: _ctx.route("artwork.details", { id: item.artwork_id, slug: (_a = item.artwork_data) == null ? void 0 : _a.slug }),
                                    class: "flex-shrink-0"
                                  }, {
                                    default: withCtx(() => {
                                      var _a2;
                                      return [
                                        ((_a2 = item.artwork_data) == null ? void 0 : _a2.img_thumb) ? (openBlock(), createBlock("img", {
                                          key: 0,
                                          src: item.artwork_data.img_thumb,
                                          alt: item.artwork_data.title,
                                          class: "w-12 h-12 object-cover rounded hover:opacity-80 transition-opacity"
                                        }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                          key: 1,
                                          class: "w-12 h-12 bg-surface-100 rounded flex items-center justify-center text-muted-color text-xs flex-shrink-0"
                                        }, " No Img "))
                                      ];
                                    }),
                                    _: 2
                                  }, 1032, ["href"]),
                                  createVNode("div", { class: "flex-grow min-w-0" }, [
                                    createVNode(unref(Link), {
                                      class: "font-medium text-sm truncate hover:text-primary hover:underline transition-colors no-underline text-inherit",
                                      href: _ctx.route("artwork.details", { id: item.artwork_id, slug: (_b = item.artwork_data) == null ? void 0 : _b.slug })
                                    }, {
                                      default: withCtx(() => {
                                        var _a2;
                                        return [
                                          createVNode("p", null, toDisplayString(((_a2 = item.artwork_data) == null ? void 0 : _a2.title) || "Untitled"), 1)
                                        ];
                                      }),
                                      _: 2
                                    }, 1032, ["href"]),
                                    createVNode("p", { class: "text-sm text-muted-color" }, "Type: " + toDisplayString(item.type), 1),
                                    createVNode("p", { class: "text-sm text-muted-color" }, "Print: " + toDisplayString(item.print_type === "oil" ? "Oil Print" : "Mono Print"), 1),
                                    createVNode("p", { class: "text-sm text-muted-color" }, "Frame: " + toDisplayString(item.frame), 1),
                                    createVNode("p", { class: "text-sm text-muted-color" }, "Size: " + toDisplayString(item.size), 1),
                                    createVNode("p", { class: "text-sm text-muted-color" }, toDisplayString(item.quantity) + " x €" + toDisplayString(item.formattedPrice), 1)
                                  ]),
                                  createVNode(_component_Button, {
                                    icon: "pi pi-times-circle",
                                    text: "",
                                    rounded: "",
                                    "aria-label": "Delete item",
                                    onClick: ($event) => handleDeleteItem(item.id)
                                  }, null, 8, ["onClick"])
                                ]);
                              }), 128)),
                              !isCartEmpty.value ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "mt-3 pt-2 dynamic-border"
                              }, [
                                createVNode("p", { class: "text-sm font-semibold flex justify-between" }, [
                                  createVNode("span", null, "Subtotal:"),
                                  createVNode("span", null, "€" + toDisplayString(cartSubtotal.value), 1)
                                ])
                              ])) : createCommentVNode("", true),
                              createVNode(unref(Link), {
                                href: _ctx.route("cart.index"),
                                class: "block mt-2"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_Button, {
                                    label: "View Full Cart",
                                    severity: "primary",
                                    size: "small",
                                    class: "w-full"
                                  })
                                ]),
                                _: 1
                              }, 8, ["href"])
                            ]))
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center" }, [
                      createVNode(_component_Button, {
                        id: "user-menu-btn",
                        severity: "secondary",
                        icon: "pi pi-user",
                        "pt:root:class": "p-0",
                        "pt:icon:class": "text-xl",
                        text: "",
                        "aria-label": "User menu",
                        onMouseenter: showUserPopover,
                        onMouseleave: hideUserPopover,
                        onClick: handleUserClick
                      }),
                      createVNode(unref(Link), {
                        href: _ctx.route("cart.index"),
                        class: "ml-4",
                        onMouseenter: showCartPopover,
                        onMouseleave: hideCartPopover,
                        "aria-haspopup": "true",
                        "aria-controls": "cart-popover-content"
                      }, {
                        default: withCtx(() => [
                          cartCount.value > 0 ? (openBlock(), createBlock(_component_OverlayBadge, {
                            key: 0,
                            value: String(cartCount.value)
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_Button, {
                                id: "cart-menu-btn",
                                severity: "secondary",
                                icon: "pi pi-shopping-cart",
                                "pt:root:class": "p-0",
                                "pt:icon:class": "text-xl",
                                text: "",
                                "aria-label": "Cart menu"
                              })
                            ]),
                            _: 1
                          }, 8, ["value"])) : (openBlock(), createBlock(_component_Button, {
                            key: 1,
                            id: "cart-menu-btn",
                            severity: "secondary",
                            icon: "pi pi-shopping-cart",
                            "pt:root:class": "p-0",
                            "pt:icon:class": "text-xl",
                            text: "",
                            "aria-label": "Cart menu"
                          }))
                        ]),
                        _: 1
                      }, 8, ["href"]),
                      createVNode(unref(Popover), {
                        ref_key: "op",
                        ref: op,
                        target: "#user-menu-btn",
                        showCloseIcon: false,
                        onMouseenter: clearUserHideTimer,
                        onMouseleave: hideUserPopover
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "p-2 w-48" }, [
                            createVNode(LinksPanelMenu, {
                              model: userMenuItems,
                              class: "border-none"
                            })
                          ])
                        ]),
                        _: 1
                      }, 512),
                      createVNode(unref(Popover), {
                        ref_key: "cartOp",
                        ref: cartOp,
                        id: "cart-popover-content",
                        target: "#cart-menu-btn",
                        onMouseenter: clearCartHideTimer,
                        onMouseleave: hideCartPopover
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "p-4 w-[300px] max-h-[400px] overflow-y-auto" }, [
                            createVNode("h4", { class: "font-semibold mb-3" }, "Shopping Cart"),
                            isCartEmpty.value ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-center text-muted-color"
                            }, " Your cart is empty. ")) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "flex flex-col gap-3"
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(cartItemsPreview.value, (item) => {
                                var _a, _b;
                                return openBlock(), createBlock("div", {
                                  key: item.id,
                                  class: "flex items-center gap-2 border-b pb-2 dynamic-border last:border-b-0"
                                }, [
                                  createVNode(unref(Link), {
                                    href: _ctx.route("artwork.details", { id: item.artwork_id, slug: (_a = item.artwork_data) == null ? void 0 : _a.slug }),
                                    class: "flex-shrink-0"
                                  }, {
                                    default: withCtx(() => {
                                      var _a2;
                                      return [
                                        ((_a2 = item.artwork_data) == null ? void 0 : _a2.img_thumb) ? (openBlock(), createBlock("img", {
                                          key: 0,
                                          src: item.artwork_data.img_thumb,
                                          alt: item.artwork_data.title,
                                          class: "w-12 h-12 object-cover rounded hover:opacity-80 transition-opacity"
                                        }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                          key: 1,
                                          class: "w-12 h-12 bg-surface-100 rounded flex items-center justify-center text-muted-color text-xs flex-shrink-0"
                                        }, " No Img "))
                                      ];
                                    }),
                                    _: 2
                                  }, 1032, ["href"]),
                                  createVNode("div", { class: "flex-grow min-w-0" }, [
                                    createVNode(unref(Link), {
                                      class: "font-medium text-sm truncate hover:text-primary hover:underline transition-colors no-underline text-inherit",
                                      href: _ctx.route("artwork.details", { id: item.artwork_id, slug: (_b = item.artwork_data) == null ? void 0 : _b.slug })
                                    }, {
                                      default: withCtx(() => {
                                        var _a2;
                                        return [
                                          createVNode("p", null, toDisplayString(((_a2 = item.artwork_data) == null ? void 0 : _a2.title) || "Untitled"), 1)
                                        ];
                                      }),
                                      _: 2
                                    }, 1032, ["href"]),
                                    createVNode("p", { class: "text-sm text-muted-color" }, "Type: " + toDisplayString(item.type), 1),
                                    createVNode("p", { class: "text-sm text-muted-color" }, "Print: " + toDisplayString(item.print_type === "oil" ? "Oil Print" : "Mono Print"), 1),
                                    createVNode("p", { class: "text-sm text-muted-color" }, "Frame: " + toDisplayString(item.frame), 1),
                                    createVNode("p", { class: "text-sm text-muted-color" }, "Size: " + toDisplayString(item.size), 1),
                                    createVNode("p", { class: "text-sm text-muted-color" }, toDisplayString(item.quantity) + " x €" + toDisplayString(item.formattedPrice), 1)
                                  ]),
                                  createVNode(_component_Button, {
                                    icon: "pi pi-times-circle",
                                    text: "",
                                    rounded: "",
                                    "aria-label": "Delete item",
                                    onClick: ($event) => handleDeleteItem(item.id)
                                  }, null, 8, ["onClick"])
                                ]);
                              }), 128)),
                              !isCartEmpty.value ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "mt-3 pt-2 dynamic-border"
                              }, [
                                createVNode("p", { class: "text-sm font-semibold flex justify-between" }, [
                                  createVNode("span", null, "Subtotal:"),
                                  createVNode("span", null, "€" + toDisplayString(cartSubtotal.value), 1)
                                ])
                              ])) : createCommentVNode("", true),
                              createVNode(unref(Link), {
                                href: _ctx.route("cart.index"),
                                class: "block mt-2"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_Button, {
                                    label: "View Full Cart",
                                    severity: "primary",
                                    size: "small",
                                    class: "w-full"
                                  })
                                ]),
                                _: 1
                              }, 8, ["href"])
                            ]))
                          ])
                        ]),
                        _: 1
                      }, 512)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              (openBlock(), createBlock(_sfc_main$3, {
                model: mainMenuItems.value,
                key: currentRoute.value,
                "pt:root:class": "px-0 py-4 border-0 rounded-none dynamic-bg",
                "pt:button:class": "hidden"
              }, {
                start: withCtx(() => [
                  createVNode("div", { class: "flex items-center lg:hidden" }, [
                    createVNode("div", { class: "relative" }, [
                      createVNode(_component_Button, {
                        severity: "secondary",
                        icon: "pi pi-bars",
                        "pt:icon:class": "text-xl",
                        text: "",
                        onClick: ($event) => mobileMenuOpen.value = true
                      }, null, 8, ["onClick"])
                    ])
                  ]),
                  createVNode("div", { class: "shrink-0 flex items-center mr-5" }, [
                    createVNode(unref(Link), {
                      href: _ctx.route("welcome")
                    }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$6, { class: "block transition-transform duration-200 h-8 w-auto sm:h-10 md:h-12 lg:h-14" })
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ])
                ]),
                end: withCtx(() => [
                  createVNode("div", { class: "flex items-center" }, [
                    createVNode(_component_Button, {
                      id: "user-menu-btn",
                      severity: "secondary",
                      icon: "pi pi-user",
                      "pt:root:class": "p-0",
                      "pt:icon:class": "text-xl",
                      text: "",
                      "aria-label": "User menu",
                      onMouseenter: showUserPopover,
                      onMouseleave: hideUserPopover,
                      onClick: handleUserClick
                    }),
                    createVNode(unref(Link), {
                      href: _ctx.route("cart.index"),
                      class: "ml-4",
                      onMouseenter: showCartPopover,
                      onMouseleave: hideCartPopover,
                      "aria-haspopup": "true",
                      "aria-controls": "cart-popover-content"
                    }, {
                      default: withCtx(() => [
                        cartCount.value > 0 ? (openBlock(), createBlock(_component_OverlayBadge, {
                          key: 0,
                          value: String(cartCount.value)
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_Button, {
                              id: "cart-menu-btn",
                              severity: "secondary",
                              icon: "pi pi-shopping-cart",
                              "pt:root:class": "p-0",
                              "pt:icon:class": "text-xl",
                              text: "",
                              "aria-label": "Cart menu"
                            })
                          ]),
                          _: 1
                        }, 8, ["value"])) : (openBlock(), createBlock(_component_Button, {
                          key: 1,
                          id: "cart-menu-btn",
                          severity: "secondary",
                          icon: "pi pi-shopping-cart",
                          "pt:root:class": "p-0",
                          "pt:icon:class": "text-xl",
                          text: "",
                          "aria-label": "Cart menu"
                        }))
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createVNode(unref(Popover), {
                      ref_key: "op",
                      ref: op,
                      target: "#user-menu-btn",
                      showCloseIcon: false,
                      onMouseenter: clearUserHideTimer,
                      onMouseleave: hideUserPopover
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "p-2 w-48" }, [
                          createVNode(LinksPanelMenu, {
                            model: userMenuItems,
                            class: "border-none"
                          })
                        ])
                      ]),
                      _: 1
                    }, 512),
                    createVNode(unref(Popover), {
                      ref_key: "cartOp",
                      ref: cartOp,
                      id: "cart-popover-content",
                      target: "#cart-menu-btn",
                      onMouseenter: clearCartHideTimer,
                      onMouseleave: hideCartPopover
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "p-4 w-[300px] max-h-[400px] overflow-y-auto" }, [
                          createVNode("h4", { class: "font-semibold mb-3" }, "Shopping Cart"),
                          isCartEmpty.value ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "text-center text-muted-color"
                          }, " Your cart is empty. ")) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "flex flex-col gap-3"
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(cartItemsPreview.value, (item) => {
                              var _a, _b;
                              return openBlock(), createBlock("div", {
                                key: item.id,
                                class: "flex items-center gap-2 border-b pb-2 dynamic-border last:border-b-0"
                              }, [
                                createVNode(unref(Link), {
                                  href: _ctx.route("artwork.details", { id: item.artwork_id, slug: (_a = item.artwork_data) == null ? void 0 : _a.slug }),
                                  class: "flex-shrink-0"
                                }, {
                                  default: withCtx(() => {
                                    var _a2;
                                    return [
                                      ((_a2 = item.artwork_data) == null ? void 0 : _a2.img_thumb) ? (openBlock(), createBlock("img", {
                                        key: 0,
                                        src: item.artwork_data.img_thumb,
                                        alt: item.artwork_data.title,
                                        class: "w-12 h-12 object-cover rounded hover:opacity-80 transition-opacity"
                                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                        key: 1,
                                        class: "w-12 h-12 bg-surface-100 rounded flex items-center justify-center text-muted-color text-xs flex-shrink-0"
                                      }, " No Img "))
                                    ];
                                  }),
                                  _: 2
                                }, 1032, ["href"]),
                                createVNode("div", { class: "flex-grow min-w-0" }, [
                                  createVNode(unref(Link), {
                                    class: "font-medium text-sm truncate hover:text-primary hover:underline transition-colors no-underline text-inherit",
                                    href: _ctx.route("artwork.details", { id: item.artwork_id, slug: (_b = item.artwork_data) == null ? void 0 : _b.slug })
                                  }, {
                                    default: withCtx(() => {
                                      var _a2;
                                      return [
                                        createVNode("p", null, toDisplayString(((_a2 = item.artwork_data) == null ? void 0 : _a2.title) || "Untitled"), 1)
                                      ];
                                    }),
                                    _: 2
                                  }, 1032, ["href"]),
                                  createVNode("p", { class: "text-sm text-muted-color" }, "Type: " + toDisplayString(item.type), 1),
                                  createVNode("p", { class: "text-sm text-muted-color" }, "Print: " + toDisplayString(item.print_type === "oil" ? "Oil Print" : "Mono Print"), 1),
                                  createVNode("p", { class: "text-sm text-muted-color" }, "Frame: " + toDisplayString(item.frame), 1),
                                  createVNode("p", { class: "text-sm text-muted-color" }, "Size: " + toDisplayString(item.size), 1),
                                  createVNode("p", { class: "text-sm text-muted-color" }, toDisplayString(item.quantity) + " x €" + toDisplayString(item.formattedPrice), 1)
                                ]),
                                createVNode(_component_Button, {
                                  icon: "pi pi-times-circle",
                                  text: "",
                                  rounded: "",
                                  "aria-label": "Delete item",
                                  onClick: ($event) => handleDeleteItem(item.id)
                                }, null, 8, ["onClick"])
                              ]);
                            }), 128)),
                            !isCartEmpty.value ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "mt-3 pt-2 dynamic-border"
                            }, [
                              createVNode("p", { class: "text-sm font-semibold flex justify-between" }, [
                                createVNode("span", null, "Subtotal:"),
                                createVNode("span", null, "€" + toDisplayString(cartSubtotal.value), 1)
                              ])
                            ])) : createCommentVNode("", true),
                            createVNode(unref(Link), {
                              href: _ctx.route("cart.index"),
                              class: "block mt-2"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_Button, {
                                  label: "View Full Cart",
                                  severity: "primary",
                                  size: "small",
                                  class: "w-full"
                                })
                              ]),
                              _: 1
                            }, 8, ["href"])
                          ]))
                        ])
                      ]),
                      _: 1
                    }, 512)
                  ])
                ]),
                _: 1
              }, 8, ["model"]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav><div class="h-[80px]" data-v-0424f39f></div>`);
      _push(ssrRenderComponent(_component_Drawer, {
        visible: mobileMenuOpen.value,
        "onUpdate:visible": ($event) => mobileMenuOpen.value = $event,
        position: "left"
      }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="font-bold text-xl" data-v-0424f39f${_scopeId}>Menu</h3>`);
          } else {
            return [
              createVNode("h3", { class: "font-bold text-xl" }, "Menu")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-5" data-v-0424f39f${_scopeId}><div class="flex flex-col gap-2" data-v-0424f39f${_scopeId}>`);
            _push2(ssrRenderComponent(LinksPanelMenu, {
              model: homeMobileMenuItems.value,
              class: "w-full"
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-5" }, [
                createVNode("div", { class: "flex flex-col gap-2" }, [
                  createVNode(LinksPanelMenu, {
                    model: homeMobileMenuItems.value,
                    class: "w-full"
                  }, null, 8, ["model"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Toast, { position: "top-center" }, null, _parent));
      _push(`<main data-v-0424f39f>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/HeaderLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const HeaderLayout = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0424f39f"]]);
export {
  HeaderLayout as H
};
