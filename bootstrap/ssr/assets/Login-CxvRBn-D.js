import Checkbox from "primevue/checkbox";
import Message from "primevue/message";
import { useTemplateRef, ref, onMounted, resolveComponent, createSlots, withCtx, unref, createTextVNode, toDisplayString, createVNode, createBlock, createCommentVNode, openBlock, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderStyle } from "vue/server-renderer";
import { usePage, useForm } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./GuestLayout-CGR_ETdc.js";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import Button from "primevue/button";
import { u as useCountries } from "./useCountries-DisC8OA1.js";
import "primevue/card";
import "./ApplicationLogo-rkFqmqnV.js";
const _sfc_main = {
  __name: "Login",
  __ssrInlineRender: true,
  props: {
    canResetPassword: {
      type: Boolean
    },
    status: {
      type: String
    }
  },
  setup(__props) {
    var _a;
    const page = usePage();
    const { countries } = useCountries();
    const allowRegistration = (_a = page.props.config) == null ? void 0 : _a.allow_registration;
    const emailInput = useTemplateRef("email-input");
    const form = useForm({
      email: "",
      password: "",
      remember: false
    });
    const submit = () => {
      form.post(route("login"), {
        onFinish: () => form.reset("password")
      });
    };
    const showRequestModal = ref(false);
    const requestForm = useForm({
      name: "",
      company_name: "",
      email: "",
      phone: "",
      vat_number: "",
      address: "",
      city: "",
      postal_code: "",
      message: "",
      country_object: null,
      // Binds to the dropdown object
      country: ""
      // Binds to the string code (sent to backend)
    });
    const onCountryChange = () => {
      var _a2;
      requestForm.country = ((_a2 = requestForm.country_object) == null ? void 0 : _a2.code) || "";
    };
    const submitRequest = () => {
      requestForm.post(route("access.request"), {
        onSuccess: () => {
          showRequestModal.value = false;
          requestForm.reset();
        }
      });
    };
    onMounted(() => {
      emailInput.value.$el.focus();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_InertiaHead = resolveComponent("InertiaHead");
      const _component_Message = Message;
      const _component_Checkbox = Checkbox;
      const _component_InertiaLink = resolveComponent("InertiaLink");
      _push(ssrRenderComponent(_sfc_main$1, _attrs, createSlots({
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d;
          if (_push2) {
            _push2(ssrRenderComponent(_component_InertiaHead, { title: "Log in" }, null, _parent2, _scopeId));
            _push2(`<form class="space-y-6"${_scopeId}><div class="flex flex-col gap-2"${_scopeId}><label for="email"${_scopeId}>Email</label>`);
            _push2(ssrRenderComponent(unref(InputText), {
              id: "email",
              ref: "email-input",
              modelValue: unref(form).email,
              "onUpdate:modelValue": ($event) => unref(form).email = $event,
              type: "email",
              required: "",
              fluid: "",
              invalid: Boolean(unref(form).errors.email),
              autocomplete: "username"
            }, null, _parent2, _scopeId));
            if ((_a2 = unref(form).errors) == null ? void 0 : _a2.email) {
              _push2(ssrRenderComponent(_component_Message, {
                severity: "error",
                variant: "simple",
                size: "small"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a3, _b2;
                  if (_push3) {
                    _push3(`${ssrInterpolate((_a3 = unref(form).errors) == null ? void 0 : _a3.email)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString((_b2 = unref(form).errors) == null ? void 0 : _b2.email), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col gap-2"${_scopeId}><label for="password"${_scopeId}>Password</label>`);
            _push2(ssrRenderComponent(unref(InputText), {
              id: "password",
              modelValue: unref(form).password,
              "onUpdate:modelValue": ($event) => unref(form).password = $event,
              type: "password",
              required: "",
              fluid: "",
              invalid: Boolean(unref(form).errors.password),
              autocomplete: "current-password"
            }, null, _parent2, _scopeId));
            if ((_b = unref(form).errors) == null ? void 0 : _b.password) {
              _push2(ssrRenderComponent(_component_Message, {
                severity: "error",
                variant: "simple",
                size: "small"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a3, _b2;
                  if (_push3) {
                    _push3(`${ssrInterpolate((_a3 = unref(form).errors) == null ? void 0 : _a3.password)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString((_b2 = unref(form).errors) == null ? void 0 : _b2.password), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Checkbox, {
              id: "remember",
              modelValue: unref(form).remember,
              "onUpdate:modelValue": ($event) => unref(form).remember = $event,
              class: "mr-2",
              binary: true
            }, null, _parent2, _scopeId));
            _push2(`<label for="remember"${_scopeId}>Remember me</label></div></div></div><div class="flex justify-end items-center pt-2"${_scopeId}>`);
            if (__props.canResetPassword) {
              _push2(ssrRenderComponent(_component_InertiaLink, {
                href: _ctx.route("password.request"),
                class: "mr-4 underline text-muted-color hover:text-color"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Forgot your password? `);
                  } else {
                    return [
                      createTextVNode(" Forgot your password? ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(Button), {
              loading: unref(form).processing,
              type: "submit",
              label: "Log In"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex justify-end items-center pt-2"${_scopeId}>`);
            if (unref(allowRegistration)) {
              _push2(ssrRenderComponent(_component_InertiaLink, {
                href: _ctx.route("register"),
                class: "underline text-muted-color hover:text-color"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Or create an account `);
                  } else {
                    return [
                      createTextVNode(" Or create an account ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<div class="text-lg text-gray-600"${_scopeId}><span${_scopeId}>New B2B Customer? </span><button type="button" class="underline text-muted-color hover:text-color cursor-pointer"${_scopeId}> Request Access </button></div>`);
            }
            _push2(ssrRenderComponent(unref(Dialog), {
              visible: showRequestModal.value,
              "onUpdate:visible": ($event) => showRequestModal.value = $event,
              modal: "",
              header: "Request B2B Access",
              style: { width: "90vw", maxWidth: "500px" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p class="text-gray-600 mb-4 text-sm"${_scopeId2}> Please fill in your company details. Our team will review your request and create an account for you. </p><form class="flex flex-col gap-3"${_scopeId2}><div class="flex flex-col gap-1"${_scopeId2}><label class="font-medium text-sm"${_scopeId2}>Company Name</label>`);
                  _push3(ssrRenderComponent(unref(InputText), {
                    modelValue: unref(requestForm).company_name,
                    "onUpdate:modelValue": ($event) => unref(requestForm).company_name = $event,
                    class: ["w-full", { "p-invalid": unref(requestForm).errors.company_name }]
                  }, null, _parent3, _scopeId2));
                  if (unref(requestForm).errors.company_name) {
                    _push3(`<small class="text-red-500"${_scopeId2}>${ssrInterpolate(unref(requestForm).errors.company_name)}</small>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="flex flex-col gap-1"${_scopeId2}><label class="font-medium text-sm"${_scopeId2}>Address</label>`);
                  _push3(ssrRenderComponent(unref(InputText), {
                    modelValue: unref(requestForm).address,
                    "onUpdate:modelValue": ($event) => unref(requestForm).address = $event,
                    class: ["w-full", { "p-invalid": unref(requestForm).errors.address }]
                  }, null, _parent3, _scopeId2));
                  if (unref(requestForm).errors.address) {
                    _push3(`<small class="text-red-500"${_scopeId2}>${ssrInterpolate(unref(requestForm).errors.address)}</small>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="flex gap-3"${_scopeId2}><div class="flex flex-col gap-1 flex-1"${_scopeId2}><label class="font-medium text-sm"${_scopeId2}>City</label>`);
                  _push3(ssrRenderComponent(unref(InputText), {
                    modelValue: unref(requestForm).city,
                    "onUpdate:modelValue": ($event) => unref(requestForm).city = $event,
                    class: ["w-full", { "p-invalid": unref(requestForm).errors.city }]
                  }, null, _parent3, _scopeId2));
                  if (unref(requestForm).errors.city) {
                    _push3(`<small class="text-red-500"${_scopeId2}>${ssrInterpolate(unref(requestForm).errors.city)}</small>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="flex flex-col gap-1 w-1/3"${_scopeId2}><label class="font-medium text-sm"${_scopeId2}>Postal Code</label>`);
                  _push3(ssrRenderComponent(unref(InputText), {
                    modelValue: unref(requestForm).postal_code,
                    "onUpdate:modelValue": ($event) => unref(requestForm).postal_code = $event,
                    class: ["w-full", { "p-invalid": unref(requestForm).errors.postal_code }]
                  }, null, _parent3, _scopeId2));
                  if (unref(requestForm).errors.postal_code) {
                    _push3(`<small class="text-red-500"${_scopeId2}>${ssrInterpolate(unref(requestForm).errors.postal_code)}</small>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div></div><div class="flex flex-col gap-1"${_scopeId2}><label for="reqCountry" class="font-medium text-sm"${_scopeId2}>Country</label>`);
                  _push3(ssrRenderComponent(unref(Select), {
                    inputId: "reqCountry",
                    modelValue: unref(requestForm).country_object,
                    "onUpdate:modelValue": ($event) => unref(requestForm).country_object = $event,
                    options: unref(countries),
                    filter: "",
                    optionLabel: "name",
                    placeholder: "Select a country",
                    class: [{ "p-invalid": unref(requestForm).errors.country }, "w-full"],
                    onChange: onCountryChange,
                    dataKey: "code"
                  }, {
                    value: withCtx((slotProps, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (slotProps.value) {
                          _push4(`<div class="flex items-center"${_scopeId3}>`);
                          if (slotProps.value.code) {
                            _push4(`<span class="${ssrRenderClass(`fi fi-${slotProps.value.code.toLowerCase()} mr-2 rounded-sm`)}" style="${ssrRenderStyle({ "font-size": "1.2rem" })}"${_scopeId3}></span>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`<div${_scopeId3}>${ssrInterpolate(slotProps.value.name)}</div></div>`);
                        } else {
                          _push4(`<span${_scopeId3}>${ssrInterpolate(slotProps.placeholder)}</span>`);
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
                    option: withCtx((slotProps, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex items-center"${_scopeId3}>`);
                        if (slotProps.option.code) {
                          _push4(`<span class="${ssrRenderClass(`fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`)}" style="${ssrRenderStyle({ "font-size": "1.2rem" })}"${_scopeId3}></span>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`<div${_scopeId3}>${ssrInterpolate(slotProps.option.name)}</div></div>`);
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
                  }, _parent3, _scopeId2));
                  if (unref(requestForm).errors.country) {
                    _push3(`<small class="text-red-500"${_scopeId2}>${ssrInterpolate(unref(requestForm).errors.country)}</small>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="flex flex-col gap-1"${_scopeId2}><label class="font-medium text-sm"${_scopeId2}>Contact Person</label>`);
                  _push3(ssrRenderComponent(unref(InputText), {
                    modelValue: unref(requestForm).name,
                    "onUpdate:modelValue": ($event) => unref(requestForm).name = $event,
                    class: ["w-full", { "p-invalid": unref(requestForm).errors.name }]
                  }, null, _parent3, _scopeId2));
                  if (unref(requestForm).errors.name) {
                    _push3(`<small class="text-red-500"${_scopeId2}>${ssrInterpolate(unref(requestForm).errors.name)}</small>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="flex flex-col gap-1"${_scopeId2}><label class="font-medium text-sm"${_scopeId2}>Email</label>`);
                  _push3(ssrRenderComponent(unref(InputText), {
                    type: "email",
                    modelValue: unref(requestForm).email,
                    "onUpdate:modelValue": ($event) => unref(requestForm).email = $event,
                    class: ["w-full", { "p-invalid": unref(requestForm).errors.email }]
                  }, null, _parent3, _scopeId2));
                  if (unref(requestForm).errors.email) {
                    _push3(`<small class="text-red-500"${_scopeId2}>${ssrInterpolate(unref(requestForm).errors.email)}</small>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="flex flex-col gap-1"${_scopeId2}><label class="font-medium text-sm"${_scopeId2}>Phone</label>`);
                  _push3(ssrRenderComponent(unref(InputText), {
                    modelValue: unref(requestForm).phone,
                    "onUpdate:modelValue": ($event) => unref(requestForm).phone = $event,
                    class: ["w-full", { "p-invalid": unref(requestForm).errors.phone }]
                  }, null, _parent3, _scopeId2));
                  if (unref(requestForm).errors.phone) {
                    _push3(`<small class="text-red-500"${_scopeId2}>${ssrInterpolate(unref(requestForm).errors.phone)}</small>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="flex flex-col gap-1"${_scopeId2}><label class="font-medium text-sm"${_scopeId2}>VAT Number</label>`);
                  _push3(ssrRenderComponent(unref(InputText), {
                    modelValue: unref(requestForm).vat_number,
                    "onUpdate:modelValue": ($event) => unref(requestForm).vat_number = $event,
                    class: ["w-full", { "p-invalid": unref(requestForm).errors.vat_number }]
                  }, null, _parent3, _scopeId2));
                  if (unref(requestForm).errors.vat_number) {
                    _push3(`<small class="text-red-500"${_scopeId2}>${ssrInterpolate(unref(requestForm).errors.vat_number)}</small>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="flex flex-col gap-1"${_scopeId2}><label class="font-medium text-sm"${_scopeId2}>Message / Details</label>`);
                  _push3(ssrRenderComponent(unref(Textarea), {
                    modelValue: unref(requestForm).message,
                    "onUpdate:modelValue": ($event) => unref(requestForm).message = $event,
                    rows: "3",
                    class: "w-full",
                    placeholder: "Any additional details..."
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="flex justify-end gap-2 mt-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Button), {
                    label: "Cancel",
                    text: "",
                    severity: "secondary",
                    onClick: ($event) => showRequestModal.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Button), {
                    label: "Send Request",
                    type: "submit",
                    loading: unref(requestForm).processing
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode("p", { class: "text-gray-600 mb-4 text-sm" }, " Please fill in your company details. Our team will review your request and create an account for you. "),
                    createVNode("form", {
                      onSubmit: withModifiers(submitRequest, ["prevent"]),
                      class: "flex flex-col gap-3"
                    }, [
                      createVNode("div", { class: "flex flex-col gap-1" }, [
                        createVNode("label", { class: "font-medium text-sm" }, "Company Name"),
                        createVNode(unref(InputText), {
                          modelValue: unref(requestForm).company_name,
                          "onUpdate:modelValue": ($event) => unref(requestForm).company_name = $event,
                          class: ["w-full", { "p-invalid": unref(requestForm).errors.company_name }]
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        unref(requestForm).errors.company_name ? (openBlock(), createBlock("small", {
                          key: 0,
                          class: "text-red-500"
                        }, toDisplayString(unref(requestForm).errors.company_name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex flex-col gap-1" }, [
                        createVNode("label", { class: "font-medium text-sm" }, "Address"),
                        createVNode(unref(InputText), {
                          modelValue: unref(requestForm).address,
                          "onUpdate:modelValue": ($event) => unref(requestForm).address = $event,
                          class: ["w-full", { "p-invalid": unref(requestForm).errors.address }]
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        unref(requestForm).errors.address ? (openBlock(), createBlock("small", {
                          key: 0,
                          class: "text-red-500"
                        }, toDisplayString(unref(requestForm).errors.address), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex gap-3" }, [
                        createVNode("div", { class: "flex flex-col gap-1 flex-1" }, [
                          createVNode("label", { class: "font-medium text-sm" }, "City"),
                          createVNode(unref(InputText), {
                            modelValue: unref(requestForm).city,
                            "onUpdate:modelValue": ($event) => unref(requestForm).city = $event,
                            class: ["w-full", { "p-invalid": unref(requestForm).errors.city }]
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                          unref(requestForm).errors.city ? (openBlock(), createBlock("small", {
                            key: 0,
                            class: "text-red-500"
                          }, toDisplayString(unref(requestForm).errors.city), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex flex-col gap-1 w-1/3" }, [
                          createVNode("label", { class: "font-medium text-sm" }, "Postal Code"),
                          createVNode(unref(InputText), {
                            modelValue: unref(requestForm).postal_code,
                            "onUpdate:modelValue": ($event) => unref(requestForm).postal_code = $event,
                            class: ["w-full", { "p-invalid": unref(requestForm).errors.postal_code }]
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                          unref(requestForm).errors.postal_code ? (openBlock(), createBlock("small", {
                            key: 0,
                            class: "text-red-500"
                          }, toDisplayString(unref(requestForm).errors.postal_code), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("div", { class: "flex flex-col gap-1" }, [
                        createVNode("label", {
                          for: "reqCountry",
                          class: "font-medium text-sm"
                        }, "Country"),
                        createVNode(unref(Select), {
                          inputId: "reqCountry",
                          modelValue: unref(requestForm).country_object,
                          "onUpdate:modelValue": ($event) => unref(requestForm).country_object = $event,
                          options: unref(countries),
                          filter: "",
                          optionLabel: "name",
                          placeholder: "Select a country",
                          class: [{ "p-invalid": unref(requestForm).errors.country }, "w-full"],
                          onChange: onCountryChange,
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
                              }, null, 2)) : createCommentVNode("", true),
                              createVNode("div", null, toDisplayString(slotProps.value.name), 1)
                            ])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(slotProps.placeholder), 1))
                          ]),
                          option: withCtx((slotProps) => [
                            createVNode("div", { class: "flex items-center" }, [
                              slotProps.option.code ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: `fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`,
                                style: { "font-size": "1.2rem" }
                              }, null, 2)) : createCommentVNode("", true),
                              createVNode("div", null, toDisplayString(slotProps.option.name), 1)
                            ])
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue", "options", "class"]),
                        unref(requestForm).errors.country ? (openBlock(), createBlock("small", {
                          key: 0,
                          class: "text-red-500"
                        }, toDisplayString(unref(requestForm).errors.country), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex flex-col gap-1" }, [
                        createVNode("label", { class: "font-medium text-sm" }, "Contact Person"),
                        createVNode(unref(InputText), {
                          modelValue: unref(requestForm).name,
                          "onUpdate:modelValue": ($event) => unref(requestForm).name = $event,
                          class: ["w-full", { "p-invalid": unref(requestForm).errors.name }]
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        unref(requestForm).errors.name ? (openBlock(), createBlock("small", {
                          key: 0,
                          class: "text-red-500"
                        }, toDisplayString(unref(requestForm).errors.name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex flex-col gap-1" }, [
                        createVNode("label", { class: "font-medium text-sm" }, "Email"),
                        createVNode(unref(InputText), {
                          type: "email",
                          modelValue: unref(requestForm).email,
                          "onUpdate:modelValue": ($event) => unref(requestForm).email = $event,
                          class: ["w-full", { "p-invalid": unref(requestForm).errors.email }]
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        unref(requestForm).errors.email ? (openBlock(), createBlock("small", {
                          key: 0,
                          class: "text-red-500"
                        }, toDisplayString(unref(requestForm).errors.email), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex flex-col gap-1" }, [
                        createVNode("label", { class: "font-medium text-sm" }, "Phone"),
                        createVNode(unref(InputText), {
                          modelValue: unref(requestForm).phone,
                          "onUpdate:modelValue": ($event) => unref(requestForm).phone = $event,
                          class: ["w-full", { "p-invalid": unref(requestForm).errors.phone }]
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        unref(requestForm).errors.phone ? (openBlock(), createBlock("small", {
                          key: 0,
                          class: "text-red-500"
                        }, toDisplayString(unref(requestForm).errors.phone), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex flex-col gap-1" }, [
                        createVNode("label", { class: "font-medium text-sm" }, "VAT Number"),
                        createVNode(unref(InputText), {
                          modelValue: unref(requestForm).vat_number,
                          "onUpdate:modelValue": ($event) => unref(requestForm).vat_number = $event,
                          class: ["w-full", { "p-invalid": unref(requestForm).errors.vat_number }]
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        unref(requestForm).errors.vat_number ? (openBlock(), createBlock("small", {
                          key: 0,
                          class: "text-red-500"
                        }, toDisplayString(unref(requestForm).errors.vat_number), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex flex-col gap-1" }, [
                        createVNode("label", { class: "font-medium text-sm" }, "Message / Details"),
                        createVNode(unref(Textarea), {
                          modelValue: unref(requestForm).message,
                          "onUpdate:modelValue": ($event) => unref(requestForm).message = $event,
                          rows: "3",
                          class: "w-full",
                          placeholder: "Any additional details..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "flex justify-end gap-2 mt-2" }, [
                        createVNode(unref(Button), {
                          label: "Cancel",
                          text: "",
                          severity: "secondary",
                          onClick: ($event) => showRequestModal.value = false
                        }, null, 8, ["onClick"]),
                        createVNode(unref(Button), {
                          label: "Send Request",
                          type: "submit",
                          loading: unref(requestForm).processing
                        }, null, 8, ["loading"])
                      ])
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode(_component_InertiaHead, { title: "Log in" }),
              createVNode("form", {
                class: "space-y-6",
                onSubmit: withModifiers(submit, ["prevent"])
              }, [
                createVNode("div", { class: "flex flex-col gap-2" }, [
                  createVNode("label", { for: "email" }, "Email"),
                  createVNode(unref(InputText), {
                    id: "email",
                    ref: "email-input",
                    modelValue: unref(form).email,
                    "onUpdate:modelValue": ($event) => unref(form).email = $event,
                    type: "email",
                    required: "",
                    fluid: "",
                    invalid: Boolean(unref(form).errors.email),
                    autocomplete: "username"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"]),
                  ((_c = unref(form).errors) == null ? void 0 : _c.email) ? (openBlock(), createBlock(_component_Message, {
                    key: 0,
                    severity: "error",
                    variant: "simple",
                    size: "small"
                  }, {
                    default: withCtx(() => {
                      var _a3;
                      return [
                        createTextVNode(toDisplayString((_a3 = unref(form).errors) == null ? void 0 : _a3.email), 1)
                      ];
                    }),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "flex flex-col gap-2" }, [
                  createVNode("label", { for: "password" }, "Password"),
                  createVNode(unref(InputText), {
                    id: "password",
                    modelValue: unref(form).password,
                    "onUpdate:modelValue": ($event) => unref(form).password = $event,
                    type: "password",
                    required: "",
                    fluid: "",
                    invalid: Boolean(unref(form).errors.password),
                    autocomplete: "current-password"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"]),
                  ((_d = unref(form).errors) == null ? void 0 : _d.password) ? (openBlock(), createBlock(_component_Message, {
                    key: 0,
                    severity: "error",
                    variant: "simple",
                    size: "small"
                  }, {
                    default: withCtx(() => {
                      var _a3;
                      return [
                        createTextVNode(toDisplayString((_a3 = unref(form).errors) == null ? void 0 : _a3.password), 1)
                      ];
                    }),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                createVNode("div", null, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("div", { class: "flex items-center" }, [
                      createVNode(_component_Checkbox, {
                        id: "remember",
                        modelValue: unref(form).remember,
                        "onUpdate:modelValue": ($event) => unref(form).remember = $event,
                        class: "mr-2",
                        binary: true
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode("label", { for: "remember" }, "Remember me")
                    ])
                  ])
                ]),
                createVNode("div", { class: "flex justify-end items-center pt-2" }, [
                  __props.canResetPassword ? (openBlock(), createBlock(_component_InertiaLink, {
                    key: 0,
                    href: _ctx.route("password.request"),
                    class: "mr-4 underline text-muted-color hover:text-color"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Forgot your password? ")
                    ]),
                    _: 1
                  }, 8, ["href"])) : createCommentVNode("", true),
                  createVNode(unref(Button), {
                    loading: unref(form).processing,
                    type: "submit",
                    label: "Log In"
                  }, null, 8, ["loading"])
                ]),
                createVNode("div", { class: "flex justify-end items-center pt-2" }, [
                  unref(allowRegistration) ? (openBlock(), createBlock(_component_InertiaLink, {
                    key: 0,
                    href: _ctx.route("register"),
                    class: "underline text-muted-color hover:text-color"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Or create an account ")
                    ]),
                    _: 1
                  }, 8, ["href"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-lg text-gray-600"
                  }, [
                    createVNode("span", null, "New B2B Customer? "),
                    createVNode("button", {
                      type: "button",
                      onClick: ($event) => showRequestModal.value = true,
                      class: "underline text-muted-color hover:text-color cursor-pointer"
                    }, " Request Access ", 8, ["onClick"])
                  ])),
                  createVNode(unref(Dialog), {
                    visible: showRequestModal.value,
                    "onUpdate:visible": ($event) => showRequestModal.value = $event,
                    modal: "",
                    header: "Request B2B Access",
                    style: { width: "90vw", maxWidth: "500px" }
                  }, {
                    default: withCtx(() => [
                      createVNode("p", { class: "text-gray-600 mb-4 text-sm" }, " Please fill in your company details. Our team will review your request and create an account for you. "),
                      createVNode("form", {
                        onSubmit: withModifiers(submitRequest, ["prevent"]),
                        class: "flex flex-col gap-3"
                      }, [
                        createVNode("div", { class: "flex flex-col gap-1" }, [
                          createVNode("label", { class: "font-medium text-sm" }, "Company Name"),
                          createVNode(unref(InputText), {
                            modelValue: unref(requestForm).company_name,
                            "onUpdate:modelValue": ($event) => unref(requestForm).company_name = $event,
                            class: ["w-full", { "p-invalid": unref(requestForm).errors.company_name }]
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                          unref(requestForm).errors.company_name ? (openBlock(), createBlock("small", {
                            key: 0,
                            class: "text-red-500"
                          }, toDisplayString(unref(requestForm).errors.company_name), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex flex-col gap-1" }, [
                          createVNode("label", { class: "font-medium text-sm" }, "Address"),
                          createVNode(unref(InputText), {
                            modelValue: unref(requestForm).address,
                            "onUpdate:modelValue": ($event) => unref(requestForm).address = $event,
                            class: ["w-full", { "p-invalid": unref(requestForm).errors.address }]
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                          unref(requestForm).errors.address ? (openBlock(), createBlock("small", {
                            key: 0,
                            class: "text-red-500"
                          }, toDisplayString(unref(requestForm).errors.address), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex gap-3" }, [
                          createVNode("div", { class: "flex flex-col gap-1 flex-1" }, [
                            createVNode("label", { class: "font-medium text-sm" }, "City"),
                            createVNode(unref(InputText), {
                              modelValue: unref(requestForm).city,
                              "onUpdate:modelValue": ($event) => unref(requestForm).city = $event,
                              class: ["w-full", { "p-invalid": unref(requestForm).errors.city }]
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                            unref(requestForm).errors.city ? (openBlock(), createBlock("small", {
                              key: 0,
                              class: "text-red-500"
                            }, toDisplayString(unref(requestForm).errors.city), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "flex flex-col gap-1 w-1/3" }, [
                            createVNode("label", { class: "font-medium text-sm" }, "Postal Code"),
                            createVNode(unref(InputText), {
                              modelValue: unref(requestForm).postal_code,
                              "onUpdate:modelValue": ($event) => unref(requestForm).postal_code = $event,
                              class: ["w-full", { "p-invalid": unref(requestForm).errors.postal_code }]
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                            unref(requestForm).errors.postal_code ? (openBlock(), createBlock("small", {
                              key: 0,
                              class: "text-red-500"
                            }, toDisplayString(unref(requestForm).errors.postal_code), 1)) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("div", { class: "flex flex-col gap-1" }, [
                          createVNode("label", {
                            for: "reqCountry",
                            class: "font-medium text-sm"
                          }, "Country"),
                          createVNode(unref(Select), {
                            inputId: "reqCountry",
                            modelValue: unref(requestForm).country_object,
                            "onUpdate:modelValue": ($event) => unref(requestForm).country_object = $event,
                            options: unref(countries),
                            filter: "",
                            optionLabel: "name",
                            placeholder: "Select a country",
                            class: [{ "p-invalid": unref(requestForm).errors.country }, "w-full"],
                            onChange: onCountryChange,
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
                                }, null, 2)) : createCommentVNode("", true),
                                createVNode("div", null, toDisplayString(slotProps.value.name), 1)
                              ])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(slotProps.placeholder), 1))
                            ]),
                            option: withCtx((slotProps) => [
                              createVNode("div", { class: "flex items-center" }, [
                                slotProps.option.code ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: `fi fi-${slotProps.option.code.toLowerCase()} mr-2 rounded-sm`,
                                  style: { "font-size": "1.2rem" }
                                }, null, 2)) : createCommentVNode("", true),
                                createVNode("div", null, toDisplayString(slotProps.option.name), 1)
                              ])
                            ]),
                            _: 1
                          }, 8, ["modelValue", "onUpdate:modelValue", "options", "class"]),
                          unref(requestForm).errors.country ? (openBlock(), createBlock("small", {
                            key: 0,
                            class: "text-red-500"
                          }, toDisplayString(unref(requestForm).errors.country), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex flex-col gap-1" }, [
                          createVNode("label", { class: "font-medium text-sm" }, "Contact Person"),
                          createVNode(unref(InputText), {
                            modelValue: unref(requestForm).name,
                            "onUpdate:modelValue": ($event) => unref(requestForm).name = $event,
                            class: ["w-full", { "p-invalid": unref(requestForm).errors.name }]
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                          unref(requestForm).errors.name ? (openBlock(), createBlock("small", {
                            key: 0,
                            class: "text-red-500"
                          }, toDisplayString(unref(requestForm).errors.name), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex flex-col gap-1" }, [
                          createVNode("label", { class: "font-medium text-sm" }, "Email"),
                          createVNode(unref(InputText), {
                            type: "email",
                            modelValue: unref(requestForm).email,
                            "onUpdate:modelValue": ($event) => unref(requestForm).email = $event,
                            class: ["w-full", { "p-invalid": unref(requestForm).errors.email }]
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                          unref(requestForm).errors.email ? (openBlock(), createBlock("small", {
                            key: 0,
                            class: "text-red-500"
                          }, toDisplayString(unref(requestForm).errors.email), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex flex-col gap-1" }, [
                          createVNode("label", { class: "font-medium text-sm" }, "Phone"),
                          createVNode(unref(InputText), {
                            modelValue: unref(requestForm).phone,
                            "onUpdate:modelValue": ($event) => unref(requestForm).phone = $event,
                            class: ["w-full", { "p-invalid": unref(requestForm).errors.phone }]
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                          unref(requestForm).errors.phone ? (openBlock(), createBlock("small", {
                            key: 0,
                            class: "text-red-500"
                          }, toDisplayString(unref(requestForm).errors.phone), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex flex-col gap-1" }, [
                          createVNode("label", { class: "font-medium text-sm" }, "VAT Number"),
                          createVNode(unref(InputText), {
                            modelValue: unref(requestForm).vat_number,
                            "onUpdate:modelValue": ($event) => unref(requestForm).vat_number = $event,
                            class: ["w-full", { "p-invalid": unref(requestForm).errors.vat_number }]
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                          unref(requestForm).errors.vat_number ? (openBlock(), createBlock("small", {
                            key: 0,
                            class: "text-red-500"
                          }, toDisplayString(unref(requestForm).errors.vat_number), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex flex-col gap-1" }, [
                          createVNode("label", { class: "font-medium text-sm" }, "Message / Details"),
                          createVNode(unref(Textarea), {
                            modelValue: unref(requestForm).message,
                            "onUpdate:modelValue": ($event) => unref(requestForm).message = $event,
                            rows: "3",
                            class: "w-full",
                            placeholder: "Any additional details..."
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", { class: "flex justify-end gap-2 mt-2" }, [
                          createVNode(unref(Button), {
                            label: "Cancel",
                            text: "",
                            severity: "secondary",
                            onClick: ($event) => showRequestModal.value = false
                          }, null, 8, ["onClick"]),
                          createVNode(unref(Button), {
                            label: "Send Request",
                            type: "submit",
                            loading: unref(requestForm).processing
                          }, null, 8, ["loading"])
                        ])
                      ], 32)
                    ]),
                    _: 1
                  }, 8, ["visible", "onUpdate:visible"])
                ])
              ], 32)
            ];
          }
        }),
        _: 2
      }, [
        __props.status ? {
          name: "message",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Message, {
                severity: "success",
                closable: false,
                class: "shadow-sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(__props.status)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(__props.status), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_Message, {
                  severity: "success",
                  closable: false,
                  class: "shadow-sm"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(__props.status), 1)
                  ]),
                  _: 1
                })
              ];
            }
          }),
          key: "0"
        } : void 0
      ]), _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/auth/Login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
