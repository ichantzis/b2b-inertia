import Card from "primevue/card";
import { resolveComponent, mergeProps, withCtx, createVNode, renderSlot, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./ApplicationLogo-rkFqmqnV.js";
const _sfc_main = {
  __name: "GuestLayout",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_InertiaLink = resolveComponent("InertiaLink");
      const _component_Card = Card;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0" }, _attrs))}><div>`);
      _push(ssrRenderComponent(_component_InertiaLink, { href: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$1, { class: "fill-current text-surface-900 dark:text-surface-0" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$1, { class: "fill-current text-surface-900 dark:text-surface-0" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (_ctx.$slots.message) {
        _push(`<div class="w-full sm:max-w-md mt-6 px-4 sm:px-0">`);
        ssrRenderSlot(_ctx.$slots, "message", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="w-full sm:max-w-md mt-6">`);
      _push(ssrRenderComponent(_component_Card, null, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/GuestLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
