import { computed, mergeProps, unref, useSSRContext, ref, provide, withCtx, createVNode, createBlock, createCommentVNode, Transition, withDirectives, vShow, renderSlot, openBlock, inject, watch, onMounted, onUnmounted, toDisplayString, withKeys, Fragment, renderList } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderStyle, ssrRenderSlot } from "vue/server-renderer";
import axios from "axios";
import { debounce } from "lodash-es";
import DataView from "primevue/dataview";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { usePage, router, Head, Link } from "@inertiajs/vue3";
import { H as HeaderLayout } from "./HeaderLayout-zh2NGVuN.js";
import Checkbox from "primevue/checkbox";
import Select from "primevue/select";
import { _ as _export_sfc } from "../ssr.js";
import ProgressSpinner from "primevue/progressspinner";
import Divider from "primevue/divider";
import ScrollTop from "primevue/scrolltop";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { s as slugify } from "./utils--JrDKSqM.js";
import "primevue/toast";
import "primevue/drawer";
import "primevue/overlaybadge";
import "./ApplicationLogo-rkFqmqnV.js";
import "primevue/menu";
import "primevue/menubar";
import "primevue/panelmenu";
import "primevue/popover";
import "primevue/usetoast";
import "@inertiajs/vue3/server";
import "@vue/server-renderer";
import "primevue/config";
import "primevue/toastservice";
import "primevue/confirmationservice";
import "@primeuix/themes/aura";
import "@primeuix/themes";
const _sfc_main$2 = {
  __name: "FilterSidebar",
  __ssrInlineRender: true,
  props: {
    listId: [String, Number],
    // Can be number or string from DB
    collectionSlug: String,
    activeFilters: {
      type: Array,
      default: () => []
    },
    currentSearchQuery: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const categories = computed(() => {
      var _a;
      const rawCategories = ((_a = page.props.global_data) == null ? void 0 : _a.categories) || [];
      const groups = {};
      rawCategories.forEach((cat) => {
        let key = "Categories";
        if (cat.parent_slug) {
          key = cat.parent_slug.charAt(0).toUpperCase() + cat.parent_slug.slice(1);
        }
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(cat);
      });
      return groups;
    });
    const formats = [
      { label: "Horizontal", value: "horizontal", icon: "/images/formats/geometry-horizontal.png" },
      { label: "Vertical", value: "vertical", icon: "/images/formats/geometry-vertical.png" },
      { label: "Square", value: "square", icon: "/images/formats/geometry-square.png" },
      { label: "Panorama", value: "panorama", icon: "/images/formats/geometry-panoramic.png" }
    ];
    const colors = [
      { label: "Red", value: "red", hex: "#FF0000" },
      { label: "Orange", value: "orange", hex: "#FFA500" },
      { label: "Yellow", value: "yellow", hex: "#FFFF00" },
      { label: "Green", value: "green", hex: "#008000" },
      { label: "Turquoise", value: "turquoise", hex: "#40E0D0" },
      { label: "Blue", value: "blue", hex: "#0000FF" },
      { label: "Lilac", value: "lilac", hex: "#C8A2C8" },
      { label: "Pink", value: "pink", hex: "#FFC0CB" },
      { label: "High Key", value: "highkey", hex: "#FFFFFF" },
      { label: "Low Key", value: "lowkey", hex: "#000000" }
    ];
    const sortOptions = [
      { label: "Recommended", value: "recommended" },
      { label: "Recently Added", value: "recently_added" },
      { label: "Best Selling", value: "best_selling" },
      { label: "Trending", value: "trending" },
      { label: "Oldest First", value: "oldest_first" }
    ];
    const activeCategory = computed({
      get: () => {
        const category = props.activeFilters.find((f) => f.startsWith("cat_"));
        return category ? [category] : [];
      },
      set: () => {
      }
    });
    const activeFormat = computed({
      get: () => {
        const format = props.activeFilters.find((f) => ["horizontal", "vertical", "square", "panorama"].includes(f));
        return format ? [format] : [];
      },
      set: () => {
      }
    });
    const activeColor = computed({
      get: () => {
        const color = props.activeFilters.find((f) => colors.map((c) => c.value).includes(f));
        return color ? [color] : [];
      },
      set: () => {
      }
    });
    const activeSort = computed({
      get: () => {
        const sort = props.activeFilters.find((f) => sortOptions.map((o) => o.value).includes(f));
        return sort || "recommended";
      },
      set: () => {
      }
    });
    const getBaseUrl = () => {
      const currentPath = page.url;
      if (currentPath.startsWith("/collection/") && props.collectionSlug) {
        return `/collection/${props.collectionSlug}`;
      }
      if (currentPath.startsWith("/lists/") && props.collectionSlug) {
        return `/lists/${props.collectionSlug}`;
      }
      if (currentPath.startsWith("/artist/") && props.collectionSlug) {
        return `/artist/${props.collectionSlug}`;
      }
      return "/artworks";
    };
    const updateUrl = (pathFiltersArray) => {
      const cleanPathFilters = pathFiltersArray.filter((f) => f).join("/");
      const baseUrl = getBaseUrl();
      const targetUrl = cleanPathFilters ? `${baseUrl}/${cleanPathFilters}` : baseUrl;
      const queryParams = {};
      if (props.currentSearchQuery) {
        queryParams.search = props.currentSearchQuery;
      }
      router.visit(targetUrl, {
        data: queryParams,
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    };
    const buildCategoryUrl = (category) => {
      if (category.parent_slug) {
        return `cat_${category.parent_slug}_${category.slug}`;
      }
      return `cat_${category.slug}`;
    };
    const handleCategoryChange = (category) => {
      const newCategorySlug = buildCategoryUrl(category);
      let otherFilters = props.activeFilters.filter((f) => !f.startsWith("cat_"));
      const isCurrentlyActive = props.activeFilters.includes(newCategorySlug);
      if (isCurrentlyActive) {
        updateUrl(otherFilters);
      } else {
        updateUrl([newCategorySlug, ...otherFilters]);
      }
    };
    const handleFormatChange = (formatValue) => {
      let otherFilters = props.activeFilters.filter((f) => !formats.map((opt) => opt.value).includes(f));
      if (props.activeFilters.includes(formatValue)) {
        updateUrl(otherFilters);
      } else {
        updateUrl([formatValue, ...otherFilters]);
      }
    };
    const handleSortChange = (event) => {
      const newSortValue = event.value;
      let otherFilters = props.activeFilters.filter((f) => !sortOptions.map((o) => o.value).includes(f));
      if (newSortValue && newSortValue !== "recommended") {
        otherFilters = [newSortValue, ...otherFilters];
      }
      updateUrl(otherFilters);
    };
    const clearFilters = () => {
      const baseUrl = getBaseUrl();
      const queryParams = {};
      if (props.currentSearchQuery) {
        queryParams.search = props.currentSearchQuery;
      }
      router.visit(baseUrl, {
        data: queryParams,
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<aside${ssrRenderAttrs(mergeProps({ class: "filter-sidebar" }, _attrs))} data-v-2fbd5d36><div class="filter-section" data-v-2fbd5d36><h3 class="filter-title" data-v-2fbd5d36>Sort Order</h3><div class="filter-items" data-v-2fbd5d36>`);
      _push(ssrRenderComponent(unref(Select), {
        modelValue: activeSort.value,
        "onUpdate:modelValue": ($event) => activeSort.value = $event,
        options: sortOptions,
        optionLabel: "label",
        optionValue: "value",
        placeholder: "Select Sort Order",
        class: "w-full",
        onChange: handleSortChange
      }, null, _parent));
      _push(`</div></div><div class="filter-section" data-v-2fbd5d36><h3 class="filter-title" data-v-2fbd5d36>Categories</h3><div class="filter-items" data-v-2fbd5d36><!--[-->`);
      ssrRenderList(categories.value, (sectionItems, sectionName) => {
        _push(`<div class="category-section" data-v-2fbd5d36><h4 class="section-title capitalize" data-v-2fbd5d36>${ssrInterpolate(sectionName)}</h4><div class="category-grid" data-v-2fbd5d36><!--[-->`);
        ssrRenderList(sectionItems, (category) => {
          _push(`<span class="filter-item" data-v-2fbd5d36>`);
          _push(ssrRenderComponent(unref(Checkbox), {
            value: buildCategoryUrl(category),
            modelValue: activeCategory.value,
            "onUpdate:modelValue": ($event) => activeCategory.value = $event,
            onChange: () => handleCategoryChange(category),
            pt: { root: { class: "mr-2" } },
            size: "small",
            inputId: `category-${category.id}`
          }, null, _parent));
          _push(`<label${ssrRenderAttr("for", `category-${category.id}`)} class="filter-label text-sm" data-v-2fbd5d36>${ssrInterpolate(category.name)}</label></span>`);
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]--></div></div><div class="filter-section" data-v-2fbd5d36><h3 class="filter-title" data-v-2fbd5d36>Geometry</h3><div class="filter-items" data-v-2fbd5d36><!--[-->`);
      ssrRenderList(formats, (format) => {
        _push(`<span class="filter-item" data-v-2fbd5d36>`);
        _push(ssrRenderComponent(unref(Checkbox), {
          value: format.value,
          modelValue: activeFormat.value,
          "onUpdate:modelValue": ($event) => activeFormat.value = $event,
          onChange: () => handleFormatChange(format.value),
          pt: { root: { class: "mr-2" } },
          size: "small",
          inputId: format.value
        }, null, _parent));
        _push(`<label${ssrRenderAttr("for", format.value)} class="filter-label" data-v-2fbd5d36><img${ssrRenderAttr("src", format.icon)}${ssrRenderAttr("alt", format.label)} class="${ssrRenderClass([{ "selected": activeFormat.value.includes(format.value) }, "format-icon"])}" data-v-2fbd5d36></label></span>`);
      });
      _push(`<!--]--></div></div><div class="filter-section" data-v-2fbd5d36><h3 class="filter-title" data-v-2fbd5d36>Colors</h3><div class="color-grid" data-v-2fbd5d36><!--[-->`);
      ssrRenderList(colors, (color) => {
        _push(`<span class="${ssrRenderClass([{ "selected": activeColor.value.includes(color.value) }, "color-swatch"])}" style="${ssrRenderStyle({ backgroundColor: color.hex })}"${ssrRenderAttr("title", color.label)} data-v-2fbd5d36></span>`);
      });
      _push(`<!--]--></div></div><div class="flex justify-center items-center mb-4 mt-6" data-v-2fbd5d36>`);
      _push(ssrRenderComponent(unref(Button), {
        icon: "pi pi-eraser",
        onClick: clearFilters,
        label: "Clear Filters",
        severity: "info",
        size: "medium",
        class: "filter-button",
        variant: "outlined",
        raised: ""
      }, null, _parent));
      _push(`</div></aside>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/FilterSidebar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const FilterSidebar = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-2fbd5d36"]]);
const _sfc_main$1 = {
  __name: "FilteredLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const showFilters = ref(false);
    function toggleFilters() {
      showFilters.value = !showFilters.value;
    }
    const currentPageSearchTerm = computed(() => page.props.currentSearchTerm || "");
    provide("layout", {
      toggleFilters,
      isFiltersVisible: computed(() => showFilters.value)
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = Button;
      _push(ssrRenderComponent(HeaderLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="layout-wrapper" data-v-ddb50ac7${_scopeId}><div style="${ssrRenderStyle(showFilters.value ? null : { display: "none" })}" class="sidebar-container" data-v-ddb50ac7${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Button, {
              icon: "pi pi-times",
              onClick: toggleFilters,
              class: "close-button lg:hidden",
              severity: "secondary",
              text: "",
              rounded: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(FilterSidebar, {
              "list-id": _ctx.$page.props.collectionId,
              "collection-slug": _ctx.$page.props.collectionSlug,
              "active-filters": _ctx.$page.props.filters || [],
              "current-search-query": currentPageSearchTerm.value,
              class: "floating-sidebar"
            }, null, _parent2, _scopeId));
            _push2(`</div><main class="${ssrRenderClass(["main-content", { "with-sidebar": showFilters.value }])}" data-v-ddb50ac7${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</main>`);
            if (showFilters.value) {
              _push2(`<div class="sidebar-overlay lg:hidden" data-v-ddb50ac7${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "layout-wrapper" }, [
                createVNode(Transition, { name: "slide" }, {
                  default: withCtx(() => [
                    withDirectives(createVNode("div", { class: "sidebar-container" }, [
                      createVNode(_component_Button, {
                        icon: "pi pi-times",
                        onClick: toggleFilters,
                        class: "close-button lg:hidden",
                        severity: "secondary",
                        text: "",
                        rounded: ""
                      }),
                      createVNode(FilterSidebar, {
                        "list-id": _ctx.$page.props.collectionId,
                        "collection-slug": _ctx.$page.props.collectionSlug,
                        "active-filters": _ctx.$page.props.filters || [],
                        "current-search-query": currentPageSearchTerm.value,
                        class: "floating-sidebar"
                      }, null, 8, ["list-id", "collection-slug", "active-filters", "current-search-query"])
                    ], 512), [
                      [vShow, showFilters.value]
                    ])
                  ]),
                  _: 1
                }),
                createVNode("main", {
                  class: ["main-content", { "with-sidebar": showFilters.value }]
                }, [
                  renderSlot(_ctx.$slots, "default", {}, void 0, true)
                ], 2),
                showFilters.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "sidebar-overlay lg:hidden",
                  onClick: toggleFilters
                })) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/FilteredLayout.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const FilteredLayout = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-ddb50ac7"]]);
const _sfc_main = /* @__PURE__ */ Object.assign({ layout: FilteredLayout }, {
  __name: "Artworks",
  __ssrInlineRender: true,
  props: {
    artworks: { type: Array, default: () => [] },
    collectionId: { type: String, default: null },
    collectionSlug: { type: String, default: null },
    collectionName: { type: String, default: "Artworks" },
    collectionCover: { type: String, default: null },
    collectionDescription: { type: String, default: null },
    filters: { type: Array, default: () => [] },
    currentSearchTerm: String,
    nextPage: { type: Number, default: null },
    initialOrder: { type: String, default: "recommended" },
    isArtistPage: { type: Boolean, default: false }
    // Added prop
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const layout = inject("layout");
    const pageTitle = computed(() => props.collectionName ? `${props.collectionName} Art Prints` : "All Artworks");
    const pageDesc = computed(() => props.collectionDescription || `Browse our collection of ${props.collectionName || "art"} prints.`);
    const localArtworks = ref([]);
    const localNextPage = ref(null);
    const loading = ref(false);
    const artworksLoading = ref(false);
    const localCurrentPageForLoadMore = ref(1);
    const searchQuery = ref("");
    const localCurrentSearchTerm = ref("");
    const unregisterStartListener = router.on("start", () => artworksLoading.value = true);
    const unregisterFinishListener = router.on("finish", () => artworksLoading.value = false);
    const unregisterErrorListener = router.on("error", () => artworksLoading.value = false);
    const performSearchRequest = (searchVal) => {
      var _a, _b;
      artworksLoading.value = true;
      localCurrentSearchTerm.value = searchVal.trim();
      const queryParams = {
        search: localCurrentSearchTerm.value || void 0
      };
      let baseRouteName = ((_a = page.props.ziggy) == null ? void 0 : _a.current_route_name) || "artworks";
      let routeParams = { ...(_b = page.props.ziggy) == null ? void 0 : _b.parameters };
      if (props.filters && props.filters.length > 0 && !routeParams.filters) {
        routeParams.filters = props.filters.join("/");
      }
      if (baseRouteName === "collection.show" && !routeParams.collection_slug && props.collectionSlug) {
        routeParams.collection_slug = props.collectionSlug;
      } else if (baseRouteName === "lists.show" && !routeParams.list_id && props.collectionId) {
        routeParams.list_id = props.collectionId;
      } else if (baseRouteName === "artist.show" && !routeParams.artist_id && props.collectionId) {
        routeParams.artist_id = props.collectionId;
      }
      router.get(route(baseRouteName, routeParams), queryParams, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        onSuccess: (newPage) => {
          searchQuery.value = newPage.props.currentSearchTerm || "";
          localCurrentSearchTerm.value = newPage.props.currentSearchTerm || "";
        },
        onFinish: () => {
        }
      });
    };
    const debouncedPerformSearch = debounce((newValue) => {
      performSearchRequest(newValue);
    }, 1e3);
    watch(searchQuery, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        debouncedPerformSearch(newValue);
      }
    });
    const clearSearch = () => {
      searchQuery.value = "";
    };
    onMounted(() => {
      localArtworks.value = Array.isArray(props.artworks) ? [...props.artworks] : [];
      localNextPage.value = props.nextPage;
      localCurrentPageForLoadMore.value = props.nextPage ? props.nextPage - 1 : props.artworks.length > 0 ? 1 : null;
      searchQuery.value = props.currentSearchTerm || "";
      localCurrentSearchTerm.value = props.currentSearchTerm || "";
      window.addEventListener("scroll", handleScroll);
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
      unregisterStartListener();
      unregisterFinishListener();
      unregisterErrorListener();
    });
    watch(() => props.artworks, (newArtworks) => {
      if (!loading.value) {
        localArtworks.value = Array.isArray(newArtworks) ? [...newArtworks] : [];
      }
    }, { deep: true });
    watch(() => props.nextPage, (newNextPage) => {
      localNextPage.value = newNextPage;
      localCurrentPageForLoadMore.value = newNextPage ? newNextPage - 1 : localArtworks.value.length > 0 ? 1 : null;
    });
    watch(() => props.currentSearchTerm, (newSearchTerm) => {
      searchQuery.value = newSearchTerm || "";
      localCurrentSearchTerm.value = newSearchTerm || "";
    });
    const loadMoreArtworks = async () => {
      var _a, _b;
      if (!localNextPage.value || loading.value) return;
      loading.value = true;
      try {
        let baseRouteName = ((_a = page.props.ziggy) == null ? void 0 : _a.current_route_name) || "artworks";
        const response = await axios.get(route("artworks.fetch"), {
          params: {
            page: localNextPage.value,
            per_page: 30,
            collection_id: baseRouteName === "collection.show" ? props.collectionId : null,
            list_id: baseRouteName === "lists.show" ? props.collectionId : null,
            artist_id: baseRouteName === "artist.show" ? props.collectionId : null,
            filters: (_b = props.filters) == null ? void 0 : _b.join("/"),
            order: props.initialOrder,
            search: localCurrentSearchTerm.value || void 0
          }
        });
        if (response.data.artworks && response.data.artworks.length > 0) {
          localArtworks.value.push(...response.data.artworks);
          localNextPage.value = response.data.nextPage;
          localCurrentPageForLoadMore.value = response.data.nextPage ? response.data.nextPage - 1 : null;
        } else {
          localNextPage.value = null;
        }
      } catch (error) {
        console.error("Error loading more artworks:", error);
      } finally {
        loading.value = false;
      }
    };
    const handleScroll = debounce(() => {
      const bottomOfWindow = window.innerHeight + window.pageYOffset;
      const documentHeight = document.documentElement.offsetHeight;
      if (bottomOfWindow >= documentHeight - 500 && localNextPage.value && !loading.value) {
        loadMoreArtworks();
      }
    }, 200);
    const artworks = computed(() => localArtworks.value);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-50833077${_scopeId}>${ssrInterpolate(pageTitle.value)}</title><meta name="description"${ssrRenderAttr("content", pageDesc.value)} data-v-50833077${_scopeId}><meta property="og:title"${ssrRenderAttr("content", pageTitle.value)} data-v-50833077${_scopeId}><meta property="og:description"${ssrRenderAttr("content", pageDesc.value)} data-v-50833077${_scopeId}>`);
            if (__props.collectionCover) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", __props.collectionCover)} data-v-50833077${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(pageTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: pageDesc.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:title",
                content: pageTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: pageDesc.value
              }, null, 8, ["content"]),
              __props.collectionCover ? (openBlock(), createBlock("meta", {
                key: 0,
                property: "og:image",
                content: __props.collectionCover
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="layout-container" data-v-50833077><main class="main-content" data-v-50833077><div class="content-wrapper" data-v-50833077>`);
      if (props.collectionId) {
        _push(`<div class="collection-header mb-8" data-v-50833077>`);
        if (props.collectionCover) {
          _push(`<div class="${ssrRenderClass([
            "mb-4 mx-auto",
            props.isArtistPage ? "artist-cover-wrapper" : "collection-cover-image-wrapper"
          ])}" data-v-50833077><img${ssrRenderAttr("src", props.collectionCover)}${ssrRenderAttr("alt", `Cover image for ${props.collectionName}`)} class="${ssrRenderClass(props.isArtistPage ? "artist-cover-image" : "collection-cover-image")}" data-v-50833077></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<h1 class="collection-title text-3xl md:text-4xl font-bold text-center mb-2" data-v-50833077>${ssrInterpolate(props.collectionName)}</h1>`);
        if (props.collectionDescription) {
          _push(`<p class="collection-description text-center text-gray-600 text-sm md:text-base max-w-3xl mx-auto" data-v-50833077>${ssrInterpolate(props.collectionDescription)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mb-6 px-4 md:px-0 max-w-xl mx-auto" data-v-50833077>`);
      _push(ssrRenderComponent(unref(IconField), {
        iconPosition: "left",
        class: "w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(InputIcon), { class: "pi pi-search" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(InputText), {
              modelValue: searchQuery.value,
              "onUpdate:modelValue": ($event) => searchQuery.value = $event,
              placeholder: "Search for artworks...",
              class: "w-full p-inputtext-lg",
              "aria-label": "Search artworks"
            }, null, _parent2, _scopeId));
            if (searchQuery.value || localCurrentSearchTerm.value) {
              _push2(ssrRenderComponent(unref(InputIcon), {
                class: "pi pi-times cursor-pointer text-gray-500 hover:text-gray-700",
                "aria-label": "Clear Search",
                onClick: clearSearch,
                tabindex: "0",
                onKeydown: [clearSearch, clearSearch]
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(unref(InputIcon), { class: "pi pi-search" }),
              createVNode(unref(InputText), {
                modelValue: searchQuery.value,
                "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                placeholder: "Search for artworks...",
                class: "w-full p-inputtext-lg",
                "aria-label": "Search artworks"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              searchQuery.value || localCurrentSearchTerm.value ? (openBlock(), createBlock(unref(InputIcon), {
                key: 0,
                class: "pi pi-times cursor-pointer text-gray-500 hover:text-gray-700",
                "aria-label": "Clear Search",
                onClick: clearSearch,
                tabindex: "0",
                onKeydown: [
                  withKeys(clearSearch, ["enter"]),
                  withKeys(clearSearch, ["space"])
                ]
              })) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex justify-center items-center mb-6" data-v-50833077>`);
      _push(ssrRenderComponent(unref(Button), {
        icon: "pi pi-filter",
        onClick: ($event) => {
          var _a2;
          return (_a2 = unref(layout)) == null ? void 0 : _a2.toggleFilters();
        },
        label: ((_b = (_a = unref(layout)) == null ? void 0 : _a.isFiltersVisible) == null ? void 0 : _b.value) ? "Hide Filters" : "Filters",
        severity: "info",
        size: "large",
        class: "filter-button",
        variant: "outlined",
        raised: ""
      }, null, _parent));
      _push(`</div>`);
      if (artworksLoading.value && !artworks.value.length) {
        _push(`<div class="my-2 flex items-center justify-center col-span-full" data-v-50833077>`);
        _push(ssrRenderComponent(unref(ProgressSpinner), {
          strokeWidth: "3",
          animationDuration: ".8s",
          class: "loading-spinner"
        }, null, _parent));
        _push(`</div>`);
      } else if (!artworks.value.length && !artworksLoading.value) {
        _push(`<div class="no-results text-center py-10" data-v-50833077><h2 class="text-xl font-semibold mb-2" data-v-50833077>No artworks found</h2><p class="text-gray-600" data-v-50833077>We didn&#39;t find any artworks matching your criteria. Try another search term or adjust your filters.</p></div>`);
      } else {
        _push(ssrRenderComponent(unref(DataView), {
          value: artworks.value,
          layout: "grid"
        }, {
          grid: withCtx((slotProps, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-12 gap-4 md:gap-8" data-v-50833077${_scopeId}><!--[-->`);
              ssrRenderList(slotProps.items, (artwork, index) => {
                _push2(`<div class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 p-2" data-v-50833077${_scopeId}><div class="rounded flex flex-col artwork-container" data-v-50833077${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("artwork.details", {
                    id: artwork.pictufy_id,
                    slug: unref(slugify)(artwork.title || "artwork")
                  }),
                  class: "artwork-link"
                }, {
                  default: withCtx((_, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="relative" data-v-50833077${_scopeId2}>`);
                      if (artwork.img_thumb) {
                        _push3(`<img${ssrRenderAttr("src", artwork.img_thumb)}${ssrRenderAttr("alt", artwork.title || "Untitled")} class="rounded w-full h-auto object-contain max-h-[300px]" data-v-50833077${_scopeId2}>`);
                      } else {
                        _push3(`<div class="no-image" data-v-50833077${_scopeId2}>No Image Available</div>`);
                      }
                      _push3(`<div class="artwork-overlay" data-v-50833077${_scopeId2}><div class="overlay-content" data-v-50833077${_scopeId2}><span class="artwork-title" data-v-50833077${_scopeId2}>${ssrInterpolate(artwork.title || "Untitled")}</span>`);
                      _push3(ssrRenderComponent(unref(Divider), { layout: "vertical" }, null, _parent3, _scopeId2));
                      _push3(`<span class="artwork-id" data-v-50833077${_scopeId2}>ID: ${ssrInterpolate(artwork.pictufy_id)}</span></div></div></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "relative" }, [
                          artwork.img_thumb ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: artwork.img_thumb,
                            alt: artwork.title || "Untitled",
                            class: "rounded w-full h-auto object-contain max-h-[300px]"
                          }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "no-image"
                          }, "No Image Available")),
                          createVNode("div", { class: "artwork-overlay" }, [
                            createVNode("div", { class: "overlay-content" }, [
                              createVNode("span", { class: "artwork-title" }, toDisplayString(artwork.title || "Untitled"), 1),
                              createVNode(unref(Divider), { layout: "vertical" }),
                              createVNode("span", { class: "artwork-id" }, "ID: " + toDisplayString(artwork.pictufy_id), 1)
                            ])
                          ])
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-12 gap-4 md:gap-8" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(slotProps.items, (artwork, index) => {
                    return openBlock(), createBlock("div", {
                      key: artwork.id || index,
                      class: "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 p-2"
                    }, [
                      createVNode("div", { class: "rounded flex flex-col artwork-container" }, [
                        createVNode(unref(Link), {
                          href: _ctx.route("artwork.details", {
                            id: artwork.pictufy_id,
                            slug: unref(slugify)(artwork.title || "artwork")
                          }),
                          class: "artwork-link"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "relative" }, [
                              artwork.img_thumb ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: artwork.img_thumb,
                                alt: artwork.title || "Untitled",
                                class: "rounded w-full h-auto object-contain max-h-[300px]"
                              }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "no-image"
                              }, "No Image Available")),
                              createVNode("div", { class: "artwork-overlay" }, [
                                createVNode("div", { class: "overlay-content" }, [
                                  createVNode("span", { class: "artwork-title" }, toDisplayString(artwork.title || "Untitled"), 1),
                                  createVNode(unref(Divider), { layout: "vertical" }),
                                  createVNode("span", { class: "artwork-id" }, "ID: " + toDisplayString(artwork.pictufy_id), 1)
                                ])
                              ])
                            ])
                          ]),
                          _: 2
                        }, 1032, ["href"])
                      ])
                    ]);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      if (loading.value && localNextPage.value) {
        _push(`<div class="loading-container" data-v-50833077>`);
        _push(ssrRenderComponent(unref(ProgressSpinner), {
          strokeWidth: "3",
          animationDuration: ".8s",
          class: "loading-spinner"
        }, null, _parent));
        _push(`<p class="loading-text" data-v-50833077>Loading more artworks...</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></main></div>`);
      _push(ssrRenderComponent(unref(ScrollTop), {
        icon: "pi pi-arrow-up",
        buttonProps: { severity: "secondary", raised: true, rounded: true, size: "large" }
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Artworks.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Artworks = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-50833077"]]);
export {
  Artworks as default
};
