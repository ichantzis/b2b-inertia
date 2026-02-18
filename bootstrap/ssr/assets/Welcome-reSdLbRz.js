import { ref, onMounted, unref, withCtx, createVNode, resolveDynamicComponent, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderVNode, ssrInterpolate, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { H as HeaderLayout } from "./HeaderLayout-zh2NGVuN.js";
import { usePage, Head, Link } from "@inertiajs/vue3";
import Button from "primevue/button";
import DataView from "primevue/dataview";
import Divider from "primevue/divider";
import { s as slugify } from "./utils--JrDKSqM.js";
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
  __name: "Welcome",
  __ssrInlineRender: true,
  props: {
    canLogin: {
      type: Boolean
    },
    canRegister: {
      type: Boolean
    },
    laravelVersion: {
      type: String,
      required: true
    },
    phpVersion: {
      type: String,
      required: true
    },
    curatedLists: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    usePage();
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Pinakothiki",
      "url": "https://b2b.pinakothiki.gr/",
      // Άλλαξε το με το domain σου
      "logo": "https://b2b.pinakothiki.gr/build/assets/PInakothiki-Logo-Header-CDixsy5W.png",
      "sameAs": [
        "https://www.facebook.com/pinakothiki.FineArtPrints",
        "https://www.instagram.com/pinakothiki/"
      ]
    };
    const recentlyViewed = ref([]);
    onMounted(() => {
      const stored = localStorage.getItem("recently_viewed_items");
      if (stored) {
        try {
          recentlyViewed.value = JSON.parse(stored);
          console.log("Recently viewed items loaded:", recentlyViewed.value);
        } catch (e) {
          console.error("Error parsing recently viewed items", e);
        }
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-54bebacf${_scopeId}>Premium Art Prints &amp; Custom Framing | Pinakothiki</title><meta name="description" content="Discover curated art prints and posters from independent artists worldwide. Transform your space with high-quality framed art." data-v-54bebacf${_scopeId}><meta property="og:type" content="website" data-v-54bebacf${_scopeId}><meta property="og:title" content="Premium Art Prints &amp; Custom Framing | Pinakothiki" data-v-54bebacf${_scopeId}><meta property="og:description" content="Discover curated art prints and posters from independent artists worldwide. Transform your space with high-quality framed art." data-v-54bebacf${_scopeId}><meta property="og:image" content="https://b2b.pinakothiki.gr/build/assets/PInakothiki-Logo-Header-CDixsy5W.png" data-v-54bebacf${_scopeId}>`);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent("script"), { type: "application/ld+json" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(JSON.stringify(organizationSchema))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(JSON.stringify(organizationSchema)), 1)
                  ];
                }
              }),
              _: 1
            }), _parent2, _scopeId);
          } else {
            return [
              createVNode("title", null, "Premium Art Prints & Custom Framing | Pinakothiki"),
              createVNode("meta", {
                name: "description",
                content: "Discover curated art prints and posters from independent artists worldwide. Transform your space with high-quality framed art."
              }),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                property: "og:title",
                content: "Premium Art Prints & Custom Framing | Pinakothiki"
              }),
              createVNode("meta", {
                property: "og:description",
                content: "Discover curated art prints and posters from independent artists worldwide. Transform your space with high-quality framed art."
              }),
              createVNode("meta", {
                property: "og:image",
                content: "https://b2b.pinakothiki.gr/build/assets/PInakothiki-Logo-Header-CDixsy5W.png"
              }),
              (openBlock(), createBlock(resolveDynamicComponent("script"), { type: "application/ld+json" }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(JSON.stringify(organizationSchema)), 1)
                ]),
                _: 1
              }))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<section class="hero-section" data-v-54bebacf><div class="hero-content" data-v-54bebacf><h1 class="hero-title" data-v-54bebacf> Welcome to <span class="text-primary" data-v-54bebacf>Pinakothiki</span></h1><p class="hero-subtitle" data-v-54bebacf> Unique artwork curated for B2B partners </p><div class="hero-actions" data-v-54bebacf>`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("collections.index")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Button), {
              label: "Explore Collections",
              icon: "pi pi-images",
              class: "p-button-lg"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Button), {
                label: "Explore Collections",
                icon: "pi pi-images",
                class: "p-button-lg"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section><section class="secondary-banner my-8 px-4" data-v-54bebacf><div class="promo-banner-container relative rounded-xl overflow-hidden shadow-lg" data-v-54bebacf><img src="/images/banner2.webp" alt="Timeless Art" class="w-full object-cover h-[300px]" data-v-54bebacf><div class="absolute inset-0 bg-black/20 flex flex-col justify-center p-8 text-white" data-v-54bebacf></div></div></section><section class="trust-icons-section py-12 bg-gray-50 border-y border-gray-200" data-v-54bebacf><div class="max-w-7xl mx-auto px-4 text-center" data-v-54bebacf><h2 class="text-xl mb-10 text-gray-700 font-medium italic" data-v-54bebacf> Πινακοθήκη – Πίνακες σε καμβά ή poster | Ανακαλύψτε Μοναδική Τέχνη για τον χώρο σας! </h2><div class="grid grid-cols-2 md:grid-cols-4 gap-8" data-v-54bebacf><div class="icon-box" data-v-54bebacf><i class="pi pi-shield text-4xl mb-3 text-primary" data-v-54bebacf></i><p class="font-semibold uppercase text-sm" data-v-54bebacf>Ασφαλείς Πληρωμές</p></div><div class="icon-box" data-v-54bebacf><i class="pi pi-star text-4xl mb-3 text-primary" data-v-54bebacf></i><p class="font-semibold uppercase text-sm" data-v-54bebacf>Ξεχωριστά Χειροποίητο</p></div><div class="icon-box" data-v-54bebacf><i class="pi pi-map-marker text-4xl mb-3 text-primary" data-v-54bebacf></i><p class="font-semibold uppercase text-sm" data-v-54bebacf>Κατασκευάζεται στην Ελλάδα</p></div><div class="icon-box" data-v-54bebacf><i class="pi pi-truck text-4xl mb-3 text-primary" data-v-54bebacf></i><p class="font-semibold uppercase text-sm" data-v-54bebacf>Δωρεάν Μεταφορικά</p></div></div></div></section><section class="curated-section py-12 px-6" data-v-54bebacf><div class="max-w-7xl mx-auto" data-v-54bebacf><h2 class="text-4xl mb-8 text-center tracking-widest" data-v-54bebacf> Curated by Art Collectors </h2><div class="curated-list-container" data-v-54bebacf><!--[-->`);
      ssrRenderList(__props.curatedLists, (list) => {
        _push(`<div class="curated-banner-item" data-v-54bebacf>`);
        _push(ssrRenderComponent(unref(Link), {
          href: _ctx.route("lists.show", { slug: list.slug }),
          class: "curated-banner-link group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="image-wrapper" data-v-54bebacf${_scopeId}><img${ssrRenderAttr("src", list.cover || "/images/placeholder.png")}${ssrRenderAttr("alt", list.name)} class="curated-banner-image" loading="lazy" data-v-54bebacf${_scopeId}></div><div class="curated-banner-overlay" data-v-54bebacf${_scopeId}></div><div class="curated-banner-content" data-v-54bebacf${_scopeId}><h3 class="curated-banner-title" data-v-54bebacf${_scopeId}>${ssrInterpolate(list.name)}</h3><span class="view-text group-hover:translate-x-2 transition-transform duration-300 inline-block" data-v-54bebacf${_scopeId}> View Collection <i class="pi pi-arrow-right text-xs ml-1" data-v-54bebacf${_scopeId}></i></span></div>`);
            } else {
              return [
                createVNode("div", { class: "image-wrapper" }, [
                  createVNode("img", {
                    src: list.cover || "/images/placeholder.png",
                    alt: list.name,
                    class: "curated-banner-image",
                    loading: "lazy"
                  }, null, 8, ["src", "alt"])
                ]),
                createVNode("div", { class: "curated-banner-overlay" }),
                createVNode("div", { class: "curated-banner-content" }, [
                  createVNode("h3", { class: "curated-banner-title" }, toDisplayString(list.name), 1),
                  createVNode("span", { class: "view-text group-hover:translate-x-2 transition-transform duration-300 inline-block" }, [
                    createTextVNode(" View Collection "),
                    createVNode("i", { class: "pi pi-arrow-right text-xs ml-1" })
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></section>`);
      if (recentlyViewed.value.length > 0) {
        _push(`<section class="recent-section" data-v-54bebacf><div class="max-w-7xl mx-auto px-4" data-v-54bebacf><h2 class="section-title" data-v-54bebacf>Recently Viewed Items</h2>`);
        _push(ssrRenderComponent(unref(DataView), {
          value: recentlyViewed.value,
          layout: "grid"
        }, {
          grid: withCtx((slotProps, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-12 gap-4 md:gap-8" data-v-54bebacf${_scopeId}><!--[-->`);
              ssrRenderList(slotProps.items, (item, index) => {
                var _a;
                _push2(`<div class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 p-2" data-v-54bebacf${_scopeId}><div class="rounded flex flex-col artwork-container" data-v-54bebacf${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("artwork.details", {
                    id: item.pictufy_id,
                    slug: unref(slugify)(typeof item.title === "string" ? item.title : ((_a = item.title) == null ? void 0 : _a.en) || "artwork")
                  }),
                  class: "artwork-link"
                }, {
                  default: withCtx((_, _push3, _parent3, _scopeId2) => {
                    var _a2, _b, _c, _d;
                    if (_push3) {
                      _push3(`<div class="relative" data-v-54bebacf${_scopeId2}><img${ssrRenderAttr("src", item.image || item.thumb || "/images/placeholder.png")}${ssrRenderAttr("alt", typeof item.title === "string" ? item.title : ((_a2 = item.title) == null ? void 0 : _a2.en) || "Untitled")} class="rounded w-full h-auto object-contain max-h-[300px]" data-v-54bebacf${_scopeId2}><div class="artwork-overlay" data-v-54bebacf${_scopeId2}><div class="overlay-content" data-v-54bebacf${_scopeId2}><span class="artwork-title" data-v-54bebacf${_scopeId2}>${ssrInterpolate(typeof item.title === "string" ? item.title : ((_b = item.title) == null ? void 0 : _b.en) || "Untitled")}</span>`);
                      _push3(ssrRenderComponent(unref(Divider), { layout: "vertical" }, null, _parent3, _scopeId2));
                      _push3(`<span class="artwork-id" data-v-54bebacf${_scopeId2}>ID: ${ssrInterpolate(item.pictufy_id || item.artwork_id)}</span></div></div></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "relative" }, [
                          createVNode("img", {
                            src: item.image || item.thumb || "/images/placeholder.png",
                            alt: typeof item.title === "string" ? item.title : ((_c = item.title) == null ? void 0 : _c.en) || "Untitled",
                            class: "rounded w-full h-auto object-contain max-h-[300px]"
                          }, null, 8, ["src", "alt"]),
                          createVNode("div", { class: "artwork-overlay" }, [
                            createVNode("div", { class: "overlay-content" }, [
                              createVNode("span", { class: "artwork-title" }, toDisplayString(typeof item.title === "string" ? item.title : ((_d = item.title) == null ? void 0 : _d.en) || "Untitled"), 1),
                              createVNode(unref(Divider), { layout: "vertical" }),
                              createVNode("span", { class: "artwork-id" }, "ID: " + toDisplayString(item.pictufy_id || item.artwork_id), 1)
                            ])
                          ])
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-12 gap-4 md:gap-8" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(slotProps.items, (item, index) => {
                    var _a;
                    return openBlock(), createBlock("div", {
                      key: item.pictufy_id || index,
                      class: "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 p-2"
                    }, [
                      createVNode("div", { class: "rounded flex flex-col artwork-container" }, [
                        createVNode(unref(Link), {
                          href: _ctx.route("artwork.details", {
                            id: item.pictufy_id,
                            slug: unref(slugify)(typeof item.title === "string" ? item.title : ((_a = item.title) == null ? void 0 : _a.en) || "artwork")
                          }),
                          class: "artwork-link"
                        }, {
                          default: withCtx(() => {
                            var _a2, _b;
                            return [
                              createVNode("div", { class: "relative" }, [
                                createVNode("img", {
                                  src: item.image || item.thumb || "/images/placeholder.png",
                                  alt: typeof item.title === "string" ? item.title : ((_a2 = item.title) == null ? void 0 : _a2.en) || "Untitled",
                                  class: "rounded w-full h-auto object-contain max-h-[300px]"
                                }, null, 8, ["src", "alt"]),
                                createVNode("div", { class: "artwork-overlay" }, [
                                  createVNode("div", { class: "overlay-content" }, [
                                    createVNode("span", { class: "artwork-title" }, toDisplayString(typeof item.title === "string" ? item.title : ((_b = item.title) == null ? void 0 : _b.en) || "Untitled"), 1),
                                    createVNode(unref(Divider), { layout: "vertical" }),
                                    createVNode("span", { class: "artwork-id" }, "ID: " + toDisplayString(item.pictufy_id || item.artwork_id), 1)
                                  ])
                                ])
                              ])
                            ];
                          }),
                          _: 2
                        }, 1032, ["href"])
                      ])
                    ]);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="clients-section py-16" data-v-54bebacf><div class="max-w-7xl mx-auto px-4" data-v-54bebacf><h2 class="text-3xl text-center mb-12 tracking-widest" data-v-54bebacf>Clients and Projects</h2><div class="flex flex-wrap justify-center items-center gap-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" data-v-54bebacf><img src="/images/clients/hilton.png" alt="Hilton" class="h-12" data-v-54bebacf><img src="/images/clients/the-royal-senses.png" alt="The Royal Senses" class="h-12" data-v-54bebacf><img src="/images/clients/kakkos-bay.png" alt="Kakkos Bay" class="h-12" data-v-54bebacf></div></div></section><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Welcome.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Welcome = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-54bebacf"]]);
export {
  Welcome as default
};
