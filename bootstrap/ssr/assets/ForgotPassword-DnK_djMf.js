import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import { useTemplateRef, onMounted, resolveComponent, createSlots, withCtx, unref, createTextVNode, toDisplayString, createVNode, withModifiers, createBlock, createCommentVNode, openBlock, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { useForm } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./GuestLayout-CGR_ETdc.js";
import "primevue/card";
import "./ApplicationLogo-rkFqmqnV.js";
const _sfc_main = {
  __name: "ForgotPassword",
  __ssrInlineRender: true,
  props: {
    status: {
      type: String
    }
  },
  setup(__props) {
    const emailInput = useTemplateRef("email-input");
    const form = useForm({
      email: ""
    });
    const submit = () => {
      form.post(route("password.email"));
    };
    onMounted(() => {
      emailInput.value.$el.focus();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_InertiaHead = resolveComponent("InertiaHead");
      const _component_Message = Message;
      const _component_InputText = InputText;
      const _component_Button = Button;
      _push(ssrRenderComponent(_sfc_main$1, _attrs, createSlots({
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(ssrRenderComponent(_component_InertiaHead, { title: "Forgot Password" }, null, _parent2, _scopeId));
            _push2(`<div class="mb-6 text-sm text-muted-color"${_scopeId}> Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one. </div><form class="space-y-6"${_scopeId}><div class="flex flex-col gap-2"${_scopeId}><label for="email"${_scopeId}>Email</label>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "email",
              ref: "email-input",
              modelValue: unref(form).email,
              "onUpdate:modelValue": ($event) => unref(form).email = $event,
              type: "email",
              required: "",
              fluid: "",
              invalid: Boolean(unref(form).errors.email),
              autocomplete: "username"
            }, null, _parent2, _scopeId));
            if ((_a = unref(form).errors) == null ? void 0 : _a.email) {
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
            _push2(`</div><div class="flex justify-end items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Button, {
              loading: unref(form).processing,
              type: "submit",
              label: "Email Password Reset Link"
            }, null, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode(_component_InertiaHead, { title: "Forgot Password" }),
              createVNode("div", { class: "mb-6 text-sm text-muted-color" }, " Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one. "),
              createVNode("form", {
                class: "space-y-6",
                onSubmit: withModifiers(submit, ["prevent"])
              }, [
                createVNode("div", { class: "flex flex-col gap-2" }, [
                  createVNode("label", { for: "email" }, "Email"),
                  createVNode(_component_InputText, {
                    id: "email",
                    ref: "email-input",
                    modelValue: unref(form).email,
                    "onUpdate:modelValue": ($event) => unref(form).email = $event,
                    type: "email",
                    required: "",
                    fluid: "",
                    invalid: Boolean(unref(form).errors.email),
                    autocomplete: "username"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"]),
                  ((_b = unref(form).errors) == null ? void 0 : _b.email) ? (openBlock(), createBlock(_component_Message, {
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
                createVNode("div", { class: "flex justify-end items-center" }, [
                  createVNode(_component_Button, {
                    loading: unref(form).processing,
                    type: "submit",
                    label: "Email Password Reset Link"
                  }, null, 8, ["loading"])
                ])
              ], 32)
            ];
          }
        }),
        _: 2
      }, [
        __props.status ? {
          name: "message",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Message, {
                severity: "success",
                closable: false,
                class: "shadow-sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(__props.status)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(__props.status), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_Message, {
                  severity: "success",
                  closable: false,
                  class: "shadow-sm"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(__props.status), 1)
                  ]),
                  _: 1
                })
              ];
            }
          }),
          key: "0"
        } : void 0
      ]), _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/auth/ForgotPassword.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
