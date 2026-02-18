import { computed, unref, withCtx, createVNode, toDisplayString, createBlock, openBlock, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import Card from "primevue/card";
import { H as HeaderLayout } from "./HeaderLayout-zh2NGVuN.js";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
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
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    artists: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    const decodeHTMLEntities = (text) => {
      if (typeof text !== "string") return "";
      const textArea = document.createElement("textarea");
      textArea.innerHTML = text;
      return textArea.value;
    };
    const groupedArtists = computed(() => {
      const groups = {};
      const sortedArtists = [...props.artists].sort(
        (a, b) => a.name.localeCompare(b.name)
      );
      sortedArtists.forEach((artist) => {
        let letter = artist.name.charAt(0).toUpperCase();
        if (!/[A-Z]/.test(letter)) {
          letter = "#";
        }
        if (!groups[letter]) {
          groups[letter] = [];
        }
        groups[letter].push(artist);
      });
      const sortedKeys = Object.keys(groups).sort((a, b) => {
        if (a === "#") return 1;
        if (b === "#") return -1;
        return a.localeCompare(b);
      });
      return sortedKeys.reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {});
    });
    const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), "#"];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "All Artists" }, null, _parent));
      _push(`<div class="page-container" data-v-7e29f2a2><div class="main-content-area" data-v-7e29f2a2><div class="content-wrapper" data-v-7e29f2a2><h1 class="text-3xl font-bold text-center" data-v-7e29f2a2>All Artists</h1><div class="flex flex-col sm:flex-row items-center justify-between mb-10" data-v-7e29f2a2><div class="flex items-center gap-4 mt-4 sm:mt-0" data-v-7e29f2a2>`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("artists.overview")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Button), {
              label: "Back to Overview",
              icon: "pi pi-arrow-left",
              text: ""
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Button), {
                label: "Back to Overview",
                icon: "pi pi-arrow-left",
                text: ""
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="flex flex-col lg:flex-row gap-8 relative" data-v-7e29f2a2><div class="hidden lg:block w-16 flex-shrink-0" data-v-7e29f2a2><div class="sticky top-24 flex flex-col gap-2 items-center bg-gray-50 py-4 rounded-full shadow-inner max-h-[85vh] overflow-y-auto custom-scrollbar" data-v-7e29f2a2><!--[-->`);
      ssrRenderList(alphabet, (letter) => {
        _push(`<div class="transition-all duration-200" data-v-7e29f2a2>`);
        _push(ssrRenderComponent(unref(Avatar), {
          label: letter,
          shape: "circle",
          class: ["cursor-pointer font-bold transition-colors duration-200", [
            groupedArtists.value[letter] ? "bg-transparent text-gray-500 hover:bg-gray-200 hover:text-gray-900" : "bg-transparent text-gray-200 cursor-not-allowed"
          ]],
          style: groupedArtists.value[letter] ? {} : { pointerEvents: "none" }
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></div><div class="flex-grow" data-v-7e29f2a2><div class="lg:hidden sticky top-24 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex overflow-x-auto gap-2 mb-8 py-3 custom-scrollbar" data-v-7e29f2a2><!--[-->`);
      ssrRenderList(alphabet, (letter) => {
        _push(`<div class="flex-shrink-0" data-v-7e29f2a2>`);
        _push(ssrRenderComponent(unref(Avatar), {
          label: letter,
          shape: "circle",
          class: ["cursor-pointer font-bold border border-gray-100", [
            groupedArtists.value[letter] ? "bg-white text-gray-700 hover:bg-gray-100" : "bg-gray-50 text-gray-300"
          ]]
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
      if (Object.keys(groupedArtists.value).length > 0) {
        _push(`<div data-v-7e29f2a2><!--[-->`);
        ssrRenderList(groupedArtists.value, (group, letter) => {
          _push(`<div${ssrRenderAttr("id", `letter-${letter}`)} class="mb-12" data-v-7e29f2a2><div class="flex items-end mb-6 border-b border-gray-200 pb-2" data-v-7e29f2a2><h2 class="text-xl font-bold text-gray-800" data-v-7e29f2a2>${ssrInterpolate(letter)}</h2><span class="text-sm text-gray-400 ml-3 mb-1" data-v-7e29f2a2>(${ssrInterpolate(group.length)})</span></div><div class="artists-grid" data-v-7e29f2a2><!--[-->`);
          ssrRenderList(group, (artist) => {
            _push(`<div data-v-7e29f2a2>`);
            _push(ssrRenderComponent(unref(Link), {
              href: _ctx.route("artist.show", { artist_slug: artist.username }),
              class: "block h-full link-wrapper"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(Card), { class: "artist-card h-full p-0 overflow-hidden" }, {
                    header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div class="card-image-container" data-v-7e29f2a2${_scopeId2}><div class="image-wrapper" data-v-7e29f2a2${_scopeId2}>`);
                        if (artist.profile_picture) {
                          _push3(`<img${ssrRenderAttr("src", artist.profile_picture)}${ssrRenderAttr("alt", artist.name)} class="artist-image" loading="lazy" data-v-7e29f2a2${_scopeId2}>`);
                        } else {
                          _push3(`<div class="image-placeholder" data-v-7e29f2a2${_scopeId2}><i class="pi pi-user text-3xl" data-v-7e29f2a2${_scopeId2}></i></div>`);
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
                        _push3(`<div class="name-heading text-sm font-semibold text-center mt-3 mb-1 px-1" data-v-7e29f2a2${_scopeId2}>${ssrInterpolate(decodeHTMLEntities(artist.name))}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "name-heading text-sm font-semibold text-center mt-3 mb-1 px-1" }, toDisplayString(decodeHTMLEntities(artist.name)), 1)
                        ];
                      }
                    }),
                    content: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div class="text-center pb-3" data-v-7e29f2a2${_scopeId2}><p class="text-xs text-gray-500 truncate w-full px-1" data-v-7e29f2a2${_scopeId2}>${ssrInterpolate(artist.artist_type)}</p><div class="text-xs text-gray-400 mt-0.5" data-v-7e29f2a2${_scopeId2}>${ssrInterpolate(artist.artwork_count)} Artworks </div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-center pb-3" }, [
                            createVNode("p", { class: "text-xs text-gray-500 truncate w-full px-1" }, toDisplayString(artist.artist_type), 1),
                            createVNode("div", { class: "text-xs text-gray-400 mt-0.5" }, toDisplayString(artist.artwork_count) + " Artworks ", 1)
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
                          createVNode("div", { class: "text-xs text-gray-400 mt-0.5" }, toDisplayString(artist.artwork_count) + " Artworks ", 1)
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
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-20 text-gray-500" data-v-7e29f2a2> No artists found. </div>`);
      }
      _push(`</div></div></div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/artists/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7e29f2a2"]]);
export {
  Index as default
};
