import { unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrInterpolate } from "vue/server-renderer";
import { useForm } from "@inertiajs/vue3";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import { useToast } from "primevue/usetoast";
import { u as useCountries } from "./useCountries-DisC8OA1.js";
const _sfc_main = {
  __name: "UpdateAddressForm",
  __ssrInlineRender: true,
  props: {
    user: Object
  },
  setup(__props) {
    const props = __props;
    useToast();
    const { countries } = useCountries();
    const savedCountry = countries.value.find((c) => c.code === props.user.country);
    const form = useForm({
      company_name: props.user.company_name || "",
      profession: props.user.profession || "",
      vat_number: props.user.vat_number || "",
      tax_office: props.user.tax_office || "",
      address: props.user.address || "",
      city: props.user.city || "",
      postal_code: props.user.postal_code || "",
      country_object: savedCountry || null,
      // Binds to the dropdown object
      country: props.user.country || "",
      // Binds to the string (sent to DB)
      phone: props.user.phone || ""
    });
    const onCountryChange = () => {
      var _a;
      form.country = ((_a = form.country_object) == null ? void 0 : _a.code) || "";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(_attrs)}><form class="space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block font-medium text-sm text-gray-700">Company Name</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        modelValue: unref(form).company_name,
        "onUpdate:modelValue": ($event) => unref(form).company_name = $event,
        class: "w-full mt-1"
      }, null, _parent));
      _push(`</div><div><label class="block font-medium text-sm text-gray-700">Profession</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        modelValue: unref(form).profession,
        "onUpdate:modelValue": ($event) => unref(form).profession = $event,
        class: "w-full mt-1"
      }, null, _parent));
      _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block font-medium text-sm text-gray-700">VAT Number (AFM)</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        modelValue: unref(form).vat_number,
        "onUpdate:modelValue": ($event) => unref(form).vat_number = $event,
        class: "w-full mt-1"
      }, null, _parent));
      _push(`</div><div><label class="block font-medium text-sm text-gray-700">Tax Office (DOY)</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        modelValue: unref(form).tax_office,
        "onUpdate:modelValue": ($event) => unref(form).tax_office = $event,
        class: "w-full mt-1"
      }, null, _parent));
      _push(`</div></div><div><label class="block font-medium text-sm text-gray-700">Phone</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        modelValue: unref(form).phone,
        "onUpdate:modelValue": ($event) => unref(form).phone = $event,
        class: "w-full mt-1"
      }, null, _parent));
      _push(`</div><div><label class="block font-medium text-sm text-gray-700">Address</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        modelValue: unref(form).address,
        "onUpdate:modelValue": ($event) => unref(form).address = $event,
        class: "w-full mt-1"
      }, null, _parent));
      _push(`</div><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label class="block font-medium text-sm text-gray-700">City</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        modelValue: unref(form).city,
        "onUpdate:modelValue": ($event) => unref(form).city = $event,
        class: "w-full mt-1"
      }, null, _parent));
      _push(`</div><div><label class="block font-medium text-sm text-gray-700">Postal Code</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        modelValue: unref(form).postal_code,
        "onUpdate:modelValue": ($event) => unref(form).postal_code = $event,
        class: "w-full mt-1"
      }, null, _parent));
      _push(`</div><div><label class="block font-medium text-sm text-gray-700">Country</label>`);
      _push(ssrRenderComponent(unref(Select), {
        inputId: "addressCountry",
        modelValue: unref(form).country_object,
        "onUpdate:modelValue": ($event) => unref(form).country_object = $event,
        options: unref(countries),
        filter: "",
        optionLabel: "name",
        placeholder: "Select a country",
        class: [{ "p-invalid": unref(form).errors.country }, "w-full mt-1"],
        onChange: onCountryChange,
        dataKey: "code"
      }, {
        value: withCtx((slotProps, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (slotProps.value) {
              _push2(`<div class="flex items-center"${_scopeId}>`);
              if (slotProps.value.code) {
                _push2(`<span class="${ssrRenderClass(`fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`)}" style="${ssrRenderStyle({ "font-size": "1.2rem" })}"${_scopeId}></span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div${_scopeId}>${ssrInterpolate(slotProps.value.name)}</div></div>`);
            } else {
              _push2(`<span${_scopeId}>${ssrInterpolate(slotProps.placeholder)}</span>`);
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
                }, null, 2)) : createCommentVNode("", true),
                createVNode("div", null, toDisplayString(slotProps.value.name), 1)
              ])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(slotProps.placeholder), 1))
            ];
          }
        }),
        option: withCtx((slotProps, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center"${_scopeId}>`);
            if (slotProps.option.code) {
              _push2(`<span class="${ssrRenderClass(`fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`)}" style="${ssrRenderStyle({ "font-size": "1.2rem" })}"${_scopeId}></span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div${_scopeId}>${ssrInterpolate(slotProps.option.name)}</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center" }, [
                slotProps.option.code ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: `fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`,
                  style: { "font-size": "1.2rem" }
                }, null, 2)) : createCommentVNode("", true),
                createVNode("div", null, toDisplayString(slotProps.option.name), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(form).errors.country) {
        _push(`<small class="text-red-500">${ssrInterpolate(unref(form).errors.country)}</small>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(unref(Button), {
        label: "Save",
        type: "submit",
        loading: unref(form).processing
      }, null, _parent));
      if (unref(form).recentlySuccessful) {
        _push(`<p class="text-sm text-gray-600">Saved.</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/account/profile/partials/UpdateAddressForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
