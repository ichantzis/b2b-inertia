import { ref, computed, watch, onMounted, withCtx, unref, createVNode, createBlock, openBlock, toDisplayString, createCommentVNode, Fragment, renderList, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderList } from "vue/server-renderer";
import { usePage, useForm, Head } from "@inertiajs/vue3";
import { H as HeaderLayout } from "./HeaderLayout-zh2NGVuN.js";
import { a as _sfc_main$1, P as PageTitleSection } from "../ssr.js";
import { _ as _sfc_main$2 } from "./FramedArtworkPreview-NDj3wDB4.js";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import RadioButton from "primevue/radiobutton";
import Button from "primevue/button";
import Card from "primevue/card";
import Divider from "primevue/divider";
import Checkbox from "primevue/checkbox";
import Fieldset from "primevue/fieldset";
import { u as useCountries } from "./useCountries-DisC8OA1.js";
import axios from "axios";
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
import "./SQUARE_WALNUT-87wNLTxN.js";
const _sfc_main = {
  __name: "Checkout",
  __ssrInlineRender: true,
  props: {
    cartItems: Array,
    cartTotal: Number,
    user: Object
  },
  setup(__props) {
    var _a, _b;
    usePage();
    const { countries } = useCountries();
    const form = useForm({
      billingInfo: {
        firstName: ((_a = __props.user.name) == null ? void 0 : _a.split(" ")[0]) || "",
        lastName: ((_b = __props.user.name) == null ? void 0 : _b.split(" ").slice(1).join(" ")) || "",
        email: __props.user.email || "",
        country: __props.user.country || "",
        // This will store the CODE (e.g., 'AT')
        country_object: null,
        // Temporary holder for the selected country object from <Select>
        streetAddress: __props.user.address || "",
        city: __props.user.city || "",
        stateOrCounty: __props.user.state_or_county || "",
        postalCode: __props.user.postal_code || "",
        phone: __props.user.phone || ""
      },
      wantsInvoice: false,
      // New flag for requesting invoice details
      invoiceDetails: {
        // New object for invoice specific fields
        companyName: __props.user.company_name || "",
        vatNumber: __props.user.vat_number || "",
        taxOffice: __props.user.tax_office || "",
        // Optional
        profession: __props.user.profession || ""
      },
      shippingIsDifferent: false,
      shippingInfo: {
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        // This will store the CODE
        country_object: null,
        // Temporary holder
        streetAddress: "",
        city: "",
        stateOrCounty: "",
        postalCode: "",
        phone: ""
      },
      coupon_code: null,
      paymentMethod: "bank_transfer",
      items: __props.cartItems,
      totalAmount: __props.cartTotal,
      notes: ""
    });
    const couponCode = ref("");
    const couponError = ref("");
    const appliedCoupon = ref(null);
    const isCheckingCoupon = ref(false);
    const applyCoupon = async () => {
      var _a2, _b2;
      if (!couponCode.value) return;
      isCheckingCoupon.value = true;
      couponError.value = "";
      try {
        const response = await axios.post(route("checkout.validate.coupon"), {
          code: couponCode.value
        });
        appliedCoupon.value = response.data;
        form.coupon_code = response.data.code;
      } catch (error) {
        couponError.value = ((_b2 = (_a2 = error.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || "Invalid coupon";
        appliedCoupon.value = null;
        form.coupon_code = null;
      } finally {
        isCheckingCoupon.value = false;
      }
    };
    const removeCoupon = () => {
      couponCode.value = "";
      couponError.value = "";
      appliedCoupon.value = null;
      form.coupon_code = null;
    };
    const discountAmount = computed(() => {
      if (!appliedCoupon.value) return 0;
      if (appliedCoupon.value.type === "fixed") {
        return Number(appliedCoupon.value.value);
      } else {
        return __props.cartTotal * Number(appliedCoupon.value.value) / 100;
      }
    });
    const finalTotal = computed(() => {
      return Math.max(0, __props.cartTotal - discountAmount.value);
    });
    function submit() {
      console.log("Submitting form:", form);
      form.post(route("checkout.store"));
    }
    function formatCurrency(value) {
      return new Intl.NumberFormat(void 0, { style: "currency", currency: "EUR" }).format(value);
    }
    const initializeCountryObjects = () => {
      if (form.billingInfo.country) {
        form.billingInfo.country_object = countries.value.find((c) => c.code === form.billingInfo.country) || null;
      }
      if (form.shippingInfo.country) {
        form.shippingInfo.country_object = countries.value.find((c) => c.code === form.shippingInfo.country) || null;
      }
    };
    const onBillingCountryChange = (event) => {
      if (event.value) {
        form.billingInfo.country = event.value.code;
        form.billingInfo.country_object = event.value;
      } else {
        form.billingInfo.country = "";
        form.billingInfo.country_object = null;
      }
      if (!form.shippingIsDifferent) {
        form.shippingInfo.country = form.billingInfo.country;
        form.shippingInfo.country_object = form.billingInfo.country_object;
      }
    };
    const onShippingCountryChange = (event) => {
      if (event.value) {
        form.shippingInfo.country = event.value.code;
        form.shippingInfo.country_object = event.value;
      } else {
        form.shippingInfo.country = "";
        form.shippingInfo.country_object = null;
      }
    };
    watch(() => form.shippingIsDifferent, (isDifferent) => {
      if (!isDifferent) {
        form.shippingInfo = { ...form.billingInfo };
      } else {
        form.shippingInfo = {
          firstName: "",
          lastName: "",
          email: "",
          country: "",
          country_object: null,
          // Reset country fields
          streetAddress: "",
          city: "",
          stateOrCounty: "",
          postalCode: "",
          phone: ""
        };
      }
    });
    watch(() => form.billingInfo, (newBillingInfo) => {
      if (!form.shippingIsDifferent) {
        form.shippingInfo = { ...newBillingInfo };
        if (newBillingInfo.country && !newBillingInfo.country_object) {
          form.shippingInfo.country_object = countries.value.find((c) => c.code === newBillingInfo.country) || null;
        }
      }
    }, { deep: true });
    onMounted(() => {
      initializeCountryObjects();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(HeaderLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Checkout" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(PageTitleSection, { title: "Checkout" }, null, _parent3, _scopeId2));
                  _push3(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6"${_scopeId2}><div class="lg:col-span-2"${_scopeId2}><form class="space-y-6"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Card), null, {
                    title: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<h2 class="text-lg font-semibold"${_scopeId3}>Billing Information</h2>`);
                      } else {
                        return [
                          createVNode("h2", { class: "text-lg font-semibold" }, "Billing Information")
                        ];
                      }
                    }),
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="space-y-6"${_scopeId3}><div${_scopeId3}><label for="billingEmail" class="block font-medium mb-1"${_scopeId3}>Email</label>`);
                        _push4(ssrRenderComponent(unref(InputText), {
                          id: "billingEmail",
                          type: "email",
                          modelValue: unref(form).billingInfo.email,
                          "onUpdate:modelValue": ($event) => unref(form).billingInfo.email = $event,
                          class: [{ "p-invalid": unref(form).errors["billingInfo.email"] }, "w-full"]
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors["billingInfo.email"]) {
                          _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["billingInfo.email"])}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId3}><div${_scopeId3}><label for="billingFirstName" class="block font-medium mb-1"${_scopeId3}>First Name</label>`);
                        _push4(ssrRenderComponent(unref(InputText), {
                          id: "billingFirstName",
                          modelValue: unref(form).billingInfo.firstName,
                          "onUpdate:modelValue": ($event) => unref(form).billingInfo.firstName = $event,
                          class: [{ "p-invalid": unref(form).errors["billingInfo.firstName"] }, "w-full"]
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors["billingInfo.firstName"]) {
                          _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["billingInfo.firstName"])}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div${_scopeId3}><label for="billingLastName" class="block font-medium mb-1"${_scopeId3}>Last Name</label>`);
                        _push4(ssrRenderComponent(unref(InputText), {
                          id: "billingLastName",
                          modelValue: unref(form).billingInfo.lastName,
                          "onUpdate:modelValue": ($event) => unref(form).billingInfo.lastName = $event,
                          class: [{ "p-invalid": unref(form).errors["billingInfo.lastName"] }, "w-full"]
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors["billingInfo.lastName"]) {
                          _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["billingInfo.lastName"])}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div></div><div${_scopeId3}><label for="billingCountry" class="block font-medium mb-1"${_scopeId3}>Country</label>`);
                        _push4(ssrRenderComponent(unref(Select), {
                          inputId: "billingCountry",
                          modelValue: unref(form).billingInfo.country_object,
                          "onUpdate:modelValue": ($event) => unref(form).billingInfo.country_object = $event,
                          options: unref(countries),
                          filter: "",
                          optionLabel: "name",
                          placeholder: "Select a country",
                          class: [{ "p-invalid": unref(form).errors["billingInfo.country"] }, "w-full"],
                          onChange: onBillingCountryChange,
                          dataKey: "code"
                        }, {
                          value: withCtx((slotProps, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              if (slotProps.value) {
                                _push5(`<div class="flex items-center"${_scopeId4}>`);
                                if (slotProps.value.code) {
                                  _push5(`<span class="${ssrRenderClass(`fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`)}" style="${ssrRenderStyle({ "font-size": "1.2rem" })}"${_scopeId4}></span>`);
                                } else {
                                  _push5(`<div class="mr-2 inline-block rounded-sm" style="${ssrRenderStyle({ "width": "20px", "height": "15px", "background-color": "#f0f0f0" })}"${_scopeId4}></div>`);
                                }
                                _push5(`<div${_scopeId4}>${ssrInterpolate(slotProps.value.name)}</div></div>`);
                              } else {
                                _push5(`<span${_scopeId4}>${ssrInterpolate(slotProps.placeholder)}</span>`);
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
                              _push5(`<div class="flex items-center"${_scopeId4}>`);
                              if (slotProps.option.code) {
                                _push5(`<span class="${ssrRenderClass(`fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`)}" style="${ssrRenderStyle({ "font-size": "1.2rem" })}"${_scopeId4}></span>`);
                              } else {
                                _push5(`<div class="mr-2 inline-block rounded-sm" style="${ssrRenderStyle({ "width": "20px", "height": "15px", "background-color": "#f0f0f0" })}"${_scopeId4}></div>`);
                              }
                              _push5(`<div${_scopeId4}>${ssrInterpolate(slotProps.option.name)}</div></div>`);
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
                        if (unref(form).errors["billingInfo.country"]) {
                          _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["billingInfo.country"])}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div${_scopeId3}><label for="billingStreetAddress" class="block font-medium mb-1"${_scopeId3}>Street Address</label>`);
                        _push4(ssrRenderComponent(unref(InputText), {
                          id: "billingStreetAddress",
                          modelValue: unref(form).billingInfo.streetAddress,
                          "onUpdate:modelValue": ($event) => unref(form).billingInfo.streetAddress = $event,
                          class: [{ "p-invalid": unref(form).errors["billingInfo.streetAddress"] }, "w-full"]
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors["billingInfo.streetAddress"]) {
                          _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["billingInfo.streetAddress"])}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div class="grid grid-cols-1 md:grid-cols-3 gap-4"${_scopeId3}><div${_scopeId3}><label for="billingCity" class="block font-medium mb-1"${_scopeId3}>City/Town</label>`);
                        _push4(ssrRenderComponent(unref(InputText), {
                          id: "billingCity",
                          modelValue: unref(form).billingInfo.city,
                          "onUpdate:modelValue": ($event) => unref(form).billingInfo.city = $event,
                          class: [{ "p-invalid": unref(form).errors["billingInfo.city"] }, "w-full"]
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors["billingInfo.city"]) {
                          _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["billingInfo.city"])}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div${_scopeId3}><label for="billingStateOrCounty" class="block font-medium mb-1"${_scopeId3}>State/County</label>`);
                        _push4(ssrRenderComponent(unref(InputText), {
                          id: "billingStateOrCounty",
                          modelValue: unref(form).billingInfo.stateOrCounty,
                          "onUpdate:modelValue": ($event) => unref(form).billingInfo.stateOrCounty = $event,
                          class: [{ "p-invalid": unref(form).errors["billingInfo.stateOrCounty"] }, "w-full"]
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors["billingInfo.stateOrCounty"]) {
                          _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["billingInfo.stateOrCounty"])}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div${_scopeId3}><label for="billingPostalCode" class="block font-medium mb-1"${_scopeId3}>Postcode/ZIP</label>`);
                        _push4(ssrRenderComponent(unref(InputText), {
                          id: "billingPostalCode",
                          modelValue: unref(form).billingInfo.postalCode,
                          "onUpdate:modelValue": ($event) => unref(form).billingInfo.postalCode = $event,
                          class: [{ "p-invalid": unref(form).errors["billingInfo.postalCode"] }, "w-full"]
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors["billingInfo.postalCode"]) {
                          _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["billingInfo.postalCode"])}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div></div><div${_scopeId3}><label for="billingPhone" class="block font-medium mb-1"${_scopeId3}>Phone</label>`);
                        _push4(ssrRenderComponent(unref(InputText), {
                          id: "billingPhone",
                          modelValue: unref(form).billingInfo.phone,
                          "onUpdate:modelValue": ($event) => unref(form).billingInfo.phone = $event,
                          class: [{ "p-invalid": unref(form).errors["billingInfo.phone"] }, "w-full"]
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors["billingInfo.phone"]) {
                          _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["billingInfo.phone"])}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div>`);
                        _push4(ssrRenderComponent(unref(Divider), null, null, _parent4, _scopeId3));
                        _push4(`<div class="flex items-center py-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(Checkbox), {
                          inputId: "wantsInvoice",
                          modelValue: unref(form).wantsInvoice,
                          "onUpdate:modelValue": ($event) => unref(form).wantsInvoice = $event,
                          binary: true
                        }, null, _parent4, _scopeId3));
                        _push4(`<label for="wantsInvoice" class="ml-2 font-medium"${_scopeId3}>I require an invoice (for company/professional)</label></div>`);
                        if (unref(form).wantsInvoice) {
                          _push4(ssrRenderComponent(unref(Fieldset), {
                            legend: "Invoice Details",
                            toggleable: false,
                            class: "mt-4"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<div class="space-y-4 p-fluid"${_scopeId4}><div${_scopeId4}><label for="invoiceCompanyName" class="block font-medium mb-1"${_scopeId4}>Company Name</label>`);
                                _push5(ssrRenderComponent(unref(InputText), {
                                  id: "invoiceCompanyName",
                                  modelValue: unref(form).invoiceDetails.companyName,
                                  "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.companyName = $event,
                                  class: [{ "p-invalid": unref(form).errors["invoiceDetails.companyName"] }, "w-full"]
                                }, null, _parent5, _scopeId4));
                                if (unref(form).errors["invoiceDetails.companyName"]) {
                                  _push5(`<small class="p-error"${_scopeId4}>${ssrInterpolate(unref(form).errors["invoiceDetails.companyName"])}</small>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`</div><div${_scopeId4}><label for="invoiceVatNumber" class="block font-medium mb-1"${_scopeId4}>VAT Number</label>`);
                                _push5(ssrRenderComponent(unref(InputText), {
                                  id: "invoiceVatNumber",
                                  modelValue: unref(form).invoiceDetails.vatNumber,
                                  "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.vatNumber = $event,
                                  class: [{ "p-invalid": unref(form).errors["invoiceDetails.vatNumber"] }, "w-full"]
                                }, null, _parent5, _scopeId4));
                                if (unref(form).errors["invoiceDetails.vatNumber"]) {
                                  _push5(`<small class="p-error"${_scopeId4}>${ssrInterpolate(unref(form).errors["invoiceDetails.vatNumber"])}</small>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`</div><div${_scopeId4}><label for="invoiceProfession" class="block font-medium mb-1"${_scopeId4}>Profession / Business Activity</label>`);
                                _push5(ssrRenderComponent(unref(InputText), {
                                  id: "invoiceProfession",
                                  modelValue: unref(form).invoiceDetails.profession,
                                  "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.profession = $event,
                                  class: [{ "p-invalid": unref(form).errors["invoiceDetails.profession"] }, "w-full"]
                                }, null, _parent5, _scopeId4));
                                if (unref(form).errors["invoiceDetails.profession"]) {
                                  _push5(`<small class="p-error"${_scopeId4}>${ssrInterpolate(unref(form).errors["invoiceDetails.profession"])}</small>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`</div><div${_scopeId4}><label for="invoiceTaxOffice" class="block font-medium mb-1"${_scopeId4}>Tax Office (ΔΟΥ - Optional)</label>`);
                                _push5(ssrRenderComponent(unref(InputText), {
                                  id: "invoiceTaxOffice",
                                  modelValue: unref(form).invoiceDetails.taxOffice,
                                  "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.taxOffice = $event,
                                  class: [{ "p-invalid": unref(form).errors["invoiceDetails.taxOffice"] }, "w-full"]
                                }, null, _parent5, _scopeId4));
                                if (unref(form).errors["invoiceDetails.taxOffice"]) {
                                  _push5(`<small class="p-error"${_scopeId4}>${ssrInterpolate(unref(form).errors["invoiceDetails.taxOffice"])}</small>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`</div></div>`);
                              } else {
                                return [
                                  createVNode("div", { class: "space-y-4 p-fluid" }, [
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "invoiceCompanyName",
                                        class: "block font-medium mb-1"
                                      }, "Company Name"),
                                      createVNode(unref(InputText), {
                                        id: "invoiceCompanyName",
                                        modelValue: unref(form).invoiceDetails.companyName,
                                        "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.companyName = $event,
                                        class: [{ "p-invalid": unref(form).errors["invoiceDetails.companyName"] }, "w-full"]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(form).errors["invoiceDetails.companyName"] ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(form).errors["invoiceDetails.companyName"]), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "invoiceVatNumber",
                                        class: "block font-medium mb-1"
                                      }, "VAT Number"),
                                      createVNode(unref(InputText), {
                                        id: "invoiceVatNumber",
                                        modelValue: unref(form).invoiceDetails.vatNumber,
                                        "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.vatNumber = $event,
                                        class: [{ "p-invalid": unref(form).errors["invoiceDetails.vatNumber"] }, "w-full"]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(form).errors["invoiceDetails.vatNumber"] ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(form).errors["invoiceDetails.vatNumber"]), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "invoiceProfession",
                                        class: "block font-medium mb-1"
                                      }, "Profession / Business Activity"),
                                      createVNode(unref(InputText), {
                                        id: "invoiceProfession",
                                        modelValue: unref(form).invoiceDetails.profession,
                                        "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.profession = $event,
                                        class: [{ "p-invalid": unref(form).errors["invoiceDetails.profession"] }, "w-full"]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(form).errors["invoiceDetails.profession"] ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(form).errors["invoiceDetails.profession"]), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "invoiceTaxOffice",
                                        class: "block font-medium mb-1"
                                      }, "Tax Office (ΔΟΥ - Optional)"),
                                      createVNode(unref(InputText), {
                                        id: "invoiceTaxOffice",
                                        modelValue: unref(form).invoiceDetails.taxOffice,
                                        "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.taxOffice = $event,
                                        class: [{ "p-invalid": unref(form).errors["invoiceDetails.taxOffice"] }, "w-full"]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(form).errors["invoiceDetails.taxOffice"] ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(form).errors["invoiceDetails.taxOffice"]), 1)) : createCommentVNode("", true)
                                    ])
                                  ])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "space-y-6" }, [
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "billingEmail",
                                class: "block font-medium mb-1"
                              }, "Email"),
                              createVNode(unref(InputText), {
                                id: "billingEmail",
                                type: "email",
                                modelValue: unref(form).billingInfo.email,
                                "onUpdate:modelValue": ($event) => unref(form).billingInfo.email = $event,
                                class: [{ "p-invalid": unref(form).errors["billingInfo.email"] }, "w-full"]
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                              unref(form).errors["billingInfo.email"] ? (openBlock(), createBlock("small", {
                                key: 0,
                                class: "p-error"
                              }, toDisplayString(unref(form).errors["billingInfo.email"]), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "billingFirstName",
                                  class: "block font-medium mb-1"
                                }, "First Name"),
                                createVNode(unref(InputText), {
                                  id: "billingFirstName",
                                  modelValue: unref(form).billingInfo.firstName,
                                  "onUpdate:modelValue": ($event) => unref(form).billingInfo.firstName = $event,
                                  class: [{ "p-invalid": unref(form).errors["billingInfo.firstName"] }, "w-full"]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(form).errors["billingInfo.firstName"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["billingInfo.firstName"]), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "billingLastName",
                                  class: "block font-medium mb-1"
                                }, "Last Name"),
                                createVNode(unref(InputText), {
                                  id: "billingLastName",
                                  modelValue: unref(form).billingInfo.lastName,
                                  "onUpdate:modelValue": ($event) => unref(form).billingInfo.lastName = $event,
                                  class: [{ "p-invalid": unref(form).errors["billingInfo.lastName"] }, "w-full"]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(form).errors["billingInfo.lastName"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["billingInfo.lastName"]), 1)) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "billingCountry",
                                class: "block font-medium mb-1"
                              }, "Country"),
                              createVNode(unref(Select), {
                                inputId: "billingCountry",
                                modelValue: unref(form).billingInfo.country_object,
                                "onUpdate:modelValue": ($event) => unref(form).billingInfo.country_object = $event,
                                options: unref(countries),
                                filter: "",
                                optionLabel: "name",
                                placeholder: "Select a country",
                                class: [{ "p-invalid": unref(form).errors["billingInfo.country"] }, "w-full"],
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
                              unref(form).errors["billingInfo.country"] ? (openBlock(), createBlock("small", {
                                key: 0,
                                class: "p-error"
                              }, toDisplayString(unref(form).errors["billingInfo.country"]), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "billingStreetAddress",
                                class: "block font-medium mb-1"
                              }, "Street Address"),
                              createVNode(unref(InputText), {
                                id: "billingStreetAddress",
                                modelValue: unref(form).billingInfo.streetAddress,
                                "onUpdate:modelValue": ($event) => unref(form).billingInfo.streetAddress = $event,
                                class: [{ "p-invalid": unref(form).errors["billingInfo.streetAddress"] }, "w-full"]
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                              unref(form).errors["billingInfo.streetAddress"] ? (openBlock(), createBlock("small", {
                                key: 0,
                                class: "p-error"
                              }, toDisplayString(unref(form).errors["billingInfo.streetAddress"]), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "billingCity",
                                  class: "block font-medium mb-1"
                                }, "City/Town"),
                                createVNode(unref(InputText), {
                                  id: "billingCity",
                                  modelValue: unref(form).billingInfo.city,
                                  "onUpdate:modelValue": ($event) => unref(form).billingInfo.city = $event,
                                  class: [{ "p-invalid": unref(form).errors["billingInfo.city"] }, "w-full"]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(form).errors["billingInfo.city"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["billingInfo.city"]), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "billingStateOrCounty",
                                  class: "block font-medium mb-1"
                                }, "State/County"),
                                createVNode(unref(InputText), {
                                  id: "billingStateOrCounty",
                                  modelValue: unref(form).billingInfo.stateOrCounty,
                                  "onUpdate:modelValue": ($event) => unref(form).billingInfo.stateOrCounty = $event,
                                  class: [{ "p-invalid": unref(form).errors["billingInfo.stateOrCounty"] }, "w-full"]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(form).errors["billingInfo.stateOrCounty"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["billingInfo.stateOrCounty"]), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "billingPostalCode",
                                  class: "block font-medium mb-1"
                                }, "Postcode/ZIP"),
                                createVNode(unref(InputText), {
                                  id: "billingPostalCode",
                                  modelValue: unref(form).billingInfo.postalCode,
                                  "onUpdate:modelValue": ($event) => unref(form).billingInfo.postalCode = $event,
                                  class: [{ "p-invalid": unref(form).errors["billingInfo.postalCode"] }, "w-full"]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(form).errors["billingInfo.postalCode"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["billingInfo.postalCode"]), 1)) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "billingPhone",
                                class: "block font-medium mb-1"
                              }, "Phone"),
                              createVNode(unref(InputText), {
                                id: "billingPhone",
                                modelValue: unref(form).billingInfo.phone,
                                "onUpdate:modelValue": ($event) => unref(form).billingInfo.phone = $event,
                                class: [{ "p-invalid": unref(form).errors["billingInfo.phone"] }, "w-full"]
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                              unref(form).errors["billingInfo.phone"] ? (openBlock(), createBlock("small", {
                                key: 0,
                                class: "p-error"
                              }, toDisplayString(unref(form).errors["billingInfo.phone"]), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode(unref(Divider)),
                            createVNode("div", { class: "flex items-center py-2" }, [
                              createVNode(unref(Checkbox), {
                                inputId: "wantsInvoice",
                                modelValue: unref(form).wantsInvoice,
                                "onUpdate:modelValue": ($event) => unref(form).wantsInvoice = $event,
                                binary: true
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode("label", {
                                for: "wantsInvoice",
                                class: "ml-2 font-medium"
                              }, "I require an invoice (for company/professional)")
                            ]),
                            unref(form).wantsInvoice ? (openBlock(), createBlock(unref(Fieldset), {
                              key: 0,
                              legend: "Invoice Details",
                              toggleable: false,
                              class: "mt-4"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "space-y-4 p-fluid" }, [
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "invoiceCompanyName",
                                      class: "block font-medium mb-1"
                                    }, "Company Name"),
                                    createVNode(unref(InputText), {
                                      id: "invoiceCompanyName",
                                      modelValue: unref(form).invoiceDetails.companyName,
                                      "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.companyName = $event,
                                      class: [{ "p-invalid": unref(form).errors["invoiceDetails.companyName"] }, "w-full"]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(form).errors["invoiceDetails.companyName"] ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(form).errors["invoiceDetails.companyName"]), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "invoiceVatNumber",
                                      class: "block font-medium mb-1"
                                    }, "VAT Number"),
                                    createVNode(unref(InputText), {
                                      id: "invoiceVatNumber",
                                      modelValue: unref(form).invoiceDetails.vatNumber,
                                      "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.vatNumber = $event,
                                      class: [{ "p-invalid": unref(form).errors["invoiceDetails.vatNumber"] }, "w-full"]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(form).errors["invoiceDetails.vatNumber"] ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(form).errors["invoiceDetails.vatNumber"]), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "invoiceProfession",
                                      class: "block font-medium mb-1"
                                    }, "Profession / Business Activity"),
                                    createVNode(unref(InputText), {
                                      id: "invoiceProfession",
                                      modelValue: unref(form).invoiceDetails.profession,
                                      "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.profession = $event,
                                      class: [{ "p-invalid": unref(form).errors["invoiceDetails.profession"] }, "w-full"]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(form).errors["invoiceDetails.profession"] ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(form).errors["invoiceDetails.profession"]), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "invoiceTaxOffice",
                                      class: "block font-medium mb-1"
                                    }, "Tax Office (ΔΟΥ - Optional)"),
                                    createVNode(unref(InputText), {
                                      id: "invoiceTaxOffice",
                                      modelValue: unref(form).invoiceDetails.taxOffice,
                                      "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.taxOffice = $event,
                                      class: [{ "p-invalid": unref(form).errors["invoiceDetails.taxOffice"] }, "w-full"]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(form).errors["invoiceDetails.taxOffice"] ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(form).errors["invoiceDetails.taxOffice"]), 1)) : createCommentVNode("", true)
                                  ])
                                ])
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Card), null, {
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex items-center"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(Checkbox), {
                          inputId: "shippingIsDifferent",
                          modelValue: unref(form).shippingIsDifferent,
                          "onUpdate:modelValue": ($event) => unref(form).shippingIsDifferent = $event,
                          binary: true
                        }, null, _parent4, _scopeId3));
                        _push4(`<label for="shippingIsDifferent" class="ml-2 font-medium"${_scopeId3}>Ship to a different address?</label></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex items-center" }, [
                            createVNode(unref(Checkbox), {
                              inputId: "shippingIsDifferent",
                              modelValue: unref(form).shippingIsDifferent,
                              "onUpdate:modelValue": ($event) => unref(form).shippingIsDifferent = $event,
                              binary: true
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode("label", {
                              for: "shippingIsDifferent",
                              class: "ml-2 font-medium"
                            }, "Ship to a different address?")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (unref(form).shippingIsDifferent) {
                    _push3(ssrRenderComponent(unref(Card), null, {
                      title: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<h2 class="text-lg font-semibold"${_scopeId3}>Shipping Information</h2>`);
                        } else {
                          return [
                            createVNode("h2", { class: "text-lg font-semibold" }, "Shipping Information")
                          ];
                        }
                      }),
                      content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="space-y-6"${_scopeId3}><div${_scopeId3}><label for="shippingEmail" class="block font-medium mb-1"${_scopeId3}>Shipping Contact Email (Optional)</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "shippingEmail",
                            type: "email",
                            modelValue: unref(form).shippingInfo.email,
                            "onUpdate:modelValue": ($event) => unref(form).shippingInfo.email = $event,
                            class: [{ "p-invalid": unref(form).errors["shippingInfo.email"] }, "w-full"]
                          }, null, _parent4, _scopeId3));
                          if (unref(form).errors["shippingInfo.email"]) {
                            _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["shippingInfo.email"])}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId3}><div${_scopeId3}><label for="shippingFirstName" class="block font-medium mb-1"${_scopeId3}>First Name</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "shippingFirstName",
                            modelValue: unref(form).shippingInfo.firstName,
                            "onUpdate:modelValue": ($event) => unref(form).shippingInfo.firstName = $event,
                            class: [{ "p-invalid": unref(form).errors["shippingInfo.firstName"] }, "w-full"]
                          }, null, _parent4, _scopeId3));
                          if (unref(form).errors["shippingInfo.firstName"]) {
                            _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["shippingInfo.firstName"])}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div><div${_scopeId3}><label for="shippingLastName" class="block font-medium mb-1"${_scopeId3}>Last Name</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "shippingLastName",
                            modelValue: unref(form).shippingInfo.lastName,
                            "onUpdate:modelValue": ($event) => unref(form).shippingInfo.lastName = $event,
                            class: [{ "p-invalid": unref(form).errors["shippingInfo.lastName"] }, "w-full"]
                          }, null, _parent4, _scopeId3));
                          if (unref(form).errors["shippingInfo.lastName"]) {
                            _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["shippingInfo.lastName"])}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div></div><div${_scopeId3}><label for="shippingCountry" class="block font-medium mb-1"${_scopeId3}>Country</label>`);
                          _push4(ssrRenderComponent(unref(Select), {
                            inputId: "shippingCountry",
                            modelValue: unref(form).shippingInfo.country_object,
                            "onUpdate:modelValue": ($event) => unref(form).shippingInfo.country_object = $event,
                            options: unref(countries),
                            filter: "",
                            optionLabel: "name",
                            placeholder: "Select a country",
                            class: [{ "p-invalid": unref(form).errors["shippingInfo.country"] }, "w-full"],
                            onChange: onShippingCountryChange,
                            dataKey: "code"
                          }, {
                            value: withCtx((slotProps, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (slotProps.value) {
                                  _push5(`<div class="flex items-center"${_scopeId4}>`);
                                  if (slotProps.value.code) {
                                    _push5(`<span class="${ssrRenderClass(`fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`)}" style="${ssrRenderStyle({ "font-size": "1.2rem" })}"${_scopeId4}></span>`);
                                  } else {
                                    _push5(`<div class="mr-2 inline-block rounded-sm" style="${ssrRenderStyle({ "width": "20px", "height": "15px", "background-color": "#f0f0f0" })}"${_scopeId4}></div>`);
                                  }
                                  _push5(`<div${_scopeId4}>${ssrInterpolate(slotProps.value.name)}</div></div>`);
                                } else {
                                  _push5(`<span${_scopeId4}>${ssrInterpolate(slotProps.placeholder)}</span>`);
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
                                _push5(`<div class="flex items-center"${_scopeId4}>`);
                                if (slotProps.option.code) {
                                  _push5(`<span class="${ssrRenderClass(`fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`)}" style="${ssrRenderStyle({ "font-size": "1.2rem" })}"${_scopeId4}></span>`);
                                } else {
                                  _push5(`<div class="mr-2 inline-block rounded-sm" style="${ssrRenderStyle({ "width": "20px", "height": "15px", "background-color": "#f0f0f0" })}"${_scopeId4}></div>`);
                                }
                                _push5(`<div${_scopeId4}>${ssrInterpolate(slotProps.option.name)}</div></div>`);
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
                          if (unref(form).errors["shippingInfo.country"]) {
                            _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["shippingInfo.country"])}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div><div${_scopeId3}><label for="shippingStreetAddress" class="block font-medium mb-1"${_scopeId3}>Street Address</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "shippingStreetAddress",
                            modelValue: unref(form).shippingInfo.streetAddress,
                            "onUpdate:modelValue": ($event) => unref(form).shippingInfo.streetAddress = $event,
                            class: [{ "p-invalid": unref(form).errors["shippingInfo.streetAddress"] }, "w-full"]
                          }, null, _parent4, _scopeId3));
                          if (unref(form).errors["shippingInfo.streetAddress"]) {
                            _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["shippingInfo.streetAddress"])}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div><div class="grid grid-cols-1 md:grid-cols-3 gap-4"${_scopeId3}><div${_scopeId3}><label for="shippingCity" class="block font-medium mb-1"${_scopeId3}>City/Town</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "shippingCity",
                            modelValue: unref(form).shippingInfo.city,
                            "onUpdate:modelValue": ($event) => unref(form).shippingInfo.city = $event,
                            class: [{ "p-invalid": unref(form).errors["shippingInfo.city"] }, "w-full"]
                          }, null, _parent4, _scopeId3));
                          if (unref(form).errors["shippingInfo.city"]) {
                            _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["shippingInfo.city"])}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div><div${_scopeId3}><label for="shippingStateOrCounty" class="block font-medium mb-1"${_scopeId3}>State/County</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "shippingStateOrCounty",
                            modelValue: unref(form).shippingInfo.stateOrCounty,
                            "onUpdate:modelValue": ($event) => unref(form).shippingInfo.stateOrCounty = $event,
                            class: [{ "p-invalid": unref(form).errors["shippingInfo.stateOrCounty"] }, "w-full"]
                          }, null, _parent4, _scopeId3));
                          if (unref(form).errors["shippingInfo.stateOrCounty"]) {
                            _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["shippingInfo.stateOrCounty"])}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div><div${_scopeId3}><label for="shippingPostalCode" class="block font-medium mb-1"${_scopeId3}>Postcode/ZIP</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "shippingPostalCode",
                            modelValue: unref(form).shippingInfo.postalCode,
                            "onUpdate:modelValue": ($event) => unref(form).shippingInfo.postalCode = $event,
                            class: [{ "p-invalid": unref(form).errors["shippingInfo.postalCode"] }, "w-full"]
                          }, null, _parent4, _scopeId3));
                          if (unref(form).errors["shippingInfo.postalCode"]) {
                            _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["shippingInfo.postalCode"])}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div></div><div${_scopeId3}><label for="shippingPhone" class="block font-medium mb-1"${_scopeId3}>Phone (Optional)</label>`);
                          _push4(ssrRenderComponent(unref(InputText), {
                            id: "shippingPhone",
                            modelValue: unref(form).shippingInfo.phone,
                            "onUpdate:modelValue": ($event) => unref(form).shippingInfo.phone = $event,
                            class: [{ "p-invalid": unref(form).errors["shippingInfo.phone"] }, "w-full"]
                          }, null, _parent4, _scopeId3));
                          if (unref(form).errors["shippingInfo.phone"]) {
                            _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors["shippingInfo.phone"])}</small>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div></div>`);
                        } else {
                          return [
                            createVNode("div", { class: "space-y-6" }, [
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "shippingEmail",
                                  class: "block font-medium mb-1"
                                }, "Shipping Contact Email (Optional)"),
                                createVNode(unref(InputText), {
                                  id: "shippingEmail",
                                  type: "email",
                                  modelValue: unref(form).shippingInfo.email,
                                  "onUpdate:modelValue": ($event) => unref(form).shippingInfo.email = $event,
                                  class: [{ "p-invalid": unref(form).errors["shippingInfo.email"] }, "w-full"]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(form).errors["shippingInfo.email"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["shippingInfo.email"]), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "shippingFirstName",
                                    class: "block font-medium mb-1"
                                  }, "First Name"),
                                  createVNode(unref(InputText), {
                                    id: "shippingFirstName",
                                    modelValue: unref(form).shippingInfo.firstName,
                                    "onUpdate:modelValue": ($event) => unref(form).shippingInfo.firstName = $event,
                                    class: [{ "p-invalid": unref(form).errors["shippingInfo.firstName"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["shippingInfo.firstName"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["shippingInfo.firstName"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "shippingLastName",
                                    class: "block font-medium mb-1"
                                  }, "Last Name"),
                                  createVNode(unref(InputText), {
                                    id: "shippingLastName",
                                    modelValue: unref(form).shippingInfo.lastName,
                                    "onUpdate:modelValue": ($event) => unref(form).shippingInfo.lastName = $event,
                                    class: [{ "p-invalid": unref(form).errors["shippingInfo.lastName"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["shippingInfo.lastName"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["shippingInfo.lastName"]), 1)) : createCommentVNode("", true)
                                ])
                              ]),
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "shippingCountry",
                                  class: "block font-medium mb-1"
                                }, "Country"),
                                createVNode(unref(Select), {
                                  inputId: "shippingCountry",
                                  modelValue: unref(form).shippingInfo.country_object,
                                  "onUpdate:modelValue": ($event) => unref(form).shippingInfo.country_object = $event,
                                  options: unref(countries),
                                  filter: "",
                                  optionLabel: "name",
                                  placeholder: "Select a country",
                                  class: [{ "p-invalid": unref(form).errors["shippingInfo.country"] }, "w-full"],
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
                                unref(form).errors["shippingInfo.country"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["shippingInfo.country"]), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "shippingStreetAddress",
                                  class: "block font-medium mb-1"
                                }, "Street Address"),
                                createVNode(unref(InputText), {
                                  id: "shippingStreetAddress",
                                  modelValue: unref(form).shippingInfo.streetAddress,
                                  "onUpdate:modelValue": ($event) => unref(form).shippingInfo.streetAddress = $event,
                                  class: [{ "p-invalid": unref(form).errors["shippingInfo.streetAddress"] }, "w-full"]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(form).errors["shippingInfo.streetAddress"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["shippingInfo.streetAddress"]), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "shippingCity",
                                    class: "block font-medium mb-1"
                                  }, "City/Town"),
                                  createVNode(unref(InputText), {
                                    id: "shippingCity",
                                    modelValue: unref(form).shippingInfo.city,
                                    "onUpdate:modelValue": ($event) => unref(form).shippingInfo.city = $event,
                                    class: [{ "p-invalid": unref(form).errors["shippingInfo.city"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["shippingInfo.city"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["shippingInfo.city"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "shippingStateOrCounty",
                                    class: "block font-medium mb-1"
                                  }, "State/County"),
                                  createVNode(unref(InputText), {
                                    id: "shippingStateOrCounty",
                                    modelValue: unref(form).shippingInfo.stateOrCounty,
                                    "onUpdate:modelValue": ($event) => unref(form).shippingInfo.stateOrCounty = $event,
                                    class: [{ "p-invalid": unref(form).errors["shippingInfo.stateOrCounty"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["shippingInfo.stateOrCounty"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["shippingInfo.stateOrCounty"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "shippingPostalCode",
                                    class: "block font-medium mb-1"
                                  }, "Postcode/ZIP"),
                                  createVNode(unref(InputText), {
                                    id: "shippingPostalCode",
                                    modelValue: unref(form).shippingInfo.postalCode,
                                    "onUpdate:modelValue": ($event) => unref(form).shippingInfo.postalCode = $event,
                                    class: [{ "p-invalid": unref(form).errors["shippingInfo.postalCode"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["shippingInfo.postalCode"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["shippingInfo.postalCode"]), 1)) : createCommentVNode("", true)
                                ])
                              ]),
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "shippingPhone",
                                  class: "block font-medium mb-1"
                                }, "Phone (Optional)"),
                                createVNode(unref(InputText), {
                                  id: "shippingPhone",
                                  modelValue: unref(form).shippingInfo.phone,
                                  "onUpdate:modelValue": ($event) => unref(form).shippingInfo.phone = $event,
                                  class: [{ "p-invalid": unref(form).errors["shippingInfo.phone"] }, "w-full"]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(form).errors["shippingInfo.phone"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["shippingInfo.phone"]), 1)) : createCommentVNode("", true)
                              ])
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(Card), null, {
                    title: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<h2 class="text-lg font-semibold"${_scopeId3}>Order Notes</h2>`);
                      } else {
                        return [
                          createVNode("h2", { class: "text-lg font-semibold" }, "Order Notes")
                        ];
                      }
                    }),
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Textarea), {
                          id: "notes",
                          modelValue: unref(form).notes,
                          "onUpdate:modelValue": ($event) => unref(form).notes = $event,
                          rows: "3",
                          placeholder: "Notes about your order, e.g. special notes for delivery.",
                          class: [{ "p-invalid": unref(form).errors.notes }, "w-full"]
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors.notes) {
                          _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors.notes)}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          createVNode(unref(Textarea), {
                            id: "notes",
                            modelValue: unref(form).notes,
                            "onUpdate:modelValue": ($event) => unref(form).notes = $event,
                            rows: "3",
                            placeholder: "Notes about your order, e.g. special notes for delivery.",
                            class: [{ "p-invalid": unref(form).errors.notes }, "w-full"]
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                          unref(form).errors.notes ? (openBlock(), createBlock("small", {
                            key: 0,
                            class: "p-error"
                          }, toDisplayString(unref(form).errors.notes), 1)) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</form></div><div class="lg:col-span-1"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Card), null, {
                    title: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<h2 class="text-lg font-semibold"${_scopeId3}>Your Order</h2>`);
                      } else {
                        return [
                          createVNode("h2", { class: "text-lg font-semibold" }, "Your Order")
                        ];
                      }
                    }),
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="space-y-4"${_scopeId3}><!--[-->`);
                        ssrRenderList(__props.cartItems, (item) => {
                          var _a2, _b2, _c, _d;
                          _push4(`<div class="flex justify-between items-center"${_scopeId3}><div class="flex-shrink-0 w-16 sm:w-20"${_scopeId3}>`);
                          _push4(ssrRenderComponent(_sfc_main$2, {
                            "artwork-image": ((_a2 = item.artwork_data) == null ? void 0 : _a2.img_thumb) || ((_b2 = item.artwork_data) == null ? void 0 : _b2.img_medium) || "/images/placeholder.png",
                            frame: item.frame,
                            size: item.size,
                            type: item.type
                          }, null, _parent4, _scopeId3));
                          _push4(`</div><div class="flex-1 min-w-0"${_scopeId3}><p class="font-medium text-sm text-surface-900 truncate"${_scopeId3}>${ssrInterpolate(((_c = item.artwork_data) == null ? void 0 : _c.title) || "Untitled")}</p><p class="text-xs text-surface-500"${_scopeId3}> ID: ${ssrInterpolate(item.artwork_id || item.pictufy_id || item.id)}</p><p class="text-xs text-surface-500"${_scopeId3}>${ssrInterpolate(item.type)} | ${ssrInterpolate(item.print_type === "oil" ? "Oil Print" : "Mono Print")} | ${ssrInterpolate(item.frame)} | ${ssrInterpolate(item.size)}</p></div><p class="text-sm font-semibold text-surface-700 mt-1"${_scopeId3}>${ssrInterpolate(item.quantity)} x ${ssrInterpolate(formatCurrency(((_d = item.artwork_data) == null ? void 0 : _d.price) || 0))}</p></div>`);
                        });
                        _push4(`<!--]--></div>`);
                        _push4(ssrRenderComponent(unref(Divider), null, null, _parent4, _scopeId3));
                        _push4(`<div class="mt-4 pt-4"${_scopeId3}><div class="flex gap-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(InputText), {
                          modelValue: couponCode.value,
                          "onUpdate:modelValue": ($event) => couponCode.value = $event,
                          placeholder: "Coupon",
                          class: "w-full p-inputtext-sm",
                          disabled: !!appliedCoupon.value
                        }, null, _parent4, _scopeId3));
                        if (!appliedCoupon.value) {
                          _push4(ssrRenderComponent(unref(Button), {
                            label: "Apply",
                            size: "small",
                            loading: isCheckingCoupon.value,
                            onClick: applyCoupon,
                            disabled: !couponCode.value
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(ssrRenderComponent(unref(Button), {
                            icon: "pi pi-times",
                            severity: "danger",
                            outlined: "",
                            size: "small",
                            onClick: removeCoupon
                          }, null, _parent4, _scopeId3));
                        }
                        _push4(`</div>`);
                        if (couponError.value) {
                          _push4(`<small class="text-red-500 block mt-1"${_scopeId3}>${ssrInterpolate(couponError.value)}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        if (appliedCoupon.value) {
                          _push4(`<small class="text-green-600 block mt-1"${_scopeId3}>Code ${ssrInterpolate(appliedCoupon.value.code)} applied!</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`<div class="space-y-2 mt-4 text-sm"${_scopeId3}><div class="flex justify-between"${_scopeId3}><span${_scopeId3}>Subtotal</span><span${_scopeId3}>${ssrInterpolate(formatCurrency(__props.cartTotal))}</span></div>`);
                        if (appliedCoupon.value) {
                          _push4(`<div class="flex justify-between text-green-600 font-medium"${_scopeId3}><span${_scopeId3}>Discount (${ssrInterpolate(appliedCoupon.value.code)})</span><span${_scopeId3}>-${ssrInterpolate(formatCurrency(discountAmount.value))}</span></div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`<div class="flex justify-between font-bold text-lg pt-2 border-t"${_scopeId3}><span${_scopeId3}>Total</span><span${_scopeId3}>${ssrInterpolate(formatCurrency(finalTotal.value))}</span></div></div></div><div class="space-y-3 mt-6"${_scopeId3}><label class="block font-medium"${_scopeId3}>Payment Method</label><div class="flex flex-col md:flex-row md:gap-6"${_scopeId3}><div class="flex items-center"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(RadioButton), {
                          inputId: "pmBank",
                          name: "paymentMethod",
                          value: "bank_transfer",
                          modelValue: unref(form).paymentMethod,
                          "onUpdate:modelValue": ($event) => unref(form).paymentMethod = $event
                        }, null, _parent4, _scopeId3));
                        _push4(`<label for="pmBank" class="ml-2"${_scopeId3}>Bank Transfer</label></div></div><p class="text-sm italic text-gray-600"${_scopeId3}>We&#39;ll contact you for further payment details. </p>`);
                        if (unref(form).errors.paymentMethod) {
                          _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(form).errors.paymentMethod)}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div>`);
                        _push4(ssrRenderComponent(unref(Button), {
                          label: "Place Order",
                          icon: "pi pi-check",
                          type: "submit",
                          onClick: submit,
                          class: "mt-4 w-full",
                          loading: unref(form).processing
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("div", { class: "space-y-4" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.cartItems, (item) => {
                              var _a2, _b2, _c, _d;
                              return openBlock(), createBlock("div", {
                                key: item.id,
                                class: "flex justify-between items-center"
                              }, [
                                createVNode("div", { class: "flex-shrink-0 w-16 sm:w-20" }, [
                                  createVNode(_sfc_main$2, {
                                    "artwork-image": ((_a2 = item.artwork_data) == null ? void 0 : _a2.img_thumb) || ((_b2 = item.artwork_data) == null ? void 0 : _b2.img_medium) || "/images/placeholder.png",
                                    frame: item.frame,
                                    size: item.size,
                                    type: item.type
                                  }, null, 8, ["artwork-image", "frame", "size", "type"])
                                ]),
                                createVNode("div", { class: "flex-1 min-w-0" }, [
                                  createVNode("p", { class: "font-medium text-sm text-surface-900 truncate" }, toDisplayString(((_c = item.artwork_data) == null ? void 0 : _c.title) || "Untitled"), 1),
                                  createVNode("p", { class: "text-xs text-surface-500" }, " ID: " + toDisplayString(item.artwork_id || item.pictufy_id || item.id), 1),
                                  createVNode("p", { class: "text-xs text-surface-500" }, toDisplayString(item.type) + " | " + toDisplayString(item.print_type === "oil" ? "Oil Print" : "Mono Print") + " | " + toDisplayString(item.frame) + " | " + toDisplayString(item.size), 1)
                                ]),
                                createVNode("p", { class: "text-sm font-semibold text-surface-700 mt-1" }, toDisplayString(item.quantity) + " x " + toDisplayString(formatCurrency(((_d = item.artwork_data) == null ? void 0 : _d.price) || 0)), 1)
                              ]);
                            }), 128))
                          ]),
                          createVNode(unref(Divider)),
                          createVNode("div", { class: "mt-4 pt-4" }, [
                            createVNode("div", { class: "flex gap-2" }, [
                              createVNode(unref(InputText), {
                                modelValue: couponCode.value,
                                "onUpdate:modelValue": ($event) => couponCode.value = $event,
                                placeholder: "Coupon",
                                class: "w-full p-inputtext-sm",
                                disabled: !!appliedCoupon.value
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                              !appliedCoupon.value ? (openBlock(), createBlock(unref(Button), {
                                key: 0,
                                label: "Apply",
                                size: "small",
                                loading: isCheckingCoupon.value,
                                onClick: applyCoupon,
                                disabled: !couponCode.value
                              }, null, 8, ["loading", "disabled"])) : (openBlock(), createBlock(unref(Button), {
                                key: 1,
                                icon: "pi pi-times",
                                severity: "danger",
                                outlined: "",
                                size: "small",
                                onClick: removeCoupon
                              }))
                            ]),
                            couponError.value ? (openBlock(), createBlock("small", {
                              key: 0,
                              class: "text-red-500 block mt-1"
                            }, toDisplayString(couponError.value), 1)) : createCommentVNode("", true),
                            appliedCoupon.value ? (openBlock(), createBlock("small", {
                              key: 1,
                              class: "text-green-600 block mt-1"
                            }, "Code " + toDisplayString(appliedCoupon.value.code) + " applied!", 1)) : createCommentVNode("", true),
                            createVNode("div", { class: "space-y-2 mt-4 text-sm" }, [
                              createVNode("div", { class: "flex justify-between" }, [
                                createVNode("span", null, "Subtotal"),
                                createVNode("span", null, toDisplayString(formatCurrency(__props.cartTotal)), 1)
                              ]),
                              appliedCoupon.value ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "flex justify-between text-green-600 font-medium"
                              }, [
                                createVNode("span", null, "Discount (" + toDisplayString(appliedCoupon.value.code) + ")", 1),
                                createVNode("span", null, "-" + toDisplayString(formatCurrency(discountAmount.value)), 1)
                              ])) : createCommentVNode("", true),
                              createVNode("div", { class: "flex justify-between font-bold text-lg pt-2 border-t" }, [
                                createVNode("span", null, "Total"),
                                createVNode("span", null, toDisplayString(formatCurrency(finalTotal.value)), 1)
                              ])
                            ])
                          ]),
                          createVNode("div", { class: "space-y-3 mt-6" }, [
                            createVNode("label", { class: "block font-medium" }, "Payment Method"),
                            createVNode("div", { class: "flex flex-col md:flex-row md:gap-6" }, [
                              createVNode("div", { class: "flex items-center" }, [
                                createVNode(unref(RadioButton), {
                                  inputId: "pmBank",
                                  name: "paymentMethod",
                                  value: "bank_transfer",
                                  modelValue: unref(form).paymentMethod,
                                  "onUpdate:modelValue": ($event) => unref(form).paymentMethod = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode("label", {
                                  for: "pmBank",
                                  class: "ml-2"
                                }, "Bank Transfer")
                              ])
                            ]),
                            createVNode("p", { class: "text-sm italic text-gray-600" }, "We'll contact you for further payment details. "),
                            unref(form).errors.paymentMethod ? (openBlock(), createBlock("small", {
                              key: 0,
                              class: "p-error"
                            }, toDisplayString(unref(form).errors.paymentMethod), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode(unref(Button), {
                            label: "Place Order",
                            icon: "pi pi-check",
                            type: "submit",
                            onClick: submit,
                            class: "mt-4 w-full",
                            loading: unref(form).processing
                          }, null, 8, ["loading"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode(PageTitleSection, { title: "Checkout" }),
                    createVNode("div", { class: "grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6" }, [
                      createVNode("div", { class: "lg:col-span-2" }, [
                        createVNode("form", {
                          onSubmit: withModifiers(submit, ["prevent"]),
                          class: "space-y-6"
                        }, [
                          createVNode(unref(Card), null, {
                            title: withCtx(() => [
                              createVNode("h2", { class: "text-lg font-semibold" }, "Billing Information")
                            ]),
                            content: withCtx(() => [
                              createVNode("div", { class: "space-y-6" }, [
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "billingEmail",
                                    class: "block font-medium mb-1"
                                  }, "Email"),
                                  createVNode(unref(InputText), {
                                    id: "billingEmail",
                                    type: "email",
                                    modelValue: unref(form).billingInfo.email,
                                    "onUpdate:modelValue": ($event) => unref(form).billingInfo.email = $event,
                                    class: [{ "p-invalid": unref(form).errors["billingInfo.email"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["billingInfo.email"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["billingInfo.email"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "billingFirstName",
                                      class: "block font-medium mb-1"
                                    }, "First Name"),
                                    createVNode(unref(InputText), {
                                      id: "billingFirstName",
                                      modelValue: unref(form).billingInfo.firstName,
                                      "onUpdate:modelValue": ($event) => unref(form).billingInfo.firstName = $event,
                                      class: [{ "p-invalid": unref(form).errors["billingInfo.firstName"] }, "w-full"]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(form).errors["billingInfo.firstName"] ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(form).errors["billingInfo.firstName"]), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "billingLastName",
                                      class: "block font-medium mb-1"
                                    }, "Last Name"),
                                    createVNode(unref(InputText), {
                                      id: "billingLastName",
                                      modelValue: unref(form).billingInfo.lastName,
                                      "onUpdate:modelValue": ($event) => unref(form).billingInfo.lastName = $event,
                                      class: [{ "p-invalid": unref(form).errors["billingInfo.lastName"] }, "w-full"]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(form).errors["billingInfo.lastName"] ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(form).errors["billingInfo.lastName"]), 1)) : createCommentVNode("", true)
                                  ])
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "billingCountry",
                                    class: "block font-medium mb-1"
                                  }, "Country"),
                                  createVNode(unref(Select), {
                                    inputId: "billingCountry",
                                    modelValue: unref(form).billingInfo.country_object,
                                    "onUpdate:modelValue": ($event) => unref(form).billingInfo.country_object = $event,
                                    options: unref(countries),
                                    filter: "",
                                    optionLabel: "name",
                                    placeholder: "Select a country",
                                    class: [{ "p-invalid": unref(form).errors["billingInfo.country"] }, "w-full"],
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
                                  unref(form).errors["billingInfo.country"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["billingInfo.country"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "billingStreetAddress",
                                    class: "block font-medium mb-1"
                                  }, "Street Address"),
                                  createVNode(unref(InputText), {
                                    id: "billingStreetAddress",
                                    modelValue: unref(form).billingInfo.streetAddress,
                                    "onUpdate:modelValue": ($event) => unref(form).billingInfo.streetAddress = $event,
                                    class: [{ "p-invalid": unref(form).errors["billingInfo.streetAddress"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["billingInfo.streetAddress"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["billingInfo.streetAddress"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "billingCity",
                                      class: "block font-medium mb-1"
                                    }, "City/Town"),
                                    createVNode(unref(InputText), {
                                      id: "billingCity",
                                      modelValue: unref(form).billingInfo.city,
                                      "onUpdate:modelValue": ($event) => unref(form).billingInfo.city = $event,
                                      class: [{ "p-invalid": unref(form).errors["billingInfo.city"] }, "w-full"]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(form).errors["billingInfo.city"] ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(form).errors["billingInfo.city"]), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "billingStateOrCounty",
                                      class: "block font-medium mb-1"
                                    }, "State/County"),
                                    createVNode(unref(InputText), {
                                      id: "billingStateOrCounty",
                                      modelValue: unref(form).billingInfo.stateOrCounty,
                                      "onUpdate:modelValue": ($event) => unref(form).billingInfo.stateOrCounty = $event,
                                      class: [{ "p-invalid": unref(form).errors["billingInfo.stateOrCounty"] }, "w-full"]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(form).errors["billingInfo.stateOrCounty"] ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(form).errors["billingInfo.stateOrCounty"]), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "billingPostalCode",
                                      class: "block font-medium mb-1"
                                    }, "Postcode/ZIP"),
                                    createVNode(unref(InputText), {
                                      id: "billingPostalCode",
                                      modelValue: unref(form).billingInfo.postalCode,
                                      "onUpdate:modelValue": ($event) => unref(form).billingInfo.postalCode = $event,
                                      class: [{ "p-invalid": unref(form).errors["billingInfo.postalCode"] }, "w-full"]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(form).errors["billingInfo.postalCode"] ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(form).errors["billingInfo.postalCode"]), 1)) : createCommentVNode("", true)
                                  ])
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "billingPhone",
                                    class: "block font-medium mb-1"
                                  }, "Phone"),
                                  createVNode(unref(InputText), {
                                    id: "billingPhone",
                                    modelValue: unref(form).billingInfo.phone,
                                    "onUpdate:modelValue": ($event) => unref(form).billingInfo.phone = $event,
                                    class: [{ "p-invalid": unref(form).errors["billingInfo.phone"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["billingInfo.phone"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["billingInfo.phone"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode(unref(Divider)),
                                createVNode("div", { class: "flex items-center py-2" }, [
                                  createVNode(unref(Checkbox), {
                                    inputId: "wantsInvoice",
                                    modelValue: unref(form).wantsInvoice,
                                    "onUpdate:modelValue": ($event) => unref(form).wantsInvoice = $event,
                                    binary: true
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode("label", {
                                    for: "wantsInvoice",
                                    class: "ml-2 font-medium"
                                  }, "I require an invoice (for company/professional)")
                                ]),
                                unref(form).wantsInvoice ? (openBlock(), createBlock(unref(Fieldset), {
                                  key: 0,
                                  legend: "Invoice Details",
                                  toggleable: false,
                                  class: "mt-4"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "space-y-4 p-fluid" }, [
                                      createVNode("div", null, [
                                        createVNode("label", {
                                          for: "invoiceCompanyName",
                                          class: "block font-medium mb-1"
                                        }, "Company Name"),
                                        createVNode(unref(InputText), {
                                          id: "invoiceCompanyName",
                                          modelValue: unref(form).invoiceDetails.companyName,
                                          "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.companyName = $event,
                                          class: [{ "p-invalid": unref(form).errors["invoiceDetails.companyName"] }, "w-full"]
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                        unref(form).errors["invoiceDetails.companyName"] ? (openBlock(), createBlock("small", {
                                          key: 0,
                                          class: "p-error"
                                        }, toDisplayString(unref(form).errors["invoiceDetails.companyName"]), 1)) : createCommentVNode("", true)
                                      ]),
                                      createVNode("div", null, [
                                        createVNode("label", {
                                          for: "invoiceVatNumber",
                                          class: "block font-medium mb-1"
                                        }, "VAT Number"),
                                        createVNode(unref(InputText), {
                                          id: "invoiceVatNumber",
                                          modelValue: unref(form).invoiceDetails.vatNumber,
                                          "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.vatNumber = $event,
                                          class: [{ "p-invalid": unref(form).errors["invoiceDetails.vatNumber"] }, "w-full"]
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                        unref(form).errors["invoiceDetails.vatNumber"] ? (openBlock(), createBlock("small", {
                                          key: 0,
                                          class: "p-error"
                                        }, toDisplayString(unref(form).errors["invoiceDetails.vatNumber"]), 1)) : createCommentVNode("", true)
                                      ]),
                                      createVNode("div", null, [
                                        createVNode("label", {
                                          for: "invoiceProfession",
                                          class: "block font-medium mb-1"
                                        }, "Profession / Business Activity"),
                                        createVNode(unref(InputText), {
                                          id: "invoiceProfession",
                                          modelValue: unref(form).invoiceDetails.profession,
                                          "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.profession = $event,
                                          class: [{ "p-invalid": unref(form).errors["invoiceDetails.profession"] }, "w-full"]
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                        unref(form).errors["invoiceDetails.profession"] ? (openBlock(), createBlock("small", {
                                          key: 0,
                                          class: "p-error"
                                        }, toDisplayString(unref(form).errors["invoiceDetails.profession"]), 1)) : createCommentVNode("", true)
                                      ]),
                                      createVNode("div", null, [
                                        createVNode("label", {
                                          for: "invoiceTaxOffice",
                                          class: "block font-medium mb-1"
                                        }, "Tax Office (ΔΟΥ - Optional)"),
                                        createVNode(unref(InputText), {
                                          id: "invoiceTaxOffice",
                                          modelValue: unref(form).invoiceDetails.taxOffice,
                                          "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.taxOffice = $event,
                                          class: [{ "p-invalid": unref(form).errors["invoiceDetails.taxOffice"] }, "w-full"]
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                        unref(form).errors["invoiceDetails.taxOffice"] ? (openBlock(), createBlock("small", {
                                          key: 0,
                                          class: "p-error"
                                        }, toDisplayString(unref(form).errors["invoiceDetails.taxOffice"]), 1)) : createCommentVNode("", true)
                                      ])
                                    ])
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Card), null, {
                            content: withCtx(() => [
                              createVNode("div", { class: "flex items-center" }, [
                                createVNode(unref(Checkbox), {
                                  inputId: "shippingIsDifferent",
                                  modelValue: unref(form).shippingIsDifferent,
                                  "onUpdate:modelValue": ($event) => unref(form).shippingIsDifferent = $event,
                                  binary: true
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode("label", {
                                  for: "shippingIsDifferent",
                                  class: "ml-2 font-medium"
                                }, "Ship to a different address?")
                              ])
                            ]),
                            _: 1
                          }),
                          unref(form).shippingIsDifferent ? (openBlock(), createBlock(unref(Card), { key: 0 }, {
                            title: withCtx(() => [
                              createVNode("h2", { class: "text-lg font-semibold" }, "Shipping Information")
                            ]),
                            content: withCtx(() => [
                              createVNode("div", { class: "space-y-6" }, [
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "shippingEmail",
                                    class: "block font-medium mb-1"
                                  }, "Shipping Contact Email (Optional)"),
                                  createVNode(unref(InputText), {
                                    id: "shippingEmail",
                                    type: "email",
                                    modelValue: unref(form).shippingInfo.email,
                                    "onUpdate:modelValue": ($event) => unref(form).shippingInfo.email = $event,
                                    class: [{ "p-invalid": unref(form).errors["shippingInfo.email"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["shippingInfo.email"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["shippingInfo.email"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "shippingFirstName",
                                      class: "block font-medium mb-1"
                                    }, "First Name"),
                                    createVNode(unref(InputText), {
                                      id: "shippingFirstName",
                                      modelValue: unref(form).shippingInfo.firstName,
                                      "onUpdate:modelValue": ($event) => unref(form).shippingInfo.firstName = $event,
                                      class: [{ "p-invalid": unref(form).errors["shippingInfo.firstName"] }, "w-full"]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(form).errors["shippingInfo.firstName"] ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(form).errors["shippingInfo.firstName"]), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "shippingLastName",
                                      class: "block font-medium mb-1"
                                    }, "Last Name"),
                                    createVNode(unref(InputText), {
                                      id: "shippingLastName",
                                      modelValue: unref(form).shippingInfo.lastName,
                                      "onUpdate:modelValue": ($event) => unref(form).shippingInfo.lastName = $event,
                                      class: [{ "p-invalid": unref(form).errors["shippingInfo.lastName"] }, "w-full"]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(form).errors["shippingInfo.lastName"] ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(form).errors["shippingInfo.lastName"]), 1)) : createCommentVNode("", true)
                                  ])
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "shippingCountry",
                                    class: "block font-medium mb-1"
                                  }, "Country"),
                                  createVNode(unref(Select), {
                                    inputId: "shippingCountry",
                                    modelValue: unref(form).shippingInfo.country_object,
                                    "onUpdate:modelValue": ($event) => unref(form).shippingInfo.country_object = $event,
                                    options: unref(countries),
                                    filter: "",
                                    optionLabel: "name",
                                    placeholder: "Select a country",
                                    class: [{ "p-invalid": unref(form).errors["shippingInfo.country"] }, "w-full"],
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
                                  unref(form).errors["shippingInfo.country"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["shippingInfo.country"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "shippingStreetAddress",
                                    class: "block font-medium mb-1"
                                  }, "Street Address"),
                                  createVNode(unref(InputText), {
                                    id: "shippingStreetAddress",
                                    modelValue: unref(form).shippingInfo.streetAddress,
                                    "onUpdate:modelValue": ($event) => unref(form).shippingInfo.streetAddress = $event,
                                    class: [{ "p-invalid": unref(form).errors["shippingInfo.streetAddress"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["shippingInfo.streetAddress"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["shippingInfo.streetAddress"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "shippingCity",
                                      class: "block font-medium mb-1"
                                    }, "City/Town"),
                                    createVNode(unref(InputText), {
                                      id: "shippingCity",
                                      modelValue: unref(form).shippingInfo.city,
                                      "onUpdate:modelValue": ($event) => unref(form).shippingInfo.city = $event,
                                      class: [{ "p-invalid": unref(form).errors["shippingInfo.city"] }, "w-full"]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(form).errors["shippingInfo.city"] ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(form).errors["shippingInfo.city"]), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "shippingStateOrCounty",
                                      class: "block font-medium mb-1"
                                    }, "State/County"),
                                    createVNode(unref(InputText), {
                                      id: "shippingStateOrCounty",
                                      modelValue: unref(form).shippingInfo.stateOrCounty,
                                      "onUpdate:modelValue": ($event) => unref(form).shippingInfo.stateOrCounty = $event,
                                      class: [{ "p-invalid": unref(form).errors["shippingInfo.stateOrCounty"] }, "w-full"]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(form).errors["shippingInfo.stateOrCounty"] ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(form).errors["shippingInfo.stateOrCounty"]), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "shippingPostalCode",
                                      class: "block font-medium mb-1"
                                    }, "Postcode/ZIP"),
                                    createVNode(unref(InputText), {
                                      id: "shippingPostalCode",
                                      modelValue: unref(form).shippingInfo.postalCode,
                                      "onUpdate:modelValue": ($event) => unref(form).shippingInfo.postalCode = $event,
                                      class: [{ "p-invalid": unref(form).errors["shippingInfo.postalCode"] }, "w-full"]
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(form).errors["shippingInfo.postalCode"] ? (openBlock(), createBlock("small", {
                                      key: 0,
                                      class: "p-error"
                                    }, toDisplayString(unref(form).errors["shippingInfo.postalCode"]), 1)) : createCommentVNode("", true)
                                  ])
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "shippingPhone",
                                    class: "block font-medium mb-1"
                                  }, "Phone (Optional)"),
                                  createVNode(unref(InputText), {
                                    id: "shippingPhone",
                                    modelValue: unref(form).shippingInfo.phone,
                                    "onUpdate:modelValue": ($event) => unref(form).shippingInfo.phone = $event,
                                    class: [{ "p-invalid": unref(form).errors["shippingInfo.phone"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["shippingInfo.phone"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["shippingInfo.phone"]), 1)) : createCommentVNode("", true)
                                ])
                              ])
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          createVNode(unref(Card), null, {
                            title: withCtx(() => [
                              createVNode("h2", { class: "text-lg font-semibold" }, "Order Notes")
                            ]),
                            content: withCtx(() => [
                              createVNode(unref(Textarea), {
                                id: "notes",
                                modelValue: unref(form).notes,
                                "onUpdate:modelValue": ($event) => unref(form).notes = $event,
                                rows: "3",
                                placeholder: "Notes about your order, e.g. special notes for delivery.",
                                class: [{ "p-invalid": unref(form).errors.notes }, "w-full"]
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                              unref(form).errors.notes ? (openBlock(), createBlock("small", {
                                key: 0,
                                class: "p-error"
                              }, toDisplayString(unref(form).errors.notes), 1)) : createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ], 32)
                      ]),
                      createVNode("div", { class: "lg:col-span-1" }, [
                        createVNode(unref(Card), null, {
                          title: withCtx(() => [
                            createVNode("h2", { class: "text-lg font-semibold" }, "Your Order")
                          ]),
                          content: withCtx(() => [
                            createVNode("div", { class: "space-y-4" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.cartItems, (item) => {
                                var _a2, _b2, _c, _d;
                                return openBlock(), createBlock("div", {
                                  key: item.id,
                                  class: "flex justify-between items-center"
                                }, [
                                  createVNode("div", { class: "flex-shrink-0 w-16 sm:w-20" }, [
                                    createVNode(_sfc_main$2, {
                                      "artwork-image": ((_a2 = item.artwork_data) == null ? void 0 : _a2.img_thumb) || ((_b2 = item.artwork_data) == null ? void 0 : _b2.img_medium) || "/images/placeholder.png",
                                      frame: item.frame,
                                      size: item.size,
                                      type: item.type
                                    }, null, 8, ["artwork-image", "frame", "size", "type"])
                                  ]),
                                  createVNode("div", { class: "flex-1 min-w-0" }, [
                                    createVNode("p", { class: "font-medium text-sm text-surface-900 truncate" }, toDisplayString(((_c = item.artwork_data) == null ? void 0 : _c.title) || "Untitled"), 1),
                                    createVNode("p", { class: "text-xs text-surface-500" }, " ID: " + toDisplayString(item.artwork_id || item.pictufy_id || item.id), 1),
                                    createVNode("p", { class: "text-xs text-surface-500" }, toDisplayString(item.type) + " | " + toDisplayString(item.print_type === "oil" ? "Oil Print" : "Mono Print") + " | " + toDisplayString(item.frame) + " | " + toDisplayString(item.size), 1)
                                  ]),
                                  createVNode("p", { class: "text-sm font-semibold text-surface-700 mt-1" }, toDisplayString(item.quantity) + " x " + toDisplayString(formatCurrency(((_d = item.artwork_data) == null ? void 0 : _d.price) || 0)), 1)
                                ]);
                              }), 128))
                            ]),
                            createVNode(unref(Divider)),
                            createVNode("div", { class: "mt-4 pt-4" }, [
                              createVNode("div", { class: "flex gap-2" }, [
                                createVNode(unref(InputText), {
                                  modelValue: couponCode.value,
                                  "onUpdate:modelValue": ($event) => couponCode.value = $event,
                                  placeholder: "Coupon",
                                  class: "w-full p-inputtext-sm",
                                  disabled: !!appliedCoupon.value
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                                !appliedCoupon.value ? (openBlock(), createBlock(unref(Button), {
                                  key: 0,
                                  label: "Apply",
                                  size: "small",
                                  loading: isCheckingCoupon.value,
                                  onClick: applyCoupon,
                                  disabled: !couponCode.value
                                }, null, 8, ["loading", "disabled"])) : (openBlock(), createBlock(unref(Button), {
                                  key: 1,
                                  icon: "pi pi-times",
                                  severity: "danger",
                                  outlined: "",
                                  size: "small",
                                  onClick: removeCoupon
                                }))
                              ]),
                              couponError.value ? (openBlock(), createBlock("small", {
                                key: 0,
                                class: "text-red-500 block mt-1"
                              }, toDisplayString(couponError.value), 1)) : createCommentVNode("", true),
                              appliedCoupon.value ? (openBlock(), createBlock("small", {
                                key: 1,
                                class: "text-green-600 block mt-1"
                              }, "Code " + toDisplayString(appliedCoupon.value.code) + " applied!", 1)) : createCommentVNode("", true),
                              createVNode("div", { class: "space-y-2 mt-4 text-sm" }, [
                                createVNode("div", { class: "flex justify-between" }, [
                                  createVNode("span", null, "Subtotal"),
                                  createVNode("span", null, toDisplayString(formatCurrency(__props.cartTotal)), 1)
                                ]),
                                appliedCoupon.value ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "flex justify-between text-green-600 font-medium"
                                }, [
                                  createVNode("span", null, "Discount (" + toDisplayString(appliedCoupon.value.code) + ")", 1),
                                  createVNode("span", null, "-" + toDisplayString(formatCurrency(discountAmount.value)), 1)
                                ])) : createCommentVNode("", true),
                                createVNode("div", { class: "flex justify-between font-bold text-lg pt-2 border-t" }, [
                                  createVNode("span", null, "Total"),
                                  createVNode("span", null, toDisplayString(formatCurrency(finalTotal.value)), 1)
                                ])
                              ])
                            ]),
                            createVNode("div", { class: "space-y-3 mt-6" }, [
                              createVNode("label", { class: "block font-medium" }, "Payment Method"),
                              createVNode("div", { class: "flex flex-col md:flex-row md:gap-6" }, [
                                createVNode("div", { class: "flex items-center" }, [
                                  createVNode(unref(RadioButton), {
                                    inputId: "pmBank",
                                    name: "paymentMethod",
                                    value: "bank_transfer",
                                    modelValue: unref(form).paymentMethod,
                                    "onUpdate:modelValue": ($event) => unref(form).paymentMethod = $event
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode("label", {
                                    for: "pmBank",
                                    class: "ml-2"
                                  }, "Bank Transfer")
                                ])
                              ]),
                              createVNode("p", { class: "text-sm italic text-gray-600" }, "We'll contact you for further payment details. "),
                              unref(form).errors.paymentMethod ? (openBlock(), createBlock("small", {
                                key: 0,
                                class: "p-error"
                              }, toDisplayString(unref(form).errors.paymentMethod), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode(unref(Button), {
                              label: "Place Order",
                              icon: "pi pi-check",
                              type: "submit",
                              onClick: submit,
                              class: "mt-4 w-full",
                              loading: unref(form).processing
                            }, null, 8, ["loading"])
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Head), { title: "Checkout" }),
              createVNode(_sfc_main$1, null, {
                default: withCtx(() => [
                  createVNode(PageTitleSection, { title: "Checkout" }),
                  createVNode("div", { class: "grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6" }, [
                    createVNode("div", { class: "lg:col-span-2" }, [
                      createVNode("form", {
                        onSubmit: withModifiers(submit, ["prevent"]),
                        class: "space-y-6"
                      }, [
                        createVNode(unref(Card), null, {
                          title: withCtx(() => [
                            createVNode("h2", { class: "text-lg font-semibold" }, "Billing Information")
                          ]),
                          content: withCtx(() => [
                            createVNode("div", { class: "space-y-6" }, [
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "billingEmail",
                                  class: "block font-medium mb-1"
                                }, "Email"),
                                createVNode(unref(InputText), {
                                  id: "billingEmail",
                                  type: "email",
                                  modelValue: unref(form).billingInfo.email,
                                  "onUpdate:modelValue": ($event) => unref(form).billingInfo.email = $event,
                                  class: [{ "p-invalid": unref(form).errors["billingInfo.email"] }, "w-full"]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(form).errors["billingInfo.email"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["billingInfo.email"]), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "billingFirstName",
                                    class: "block font-medium mb-1"
                                  }, "First Name"),
                                  createVNode(unref(InputText), {
                                    id: "billingFirstName",
                                    modelValue: unref(form).billingInfo.firstName,
                                    "onUpdate:modelValue": ($event) => unref(form).billingInfo.firstName = $event,
                                    class: [{ "p-invalid": unref(form).errors["billingInfo.firstName"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["billingInfo.firstName"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["billingInfo.firstName"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "billingLastName",
                                    class: "block font-medium mb-1"
                                  }, "Last Name"),
                                  createVNode(unref(InputText), {
                                    id: "billingLastName",
                                    modelValue: unref(form).billingInfo.lastName,
                                    "onUpdate:modelValue": ($event) => unref(form).billingInfo.lastName = $event,
                                    class: [{ "p-invalid": unref(form).errors["billingInfo.lastName"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["billingInfo.lastName"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["billingInfo.lastName"]), 1)) : createCommentVNode("", true)
                                ])
                              ]),
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "billingCountry",
                                  class: "block font-medium mb-1"
                                }, "Country"),
                                createVNode(unref(Select), {
                                  inputId: "billingCountry",
                                  modelValue: unref(form).billingInfo.country_object,
                                  "onUpdate:modelValue": ($event) => unref(form).billingInfo.country_object = $event,
                                  options: unref(countries),
                                  filter: "",
                                  optionLabel: "name",
                                  placeholder: "Select a country",
                                  class: [{ "p-invalid": unref(form).errors["billingInfo.country"] }, "w-full"],
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
                                unref(form).errors["billingInfo.country"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["billingInfo.country"]), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "billingStreetAddress",
                                  class: "block font-medium mb-1"
                                }, "Street Address"),
                                createVNode(unref(InputText), {
                                  id: "billingStreetAddress",
                                  modelValue: unref(form).billingInfo.streetAddress,
                                  "onUpdate:modelValue": ($event) => unref(form).billingInfo.streetAddress = $event,
                                  class: [{ "p-invalid": unref(form).errors["billingInfo.streetAddress"] }, "w-full"]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(form).errors["billingInfo.streetAddress"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["billingInfo.streetAddress"]), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "billingCity",
                                    class: "block font-medium mb-1"
                                  }, "City/Town"),
                                  createVNode(unref(InputText), {
                                    id: "billingCity",
                                    modelValue: unref(form).billingInfo.city,
                                    "onUpdate:modelValue": ($event) => unref(form).billingInfo.city = $event,
                                    class: [{ "p-invalid": unref(form).errors["billingInfo.city"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["billingInfo.city"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["billingInfo.city"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "billingStateOrCounty",
                                    class: "block font-medium mb-1"
                                  }, "State/County"),
                                  createVNode(unref(InputText), {
                                    id: "billingStateOrCounty",
                                    modelValue: unref(form).billingInfo.stateOrCounty,
                                    "onUpdate:modelValue": ($event) => unref(form).billingInfo.stateOrCounty = $event,
                                    class: [{ "p-invalid": unref(form).errors["billingInfo.stateOrCounty"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["billingInfo.stateOrCounty"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["billingInfo.stateOrCounty"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "billingPostalCode",
                                    class: "block font-medium mb-1"
                                  }, "Postcode/ZIP"),
                                  createVNode(unref(InputText), {
                                    id: "billingPostalCode",
                                    modelValue: unref(form).billingInfo.postalCode,
                                    "onUpdate:modelValue": ($event) => unref(form).billingInfo.postalCode = $event,
                                    class: [{ "p-invalid": unref(form).errors["billingInfo.postalCode"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["billingInfo.postalCode"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["billingInfo.postalCode"]), 1)) : createCommentVNode("", true)
                                ])
                              ]),
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "billingPhone",
                                  class: "block font-medium mb-1"
                                }, "Phone"),
                                createVNode(unref(InputText), {
                                  id: "billingPhone",
                                  modelValue: unref(form).billingInfo.phone,
                                  "onUpdate:modelValue": ($event) => unref(form).billingInfo.phone = $event,
                                  class: [{ "p-invalid": unref(form).errors["billingInfo.phone"] }, "w-full"]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(form).errors["billingInfo.phone"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["billingInfo.phone"]), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode(unref(Divider)),
                              createVNode("div", { class: "flex items-center py-2" }, [
                                createVNode(unref(Checkbox), {
                                  inputId: "wantsInvoice",
                                  modelValue: unref(form).wantsInvoice,
                                  "onUpdate:modelValue": ($event) => unref(form).wantsInvoice = $event,
                                  binary: true
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode("label", {
                                  for: "wantsInvoice",
                                  class: "ml-2 font-medium"
                                }, "I require an invoice (for company/professional)")
                              ]),
                              unref(form).wantsInvoice ? (openBlock(), createBlock(unref(Fieldset), {
                                key: 0,
                                legend: "Invoice Details",
                                toggleable: false,
                                class: "mt-4"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "space-y-4 p-fluid" }, [
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "invoiceCompanyName",
                                        class: "block font-medium mb-1"
                                      }, "Company Name"),
                                      createVNode(unref(InputText), {
                                        id: "invoiceCompanyName",
                                        modelValue: unref(form).invoiceDetails.companyName,
                                        "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.companyName = $event,
                                        class: [{ "p-invalid": unref(form).errors["invoiceDetails.companyName"] }, "w-full"]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(form).errors["invoiceDetails.companyName"] ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(form).errors["invoiceDetails.companyName"]), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "invoiceVatNumber",
                                        class: "block font-medium mb-1"
                                      }, "VAT Number"),
                                      createVNode(unref(InputText), {
                                        id: "invoiceVatNumber",
                                        modelValue: unref(form).invoiceDetails.vatNumber,
                                        "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.vatNumber = $event,
                                        class: [{ "p-invalid": unref(form).errors["invoiceDetails.vatNumber"] }, "w-full"]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(form).errors["invoiceDetails.vatNumber"] ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(form).errors["invoiceDetails.vatNumber"]), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "invoiceProfession",
                                        class: "block font-medium mb-1"
                                      }, "Profession / Business Activity"),
                                      createVNode(unref(InputText), {
                                        id: "invoiceProfession",
                                        modelValue: unref(form).invoiceDetails.profession,
                                        "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.profession = $event,
                                        class: [{ "p-invalid": unref(form).errors["invoiceDetails.profession"] }, "w-full"]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(form).errors["invoiceDetails.profession"] ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(form).errors["invoiceDetails.profession"]), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "invoiceTaxOffice",
                                        class: "block font-medium mb-1"
                                      }, "Tax Office (ΔΟΥ - Optional)"),
                                      createVNode(unref(InputText), {
                                        id: "invoiceTaxOffice",
                                        modelValue: unref(form).invoiceDetails.taxOffice,
                                        "onUpdate:modelValue": ($event) => unref(form).invoiceDetails.taxOffice = $event,
                                        class: [{ "p-invalid": unref(form).errors["invoiceDetails.taxOffice"] }, "w-full"]
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                      unref(form).errors["invoiceDetails.taxOffice"] ? (openBlock(), createBlock("small", {
                                        key: 0,
                                        class: "p-error"
                                      }, toDisplayString(unref(form).errors["invoiceDetails.taxOffice"]), 1)) : createCommentVNode("", true)
                                    ])
                                  ])
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(Card), null, {
                          content: withCtx(() => [
                            createVNode("div", { class: "flex items-center" }, [
                              createVNode(unref(Checkbox), {
                                inputId: "shippingIsDifferent",
                                modelValue: unref(form).shippingIsDifferent,
                                "onUpdate:modelValue": ($event) => unref(form).shippingIsDifferent = $event,
                                binary: true
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode("label", {
                                for: "shippingIsDifferent",
                                class: "ml-2 font-medium"
                              }, "Ship to a different address?")
                            ])
                          ]),
                          _: 1
                        }),
                        unref(form).shippingIsDifferent ? (openBlock(), createBlock(unref(Card), { key: 0 }, {
                          title: withCtx(() => [
                            createVNode("h2", { class: "text-lg font-semibold" }, "Shipping Information")
                          ]),
                          content: withCtx(() => [
                            createVNode("div", { class: "space-y-6" }, [
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "shippingEmail",
                                  class: "block font-medium mb-1"
                                }, "Shipping Contact Email (Optional)"),
                                createVNode(unref(InputText), {
                                  id: "shippingEmail",
                                  type: "email",
                                  modelValue: unref(form).shippingInfo.email,
                                  "onUpdate:modelValue": ($event) => unref(form).shippingInfo.email = $event,
                                  class: [{ "p-invalid": unref(form).errors["shippingInfo.email"] }, "w-full"]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(form).errors["shippingInfo.email"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["shippingInfo.email"]), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "shippingFirstName",
                                    class: "block font-medium mb-1"
                                  }, "First Name"),
                                  createVNode(unref(InputText), {
                                    id: "shippingFirstName",
                                    modelValue: unref(form).shippingInfo.firstName,
                                    "onUpdate:modelValue": ($event) => unref(form).shippingInfo.firstName = $event,
                                    class: [{ "p-invalid": unref(form).errors["shippingInfo.firstName"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["shippingInfo.firstName"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["shippingInfo.firstName"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "shippingLastName",
                                    class: "block font-medium mb-1"
                                  }, "Last Name"),
                                  createVNode(unref(InputText), {
                                    id: "shippingLastName",
                                    modelValue: unref(form).shippingInfo.lastName,
                                    "onUpdate:modelValue": ($event) => unref(form).shippingInfo.lastName = $event,
                                    class: [{ "p-invalid": unref(form).errors["shippingInfo.lastName"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["shippingInfo.lastName"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["shippingInfo.lastName"]), 1)) : createCommentVNode("", true)
                                ])
                              ]),
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "shippingCountry",
                                  class: "block font-medium mb-1"
                                }, "Country"),
                                createVNode(unref(Select), {
                                  inputId: "shippingCountry",
                                  modelValue: unref(form).shippingInfo.country_object,
                                  "onUpdate:modelValue": ($event) => unref(form).shippingInfo.country_object = $event,
                                  options: unref(countries),
                                  filter: "",
                                  optionLabel: "name",
                                  placeholder: "Select a country",
                                  class: [{ "p-invalid": unref(form).errors["shippingInfo.country"] }, "w-full"],
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
                                unref(form).errors["shippingInfo.country"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["shippingInfo.country"]), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "shippingStreetAddress",
                                  class: "block font-medium mb-1"
                                }, "Street Address"),
                                createVNode(unref(InputText), {
                                  id: "shippingStreetAddress",
                                  modelValue: unref(form).shippingInfo.streetAddress,
                                  "onUpdate:modelValue": ($event) => unref(form).shippingInfo.streetAddress = $event,
                                  class: [{ "p-invalid": unref(form).errors["shippingInfo.streetAddress"] }, "w-full"]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(form).errors["shippingInfo.streetAddress"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["shippingInfo.streetAddress"]), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "shippingCity",
                                    class: "block font-medium mb-1"
                                  }, "City/Town"),
                                  createVNode(unref(InputText), {
                                    id: "shippingCity",
                                    modelValue: unref(form).shippingInfo.city,
                                    "onUpdate:modelValue": ($event) => unref(form).shippingInfo.city = $event,
                                    class: [{ "p-invalid": unref(form).errors["shippingInfo.city"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["shippingInfo.city"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["shippingInfo.city"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "shippingStateOrCounty",
                                    class: "block font-medium mb-1"
                                  }, "State/County"),
                                  createVNode(unref(InputText), {
                                    id: "shippingStateOrCounty",
                                    modelValue: unref(form).shippingInfo.stateOrCounty,
                                    "onUpdate:modelValue": ($event) => unref(form).shippingInfo.stateOrCounty = $event,
                                    class: [{ "p-invalid": unref(form).errors["shippingInfo.stateOrCounty"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["shippingInfo.stateOrCounty"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["shippingInfo.stateOrCounty"]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", {
                                    for: "shippingPostalCode",
                                    class: "block font-medium mb-1"
                                  }, "Postcode/ZIP"),
                                  createVNode(unref(InputText), {
                                    id: "shippingPostalCode",
                                    modelValue: unref(form).shippingInfo.postalCode,
                                    "onUpdate:modelValue": ($event) => unref(form).shippingInfo.postalCode = $event,
                                    class: [{ "p-invalid": unref(form).errors["shippingInfo.postalCode"] }, "w-full"]
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(form).errors["shippingInfo.postalCode"] ? (openBlock(), createBlock("small", {
                                    key: 0,
                                    class: "p-error"
                                  }, toDisplayString(unref(form).errors["shippingInfo.postalCode"]), 1)) : createCommentVNode("", true)
                                ])
                              ]),
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "shippingPhone",
                                  class: "block font-medium mb-1"
                                }, "Phone (Optional)"),
                                createVNode(unref(InputText), {
                                  id: "shippingPhone",
                                  modelValue: unref(form).shippingInfo.phone,
                                  "onUpdate:modelValue": ($event) => unref(form).shippingInfo.phone = $event,
                                  class: [{ "p-invalid": unref(form).errors["shippingInfo.phone"] }, "w-full"]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(form).errors["shippingInfo.phone"] ? (openBlock(), createBlock("small", {
                                  key: 0,
                                  class: "p-error"
                                }, toDisplayString(unref(form).errors["shippingInfo.phone"]), 1)) : createCommentVNode("", true)
                              ])
                            ])
                          ]),
                          _: 1
                        })) : createCommentVNode("", true),
                        createVNode(unref(Card), null, {
                          title: withCtx(() => [
                            createVNode("h2", { class: "text-lg font-semibold" }, "Order Notes")
                          ]),
                          content: withCtx(() => [
                            createVNode(unref(Textarea), {
                              id: "notes",
                              modelValue: unref(form).notes,
                              "onUpdate:modelValue": ($event) => unref(form).notes = $event,
                              rows: "3",
                              placeholder: "Notes about your order, e.g. special notes for delivery.",
                              class: [{ "p-invalid": unref(form).errors.notes }, "w-full"]
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                            unref(form).errors.notes ? (openBlock(), createBlock("small", {
                              key: 0,
                              class: "p-error"
                            }, toDisplayString(unref(form).errors.notes), 1)) : createCommentVNode("", true)
                          ]),
                          _: 1
                        })
                      ], 32)
                    ]),
                    createVNode("div", { class: "lg:col-span-1" }, [
                      createVNode(unref(Card), null, {
                        title: withCtx(() => [
                          createVNode("h2", { class: "text-lg font-semibold" }, "Your Order")
                        ]),
                        content: withCtx(() => [
                          createVNode("div", { class: "space-y-4" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.cartItems, (item) => {
                              var _a2, _b2, _c, _d;
                              return openBlock(), createBlock("div", {
                                key: item.id,
                                class: "flex justify-between items-center"
                              }, [
                                createVNode("div", { class: "flex-shrink-0 w-16 sm:w-20" }, [
                                  createVNode(_sfc_main$2, {
                                    "artwork-image": ((_a2 = item.artwork_data) == null ? void 0 : _a2.img_thumb) || ((_b2 = item.artwork_data) == null ? void 0 : _b2.img_medium) || "/images/placeholder.png",
                                    frame: item.frame,
                                    size: item.size,
                                    type: item.type
                                  }, null, 8, ["artwork-image", "frame", "size", "type"])
                                ]),
                                createVNode("div", { class: "flex-1 min-w-0" }, [
                                  createVNode("p", { class: "font-medium text-sm text-surface-900 truncate" }, toDisplayString(((_c = item.artwork_data) == null ? void 0 : _c.title) || "Untitled"), 1),
                                  createVNode("p", { class: "text-xs text-surface-500" }, " ID: " + toDisplayString(item.artwork_id || item.pictufy_id || item.id), 1),
                                  createVNode("p", { class: "text-xs text-surface-500" }, toDisplayString(item.type) + " | " + toDisplayString(item.print_type === "oil" ? "Oil Print" : "Mono Print") + " | " + toDisplayString(item.frame) + " | " + toDisplayString(item.size), 1)
                                ]),
                                createVNode("p", { class: "text-sm font-semibold text-surface-700 mt-1" }, toDisplayString(item.quantity) + " x " + toDisplayString(formatCurrency(((_d = item.artwork_data) == null ? void 0 : _d.price) || 0)), 1)
                              ]);
                            }), 128))
                          ]),
                          createVNode(unref(Divider)),
                          createVNode("div", { class: "mt-4 pt-4" }, [
                            createVNode("div", { class: "flex gap-2" }, [
                              createVNode(unref(InputText), {
                                modelValue: couponCode.value,
                                "onUpdate:modelValue": ($event) => couponCode.value = $event,
                                placeholder: "Coupon",
                                class: "w-full p-inputtext-sm",
                                disabled: !!appliedCoupon.value
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                              !appliedCoupon.value ? (openBlock(), createBlock(unref(Button), {
                                key: 0,
                                label: "Apply",
                                size: "small",
                                loading: isCheckingCoupon.value,
                                onClick: applyCoupon,
                                disabled: !couponCode.value
                              }, null, 8, ["loading", "disabled"])) : (openBlock(), createBlock(unref(Button), {
                                key: 1,
                                icon: "pi pi-times",
                                severity: "danger",
                                outlined: "",
                                size: "small",
                                onClick: removeCoupon
                              }))
                            ]),
                            couponError.value ? (openBlock(), createBlock("small", {
                              key: 0,
                              class: "text-red-500 block mt-1"
                            }, toDisplayString(couponError.value), 1)) : createCommentVNode("", true),
                            appliedCoupon.value ? (openBlock(), createBlock("small", {
                              key: 1,
                              class: "text-green-600 block mt-1"
                            }, "Code " + toDisplayString(appliedCoupon.value.code) + " applied!", 1)) : createCommentVNode("", true),
                            createVNode("div", { class: "space-y-2 mt-4 text-sm" }, [
                              createVNode("div", { class: "flex justify-between" }, [
                                createVNode("span", null, "Subtotal"),
                                createVNode("span", null, toDisplayString(formatCurrency(__props.cartTotal)), 1)
                              ]),
                              appliedCoupon.value ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "flex justify-between text-green-600 font-medium"
                              }, [
                                createVNode("span", null, "Discount (" + toDisplayString(appliedCoupon.value.code) + ")", 1),
                                createVNode("span", null, "-" + toDisplayString(formatCurrency(discountAmount.value)), 1)
                              ])) : createCommentVNode("", true),
                              createVNode("div", { class: "flex justify-between font-bold text-lg pt-2 border-t" }, [
                                createVNode("span", null, "Total"),
                                createVNode("span", null, toDisplayString(formatCurrency(finalTotal.value)), 1)
                              ])
                            ])
                          ]),
                          createVNode("div", { class: "space-y-3 mt-6" }, [
                            createVNode("label", { class: "block font-medium" }, "Payment Method"),
                            createVNode("div", { class: "flex flex-col md:flex-row md:gap-6" }, [
                              createVNode("div", { class: "flex items-center" }, [
                                createVNode(unref(RadioButton), {
                                  inputId: "pmBank",
                                  name: "paymentMethod",
                                  value: "bank_transfer",
                                  modelValue: unref(form).paymentMethod,
                                  "onUpdate:modelValue": ($event) => unref(form).paymentMethod = $event
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode("label", {
                                  for: "pmBank",
                                  class: "ml-2"
                                }, "Bank Transfer")
                              ])
                            ]),
                            createVNode("p", { class: "text-sm italic text-gray-600" }, "We'll contact you for further payment details. "),
                            unref(form).errors.paymentMethod ? (openBlock(), createBlock("small", {
                              key: 0,
                              class: "p-error"
                            }, toDisplayString(unref(form).errors.paymentMethod), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode(unref(Button), {
                            label: "Place Order",
                            icon: "pi pi-check",
                            type: "submit",
                            onClick: submit,
                            class: "mt-4 w-full",
                            loading: unref(form).processing
                          }, null, 8, ["loading"])
                        ]),
                        _: 1
                      })
                    ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Checkout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
