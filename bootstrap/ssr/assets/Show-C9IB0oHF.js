import Divider from "primevue/divider";
import { reactive, ref, onMounted, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { usePage, useForm, Head, Link } from "@inertiajs/vue3";
import { A as AdminLayout } from "./AdminLayout-CbDljQzr.js";
import { _ as _export_sfc, a as _sfc_main$1, P as PageTitleSection } from "../ssr.js";
import { _ as _sfc_main$2 } from "./FramedArtworkPreview-NDj3wDB4.js";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import Checkbox from "primevue/checkbox";
import { useToast } from "primevue/usetoast";
import { u as useCountries } from "./useCountries-DisC8OA1.js";
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
import "./SQUARE_WALNUT-87wNLTxN.js";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    order: Object
  },
  setup(__props) {
    const props = __props;
    usePage();
    const toast = useToast();
    const { countries } = useCountries();
    const editModes = reactive({
      billing: false,
      shipping: false
    });
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    };
    const toggleEditMode = (section) => {
      editModes[section] = !editModes[section];
      if (!editModes[section]) {
        if (section === "billing") {
          orderForm.billing_first_name = props.order.billing_first_name;
          orderForm.billing_last_name = props.order.billing_last_name;
          orderForm.billing_email = props.order.billing_email;
          orderForm.billing_address = props.order.billing_address;
          orderForm.billing_city = props.order.billing_city;
          orderForm.billing_state_or_county = props.order.billing_state_or_county;
          orderForm.billing_country = props.order.billing_country;
          orderForm.billing_postal_code = props.order.billing_postal_code;
          orderForm.billing_phone = props.order.billing_phone;
          orderForm.wants_invoice = props.order.wants_invoice;
          orderForm.invoice_company_name = props.order.invoice_company_name;
          orderForm.invoice_vat_number = props.order.invoice_vat_number;
          orderForm.invoice_tax_office = props.order.invoice_tax_office;
          orderForm.invoice_profession = props.order.invoice_profession;
          orderForm.billing_country_object = countries.value.find((c) => c.code === props.order.billing_country) || null;
        }
        if (section === "shipping") {
          orderForm.shipping_is_different = props.order.shipping_is_different;
          orderForm.shipping_first_name = props.order.shipping_first_name;
          orderForm.shipping_last_name = props.order.shipping_last_name;
          orderForm.shipping_email = props.order.shipping_email;
          orderForm.shipping_address = props.order.shipping_address;
          orderForm.shipping_city = props.order.shipping_city;
          orderForm.shipping_state_or_county = props.order.shipping_state_or_county;
          orderForm.shipping_country = props.order.shipping_country;
          orderForm.shipping_postal_code = props.order.shipping_postal_code;
          orderForm.shipping_phone = props.order.shipping_phone;
          orderForm.shipping_country_object = countries.value.find((c) => c.code === props.order.shipping_country) || null;
        }
      }
    };
    const orderForm = useForm({
      _method: "PUT",
      order_number: props.order.order_number,
      // For display, not usually editable
      status: props.order.status,
      payment_status: props.order.payment_status,
      notes: props.order.notes || "",
      transaction_id: props.order.transaction_id || "",
      billing_first_name: props.order.billing_first_name,
      billing_last_name: props.order.billing_last_name,
      billing_email: props.order.billing_email,
      billing_address: props.order.billing_address,
      billing_city: props.order.billing_city,
      billing_state_or_county: props.order.billing_state_or_county,
      billing_country: props.order.billing_country,
      // Stores the CODE 'AT'
      billing_country_object: null,
      // Stores the { name: 'Austria', code: 'AT' }
      billing_postal_code: props.order.billing_postal_code,
      billing_phone: props.order.billing_phone,
      wants_invoice: props.order.wants_invoice,
      invoice_company_name: props.order.invoice_company_name,
      invoice_vat_number: props.order.invoice_vat_number,
      invoice_tax_office: props.order.invoice_tax_office,
      invoice_profession: props.order.invoice_profession,
      shipping_is_different: props.order.shipping_is_different,
      shipping_first_name: props.order.shipping_first_name,
      shipping_last_name: props.order.shipping_last_name,
      shipping_email: props.order.shipping_email,
      shipping_address: props.order.shipping_address,
      shipping_city: props.order.shipping_city,
      shipping_state_or_county: props.order.shipping_state_or_county,
      shipping_country: props.order.shipping_country,
      // Stores the CODE 'AT'
      shipping_country_object: null,
      // Stores the { name: 'Austria', code: 'AT' }
      shipping_postal_code: props.order.shipping_postal_code,
      shipping_phone: props.order.shipping_phone
    });
    const orderStatusOptions = ref([
      { label: "Pending", value: "pending" },
      { label: "Processing", value: "processing" },
      { label: "Shipped", value: "shipped" },
      { label: "Delivered", value: "delivered" },
      { label: "Completed", value: "completed" },
      { label: "Cancelled", value: "cancelled" },
      { label: "Refunded", value: "refunded" }
    ]);
    const paymentStatusOptions = ref([
      { label: "Pending", value: "pending" },
      { label: "Paid", value: "paid" },
      { label: "Failed", value: "failed" },
      { label: "Refunded", value: "refunded" }
    ]);
    const getCountryName = (code) => {
      const country = countries.value.find((c) => c.code === code);
      return country ? country.name : code;
    };
    const initializeCountryObjects = () => {
      if (orderForm.billing_country) {
        orderForm.billing_country_object = countries.value.find((c) => c.code === orderForm.billing_country) || null;
      } else {
        orderForm.billing_country_object = null;
      }
      if (orderForm.shipping_country) {
        orderForm.shipping_country_object = countries.value.find((c) => c.code === orderForm.shipping_country) || null;
      } else {
        orderForm.shipping_country_object = null;
      }
    };
    onMounted(() => {
      initializeCountryObjects();
    });
    const onBillingCountryChange = (event) => {
      if (event.value) {
        orderForm.billing_country = event.value.code;
        orderForm.billing_country_object = event.value;
      } else {
        orderForm.billing_country = null;
        orderForm.billing_country_object = null;
      }
      if (!orderForm.shipping_is_different) {
        orderForm.shipping_country = orderForm.billing_country;
        orderForm.shipping_country_object = orderForm.billing_country_object;
      }
    };
    const onShippingCountryChange = (event) => {
      if (event.value) {
        orderForm.shipping_country = event.value.code;
        orderForm.shipping_country_object = event.value;
      } else {
        orderForm.shipping_country = null;
        orderForm.shipping_country_object = null;
      }
    };
    const formatCurrency = (value) => {
      if (typeof value !== "number" && value !== null && value !== void 0) value = parseFloat(value);
      if (isNaN(value)) return "N/A";
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(value);
    };
    const updateOrderDetails = () => {
      console.log("Updating order details:", orderForm.data());
      orderForm.put(route("dashboard.orders.update", props.order.id), {
        preserveScroll: true,
        onSuccess: () => {
          Object.keys(editModes).forEach((key) => editModes[key] = false);
        },
        onError: (errors) => {
          console.error("Order update failed:", errors);
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Fill in all required fields.",
            life: 5e3
          });
        }
      });
    };
    watch(() => orderForm.shipping_is_different, (isDifferent, oldIsDifferent) => {
      if (!isDifferent) {
        orderForm.shipping_first_name = orderForm.billing_first_name;
        orderForm.shipping_last_name = orderForm.billing_last_name;
        orderForm.shipping_email = orderForm.billing_email;
        orderForm.shipping_address = orderForm.billing_address;
        orderForm.shipping_city = orderForm.billing_city;
        orderForm.shipping_state_or_county = orderForm.billing_state_or_county;
        orderForm.shipping_country = orderForm.billing_country;
        orderForm.shipping_country_object = orderForm.billing_country_object;
        orderForm.shipping_postal_code = orderForm.billing_postal_code;
        orderForm.shipping_phone = orderForm.billing_phone;
      } else if (isDifferent && !oldIsDifferent && editModes.shipping) {
        orderForm.shipping_first_name = props.order.shipping_first_name || "";
        orderForm.shipping_last_name = props.order.shipping_last_name || "";
        orderForm.shipping_email = props.order.shipping_email || "";
        orderForm.shipping_address = props.order.shipping_address || "";
        orderForm.shipping_city = props.order.shipping_city || "";
        orderForm.shipping_state_or_county = props.order.shipping_state_or_county || "";
        orderForm.shipping_country = props.order.shipping_country || null;
        orderForm.shipping_country_object = countries.value.find((c) => c.code === (props.order.shipping_country || "")) || null;
        orderForm.shipping_postal_code = props.order.shipping_postal_code || "";
        orderForm.shipping_phone = props.order.shipping_phone || "";
      }
    });
    Object.keys(orderForm.data()).forEach((key) => {
      if (key.startsWith("billing_")) {
        watch(() => orderForm[key], (newValue) => {
          if (!orderForm.shipping_is_different) {
            const correspondingShippingKey = key.replace("billing_", "shipping_");
            if (orderForm.hasOwnProperty(correspondingShippingKey)) {
              orderForm[correspondingShippingKey] = newValue;
              if (key === "billing_country") {
                orderForm.shipping_country_object = countries.value.find((c) => c.code === newValue) || null;
              }
            }
          }
        });
      }
    });
    watch(() => ({ ...orderForm.billingInfo }), (newBilling) => {
      if (!orderForm.shipping_is_different) {
        orderForm.shipping_first_name = newBilling.first_name;
        orderForm.shipping_last_name = newBilling.last_name;
        orderForm.shipping_country = newBilling.country;
        orderForm.shipping_country_object = countries.value.find((c) => c.code === newBilling.country) || null;
      }
    }, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Divider = Divider;
      _push(ssrRenderComponent(AdminLayout, mergeProps({
        title: `Order ${unref(orderForm).order_number}`
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), {
              title: `Admin - Order ${unref(orderForm).order_number}`
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(PageTitleSection, {
                    title: `Order Details: ${unref(orderForm).order_number}`,
                    breadcrumbs: `Dashboard > Orders > ${unref(orderForm).order_number}`
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="mt-6" data-v-cf701f0d${_scopeId2}><form data-v-cf701f0d${_scopeId2}><div class="grid grid-cols-1 md:grid-cols-3 gap-6" data-v-cf701f0d${_scopeId2}><div class="md:col-span-2 space-y-6" data-v-cf701f0d${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Card), null, {
                    title: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex justify-between items-center" data-v-cf701f0d${_scopeId3}><span data-v-cf701f0d${_scopeId3}>Order Information</span></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex justify-between items-center" }, [
                            createVNode("span", null, "Order Information")
                          ])
                        ];
                      }
                    }),
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-v-cf701f0d${_scopeId3}><div class="mb-2" data-v-cf701f0d${_scopeId3}><strong data-v-cf701f0d${_scopeId3}>Order Date:</strong> ${ssrInterpolate(formatDate(__props.order.created_at))}</div><div class="mb-2" data-v-cf701f0d${_scopeId3}><strong data-v-cf701f0d${_scopeId3}>Last Updated:</strong> ${ssrInterpolate(formatDate(__props.order.updated_at))}</div><div class="border-t border-gray-100 pt-4 mt-4 space-y-3" data-v-cf701f0d${_scopeId3}><div class="flex justify-between text-sm" data-v-cf701f0d${_scopeId3}><span class="text-gray-500" data-v-cf701f0d${_scopeId3}>Subtotal</span><span class="font-medium text-gray-900" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(formatCurrency(parseFloat(__props.order.total_amount) + parseFloat(__props.order.discount_amount)))}</span></div>`);
                        if (Number(__props.order.discount_amount) > 0) {
                          _push4(`<div class="flex justify-between text-sm" data-v-cf701f0d${_scopeId3}><span class="text-green-600 flex items-center" data-v-cf701f0d${_scopeId3}><i class="pi pi-tag mr-2 text-xs" data-v-cf701f0d${_scopeId3}></i> Discount (${ssrInterpolate(__props.order.coupon_code)}) </span><span class="font-medium text-green-600" data-v-cf701f0d${_scopeId3}> -${ssrInterpolate(formatCurrency(__props.order.discount_amount))}</span></div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`<div class="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100" data-v-cf701f0d${_scopeId3}><span data-v-cf701f0d${_scopeId3}>Total Amount</span><span data-v-cf701f0d${_scopeId3}>${ssrInterpolate(formatCurrency(__props.order.total_amount))}</span></div></div><div class="mb-2" data-v-cf701f0d${_scopeId3}><strong data-v-cf701f0d${_scopeId3}>Payment Method:</strong> ${ssrInterpolate(__props.order.payment_method)}</div><div data-v-cf701f0d${_scopeId3}><label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300" data-v-cf701f0d${_scopeId3}>Order Status</label>`);
                        _push4(ssrRenderComponent(unref(Select), {
                          id: "status",
                          modelValue: unref(orderForm).status,
                          "onUpdate:modelValue": ($event) => unref(orderForm).status = $event,
                          options: orderStatusOptions.value,
                          optionLabel: "label",
                          optionValue: "value",
                          placeholder: "Select Status",
                          class: ["w-full mt-1", { "p-invalid": unref(orderForm).errors.status }]
                        }, null, _parent4, _scopeId3));
                        if (unref(orderForm).errors.status) {
                          _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.status)}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div data-v-cf701f0d${_scopeId3}><label for="payment_status" class="block text-sm font-medium text-gray-700 dark:text-gray-300" data-v-cf701f0d${_scopeId3}>Payment Status</label>`);
                        _push4(ssrRenderComponent(unref(Select), {
                          id: "payment_status",
                          modelValue: unref(orderForm).payment_status,
                          "onUpdate:modelValue": ($event) => unref(orderForm).payment_status = $event,
                          options: paymentStatusOptions.value,
                          optionLabel: "label",
                          optionValue: "value",
                          placeholder: "Select Payment Status",
                          class: ["w-full mt-1", { "p-invalid": unref(orderForm).errors.payment_status }]
                        }, null, _parent4, _scopeId3));
                        if (unref(orderForm).errors.payment_status) {
                          _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.payment_status)}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div data-v-cf701f0d${_scopeId3}><label for="transaction_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300" data-v-cf701f0d${_scopeId3}>Transaction ID</label>`);
                        _push4(ssrRenderComponent(unref(InputText), {
                          id: "transaction_id",
                          modelValue: unref(orderForm).transaction_id,
                          "onUpdate:modelValue": ($event) => unref(orderForm).transaction_id = $event,
                          class: ["w-full mt-1", { "p-invalid": unref(orderForm).errors.transaction_id }]
                        }, null, _parent4, _scopeId3));
                        if (unref(orderForm).errors.transaction_id) {
                          _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.transaction_id)}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                            createVNode("div", { class: "mb-2" }, [
                              createVNode("strong", null, "Order Date:"),
                              createTextVNode(" " + toDisplayString(formatDate(__props.order.created_at)), 1)
                            ]),
                            createVNode("div", { class: "mb-2" }, [
                              createVNode("strong", null, "Last Updated:"),
                              createTextVNode(" " + toDisplayString(formatDate(__props.order.updated_at)), 1)
                            ]),
                            createVNode("div", { class: "border-t border-gray-100 pt-4 mt-4 space-y-3" }, [
                              createVNode("div", { class: "flex justify-between text-sm" }, [
                                createVNode("span", { class: "text-gray-500" }, "Subtotal"),
                                createVNode("span", { class: "font-medium text-gray-900" }, toDisplayString(formatCurrency(parseFloat(__props.order.total_amount) + parseFloat(__props.order.discount_amount))), 1)
                              ]),
                              Number(__props.order.discount_amount) > 0 ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "flex justify-between text-sm"
                              }, [
                                createVNode("span", { class: "text-green-600 flex items-center" }, [
                                  createVNode("i", { class: "pi pi-tag mr-2 text-xs" }),
                                  createTextVNode(" Discount (" + toDisplayString(__props.order.coupon_code) + ") ", 1)
                                ]),
                                createVNode("span", { class: "font-medium text-green-600" }, " -" + toDisplayString(formatCurrency(__props.order.discount_amount)), 1)
                              ])) : createCommentVNode("", true),
                              createVNode("div", { class: "flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100" }, [
                                createVNode("span", null, "Total Amount"),
                                createVNode("span", null, toDisplayString(formatCurrency(__props.order.total_amount)), 1)
                              ])
                            ]),
                            createVNode("div", { class: "mb-2" }, [
                              createVNode("strong", null, "Payment Method:"),
                              createTextVNode(" " + toDisplayString(__props.order.payment_method), 1)
                            ]),
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "status",
                                class: "block text-sm font-medium text-gray-700 dark:text-gray-300"
                              }, "Order Status"),
                              createVNode(unref(Select), {
                                id: "status",
                                modelValue: unref(orderForm).status,
                                "onUpdate:modelValue": ($event) => unref(orderForm).status = $event,
                                options: orderStatusOptions.value,
                                optionLabel: "label",
                                optionValue: "value",
                                placeholder: "Select Status",
                                class: ["w-full mt-1", { "p-invalid": unref(orderForm).errors.status }]
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "class"]),
                              unref(orderForm).errors.status ? (openBlock(), createBlock("small", {
                                key: 0,
                                class: "p-error"
                              }, toDisplayString(unref(orderForm).errors.status), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "payment_status",
                                class: "block text-sm font-medium text-gray-700 dark:text-gray-300"
                              }, "Payment Status"),
                              createVNode(unref(Select), {
                                id: "payment_status",
                                modelValue: unref(orderForm).payment_status,
                                "onUpdate:modelValue": ($event) => unref(orderForm).payment_status = $event,
                                options: paymentStatusOptions.value,
                                optionLabel: "label",
                                optionValue: "value",
                                placeholder: "Select Payment Status",
                                class: ["w-full mt-1", { "p-invalid": unref(orderForm).errors.payment_status }]
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "class"]),
                              unref(orderForm).errors.payment_status ? (openBlock(), createBlock("small", {
                                key: 0,
                                class: "p-error"
                              }, toDisplayString(unref(orderForm).errors.payment_status), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "transaction_id",
                                class: "block text-sm font-medium text-gray-700 dark:text-gray-300"
                              }, "Transaction ID"),
                              createVNode(unref(InputText), {
                                id: "transaction_id",
                                modelValue: unref(orderForm).transaction_id,
                                "onUpdate:modelValue": ($event) => unref(orderForm).transaction_id = $event,
                                class: ["w-full mt-1", { "p-invalid": unref(orderForm).errors.transaction_id }]
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                              unref(orderForm).errors.transaction_id ? (openBlock(), createBlock("small", {
                                key: 0,
                                class: "p-error"
                              }, toDisplayString(unref(orderForm).errors.transaction_id), 1)) : createCommentVNode("", true)
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Card), null, {
                    title: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex justify-between items-center" data-v-cf701f0d${_scopeId3}><span data-v-cf701f0d${_scopeId3}>Billing Details</span>`);
                        _push4(ssrRenderComponent(unref(Button), {
                          icon: "pi pi-pencil",
                          text: "",
                          rounded: "",
                          size: "small",
                          onClick: ($event) => toggleEditMode("billing"),
                          "aria-label": "Edit Billing Details"
                        }, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex justify-between items-center" }, [
                            createVNode("span", null, "Billing Details"),
                            createVNode(unref(Button), {
                              icon: "pi pi-pencil",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => toggleEditMode("billing"),
                              "aria-label": "Edit Billing Details"
                            }, null, 8, ["onClick"])
                          ])
                        ];
                      }
                    }),
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (!editModes.billing) {
                          _push4(`<div class="space-y-1 text-sm" data-v-cf701f0d${_scopeId3}><p data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).billing_first_name)} ${ssrInterpolate(unref(orderForm).billing_last_name)}</p><p data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).billing_email)}</p><p data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).billing_address)}</p><p data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).billing_city)}, ${ssrInterpolate(unref(orderForm).billing_state_or_county)} ${ssrInterpolate(unref(orderForm).billing_postal_code)}</p><p data-v-cf701f0d${_scopeId3}>${ssrInterpolate(getCountryName(unref(orderForm).billing_country))}</p>`);
                          if (unref(orderForm).billing_phone) {
                            _push4(`<p data-v-cf701f0d${_scopeId3}>Phone: ${ssrInterpolate(unref(orderForm).billing_phone)}</p>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                        } else {
                          _push4(`<div class="space-y-4" data-v-cf701f0d${_scopeId3}><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-cf701f0d${_scopeId3}><div data-v-cf701f0d${_scopeId3}><label for="billing_first_name" data-v-cf701f0d${_scopeId3}>First Name</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "billing_first_name",
                            modelValue: unref(orderForm).billing_first_name,
                            "onUpdate:modelValue": ($event) => unref(orderForm).billing_first_name = $event,
                            class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_first_name }]
                          }, null, _parent4, _scopeId3));
                          if (unref(orderForm).errors.billing_first_name) {
                            _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.billing_first_name)}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div><div data-v-cf701f0d${_scopeId3}><label for="billing_last_name" data-v-cf701f0d${_scopeId3}>Last Name</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "billing_last_name",
                            modelValue: unref(orderForm).billing_last_name,
                            "onUpdate:modelValue": ($event) => unref(orderForm).billing_last_name = $event,
                            class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_last_name }]
                          }, null, _parent4, _scopeId3));
                          if (unref(orderForm).errors.billing_last_name) {
                            _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.billing_last_name)}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div></div><div data-v-cf701f0d${_scopeId3}><label for="billing_email" data-v-cf701f0d${_scopeId3}>Email</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "billing_email",
                            type: "email",
                            modelValue: unref(orderForm).billing_email,
                            "onUpdate:modelValue": ($event) => unref(orderForm).billing_email = $event,
                            class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_email }]
                          }, null, _parent4, _scopeId3));
                          if (unref(orderForm).errors.billing_email) {
                            _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.billing_email)}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div><div data-v-cf701f0d${_scopeId3}><label for="billing_address" data-v-cf701f0d${_scopeId3}>Street Address</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "billing_address",
                            modelValue: unref(orderForm).billing_address,
                            "onUpdate:modelValue": ($event) => unref(orderForm).billing_address = $event,
                            class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_address }]
                          }, null, _parent4, _scopeId3));
                          if (unref(orderForm).errors.billing_address) {
                            _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.billing_address)}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div><div class="grid grid-cols-1 md:grid-cols-3 gap-4" data-v-cf701f0d${_scopeId3}><div data-v-cf701f0d${_scopeId3}><label for="billing_city" data-v-cf701f0d${_scopeId3}>City</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "billing_city",
                            modelValue: unref(orderForm).billing_city,
                            "onUpdate:modelValue": ($event) => unref(orderForm).billing_city = $event,
                            class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_city }]
                          }, null, _parent4, _scopeId3));
                          if (unref(orderForm).errors.billing_city) {
                            _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.billing_city)}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div><div data-v-cf701f0d${_scopeId3}><label for="billing_state_or_county" data-v-cf701f0d${_scopeId3}>State/County</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "billing_state_or_county",
                            modelValue: unref(orderForm).billing_state_or_county,
                            "onUpdate:modelValue": ($event) => unref(orderForm).billing_state_or_county = $event,
                            class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_state_or_county }]
                          }, null, _parent4, _scopeId3));
                          if (unref(orderForm).errors.billing_state_or_county) {
                            _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.billing_state_or_county)}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div><div data-v-cf701f0d${_scopeId3}><label for="billing_postal_code" data-v-cf701f0d${_scopeId3}>Postal Code</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "billing_postal_code",
                            modelValue: unref(orderForm).billing_postal_code,
                            "onUpdate:modelValue": ($event) => unref(orderForm).billing_postal_code = $event,
                            class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_postal_code }]
                          }, null, _parent4, _scopeId3));
                          if (unref(orderForm).errors.billing_postal_code) {
                            _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.billing_postal_code)}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div></div><div data-v-cf701f0d${_scopeId3}><label for="billingCountryEdit" class="block font-medium mb-1" data-v-cf701f0d${_scopeId3}>Country</label>`);
                          _push4(ssrRenderComponent(unref(Select), {
                            inputId: "billingCountryEdit",
                            modelValue: unref(orderForm).billing_country_object,
                            "onUpdate:modelValue": ($event) => unref(orderForm).billing_country_object = $event,
                            options: unref(countries),
                            filter: "",
                            optionLabel: "name",
                            placeholder: "Select a country",
                            class: [{ "p-invalid": unref(orderForm).errors.billing_country }, "w-full"],
                            onChange: onBillingCountryChange,
                            dataKey: "code"
                          }, {
                            value: withCtx((slotProps, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (slotProps.value) {
                                  _push5(`<div class="flex items-center" data-v-cf701f0d${_scopeId4}>`);
                                  if (slotProps.value.code) {
                                    _push5(`<span class="${ssrRenderClass(`fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`)}" style="${ssrRenderStyle({ "font-size": "1.2rem" })}" data-v-cf701f0d${_scopeId4}></span>`);
                                  } else {
                                    _push5(`<div class="mr-2 inline-block rounded-sm" style="${ssrRenderStyle({ "width": "20px", "height": "15px", "background-color": "#f0f0f0" })}" data-v-cf701f0d${_scopeId4}></div>`);
                                  }
                                  _push5(`<div data-v-cf701f0d${_scopeId4}>${ssrInterpolate(slotProps.value.name)}</div></div>`);
                                } else {
                                  _push5(`<span data-v-cf701f0d${_scopeId4}>${ssrInterpolate(slotProps.placeholder)}</span>`);
                                }
                              } else {
                                return [
                                  slotProps.value ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "flex items-center"
                                  }, [
                                    slotProps.value.code ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: `fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`,
                                      style: { "font-size": "1.2rem" }
                                    }, null, 2)) : (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "mr-2 inline-block rounded-sm",
                                      style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                    })),
                                    createVNode("div", null, toDisplayString(slotProps.value.name), 1)
                                  ])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(slotProps.placeholder), 1))
                                ];
                              }
                            }),
                            option: withCtx((slotProps, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<div class="flex items-center" data-v-cf701f0d${_scopeId4}>`);
                                if (slotProps.option.code) {
                                  _push5(`<span class="${ssrRenderClass(`fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`)}" style="${ssrRenderStyle({ "font-size": "1.2rem" })}" data-v-cf701f0d${_scopeId4}></span>`);
                                } else {
                                  _push5(`<div class="mr-2 inline-block rounded-sm" style="${ssrRenderStyle({ "width": "20px", "height": "15px", "background-color": "#f0f0f0" })}" data-v-cf701f0d${_scopeId4}></div>`);
                                }
                                _push5(`<div data-v-cf701f0d${_scopeId4}>${ssrInterpolate(slotProps.option.name)}</div></div>`);
                              } else {
                                return [
                                  createVNode("div", { class: "flex items-center" }, [
                                    slotProps.option.code ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: `fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`,
                                      style: { "font-size": "1.2rem" }
                                    }, null, 2)) : (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "mr-2 inline-block rounded-sm",
                                      style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                    })),
                                    createVNode("div", null, toDisplayString(slotProps.option.name), 1)
                                  ])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          if (unref(orderForm).errors.billing_country) {
                            _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.billing_country)}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div><div data-v-cf701f0d${_scopeId3}><label for="billing_phone" data-v-cf701f0d${_scopeId3}>Phone</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "billing_phone",
                            modelValue: unref(orderForm).billing_phone,
                            "onUpdate:modelValue": ($event) => unref(orderForm).billing_phone = $event,
                            class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_phone }]
                          }, null, _parent4, _scopeId3));
                          if (unref(orderForm).errors.billing_phone) {
                            _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.billing_phone)}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div></div>`);
                        }
                        if (editModes.billing) {
                          _push4(`<div class="mt-4 pt-4 border-t" data-v-cf701f0d${_scopeId3}><div class="flex items-center mb-3" data-v-cf701f0d${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(Checkbox), {
                            inputId: "wantsInvoiceEdit",
                            modelValue: unref(orderForm).wants_invoice,
                            "onUpdate:modelValue": ($event) => unref(orderForm).wants_invoice = $event,
                            binary: true
                          }, null, _parent4, _scopeId3));
                          _push4(`<label for="wantsInvoiceEdit" class="ml-2 font-medium" data-v-cf701f0d${_scopeId3}>Requires Invoice Details</label></div>`);
                          if (unref(orderForm).wants_invoice) {
                            _push4(`<div class="space-y-4" data-v-cf701f0d${_scopeId3}><div data-v-cf701f0d${_scopeId3}><label for="invoice_company_name" data-v-cf701f0d${_scopeId3}>Company Name</label>`);
                            _push4(ssrRenderComponent(unref(InputText), {
                              id: "invoice_company_name",
                              modelValue: unref(orderForm).invoice_company_name,
                              "onUpdate:modelValue": ($event) => unref(orderForm).invoice_company_name = $event,
                              class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_company_name }]
                            }, null, _parent4, _scopeId3));
                            if (unref(orderForm).errors.invoice_company_name) {
                              _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.invoice_company_name)}</small>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div><div data-v-cf701f0d${_scopeId3}><label for="invoice_vat_number" data-v-cf701f0d${_scopeId3}>VAT Number</label>`);
                            _push4(ssrRenderComponent(unref(InputText), {
                              id: "invoice_vat_number",
                              modelValue: unref(orderForm).invoice_vat_number,
                              "onUpdate:modelValue": ($event) => unref(orderForm).invoice_vat_number = $event,
                              class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_vat_number }]
                            }, null, _parent4, _scopeId3));
                            if (unref(orderForm).errors.invoice_vat_number) {
                              _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.invoice_vat_number)}</small>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div><div data-v-cf701f0d${_scopeId3}><label for="invoice_profession" data-v-cf701f0d${_scopeId3}>Profession</label>`);
                            _push4(ssrRenderComponent(unref(InputText), {
                              id: "invoice_profession",
                              modelValue: unref(orderForm).invoice_profession,
                              "onUpdate:modelValue": ($event) => unref(orderForm).invoice_profession = $event,
                              class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_profession }]
                            }, null, _parent4, _scopeId3));
                            if (unref(orderForm).errors.invoice_profession) {
                              _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.invoice_profession)}</small>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div><div data-v-cf701f0d${_scopeId3}><label for="invoice_tax_office" data-v-cf701f0d${_scopeId3}>Tax Office</label>`);
                            _push4(ssrRenderComponent(unref(InputText), {
                              id: "invoice_tax_office",
                              modelValue: unref(orderForm).invoice_tax_office,
                              "onUpdate:modelValue": ($event) => unref(orderForm).invoice_tax_office = $event,
                              class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_tax_office }]
                            }, null, _parent4, _scopeId3));
                            if (unref(orderForm).errors.invoice_tax_office) {
                              _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.invoice_tax_office)}</small>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div></div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                        } else if (!editModes.billing && unref(orderForm).wants_invoice) {
                          _push4(`<div class="mt-4 pt-4 border-t space-y-1 text-sm" data-v-cf701f0d${_scopeId3}><h4 class="font-semibold mb-1" data-v-cf701f0d${_scopeId3}>Invoice Details:</h4>`);
                          if (unref(orderForm).invoice_company_name) {
                            _push4(`<p data-v-cf701f0d${_scopeId3}>Company: ${ssrInterpolate(unref(orderForm).invoice_company_name)}</p>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (unref(orderForm).invoice_vat_number) {
                            _push4(`<p data-v-cf701f0d${_scopeId3}>VAT: ${ssrInterpolate(unref(orderForm).invoice_vat_number)}</p>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (unref(orderForm).invoice_profession) {
                            _push4(`<p data-v-cf701f0d${_scopeId3}>Profession: ${ssrInterpolate(unref(orderForm).invoice_profession)}</p>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (unref(orderForm).invoice_tax_office) {
                            _push4(`<p data-v-cf701f0d${_scopeId3}>Tax Office: ${ssrInterpolate(unref(orderForm).invoice_tax_office)}</p>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          !editModes.billing ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "space-y-1 text-sm"
                          }, [
                            createVNode("p", null, toDisplayString(unref(orderForm).billing_first_name) + " " + toDisplayString(unref(orderForm).billing_last_name), 1),
                            createVNode("p", null, toDisplayString(unref(orderForm).billing_email), 1),
                            createVNode("p", null, toDisplayString(unref(orderForm).billing_address), 1),
                            createVNode("p", null, toDisplayString(unref(orderForm).billing_city) + ", " + toDisplayString(unref(orderForm).billing_state_or_county) + " " + toDisplayString(unref(orderForm).billing_postal_code), 1),
                            createVNode("p", null, toDisplayString(getCountryName(unref(orderForm).billing_country)), 1),
                            unref(orderForm).billing_phone ? (openBlock(), createBlock("p", { key: 0 }, "Phone: " + toDisplayString(unref(orderForm).billing_phone), 1)) : createCommentVNode("", true)
                          ])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "space-y-4"
                          }, [
                            createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                              createVNode("div", null, [
                                createVNode("label", { for: "billing_first_name" }, "First Name"),
                                createVNode(unref(InputText), {
                                  id: "billing_first_name",
                                  modelValue: unref(orderForm).billing_first_name,
                                  "onUpdate:modelValue": ($event) => unref(orderForm).billing_first_name = $event,
                                  class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_first_name }]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(orderForm).errors.billing_first_name ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(orderForm).errors.billing_first_name), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode("label", { for: "billing_last_name" }, "Last Name"),
                                createVNode(unref(InputText), {
                                  id: "billing_last_name",
                                  modelValue: unref(orderForm).billing_last_name,
                                  "onUpdate:modelValue": ($event) => unref(orderForm).billing_last_name = $event,
                                  class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_last_name }]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(orderForm).errors.billing_last_name ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(orderForm).errors.billing_last_name), 1)) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("div", null, [
                              createVNode("label", { for: "billing_email" }, "Email"),
                              createVNode(unref(InputText), {
                                id: "billing_email",
                                type: "email",
                                modelValue: unref(orderForm).billing_email,
                                "onUpdate:modelValue": ($event) => unref(orderForm).billing_email = $event,
                                class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_email }]
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                              unref(orderForm).errors.billing_email ? (openBlock(), createBlock("small", {
                                key: 0,
                                class: "p-error"
                              }, toDisplayString(unref(orderForm).errors.billing_email), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", null, [
                              createVNode("label", { for: "billing_address" }, "Street Address"),
                              createVNode(unref(InputText), {
                                id: "billing_address",
                                modelValue: unref(orderForm).billing_address,
                                "onUpdate:modelValue": ($event) => unref(orderForm).billing_address = $event,
                                class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_address }]
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                              unref(orderForm).errors.billing_address ? (openBlock(), createBlock("small", {
                                key: 0,
                                class: "p-error"
                              }, toDisplayString(unref(orderForm).errors.billing_address), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                              createVNode("div", null, [
                                createVNode("label", { for: "billing_city" }, "City"),
                                createVNode(unref(InputText), {
                                  id: "billing_city",
                                  modelValue: unref(orderForm).billing_city,
                                  "onUpdate:modelValue": ($event) => unref(orderForm).billing_city = $event,
                                  class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_city }]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(orderForm).errors.billing_city ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(orderForm).errors.billing_city), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode("label", { for: "billing_state_or_county" }, "State/County"),
                                createVNode(unref(InputText), {
                                  id: "billing_state_or_county",
                                  modelValue: unref(orderForm).billing_state_or_county,
                                  "onUpdate:modelValue": ($event) => unref(orderForm).billing_state_or_county = $event,
                                  class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_state_or_county }]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(orderForm).errors.billing_state_or_county ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(orderForm).errors.billing_state_or_county), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode("label", { for: "billing_postal_code" }, "Postal Code"),
                                createVNode(unref(InputText), {
                                  id: "billing_postal_code",
                                  modelValue: unref(orderForm).billing_postal_code,
                                  "onUpdate:modelValue": ($event) => unref(orderForm).billing_postal_code = $event,
                                  class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_postal_code }]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(orderForm).errors.billing_postal_code ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(orderForm).errors.billing_postal_code), 1)) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "billingCountryEdit",
                                class: "block font-medium mb-1"
                              }, "Country"),
                              createVNode(unref(Select), {
                                inputId: "billingCountryEdit",
                                modelValue: unref(orderForm).billing_country_object,
                                "onUpdate:modelValue": ($event) => unref(orderForm).billing_country_object = $event,
                                options: unref(countries),
                                filter: "",
                                optionLabel: "name",
                                placeholder: "Select a country",
                                class: [{ "p-invalid": unref(orderForm).errors.billing_country }, "w-full"],
                                onChange: onBillingCountryChange,
                                dataKey: "code"
                              }, {
                                value: withCtx((slotProps) => [
                                  slotProps.value ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "flex items-center"
                                  }, [
                                    slotProps.value.code ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: `fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`,
                                      style: { "font-size": "1.2rem" }
                                    }, null, 2)) : (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "mr-2 inline-block rounded-sm",
                                      style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                    })),
                                    createVNode("div", null, toDisplayString(slotProps.value.name), 1)
                                  ])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(slotProps.placeholder), 1))
                                ]),
                                option: withCtx((slotProps) => [
                                  createVNode("div", { class: "flex items-center" }, [
                                    slotProps.option.code ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: `fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`,
                                      style: { "font-size": "1.2rem" }
                                    }, null, 2)) : (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "mr-2 inline-block rounded-sm",
                                      style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                    })),
                                    createVNode("div", null, toDisplayString(slotProps.option.name), 1)
                                  ])
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue", "options", "class"]),
                              unref(orderForm).errors.billing_country ? (openBlock(), createBlock("small", {
                                key: 0,
                                class: "p-error"
                              }, toDisplayString(unref(orderForm).errors.billing_country), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", null, [
                              createVNode("label", { for: "billing_phone" }, "Phone"),
                              createVNode(unref(InputText), {
                                id: "billing_phone",
                                modelValue: unref(orderForm).billing_phone,
                                "onUpdate:modelValue": ($event) => unref(orderForm).billing_phone = $event,
                                class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_phone }]
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                              unref(orderForm).errors.billing_phone ? (openBlock(), createBlock("small", {
                                key: 0,
                                class: "p-error"
                              }, toDisplayString(unref(orderForm).errors.billing_phone), 1)) : createCommentVNode("", true)
                            ])
                          ])),
                          editModes.billing ? (openBlock(), createBlock("div", {
                            key: 2,
                            class: "mt-4 pt-4 border-t"
                          }, [
                            createVNode("div", { class: "flex items-center mb-3" }, [
                              createVNode(unref(Checkbox), {
                                inputId: "wantsInvoiceEdit",
                                modelValue: unref(orderForm).wants_invoice,
                                "onUpdate:modelValue": ($event) => unref(orderForm).wants_invoice = $event,
                                binary: true
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode("label", {
                                for: "wantsInvoiceEdit",
                                class: "ml-2 font-medium"
                              }, "Requires Invoice Details")
                            ]),
                            unref(orderForm).wants_invoice ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "space-y-4"
                            }, [
                              createVNode("div", null, [
                                createVNode("label", { for: "invoice_company_name" }, "Company Name"),
                                createVNode(unref(InputText), {
                                  id: "invoice_company_name",
                                  modelValue: unref(orderForm).invoice_company_name,
                                  "onUpdate:modelValue": ($event) => unref(orderForm).invoice_company_name = $event,
                                  class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_company_name }]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(orderForm).errors.invoice_company_name ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(orderForm).errors.invoice_company_name), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode("label", { for: "invoice_vat_number" }, "VAT Number"),
                                createVNode(unref(InputText), {
                                  id: "invoice_vat_number",
                                  modelValue: unref(orderForm).invoice_vat_number,
                                  "onUpdate:modelValue": ($event) => unref(orderForm).invoice_vat_number = $event,
                                  class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_vat_number }]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(orderForm).errors.invoice_vat_number ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(orderForm).errors.invoice_vat_number), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode("label", { for: "invoice_profession" }, "Profession"),
                                createVNode(unref(InputText), {
                                  id: "invoice_profession",
                                  modelValue: unref(orderForm).invoice_profession,
                                  "onUpdate:modelValue": ($event) => unref(orderForm).invoice_profession = $event,
                                  class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_profession }]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(orderForm).errors.invoice_profession ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(orderForm).errors.invoice_profession), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode("label", { for: "invoice_tax_office" }, "Tax Office"),
                                createVNode(unref(InputText), {
                                  id: "invoice_tax_office",
                                  modelValue: unref(orderForm).invoice_tax_office,
                                  "onUpdate:modelValue": ($event) => unref(orderForm).invoice_tax_office = $event,
                                  class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_tax_office }]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(orderForm).errors.invoice_tax_office ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(orderForm).errors.invoice_tax_office), 1)) : createCommentVNode("", true)
                              ])
                            ])) : createCommentVNode("", true)
                          ])) : !editModes.billing && unref(orderForm).wants_invoice ? (openBlock(), createBlock("div", {
                            key: 3,
                            class: "mt-4 pt-4 border-t space-y-1 text-sm"
                          }, [
                            createVNode("h4", { class: "font-semibold mb-1" }, "Invoice Details:"),
                            unref(orderForm).invoice_company_name ? (openBlock(), createBlock("p", { key: 0 }, "Company: " + toDisplayString(unref(orderForm).invoice_company_name), 1)) : createCommentVNode("", true),
                            unref(orderForm).invoice_vat_number ? (openBlock(), createBlock("p", { key: 1 }, "VAT: " + toDisplayString(unref(orderForm).invoice_vat_number), 1)) : createCommentVNode("", true),
                            unref(orderForm).invoice_profession ? (openBlock(), createBlock("p", { key: 2 }, "Profession: " + toDisplayString(unref(orderForm).invoice_profession), 1)) : createCommentVNode("", true),
                            unref(orderForm).invoice_tax_office ? (openBlock(), createBlock("p", { key: 3 }, "Tax Office: " + toDisplayString(unref(orderForm).invoice_tax_office), 1)) : createCommentVNode("", true)
                          ])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Card), null, {
                    title: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex justify-between items-center" data-v-cf701f0d${_scopeId3}><span data-v-cf701f0d${_scopeId3}>Shipping Details</span>`);
                        _push4(ssrRenderComponent(unref(Button), {
                          icon: "pi pi-pencil",
                          text: "",
                          rounded: "",
                          size: "small",
                          onClick: ($event) => toggleEditMode("shipping"),
                          "aria-label": "Edit Shipping Details"
                        }, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex justify-between items-center" }, [
                            createVNode("span", null, "Shipping Details"),
                            createVNode(unref(Button), {
                              icon: "pi pi-pencil",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => toggleEditMode("shipping"),
                              "aria-label": "Edit Shipping Details"
                            }, null, 8, ["onClick"])
                          ])
                        ];
                      }
                    }),
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (!editModes.shipping) {
                          _push4(`<div class="space-y-1 text-sm" data-v-cf701f0d${_scopeId3}>`);
                          if (!unref(orderForm).shipping_is_different) {
                            _push4(`<p class="italic text-gray-500 dark:text-gray-400" data-v-cf701f0d${_scopeId3}>Same as billing address.</p>`);
                          } else {
                            _push4(`<!--[--><p data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).shipping_first_name)} ${ssrInterpolate(unref(orderForm).shipping_last_name)}</p>`);
                            if (unref(orderForm).shipping_email) {
                              _push4(`<p data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).shipping_email)}</p>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`<p data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).shipping_address)}</p><p data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).shipping_city)}, ${ssrInterpolate(unref(orderForm).shipping_state_or_county)} ${ssrInterpolate(unref(orderForm).shipping_postal_code)}</p><p data-v-cf701f0d${_scopeId3}>${ssrInterpolate(getCountryName(unref(orderForm).shipping_country))}</p>`);
                            if (unref(orderForm).shipping_phone) {
                              _push4(`<p data-v-cf701f0d${_scopeId3}>Phone: ${ssrInterpolate(unref(orderForm).shipping_phone)}</p>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`<!--]-->`);
                          }
                          _push4(`</div>`);
                        } else {
                          _push4(`<div class="space-y-4" data-v-cf701f0d${_scopeId3}><div class="flex items-center" data-v-cf701f0d${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(Checkbox), {
                            inputId: "shippingIsDifferentEdit",
                            modelValue: unref(orderForm).shipping_is_different,
                            "onUpdate:modelValue": ($event) => unref(orderForm).shipping_is_different = $event,
                            binary: true
                          }, null, _parent4, _scopeId3));
                          _push4(`<label for="shippingIsDifferentEdit" class="ml-2 font-medium" data-v-cf701f0d${_scopeId3}>Ship to a different address</label></div>`);
                          if (unref(orderForm).shipping_is_different) {
                            _push4(`<!--[--><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-cf701f0d${_scopeId3}><div data-v-cf701f0d${_scopeId3}><label for="shipping_first_name" data-v-cf701f0d${_scopeId3}>First Name</label>`);
                            _push4(ssrRenderComponent(unref(InputText), {
                              id: "shipping_first_name",
                              modelValue: unref(orderForm).shipping_first_name,
                              "onUpdate:modelValue": ($event) => unref(orderForm).shipping_first_name = $event,
                              class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_first_name }]
                            }, null, _parent4, _scopeId3));
                            if (unref(orderForm).errors.shipping_first_name) {
                              _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.shipping_first_name)}</small>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div><div data-v-cf701f0d${_scopeId3}><label for="shipping_last_name" data-v-cf701f0d${_scopeId3}>Last Name</label>`);
                            _push4(ssrRenderComponent(unref(InputText), {
                              id: "shipping_last_name",
                              modelValue: unref(orderForm).shipping_last_name,
                              "onUpdate:modelValue": ($event) => unref(orderForm).shipping_last_name = $event,
                              class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_last_name }]
                            }, null, _parent4, _scopeId3));
                            if (unref(orderForm).errors.shipping_last_name) {
                              _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.shipping_last_name)}</small>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div></div><div data-v-cf701f0d${_scopeId3}><label for="shipping_email" data-v-cf701f0d${_scopeId3}>Email</label>`);
                            _push4(ssrRenderComponent(unref(InputText), {
                              id: "shipping_email",
                              type: "email",
                              modelValue: unref(orderForm).shipping_email,
                              "onUpdate:modelValue": ($event) => unref(orderForm).shipping_email = $event,
                              class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_email }]
                            }, null, _parent4, _scopeId3));
                            if (unref(orderForm).errors.shipping_email) {
                              _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.shipping_email)}</small>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div><div data-v-cf701f0d${_scopeId3}><label for="shipping_address" data-v-cf701f0d${_scopeId3}>Street Address</label>`);
                            _push4(ssrRenderComponent(unref(InputText), {
                              id: "shipping_address",
                              modelValue: unref(orderForm).shipping_address,
                              "onUpdate:modelValue": ($event) => unref(orderForm).shipping_address = $event,
                              class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_address }]
                            }, null, _parent4, _scopeId3));
                            if (unref(orderForm).errors.shipping_address) {
                              _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.shipping_address)}</small>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div><div class="grid grid-cols-1 md:grid-cols-3 gap-4" data-v-cf701f0d${_scopeId3}><div data-v-cf701f0d${_scopeId3}><label for="shipping_city" data-v-cf701f0d${_scopeId3}>City</label>`);
                            _push4(ssrRenderComponent(unref(InputText), {
                              id: "shipping_city",
                              modelValue: unref(orderForm).shipping_city,
                              "onUpdate:modelValue": ($event) => unref(orderForm).shipping_city = $event,
                              class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_city }]
                            }, null, _parent4, _scopeId3));
                            if (unref(orderForm).errors.shipping_city) {
                              _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.shipping_city)}</small>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div><div data-v-cf701f0d${_scopeId3}><label for="shipping_state_or_county" data-v-cf701f0d${_scopeId3}>State/County</label>`);
                            _push4(ssrRenderComponent(unref(InputText), {
                              id: "shipping_state_or_county",
                              modelValue: unref(orderForm).shipping_state_or_county,
                              "onUpdate:modelValue": ($event) => unref(orderForm).shipping_state_or_county = $event,
                              class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_state_or_county }]
                            }, null, _parent4, _scopeId3));
                            if (unref(orderForm).errors.shipping_state_or_county) {
                              _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.shipping_state_or_county)}</small>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div><div data-v-cf701f0d${_scopeId3}><label for="shipping_postal_code" data-v-cf701f0d${_scopeId3}>Postal Code</label>`);
                            _push4(ssrRenderComponent(unref(InputText), {
                              id: "shipping_postal_code",
                              modelValue: unref(orderForm).shipping_postal_code,
                              "onUpdate:modelValue": ($event) => unref(orderForm).shipping_postal_code = $event,
                              class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_postal_code }]
                            }, null, _parent4, _scopeId3));
                            if (unref(orderForm).errors.shipping_postal_code) {
                              _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.shipping_postal_code)}</small>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div></div><div data-v-cf701f0d${_scopeId3}><label for="shippingCountryEdit" class="block font-medium mb-1" data-v-cf701f0d${_scopeId3}>Country</label>`);
                            _push4(ssrRenderComponent(unref(Select), {
                              inputId: "shippingCountryEdit",
                              modelValue: unref(orderForm).shipping_country_object,
                              "onUpdate:modelValue": ($event) => unref(orderForm).shipping_country_object = $event,
                              options: unref(countries),
                              filter: "",
                              optionLabel: "name",
                              placeholder: "Select a country",
                              class: [{ "p-invalid": unref(orderForm).errors.shipping_country }, "w-full"],
                              onChange: onShippingCountryChange,
                              dataKey: "code"
                            }, {
                              value: withCtx((slotProps, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (slotProps.value) {
                                    _push5(`<div class="flex items-center" data-v-cf701f0d${_scopeId4}>`);
                                    if (slotProps.value.code) {
                                      _push5(`<span class="${ssrRenderClass(`fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`)}" style="${ssrRenderStyle({ "font-size": "1.2rem" })}" data-v-cf701f0d${_scopeId4}></span>`);
                                    } else {
                                      _push5(`<div class="mr-2 inline-block rounded-sm" style="${ssrRenderStyle({ "width": "20px", "height": "15px", "background-color": "#f0f0f0" })}" data-v-cf701f0d${_scopeId4}></div>`);
                                    }
                                    _push5(`<div data-v-cf701f0d${_scopeId4}>${ssrInterpolate(slotProps.value.name)}</div></div>`);
                                  } else {
                                    _push5(`<span data-v-cf701f0d${_scopeId4}>${ssrInterpolate(slotProps.placeholder)}</span>`);
                                  }
                                } else {
                                  return [
                                    slotProps.value ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "flex items-center"
                                    }, [
                                      slotProps.value.code ? (openBlock(), createBlock("span", {
                                        key: 0,
                                        class: `fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`,
                                        style: { "font-size": "1.2rem" }
                                      }, null, 2)) : (openBlock(), createBlock("div", {
                                        key: 1,
                                        class: "mr-2 inline-block rounded-sm",
                                        style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                      })),
                                      createVNode("div", null, toDisplayString(slotProps.value.name), 1)
                                    ])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(slotProps.placeholder), 1))
                                  ];
                                }
                              }),
                              option: withCtx((slotProps, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex items-center" data-v-cf701f0d${_scopeId4}>`);
                                  if (slotProps.option.code) {
                                    _push5(`<span class="${ssrRenderClass(`fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`)}" style="${ssrRenderStyle({ "font-size": "1.2rem" })}" data-v-cf701f0d${_scopeId4}></span>`);
                                  } else {
                                    _push5(`<div class="mr-2 inline-block rounded-sm" style="${ssrRenderStyle({ "width": "20px", "height": "15px", "background-color": "#f0f0f0" })}" data-v-cf701f0d${_scopeId4}></div>`);
                                  }
                                  _push5(`<div data-v-cf701f0d${_scopeId4}>${ssrInterpolate(slotProps.option.name)}</div></div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex items-center" }, [
                                      slotProps.option.code ? (openBlock(), createBlock("span", {
                                        key: 0,
                                        class: `fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`,
                                        style: { "font-size": "1.2rem" }
                                      }, null, 2)) : (openBlock(), createBlock("div", {
                                        key: 1,
                                        class: "mr-2 inline-block rounded-sm",
                                        style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                      })),
                                      createVNode("div", null, toDisplayString(slotProps.option.name), 1)
                                    ])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            if (unref(orderForm).errors.shipping_country) {
                              _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.shipping_country)}</small>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div><div data-v-cf701f0d${_scopeId3}><label for="shipping_phone" data-v-cf701f0d${_scopeId3}>Phone</label>`);
                            _push4(ssrRenderComponent(unref(InputText), {
                              id: "shipping_phone",
                              modelValue: unref(orderForm).shipping_phone,
                              "onUpdate:modelValue": ($event) => unref(orderForm).shipping_phone = $event,
                              class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_phone }]
                            }, null, _parent4, _scopeId3));
                            if (unref(orderForm).errors.shipping_phone) {
                              _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.shipping_phone)}</small>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div><!--]-->`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                        }
                      } else {
                        return [
                          !editModes.shipping ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "space-y-1 text-sm"
                          }, [
                            !unref(orderForm).shipping_is_different ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "italic text-gray-500 dark:text-gray-400"
                            }, "Same as billing address.")) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                              createVNode("p", null, toDisplayString(unref(orderForm).shipping_first_name) + " " + toDisplayString(unref(orderForm).shipping_last_name), 1),
                              unref(orderForm).shipping_email ? (openBlock(), createBlock("p", { key: 0 }, toDisplayString(unref(orderForm).shipping_email), 1)) : createCommentVNode("", true),
                              createVNode("p", null, toDisplayString(unref(orderForm).shipping_address), 1),
                              createVNode("p", null, toDisplayString(unref(orderForm).shipping_city) + ", " + toDisplayString(unref(orderForm).shipping_state_or_county) + " " + toDisplayString(unref(orderForm).shipping_postal_code), 1),
                              createVNode("p", null, toDisplayString(getCountryName(unref(orderForm).shipping_country)), 1),
                              unref(orderForm).shipping_phone ? (openBlock(), createBlock("p", { key: 1 }, "Phone: " + toDisplayString(unref(orderForm).shipping_phone), 1)) : createCommentVNode("", true)
                            ], 64))
                          ])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "space-y-4"
                          }, [
                            createVNode("div", { class: "flex items-center" }, [
                              createVNode(unref(Checkbox), {
                                inputId: "shippingIsDifferentEdit",
                                modelValue: unref(orderForm).shipping_is_different,
                                "onUpdate:modelValue": ($event) => unref(orderForm).shipping_is_different = $event,
                                binary: true
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode("label", {
                                for: "shippingIsDifferentEdit",
                                class: "ml-2 font-medium"
                              }, "Ship to a different address")
                            ]),
                            unref(orderForm).shipping_is_different ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                                createVNode("div", null, [
                                  createVNode("label", { for: "shipping_first_name" }, "First Name"),
                                  createVNode(unref(InputText), {
                                    id: "shipping_first_name",
                                    modelValue: unref(orderForm).shipping_first_name,
                                    "onUpdate:modelValue": ($event) => unref(orderForm).shipping_first_name = $event,
                                    class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_first_name }]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(orderForm).errors.shipping_first_name ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(orderForm).errors.shipping_first_name), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", { for: "shipping_last_name" }, "Last Name"),
                                  createVNode(unref(InputText), {
                                    id: "shipping_last_name",
                                    modelValue: unref(orderForm).shipping_last_name,
                                    "onUpdate:modelValue": ($event) => unref(orderForm).shipping_last_name = $event,
                                    class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_last_name }]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(orderForm).errors.shipping_last_name ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(orderForm).errors.shipping_last_name), 1)) : createCommentVNode("", true)
                                ])
                              ]),
                              createVNode("div", null, [
                                createVNode("label", { for: "shipping_email" }, "Email"),
                                createVNode(unref(InputText), {
                                  id: "shipping_email",
                                  type: "email",
                                  modelValue: unref(orderForm).shipping_email,
                                  "onUpdate:modelValue": ($event) => unref(orderForm).shipping_email = $event,
                                  class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_email }]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(orderForm).errors.shipping_email ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(orderForm).errors.shipping_email), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode("label", { for: "shipping_address" }, "Street Address"),
                                createVNode(unref(InputText), {
                                  id: "shipping_address",
                                  modelValue: unref(orderForm).shipping_address,
                                  "onUpdate:modelValue": ($event) => unref(orderForm).shipping_address = $event,
                                  class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_address }]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(orderForm).errors.shipping_address ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(orderForm).errors.shipping_address), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                                createVNode("div", null, [
                                  createVNode("label", { for: "shipping_city" }, "City"),
                                  createVNode(unref(InputText), {
                                    id: "shipping_city",
                                    modelValue: unref(orderForm).shipping_city,
                                    "onUpdate:modelValue": ($event) => unref(orderForm).shipping_city = $event,
                                    class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_city }]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(orderForm).errors.shipping_city ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(orderForm).errors.shipping_city), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", { for: "shipping_state_or_county" }, "State/County"),
                                  createVNode(unref(InputText), {
                                    id: "shipping_state_or_county",
                                    modelValue: unref(orderForm).shipping_state_or_county,
                                    "onUpdate:modelValue": ($event) => unref(orderForm).shipping_state_or_county = $event,
                                    class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_state_or_county }]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(orderForm).errors.shipping_state_or_county ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(orderForm).errors.shipping_state_or_county), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", { for: "shipping_postal_code" }, "Postal Code"),
                                  createVNode(unref(InputText), {
                                    id: "shipping_postal_code",
                                    modelValue: unref(orderForm).shipping_postal_code,
                                    "onUpdate:modelValue": ($event) => unref(orderForm).shipping_postal_code = $event,
                                    class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_postal_code }]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(orderForm).errors.shipping_postal_code ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(orderForm).errors.shipping_postal_code), 1)) : createCommentVNode("", true)
                                ])
                              ]),
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "shippingCountryEdit",
                                  class: "block font-medium mb-1"
                                }, "Country"),
                                createVNode(unref(Select), {
                                  inputId: "shippingCountryEdit",
                                  modelValue: unref(orderForm).shipping_country_object,
                                  "onUpdate:modelValue": ($event) => unref(orderForm).shipping_country_object = $event,
                                  options: unref(countries),
                                  filter: "",
                                  optionLabel: "name",
                                  placeholder: "Select a country",
                                  class: [{ "p-invalid": unref(orderForm).errors.shipping_country }, "w-full"],
                                  onChange: onShippingCountryChange,
                                  dataKey: "code"
                                }, {
                                  value: withCtx((slotProps) => [
                                    slotProps.value ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "flex items-center"
                                    }, [
                                      slotProps.value.code ? (openBlock(), createBlock("span", {
                                        key: 0,
                                        class: `fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`,
                                        style: { "font-size": "1.2rem" }
                                      }, null, 2)) : (openBlock(), createBlock("div", {
                                        key: 1,
                                        class: "mr-2 inline-block rounded-sm",
                                        style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                      })),
                                      createVNode("div", null, toDisplayString(slotProps.value.name), 1)
                                    ])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(slotProps.placeholder), 1))
                                  ]),
                                  option: withCtx((slotProps) => [
                                    createVNode("div", { class: "flex items-center" }, [
                                      slotProps.option.code ? (openBlock(), createBlock("span", {
                                        key: 0,
                                        class: `fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`,
                                        style: { "font-size": "1.2rem" }
                                      }, null, 2)) : (openBlock(), createBlock("div", {
                                        key: 1,
                                        class: "mr-2 inline-block rounded-sm",
                                        style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                      })),
                                      createVNode("div", null, toDisplayString(slotProps.option.name), 1)
                                    ])
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue", "options", "class"]),
                                unref(orderForm).errors.shipping_country ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(orderForm).errors.shipping_country), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode("label", { for: "shipping_phone" }, "Phone"),
                                createVNode(unref(InputText), {
                                  id: "shipping_phone",
                                  modelValue: unref(orderForm).shipping_phone,
                                  "onUpdate:modelValue": ($event) => unref(orderForm).shipping_phone = $event,
                                  class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_phone }]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(orderForm).errors.shipping_phone ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(orderForm).errors.shipping_phone), 1)) : createCommentVNode("", true)
                              ])
                            ], 64)) : createCommentVNode("", true)
                          ]))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Card), null, {
                    title: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Order Notes`);
                      } else {
                        return [
                          createTextVNode("Order Notes")
                        ];
                      }
                    }),
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Textarea), {
                          modelValue: unref(orderForm).notes,
                          "onUpdate:modelValue": ($event) => unref(orderForm).notes = $event,
                          rows: "4",
                          class: ["w-full", { "p-invalid": unref(orderForm).errors.notes }],
                          placeholder: "Admin notes for this order..."
                        }, null, _parent4, _scopeId3));
                        if (unref(orderForm).errors.notes) {
                          _push4(`<small class="p-error" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(unref(orderForm).errors.notes)}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          createVNode(unref(Textarea), {
                            modelValue: unref(orderForm).notes,
                            "onUpdate:modelValue": ($event) => unref(orderForm).notes = $event,
                            rows: "4",
                            class: ["w-full", { "p-invalid": unref(orderForm).errors.notes }],
                            placeholder: "Admin notes for this order..."
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                          unref(orderForm).errors.notes ? (openBlock(), createBlock("small", {
                            key: 0,
                            class: "p-error"
                          }, toDisplayString(unref(orderForm).errors.notes), 1)) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="md:col-span-1" data-v-cf701f0d${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Card), null, {
                    title: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Order Items (${ssrInterpolate(__props.order.items.length)})`);
                      } else {
                        return [
                          createTextVNode("Order Items (" + toDisplayString(__props.order.items.length) + ")", 1)
                        ];
                      }
                    }),
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (__props.order.items && __props.order.items.length > 0) {
                          _push4(`<div class="space-y-4" data-v-cf701f0d${_scopeId3}><!--[-->`);
                          ssrRenderList(__props.order.items, (item) => {
                            var _a, _b, _c, _d;
                            _push4(`<div data-v-cf701f0d${_scopeId3}>`);
                            _push4(ssrRenderComponent(_component_Divider, null, null, _parent4, _scopeId3));
                            _push4(`<div class="flex justify-between items-center" data-v-cf701f0d${_scopeId3}><div class="flex-shrink-0 w-16 sm:w-20" data-v-cf701f0d${_scopeId3}>`);
                            _push4(ssrRenderComponent(_sfc_main$2, {
                              "artwork-image": ((_a = item.artwork_data) == null ? void 0 : _a.img_thumb) || ((_b = item.artwork_data) == null ? void 0 : _b.img_medium) || "/images/placeholder.png",
                              frame: item.frame,
                              size: item.size,
                              type: item.type
                            }, null, _parent4, _scopeId3));
                            _push4(`</div><div class="flex-1 min-w-0" data-v-cf701f0d${_scopeId3}><p class="font-medium text-sm text-surface-900 truncate" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(((_c = item.artwork_data) == null ? void 0 : _c.title) || "Untitled")}</p><p class="text-xs text-surface-500" data-v-cf701f0d${_scopeId3}> ID: ${ssrInterpolate(item.artwork_id || item.pictufy_id || item.id)}</p><p class="text-xs text-surface-500" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(item.type)} | ${ssrInterpolate(item.print_type === "oil" ? "Oil Print" : "Mono Print")} | ${ssrInterpolate(item.frame)} | ${ssrInterpolate(item.size)}</p><p class="text-sm font-semibold text-surface-700 mt-1" data-v-cf701f0d${_scopeId3}>${ssrInterpolate(item.quantity)} x ${ssrInterpolate(formatCurrency(((_d = item.artwork_data) == null ? void 0 : _d.price) || 0))}</p></div><a${ssrRenderAttr("href", _ctx.route("dashboard.orders.download-artwork", { order: __props.order.id, item: item.id }))} target="_blank" rel="noopener noreferrer" class="desktop-download" data-v-cf701f0d${_scopeId3}>`);
                            _push4(ssrRenderComponent(unref(Button), {
                              icon: "pi pi-download",
                              label: "High Res",
                              size: "small",
                              severity: "info",
                              outlined: ""
                            }, null, _parent4, _scopeId3));
                            _push4(`</a></div><div class="mobile-download mt-2" data-v-cf701f0d${_scopeId3}><a${ssrRenderAttr("href", _ctx.route("dashboard.orders.download-artwork", { order: __props.order.id, item: item.id }))} target="_blank" rel="noopener noreferrer" data-v-cf701f0d${_scopeId3}>`);
                            _push4(ssrRenderComponent(unref(Button), {
                              icon: "pi pi-download",
                              label: "High Res",
                              size: "small",
                              severity: "info",
                              outlined: "",
                              class: "w-full sm:w-auto"
                            }, null, _parent4, _scopeId3));
                            _push4(`</a></div></div>`);
                          });
                          _push4(`<!--]--></div>`);
                        } else {
                          _push4(`<p data-v-cf701f0d${_scopeId3}>No items found for this order.</p>`);
                        }
                      } else {
                        return [
                          __props.order.items && __props.order.items.length > 0 ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "space-y-4"
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.order.items, (item) => {
                              var _a, _b, _c, _d;
                              return openBlock(), createBlock("div", {
                                key: item.id
                              }, [
                                createVNode(_component_Divider),
                                createVNode("div", { class: "flex justify-between items-center" }, [
                                  createVNode("div", { class: "flex-shrink-0 w-16 sm:w-20" }, [
                                    createVNode(_sfc_main$2, {
                                      "artwork-image": ((_a = item.artwork_data) == null ? void 0 : _a.img_thumb) || ((_b = item.artwork_data) == null ? void 0 : _b.img_medium) || "/images/placeholder.png",
                                      frame: item.frame,
                                      size: item.size,
                                      type: item.type
                                    }, null, 8, ["artwork-image", "frame", "size", "type"])
                                  ]),
                                  createVNode("div", { class: "flex-1 min-w-0" }, [
                                    createVNode("p", { class: "font-medium text-sm text-surface-900 truncate" }, toDisplayString(((_c = item.artwork_data) == null ? void 0 : _c.title) || "Untitled"), 1),
                                    createVNode("p", { class: "text-xs text-surface-500" }, " ID: " + toDisplayString(item.artwork_id || item.pictufy_id || item.id), 1),
                                    createVNode("p", { class: "text-xs text-surface-500" }, toDisplayString(item.type) + " | " + toDisplayString(item.print_type === "oil" ? "Oil Print" : "Mono Print") + " | " + toDisplayString(item.frame) + " | " + toDisplayString(item.size), 1),
                                    createVNode("p", { class: "text-sm font-semibold text-surface-700 mt-1" }, toDisplayString(item.quantity) + " x " + toDisplayString(formatCurrency(((_d = item.artwork_data) == null ? void 0 : _d.price) || 0)), 1)
                                  ]),
                                  createVNode("a", {
                                    href: _ctx.route("dashboard.orders.download-artwork", { order: __props.order.id, item: item.id }),
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    class: "desktop-download"
                                  }, [
                                    createVNode(unref(Button), {
                                      icon: "pi pi-download",
                                      label: "High Res",
                                      size: "small",
                                      severity: "info",
                                      outlined: ""
                                    })
                                  ], 8, ["href"])
                                ]),
                                createVNode("div", { class: "mobile-download mt-2" }, [
                                  createVNode("a", {
                                    href: _ctx.route("dashboard.orders.download-artwork", { order: __props.order.id, item: item.id }),
                                    target: "_blank",
                                    rel: "noopener noreferrer"
                                  }, [
                                    createVNode(unref(Button), {
                                      icon: "pi pi-download",
                                      label: "High Res",
                                      size: "small",
                                      severity: "info",
                                      outlined: "",
                                      class: "w-full sm:w-auto"
                                    })
                                  ], 8, ["href"])
                                ])
                              ]);
                            }), 128))
                          ])) : (openBlock(), createBlock("p", { key: 1 }, "No items found for this order."))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div><div class="mt-8 flex justify-end space-x-3" data-v-cf701f0d${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Link), {
                    href: _ctx.route("dashboard.orders.index")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Button), {
                          label: "Back to Orders",
                          severity: "secondary",
                          outlined: "",
                          icon: "pi pi-arrow-left"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Button), {
                            label: "Back to Orders",
                            severity: "secondary",
                            outlined: "",
                            icon: "pi pi-arrow-left"
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Button), {
                    type: "submit",
                    label: "Save All Changes",
                    icon: "pi pi-check",
                    loading: unref(orderForm).processing
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></form></div>`);
                } else {
                  return [
                    createVNode(PageTitleSection, {
                      title: `Order Details: ${unref(orderForm).order_number}`,
                      breadcrumbs: `Dashboard > Orders > ${unref(orderForm).order_number}`
                    }, null, 8, ["title", "breadcrumbs"]),
                    createVNode("div", { class: "mt-6" }, [
                      createVNode("form", {
                        onSubmit: withModifiers(updateOrderDetails, ["prevent"])
                      }, [
                        createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-6" }, [
                          createVNode("div", { class: "md:col-span-2 space-y-6" }, [
                            createVNode(unref(Card), null, {
                              title: withCtx(() => [
                                createVNode("div", { class: "flex justify-between items-center" }, [
                                  createVNode("span", null, "Order Information")
                                ])
                              ]),
                              content: withCtx(() => [
                                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                                  createVNode("div", { class: "mb-2" }, [
                                    createVNode("strong", null, "Order Date:"),
                                    createTextVNode(" " + toDisplayString(formatDate(__props.order.created_at)), 1)
                                  ]),
                                  createVNode("div", { class: "mb-2" }, [
                                    createVNode("strong", null, "Last Updated:"),
                                    createTextVNode(" " + toDisplayString(formatDate(__props.order.updated_at)), 1)
                                  ]),
                                  createVNode("div", { class: "border-t border-gray-100 pt-4 mt-4 space-y-3" }, [
                                    createVNode("div", { class: "flex justify-between text-sm" }, [
                                      createVNode("span", { class: "text-gray-500" }, "Subtotal"),
                                      createVNode("span", { class: "font-medium text-gray-900" }, toDisplayString(formatCurrency(parseFloat(__props.order.total_amount) + parseFloat(__props.order.discount_amount))), 1)
                                    ]),
                                    Number(__props.order.discount_amount) > 0 ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "flex justify-between text-sm"
                                    }, [
                                      createVNode("span", { class: "text-green-600 flex items-center" }, [
                                        createVNode("i", { class: "pi pi-tag mr-2 text-xs" }),
                                        createTextVNode(" Discount (" + toDisplayString(__props.order.coupon_code) + ") ", 1)
                                      ]),
                                      createVNode("span", { class: "font-medium text-green-600" }, " -" + toDisplayString(formatCurrency(__props.order.discount_amount)), 1)
                                    ])) : createCommentVNode("", true),
                                    createVNode("div", { class: "flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100" }, [
                                      createVNode("span", null, "Total Amount"),
                                      createVNode("span", null, toDisplayString(formatCurrency(__props.order.total_amount)), 1)
                                    ])
                                  ]),
                                  createVNode("div", { class: "mb-2" }, [
                                    createVNode("strong", null, "Payment Method:"),
                                    createTextVNode(" " + toDisplayString(__props.order.payment_method), 1)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "status",
                                      class: "block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    }, "Order Status"),
                                    createVNode(unref(Select), {
                                      id: "status",
                                      modelValue: unref(orderForm).status,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).status = $event,
                                      options: orderStatusOptions.value,
                                      optionLabel: "label",
                                      optionValue: "value",
                                      placeholder: "Select Status",
                                      class: ["w-full mt-1", { "p-invalid": unref(orderForm).errors.status }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "class"]),
                                    unref(orderForm).errors.status ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.status), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "payment_status",
                                      class: "block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    }, "Payment Status"),
                                    createVNode(unref(Select), {
                                      id: "payment_status",
                                      modelValue: unref(orderForm).payment_status,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).payment_status = $event,
                                      options: paymentStatusOptions.value,
                                      optionLabel: "label",
                                      optionValue: "value",
                                      placeholder: "Select Payment Status",
                                      class: ["w-full mt-1", { "p-invalid": unref(orderForm).errors.payment_status }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "class"]),
                                    unref(orderForm).errors.payment_status ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.payment_status), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "transaction_id",
                                      class: "block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    }, "Transaction ID"),
                                    createVNode(unref(InputText), {
                                      id: "transaction_id",
                                      modelValue: unref(orderForm).transaction_id,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).transaction_id = $event,
                                      class: ["w-full mt-1", { "p-invalid": unref(orderForm).errors.transaction_id }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.transaction_id ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.transaction_id), 1)) : createCommentVNode("", true)
                                  ])
                                ])
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Card), null, {
                              title: withCtx(() => [
                                createVNode("div", { class: "flex justify-between items-center" }, [
                                  createVNode("span", null, "Billing Details"),
                                  createVNode(unref(Button), {
                                    icon: "pi pi-pencil",
                                    text: "",
                                    rounded: "",
                                    size: "small",
                                    onClick: ($event) => toggleEditMode("billing"),
                                    "aria-label": "Edit Billing Details"
                                  }, null, 8, ["onClick"])
                                ])
                              ]),
                              content: withCtx(() => [
                                !editModes.billing ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "space-y-1 text-sm"
                                }, [
                                  createVNode("p", null, toDisplayString(unref(orderForm).billing_first_name) + " " + toDisplayString(unref(orderForm).billing_last_name), 1),
                                  createVNode("p", null, toDisplayString(unref(orderForm).billing_email), 1),
                                  createVNode("p", null, toDisplayString(unref(orderForm).billing_address), 1),
                                  createVNode("p", null, toDisplayString(unref(orderForm).billing_city) + ", " + toDisplayString(unref(orderForm).billing_state_or_county) + " " + toDisplayString(unref(orderForm).billing_postal_code), 1),
                                  createVNode("p", null, toDisplayString(getCountryName(unref(orderForm).billing_country)), 1),
                                  unref(orderForm).billing_phone ? (openBlock(), createBlock("p", { key: 0 }, "Phone: " + toDisplayString(unref(orderForm).billing_phone), 1)) : createCommentVNode("", true)
                                ])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "space-y-4"
                                }, [
                                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                                    createVNode("div", null, [
                                      createVNode("label", { for: "billing_first_name" }, "First Name"),
                                      createVNode(unref(InputText), {
                                        id: "billing_first_name",
                                        modelValue: unref(orderForm).billing_first_name,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).billing_first_name = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_first_name }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.billing_first_name ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.billing_first_name), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { for: "billing_last_name" }, "Last Name"),
                                      createVNode(unref(InputText), {
                                        id: "billing_last_name",
                                        modelValue: unref(orderForm).billing_last_name,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).billing_last_name = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_last_name }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.billing_last_name ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.billing_last_name), 1)) : createCommentVNode("", true)
                                    ])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { for: "billing_email" }, "Email"),
                                    createVNode(unref(InputText), {
                                      id: "billing_email",
                                      type: "email",
                                      modelValue: unref(orderForm).billing_email,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).billing_email = $event,
                                      class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_email }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.billing_email ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.billing_email), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { for: "billing_address" }, "Street Address"),
                                    createVNode(unref(InputText), {
                                      id: "billing_address",
                                      modelValue: unref(orderForm).billing_address,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).billing_address = $event,
                                      class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_address }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.billing_address ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.billing_address), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                                    createVNode("div", null, [
                                      createVNode("label", { for: "billing_city" }, "City"),
                                      createVNode(unref(InputText), {
                                        id: "billing_city",
                                        modelValue: unref(orderForm).billing_city,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).billing_city = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_city }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.billing_city ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.billing_city), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { for: "billing_state_or_county" }, "State/County"),
                                      createVNode(unref(InputText), {
                                        id: "billing_state_or_county",
                                        modelValue: unref(orderForm).billing_state_or_county,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).billing_state_or_county = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_state_or_county }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.billing_state_or_county ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.billing_state_or_county), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { for: "billing_postal_code" }, "Postal Code"),
                                      createVNode(unref(InputText), {
                                        id: "billing_postal_code",
                                        modelValue: unref(orderForm).billing_postal_code,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).billing_postal_code = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_postal_code }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.billing_postal_code ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.billing_postal_code), 1)) : createCommentVNode("", true)
                                    ])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "billingCountryEdit",
                                      class: "block font-medium mb-1"
                                    }, "Country"),
                                    createVNode(unref(Select), {
                                      inputId: "billingCountryEdit",
                                      modelValue: unref(orderForm).billing_country_object,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).billing_country_object = $event,
                                      options: unref(countries),
                                      filter: "",
                                      optionLabel: "name",
                                      placeholder: "Select a country",
                                      class: [{ "p-invalid": unref(orderForm).errors.billing_country }, "w-full"],
                                      onChange: onBillingCountryChange,
                                      dataKey: "code"
                                    }, {
                                      value: withCtx((slotProps) => [
                                        slotProps.value ? (openBlock(), createBlock("div", {
                                          key: 0,
                                          class: "flex items-center"
                                        }, [
                                          slotProps.value.code ? (openBlock(), createBlock("span", {
                                            key: 0,
                                            class: `fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`,
                                            style: { "font-size": "1.2rem" }
                                          }, null, 2)) : (openBlock(), createBlock("div", {
                                            key: 1,
                                            class: "mr-2 inline-block rounded-sm",
                                            style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                          })),
                                          createVNode("div", null, toDisplayString(slotProps.value.name), 1)
                                        ])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(slotProps.placeholder), 1))
                                      ]),
                                      option: withCtx((slotProps) => [
                                        createVNode("div", { class: "flex items-center" }, [
                                          slotProps.option.code ? (openBlock(), createBlock("span", {
                                            key: 0,
                                            class: `fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`,
                                            style: { "font-size": "1.2rem" }
                                          }, null, 2)) : (openBlock(), createBlock("div", {
                                            key: 1,
                                            class: "mr-2 inline-block rounded-sm",
                                            style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                          })),
                                          createVNode("div", null, toDisplayString(slotProps.option.name), 1)
                                        ])
                                      ]),
                                      _: 1
                                    }, 8, ["modelValue", "onUpdate:modelValue", "options", "class"]),
                                    unref(orderForm).errors.billing_country ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.billing_country), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { for: "billing_phone" }, "Phone"),
                                    createVNode(unref(InputText), {
                                      id: "billing_phone",
                                      modelValue: unref(orderForm).billing_phone,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).billing_phone = $event,
                                      class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_phone }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.billing_phone ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.billing_phone), 1)) : createCommentVNode("", true)
                                  ])
                                ])),
                                editModes.billing ? (openBlock(), createBlock("div", {
                                  key: 2,
                                  class: "mt-4 pt-4 border-t"
                                }, [
                                  createVNode("div", { class: "flex items-center mb-3" }, [
                                    createVNode(unref(Checkbox), {
                                      inputId: "wantsInvoiceEdit",
                                      modelValue: unref(orderForm).wants_invoice,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).wants_invoice = $event,
                                      binary: true
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                    createVNode("label", {
                                      for: "wantsInvoiceEdit",
                                      class: "ml-2 font-medium"
                                    }, "Requires Invoice Details")
                                  ]),
                                  unref(orderForm).wants_invoice ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "space-y-4"
                                  }, [
                                    createVNode("div", null, [
                                      createVNode("label", { for: "invoice_company_name" }, "Company Name"),
                                      createVNode(unref(InputText), {
                                        id: "invoice_company_name",
                                        modelValue: unref(orderForm).invoice_company_name,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).invoice_company_name = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_company_name }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.invoice_company_name ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.invoice_company_name), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { for: "invoice_vat_number" }, "VAT Number"),
                                      createVNode(unref(InputText), {
                                        id: "invoice_vat_number",
                                        modelValue: unref(orderForm).invoice_vat_number,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).invoice_vat_number = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_vat_number }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.invoice_vat_number ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.invoice_vat_number), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { for: "invoice_profession" }, "Profession"),
                                      createVNode(unref(InputText), {
                                        id: "invoice_profession",
                                        modelValue: unref(orderForm).invoice_profession,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).invoice_profession = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_profession }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.invoice_profession ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.invoice_profession), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { for: "invoice_tax_office" }, "Tax Office"),
                                      createVNode(unref(InputText), {
                                        id: "invoice_tax_office",
                                        modelValue: unref(orderForm).invoice_tax_office,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).invoice_tax_office = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_tax_office }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.invoice_tax_office ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.invoice_tax_office), 1)) : createCommentVNode("", true)
                                    ])
                                  ])) : createCommentVNode("", true)
                                ])) : !editModes.billing && unref(orderForm).wants_invoice ? (openBlock(), createBlock("div", {
                                  key: 3,
                                  class: "mt-4 pt-4 border-t space-y-1 text-sm"
                                }, [
                                  createVNode("h4", { class: "font-semibold mb-1" }, "Invoice Details:"),
                                  unref(orderForm).invoice_company_name ? (openBlock(), createBlock("p", { key: 0 }, "Company: " + toDisplayString(unref(orderForm).invoice_company_name), 1)) : createCommentVNode("", true),
                                  unref(orderForm).invoice_vat_number ? (openBlock(), createBlock("p", { key: 1 }, "VAT: " + toDisplayString(unref(orderForm).invoice_vat_number), 1)) : createCommentVNode("", true),
                                  unref(orderForm).invoice_profession ? (openBlock(), createBlock("p", { key: 2 }, "Profession: " + toDisplayString(unref(orderForm).invoice_profession), 1)) : createCommentVNode("", true),
                                  unref(orderForm).invoice_tax_office ? (openBlock(), createBlock("p", { key: 3 }, "Tax Office: " + toDisplayString(unref(orderForm).invoice_tax_office), 1)) : createCommentVNode("", true)
                                ])) : createCommentVNode("", true)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Card), null, {
                              title: withCtx(() => [
                                createVNode("div", { class: "flex justify-between items-center" }, [
                                  createVNode("span", null, "Shipping Details"),
                                  createVNode(unref(Button), {
                                    icon: "pi pi-pencil",
                                    text: "",
                                    rounded: "",
                                    size: "small",
                                    onClick: ($event) => toggleEditMode("shipping"),
                                    "aria-label": "Edit Shipping Details"
                                  }, null, 8, ["onClick"])
                                ])
                              ]),
                              content: withCtx(() => [
                                !editModes.shipping ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "space-y-1 text-sm"
                                }, [
                                  !unref(orderForm).shipping_is_different ? (openBlock(), createBlock("p", {
                                    key: 0,
                                    class: "italic text-gray-500 dark:text-gray-400"
                                  }, "Same as billing address.")) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                    createVNode("p", null, toDisplayString(unref(orderForm).shipping_first_name) + " " + toDisplayString(unref(orderForm).shipping_last_name), 1),
                                    unref(orderForm).shipping_email ? (openBlock(), createBlock("p", { key: 0 }, toDisplayString(unref(orderForm).shipping_email), 1)) : createCommentVNode("", true),
                                    createVNode("p", null, toDisplayString(unref(orderForm).shipping_address), 1),
                                    createVNode("p", null, toDisplayString(unref(orderForm).shipping_city) + ", " + toDisplayString(unref(orderForm).shipping_state_or_county) + " " + toDisplayString(unref(orderForm).shipping_postal_code), 1),
                                    createVNode("p", null, toDisplayString(getCountryName(unref(orderForm).shipping_country)), 1),
                                    unref(orderForm).shipping_phone ? (openBlock(), createBlock("p", { key: 1 }, "Phone: " + toDisplayString(unref(orderForm).shipping_phone), 1)) : createCommentVNode("", true)
                                  ], 64))
                                ])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "space-y-4"
                                }, [
                                  createVNode("div", { class: "flex items-center" }, [
                                    createVNode(unref(Checkbox), {
                                      inputId: "shippingIsDifferentEdit",
                                      modelValue: unref(orderForm).shipping_is_different,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).shipping_is_different = $event,
                                      binary: true
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                    createVNode("label", {
                                      for: "shippingIsDifferentEdit",
                                      class: "ml-2 font-medium"
                                    }, "Ship to a different address")
                                  ]),
                                  unref(orderForm).shipping_is_different ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                                      createVNode("div", null, [
                                        createVNode("label", { for: "shipping_first_name" }, "First Name"),
                                        createVNode(unref(InputText), {
                                          id: "shipping_first_name",
                                          modelValue: unref(orderForm).shipping_first_name,
                                          "onUpdate:modelValue": ($event) => unref(orderForm).shipping_first_name = $event,
                                          class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_first_name }]
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                        unref(orderForm).errors.shipping_first_name ? (openBlock(), createBlock("small", {
                                          key: 0,
                                          class: "p-error"
                                        }, toDisplayString(unref(orderForm).errors.shipping_first_name), 1)) : createCommentVNode("", true)
                                      ]),
                                      createVNode("div", null, [
                                        createVNode("label", { for: "shipping_last_name" }, "Last Name"),
                                        createVNode(unref(InputText), {
                                          id: "shipping_last_name",
                                          modelValue: unref(orderForm).shipping_last_name,
                                          "onUpdate:modelValue": ($event) => unref(orderForm).shipping_last_name = $event,
                                          class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_last_name }]
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                        unref(orderForm).errors.shipping_last_name ? (openBlock(), createBlock("small", {
                                          key: 0,
                                          class: "p-error"
                                        }, toDisplayString(unref(orderForm).errors.shipping_last_name), 1)) : createCommentVNode("", true)
                                      ])
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { for: "shipping_email" }, "Email"),
                                      createVNode(unref(InputText), {
                                        id: "shipping_email",
                                        type: "email",
                                        modelValue: unref(orderForm).shipping_email,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).shipping_email = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_email }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.shipping_email ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.shipping_email), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { for: "shipping_address" }, "Street Address"),
                                      createVNode(unref(InputText), {
                                        id: "shipping_address",
                                        modelValue: unref(orderForm).shipping_address,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).shipping_address = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_address }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.shipping_address ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.shipping_address), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                                      createVNode("div", null, [
                                        createVNode("label", { for: "shipping_city" }, "City"),
                                        createVNode(unref(InputText), {
                                          id: "shipping_city",
                                          modelValue: unref(orderForm).shipping_city,
                                          "onUpdate:modelValue": ($event) => unref(orderForm).shipping_city = $event,
                                          class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_city }]
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                        unref(orderForm).errors.shipping_city ? (openBlock(), createBlock("small", {
                                          key: 0,
                                          class: "p-error"
                                        }, toDisplayString(unref(orderForm).errors.shipping_city), 1)) : createCommentVNode("", true)
                                      ]),
                                      createVNode("div", null, [
                                        createVNode("label", { for: "shipping_state_or_county" }, "State/County"),
                                        createVNode(unref(InputText), {
                                          id: "shipping_state_or_county",
                                          modelValue: unref(orderForm).shipping_state_or_county,
                                          "onUpdate:modelValue": ($event) => unref(orderForm).shipping_state_or_county = $event,
                                          class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_state_or_county }]
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                        unref(orderForm).errors.shipping_state_or_county ? (openBlock(), createBlock("small", {
                                          key: 0,
                                          class: "p-error"
                                        }, toDisplayString(unref(orderForm).errors.shipping_state_or_county), 1)) : createCommentVNode("", true)
                                      ]),
                                      createVNode("div", null, [
                                        createVNode("label", { for: "shipping_postal_code" }, "Postal Code"),
                                        createVNode(unref(InputText), {
                                          id: "shipping_postal_code",
                                          modelValue: unref(orderForm).shipping_postal_code,
                                          "onUpdate:modelValue": ($event) => unref(orderForm).shipping_postal_code = $event,
                                          class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_postal_code }]
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                        unref(orderForm).errors.shipping_postal_code ? (openBlock(), createBlock("small", {
                                          key: 0,
                                          class: "p-error"
                                        }, toDisplayString(unref(orderForm).errors.shipping_postal_code), 1)) : createCommentVNode("", true)
                                      ])
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "shippingCountryEdit",
                                        class: "block font-medium mb-1"
                                      }, "Country"),
                                      createVNode(unref(Select), {
                                        inputId: "shippingCountryEdit",
                                        modelValue: unref(orderForm).shipping_country_object,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).shipping_country_object = $event,
                                        options: unref(countries),
                                        filter: "",
                                        optionLabel: "name",
                                        placeholder: "Select a country",
                                        class: [{ "p-invalid": unref(orderForm).errors.shipping_country }, "w-full"],
                                        onChange: onShippingCountryChange,
                                        dataKey: "code"
                                      }, {
                                        value: withCtx((slotProps) => [
                                          slotProps.value ? (openBlock(), createBlock("div", {
                                            key: 0,
                                            class: "flex items-center"
                                          }, [
                                            slotProps.value.code ? (openBlock(), createBlock("span", {
                                              key: 0,
                                              class: `fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`,
                                              style: { "font-size": "1.2rem" }
                                            }, null, 2)) : (openBlock(), createBlock("div", {
                                              key: 1,
                                              class: "mr-2 inline-block rounded-sm",
                                              style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                            })),
                                            createVNode("div", null, toDisplayString(slotProps.value.name), 1)
                                          ])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(slotProps.placeholder), 1))
                                        ]),
                                        option: withCtx((slotProps) => [
                                          createVNode("div", { class: "flex items-center" }, [
                                            slotProps.option.code ? (openBlock(), createBlock("span", {
                                              key: 0,
                                              class: `fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`,
                                              style: { "font-size": "1.2rem" }
                                            }, null, 2)) : (openBlock(), createBlock("div", {
                                              key: 1,
                                              class: "mr-2 inline-block rounded-sm",
                                              style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                            })),
                                            createVNode("div", null, toDisplayString(slotProps.option.name), 1)
                                          ])
                                        ]),
                                        _: 1
                                      }, 8, ["modelValue", "onUpdate:modelValue", "options", "class"]),
                                      unref(orderForm).errors.shipping_country ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.shipping_country), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { for: "shipping_phone" }, "Phone"),
                                      createVNode(unref(InputText), {
                                        id: "shipping_phone",
                                        modelValue: unref(orderForm).shipping_phone,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).shipping_phone = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_phone }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.shipping_phone ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.shipping_phone), 1)) : createCommentVNode("", true)
                                    ])
                                  ], 64)) : createCommentVNode("", true)
                                ]))
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Card), null, {
                              title: withCtx(() => [
                                createTextVNode("Order Notes")
                              ]),
                              content: withCtx(() => [
                                createVNode(unref(Textarea), {
                                  modelValue: unref(orderForm).notes,
                                  "onUpdate:modelValue": ($event) => unref(orderForm).notes = $event,
                                  rows: "4",
                                  class: ["w-full", { "p-invalid": unref(orderForm).errors.notes }],
                                  placeholder: "Admin notes for this order..."
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(orderForm).errors.notes ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(orderForm).errors.notes), 1)) : createCommentVNode("", true)
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "md:col-span-1" }, [
                            createVNode(unref(Card), null, {
                              title: withCtx(() => [
                                createTextVNode("Order Items (" + toDisplayString(__props.order.items.length) + ")", 1)
                              ]),
                              content: withCtx(() => [
                                __props.order.items && __props.order.items.length > 0 ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "space-y-4"
                                }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(__props.order.items, (item) => {
                                    var _a, _b, _c, _d;
                                    return openBlock(), createBlock("div", {
                                      key: item.id
                                    }, [
                                      createVNode(_component_Divider),
                                      createVNode("div", { class: "flex justify-between items-center" }, [
                                        createVNode("div", { class: "flex-shrink-0 w-16 sm:w-20" }, [
                                          createVNode(_sfc_main$2, {
                                            "artwork-image": ((_a = item.artwork_data) == null ? void 0 : _a.img_thumb) || ((_b = item.artwork_data) == null ? void 0 : _b.img_medium) || "/images/placeholder.png",
                                            frame: item.frame,
                                            size: item.size,
                                            type: item.type
                                          }, null, 8, ["artwork-image", "frame", "size", "type"])
                                        ]),
                                        createVNode("div", { class: "flex-1 min-w-0" }, [
                                          createVNode("p", { class: "font-medium text-sm text-surface-900 truncate" }, toDisplayString(((_c = item.artwork_data) == null ? void 0 : _c.title) || "Untitled"), 1),
                                          createVNode("p", { class: "text-xs text-surface-500" }, " ID: " + toDisplayString(item.artwork_id || item.pictufy_id || item.id), 1),
                                          createVNode("p", { class: "text-xs text-surface-500" }, toDisplayString(item.type) + " | " + toDisplayString(item.print_type === "oil" ? "Oil Print" : "Mono Print") + " | " + toDisplayString(item.frame) + " | " + toDisplayString(item.size), 1),
                                          createVNode("p", { class: "text-sm font-semibold text-surface-700 mt-1" }, toDisplayString(item.quantity) + " x " + toDisplayString(formatCurrency(((_d = item.artwork_data) == null ? void 0 : _d.price) || 0)), 1)
                                        ]),
                                        createVNode("a", {
                                          href: _ctx.route("dashboard.orders.download-artwork", { order: __props.order.id, item: item.id }),
                                          target: "_blank",
                                          rel: "noopener noreferrer",
                                          class: "desktop-download"
                                        }, [
                                          createVNode(unref(Button), {
                                            icon: "pi pi-download",
                                            label: "High Res",
                                            size: "small",
                                            severity: "info",
                                            outlined: ""
                                          })
                                        ], 8, ["href"])
                                      ]),
                                      createVNode("div", { class: "mobile-download mt-2" }, [
                                        createVNode("a", {
                                          href: _ctx.route("dashboard.orders.download-artwork", { order: __props.order.id, item: item.id }),
                                          target: "_blank",
                                          rel: "noopener noreferrer"
                                        }, [
                                          createVNode(unref(Button), {
                                            icon: "pi pi-download",
                                            label: "High Res",
                                            size: "small",
                                            severity: "info",
                                            outlined: "",
                                            class: "w-full sm:w-auto"
                                          })
                                        ], 8, ["href"])
                                      ])
                                    ]);
                                  }), 128))
                                ])) : (openBlock(), createBlock("p", { key: 1 }, "No items found for this order."))
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        createVNode("div", { class: "mt-8 flex justify-end space-x-3" }, [
                          createVNode(unref(Link), {
                            href: _ctx.route("dashboard.orders.index")
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Button), {
                                label: "Back to Orders",
                                severity: "secondary",
                                outlined: "",
                                icon: "pi pi-arrow-left"
                              })
                            ]),
                            _: 1
                          }, 8, ["href"]),
                          createVNode(unref(Button), {
                            type: "submit",
                            label: "Save All Changes",
                            icon: "pi pi-check",
                            loading: unref(orderForm).processing
                          }, null, 8, ["loading"])
                        ])
                      ], 32)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Head), {
                title: `Admin - Order ${unref(orderForm).order_number}`
              }, null, 8, ["title"]),
              createVNode(_sfc_main$1, null, {
                default: withCtx(() => [
                  createVNode(PageTitleSection, {
                    title: `Order Details: ${unref(orderForm).order_number}`,
                    breadcrumbs: `Dashboard > Orders > ${unref(orderForm).order_number}`
                  }, null, 8, ["title", "breadcrumbs"]),
                  createVNode("div", { class: "mt-6" }, [
                    createVNode("form", {
                      onSubmit: withModifiers(updateOrderDetails, ["prevent"])
                    }, [
                      createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-6" }, [
                        createVNode("div", { class: "md:col-span-2 space-y-6" }, [
                          createVNode(unref(Card), null, {
                            title: withCtx(() => [
                              createVNode("div", { class: "flex justify-between items-center" }, [
                                createVNode("span", null, "Order Information")
                              ])
                            ]),
                            content: withCtx(() => [
                              createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                                createVNode("div", { class: "mb-2" }, [
                                  createVNode("strong", null, "Order Date:"),
                                  createTextVNode(" " + toDisplayString(formatDate(__props.order.created_at)), 1)
                                ]),
                                createVNode("div", { class: "mb-2" }, [
                                  createVNode("strong", null, "Last Updated:"),
                                  createTextVNode(" " + toDisplayString(formatDate(__props.order.updated_at)), 1)
                                ]),
                                createVNode("div", { class: "border-t border-gray-100 pt-4 mt-4 space-y-3" }, [
                                  createVNode("div", { class: "flex justify-between text-sm" }, [
                                    createVNode("span", { class: "text-gray-500" }, "Subtotal"),
                                    createVNode("span", { class: "font-medium text-gray-900" }, toDisplayString(formatCurrency(parseFloat(__props.order.total_amount) + parseFloat(__props.order.discount_amount))), 1)
                                  ]),
                                  Number(__props.order.discount_amount) > 0 ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "flex justify-between text-sm"
                                  }, [
                                    createVNode("span", { class: "text-green-600 flex items-center" }, [
                                      createVNode("i", { class: "pi pi-tag mr-2 text-xs" }),
                                      createTextVNode(" Discount (" + toDisplayString(__props.order.coupon_code) + ") ", 1)
                                    ]),
                                    createVNode("span", { class: "font-medium text-green-600" }, " -" + toDisplayString(formatCurrency(__props.order.discount_amount)), 1)
                                  ])) : createCommentVNode("", true),
                                  createVNode("div", { class: "flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100" }, [
                                    createVNode("span", null, "Total Amount"),
                                    createVNode("span", null, toDisplayString(formatCurrency(__props.order.total_amount)), 1)
                                  ])
                                ]),
                                createVNode("div", { class: "mb-2" }, [
                                  createVNode("strong", null, "Payment Method:"),
                                  createTextVNode(" " + toDisplayString(__props.order.payment_method), 1)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "status",
                                    class: "block text-sm font-medium text-gray-700 dark:text-gray-300"
                                  }, "Order Status"),
                                  createVNode(unref(Select), {
                                    id: "status",
                                    modelValue: unref(orderForm).status,
                                    "onUpdate:modelValue": ($event) => unref(orderForm).status = $event,
                                    options: orderStatusOptions.value,
                                    optionLabel: "label",
                                    optionValue: "value",
                                    placeholder: "Select Status",
                                    class: ["w-full mt-1", { "p-invalid": unref(orderForm).errors.status }]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "class"]),
                                  unref(orderForm).errors.status ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(orderForm).errors.status), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "payment_status",
                                    class: "block text-sm font-medium text-gray-700 dark:text-gray-300"
                                  }, "Payment Status"),
                                  createVNode(unref(Select), {
                                    id: "payment_status",
                                    modelValue: unref(orderForm).payment_status,
                                    "onUpdate:modelValue": ($event) => unref(orderForm).payment_status = $event,
                                    options: paymentStatusOptions.value,
                                    optionLabel: "label",
                                    optionValue: "value",
                                    placeholder: "Select Payment Status",
                                    class: ["w-full mt-1", { "p-invalid": unref(orderForm).errors.payment_status }]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "class"]),
                                  unref(orderForm).errors.payment_status ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(orderForm).errors.payment_status), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "transaction_id",
                                    class: "block text-sm font-medium text-gray-700 dark:text-gray-300"
                                  }, "Transaction ID"),
                                  createVNode(unref(InputText), {
                                    id: "transaction_id",
                                    modelValue: unref(orderForm).transaction_id,
                                    "onUpdate:modelValue": ($event) => unref(orderForm).transaction_id = $event,
                                    class: ["w-full mt-1", { "p-invalid": unref(orderForm).errors.transaction_id }]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(orderForm).errors.transaction_id ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(orderForm).errors.transaction_id), 1)) : createCommentVNode("", true)
                                ])
                              ])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Card), null, {
                            title: withCtx(() => [
                              createVNode("div", { class: "flex justify-between items-center" }, [
                                createVNode("span", null, "Billing Details"),
                                createVNode(unref(Button), {
                                  icon: "pi pi-pencil",
                                  text: "",
                                  rounded: "",
                                  size: "small",
                                  onClick: ($event) => toggleEditMode("billing"),
                                  "aria-label": "Edit Billing Details"
                                }, null, 8, ["onClick"])
                              ])
                            ]),
                            content: withCtx(() => [
                              !editModes.billing ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "space-y-1 text-sm"
                              }, [
                                createVNode("p", null, toDisplayString(unref(orderForm).billing_first_name) + " " + toDisplayString(unref(orderForm).billing_last_name), 1),
                                createVNode("p", null, toDisplayString(unref(orderForm).billing_email), 1),
                                createVNode("p", null, toDisplayString(unref(orderForm).billing_address), 1),
                                createVNode("p", null, toDisplayString(unref(orderForm).billing_city) + ", " + toDisplayString(unref(orderForm).billing_state_or_county) + " " + toDisplayString(unref(orderForm).billing_postal_code), 1),
                                createVNode("p", null, toDisplayString(getCountryName(unref(orderForm).billing_country)), 1),
                                unref(orderForm).billing_phone ? (openBlock(), createBlock("p", { key: 0 }, "Phone: " + toDisplayString(unref(orderForm).billing_phone), 1)) : createCommentVNode("", true)
                              ])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "space-y-4"
                              }, [
                                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                                  createVNode("div", null, [
                                    createVNode("label", { for: "billing_first_name" }, "First Name"),
                                    createVNode(unref(InputText), {
                                      id: "billing_first_name",
                                      modelValue: unref(orderForm).billing_first_name,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).billing_first_name = $event,
                                      class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_first_name }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.billing_first_name ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.billing_first_name), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { for: "billing_last_name" }, "Last Name"),
                                    createVNode(unref(InputText), {
                                      id: "billing_last_name",
                                      modelValue: unref(orderForm).billing_last_name,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).billing_last_name = $event,
                                      class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_last_name }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.billing_last_name ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.billing_last_name), 1)) : createCommentVNode("", true)
                                  ])
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", { for: "billing_email" }, "Email"),
                                  createVNode(unref(InputText), {
                                    id: "billing_email",
                                    type: "email",
                                    modelValue: unref(orderForm).billing_email,
                                    "onUpdate:modelValue": ($event) => unref(orderForm).billing_email = $event,
                                    class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_email }]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(orderForm).errors.billing_email ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(orderForm).errors.billing_email), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", { for: "billing_address" }, "Street Address"),
                                  createVNode(unref(InputText), {
                                    id: "billing_address",
                                    modelValue: unref(orderForm).billing_address,
                                    "onUpdate:modelValue": ($event) => unref(orderForm).billing_address = $event,
                                    class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_address }]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(orderForm).errors.billing_address ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(orderForm).errors.billing_address), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                                  createVNode("div", null, [
                                    createVNode("label", { for: "billing_city" }, "City"),
                                    createVNode(unref(InputText), {
                                      id: "billing_city",
                                      modelValue: unref(orderForm).billing_city,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).billing_city = $event,
                                      class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_city }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.billing_city ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.billing_city), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { for: "billing_state_or_county" }, "State/County"),
                                    createVNode(unref(InputText), {
                                      id: "billing_state_or_county",
                                      modelValue: unref(orderForm).billing_state_or_county,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).billing_state_or_county = $event,
                                      class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_state_or_county }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.billing_state_or_county ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.billing_state_or_county), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { for: "billing_postal_code" }, "Postal Code"),
                                    createVNode(unref(InputText), {
                                      id: "billing_postal_code",
                                      modelValue: unref(orderForm).billing_postal_code,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).billing_postal_code = $event,
                                      class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_postal_code }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.billing_postal_code ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.billing_postal_code), 1)) : createCommentVNode("", true)
                                  ])
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "billingCountryEdit",
                                    class: "block font-medium mb-1"
                                  }, "Country"),
                                  createVNode(unref(Select), {
                                    inputId: "billingCountryEdit",
                                    modelValue: unref(orderForm).billing_country_object,
                                    "onUpdate:modelValue": ($event) => unref(orderForm).billing_country_object = $event,
                                    options: unref(countries),
                                    filter: "",
                                    optionLabel: "name",
                                    placeholder: "Select a country",
                                    class: [{ "p-invalid": unref(orderForm).errors.billing_country }, "w-full"],
                                    onChange: onBillingCountryChange,
                                    dataKey: "code"
                                  }, {
                                    value: withCtx((slotProps) => [
                                      slotProps.value ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "flex items-center"
                                      }, [
                                        slotProps.value.code ? (openBlock(), createBlock("span", {
                                          key: 0,
                                          class: `fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`,
                                          style: { "font-size": "1.2rem" }
                                        }, null, 2)) : (openBlock(), createBlock("div", {
                                          key: 1,
                                          class: "mr-2 inline-block rounded-sm",
                                          style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                        })),
                                        createVNode("div", null, toDisplayString(slotProps.value.name), 1)
                                      ])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(slotProps.placeholder), 1))
                                    ]),
                                    option: withCtx((slotProps) => [
                                      createVNode("div", { class: "flex items-center" }, [
                                        slotProps.option.code ? (openBlock(), createBlock("span", {
                                          key: 0,
                                          class: `fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`,
                                          style: { "font-size": "1.2rem" }
                                        }, null, 2)) : (openBlock(), createBlock("div", {
                                          key: 1,
                                          class: "mr-2 inline-block rounded-sm",
                                          style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                        })),
                                        createVNode("div", null, toDisplayString(slotProps.option.name), 1)
                                      ])
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue", "onUpdate:modelValue", "options", "class"]),
                                  unref(orderForm).errors.billing_country ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(orderForm).errors.billing_country), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", { for: "billing_phone" }, "Phone"),
                                  createVNode(unref(InputText), {
                                    id: "billing_phone",
                                    modelValue: unref(orderForm).billing_phone,
                                    "onUpdate:modelValue": ($event) => unref(orderForm).billing_phone = $event,
                                    class: ["w-full", { "p-invalid": unref(orderForm).errors.billing_phone }]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(orderForm).errors.billing_phone ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(orderForm).errors.billing_phone), 1)) : createCommentVNode("", true)
                                ])
                              ])),
                              editModes.billing ? (openBlock(), createBlock("div", {
                                key: 2,
                                class: "mt-4 pt-4 border-t"
                              }, [
                                createVNode("div", { class: "flex items-center mb-3" }, [
                                  createVNode(unref(Checkbox), {
                                    inputId: "wantsInvoiceEdit",
                                    modelValue: unref(orderForm).wants_invoice,
                                    "onUpdate:modelValue": ($event) => unref(orderForm).wants_invoice = $event,
                                    binary: true
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode("label", {
                                    for: "wantsInvoiceEdit",
                                    class: "ml-2 font-medium"
                                  }, "Requires Invoice Details")
                                ]),
                                unref(orderForm).wants_invoice ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "space-y-4"
                                }, [
                                  createVNode("div", null, [
                                    createVNode("label", { for: "invoice_company_name" }, "Company Name"),
                                    createVNode(unref(InputText), {
                                      id: "invoice_company_name",
                                      modelValue: unref(orderForm).invoice_company_name,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).invoice_company_name = $event,
                                      class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_company_name }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.invoice_company_name ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.invoice_company_name), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { for: "invoice_vat_number" }, "VAT Number"),
                                    createVNode(unref(InputText), {
                                      id: "invoice_vat_number",
                                      modelValue: unref(orderForm).invoice_vat_number,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).invoice_vat_number = $event,
                                      class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_vat_number }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.invoice_vat_number ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.invoice_vat_number), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { for: "invoice_profession" }, "Profession"),
                                    createVNode(unref(InputText), {
                                      id: "invoice_profession",
                                      modelValue: unref(orderForm).invoice_profession,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).invoice_profession = $event,
                                      class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_profession }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.invoice_profession ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.invoice_profession), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { for: "invoice_tax_office" }, "Tax Office"),
                                    createVNode(unref(InputText), {
                                      id: "invoice_tax_office",
                                      modelValue: unref(orderForm).invoice_tax_office,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).invoice_tax_office = $event,
                                      class: ["w-full", { "p-invalid": unref(orderForm).errors.invoice_tax_office }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.invoice_tax_office ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.invoice_tax_office), 1)) : createCommentVNode("", true)
                                  ])
                                ])) : createCommentVNode("", true)
                              ])) : !editModes.billing && unref(orderForm).wants_invoice ? (openBlock(), createBlock("div", {
                                key: 3,
                                class: "mt-4 pt-4 border-t space-y-1 text-sm"
                              }, [
                                createVNode("h4", { class: "font-semibold mb-1" }, "Invoice Details:"),
                                unref(orderForm).invoice_company_name ? (openBlock(), createBlock("p", { key: 0 }, "Company: " + toDisplayString(unref(orderForm).invoice_company_name), 1)) : createCommentVNode("", true),
                                unref(orderForm).invoice_vat_number ? (openBlock(), createBlock("p", { key: 1 }, "VAT: " + toDisplayString(unref(orderForm).invoice_vat_number), 1)) : createCommentVNode("", true),
                                unref(orderForm).invoice_profession ? (openBlock(), createBlock("p", { key: 2 }, "Profession: " + toDisplayString(unref(orderForm).invoice_profession), 1)) : createCommentVNode("", true),
                                unref(orderForm).invoice_tax_office ? (openBlock(), createBlock("p", { key: 3 }, "Tax Office: " + toDisplayString(unref(orderForm).invoice_tax_office), 1)) : createCommentVNode("", true)
                              ])) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Card), null, {
                            title: withCtx(() => [
                              createVNode("div", { class: "flex justify-between items-center" }, [
                                createVNode("span", null, "Shipping Details"),
                                createVNode(unref(Button), {
                                  icon: "pi pi-pencil",
                                  text: "",
                                  rounded: "",
                                  size: "small",
                                  onClick: ($event) => toggleEditMode("shipping"),
                                  "aria-label": "Edit Shipping Details"
                                }, null, 8, ["onClick"])
                              ])
                            ]),
                            content: withCtx(() => [
                              !editModes.shipping ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "space-y-1 text-sm"
                              }, [
                                !unref(orderForm).shipping_is_different ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "italic text-gray-500 dark:text-gray-400"
                                }, "Same as billing address.")) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                  createVNode("p", null, toDisplayString(unref(orderForm).shipping_first_name) + " " + toDisplayString(unref(orderForm).shipping_last_name), 1),
                                  unref(orderForm).shipping_email ? (openBlock(), createBlock("p", { key: 0 }, toDisplayString(unref(orderForm).shipping_email), 1)) : createCommentVNode("", true),
                                  createVNode("p", null, toDisplayString(unref(orderForm).shipping_address), 1),
                                  createVNode("p", null, toDisplayString(unref(orderForm).shipping_city) + ", " + toDisplayString(unref(orderForm).shipping_state_or_county) + " " + toDisplayString(unref(orderForm).shipping_postal_code), 1),
                                  createVNode("p", null, toDisplayString(getCountryName(unref(orderForm).shipping_country)), 1),
                                  unref(orderForm).shipping_phone ? (openBlock(), createBlock("p", { key: 1 }, "Phone: " + toDisplayString(unref(orderForm).shipping_phone), 1)) : createCommentVNode("", true)
                                ], 64))
                              ])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "space-y-4"
                              }, [
                                createVNode("div", { class: "flex items-center" }, [
                                  createVNode(unref(Checkbox), {
                                    inputId: "shippingIsDifferentEdit",
                                    modelValue: unref(orderForm).shipping_is_different,
                                    "onUpdate:modelValue": ($event) => unref(orderForm).shipping_is_different = $event,
                                    binary: true
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode("label", {
                                    for: "shippingIsDifferentEdit",
                                    class: "ml-2 font-medium"
                                  }, "Ship to a different address")
                                ]),
                                unref(orderForm).shipping_is_different ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                                    createVNode("div", null, [
                                      createVNode("label", { for: "shipping_first_name" }, "First Name"),
                                      createVNode(unref(InputText), {
                                        id: "shipping_first_name",
                                        modelValue: unref(orderForm).shipping_first_name,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).shipping_first_name = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_first_name }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.shipping_first_name ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.shipping_first_name), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { for: "shipping_last_name" }, "Last Name"),
                                      createVNode(unref(InputText), {
                                        id: "shipping_last_name",
                                        modelValue: unref(orderForm).shipping_last_name,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).shipping_last_name = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_last_name }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.shipping_last_name ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.shipping_last_name), 1)) : createCommentVNode("", true)
                                    ])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { for: "shipping_email" }, "Email"),
                                    createVNode(unref(InputText), {
                                      id: "shipping_email",
                                      type: "email",
                                      modelValue: unref(orderForm).shipping_email,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).shipping_email = $event,
                                      class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_email }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.shipping_email ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.shipping_email), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { for: "shipping_address" }, "Street Address"),
                                    createVNode(unref(InputText), {
                                      id: "shipping_address",
                                      modelValue: unref(orderForm).shipping_address,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).shipping_address = $event,
                                      class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_address }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.shipping_address ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.shipping_address), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                                    createVNode("div", null, [
                                      createVNode("label", { for: "shipping_city" }, "City"),
                                      createVNode(unref(InputText), {
                                        id: "shipping_city",
                                        modelValue: unref(orderForm).shipping_city,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).shipping_city = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_city }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.shipping_city ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.shipping_city), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { for: "shipping_state_or_county" }, "State/County"),
                                      createVNode(unref(InputText), {
                                        id: "shipping_state_or_county",
                                        modelValue: unref(orderForm).shipping_state_or_county,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).shipping_state_or_county = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_state_or_county }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.shipping_state_or_county ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.shipping_state_or_county), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", { for: "shipping_postal_code" }, "Postal Code"),
                                      createVNode(unref(InputText), {
                                        id: "shipping_postal_code",
                                        modelValue: unref(orderForm).shipping_postal_code,
                                        "onUpdate:modelValue": ($event) => unref(orderForm).shipping_postal_code = $event,
                                        class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_postal_code }]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(orderForm).errors.shipping_postal_code ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(orderForm).errors.shipping_postal_code), 1)) : createCommentVNode("", true)
                                    ])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "shippingCountryEdit",
                                      class: "block font-medium mb-1"
                                    }, "Country"),
                                    createVNode(unref(Select), {
                                      inputId: "shippingCountryEdit",
                                      modelValue: unref(orderForm).shipping_country_object,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).shipping_country_object = $event,
                                      options: unref(countries),
                                      filter: "",
                                      optionLabel: "name",
                                      placeholder: "Select a country",
                                      class: [{ "p-invalid": unref(orderForm).errors.shipping_country }, "w-full"],
                                      onChange: onShippingCountryChange,
                                      dataKey: "code"
                                    }, {
                                      value: withCtx((slotProps) => [
                                        slotProps.value ? (openBlock(), createBlock("div", {
                                          key: 0,
                                          class: "flex items-center"
                                        }, [
                                          slotProps.value.code ? (openBlock(), createBlock("span", {
                                            key: 0,
                                            class: `fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`,
                                            style: { "font-size": "1.2rem" }
                                          }, null, 2)) : (openBlock(), createBlock("div", {
                                            key: 1,
                                            class: "mr-2 inline-block rounded-sm",
                                            style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                          })),
                                          createVNode("div", null, toDisplayString(slotProps.value.name), 1)
                                        ])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(slotProps.placeholder), 1))
                                      ]),
                                      option: withCtx((slotProps) => [
                                        createVNode("div", { class: "flex items-center" }, [
                                          slotProps.option.code ? (openBlock(), createBlock("span", {
                                            key: 0,
                                            class: `fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`,
                                            style: { "font-size": "1.2rem" }
                                          }, null, 2)) : (openBlock(), createBlock("div", {
                                            key: 1,
                                            class: "mr-2 inline-block rounded-sm",
                                            style: { "width": "20px", "height": "15px", "background-color": "#f0f0f0" }
                                          })),
                                          createVNode("div", null, toDisplayString(slotProps.option.name), 1)
                                        ])
                                      ]),
                                      _: 1
                                    }, 8, ["modelValue", "onUpdate:modelValue", "options", "class"]),
                                    unref(orderForm).errors.shipping_country ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.shipping_country), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", { for: "shipping_phone" }, "Phone"),
                                    createVNode(unref(InputText), {
                                      id: "shipping_phone",
                                      modelValue: unref(orderForm).shipping_phone,
                                      "onUpdate:modelValue": ($event) => unref(orderForm).shipping_phone = $event,
                                      class: ["w-full", { "p-invalid": unref(orderForm).errors.shipping_phone }]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(orderForm).errors.shipping_phone ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(orderForm).errors.shipping_phone), 1)) : createCommentVNode("", true)
                                  ])
                                ], 64)) : createCommentVNode("", true)
                              ]))
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Card), null, {
                            title: withCtx(() => [
                              createTextVNode("Order Notes")
                            ]),
                            content: withCtx(() => [
                              createVNode(unref(Textarea), {
                                modelValue: unref(orderForm).notes,
                                "onUpdate:modelValue": ($event) => unref(orderForm).notes = $event,
                                rows: "4",
                                class: ["w-full", { "p-invalid": unref(orderForm).errors.notes }],
                                placeholder: "Admin notes for this order..."
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                              unref(orderForm).errors.notes ? (openBlock(), createBlock("small", {
                                key: 0,
                                class: "p-error"
                              }, toDisplayString(unref(orderForm).errors.notes), 1)) : createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "md:col-span-1" }, [
                          createVNode(unref(Card), null, {
                            title: withCtx(() => [
                              createTextVNode("Order Items (" + toDisplayString(__props.order.items.length) + ")", 1)
                            ]),
                            content: withCtx(() => [
                              __props.order.items && __props.order.items.length > 0 ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "space-y-4"
                              }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(__props.order.items, (item) => {
                                  var _a, _b, _c, _d;
                                  return openBlock(), createBlock("div", {
                                    key: item.id
                                  }, [
                                    createVNode(_component_Divider),
                                    createVNode("div", { class: "flex justify-between items-center" }, [
                                      createVNode("div", { class: "flex-shrink-0 w-16 sm:w-20" }, [
                                        createVNode(_sfc_main$2, {
                                          "artwork-image": ((_a = item.artwork_data) == null ? void 0 : _a.img_thumb) || ((_b = item.artwork_data) == null ? void 0 : _b.img_medium) || "/images/placeholder.png",
                                          frame: item.frame,
                                          size: item.size,
                                          type: item.type
                                        }, null, 8, ["artwork-image", "frame", "size", "type"])
                                      ]),
                                      createVNode("div", { class: "flex-1 min-w-0" }, [
                                        createVNode("p", { class: "font-medium text-sm text-surface-900 truncate" }, toDisplayString(((_c = item.artwork_data) == null ? void 0 : _c.title) || "Untitled"), 1),
                                        createVNode("p", { class: "text-xs text-surface-500" }, " ID: " + toDisplayString(item.artwork_id || item.pictufy_id || item.id), 1),
                                        createVNode("p", { class: "text-xs text-surface-500" }, toDisplayString(item.type) + " | " + toDisplayString(item.print_type === "oil" ? "Oil Print" : "Mono Print") + " | " + toDisplayString(item.frame) + " | " + toDisplayString(item.size), 1),
                                        createVNode("p", { class: "text-sm font-semibold text-surface-700 mt-1" }, toDisplayString(item.quantity) + " x " + toDisplayString(formatCurrency(((_d = item.artwork_data) == null ? void 0 : _d.price) || 0)), 1)
                                      ]),
                                      createVNode("a", {
                                        href: _ctx.route("dashboard.orders.download-artwork", { order: __props.order.id, item: item.id }),
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        class: "desktop-download"
                                      }, [
                                        createVNode(unref(Button), {
                                          icon: "pi pi-download",
                                          label: "High Res",
                                          size: "small",
                                          severity: "info",
                                          outlined: ""
                                        })
                                      ], 8, ["href"])
                                    ]),
                                    createVNode("div", { class: "mobile-download mt-2" }, [
                                      createVNode("a", {
                                        href: _ctx.route("dashboard.orders.download-artwork", { order: __props.order.id, item: item.id }),
                                        target: "_blank",
                                        rel: "noopener noreferrer"
                                      }, [
                                        createVNode(unref(Button), {
                                          icon: "pi pi-download",
                                          label: "High Res",
                                          size: "small",
                                          severity: "info",
                                          outlined: "",
                                          class: "w-full sm:w-auto"
                                        })
                                      ], 8, ["href"])
                                    ])
                                  ]);
                                }), 128))
                              ])) : (openBlock(), createBlock("p", { key: 1 }, "No items found for this order."))
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      createVNode("div", { class: "mt-8 flex justify-end space-x-3" }, [
                        createVNode(unref(Link), {
                          href: _ctx.route("dashboard.orders.index")
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Button), {
                              label: "Back to Orders",
                              severity: "secondary",
                              outlined: "",
                              icon: "pi pi-arrow-left"
                            })
                          ]),
                          _: 1
                        }, 8, ["href"]),
                        createVNode(unref(Button), {
                          type: "submit",
                          label: "Save All Changes",
                          icon: "pi pi-check",
                          loading: unref(orderForm).processing
                        }, null, 8, ["loading"])
                      ])
                    ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/dashboard/orders/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Show = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cf701f0d"]]);
export {
  Show as default
};
