import Button from "primevue/button";
import Message from "primevue/message";
import InputText from "primevue/inputtext";
import { useTemplateRef, onMounted, resolveComponent, withCtx, unref, createTextVNode, toDisplayString, createVNode, withModifiers, createBlock, createCommentVNode, openBlock, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { useForm } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./GuestLayout-CGR_ETdc.js";
import "primevue/card";
import "./ApplicationLogo-rkFqmqnV.js";
const _sfc_main = {
  __name: "Register",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      name: "",
      email: "",
      password: "",
      password_confirmation: ""
    });
    const nameInput = useTemplateRef("name-input");
    const submit = () => {
      form.post(route("register"), {
        onFinish: () => form.reset("password", "password_confirmation")
      });
    };
    onMounted(() => {
      nameInput.value.$el.focus();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_InertiaHead = resolveComponent("InertiaHead");
      const _component_InputText = InputText;
      const _component_Message = Message;
      const _component_InertiaLink = resolveComponent("InertiaLink");
      const _component_Button = Button;
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          if (_push2) {
            _push2(ssrRenderComponent(_component_InertiaHead, { title: "Register" }, null, _parent2, _scopeId));
            _push2(`<form class="space-y-6"${_scopeId}><div class="flex flex-col gap-2"${_scopeId}><label for="name"${_scopeId}>Name</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "name",
              ref: "name-input",
              modelValue: unref(form).name,
              "onUpdate:modelValue": ($event) => unref(form).name = $event,
              type: "text",
              invalid: Boolean(unref(form).errors.name),
              required: "",
              fluid: "",
              autocomplete: "name"
            }, null, _parent2, _scopeId));
            if ((_a = unref(form).errors) == null ? void 0 : _a.name) {
              _push2(ssrRenderComponent(_component_Message, {
                severity: "error",
                variant: "simple",
                size: "small"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a2, _b2;
                  if (_push3) {
                    _push3(`${ssrInterpolate((_a2 = unref(form).errors) == null ? void 0 : _a2.name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString((_b2 = unref(form).errors) == null ? void 0 : _b2.name), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col gap-2"${_scopeId}><label for="email"${_scopeId}>Email</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "email",
              modelValue: unref(form).email,
              "onUpdate:modelValue": ($event) => unref(form).email = $event,
              type: "email",
              invalid: Boolean(unref(form).errors.email),
              required: "",
              fluid: "",
              autocomplete: "username"
            }, null, _parent2, _scopeId));
            if ((_b = unref(form).errors) == null ? void 0 : _b.email) {
              _push2(ssrRenderComponent(_component_Message, {
                severity: "error",
                variant: "simple",
                size: "small"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a2, _b2;
                  if (_push3) {
                    _push3(`${ssrInterpolate((_a2 = unref(form).errors) == null ? void 0 : _a2.email)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString((_b2 = unref(form).errors) == null ? void 0 : _b2.email), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col gap-2"${_scopeId}><label for="password"${_scopeId}>Password</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "password",
              modelValue: unref(form).password,
              "onUpdate:modelValue": ($event) => unref(form).password = $event,
              type: "password",
              invalid: Boolean(unref(form).errors.password),
              required: "",
              fluid: "",
              autocomplete: "new-password"
            }, null, _parent2, _scopeId));
            if ((_c = unref(form).errors) == null ? void 0 : _c.password) {
              _push2(ssrRenderComponent(_component_Message, {
                severity: "error",
                variant: "simple",
                size: "small"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a2, _b2;
                  if (_push3) {
                    _push3(`${ssrInterpolate((_a2 = unref(form).errors) == null ? void 0 : _a2.password)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString((_b2 = unref(form).errors) == null ? void 0 : _b2.password), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col gap-2"${_scopeId}><label for="password_confirmation"${_scopeId}>Confirm Password</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "password_confirmation",
              modelValue: unref(form).password_confirmation,
              "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
              type: "password",
              invalid: Boolean(unref(form).errors.password_confirmation),
              required: "",
              fluid: "",
              autocomplete: "new-password"
            }, null, _parent2, _scopeId));
            if ((_d = unref(form).errors) == null ? void 0 : _d.password_confirmation) {
              _push2(ssrRenderComponent(_component_Message, {
                severity: "error",
                variant: "simple",
                size: "small"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a2, _b2;
                  if (_push3) {
                    _push3(`${ssrInterpolate((_a2 = unref(form).errors) == null ? void 0 : _a2.password_confirmation)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString((_b2 = unref(form).errors) == null ? void 0 : _b2.password_confirmation), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex justify-end items-center pt-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_InertiaLink, {
              href: _ctx.route("login"),
              class: "mr-4 underline text-muted-color hover:text-color"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Already registered? `);
                } else {
                  return [
                    createTextVNode(" Already registered? ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Button, {
              type: "submit",
              loading: unref(form).processing,
              label: "Register"
            }, null, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode(_component_InertiaHead, { title: "Register" }),
              createVNode("form", {
                class: "space-y-6",
                onSubmit: withModifiers(submit, ["prevent"])
              }, [
                createVNode("div", { class: "flex flex-col gap-2" }, [
                  createVNode("label", { for: "name" }, "Name"),
                  createVNode(_component_InputText, {
                    id: "name",
                    ref: "name-input",
                    modelValue: unref(form).name,
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    type: "text",
                    invalid: Boolean(unref(form).errors.name),
                    required: "",
                    fluid: "",
                    autocomplete: "name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"]),
                  ((_e = unref(form).errors) == null ? void 0 : _e.name) ? (openBlock(), createBlock(_component_Message, {
                    key: 0,
                    severity: "error",
                    variant: "simple",
                    size: "small"
                  }, {
                    default: withCtx(() => {
                      var _a2;
                      return [
                        createTextVNode(toDisplayString((_a2 = unref(form).errors) == null ? void 0 : _a2.name), 1)
                      ];
                    }),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "flex flex-col gap-2" }, [
                  createVNode("label", { for: "email" }, "Email"),
                  createVNode(_component_InputText, {
                    id: "email",
                    modelValue: unref(form).email,
                    "onUpdate:modelValue": ($event) => unref(form).email = $event,
                    type: "email",
                    invalid: Boolean(unref(form).errors.email),
                    required: "",
                    fluid: "",
                    autocomplete: "username"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"]),
                  ((_f = unref(form).errors) == null ? void 0 : _f.email) ? (openBlock(), createBlock(_component_Message, {
                    key: 0,
                    severity: "error",
                    variant: "simple",
                    size: "small"
                  }, {
                    default: withCtx(() => {
                      var _a2;
                      return [
                        createTextVNode(toDisplayString((_a2 = unref(form).errors) == null ? void 0 : _a2.email), 1)
                      ];
                    }),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "flex flex-col gap-2" }, [
                  createVNode("label", { for: "password" }, "Password"),
                  createVNode(_component_InputText, {
                    id: "password",
                    modelValue: unref(form).password,
                    "onUpdate:modelValue": ($event) => unref(form).password = $event,
                    type: "password",
                    invalid: Boolean(unref(form).errors.password),
                    required: "",
                    fluid: "",
                    autocomplete: "new-password"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"]),
                  ((_g = unref(form).errors) == null ? void 0 : _g.password) ? (openBlock(), createBlock(_component_Message, {
                    key: 0,
                    severity: "error",
                    variant: "simple",
                    size: "small"
                  }, {
                    default: withCtx(() => {
                      var _a2;
                      return [
                        createTextVNode(toDisplayString((_a2 = unref(form).errors) == null ? void 0 : _a2.password), 1)
                      ];
                    }),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "flex flex-col gap-2" }, [
                  createVNode("label", { for: "password_confirmation" }, "Confirm Password"),
                  createVNode(_component_InputText, {
                    id: "password_confirmation",
                    modelValue: unref(form).password_confirmation,
                    "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
                    type: "password",
                    invalid: Boolean(unref(form).errors.password_confirmation),
                    required: "",
                    fluid: "",
                    autocomplete: "new-password"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"]),
                  ((_h = unref(form).errors) == null ? void 0 : _h.password_confirmation) ? (openBlock(), createBlock(_component_Message, {
                    key: 0,
                    severity: "error",
                    variant: "simple",
                    size: "small"
                  }, {
                    default: withCtx(() => {
                      var _a2;
                      return [
                        createTextVNode(toDisplayString((_a2 = unref(form).errors) == null ? void 0 : _a2.password_confirmation), 1)
                      ];
                    }),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "flex justify-end items-center pt-2" }, [
                  createVNode(_component_InertiaLink, {
                    href: _ctx.route("login"),
                    class: "mr-4 underline text-muted-color hover:text-color"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Already registered? ")
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode(_component_Button, {
                    type: "submit",
                    loading: unref(form).processing,
                    label: "Register"
                  }, null, 8, ["loading"])
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/auth/Register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
