import Button from "primevue/button";
import Message from "primevue/message";
import { computed, resolveComponent, createSlots, withCtx, unref, createTextVNode, createVNode, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { useForm } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./GuestLayout-CGR_ETdc.js";
import "primevue/card";
import "./ApplicationLogo-rkFqmqnV.js";
const _sfc_main = {
  __name: "VerifyEmail",
  __ssrInlineRender: true,
  props: {
    status: {
      type: String
    }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({});
    const submit = () => {
      form.post(route("verification.send"));
    };
    const verificationLinkSent = computed(
      () => props.status === "verification-link-sent"
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_InertiaHead = resolveComponent("InertiaHead");
      const _component_Message = Message;
      const _component_Button = Button;
      const _component_InertiaLink = resolveComponent("InertiaLink");
      _push(ssrRenderComponent(_sfc_main$1, _attrs, createSlots({
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_InertiaHead, { title: "Email Verification" }, null, _parent2, _scopeId));
            _push2(`<div class="mb-6 text-sm text-muted-color"${_scopeId}> Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn&#39;t receive the email, we will gladly send you another. </div><form${_scopeId}><div class="mt-6 flex justify-between items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Button, {
              loading: unref(form).processing,
              type: "submit",
              label: "Resend Verification Email"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_InertiaLink, {
              href: _ctx.route("logout"),
              method: "post",
              class: "underline text-muted-color hover:text-color"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Log Out `);
                } else {
                  return [
                    createTextVNode(" Log Out ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode(_component_InertiaHead, { title: "Email Verification" }),
              createVNode("div", { class: "mb-6 text-sm text-muted-color" }, " Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another. "),
              createVNode("form", {
                onSubmit: withModifiers(submit, ["prevent"])
              }, [
                createVNode("div", { class: "mt-6 flex justify-between items-center" }, [
                  createVNode(_component_Button, {
                    loading: unref(form).processing,
                    type: "submit",
                    label: "Resend Verification Email"
                  }, null, 8, ["loading"]),
                  createVNode(_component_InertiaLink, {
                    href: _ctx.route("logout"),
                    method: "post",
                    class: "underline text-muted-color hover:text-color"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Log Out ")
                    ]),
                    _: 1
                  }, 8, ["href"])
                ])
              ], 32)
            ];
          }
        }),
        _: 2
      }, [
        verificationLinkSent.value ? {
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
                    _push3(` A new verification link has been sent to the email address you provided during registration. `);
                  } else {
                    return [
                      createTextVNode(" A new verification link has been sent to the email address you provided during registration. ")
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
                    createTextVNode(" A new verification link has been sent to the email address you provided during registration. ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/auth/VerifyEmail.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
