import Button from "primevue/button";
import Message from "primevue/message";
import InputText from "primevue/inputtext";
import { useTemplateRef, onMounted, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { usePage, useForm } from "@inertiajs/vue3";
import { useToast } from "primevue/usetoast";
const _sfc_main = {
  __name: "UpdateProfileInformationForm",
  __ssrInlineRender: true,
  props: {
    mustVerifyEmail: {
      type: Boolean
    },
    status: {
      type: String
    }
  },
  setup(__props) {
    const nameInput = useTemplateRef("name-input");
    const user = usePage().props.auth.user;
    useToast();
    const form = useForm({
      name: user.name,
      email: user.email
    });
    onMounted(() => {
      nameInput.value.$el.focus();
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_InputText = InputText;
      const _component_Message = Message;
      const _component_InertiaLink = resolveComponent("InertiaLink");
      const _component_Button = Button;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-col gap-2"><label for="name">Name</label>`);
      _push(ssrRenderComponent(_component_InputText, {
        id: "name",
        ref: "name-input",
        modelValue: unref(form).name,
        "onUpdate:modelValue": ($event) => unref(form).name = $event,
        type: "text",
        required: "",
        fluid: "",
        invalid: Boolean(unref(form).errors.name),
        autocomplete: "name"
      }, null, _parent));
      if ((_a = unref(form).errors) == null ? void 0 : _a.name) {
        _push(ssrRenderComponent(_component_Message, {
          severity: "error",
          variant: "simple",
          size: "small"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2;
            if (_push2) {
              _push2(`${ssrInterpolate((_a2 = unref(form).errors) == null ? void 0 : _a2.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString((_b2 = unref(form).errors) == null ? void 0 : _b2.name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-col gap-2"><label for="email">Email</label>`);
      _push(ssrRenderComponent(_component_InputText, {
        id: "email",
        modelValue: unref(form).email,
        "onUpdate:modelValue": ($event) => unref(form).email = $event,
        type: "email",
        required: "",
        fluid: "",
        invalid: Boolean(unref(form).errors.email),
        autocomplete: "username"
      }, null, _parent));
      if ((_b = unref(form).errors) == null ? void 0 : _b.email) {
        _push(ssrRenderComponent(_component_Message, {
          severity: "error",
          variant: "simple",
          size: "small"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2;
            if (_push2) {
              _push2(`${ssrInterpolate((_a2 = unref(form).errors) == null ? void 0 : _a2.email)}`);
            } else {
              return [
                createTextVNode(toDisplayString((_b2 = unref(form).errors) == null ? void 0 : _b2.email), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.mustVerifyEmail && unref(user).email_verified_at === null) {
        _push(`<div><p class="text-sm mt-2"> Your email address is unverified. `);
        _push(ssrRenderComponent(_component_InertiaLink, {
          href: _ctx.route("verification.send"),
          method: "post",
          class: "underline text-sm text-muted-color hover:text-color"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Click here to re-send the verification email. `);
            } else {
              return [
                createTextVNode(" Click here to re-send the verification email. ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</p>`);
        if (__props.status === "verification-link-sent") {
          _push(ssrRenderComponent(_component_Message, {
            severity: "success",
            closable: false,
            class: "shadow-sm mt-4"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` A new verification link has been sent to your email address. `);
              } else {
                return [
                  createTextVNode(" A new verification link has been sent to your email address. ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(_component_Button, {
        loading: unref(form).processing,
        type: "submit",
        label: "Save"
      }, null, _parent));
      if (unref(form).recentlySuccessful) {
        _push(`<p class="text-sm text-muted-color"> Saved. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/account/profile/partials/UpdateProfileInformationForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
