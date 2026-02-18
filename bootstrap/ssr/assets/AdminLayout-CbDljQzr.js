import { computed, mergeProps, unref, withCtx, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, useSSRContext, ref, watch, nextTick } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
import PanelMenu from "primevue/panelmenu";
import { _ as _sfc_main$2 } from "./ApplicationLogo-rkFqmqnV.js";
import { _ as _export_sfc } from "../ssr.js";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import __unplugin_components_2 from "primevue/drawer";
const _sfc_main$1 = {
  __name: "AdminSidebar",
  __ssrInlineRender: true,
  emits: ["navigate"],
  setup(__props, { emit: __emit }) {
    const page = usePage();
    const emit = __emit;
    const currentRoute = computed(() => {
      var _a;
      return (_a = page.props.ziggy) == null ? void 0 : _a.current_route_name;
    });
    const adminMenuItems = computed(() => [
      {
        label: "Overview",
        icon: "pi pi-fw pi-home",
        route: route("dashboard.index"),
        active: currentRoute.value === "dashboard.index"
      },
      {
        label: "Orders",
        icon: "pi pi-fw pi-shopping-cart",
        route: route("dashboard.orders.index"),
        active: currentRoute.value && currentRoute.value.startsWith("dashboard.orders")
      },
      {
        // Add this for Users
        label: "Users",
        icon: "pi pi-fw pi-users",
        route: route("dashboard.users.index"),
        active: currentRoute.value && currentRoute.value.startsWith("dashboard.users")
      },
      {
        label: "Coupons",
        icon: "pi pi-fw pi-tags",
        route: route("dashboard.coupons.index"),
        active: currentRoute.value && currentRoute.value.startsWith("dashboard.coupons")
      },
      {
        label: "Settings",
        icon: "pi pi-fw pi-cog",
        route: route("dashboard.settings.index"),
        active: currentRoute.value && currentRoute.value.startsWith("dashboard.settings")
      },
      // {
      //     label: 'Management',
      //     icon: 'pi pi-fw pi-cog',
      //     expanded: currentRoute.value?.startsWith('dashboard.orders') || currentRoute.value?.startsWith('dashboard.users'), // Example expansion logic
      //     items: [
      //         {
      //             label: 'Orders',
      //             icon: 'pi pi-fw pi-shopping-cart',
      //             route: route('dashboard.orders.index'),
      //             active: currentRoute.value && currentRoute.value.startsWith('dashboard.orders')
      //         },
      //         // {
      //         //     label: 'Users',
      //         //     icon: 'pi pi-fw pi-users',
      //         //     route: route('dashboard.users.index'), // Example
      //         //     active: currentRoute.value === 'dashboard.users.index'
      //         // }
      //     ]
      // },
      {
        separator: true
      },
      {
        label: "Back to Site",
        icon: "pi pi-fw pi-arrow-left",
        route: route("welcome")
      }
    ]);
    const handleNavigation = () => {
      emit("navigate");
    };
    const panelMenuItems = computed(() => {
      const mapItems = (items) => {
        return items.map((item) => {
          const newItem = { ...item };
          if (item.route) ;
          if (item.items) {
            newItem.items = mapItems(item.items);
          }
          return newItem;
        });
      };
      return mapItems(adminMenuItems.value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-sidebar p-4 h-full bg-surface-100 dark:bg-surface-800 flex flex-col shadow-lg" }, _attrs))} data-v-a8ff7421><div class="mb-6 text-center" data-v-a8ff7421>`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("dashboard.index"),
        onClick: handleNavigation,
        class: "no-underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, { class: "h-10 sm:h-12 mx-auto" }, null, _parent2, _scopeId));
            _push2(`<h1 class="text-lg sm:text-xl font-semibold mt-2 text-primary-500 dark:text-primary-400" data-v-a8ff7421${_scopeId}>Admin Panel </h1>`);
          } else {
            return [
              createVNode(_sfc_main$2, { class: "h-10 sm:h-12 mx-auto" }),
              createVNode("h1", { class: "text-lg sm:text-xl font-semibold mt-2 text-primary-500 dark:text-primary-400" }, "Admin Panel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(PanelMenu), {
        model: panelMenuItems.value,
        class: "w-full"
      }, {
        item: withCtx(({ item }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (item.route) {
              _push2(ssrRenderComponent(unref(Link), {
                href: item.route,
                onClick: handleNavigation,
                class: ["p-menuitem-link flex items-center p-2 my-1 rounded-md transition-colors duration-150 text-sm sm:text-base", { "bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-700 dark:hover:bg-primary-600": item.active, "text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700": !item.active }]
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="${ssrRenderClass([item.icon, "mr-2 text-base sm:text-lg"])}" data-v-a8ff7421${_scopeId2}></span><span data-v-a8ff7421${_scopeId2}>${ssrInterpolate(item.label)}</span>`);
                  } else {
                    return [
                      createVNode("span", {
                        class: [item.icon, "mr-2 text-base sm:text-lg"]
                      }, null, 2),
                      createVNode("span", null, toDisplayString(item.label), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else if (!item.separator && item.items) {
              _push2(`<a tabindex="0" class="${ssrRenderClass([{ "bg-surface-200 dark:bg-surface-700 font-semibold": item.expanded }, "p-menuitem-link flex items-center p-2 my-1 rounded-md transition-colors duration-150 text-sm sm:text-base text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700"])}" data-v-a8ff7421${_scopeId}>`);
              if (item.icon) {
                _push2(`<span class="${ssrRenderClass([item.icon, "mr-2 text-base sm:text-lg"])}" data-v-a8ff7421${_scopeId}></span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span data-v-a8ff7421${_scopeId}>${ssrInterpolate(item.label)}</span>`);
              if (item.items) {
                _push2(`<span class="${ssrRenderClass([{ "pi-angle-up": item.expanded }, "pi pi-angle-down ml-auto text-xs"])}" data-v-a8ff7421${_scopeId}></span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</a>`);
            } else {
              _push2(`<!---->`);
            }
            if (item.separator) {
              _push2(`<div class="my-2 border-t border-surface-300 dark:border-surface-600" data-v-a8ff7421${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              item.route ? (openBlock(), createBlock(unref(Link), {
                key: 0,
                href: item.route,
                onClick: handleNavigation,
                class: ["p-menuitem-link flex items-center p-2 my-1 rounded-md transition-colors duration-150 text-sm sm:text-base", { "bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-700 dark:hover:bg-primary-600": item.active, "text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700": !item.active }]
              }, {
                default: withCtx(() => [
                  createVNode("span", {
                    class: [item.icon, "mr-2 text-base sm:text-lg"]
                  }, null, 2),
                  createVNode("span", null, toDisplayString(item.label), 1)
                ]),
                _: 2
              }, 1032, ["href", "class"])) : !item.separator && item.items ? (openBlock(), createBlock("a", {
                key: 1,
                tabindex: "0",
                class: ["p-menuitem-link flex items-center p-2 my-1 rounded-md transition-colors duration-150 text-sm sm:text-base text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700", { "bg-surface-200 dark:bg-surface-700 font-semibold": item.expanded }]
              }, [
                item.icon ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: [item.icon, "mr-2 text-base sm:text-lg"]
                }, null, 2)) : createCommentVNode("", true),
                createVNode("span", null, toDisplayString(item.label), 1),
                item.items ? (openBlock(), createBlock("span", {
                  key: 1,
                  class: ["pi pi-angle-down ml-auto text-xs", { "pi-angle-up": item.expanded }]
                }, null, 2)) : createCommentVNode("", true)
              ], 2)) : createCommentVNode("", true),
              item.separator ? (openBlock(), createBlock("div", {
                key: 2,
                class: "my-2 border-t border-surface-300 dark:border-surface-600"
              })) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mt-auto text-center p-2 text-xs sm:text-sm text-surface-500 dark:text-surface-400" data-v-a8ff7421><p data-v-a8ff7421>© ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Pinakothiki</p></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/AdminSidebar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AdminSidebar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-a8ff7421"]]);
const _sfc_main = {
  __name: "AdminLayout",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      default: "Dashboard"
    }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const toast = useToast();
    const adminName = computed(() => {
      var _a, _b;
      return ((_b = (_a = page.props.auth) == null ? void 0 : _a.user) == null ? void 0 : _b.name) || "Admin";
    });
    const mobileMenuOpen = ref(false);
    watch(() => page.props.flash, (flashMessages) => {
      if (flashMessages) {
        nextTick(() => {
          try {
            if (flashMessages.success) {
              toast.add({ severity: "success", summary: "Success", detail: flashMessages.success, life: 3e3 });
            }
            if (flashMessages.error) {
              toast.add({ severity: "error", summary: "Error", detail: flashMessages.error, life: 5e3 });
            }
          } catch (error) {
            console.error("Error showing toast in AdminLayout:", error);
          }
        });
      }
    }, { deep: true });
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-8e547023>`);
      _push(ssrRenderComponent(unref(Toast), { position: "top-center" }, null, _parent));
      _push(`<div class="min-h-screen flex bg-surface-50 dark:bg-surface-900" data-v-8e547023>`);
      _push(ssrRenderComponent(AdminSidebar, { class: "w-64 flex-shrink-0 hidden lg:block" }, null, _parent));
      _push(ssrRenderComponent(unref(__unplugin_components_2), {
        visible: mobileMenuOpen.value,
        "onUpdate:visible": ($event) => mobileMenuOpen.value = $event,
        position: "left",
        class: "lg:hidden w-full sm:w-72"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(AdminSidebar, {
              onNavigate: ($event) => mobileMenuOpen.value = false
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(AdminSidebar, {
                onNavigate: ($event) => mobileMenuOpen.value = false
              }, null, 8, ["onNavigate"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex-1 flex flex-col overflow-hidden" data-v-8e547023><header class="bg-white dark:bg-surface-800 shadow-md" data-v-8e547023><div class="container mx-auto px-4 sm:px-6 lg:px-8" data-v-8e547023><div class="flex justify-between items-center h-16" data-v-8e547023><div class="flex items-center" data-v-8e547023>`);
      _push(ssrRenderComponent(unref(Button), {
        icon: "pi pi-bars",
        class: "lg:hidden mr-3 p-button-text text-surface-600 dark:text-surface-300",
        onClick: toggleMobileMenu,
        "aria-label": "Open menu"
      }, null, _parent));
      _push(`<h2 class="text-xl font-semibold text-surface-800 dark:text-surface-100 hidden lg:block" data-v-8e547023>`);
      ssrRenderSlot(_ctx.$slots, "header-title", {}, () => {
        _push(`${ssrInterpolate(props.title)}`);
      }, _push, _parent);
      _push(`</h2></div><div class="flex items-center" data-v-8e547023><span class="mr-4 text-sm text-surface-600 dark:text-surface-300 hidden sm:inline" data-v-8e547023> Welcome, ${ssrInterpolate(adminName.value)}</span>`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("logout"),
        method: "post",
        as: "button",
        class: "p-button p-button-text p-button-sm text-surface-600 dark:text-surface-300 hover:text-primary-500 dark:hover:text-primary-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="pi pi-sign-out mr-1" data-v-8e547023${_scopeId}></i><span data-v-8e547023${_scopeId}>Logout</span>`);
          } else {
            return [
              createVNode("i", { class: "pi pi-sign-out mr-1" }),
              createVNode("span", null, "Logout")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
      if (_ctx.$slots["header-title"]) {
        _push(`<div class="lg:hidden px-4 pb-2 pt-1 border-t border-surface-200 dark:border-surface-700" data-v-8e547023><h2 class="text-lg font-semibold text-surface-800 dark:text-surface-100 text-center" data-v-8e547023>`);
        ssrRenderSlot(_ctx.$slots, "header-title", {}, () => {
          _push(`Dashboard`);
        }, _push, _parent);
        _push(`</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><main class="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8" data-v-8e547023>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/AdminLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AdminLayout = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8e547023"]]);
export {
  AdminLayout as A
};
