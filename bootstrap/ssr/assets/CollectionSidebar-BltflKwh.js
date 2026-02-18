import { computed, ref, watch, mergeProps, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { usePage, router, Link } from "@inertiajs/vue3";
import PanelMenu from "primevue/panelmenu";
import { _ as _export_sfc } from "../ssr.js";
const _sfc_main = {
  __name: "CollectionSidebar",
  __ssrInlineRender: true,
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    usePage();
    const collectionTreeData = computed(() => props.categories);
    const showMoreState = ref({});
    const toggleShowMoreCollections = (categoryId) => {
      showMoreState.value[categoryId] = !showMoreState.value[categoryId];
    };
    const expandedCategoryKeys = ref({});
    const menuItems = computed(() => {
      return (collectionTreeData.value || []).map((category) => {
        const collections = category.collections || [];
        const isShowMoreActive = showMoreState.value[category.category_id] || false;
        const visibleCollections = isShowMoreActive ? collections : collections.slice(0, 3);
        const subItems = visibleCollections.map((collection) => ({
          label: collection.name,
          key: `${category.category_id}-${collection.id}`,
          // Unique key for sub-item
          command: () => {
            router.visit(route("collection.show", { collection_slug: collection.slug }));
          }
        }));
        if (collections.length > 3) {
          subItems.push({
            label: isShowMoreActive ? "- Show less" : `+ Show ${collections.length - 3} more`,
            key: `${category.category_id}-${isShowMoreActive ? "showless" : "showmore"}`,
            command: (event) => {
              if (event && event.originalEvent) {
                event.originalEvent.stopPropagation();
              }
              toggleShowMoreCollections(category.category_id);
            },
            class: "show-more-item"
          });
        }
        return {
          key: category.category_id,
          // This key will be used in expandedCategoryKeys
          label: category.category_name,
          items: subItems.length > 0 ? subItems : void 0,
          // Only add items array if there are collections/showMore
          command: () => {
            router.visit(route("collections.category.show", { category_collection_slug: category.category_slug }));
          }
        };
      });
    });
    watch(collectionTreeData, (newTreeData) => {
      const keys = {};
      if (newTreeData && Array.isArray(newTreeData)) {
        newTreeData.forEach((category) => {
          if (category.category_id) {
            keys[category.category_id] = true;
          }
        });
      }
      expandedCategoryKeys.value = keys;
    }, { immediate: true, deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<aside${ssrRenderAttrs(mergeProps({ class: "collection-sidebar print:hidden" }, _attrs))} data-v-3714b298><div class="sidebar-content" data-v-3714b298>`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("collections.index"),
        class: "text-lg font-semibold mb-4 px-3 text-gray-700 hover:text-primary-600 no-underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 data-v-3714b298${_scopeId}>All Collections</h3>`);
          } else {
            return [
              createVNode("h3", null, "All Collections")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(PanelMenu), {
        model: menuItems.value,
        expandedKeys: expandedCategoryKeys.value,
        "onUpdate:expandedKeys": ($event) => expandedCategoryKeys.value = $event,
        class: "w-full custom-panel-menu",
        multiple: ""
      }, null, _parent));
      _push(`</div></aside>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/CollectionSidebar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CollectionSidebar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3714b298"]]);
export {
  CollectionSidebar as C
};
