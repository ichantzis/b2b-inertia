import { ref, watch, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, createTextVNode, useSSRContext, reactive } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { useForm, Head, router } from "@inertiajs/vue3";
import { A as AdminLayout } from "./AdminLayout-CbDljQzr.js";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import ToggleSwitch from "primevue/toggleswitch";
import Divider$1 from "primevue/divider";
import TabPanel from "primevue/tabpanel";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import { useToast } from "primevue/usetoast";
import { a as _sfc_main$2, P as PageTitleSection } from "../ssr.js";
import InputNumber from "primevue/inputnumber";
import Dialog from "primevue/dialog";
import { Divider } from "primevue";
import "primevue/panelmenu";
import "./ApplicationLogo-rkFqmqnV.js";
import "primevue/toast";
import "primevue/drawer";
import "@inertiajs/vue3/server";
import "@vue/server-renderer";
import "primevue/config";
import "primevue/toastservice";
import "primevue/confirmationservice";
import "@primeuix/themes/aura";
import "@primeuix/themes";
const _sfc_main$1 = {
  __name: "PricingListEditor",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Array, required: true },
    isSaving: { type: Boolean, default: false },
    showOilPrice: { type: Boolean, default: false }
  },
  emits: ["update:modelValue", "save"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const errors = ref({});
    const isAddDialogVisible = ref(false);
    const isDeleteDialogVisible = ref(false);
    const newItem = ref({ size: "", price: null, oil_price: null });
    const newItemError = ref(null);
    const itemToDeleteIndex = ref(null);
    watch(() => props.isSaving, (isNowSaving, wasSaving) => {
      if (wasSaving && !isNowSaving) {
        if (isAddDialogVisible.value) isAddDialogVisible.value = false;
        if (isDeleteDialogVisible.value) isDeleteDialogVisible.value = false;
      }
    });
    const isValidSize = (s) => /^\d+x\d+$/.test(s);
    const isSquare = (s) => {
      if (!isValidSize(s)) return false;
      const [w, h] = s.split("x").map(Number);
      return w === h;
    };
    const sortPricingList = (list) => {
      return list.sort((a, b) => {
        if (!isValidSize(a.size) || !isValidSize(b.size)) return 0;
        const [w1, h1] = a.size.split("x").map(Number);
        const [w2, h2] = b.size.split("x").map(Number);
        const isSq1 = w1 === h1;
        const isSq2 = w2 === h2;
        if (isSq1 !== isSq2) return isSq1 ? 1 : -1;
        if (w1 !== w2) return w1 - w2;
        return h1 - h2;
      });
    };
    const shouldShowDivider = (index) => {
      if (index === 0) return false;
      const currentItem = props.modelValue[index];
      const prevItem = props.modelValue[index - 1];
      if (!currentItem || !prevItem) return false;
      const prevIsSquare = isSquare(prevItem.size);
      const currIsSquare = isSquare(currentItem.size);
      return !prevIsSquare && currIsSquare;
    };
    const emitSave = (message = null) => emit("save", message);
    const handleSizeBlur = (index) => {
      const item = props.modelValue[index];
      if (!item.size) return;
      const result = processSizeInput(item.size, index);
      if (result.error) {
        errors.value[index] = result.error;
        return;
      }
      let newList = [...props.modelValue];
      newList[index] = { ...item, size: result.normalizedSize };
      newList = sortPricingList(newList);
      emit("update:modelValue", newList);
      errors.value = {};
    };
    const processSizeInput = (inputSize, ignoreIndex = -1) => {
      let rawSize = inputSize.toLowerCase().trim();
      if (!rawSize.includes("x")) return { error: "Format: WxH" };
      const [d1, d2] = rawSize.split("x").map((n) => parseInt(n));
      if (isNaN(d1) || isNaN(d2)) return { error: "Invalid numbers" };
      const w = Math.min(d1, d2);
      const h = Math.max(d1, d2);
      const normalizedSize = `${w}x${h}`;
      const isDuplicate = props.modelValue.some((existingItem, i) => {
        return i !== ignoreIndex && existingItem.size === normalizedSize;
      });
      if (isDuplicate) return { error: "Exists" };
      return { normalizedSize, error: null };
    };
    const openAddItemDialog = () => {
      newItem.value = { size: "", price: null, oil_price: null };
      newItemError.value = null;
      isAddDialogVisible.value = true;
    };
    const confirmAddItem = () => {
      if (!newItem.value.size) {
        newItemError.value = "Required";
        return;
      }
      const result = processSizeInput(newItem.value.size);
      if (result.error) {
        newItemError.value = result.error;
        return;
      }
      let newArray = [...props.modelValue, {
        size: result.normalizedSize,
        price: newItem.value.price || 0,
        oil_price: props.showOilPrice ? newItem.value.oil_price || 0 : null
      }];
      newArray = sortPricingList(newArray);
      emit("update:modelValue", newArray);
      emitSave("Added");
    };
    const openDeleteDialog = (index) => {
      itemToDeleteIndex.value = index;
      isDeleteDialogVisible.value = true;
    };
    const confirmDelete = () => {
      if (itemToDeleteIndex.value === null) return;
      const newArray = props.modelValue.filter((_, i) => i !== itemToDeleteIndex.value);
      emit("update:modelValue", newArray);
      emitSave("Deleted");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="grid grid-cols-12 gap-4 mb-2 font-semibold text-gray-500 text-sm px-2"><div class="col-span-4">Size (WxH)</div><div class="${ssrRenderClass(__props.showOilPrice ? "col-span-3" : "col-span-6")}">Mono Price (€)</div>`);
      if (__props.showOilPrice) {
        _push(`<div class="col-span-3">Oil Price (€)</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="col-span-2 text-center">Action</div></div><!--[-->`);
      ssrRenderList(__props.modelValue, (item, index) => {
        _push(`<!--[-->`);
        if (shouldShowDivider(index)) {
          _push(`<div class="col-span-12 flex items-center gap-4 my-4">`);
          _push(ssrRenderComponent(unref(Divider), {
            align: "left",
            type: "solid",
            class: "m-0"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="text-xs font-bold text-gray-500 uppercase tracking-wider"${_scopeId}>Square Sizes</span>`);
              } else {
                return [
                  createVNode("span", { class: "text-xs font-bold text-gray-500 uppercase tracking-wider" }, "Square Sizes")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-12 gap-4 mb-2 items-center"><div class="col-span-4">`);
        _push(ssrRenderComponent(unref(InputText), {
          modelValue: item.size,
          "onUpdate:modelValue": ($event) => item.size = $event,
          placeholder: "WxH",
          class: ["w-full p-inputtext-sm", { "p-invalid": errors.value[index] }],
          onBlur: ($event) => handleSizeBlur(index),
          onInput: ($event) => errors.value[index] = null
        }, null, _parent));
        if (errors.value[index]) {
          _push(`<small class="text-red-500 text-xs block mt-1">${ssrInterpolate(errors.value[index])}</small>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="${ssrRenderClass(__props.showOilPrice ? "col-span-3" : "col-span-6")}">`);
        _push(ssrRenderComponent(unref(InputNumber), {
          modelValue: item.price,
          "onUpdate:modelValue": ($event) => item.price = $event,
          mode: "currency",
          currency: "EUR",
          locale: "el-GR",
          class: "w-full p-inputtext-sm",
          min: 0
        }, null, _parent));
        _push(`</div>`);
        if (__props.showOilPrice) {
          _push(`<div class="col-span-3">`);
          _push(ssrRenderComponent(unref(InputNumber), {
            modelValue: item.oil_price,
            "onUpdate:modelValue": ($event) => item.oil_price = $event,
            mode: "currency",
            currency: "EUR",
            locale: "el-GR",
            class: "w-full p-inputtext-sm",
            min: 0,
            placeholder: "-"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="col-span-2 text-center">`);
        _push(ssrRenderComponent(unref(Button), {
          icon: "pi pi-trash",
          severity: "danger",
          text: "",
          rounded: "",
          onClick: ($event) => openDeleteDialog(index)
        }, null, _parent));
        _push(`</div></div><!--]-->`);
      });
      _push(`<!--]--><div class="mt-4">`);
      _push(ssrRenderComponent(unref(Button), {
        label: "Add New Size",
        icon: "pi pi-plus",
        size: "small",
        outlined: "",
        onClick: openAddItemDialog
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(Dialog), {
        visible: isAddDialogVisible.value,
        "onUpdate:visible": ($event) => isAddDialogVisible.value = $event,
        modal: "",
        header: "Add New Size",
        style: { width: "35rem" },
        closable: !__props.isSaving,
        closeOnEscape: !__props.isSaving
      }, {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Button), {
              label: "Cancel",
              icon: "pi pi-times",
              text: "",
              onClick: ($event) => isAddDialogVisible.value = false,
              disabled: __props.isSaving
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Button), {
              label: "Add",
              icon: "pi pi-check",
              onClick: confirmAddItem,
              loading: __props.isSaving
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Button), {
                label: "Cancel",
                icon: "pi pi-times",
                text: "",
                onClick: ($event) => isAddDialogVisible.value = false,
                disabled: __props.isSaving
              }, null, 8, ["onClick", "disabled"]),
              createVNode(unref(Button), {
                label: "Add",
                icon: "pi pi-check",
                onClick: confirmAddItem,
                loading: __props.isSaving
              }, null, 8, ["loading"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-4 pt-2"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Size (WxH)</label>`);
            _push2(ssrRenderComponent(unref(InputText), {
              modelValue: newItem.value.size,
              "onUpdate:modelValue": ($event) => newItem.value.size = $event,
              placeholder: "e.g. 50x70",
              class: ["w-full", { "p-invalid": newItemError.value }],
              onInput: ($event) => newItemError.value = null,
              autofocus: "",
              disabled: __props.isSaving
            }, null, _parent2, _scopeId));
            if (newItemError.value) {
              _push2(`<small class="text-red-500 text-xs block mt-1"${_scopeId}>${ssrInterpolate(newItemError.value)}</small>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="${ssrRenderClass([__props.showOilPrice ? "grid-cols-2" : "grid-cols-1", "grid gap-4"])}"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>`);
            if (__props.showOilPrice) {
              _push2(`<span${_scopeId}>Mono </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`Price (€) </label>`);
            _push2(ssrRenderComponent(unref(InputNumber), {
              modelValue: newItem.value.price,
              "onUpdate:modelValue": ($event) => newItem.value.price = $event,
              mode: "currency",
              currency: "EUR",
              locale: "el-GR",
              class: "w-full",
              min: 0,
              disabled: __props.isSaving
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (__props.showOilPrice) {
              _push2(`<div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Oil Price (€)</label>`);
              _push2(ssrRenderComponent(unref(InputNumber), {
                modelValue: newItem.value.oil_price,
                "onUpdate:modelValue": ($event) => newItem.value.oil_price = $event,
                mode: "currency",
                currency: "EUR",
                locale: "el-GR",
                class: "w-full",
                min: 0,
                disabled: __props.isSaving
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col gap-4 pt-2" }, [
                createVNode("div", null, [
                  createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Size (WxH)"),
                  createVNode(unref(InputText), {
                    modelValue: newItem.value.size,
                    "onUpdate:modelValue": ($event) => newItem.value.size = $event,
                    placeholder: "e.g. 50x70",
                    class: ["w-full", { "p-invalid": newItemError.value }],
                    onInput: ($event) => newItemError.value = null,
                    autofocus: "",
                    disabled: __props.isSaving
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class", "onInput", "disabled"]),
                  newItemError.value ? (openBlock(), createBlock("small", {
                    key: 0,
                    class: "text-red-500 text-xs block mt-1"
                  }, toDisplayString(newItemError.value), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", {
                  class: ["grid gap-4", __props.showOilPrice ? "grid-cols-2" : "grid-cols-1"]
                }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, [
                      __props.showOilPrice ? (openBlock(), createBlock("span", { key: 0 }, "Mono ")) : createCommentVNode("", true),
                      createTextVNode("Price (€) ")
                    ]),
                    createVNode(unref(InputNumber), {
                      modelValue: newItem.value.price,
                      "onUpdate:modelValue": ($event) => newItem.value.price = $event,
                      mode: "currency",
                      currency: "EUR",
                      locale: "el-GR",
                      class: "w-full",
                      min: 0,
                      disabled: __props.isSaving
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ]),
                  __props.showOilPrice ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Oil Price (€)"),
                    createVNode(unref(InputNumber), {
                      modelValue: newItem.value.oil_price,
                      "onUpdate:modelValue": ($event) => newItem.value.oil_price = $event,
                      mode: "currency",
                      currency: "EUR",
                      locale: "el-GR",
                      class: "w-full",
                      min: 0,
                      disabled: __props.isSaving
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ])) : createCommentVNode("", true)
                ], 2)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Dialog), {
        visible: isDeleteDialogVisible.value,
        "onUpdate:visible": ($event) => isDeleteDialogVisible.value = $event,
        modal: "",
        header: "Confirm Deletion",
        style: { width: "25rem" },
        closable: !__props.isSaving,
        closeOnEscape: !__props.isSaving
      }, {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Button), {
              label: "Cancel",
              icon: "pi pi-times",
              text: "",
              severity: "secondary",
              onClick: ($event) => isDeleteDialogVisible.value = false,
              disabled: __props.isSaving
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Button), {
              label: "Delete",
              icon: "pi pi-trash",
              severity: "danger",
              onClick: confirmDelete,
              loading: __props.isSaving
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Button), {
                label: "Cancel",
                icon: "pi pi-times",
                text: "",
                severity: "secondary",
                onClick: ($event) => isDeleteDialogVisible.value = false,
                disabled: __props.isSaving
              }, null, 8, ["onClick", "disabled"]),
              createVNode(unref(Button), {
                label: "Delete",
                icon: "pi pi-trash",
                severity: "danger",
                onClick: confirmDelete,
                loading: __props.isSaving
              }, null, 8, ["loading"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-3 mb-4"${_scopeId}><i class="pi pi-exclamation-triangle text-red-500 text-3xl"${_scopeId}></i><span class="text-gray-700"${_scopeId}>Are you sure you want to delete this size?</span></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-3 mb-4" }, [
                createVNode("i", { class: "pi pi-exclamation-triangle text-red-500 text-3xl" }),
                createVNode("span", { class: "text-gray-700" }, "Are you sure you want to delete this size?")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/dashboard/PricingListEditor.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "Settings",
  __ssrInlineRender: true,
  props: {
    settings: Object
  },
  setup(__props) {
    const props = __props;
    const toast = useToast();
    const toggles = reactive({
      require_login_for_prices: !!props.settings.require_login_for_prices,
      allow_public_registration: !!props.settings.allow_public_registration
    });
    const updateToggle = (key) => {
      router.post(route("dashboard.settings.update"), {
        [key]: toggles[key]
      }, {
        preserveScroll: true,
        onSuccess: () => {
          toast.add({ severity: "success", summary: "Updated", detail: "Setting updated.", life: 3e3 });
        },
        onError: () => {
          toggles[key] = !toggles[key];
          toast.add({ severity: "error", summary: "Error", detail: "Failed to update setting.", life: 3e3 });
        }
      });
    };
    const emailForm = useForm({
      admin_notification_email: props.settings.admin_notification_email || ""
    });
    const submitEmail = () => {
      emailForm.post(route("dashboard.settings.update"), {
        preserveScroll: true,
        onSuccess: () => {
          toast.add({ severity: "success", summary: "Saved", detail: "Admin email updated.", life: 3e3 });
        }
      });
    };
    const pricingForm = useForm({
      pricing_config: props.settings.pricing_config || {}
    });
    const submitPricing = (message = "Price list saved.") => {
      const successMessage = typeof message === "string" ? message : "Price list saved.";
      pricingForm.post(route("dashboard.settings.update"), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page) => {
          pricingForm.pricing_config = page.props.settings.pricing_config;
          pricingForm.defaults({
            pricing_config: page.props.settings.pricing_config
          });
          toast.add({ severity: "success", summary: "Updated", detail: successMessage, life: 3e3 });
        },
        onError: () => {
          toast.add({ severity: "error", summary: "Error", detail: "Failed to save prices.", life: 3e3 });
        }
      });
    };
    const processingCommand = ref(null);
    const runCommand = (key) => {
      processingCommand.value = key;
      router.post(route("dashboard.settings.command"), {
        command_key: key
      }, {
        preserveScroll: true,
        onFinish: () => {
          processingCommand.value = null;
        },
        onError: () => {
          toast.add({ severity: "error", summary: "Error", detail: "Operation failed.", life: 3e3 });
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AdminLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Settings" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$2, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(PageTitleSection, { title: "Settings" }, null, _parent3, _scopeId2));
                  _push3(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Card), { class: "h-full" }, {
                    title: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex items-center gap-2"${_scopeId3}><i class="pi pi-cog text-xl"${_scopeId3}></i><span${_scopeId3}>General Configuration</span></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("i", { class: "pi pi-cog text-xl" }),
                            createVNode("span", null, "General Configuration")
                          ])
                        ];
                      }
                    }),
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="field"${_scopeId3}><label for="admin_email" class="block font-medium mb-2 text-gray-700"${_scopeId3}> Admin Notification Email </label><span class="p-input-icon-left w-full"${_scopeId3}><i class="pi pi-envelope"${_scopeId3}></i>`);
                        _push4(ssrRenderComponent(unref(InputText), {
                          id: "admin_email",
                          modelValue: unref(emailForm).admin_notification_email,
                          "onUpdate:modelValue": ($event) => unref(emailForm).admin_notification_email = $event,
                          class: "w-full",
                          placeholder: "admin@example.com"
                        }, null, _parent4, _scopeId3));
                        _push4(`</span><small class="text-gray-500 block mt-1"${_scopeId3}>Order notifications are sent here.</small>`);
                        if (unref(emailForm).errors.admin_notification_email) {
                          _push4(`<div class="text-red-500 text-xs mt-1"${_scopeId3}>${ssrInterpolate(unref(emailForm).errors.admin_notification_email)}</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "field" }, [
                            createVNode("label", {
                              for: "admin_email",
                              class: "block font-medium mb-2 text-gray-700"
                            }, " Admin Notification Email "),
                            createVNode("span", { class: "p-input-icon-left w-full" }, [
                              createVNode("i", { class: "pi pi-envelope" }),
                              createVNode(unref(InputText), {
                                id: "admin_email",
                                modelValue: unref(emailForm).admin_notification_email,
                                "onUpdate:modelValue": ($event) => unref(emailForm).admin_notification_email = $event,
                                class: "w-full",
                                placeholder: "admin@example.com"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("small", { class: "text-gray-500 block mt-1" }, "Order notifications are sent here."),
                            unref(emailForm).errors.admin_notification_email ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-red-500 text-xs mt-1"
                            }, toDisplayString(unref(emailForm).errors.admin_notification_email), 1)) : createCommentVNode("", true)
                          ])
                        ];
                      }
                    }),
                    footer: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex justify-end"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(Button), {
                          label: "Save Email",
                          icon: "pi pi-check",
                          size: "small",
                          loading: unref(emailForm).processing,
                          onClick: submitEmail
                        }, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex justify-end" }, [
                            createVNode(unref(Button), {
                              label: "Save Email",
                              icon: "pi pi-check",
                              size: "small",
                              loading: unref(emailForm).processing,
                              onClick: submitEmail
                            }, null, 8, ["loading"])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Card), { class: "h-full" }, {
                    title: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex items-center gap-2"${_scopeId3}><i class="pi pi-lock text-xl"${_scopeId3}></i><span${_scopeId3}>Access Control</span></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("i", { class: "pi pi-lock text-xl" }),
                            createVNode("span", null, "Access Control")
                          ])
                        ];
                      }
                    }),
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex items-center justify-between p-2 rounded"${_scopeId3}><div class="mr-4"${_scopeId3}><div class="font-medium text-gray-800"${_scopeId3}>Hide Prices for Guests</div><div class="text-sm text-gray-500"${_scopeId3}> Users must log in to view prices/cart. </div></div>`);
                        _push4(ssrRenderComponent(unref(ToggleSwitch), {
                          modelValue: toggles.require_login_for_prices,
                          "onUpdate:modelValue": ($event) => toggles.require_login_for_prices = $event,
                          onChange: ($event) => updateToggle("require_login_for_prices")
                        }, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                        _push4(ssrRenderComponent(unref(Divider$1), null, null, _parent4, _scopeId3));
                        _push4(`<div class="flex items-center justify-between p-2 rounded"${_scopeId3}><div class="mr-4"${_scopeId3}><div class="font-medium text-gray-800"${_scopeId3}>Open Public Registration</div><div class="text-sm text-gray-500"${_scopeId3}> If disabled, guests request access. </div></div>`);
                        _push4(ssrRenderComponent(unref(ToggleSwitch), {
                          modelValue: toggles.allow_public_registration,
                          "onUpdate:modelValue": ($event) => toggles.allow_public_registration = $event,
                          onChange: ($event) => updateToggle("allow_public_registration")
                        }, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex items-center justify-between p-2 rounded" }, [
                            createVNode("div", { class: "mr-4" }, [
                              createVNode("div", { class: "font-medium text-gray-800" }, "Hide Prices for Guests"),
                              createVNode("div", { class: "text-sm text-gray-500" }, " Users must log in to view prices/cart. ")
                            ]),
                            createVNode(unref(ToggleSwitch), {
                              modelValue: toggles.require_login_for_prices,
                              "onUpdate:modelValue": ($event) => toggles.require_login_for_prices = $event,
                              onChange: ($event) => updateToggle("require_login_for_prices")
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "onChange"])
                          ]),
                          createVNode(unref(Divider$1)),
                          createVNode("div", { class: "flex items-center justify-between p-2 rounded" }, [
                            createVNode("div", { class: "mr-4" }, [
                              createVNode("div", { class: "font-medium text-gray-800" }, "Open Public Registration"),
                              createVNode("div", { class: "text-sm text-gray-500" }, " If disabled, guests request access. ")
                            ]),
                            createVNode(unref(ToggleSwitch), {
                              modelValue: toggles.allow_public_registration,
                              "onUpdate:modelValue": ($event) => toggles.allow_public_registration = $event,
                              onChange: ($event) => updateToggle("allow_public_registration")
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "onChange"])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Card), { class: "h-full" }, {
                    title: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex items-center gap-2"${_scopeId3}><i class="pi pi-cloud-download text-xl"${_scopeId3}></i><span${_scopeId3}>Pictufy Sync Operations</span></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("i", { class: "pi pi-cloud-download text-xl" }),
                            createVNode("span", null, "Pictufy Sync Operations")
                          ])
                        ];
                      }
                    }),
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex flex-col gap-4"${_scopeId3}><div class="flex items-center justify-between border-b pb-3 border-gray-100"${_scopeId3}><div${_scopeId3}><div class="font-medium text-gray-800"${_scopeId3}>Sync Recent Artworks</div><div class="text-xs text-gray-500"${_scopeId3}>Fetches latest 200 items</div></div>`);
                        _push4(ssrRenderComponent(unref(Button), {
                          label: "Run Sync",
                          icon: "pi pi-refresh",
                          size: "small",
                          loading: processingCommand.value === "sync_recent",
                          onClick: ($event) => runCommand("sync_recent")
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="flex items-center justify-between border-b pb-3 border-gray-100"${_scopeId3}><div${_scopeId3}><div class="font-medium text-gray-800"${_scopeId3}>Update Ranks</div><div class="text-xs text-gray-500"${_scopeId3}>Updates Trending, Best Selling &amp; Recommended</div></div>`);
                        _push4(ssrRenderComponent(unref(Button), {
                          label: "Update Ranks",
                          icon: "pi pi-chart-line",
                          severity: "secondary",
                          size: "small",
                          loading: processingCommand.value === "update_ranks",
                          onClick: ($event) => runCommand("update_ranks")
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="flex items-center justify-between"${_scopeId3}><div${_scopeId3}><div class="font-medium text-gray-800"${_scopeId3}>Prune Expired</div><div class="text-xs text-gray-500"${_scopeId3}>Removes artworks with expired licenses</div></div>`);
                        _push4(ssrRenderComponent(unref(Button), {
                          label: "Prune",
                          icon: "pi pi-trash",
                          severity: "danger",
                          size: "small",
                          outlined: "",
                          loading: processingCommand.value === "prune_expired",
                          onClick: ($event) => runCommand("prune_expired")
                        }, null, _parent4, _scopeId3));
                        _push4(`</div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex flex-col gap-4" }, [
                            createVNode("div", { class: "flex items-center justify-between border-b pb-3 border-gray-100" }, [
                              createVNode("div", null, [
                                createVNode("div", { class: "font-medium text-gray-800" }, "Sync Recent Artworks"),
                                createVNode("div", { class: "text-xs text-gray-500" }, "Fetches latest 200 items")
                              ]),
                              createVNode(unref(Button), {
                                label: "Run Sync",
                                icon: "pi pi-refresh",
                                size: "small",
                                loading: processingCommand.value === "sync_recent",
                                onClick: ($event) => runCommand("sync_recent")
                              }, null, 8, ["loading", "onClick"])
                            ]),
                            createVNode("div", { class: "flex items-center justify-between border-b pb-3 border-gray-100" }, [
                              createVNode("div", null, [
                                createVNode("div", { class: "font-medium text-gray-800" }, "Update Ranks"),
                                createVNode("div", { class: "text-xs text-gray-500" }, "Updates Trending, Best Selling & Recommended")
                              ]),
                              createVNode(unref(Button), {
                                label: "Update Ranks",
                                icon: "pi pi-chart-line",
                                severity: "secondary",
                                size: "small",
                                loading: processingCommand.value === "update_ranks",
                                onClick: ($event) => runCommand("update_ranks")
                              }, null, 8, ["loading", "onClick"])
                            ]),
                            createVNode("div", { class: "flex items-center justify-between" }, [
                              createVNode("div", null, [
                                createVNode("div", { class: "font-medium text-gray-800" }, "Prune Expired"),
                                createVNode("div", { class: "text-xs text-gray-500" }, "Removes artworks with expired licenses")
                              ]),
                              createVNode(unref(Button), {
                                label: "Prune",
                                icon: "pi pi-trash",
                                severity: "danger",
                                size: "small",
                                outlined: "",
                                loading: processingCommand.value === "prune_expired",
                                onClick: ($event) => runCommand("prune_expired")
                              }, null, 8, ["loading", "onClick"])
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Card), { class: "lg:col-span-2 overflow-hidden" }, {
                    title: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex items-center gap-2"${_scopeId3}><i class="pi pi-tags text-xl"${_scopeId3}></i><span${_scopeId3}>Artwork Price Lists</span></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("i", { class: "pi pi-tags text-xl" }),
                            createVNode("span", null, "Artwork Price Lists")
                          ])
                        ];
                      }
                    }),
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="overflow-x-auto"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(Tabs), { value: "canvas_framed" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(TabList), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(Tab), { value: "canvas_framed" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Canvas (Framed)`);
                                        } else {
                                          return [
                                            createTextVNode("Canvas (Framed)")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(Tab), { value: "canvas_noframe" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Canvas (No Frame)`);
                                        } else {
                                          return [
                                            createTextVNode("Canvas (No Frame)")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(Tab), { value: "poster_framed" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Poster (Framed)`);
                                        } else {
                                          return [
                                            createTextVNode("Poster (Framed)")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(Tab), { value: "canvas_framed" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Canvas (Framed)")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(Tab), { value: "canvas_noframe" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Canvas (No Frame)")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(Tab), { value: "poster_framed" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Poster (Framed)")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(TabPanels), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(TabPanel), { value: "canvas_framed" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_sfc_main$1, {
                                            modelValue: unref(pricingForm).pricing_config.canvas_framed,
                                            "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.canvas_framed = $event,
                                            "is-saving": unref(pricingForm).processing,
                                            "show-oil-price": true,
                                            onSave: (msg) => submitPricing(msg)
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_sfc_main$1, {
                                              modelValue: unref(pricingForm).pricing_config.canvas_framed,
                                              "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.canvas_framed = $event,
                                              "is-saving": unref(pricingForm).processing,
                                              "show-oil-price": true,
                                              onSave: (msg) => submitPricing(msg)
                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(TabPanel), { value: "canvas_noframe" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_sfc_main$1, {
                                            modelValue: unref(pricingForm).pricing_config.canvas_noframe,
                                            "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.canvas_noframe = $event,
                                            "is-saving": unref(pricingForm).processing,
                                            "show-oil-price": true,
                                            onSave: (msg) => submitPricing(msg)
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_sfc_main$1, {
                                              modelValue: unref(pricingForm).pricing_config.canvas_noframe,
                                              "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.canvas_noframe = $event,
                                              "is-saving": unref(pricingForm).processing,
                                              "show-oil-price": true,
                                              onSave: (msg) => submitPricing(msg)
                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(TabPanel), { value: "poster_framed" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_sfc_main$1, {
                                            modelValue: unref(pricingForm).pricing_config.poster_framed,
                                            "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.poster_framed = $event,
                                            "is-saving": unref(pricingForm).processing,
                                            "show-oil-price": false,
                                            onSave: (msg) => submitPricing(msg)
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_sfc_main$1, {
                                              modelValue: unref(pricingForm).pricing_config.poster_framed,
                                              "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.poster_framed = $event,
                                              "is-saving": unref(pricingForm).processing,
                                              "show-oil-price": false,
                                              onSave: (msg) => submitPricing(msg)
                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(TabPanel), { value: "canvas_framed" }, {
                                        default: withCtx(() => [
                                          createVNode(_sfc_main$1, {
                                            modelValue: unref(pricingForm).pricing_config.canvas_framed,
                                            "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.canvas_framed = $event,
                                            "is-saving": unref(pricingForm).processing,
                                            "show-oil-price": true,
                                            onSave: (msg) => submitPricing(msg)
                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(TabPanel), { value: "canvas_noframe" }, {
                                        default: withCtx(() => [
                                          createVNode(_sfc_main$1, {
                                            modelValue: unref(pricingForm).pricing_config.canvas_noframe,
                                            "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.canvas_noframe = $event,
                                            "is-saving": unref(pricingForm).processing,
                                            "show-oil-price": true,
                                            onSave: (msg) => submitPricing(msg)
                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(TabPanel), { value: "poster_framed" }, {
                                        default: withCtx(() => [
                                          createVNode(_sfc_main$1, {
                                            modelValue: unref(pricingForm).pricing_config.poster_framed,
                                            "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.poster_framed = $event,
                                            "is-saving": unref(pricingForm).processing,
                                            "show-oil-price": false,
                                            onSave: (msg) => submitPricing(msg)
                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(TabList), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(Tab), { value: "canvas_framed" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Canvas (Framed)")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(Tab), { value: "canvas_noframe" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Canvas (No Frame)")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(Tab), { value: "poster_framed" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Poster (Framed)")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(TabPanels), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(TabPanel), { value: "canvas_framed" }, {
                                      default: withCtx(() => [
                                        createVNode(_sfc_main$1, {
                                          modelValue: unref(pricingForm).pricing_config.canvas_framed,
                                          "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.canvas_framed = $event,
                                          "is-saving": unref(pricingForm).processing,
                                          "show-oil-price": true,
                                          onSave: (msg) => submitPricing(msg)
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(TabPanel), { value: "canvas_noframe" }, {
                                      default: withCtx(() => [
                                        createVNode(_sfc_main$1, {
                                          modelValue: unref(pricingForm).pricing_config.canvas_noframe,
                                          "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.canvas_noframe = $event,
                                          "is-saving": unref(pricingForm).processing,
                                          "show-oil-price": true,
                                          onSave: (msg) => submitPricing(msg)
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(TabPanel), { value: "poster_framed" }, {
                                      default: withCtx(() => [
                                        createVNode(_sfc_main$1, {
                                          modelValue: unref(pricingForm).pricing_config.poster_framed,
                                          "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.poster_framed = $event,
                                          "is-saving": unref(pricingForm).processing,
                                          "show-oil-price": false,
                                          onSave: (msg) => submitPricing(msg)
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "overflow-x-auto" }, [
                            createVNode(unref(Tabs), { value: "canvas_framed" }, {
                              default: withCtx(() => [
                                createVNode(unref(TabList), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(Tab), { value: "canvas_framed" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Canvas (Framed)")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(Tab), { value: "canvas_noframe" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Canvas (No Frame)")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(Tab), { value: "poster_framed" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Poster (Framed)")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(TabPanels), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(TabPanel), { value: "canvas_framed" }, {
                                      default: withCtx(() => [
                                        createVNode(_sfc_main$1, {
                                          modelValue: unref(pricingForm).pricing_config.canvas_framed,
                                          "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.canvas_framed = $event,
                                          "is-saving": unref(pricingForm).processing,
                                          "show-oil-price": true,
                                          onSave: (msg) => submitPricing(msg)
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(TabPanel), { value: "canvas_noframe" }, {
                                      default: withCtx(() => [
                                        createVNode(_sfc_main$1, {
                                          modelValue: unref(pricingForm).pricing_config.canvas_noframe,
                                          "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.canvas_noframe = $event,
                                          "is-saving": unref(pricingForm).processing,
                                          "show-oil-price": true,
                                          onSave: (msg) => submitPricing(msg)
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(TabPanel), { value: "poster_framed" }, {
                                      default: withCtx(() => [
                                        createVNode(_sfc_main$1, {
                                          modelValue: unref(pricingForm).pricing_config.poster_framed,
                                          "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.poster_framed = $event,
                                          "is-saving": unref(pricingForm).processing,
                                          "show-oil-price": false,
                                          onSave: (msg) => submitPricing(msg)
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ])
                        ];
                      }
                    }),
                    footer: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex justify-end"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(Button), {
                          label: "Save Prices",
                          icon: "pi pi-save",
                          severity: "success",
                          size: "small",
                          loading: unref(pricingForm).processing,
                          onClick: submitPricing
                        }, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex justify-end" }, [
                            createVNode(unref(Button), {
                              label: "Save Prices",
                              icon: "pi pi-save",
                              severity: "success",
                              size: "small",
                              loading: unref(pricingForm).processing,
                              onClick: submitPricing
                            }, null, 8, ["loading"])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode(PageTitleSection, { title: "Settings" }),
                    createVNode("div", { class: "grid grid-cols-1 lg:grid-cols-2 gap-6" }, [
                      createVNode(unref(Card), { class: "h-full" }, {
                        title: withCtx(() => [
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("i", { class: "pi pi-cog text-xl" }),
                            createVNode("span", null, "General Configuration")
                          ])
                        ]),
                        content: withCtx(() => [
                          createVNode("div", { class: "field" }, [
                            createVNode("label", {
                              for: "admin_email",
                              class: "block font-medium mb-2 text-gray-700"
                            }, " Admin Notification Email "),
                            createVNode("span", { class: "p-input-icon-left w-full" }, [
                              createVNode("i", { class: "pi pi-envelope" }),
                              createVNode(unref(InputText), {
                                id: "admin_email",
                                modelValue: unref(emailForm).admin_notification_email,
                                "onUpdate:modelValue": ($event) => unref(emailForm).admin_notification_email = $event,
                                class: "w-full",
                                placeholder: "admin@example.com"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("small", { class: "text-gray-500 block mt-1" }, "Order notifications are sent here."),
                            unref(emailForm).errors.admin_notification_email ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-red-500 text-xs mt-1"
                            }, toDisplayString(unref(emailForm).errors.admin_notification_email), 1)) : createCommentVNode("", true)
                          ])
                        ]),
                        footer: withCtx(() => [
                          createVNode("div", { class: "flex justify-end" }, [
                            createVNode(unref(Button), {
                              label: "Save Email",
                              icon: "pi pi-check",
                              size: "small",
                              loading: unref(emailForm).processing,
                              onClick: submitEmail
                            }, null, 8, ["loading"])
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Card), { class: "h-full" }, {
                        title: withCtx(() => [
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("i", { class: "pi pi-lock text-xl" }),
                            createVNode("span", null, "Access Control")
                          ])
                        ]),
                        content: withCtx(() => [
                          createVNode("div", { class: "flex items-center justify-between p-2 rounded" }, [
                            createVNode("div", { class: "mr-4" }, [
                              createVNode("div", { class: "font-medium text-gray-800" }, "Hide Prices for Guests"),
                              createVNode("div", { class: "text-sm text-gray-500" }, " Users must log in to view prices/cart. ")
                            ]),
                            createVNode(unref(ToggleSwitch), {
                              modelValue: toggles.require_login_for_prices,
                              "onUpdate:modelValue": ($event) => toggles.require_login_for_prices = $event,
                              onChange: ($event) => updateToggle("require_login_for_prices")
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "onChange"])
                          ]),
                          createVNode(unref(Divider$1)),
                          createVNode("div", { class: "flex items-center justify-between p-2 rounded" }, [
                            createVNode("div", { class: "mr-4" }, [
                              createVNode("div", { class: "font-medium text-gray-800" }, "Open Public Registration"),
                              createVNode("div", { class: "text-sm text-gray-500" }, " If disabled, guests request access. ")
                            ]),
                            createVNode(unref(ToggleSwitch), {
                              modelValue: toggles.allow_public_registration,
                              "onUpdate:modelValue": ($event) => toggles.allow_public_registration = $event,
                              onChange: ($event) => updateToggle("allow_public_registration")
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "onChange"])
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Card), { class: "h-full" }, {
                        title: withCtx(() => [
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("i", { class: "pi pi-cloud-download text-xl" }),
                            createVNode("span", null, "Pictufy Sync Operations")
                          ])
                        ]),
                        content: withCtx(() => [
                          createVNode("div", { class: "flex flex-col gap-4" }, [
                            createVNode("div", { class: "flex items-center justify-between border-b pb-3 border-gray-100" }, [
                              createVNode("div", null, [
                                createVNode("div", { class: "font-medium text-gray-800" }, "Sync Recent Artworks"),
                                createVNode("div", { class: "text-xs text-gray-500" }, "Fetches latest 200 items")
                              ]),
                              createVNode(unref(Button), {
                                label: "Run Sync",
                                icon: "pi pi-refresh",
                                size: "small",
                                loading: processingCommand.value === "sync_recent",
                                onClick: ($event) => runCommand("sync_recent")
                              }, null, 8, ["loading", "onClick"])
                            ]),
                            createVNode("div", { class: "flex items-center justify-between border-b pb-3 border-gray-100" }, [
                              createVNode("div", null, [
                                createVNode("div", { class: "font-medium text-gray-800" }, "Update Ranks"),
                                createVNode("div", { class: "text-xs text-gray-500" }, "Updates Trending, Best Selling & Recommended")
                              ]),
                              createVNode(unref(Button), {
                                label: "Update Ranks",
                                icon: "pi pi-chart-line",
                                severity: "secondary",
                                size: "small",
                                loading: processingCommand.value === "update_ranks",
                                onClick: ($event) => runCommand("update_ranks")
                              }, null, 8, ["loading", "onClick"])
                            ]),
                            createVNode("div", { class: "flex items-center justify-between" }, [
                              createVNode("div", null, [
                                createVNode("div", { class: "font-medium text-gray-800" }, "Prune Expired"),
                                createVNode("div", { class: "text-xs text-gray-500" }, "Removes artworks with expired licenses")
                              ]),
                              createVNode(unref(Button), {
                                label: "Prune",
                                icon: "pi pi-trash",
                                severity: "danger",
                                size: "small",
                                outlined: "",
                                loading: processingCommand.value === "prune_expired",
                                onClick: ($event) => runCommand("prune_expired")
                              }, null, 8, ["loading", "onClick"])
                            ])
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Card), { class: "lg:col-span-2 overflow-hidden" }, {
                        title: withCtx(() => [
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("i", { class: "pi pi-tags text-xl" }),
                            createVNode("span", null, "Artwork Price Lists")
                          ])
                        ]),
                        content: withCtx(() => [
                          createVNode("div", { class: "overflow-x-auto" }, [
                            createVNode(unref(Tabs), { value: "canvas_framed" }, {
                              default: withCtx(() => [
                                createVNode(unref(TabList), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(Tab), { value: "canvas_framed" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Canvas (Framed)")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(Tab), { value: "canvas_noframe" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Canvas (No Frame)")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(Tab), { value: "poster_framed" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Poster (Framed)")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(TabPanels), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(TabPanel), { value: "canvas_framed" }, {
                                      default: withCtx(() => [
                                        createVNode(_sfc_main$1, {
                                          modelValue: unref(pricingForm).pricing_config.canvas_framed,
                                          "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.canvas_framed = $event,
                                          "is-saving": unref(pricingForm).processing,
                                          "show-oil-price": true,
                                          onSave: (msg) => submitPricing(msg)
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(TabPanel), { value: "canvas_noframe" }, {
                                      default: withCtx(() => [
                                        createVNode(_sfc_main$1, {
                                          modelValue: unref(pricingForm).pricing_config.canvas_noframe,
                                          "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.canvas_noframe = $event,
                                          "is-saving": unref(pricingForm).processing,
                                          "show-oil-price": true,
                                          onSave: (msg) => submitPricing(msg)
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(TabPanel), { value: "poster_framed" }, {
                                      default: withCtx(() => [
                                        createVNode(_sfc_main$1, {
                                          modelValue: unref(pricingForm).pricing_config.poster_framed,
                                          "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.poster_framed = $event,
                                          "is-saving": unref(pricingForm).processing,
                                          "show-oil-price": false,
                                          onSave: (msg) => submitPricing(msg)
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        footer: withCtx(() => [
                          createVNode("div", { class: "flex justify-end" }, [
                            createVNode(unref(Button), {
                              label: "Save Prices",
                              icon: "pi pi-save",
                              severity: "success",
                              size: "small",
                              loading: unref(pricingForm).processing,
                              onClick: submitPricing
                            }, null, 8, ["loading"])
                          ])
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Head), { title: "Settings" }),
              createVNode(_sfc_main$2, null, {
                default: withCtx(() => [
                  createVNode(PageTitleSection, { title: "Settings" }),
                  createVNode("div", { class: "grid grid-cols-1 lg:grid-cols-2 gap-6" }, [
                    createVNode(unref(Card), { class: "h-full" }, {
                      title: withCtx(() => [
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode("i", { class: "pi pi-cog text-xl" }),
                          createVNode("span", null, "General Configuration")
                        ])
                      ]),
                      content: withCtx(() => [
                        createVNode("div", { class: "field" }, [
                          createVNode("label", {
                            for: "admin_email",
                            class: "block font-medium mb-2 text-gray-700"
                          }, " Admin Notification Email "),
                          createVNode("span", { class: "p-input-icon-left w-full" }, [
                            createVNode("i", { class: "pi pi-envelope" }),
                            createVNode(unref(InputText), {
                              id: "admin_email",
                              modelValue: unref(emailForm).admin_notification_email,
                              "onUpdate:modelValue": ($event) => unref(emailForm).admin_notification_email = $event,
                              class: "w-full",
                              placeholder: "admin@example.com"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("small", { class: "text-gray-500 block mt-1" }, "Order notifications are sent here."),
                          unref(emailForm).errors.admin_notification_email ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "text-red-500 text-xs mt-1"
                          }, toDisplayString(unref(emailForm).errors.admin_notification_email), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      footer: withCtx(() => [
                        createVNode("div", { class: "flex justify-end" }, [
                          createVNode(unref(Button), {
                            label: "Save Email",
                            icon: "pi pi-check",
                            size: "small",
                            loading: unref(emailForm).processing,
                            onClick: submitEmail
                          }, null, 8, ["loading"])
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Card), { class: "h-full" }, {
                      title: withCtx(() => [
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode("i", { class: "pi pi-lock text-xl" }),
                          createVNode("span", null, "Access Control")
                        ])
                      ]),
                      content: withCtx(() => [
                        createVNode("div", { class: "flex items-center justify-between p-2 rounded" }, [
                          createVNode("div", { class: "mr-4" }, [
                            createVNode("div", { class: "font-medium text-gray-800" }, "Hide Prices for Guests"),
                            createVNode("div", { class: "text-sm text-gray-500" }, " Users must log in to view prices/cart. ")
                          ]),
                          createVNode(unref(ToggleSwitch), {
                            modelValue: toggles.require_login_for_prices,
                            "onUpdate:modelValue": ($event) => toggles.require_login_for_prices = $event,
                            onChange: ($event) => updateToggle("require_login_for_prices")
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "onChange"])
                        ]),
                        createVNode(unref(Divider$1)),
                        createVNode("div", { class: "flex items-center justify-between p-2 rounded" }, [
                          createVNode("div", { class: "mr-4" }, [
                            createVNode("div", { class: "font-medium text-gray-800" }, "Open Public Registration"),
                            createVNode("div", { class: "text-sm text-gray-500" }, " If disabled, guests request access. ")
                          ]),
                          createVNode(unref(ToggleSwitch), {
                            modelValue: toggles.allow_public_registration,
                            "onUpdate:modelValue": ($event) => toggles.allow_public_registration = $event,
                            onChange: ($event) => updateToggle("allow_public_registration")
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "onChange"])
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Card), { class: "h-full" }, {
                      title: withCtx(() => [
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode("i", { class: "pi pi-cloud-download text-xl" }),
                          createVNode("span", null, "Pictufy Sync Operations")
                        ])
                      ]),
                      content: withCtx(() => [
                        createVNode("div", { class: "flex flex-col gap-4" }, [
                          createVNode("div", { class: "flex items-center justify-between border-b pb-3 border-gray-100" }, [
                            createVNode("div", null, [
                              createVNode("div", { class: "font-medium text-gray-800" }, "Sync Recent Artworks"),
                              createVNode("div", { class: "text-xs text-gray-500" }, "Fetches latest 200 items")
                            ]),
                            createVNode(unref(Button), {
                              label: "Run Sync",
                              icon: "pi pi-refresh",
                              size: "small",
                              loading: processingCommand.value === "sync_recent",
                              onClick: ($event) => runCommand("sync_recent")
                            }, null, 8, ["loading", "onClick"])
                          ]),
                          createVNode("div", { class: "flex items-center justify-between border-b pb-3 border-gray-100" }, [
                            createVNode("div", null, [
                              createVNode("div", { class: "font-medium text-gray-800" }, "Update Ranks"),
                              createVNode("div", { class: "text-xs text-gray-500" }, "Updates Trending, Best Selling & Recommended")
                            ]),
                            createVNode(unref(Button), {
                              label: "Update Ranks",
                              icon: "pi pi-chart-line",
                              severity: "secondary",
                              size: "small",
                              loading: processingCommand.value === "update_ranks",
                              onClick: ($event) => runCommand("update_ranks")
                            }, null, 8, ["loading", "onClick"])
                          ]),
                          createVNode("div", { class: "flex items-center justify-between" }, [
                            createVNode("div", null, [
                              createVNode("div", { class: "font-medium text-gray-800" }, "Prune Expired"),
                              createVNode("div", { class: "text-xs text-gray-500" }, "Removes artworks with expired licenses")
                            ]),
                            createVNode(unref(Button), {
                              label: "Prune",
                              icon: "pi pi-trash",
                              severity: "danger",
                              size: "small",
                              outlined: "",
                              loading: processingCommand.value === "prune_expired",
                              onClick: ($event) => runCommand("prune_expired")
                            }, null, 8, ["loading", "onClick"])
                          ])
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Card), { class: "lg:col-span-2 overflow-hidden" }, {
                      title: withCtx(() => [
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode("i", { class: "pi pi-tags text-xl" }),
                          createVNode("span", null, "Artwork Price Lists")
                        ])
                      ]),
                      content: withCtx(() => [
                        createVNode("div", { class: "overflow-x-auto" }, [
                          createVNode(unref(Tabs), { value: "canvas_framed" }, {
                            default: withCtx(() => [
                              createVNode(unref(TabList), null, {
                                default: withCtx(() => [
                                  createVNode(unref(Tab), { value: "canvas_framed" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Canvas (Framed)")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(Tab), { value: "canvas_noframe" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Canvas (No Frame)")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(Tab), { value: "poster_framed" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Poster (Framed)")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(TabPanels), null, {
                                default: withCtx(() => [
                                  createVNode(unref(TabPanel), { value: "canvas_framed" }, {
                                    default: withCtx(() => [
                                      createVNode(_sfc_main$1, {
                                        modelValue: unref(pricingForm).pricing_config.canvas_framed,
                                        "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.canvas_framed = $event,
                                        "is-saving": unref(pricingForm).processing,
                                        "show-oil-price": true,
                                        onSave: (msg) => submitPricing(msg)
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(TabPanel), { value: "canvas_noframe" }, {
                                    default: withCtx(() => [
                                      createVNode(_sfc_main$1, {
                                        modelValue: unref(pricingForm).pricing_config.canvas_noframe,
                                        "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.canvas_noframe = $event,
                                        "is-saving": unref(pricingForm).processing,
                                        "show-oil-price": true,
                                        onSave: (msg) => submitPricing(msg)
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(TabPanel), { value: "poster_framed" }, {
                                    default: withCtx(() => [
                                      createVNode(_sfc_main$1, {
                                        modelValue: unref(pricingForm).pricing_config.poster_framed,
                                        "onUpdate:modelValue": ($event) => unref(pricingForm).pricing_config.poster_framed = $event,
                                        "is-saving": unref(pricingForm).processing,
                                        "show-oil-price": false,
                                        onSave: (msg) => submitPricing(msg)
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "is-saving", "onSave"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      footer: withCtx(() => [
                        createVNode("div", { class: "flex justify-end" }, [
                          createVNode(unref(Button), {
                            label: "Save Prices",
                            icon: "pi pi-save",
                            severity: "success",
                            size: "small",
                            loading: unref(pricingForm).processing,
                            onClick: submitPricing
                          }, null, 8, ["loading"])
                        ])
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/dashboard/Settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
