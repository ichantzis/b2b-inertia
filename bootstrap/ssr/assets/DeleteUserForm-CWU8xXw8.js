import Button from "primevue/button";
import Message from "primevue/message";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import { useTemplateRef, ref, withCtx, unref, createTextVNode, toDisplayString, createVNode, createBlock, createCommentVNode, withKeys, openBlock, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { useForm } from "@inertiajs/vue3";
const _sfc_main = {
  __name: "DeleteUserForm",
  __ssrInlineRender: true,
  setup(__props) {
    const passwordInput = useTemplateRef("password-input");
    const modalOpen = ref(false);
    const form = useForm({
      password: ""
    });
    const deleteUser = () => {
      form.delete(route("account.profile.destroy"), {
        preserveScroll: true,
        onSuccess: () => modalOpen.value = false,
        onError: () => passwordInput.value.$el.focus(),
        onFinish: () => form.reset()
      });
    };
    function focusPasswordInput() {
      passwordInput.value.$el.focus();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Dialog = Dialog;
      const _component_InputText = InputText;
      const _component_Message = Message;
      const _component_Button = Button;
      _push(`<section${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_Dialog, {
        visible: modalOpen.value,
        "onUpdate:visible": ($event) => modalOpen.value = $event,
        position: "center",
        header: "Are you sure you want to delete your account?",
        style: { width: "40rem" },
        draggable: false,
        dismissableMask: "",
        modal: "",
        onShow: focusPasswordInput
      }, {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Button, {
              class: "mr-2",
              label: "Cancel",
              plain: "",
              text: "",
              onClick: ($event) => modalOpen.value = false
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Button, {
              loading: unref(form).processing,
              label: "Delete Account",
              severity: "danger",
              onClick: deleteUser
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Button, {
                class: "mr-2",
                label: "Cancel",
                plain: "",
                text: "",
                onClick: ($event) => modalOpen.value = false
              }, null, 8, ["onClick"]),
              createVNode(_component_Button, {
                loading: unref(form).processing,
                label: "Delete Account",
                severity: "danger",
                onClick: deleteUser
              }, null, 8, ["loading"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="mb-6"${_scopeId}><p class="m-0 text-muted-color"${_scopeId}> Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account. </p></div><div class="flex flex-col gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_InputText, {
              id: "password",
              ref: "password-input",
              modelValue: unref(form).password,
              "onUpdate:modelValue": ($event) => unref(form).password = $event,
              type: "password",
              placeholder: "Password",
              autofocus: "",
              required: "",
              fluid: "",
              invalid: Boolean(unref(form).errors.password),
              autocomplete: "current-password",
              onKeyup: deleteUser
            }, null, _parent2, _scopeId));
            if ((_a = unref(form).errors) == null ? void 0 : _a.password) {
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
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "mb-6" }, [
                createVNode("p", { class: "m-0 text-muted-color" }, " Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account. ")
              ]),
              createVNode("div", { class: "flex flex-col gap-2" }, [
                createVNode(_component_InputText, {
                  id: "password",
                  ref: "password-input",
                  modelValue: unref(form).password,
                  "onUpdate:modelValue": ($event) => unref(form).password = $event,
                  type: "password",
                  placeholder: "Password",
                  autofocus: "",
                  required: "",
                  fluid: "",
                  invalid: Boolean(unref(form).errors.password),
                  autocomplete: "current-password",
                  onKeyup: withKeys(deleteUser, ["enter"])
                }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"]),
                ((_b = unref(form).errors) == null ? void 0 : _b.password) ? (openBlock(), createBlock(_component_Message, {
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
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Button, {
        label: "Delete Account",
        severity: "danger",
        onClick: ($event) => modalOpen.value = true
      }, null, _parent));
      _push(`</section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/account/profile/partials/DeleteUserForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
