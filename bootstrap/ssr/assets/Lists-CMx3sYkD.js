import { computed, resolveComponent, unref, withCtx, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import Card from "primevue/card";
import { H as HeaderLayout } from "./HeaderLayout-zh2NGVuN.js";
import { _ as _export_sfc } from "../ssr.js";
import "primevue/toast";
import "primevue/drawer";
import "primevue/overlaybadge";
import "primevue/button";
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
const _sfc_main = /* @__PURE__ */ Object.assign({ layout: HeaderLayout }, {
  __name: "Lists",
  __ssrInlineRender: true,
  props: {
    lists: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const decodedLists = computed(() => {
      return props.lists.map((list) => ({
        ...list,
        name: decodeHTMLEntities(list.name)
      }));
    });
    const decodeHTMLEntities = (text) => {
      if (!text) return "";
      const textArea = document.createElement("textarea");
      textArea.innerHTML = text;
      return textArea.value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_InertiaHead = resolveComponent("InertiaHead");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_InertiaHead, { title: "Lists" }, null, _parent));
      _push(`<div class="layout-container" data-v-8ecdaad8><div class="main-content" data-v-8ecdaad8><div class="content-wrapper" data-v-8ecdaad8><h1 class="text-3xl font-bold mb-8 text-center" data-v-8ecdaad8>Lists</h1><div class="collections-grid" data-v-8ecdaad8><!--[-->`);
      ssrRenderList(decodedLists.value, (list) => {
        _push(ssrRenderComponent(unref(Card), {
          key: list.list_id,
          class: "collection-card p-0"
        }, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("lists.show", { slug: list.slug }),
                class: "text-lg font-semibold hover:text-primary-500 text-center block"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="collection-image-wrapper" data-v-8ecdaad8${_scopeId2}><img${ssrRenderAttr("src", list.cover)}${ssrRenderAttr("alt", list.name)} class="collection-image" data-v-8ecdaad8${_scopeId2}></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "collection-image-wrapper" }, [
                        createVNode("img", {
                          src: list.cover,
                          alt: list.name,
                          class: "collection-image"
                        }, null, 8, ["src", "alt"])
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Link), {
                  href: _ctx.route("lists.show", { slug: list.slug }),
                  class: "text-lg font-semibold hover:text-primary-500 text-center block"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "collection-image-wrapper" }, [
                      createVNode("img", {
                        src: list.cover,
                        alt: list.name,
                        class: "collection-image"
                      }, null, 8, ["src", "alt"])
                    ])
                  ]),
                  _: 2
                }, 1032, ["href"])
              ];
            }
          }),
          title: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h3 class="text-center" data-v-8ecdaad8${_scopeId}>${ssrInterpolate(list.name)}</h3>`);
            } else {
              return [
                createVNode("h3", { class: "text-center" }, toDisplayString(list.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Lists.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Lists = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8ecdaad8"]]);
export {
  Lists as default
};
