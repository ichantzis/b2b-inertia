import Button from "primevue/button";
import Message from "primevue/message";
import InputText from "primevue/inputtext";
import { useTemplateRef, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { useForm } from "@inertiajs/vue3";
import { useToast } from "primevue/usetoast";
const _sfc_main = {
  __name: "UpdatePasswordForm",
  __ssrInlineRender: true,
  setup(__props) {
    useTemplateRef("current-password-input");
    useTemplateRef("new-password-input");
    useToast();
    const form = useForm({
      current_password: "",
      password: "",
      password_confirmation: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_InputText = InputText;
      const _component_Message = Message;
      const _component_Button = Button;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-col gap-2"><label for="current_password">Current Password</label>`);
      _push(ssrRenderComponent(_component_InputText, {
        id: "current_password",
        ref: "current-password-input",
        modelValue: unref(form).current_password,
        "onUpdate:modelValue": ($event) => unref(form).current_password = $event,
        type: "password",
        required: "",
        fluid: "",
        invalid: Boolean((_a = unref(form).errors) == null ? void 0 : _a.current_password),
        autocomplete: "current-password"
      }, null, _parent));
      if ((_b = unref(form).errors) == null ? void 0 : _b.current_password) {
        _push(ssrRenderComponent(_component_Message, {
          severity: "error",
          variant: "simple",
          size: "small"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2;
            if (_push2) {
              _push2(`${ssrInterpolate((_a2 = unref(form).errors) == null ? void 0 : _a2.current_password)}`);
            } else {
              return [
                createTextVNode(toDisplayString((_b2 = unref(form).errors) == null ? void 0 : _b2.current_password), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-col gap-2"><label for="password">New Password</label>`);
      _push(ssrRenderComponent(_component_InputText, {
        id: "password",
        ref: "new-password-input",
        modelValue: unref(form).password,
        "onUpdate:modelValue": ($event) => unref(form).password = $event,
        type: "password",
        required: "",
        fluid: "",
        invalid: Boolean(unref(form).errors.password),
        autocomplete: "new-password"
      }, null, _parent));
      if ((_c = unref(form).errors) == null ? void 0 : _c.password) {
        _push(ssrRenderComponent(_component_Message, {
          severity: "error",
          variant: "simple",
          size: "small"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2;
            if (_push2) {
              _push2(`${ssrInterpolate((_a2 = unref(form).errors) == null ? void 0 : _a2.password)}`);
            } else {
              return [
                createTextVNode(toDisplayString((_b2 = unref(form).errors) == null ? void 0 : _b2.password), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-col gap-2"><label for="password_confirmation">Confirm Password</label>`);
      _push(ssrRenderComponent(_component_InputText, {
        id: "password_confirmation",
        modelValue: unref(form).password_confirmation,
        "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
        type: "password",
        required: "",
        fluid: "",
        invalid: Boolean(unref(form).errors.password_confirmation),
        autocomplete: "new-password"
      }, null, _parent));
      if ((_d = unref(form).errors) == null ? void 0 : _d.password_confirmation) {
        _push(ssrRenderComponent(_component_Message, {
          severity: "error",
          variant: "simple",
          size: "small"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2;
            if (_push2) {
              _push2(`${ssrInterpolate((_a2 = unref(form).errors) == null ? void 0 : _a2.password_confirmation)}`);
            } else {
              return [
                createTextVNode(toDisplayString((_b2 = unref(form).errors) == null ? void 0 : _b2.password_confirmation), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center gap-4">`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/account/profile/partials/UpdatePasswordForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
