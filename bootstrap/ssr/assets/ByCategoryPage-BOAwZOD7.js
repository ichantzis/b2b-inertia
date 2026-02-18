import { computed, unref, withCtx, createVNode, toDisplayString, createTextVNode, createBlock, openBlock, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import Card from "primevue/card";
import { H as HeaderLayout } from "./HeaderLayout-zh2NGVuN.js";
import { C as CollectionSidebar } from "./CollectionSidebar-BltflKwh.js";
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
  __name: "ByCategoryPage",
  __ssrInlineRender: true,
  props: {
    categoryName: {
      type: String,
      required: true,
      default: "Category"
    },
    collections: {
      // Array of collection objects passed from the controller
      type: Array,
      required: true,
      default: () => []
    },
    categoryId: {
      // The ID of the current category, might be useful
      type: String
      // required: true // Make optional if not always strictly needed for display
    }
  },
  setup(__props) {
    const props = __props;
    const processedCollections = computed(() => {
      return props.collections.map((collection) => ({
        ...collection
        // name: decodeHTMLEntities(collection.name) // Uncomment if names still need decoding client-side
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: props.categoryName
      }, null, _parent));
      _push(`<div class="page-with-sidebar-layout" data-v-918bfc67>`);
      _push(ssrRenderComponent(CollectionSidebar, { class: "hide" }, null, _parent));
      _push(`<div class="main-content-area" data-v-918bfc67><div class="content-wrapper" data-v-918bfc67><h1 class="text-3xl lg:text-4xl font-bold mb-8 text-center text-gray-800" data-v-918bfc67>${ssrInterpolate(props.categoryName)}</h1>`);
      if (processedCollections.value.length > 0) {
        _push(`<div class="collections-grid-vue" data-v-918bfc67><!--[-->`);
        ssrRenderList(processedCollections.value, (collection) => {
          _push(ssrRenderComponent(unref(Card), {
            key: collection.id,
            class: "collection-card-vue p-0 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
          }, {
            header: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("collection.show", { collection_slug: collection.slug }),
                  class: "block group"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="collection-image-wrapper-vue overflow-hidden" data-v-918bfc67${_scopeId2}>`);
                      if (collection.thumb) {
                        _push3(`<img${ssrRenderAttr("src", collection.thumb)}${ssrRenderAttr("alt", collection.name)} class="collection-image-vue transition-transform duration-500 ease-in-out" loading="lazy" data-v-918bfc67${_scopeId2}>`);
                      } else {
                        _push3(`<div class="collection-image-placeholder-vue" data-v-918bfc67${_scopeId2}><span data-v-918bfc67${_scopeId2}>No Image</span></div>`);
                      }
                      _push3(`</div>`);
                    } else {
                      return [
                        createVNode("div", { class: "collection-image-wrapper-vue overflow-hidden" }, [
                          collection.thumb ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: collection.thumb,
                            alt: collection.name,
                            class: "collection-image-vue transition-transform duration-500 ease-in-out",
                            loading: "lazy"
                          }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "collection-image-placeholder-vue"
                          }, [
                            createVNode("span", null, "No Image")
                          ]))
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(unref(Link), {
                    href: _ctx.route("collection.show", { collection_slug: collection.slug }),
                    class: "block group"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "collection-image-wrapper-vue overflow-hidden" }, [
                        collection.thumb ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: collection.thumb,
                          alt: collection.name,
                          class: "collection-image-vue transition-transform duration-500 ease-in-out",
                          loading: "lazy"
                        }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "collection-image-placeholder-vue"
                        }, [
                          createVNode("span", null, "No Image")
                        ]))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["href"])
                ];
              }
            }),
            title: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("collection.show", { collection_slug: collection.slug }),
                  class: "collection-name-link-vue text-lg font-semibold text-gray-700 hover:text-primary-600 text-center block mt-4 no-underline px-2"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(collection.name)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(collection.name), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(unref(Link), {
                    href: _ctx.route("collection.show", { collection_slug: collection.slug }),
                    class: "collection-name-link-vue text-lg font-semibold text-gray-700 hover:text-primary-600 text-center block mt-4 no-underline px-2"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(collection.name), 1)
                    ]),
                    _: 2
                  }, 1032, ["href"])
                ];
              }
            }),
            content: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="text-center pb-4 px-2" data-v-918bfc67${_scopeId}><p class="text-sm text-gray-500 no-underline" data-v-918bfc67${_scopeId}>${ssrInterpolate(collection.artworks_count)} artworks </p></div>`);
              } else {
                return [
                  createVNode("div", { class: "text-center pb-4 px-2" }, [
                    createVNode("p", { class: "text-sm text-gray-500 no-underline" }, toDisplayString(collection.artworks_count) + " artworks ", 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-12" data-v-918bfc67><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" data-v-918bfc67><path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-918bfc67></path></svg><h3 class="mt-2 text-lg font-medium text-gray-900" data-v-918bfc67>No Collections Found</h3><p class="mt-1 text-sm text-gray-500" data-v-918bfc67> There are currently no collections available in the category &quot;${ssrInterpolate(props.categoryName)}&quot;. </p></div>`);
      }
      _push(`</div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/ByCategoryPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ByCategoryPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-918bfc67"]]);
export {
  ByCategoryPage as default
};
