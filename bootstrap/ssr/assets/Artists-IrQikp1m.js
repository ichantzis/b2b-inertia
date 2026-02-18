import { unref, withCtx, createVNode, toDisplayString, createBlock, openBlock, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
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
  __name: "Artists",
  __ssrInlineRender: true,
  props: {
    artists: {
      type: Array,
      default: () => []
    },
    currentOrder: {
      type: String,
      default: "trending"
    }
  },
  setup(__props) {
    const decodeHTMLEntities = (text) => {
      if (typeof text !== "string") return "";
      const textArea = document.createElement("textarea");
      textArea.innerHTML = text;
      return textArea.value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Artists" }, null, _parent));
      _push(`<div class="page-container" data-v-8cc5bb77><div class="main-content-area" data-v-8cc5bb77><div class="content-wrapper" data-v-8cc5bb77><div class="flex justify-between items-center mb-10" data-v-8cc5bb77><h1 class="text-3xl font-bold text-gray-800" data-v-8cc5bb77>Featured Artists</h1></div>`);
      if (__props.artists.length > 0) {
        _push(`<div class="artists-grid" data-v-8cc5bb77><!--[-->`);
        ssrRenderList(__props.artists, (artist) => {
          _push(`<div class="artist-item" data-v-8cc5bb77>`);
          _push(ssrRenderComponent(unref(Link), {
            href: _ctx.route("artist.show", { artist_id: artist.artist_id }),
            class: "block link-wrapper"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Card), { class: "artist-card p-0" }, {
                  header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="image-wrapper" data-v-8cc5bb77${_scopeId2}>`);
                      if (artist.profile_picture) {
                        _push3(`<img${ssrRenderAttr("src", artist.profile_picture)}${ssrRenderAttr("alt", artist.name)} class="artist-image" loading="lazy" data-v-8cc5bb77${_scopeId2}>`);
                      } else {
                        _push3(`<div class="image-placeholder" data-v-8cc5bb77${_scopeId2}><i class="pi pi-user text-4xl" data-v-8cc5bb77${_scopeId2}></i></div>`);
                      }
                      _push3(`</div>`);
                    } else {
                      return [
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
                            createVNode("i", { class: "pi pi-user text-4xl" })
                          ]))
                        ])
                      ];
                    }
                  }),
                  title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<h3 class="name-heading text-md font-semibold text-center mt-3 mb-1 px-2" data-v-8cc5bb77${_scopeId2}>${ssrInterpolate(decodeHTMLEntities(artist.name))}</h3>`);
                    } else {
                      return [
                        createVNode("h3", { class: "name-heading text-md font-semibold text-center mt-3 mb-1 px-2" }, toDisplayString(decodeHTMLEntities(artist.name)), 1)
                      ];
                    }
                  }),
                  subtitle: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="text-center text-sm text-gray-500 px-2" data-v-8cc5bb77${_scopeId2}>${ssrInterpolate(artist.artist_type)}</div>`);
                    } else {
                      return [
                        createVNode("div", { class: "text-center text-sm text-gray-500 px-2" }, toDisplayString(artist.artist_type), 1)
                      ];
                    }
                  }),
                  content: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="text-center pb-3 mt-2" data-v-8cc5bb77${_scopeId2}><span class="text-xs bg-gray-100 text-gray-600 py-1 px-3 rounded-full" data-v-8cc5bb77${_scopeId2}>${ssrInterpolate(artist.artworks)} Artworks </span></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "text-center pb-3 mt-2" }, [
                          createVNode("span", { class: "text-xs bg-gray-100 text-gray-600 py-1 px-3 rounded-full" }, toDisplayString(artist.artworks) + " Artworks ", 1)
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
                          createVNode("i", { class: "pi pi-user text-4xl" })
                        ]))
                      ])
                    ]),
                    title: withCtx(() => [
                      createVNode("h3", { class: "name-heading text-md font-semibold text-center mt-3 mb-1 px-2" }, toDisplayString(decodeHTMLEntities(artist.name)), 1)
                    ]),
                    subtitle: withCtx(() => [
                      createVNode("div", { class: "text-center text-sm text-gray-500 px-2" }, toDisplayString(artist.artist_type), 1)
                    ]),
                    content: withCtx(() => [
                      createVNode("div", { class: "text-center pb-3 mt-2" }, [
                        createVNode("span", { class: "text-xs bg-gray-100 text-gray-600 py-1 px-3 rounded-full" }, toDisplayString(artist.artworks) + " Artworks ", 1)
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
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-20" data-v-8cc5bb77><p class="text-xl text-gray-500" data-v-8cc5bb77>No artists found.</p></div>`);
      }
      _push(`</div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Artists.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Artists = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8cc5bb77"]]);
export {
  Artists as default
};
