import { computed, unref, withCtx, createTextVNode, createVNode, toDisplayString, createBlock, openBlock, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr } from "vue/server-renderer";
import { usePage, Head, Link } from "@inertiajs/vue3";
import Card from "primevue/card";
import Divider from "primevue/divider";
import { H as HeaderLayout } from "./HeaderLayout-zh2NGVuN.js";
import { C as CollectionSidebar } from "./CollectionSidebar-BltflKwh.js";
import { s as slugify } from "./utils--JrDKSqM.js";
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
  __name: "Collections",
  __ssrInlineRender: true,
  props: {
    categorized_collections: {
      type: Array,
      default: () => []
    },
    // NEW PROP: Full list for sidebar navigation
    all_categories: {
      type: Array,
      default: () => []
    },
    // NEW PROP: Flag to toggle layout
    is_category_view: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    usePage();
    const decodeHTMLEntities = (text) => {
      if (typeof text !== "string") return "";
      const textArea = document.createElement("textarea");
      textArea.innerHTML = text;
      return textArea.value;
    };
    const decodedCategorizedCollections = computed(() => {
      if (!props.categorized_collections) return [];
      return props.categorized_collections.map((category) => ({
        ...category,
        category_name: decodeHTMLEntities(category.category_name),
        collections: category.collections.map((collection) => ({
          ...collection,
          name: decodeHTMLEntities(collection.name),
          description: decodeHTMLEntities(collection.description)
        }))
      }));
    });
    const sidebarCategories = computed(() => {
      const source = props.all_categories && props.all_categories.length > 0 ? props.all_categories : props.categorized_collections;
      return source.map((category) => ({
        ...category,
        category_name: decodeHTMLEntities(category.category_name),
        // Ensure collections exists for the sidebar logic
        collections: category.collections || []
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Collections" }, null, _parent));
      _push(`<div class="page-with-sidebar-layout" data-v-3e8a702a>`);
      _push(ssrRenderComponent(CollectionSidebar, { categories: sidebarCategories.value }, null, _parent));
      _push(`<div class="main-content-area" data-v-3e8a702a><div class="content-wrapper" data-v-3e8a702a><h1 class="text-3xl font-bold mb-10 text-center" data-v-3e8a702a>${ssrInterpolate(__props.is_category_view && decodedCategorizedCollections.value[0] ? decodedCategorizedCollections.value[0].category_name : "Collections")}</h1>`);
      if (decodedCategorizedCollections.value.length > 0) {
        _push(`<div data-v-3e8a702a><!--[-->`);
        ssrRenderList(decodedCategorizedCollections.value, (category) => {
          _push(`<section class="category-section mb-12" data-v-3e8a702a>`);
          if (!__props.is_category_view) {
            _push(ssrRenderComponent(unref(Link), {
              class: "category-title text-2xl font-semibold mb-5 text-left",
              href: _ctx.route("collections.category.show", { category_collection_slug: unref(slugify)(category.category_name) })
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(category.category_name)} `);
                  _push2(ssrRenderComponent(unref(Divider), null, null, _parent2, _scopeId));
                } else {
                  return [
                    createTextVNode(toDisplayString(category.category_name) + " ", 1),
                    createVNode(unref(Divider))
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="${ssrRenderClass({ "horizontal-scroll-wrapper": !__props.is_category_view, "grid-wrapper": __props.is_category_view })}" data-v-3e8a702a><div class="${ssrRenderClass({ "collections-row": !__props.is_category_view, "collections-grid": __props.is_category_view })}" data-v-3e8a702a><!--[-->`);
          ssrRenderList(category.collections, (collection) => {
            _push(`<div class="collection-item-wrapper" data-v-3e8a702a>`);
            _push(ssrRenderComponent(unref(Link), {
              href: _ctx.route("collection.show", { collection_slug: collection.slug }),
              class: "block collection-link-wrapper"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(Card), { class: "collection-card p-0" }, {
                    header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div class="collection-image-wrapper" data-v-3e8a702a${_scopeId2}>`);
                        if (collection.thumb) {
                          _push3(`<img${ssrRenderAttr("src", collection.thumb)}${ssrRenderAttr("alt", collection.name)} class="collection-image" loading="lazy" data-v-3e8a702a${_scopeId2}>`);
                        } else {
                          _push3(`<div class="collection-image-placeholder" data-v-3e8a702a${_scopeId2}>No Image</div>`);
                        }
                        _push3(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "collection-image-wrapper" }, [
                            collection.thumb ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: collection.thumb,
                              alt: collection.name,
                              class: "collection-image",
                              loading: "lazy"
                            }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "collection-image-placeholder"
                            }, "No Image"))
                          ])
                        ];
                      }
                    }),
                    title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<h3 class="collection-name-heading text-md font-semibold text-center block mt-3 mb-1 px-2" data-v-3e8a702a${_scopeId2}>${ssrInterpolate(collection.name)}</h3>`);
                      } else {
                        return [
                          createVNode("h3", { class: "collection-name-heading text-md font-semibold text-center block mt-3 mb-1 px-2" }, toDisplayString(collection.name), 1)
                        ];
                      }
                    }),
                    content: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div class="text-center pb-3" data-v-3e8a702a${_scopeId2}><p class="text-xs text-surface-600" data-v-3e8a702a${_scopeId2}>${ssrInterpolate(collection.artworks_count)} artworks </p></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-center pb-3" }, [
                            createVNode("p", { class: "text-xs text-surface-600" }, toDisplayString(collection.artworks_count) + " artworks ", 1)
                          ])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(unref(Card), { class: "collection-card p-0" }, {
                      header: withCtx(() => [
                        createVNode("div", { class: "collection-image-wrapper" }, [
                          collection.thumb ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: collection.thumb,
                            alt: collection.name,
                            class: "collection-image",
                            loading: "lazy"
                          }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "collection-image-placeholder"
                          }, "No Image"))
                        ])
                      ]),
                      title: withCtx(() => [
                        createVNode("h3", { class: "collection-name-heading text-md font-semibold text-center block mt-3 mb-1 px-2" }, toDisplayString(collection.name), 1)
                      ]),
                      content: withCtx(() => [
                        createVNode("div", { class: "text-center pb-3" }, [
                          createVNode("p", { class: "text-xs text-surface-600" }, toDisplayString(collection.artworks_count) + " artworks ", 1)
                        ])
                      ]),
                      _: 2
                    }, 1024)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div>`);
          });
          _push(`<!--]--></div></div></section>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-10" data-v-3e8a702a><p class="text-xl text-surface-700" data-v-3e8a702a>No collections found.</p></div>`);
      }
      _push(`</div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Collections.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Collections = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3e8a702a"]]);
export {
  Collections as default
};
