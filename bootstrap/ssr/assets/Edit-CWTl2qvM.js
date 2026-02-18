import Card from "primevue/card";
import { resolveComponent, withCtx, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./UserLayout-pdID7Qc2.js";
import "./DeleteUserForm-CWU8xXw8.js";
import _sfc_main$3 from "./UpdatePasswordForm-6SNopN85.js";
import _sfc_main$2 from "./UpdateProfileInformationForm-CoNIgpQP.js";
import _sfc_main$4 from "./UpdateAddressForm-VqUOpUgt.js";
import "./HeaderLayout-zh2NGVuN.js";
import "primevue/toast";
import "primevue/drawer";
import "primevue/overlaybadge";
import "primevue/button";
import "@inertiajs/vue3";
import "./ApplicationLogo-rkFqmqnV.js";
import "primevue/menu";
import "primevue/menubar";
import "primevue/panelmenu";
import "../ssr.js";
import "@inertiajs/vue3/server";
import "@vue/server-renderer";
import "primevue/config";
import "primevue/toastservice";
import "primevue/confirmationservice";
import "@primeuix/themes/aura";
import "@primeuix/themes";
import "primevue/popover";
import "primevue/usetoast";
import "primevue/inputtext";
import "primevue/message";
import "primevue/dialog";
import "primevue/select";
import "./useCountries-DisC8OA1.js";
const _sfc_main = /* @__PURE__ */ Object.assign({ layout: _sfc_main$1 }, {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    mustVerifyEmail: {
      type: Boolean
    },
    status: {
      type: String
    },
    user: {
      type: Object
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_InertiaHead = resolveComponent("InertiaHead");
      const _component_Container = resolveComponent("Container");
      const _component_PageTitleSection = resolveComponent("PageTitleSection");
      const _component_Card = Card;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_InertiaHead, { title: "Profile" }, null, _parent));
      _push(ssrRenderComponent(_component_Container, { vertical: "" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_PageTitleSection, null, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Profile `);
                } else {
                  return [
                    createTextVNode(" Profile ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Card, {
              "pt:body:class": "max-w-2xl space-y-3",
              "pt:caption:class": "space-y-1"
            }, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Profile Information`);
                } else {
                  return [
                    createTextVNode("Profile Information")
                  ];
                }
              }),
              subtitle: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Update your account&#39;s profile information and email address. `);
                } else {
                  return [
                    createTextVNode(" Update your account's profile information and email address. ")
                  ];
                }
              }),
              content: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$2, {
                    "must-verify-email": __props.mustVerifyEmail,
                    status: __props.status
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$2, {
                      "must-verify-email": __props.mustVerifyEmail,
                      status: __props.status
                    }, null, 8, ["must-verify-email", "status"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Card, {
              "pt:body:class": "max-w-2xl space-y-3",
              "pt:caption:class": "space-y-1"
            }, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Update Password`);
                } else {
                  return [
                    createTextVNode("Update Password")
                  ];
                }
              }),
              subtitle: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Ensure your account is using a long, random password to stay secure. `);
                } else {
                  return [
                    createTextVNode(" Ensure your account is using a long, random password to stay secure. ")
                  ];
                }
              }),
              content: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$3, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$3)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Card, {
              "pt:body:class": "max-w-2xl space-y-3",
              "pt:caption:class": "space-y-1"
            }, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Contact &amp; Address Information`);
                } else {
                  return [
                    createTextVNode("Contact & Address Information")
                  ];
                }
              }),
              subtitle: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Update your company details and billing address. `);
                } else {
                  return [
                    createTextVNode(" Update your company details and billing address. ")
                  ];
                }
              }),
              content: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$4, { user: __props.user }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$4, { user: __props.user }, null, 8, ["user"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_PageTitleSection, null, {
                title: withCtx(() => [
                  createTextVNode(" Profile ")
                ]),
                _: 1
              }),
              createVNode(_component_Card, {
                "pt:body:class": "max-w-2xl space-y-3",
                "pt:caption:class": "space-y-1"
              }, {
                title: withCtx(() => [
                  createTextVNode("Profile Information")
                ]),
                subtitle: withCtx(() => [
                  createTextVNode(" Update your account's profile information and email address. ")
                ]),
                content: withCtx(() => [
                  createVNode(_sfc_main$2, {
                    "must-verify-email": __props.mustVerifyEmail,
                    status: __props.status
                  }, null, 8, ["must-verify-email", "status"])
                ]),
                _: 1
              }),
              createVNode(_component_Card, {
                "pt:body:class": "max-w-2xl space-y-3",
                "pt:caption:class": "space-y-1"
              }, {
                title: withCtx(() => [
                  createTextVNode("Update Password")
                ]),
                subtitle: withCtx(() => [
                  createTextVNode(" Ensure your account is using a long, random password to stay secure. ")
                ]),
                content: withCtx(() => [
                  createVNode(_sfc_main$3)
                ]),
                _: 1
              }),
              createVNode(_component_Card, {
                "pt:body:class": "max-w-2xl space-y-3",
                "pt:caption:class": "space-y-1"
              }, {
                title: withCtx(() => [
                  createTextVNode("Contact & Address Information")
                ]),
                subtitle: withCtx(() => [
                  createTextVNode(" Update your company details and billing address. ")
                ]),
                content: withCtx(() => [
                  createVNode(_sfc_main$4, { user: __props.user }, null, 8, ["user"])
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/account/profile/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
