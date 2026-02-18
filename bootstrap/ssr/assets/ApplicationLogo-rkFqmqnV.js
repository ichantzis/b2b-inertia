import { mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
const logoImage = "/build/assets/PInakothiki-Logo-Header-CDixsy5W.png";
const _sfc_main = {
  __name: "ApplicationLogo",
  __ssrInlineRender: true,
  setup(__props) {
    const logoUrl = logoImage;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center" }, _attrs))}><img${ssrRenderAttr("src", unref(logoUrl))} alt="Pinakothiki Logo" class="h-6 w-auto sm:h-8 md:h-10 lg:h-12 xl:h-14 transition-all duration-200"></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ApplicationLogo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
