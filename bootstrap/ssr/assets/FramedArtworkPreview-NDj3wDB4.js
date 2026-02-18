import { computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
import { s as squareCanvasImg, a as squareCremaImg, b as squareOakImg, c as squareWalnutImg, d as squareNaturalImg, e as squareGoldImg, f as squareSilverImg, g as squareMockaImg, h as squareWhiteImg, i as horizontalBlackImg, j as horizontalCremaImg, k as horizontalOakImg, l as horizontalWalnutImg, m as horizontalNaturalImg, n as horizontalGoldImg, o as horizontalSilverImg, p as horizontalMockaImg, q as horizontalWhiteImg, r as defaultCanvasImg, v as verticalGoldImg, t as verticalCremaImg, u as verticalOakImg, w as verticalWalnutImg, x as verticalNaturalImg, y as verticalSilverImg, z as verticalMockaImg, A as verticalWhiteImg, B as verticalBlacklImg } from "./SQUARE_WALNUT-87wNLTxN.js";
const _sfc_main = {
  __name: "FramedArtworkPreview",
  __ssrInlineRender: true,
  props: {
    artworkImage: String,
    frame: String,
    // π.χ. "Black", "No Frame", "Walnut"
    size: String,
    // π.χ. "50x70"
    type: String
    // π.χ. "Canvas (Framed)" (προαιρετικό, για extra checks)
  },
  setup(__props) {
    const props = __props;
    const frameColorImagePaths = {
      vertical: {
        black: verticalBlacklImg,
        white: verticalWhiteImg,
        mocka: verticalMockaImg,
        silver: verticalSilverImg,
        natural: verticalNaturalImg,
        walnut: verticalWalnutImg,
        oak: verticalOakImg,
        crema: verticalCremaImg,
        gold: verticalGoldImg,
        noframe: null,
        default: defaultCanvasImg
      },
      horizontal: {
        black: horizontalBlackImg,
        white: horizontalWhiteImg,
        mocka: horizontalMockaImg,
        silver: horizontalSilverImg,
        gold: horizontalGoldImg,
        natural: horizontalNaturalImg,
        walnut: horizontalWalnutImg,
        oak: horizontalOakImg,
        crema: horizontalCremaImg,
        noframe: null,
        default: horizontalBlackImg
      },
      square: {
        white: squareWhiteImg,
        black: squareCanvasImg,
        mocka: squareMockaImg,
        silver: squareSilverImg,
        gold: squareGoldImg,
        natural: squareNaturalImg,
        walnut: squareWalnutImg,
        oak: squareOakImg,
        crema: squareCremaImg,
        noframe: null,
        default: squareCanvasImg
      }
    };
    const geometry = computed(() => {
      if (!props.size) return "vertical";
      const parts = props.size.toLowerCase().split("x");
      if (parts.length !== 2) return "vertical";
      const w = parseFloat(parts[0]);
      const h = parseFloat(parts[1]);
      if (isNaN(w) || isNaN(h)) return "vertical";
      if (w === h) return "square";
      if (w > h) return "horizontal";
      return "vertical";
    });
    const normalizedFrameStyle = computed(() => {
      if (!props.frame) return "black";
      const raw = props.frame.toLowerCase().replace(/\s+/g, "");
      return raw;
    });
    const selectedCanvas = computed(() => {
      const geo = geometry.value;
      const style = normalizedFrameStyle.value;
      let imageUrl;
      if (frameColorImagePaths[geo] && frameColorImagePaths[geo][style]) {
        imageUrl = frameColorImagePaths[geo][style];
      } else if (frameColorImagePaths[geo] && frameColorImagePaths[geo].default) {
        imageUrl = frameColorImagePaths[geo].default;
      } else {
        imageUrl = defaultCanvasImg;
      }
      let details = {
        url: imageUrl,
        artworkContainerStyle: { top: "10%", left: "15%", width: "70%", height: "75%" },
        artworkShadow: ""
      };
      switch (geo) {
        case "vertical":
          if (style === "noframe") {
            details.url = frameColorImagePaths.vertical.noframe;
            details.artworkContainerStyle = { top: "11.5%", left: "23.85%", width: "50.5%", height: "76.3%" };
            details.artworkShadow = "-2px 2px 5px rgba(0, 0, 0, 0.3)";
          } else {
            details.artworkContainerStyle = { top: "11.5%", left: "23.85%", width: "50.5%", height: "76.5%" };
          }
          break;
        case "horizontal":
          if (style === "noframe") {
            details.url = frameColorImagePaths.horizontal.noframe;
            details.artworkContainerStyle = { top: "24.2%", left: "13.8%", width: "71.12%", height: "50%" };
            details.artworkShadow = "-2px 2px 5px rgba(0, 0, 0, 0.3)";
          } else {
            details.artworkContainerStyle = { top: "24.4%", left: "13.9%", width: "71.3%", height: "50%" };
          }
          break;
        case "square":
          if (style === "noframe") {
            details.url = frameColorImagePaths.square.noframe;
            details.artworkContainerStyle = { top: "13.65%", left: "14.68%", width: "69.7%", height: "69.7%" };
            details.artworkShadow = "-2px 2px 5px rgba(0, 0, 0, 0.3)";
          } else {
            details.artworkContainerStyle = { top: "13.65%", left: "14.68%", width: "69.7%", height: "69.7%" };
          }
          break;
      }
      return details;
    });
    computed(() => {
      switch (geometry.value) {
        case "horizontal":
          return "aspect-[3/2]";
        case "square":
          return "aspect-square";
        default:
          return "aspect-[2/3]";
      }
    });
    const artworkStyle = computed(() => {
      return {
        top: selectedCanvas.value.artworkContainerStyle.top,
        left: selectedCanvas.value.artworkContainerStyle.left,
        width: selectedCanvas.value.artworkContainerStyle.width,
        height: selectedCanvas.value.artworkContainerStyle.height,
        boxShadow: selectedCanvas.value.artworkShadow
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative w-full h-full select-none aspect-square" }, _attrs))}>`);
      if (selectedCanvas.value.url) {
        _push(`<img${ssrRenderAttr("src", selectedCanvas.value.url)} class="absolute inset-0 w-full h-full object-contain pointer-events-none" alt="Frame">`);
      } else {
        _push(`<!---->`);
      }
      if (__props.artworkImage) {
        _push(`<img${ssrRenderAttr("src", __props.artworkImage)} class="absolute object-cover" style="${ssrRenderStyle(artworkStyle.value)}" alt="Artwork">`);
      } else {
        _push(`<div class="absolute inset-0 flex items-center justify-center bg-gray-100 text-xs text-gray-400"> No Img </div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/FramedArtworkPreview.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
