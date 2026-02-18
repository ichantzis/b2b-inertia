import { ref, computed, unref, withCtx, createVNode, toDisplayString, createBlock, openBlock, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { Head, Link, router } from "@inertiajs/vue3";
import { H as HeaderLayout } from "./HeaderLayout-zh2NGVuN.js";
import Card from "primevue/card";
import Button from "primevue/button";
import TabMenu from "primevue/tabmenu";
import { _ as _export_sfc } from "../ssr.js";
import "primevue/toast";
import "primevue/drawer";
import "primevue/overlaybadge";
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
  __name: "Overview",
  __ssrInlineRender: true,
  props: {
    activeTab: {
      type: String,
      default: "overview"
    },
    rows: {
      type: Array,
      default: () => []
    },
    gridItems: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    const items = ref([
      { label: "Overview", id: "overview", route: "artists.overview" },
      { label: "Illustrators", id: "illustrators", route: "artists.illustrators" },
      { label: "Photographers", id: "photographers", route: "artists.photographers" },
      { label: "By Country", id: "by-country", route: "artists.by_country" }
    ]);
    const activeIndex = computed(() => {
      return items.value.findIndex((item) => item.id === props.activeTab);
    });
    const onTabChange = (e) => {
      const item = items.value[e.index];
      if (item && item.route) {
        router.visit(route(item.route));
      }
    };
    const decodeHTMLEntities = (text) => {
      if (typeof text !== "string") return "";
      const textArea = document.createElement("textarea");
      textArea.innerHTML = text;
      return textArea.value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Artists" }, null, _parent));
      _push(`<div class="page-container" data-v-e929ac69><div class="main-content-area" data-v-e929ac69><div class="content-wrapper" data-v-e929ac69><h1 class="text-3xl font-bold mb-10 text-center text-gray-900" data-v-e929ac69>Artists</h1><div class="mb-12" data-v-e929ac69>`);
      _push(ssrRenderComponent(unref(TabMenu), {
        model: items.value,
        activeIndex: activeIndex.value,
        onTabChange,
        class: "flex justify-center"
      }, null, _parent));
      _push(`</div>`);
      if (__props.rows.length > 0) {
        _push(`<div data-v-e929ac69><!--[-->`);
        ssrRenderList(__props.rows, (row, index) => {
          _push(`<div class="mb-12" data-v-e929ac69><div class="flex justify-between items-end mb-4 px-1" data-v-e929ac69><h2 class="text-xl font-bold text-gray-800" data-v-e929ac69>${ssrInterpolate(row.title)}</h2></div><div class="horizontal-scroll-wrapper" data-v-e929ac69><div class="artists-row" data-v-e929ac69><!--[-->`);
          ssrRenderList(row.items, (artist) => {
            _push(`<div class="artist-item-wrapper" data-v-e929ac69>`);
            _push(ssrRenderComponent(unref(Link), {
              href: _ctx.route("artist.show", { artist_slug: artist.username }),
              class: "block link-wrapper"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(Card), { class: "artist-card p-0" }, {
                    header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div class="card-image-container" data-v-e929ac69${_scopeId2}><div class="image-wrapper" data-v-e929ac69${_scopeId2}>`);
                        if (artist.profile_picture) {
                          _push3(`<img${ssrRenderAttr("src", artist.profile_picture)}${ssrRenderAttr("alt", artist.name)} class="artist-image" loading="lazy" data-v-e929ac69${_scopeId2}>`);
                        } else {
                          _push3(`<div class="image-placeholder" data-v-e929ac69${_scopeId2}><i class="pi pi-user text-3xl" data-v-e929ac69${_scopeId2}></i></div>`);
                        }
                        _push3(`</div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "card-image-container" }, [
                            createVNode("div", { class: "image-wrapper" }, [
                              artist.profile_picture ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: artist.profile_picture,
                                alt: artist.name,
                                class: "artist-image",
                                loading: "lazy"
                              }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "image-placeholder"
                              }, [
                                createVNode("i", { class: "pi pi-user text-3xl" })
                              ]))
                            ])
                          ])
                        ];
                      }
                    }),
                    title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<h3 class="name-heading text-sm font-semibold text-center mt-3 mb-1 px-1" data-v-e929ac69${_scopeId2}>${ssrInterpolate(decodeHTMLEntities(artist.name))}</h3>`);
                      } else {
                        return [
                          createVNode("h3", { class: "name-heading text-sm font-semibold text-center mt-3 mb-1 px-1" }, toDisplayString(decodeHTMLEntities(artist.name)), 1)
                        ];
                      }
                    }),
                    content: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div class="text-center pb-3" data-v-e929ac69${_scopeId2}><p class="text-xs text-gray-500 truncate w-full px-1" data-v-e929ac69${_scopeId2}>${ssrInterpolate(artist.artist_type)}</p><p class="text-xs text-gray-400 mt-0.5" data-v-e929ac69${_scopeId2}>${ssrInterpolate(artist.artwork_count)} Artworks </p></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-center pb-3" }, [
                            createVNode("p", { class: "text-xs text-gray-500 truncate w-full px-1" }, toDisplayString(artist.artist_type), 1),
                            createVNode("p", { class: "text-xs text-gray-400 mt-0.5" }, toDisplayString(artist.artwork_count) + " Artworks ", 1)
                          ])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(unref(Card), { class: "artist-card p-0" }, {
                      header: withCtx(() => [
                        createVNode("div", { class: "card-image-container" }, [
                          createVNode("div", { class: "image-wrapper" }, [
                            artist.profile_picture ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: artist.profile_picture,
                              alt: artist.name,
                              class: "artist-image",
                              loading: "lazy"
                            }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "image-placeholder"
                            }, [
                              createVNode("i", { class: "pi pi-user text-3xl" })
                            ]))
                          ])
                        ])
                      ]),
                      title: withCtx(() => [
                        createVNode("h3", { class: "name-heading text-sm font-semibold text-center mt-3 mb-1 px-1" }, toDisplayString(decodeHTMLEntities(artist.name)), 1)
                      ]),
                      content: withCtx(() => [
                        createVNode("div", { class: "text-center pb-3" }, [
                          createVNode("p", { class: "text-xs text-gray-500 truncate w-full px-1" }, toDisplayString(artist.artist_type), 1),
                          createVNode("p", { class: "text-xs text-gray-400 mt-0.5" }, toDisplayString(artist.artwork_count) + " Artworks ", 1)
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
          _push(`<!--]--></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.gridItems.length > 0) {
        _push(`<div class="mt-8 pt-8 border-t border-gray-200" data-v-e929ac69><h2 class="text-xl font-bold text-gray-800 mb-6" data-v-e929ac69>All ${ssrInterpolate(__props.activeTab === "illustrators" ? "Illustrators" : "Photographers")}</h2><div class="artists-grid" data-v-e929ac69><!--[-->`);
        ssrRenderList(__props.gridItems, (artist) => {
          _push(`<div class="artist-grid-item" data-v-e929ac69>`);
          _push(ssrRenderComponent(unref(Link), {
            href: _ctx.route("artist.show", { artist_slug: artist.username }),
            class: "block h-full link-wrapper"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Card), { class: "artist-card h-full p-0 overflow-hidden" }, {
                  header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="card-image-container" data-v-e929ac69${_scopeId2}><div class="image-wrapper" data-v-e929ac69${_scopeId2}>`);
                      if (artist.profile_picture) {
                        _push3(`<img${ssrRenderAttr("src", artist.profile_picture)}${ssrRenderAttr("alt", artist.name)} class="artist-image" loading="lazy" data-v-e929ac69${_scopeId2}>`);
                      } else {
                        _push3(`<div class="image-placeholder" data-v-e929ac69${_scopeId2}><i class="pi pi-user text-3xl" data-v-e929ac69${_scopeId2}></i></div>`);
                      }
                      _push3(`</div></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "card-image-container" }, [
                          createVNode("div", { class: "image-wrapper" }, [
                            artist.profile_picture ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: artist.profile_picture,
                              alt: artist.name,
                              class: "artist-image",
                              loading: "lazy"
                            }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "image-placeholder"
                            }, [
                              createVNode("i", { class: "pi pi-user text-3xl" })
                            ]))
                          ])
                        ])
                      ];
                    }
                  }),
                  title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="name-heading text-sm font-semibold text-center mt-3 mb-1 px-1" data-v-e929ac69${_scopeId2}>${ssrInterpolate(decodeHTMLEntities(artist.name))}</div>`);
                    } else {
                      return [
                        createVNode("div", { class: "name-heading text-sm font-semibold text-center mt-3 mb-1 px-1" }, toDisplayString(decodeHTMLEntities(artist.name)), 1)
                      ];
                    }
                  }),
                  content: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="text-center pb-3" data-v-e929ac69${_scopeId2}><p class="text-xs text-gray-500 truncate w-full px-1" data-v-e929ac69${_scopeId2}>${ssrInterpolate(artist.artist_type)}</p><div class="text-xs text-gray-400 mt-0.5" data-v-e929ac69${_scopeId2}>${ssrInterpolate(artist.artworks)} artworks </div></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "text-center pb-3" }, [
                          createVNode("p", { class: "text-xs text-gray-500 truncate w-full px-1" }, toDisplayString(artist.artist_type), 1),
                          createVNode("div", { class: "text-xs text-gray-400 mt-0.5" }, toDisplayString(artist.artworks) + " artworks ", 1)
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(unref(Card), { class: "artist-card h-full p-0 overflow-hidden" }, {
                    header: withCtx(() => [
                      createVNode("div", { class: "card-image-container" }, [
                        createVNode("div", { class: "image-wrapper" }, [
                          artist.profile_picture ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: artist.profile_picture,
                            alt: artist.name,
                            class: "artist-image",
                            loading: "lazy"
                          }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "image-placeholder"
                          }, [
                            createVNode("i", { class: "pi pi-user text-3xl" })
                          ]))
                        ])
                      ])
                    ]),
                    title: withCtx(() => [
                      createVNode("div", { class: "name-heading text-sm font-semibold text-center mt-3 mb-1 px-1" }, toDisplayString(decodeHTMLEntities(artist.name)), 1)
                    ]),
                    content: withCtx(() => [
                      createVNode("div", { class: "text-center pb-3" }, [
                        createVNode("p", { class: "text-xs text-gray-500 truncate w-full px-1" }, toDisplayString(artist.artist_type), 1),
                        createVNode("div", { class: "text-xs text-gray-400 mt-0.5" }, toDisplayString(artist.artworks) + " artworks ", 1)
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
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.activeTab === "overview") {
        _push(`<div class="text-center mt-12 mb-8" data-v-e929ac69>`);
        _push(ssrRenderComponent(unref(Link), {
          href: _ctx.route("artists.all")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Button), {
                label: "See all artists",
                size: "large",
                outlined: "",
                class: "w-full sm:w-auto"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Button), {
                  label: "See all artists",
                  size: "large",
                  outlined: "",
                  class: "w-full sm:w-auto"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.rows.length === 0 && __props.gridItems.length === 0) {
        _push(`<div class="text-center py-20 text-gray-500" data-v-e929ac69> No artists found in this category. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/artists/Overview.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Overview = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e929ac69"]]);
export {
  Overview as default
};
