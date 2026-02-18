import { computed, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderStyle } from "vue/server-renderer";
import { useForm, Link } from "@inertiajs/vue3";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Select from "primevue/select";
import Button from "primevue/button";
import Divider from "primevue/divider";
import { u as useCountries } from "./useCountries-DisC8OA1.js";
const defaultCountryCode = "GR";
const _sfc_main = {
  __name: "UserForm",
  __ssrInlineRender: true,
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    userRoles: {
      type: Array,
      required: true
    },
    // The specific Inertia URL to submit to
    action: {
      type: String,
      required: true
    },
    // 'post' or 'put'
    method: {
      type: String,
      default: "post"
    }
  },
  setup(__props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    const props = __props;
    const { countries } = useCountries();
    const isEditMode = computed(() => props.method.toLowerCase() === "put");
    const submitLabel = computed(() => isEditMode.value ? "Update User" : "Create User");
    const userCountryCode = ((_a = props.user) == null ? void 0 : _a.country) || defaultCountryCode;
    const savedCountry = countries.value.find((c) => c.code === userCountryCode) || countries.value.find((c) => c.code === defaultCountryCode);
    const form = useForm({
      name: ((_b = props.user) == null ? void 0 : _b.name) || "",
      email: ((_c = props.user) == null ? void 0 : _c.email) || "",
      role: ((_d = props.user) == null ? void 0 : _d.role) || (props.userRoles.includes("customer") ? "customer" : props.userRoles[0]),
      password: "",
      password_confirmation: "",
      // Contact Info
      phone: ((_e = props.user) == null ? void 0 : _e.phone) || "",
      // Billing Info
      company_name: ((_f = props.user) == null ? void 0 : _f.company_name) || "",
      profession: ((_g = props.user) == null ? void 0 : _g.profession) || "",
      vat_number: ((_h = props.user) == null ? void 0 : _h.vat_number) || "",
      tax_office: ((_i = props.user) == null ? void 0 : _i.tax_office) || "",
      // Address Info
      address: ((_j = props.user) == null ? void 0 : _j.address) || "",
      city: ((_k = props.user) == null ? void 0 : _k.city) || "",
      postal_code: ((_l = props.user) == null ? void 0 : _l.postal_code) || "",
      country: ((_m = props.user) == null ? void 0 : _m.country) || "",
      country_object: savedCountry
      // Bind to Select
    });
    const roleOptions = computed(
      () => props.userRoles.map((role) => ({ label: role.charAt(0).toUpperCase() + role.slice(1), value: role }))
    );
    const onCountryChange = () => {
      var _a2;
      form.country = ((_a2 = form.country_object) == null ? void 0 : _a2.code) || "";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(_attrs)}><div class="space-y-6"><div><h3 class="text-lg font-medium text-gray-900 mb-3">Account Details</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="name" class="block text-sm font-medium mb-1">Full Name</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        id: "name",
        modelValue: unref(form).name,
        "onUpdate:modelValue": ($event) => unref(form).name = $event,
        class: ["w-full", { "p-invalid": unref(form).errors.name }]
      }, null, _parent));
      if (unref(form).errors.name) {
        _push(`<small class="p-error">${ssrInterpolate(unref(form).errors.name)}</small>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="email" class="block text-sm font-medium mb-1">Email</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        id: "email",
        type: "email",
        modelValue: unref(form).email,
        "onUpdate:modelValue": ($event) => unref(form).email = $event,
        class: ["w-full", { "p-invalid": unref(form).errors.email }]
      }, null, _parent));
      if (unref(form).errors.email) {
        _push(`<small class="p-error">${ssrInterpolate(unref(form).errors.email)}</small>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="role" class="block text-sm font-medium mb-1">Role</label>`);
      _push(ssrRenderComponent(unref(Select), {
        id: "role",
        modelValue: unref(form).role,
        "onUpdate:modelValue": ($event) => unref(form).role = $event,
        options: roleOptions.value,
        optionLabel: "label",
        optionValue: "value",
        placeholder: "Select Role",
        class: ["w-full", { "p-invalid": unref(form).errors.role }]
      }, null, _parent));
      if (unref(form).errors.role) {
        _push(`<small class="p-error">${ssrInterpolate(unref(form).errors.role)}</small>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="phone" class="block text-sm font-medium mb-1">Phone</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        id: "phone",
        modelValue: unref(form).phone,
        "onUpdate:modelValue": ($event) => unref(form).phone = $event,
        class: ["w-full", { "p-invalid": unref(form).errors.phone }]
      }, null, _parent));
      if (unref(form).errors.phone) {
        _push(`<small class="p-error">${ssrInterpolate(unref(form).errors.phone)}</small>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(unref(Divider), null, null, _parent));
      _push(`<div><p class="text-sm text-gray-500 dark:text-gray-400">${ssrInterpolate(isEditMode.value ? "Leave password fields blank to keep current password." : "Set a password for the new user. A password reset link will be sent to the user")}</p><label for="password" class="block text-sm font-medium mb-1">${ssrInterpolate(isEditMode.value ? "New Password (Optional)" : "Password")}</label>`);
      _push(ssrRenderComponent(unref(Password), {
        id: "password",
        modelValue: unref(form).password,
        "onUpdate:modelValue": ($event) => unref(form).password = $event,
        class: ["w-full", { "p-invalid": unref(form).errors.password }],
        inputProps: { autocomplete: "new-password" },
        toggleMask: "",
        feedback: !isEditMode.value
      }, null, _parent));
      if (unref(form).errors.password) {
        _push(`<small class="p-error">${ssrInterpolate(unref(form).errors.password)}</small>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="password_confirmation" class="block text-sm font-medium mb-1">Confirm Password</label>`);
      _push(ssrRenderComponent(unref(Password), {
        id: "password_confirmation",
        modelValue: unref(form).password_confirmation,
        "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
        class: ["w-full", { "p-invalid": unref(form).errors.password_confirmation }],
        inputProps: { autocomplete: "new-password" },
        feedback: false,
        toggleMask: ""
      }, null, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(unref(Divider), null, null, _parent));
      _push(`<div><h3 class="text-lg font-medium text-gray-900 mb-3">Billing &amp; Address</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><div><label for="company_name" class="block text-sm font-medium mb-1">Company Name</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        id: "company_name",
        modelValue: unref(form).company_name,
        "onUpdate:modelValue": ($event) => unref(form).company_name = $event,
        class: ["w-full", { "p-invalid": unref(form).errors.company_name }]
      }, null, _parent));
      if (unref(form).errors.company_name) {
        _push(`<small class="p-error">${ssrInterpolate(unref(form).errors.company_name)}</small>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="profession" class="block text-sm font-medium mb-1">Profession</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        id: "profession",
        modelValue: unref(form).profession,
        "onUpdate:modelValue": ($event) => unref(form).profession = $event,
        class: ["w-full", { "p-invalid": unref(form).errors.profession }]
      }, null, _parent));
      if (unref(form).errors.profession) {
        _push(`<small class="p-error">${ssrInterpolate(unref(form).errors.profession)}</small>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><div><label for="vat_number" class="block text-sm font-medium mb-1">VAT Number (AFM)</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        id: "vat_number",
        modelValue: unref(form).vat_number,
        "onUpdate:modelValue": ($event) => unref(form).vat_number = $event,
        class: ["w-full", { "p-invalid": unref(form).errors.vat_number }]
      }, null, _parent));
      if (unref(form).errors.vat_number) {
        _push(`<small class="p-error">${ssrInterpolate(unref(form).errors.vat_number)}</small>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="tax_office" class="block text-sm font-medium mb-1">Tax Office (DOY)</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        id: "tax_office",
        modelValue: unref(form).tax_office,
        "onUpdate:modelValue": ($event) => unref(form).tax_office = $event,
        class: ["w-full", { "p-invalid": unref(form).errors.tax_office }]
      }, null, _parent));
      if (unref(form).errors.tax_office) {
        _push(`<small class="p-error">${ssrInterpolate(unref(form).errors.tax_office)}</small>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div><label for="address" class="block text-sm font-medium mb-1">Street Address</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        id: "address",
        modelValue: unref(form).address,
        "onUpdate:modelValue": ($event) => unref(form).address = $event,
        class: ["w-full", { "p-invalid": unref(form).errors.address }]
      }, null, _parent));
      if (unref(form).errors.address) {
        _push(`<small class="p-error">${ssrInterpolate(unref(form).errors.address)}</small>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"><div><label for="city" class="block text-sm font-medium mb-1">City</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        id: "city",
        modelValue: unref(form).city,
        "onUpdate:modelValue": ($event) => unref(form).city = $event,
        class: ["w-full", { "p-invalid": unref(form).errors.city }]
      }, null, _parent));
      if (unref(form).errors.city) {
        _push(`<small class="p-error">${ssrInterpolate(unref(form).errors.city)}</small>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="postal_code" class="block text-sm font-medium mb-1">Postal Code</label>`);
      _push(ssrRenderComponent(unref(InputText), {
        id: "postal_code",
        modelValue: unref(form).postal_code,
        "onUpdate:modelValue": ($event) => unref(form).postal_code = $event,
        class: ["w-full", { "p-invalid": unref(form).errors.postal_code }]
      }, null, _parent));
      if (unref(form).errors.postal_code) {
        _push(`<small class="p-error">${ssrInterpolate(unref(form).errors.postal_code)}</small>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="country" class="block text-sm font-medium mb-1">Country</label>`);
      _push(ssrRenderComponent(unref(Select), {
        inputId: "country",
        modelValue: unref(form).country_object,
        "onUpdate:modelValue": ($event) => unref(form).country_object = $event,
        options: unref(countries),
        filter: "",
        optionLabel: "name",
        placeholder: "Select Country",
        class: ["w-full", { "p-invalid": unref(form).errors.country }],
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
        _push(`<small class="p-error">${ssrInterpolate(unref(form).errors.country)}</small>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="flex justify-end space-x-3 mt-8">`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("dashboard.users.index")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Button), {
              label: "Cancel",
              severity: "secondary",
              outlined: "",
              icon: "pi pi-times",
              type: "button"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Button), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                icon: "pi pi-times",
                type: "button"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Button), {
        type: "submit",
        label: submitLabel.value,
        icon: "pi pi-check",
        loading: unref(form).processing
      }, null, _parent));
      _push(`</div></div></form>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/dashboard/users/Partials/UserForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
