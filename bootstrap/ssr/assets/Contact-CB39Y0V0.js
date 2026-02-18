import { resolveComponent, unref, withCtx, createVNode, resolveDynamicComponent, createTextVNode, toDisplayString, createBlock, openBlock, withModifiers, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderVNode, ssrInterpolate } from "vue/server-renderer";
import { useForm, Head } from "@inertiajs/vue3";
import { useToast } from "primevue/usetoast";
import { H as HeaderLayout } from "./HeaderLayout-zh2NGVuN.js";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Message from "primevue/message";
import { _ as _export_sfc } from "../ssr.js";
import "primevue/toast";
import "primevue/drawer";
import "primevue/overlaybadge";
import "./ApplicationLogo-rkFqmqnV.js";
import "primevue/menu";
import "primevue/menubar";
import "primevue/panelmenu";
import "primevue/popover";
import "@inertiajs/vue3/server";
import "@vue/server-renderer";
import "primevue/config";
import "primevue/toastservice";
import "primevue/confirmationservice";
import "@primeuix/themes/aura";
import "@primeuix/themes";
const _sfc_main = /* @__PURE__ */ Object.assign({ layout: HeaderLayout }, {
  __name: "Contact",
  __ssrInlineRender: true,
  setup(__props) {
    const toast = useToast();
    const form = useForm({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
    const submit = () => {
      form.post(route("contact.store"), {
        preserveScroll: true,
        onSuccess: () => {
          form.reset();
        },
        onError: () => {
          toast.add({ severity: "error", summary: "Error", detail: "Please check the form for errors.", life: 3e3 });
        }
      });
    };
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "description": "Contact Pinakothiki support team for inquiries about art prints and orders.",
      "url": window.location.href
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = resolveComponent("Container");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-4ae39730${_scopeId}>Contact Us</title><meta name="description" content="Get in touch with Pinakothiki. We are here to help with your art print orders, custom requests, and general inquiries." data-v-4ae39730${_scopeId}>`);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent("script"), { type: "application/ld+json" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(JSON.stringify(jsonLd))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(JSON.stringify(jsonLd)), 1)
                  ];
                }
              }),
              _: 1
            }), _parent2, _scopeId);
          } else {
            return [
              createVNode("title", null, "Contact Us"),
              createVNode("meta", {
                name: "description",
                content: "Get in touch with Pinakothiki. We are here to help with your art print orders, custom requests, and general inquiries."
              }),
              (openBlock(), createBlock(resolveDynamicComponent("script"), { type: "application/ld+json" }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(JSON.stringify(jsonLd)), 1)
                ]),
                _: 1
              }))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Container, { class: "py-12 md:py-24" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col lg:flex-row shadow-xl rounded-xl overflow-hidden bg-white dark:bg-surface-800" data-v-4ae39730${_scopeId}><div class="lg:w-5/12 bg-surface-900 text-white flex flex-col justify-center items-center text-center p-8 md:p-16" data-v-4ae39730${_scopeId}><h1 class="text-3xl font-bold mb-6" data-v-4ae39730${_scopeId}>PINAKOTHIKI</h1><p class="text-surface-300 mb-8 leading-relaxed text-lg" data-v-4ae39730${_scopeId}> Paintings on canvas or poster <br data-v-4ae39730${_scopeId}> Discover Unique Art for your space! <br data-v-4ae39730${_scopeId}> Handmade • Free Shipping • Made in Greece </p><div class="flex gap-6 text-2xl" data-v-4ae39730${_scopeId}><a href="https://www.facebook.com/pinakothiki.FineArtPrints" target="_blank" rel="noopener nofollow" class="w-12 h-12 rounded-full border border-surface-600 flex items-center justify-center hover:bg-white hover:text-surface-900 transition-colors no-underline duration-300" aria-label="Facebook" data-v-4ae39730${_scopeId}><i class="pi pi-facebook" data-v-4ae39730${_scopeId}></i></a><a href="https://www.instagram.com/pinakothiki/" target="_blank" rel="noopener nofollow" class="w-12 h-12 rounded-full border border-surface-600 flex items-center justify-center hover:bg-white hover:text-surface-900 transition-colors no-underline duration-300" aria-label="Instagram" data-v-4ae39730${_scopeId}><i class="pi pi-instagram" data-v-4ae39730${_scopeId}></i></a><a href="mailto:info@pinakothiki.gr" target="_blank" rel="nofollow noopener" class="w-12 h-12 rounded-full border border-surface-600 flex items-center justify-center hover:bg-white hover:text-surface-900 transition-colors no-underline duration-300" aria-label="Email" data-v-4ae39730${_scopeId}><i class="pi pi-envelope" data-v-4ae39730${_scopeId}></i></a></div></div><div class="lg:w-7/12 bg-white dark:bg-surface-800 p-8 md:p-16 flex flex-col justify-center" data-v-4ae39730${_scopeId}><div class="text-center mb-10" data-v-4ae39730${_scopeId}><h2 class="text-2xl md:text-3xl font-medium text-surface-900 dark:text-surface-0" data-v-4ae39730${_scopeId}> Contact Us </h2></div><form class="space-y-6 max-w-lg mx-auto w-full" data-v-4ae39730${_scopeId}><div class="flex flex-col gap-2" data-v-4ae39730${_scopeId}><label for="name" class="font-medium text-surface-700 dark:text-surface-200" data-v-4ae39730${_scopeId}> Full Name <span class="text-red-500" data-v-4ae39730${_scopeId}>*</span></label>`);
            _push2(ssrRenderComponent(unref(InputText), {
              id: "name",
              modelValue: unref(form).name,
              "onUpdate:modelValue": ($event) => unref(form).name = $event,
              invalid: !!unref(form).errors.name,
              class: "w-full"
            }, null, _parent2, _scopeId));
            if (unref(form).errors.name) {
              _push2(`<small class="text-red-500" data-v-4ae39730${_scopeId}>${ssrInterpolate(unref(form).errors.name)}</small>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col gap-2" data-v-4ae39730${_scopeId}><label for="phone" class="font-medium text-surface-700 dark:text-surface-200" data-v-4ae39730${_scopeId}> Phone <span class="text-red-500" data-v-4ae39730${_scopeId}>*</span></label>`);
            _push2(ssrRenderComponent(unref(InputText), {
              id: "phone",
              modelValue: unref(form).phone,
              "onUpdate:modelValue": ($event) => unref(form).phone = $event,
              invalid: !!unref(form).errors.phone,
              class: "w-full"
            }, null, _parent2, _scopeId));
            if (unref(form).errors.phone) {
              _push2(`<small class="text-red-500" data-v-4ae39730${_scopeId}>${ssrInterpolate(unref(form).errors.phone)}</small>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col gap-2" data-v-4ae39730${_scopeId}><label for="email" class="font-medium text-surface-700 dark:text-surface-200" data-v-4ae39730${_scopeId}> Email <span class="text-red-500" data-v-4ae39730${_scopeId}>*</span></label>`);
            _push2(ssrRenderComponent(unref(InputText), {
              id: "email",
              type: "email",
              modelValue: unref(form).email,
              "onUpdate:modelValue": ($event) => unref(form).email = $event,
              invalid: !!unref(form).errors.email,
              class: "w-full"
            }, null, _parent2, _scopeId));
            if (unref(form).errors.email) {
              _push2(`<small class="text-red-500" data-v-4ae39730${_scopeId}>${ssrInterpolate(unref(form).errors.email)}</small>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col gap-2" data-v-4ae39730${_scopeId}><label for="message" class="font-medium text-surface-700 dark:text-surface-200" data-v-4ae39730${_scopeId}> Message <span class="text-red-500" data-v-4ae39730${_scopeId}>*</span></label>`);
            _push2(ssrRenderComponent(unref(Textarea), {
              id: "message",
              modelValue: unref(form).message,
              "onUpdate:modelValue": ($event) => unref(form).message = $event,
              rows: "5",
              invalid: !!unref(form).errors.message,
              class: "w-full"
            }, null, _parent2, _scopeId));
            if (unref(form).errors.message) {
              _push2(`<small class="text-red-500" data-v-4ae39730${_scopeId}>${ssrInterpolate(unref(form).errors.message)}</small>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="pt-2" data-v-4ae39730${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Button), {
              type: "submit",
              label: "Send Message",
              class: "w-full font-bold",
              loading: unref(form).processing
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (unref(form).wasSuccessful) {
              _push2(`<div data-v-4ae39730${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Message), {
                severity: "success",
                closable: false
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Your message has been sent successfully!`);
                  } else {
                    return [
                      createTextVNode("Your message has been sent successfully!")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</form></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col lg:flex-row shadow-xl rounded-xl overflow-hidden bg-white dark:bg-surface-800" }, [
                createVNode("div", { class: "lg:w-5/12 bg-surface-900 text-white flex flex-col justify-center items-center text-center p-8 md:p-16" }, [
                  createVNode("h1", { class: "text-3xl font-bold mb-6" }, "PINAKOTHIKI"),
                  createVNode("p", { class: "text-surface-300 mb-8 leading-relaxed text-lg" }, [
                    createTextVNode(" Paintings on canvas or poster "),
                    createVNode("br"),
                    createTextVNode(" Discover Unique Art for your space! "),
                    createVNode("br"),
                    createTextVNode(" Handmade • Free Shipping • Made in Greece ")
                  ]),
                  createVNode("div", { class: "flex gap-6 text-2xl" }, [
                    createVNode("a", {
                      href: "https://www.facebook.com/pinakothiki.FineArtPrints",
                      target: "_blank",
                      rel: "noopener nofollow",
                      class: "w-12 h-12 rounded-full border border-surface-600 flex items-center justify-center hover:bg-white hover:text-surface-900 transition-colors no-underline duration-300",
                      "aria-label": "Facebook"
                    }, [
                      createVNode("i", { class: "pi pi-facebook" })
                    ]),
                    createVNode("a", {
                      href: "https://www.instagram.com/pinakothiki/",
                      target: "_blank",
                      rel: "noopener nofollow",
                      class: "w-12 h-12 rounded-full border border-surface-600 flex items-center justify-center hover:bg-white hover:text-surface-900 transition-colors no-underline duration-300",
                      "aria-label": "Instagram"
                    }, [
                      createVNode("i", { class: "pi pi-instagram" })
                    ]),
                    createVNode("a", {
                      href: "mailto:info@pinakothiki.gr",
                      target: "_blank",
                      rel: "nofollow noopener",
                      class: "w-12 h-12 rounded-full border border-surface-600 flex items-center justify-center hover:bg-white hover:text-surface-900 transition-colors no-underline duration-300",
                      "aria-label": "Email"
                    }, [
                      createVNode("i", { class: "pi pi-envelope" })
                    ])
                  ])
                ]),
                createVNode("div", { class: "lg:w-7/12 bg-white dark:bg-surface-800 p-8 md:p-16 flex flex-col justify-center" }, [
                  createVNode("div", { class: "text-center mb-10" }, [
                    createVNode("h2", { class: "text-2xl md:text-3xl font-medium text-surface-900 dark:text-surface-0" }, " Contact Us ")
                  ]),
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"]),
                    class: "space-y-6 max-w-lg mx-auto w-full"
                  }, [
                    createVNode("div", { class: "flex flex-col gap-2" }, [
                      createVNode("label", {
                        for: "name",
                        class: "font-medium text-surface-700 dark:text-surface-200"
                      }, [
                        createTextVNode(" Full Name "),
                        createVNode("span", { class: "text-red-500" }, "*")
                      ]),
                      createVNode(unref(InputText), {
                        id: "name",
                        modelValue: unref(form).name,
                        "onUpdate:modelValue": ($event) => unref(form).name = $event,
                        invalid: !!unref(form).errors.name,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"]),
                      unref(form).errors.name ? (openBlock(), createBlock("small", {
                        key: 0,
                        class: "text-red-500"
                      }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex flex-col gap-2" }, [
                      createVNode("label", {
                        for: "phone",
                        class: "font-medium text-surface-700 dark:text-surface-200"
                      }, [
                        createTextVNode(" Phone "),
                        createVNode("span", { class: "text-red-500" }, "*")
                      ]),
                      createVNode(unref(InputText), {
                        id: "phone",
                        modelValue: unref(form).phone,
                        "onUpdate:modelValue": ($event) => unref(form).phone = $event,
                        invalid: !!unref(form).errors.phone,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"]),
                      unref(form).errors.phone ? (openBlock(), createBlock("small", {
                        key: 0,
                        class: "text-red-500"
                      }, toDisplayString(unref(form).errors.phone), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex flex-col gap-2" }, [
                      createVNode("label", {
                        for: "email",
                        class: "font-medium text-surface-700 dark:text-surface-200"
                      }, [
                        createTextVNode(" Email "),
                        createVNode("span", { class: "text-red-500" }, "*")
                      ]),
                      createVNode(unref(InputText), {
                        id: "email",
                        type: "email",
                        modelValue: unref(form).email,
                        "onUpdate:modelValue": ($event) => unref(form).email = $event,
                        invalid: !!unref(form).errors.email,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"]),
                      unref(form).errors.email ? (openBlock(), createBlock("small", {
                        key: 0,
                        class: "text-red-500"
                      }, toDisplayString(unref(form).errors.email), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex flex-col gap-2" }, [
                      createVNode("label", {
                        for: "message",
                        class: "font-medium text-surface-700 dark:text-surface-200"
                      }, [
                        createTextVNode(" Message "),
                        createVNode("span", { class: "text-red-500" }, "*")
                      ]),
                      createVNode(unref(Textarea), {
                        id: "message",
                        modelValue: unref(form).message,
                        "onUpdate:modelValue": ($event) => unref(form).message = $event,
                        rows: "5",
                        invalid: !!unref(form).errors.message,
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"]),
                      unref(form).errors.message ? (openBlock(), createBlock("small", {
                        key: 0,
                        class: "text-red-500"
                      }, toDisplayString(unref(form).errors.message), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "pt-2" }, [
                      createVNode(unref(Button), {
                        type: "submit",
                        label: "Send Message",
                        class: "w-full font-bold",
                        loading: unref(form).processing
                      }, null, 8, ["loading"])
                    ]),
                    unref(form).wasSuccessful ? (openBlock(), createBlock("div", { key: 0 }, [
                      createVNode(unref(Message), {
                        severity: "success",
                        closable: false
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Your message has been sent successfully!")
                        ]),
                        _: 1
                      })
                    ])) : createCommentVNode("", true)
                  ], 32)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Contact = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4ae39730"]]);
export {
  Contact as default
};
