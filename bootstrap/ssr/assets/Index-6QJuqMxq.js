import { ref, withCtx, unref, createVNode, createTextVNode, toDisplayString, createBlock, createCommentVNode, withModifiers, openBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { useForm, Head, Link, router } from "@inertiajs/vue3";
import { A as AdminLayout } from "./AdminLayout-CbDljQzr.js";
import { a as _sfc_main$1 } from "../ssr.js";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Card from "primevue/card";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import "primevue/panelmenu";
import "./ApplicationLogo-rkFqmqnV.js";
import "primevue/toast";
import "primevue/usetoast";
import "primevue/drawer";
import "@inertiajs/vue3/server";
import "@vue/server-renderer";
import "primevue/config";
import "primevue/toastservice";
import "primevue/confirmationservice";
import "@primeuix/themes/aura";
import "@primeuix/themes";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    users: Object,
    filters: Object,
    userRoles: Array
  },
  setup(__props) {
    var _a, _b;
    const props = __props;
    const confirm = useConfirm();
    const filterForm = useForm({
      search: ((_a = props.filters) == null ? void 0 : _a.search) || null,
      role: ((_b = props.filters) == null ? void 0 : _b.role) || null
    });
    const roleOptions = ref(
      props.userRoles.map((role) => ({ label: role.charAt(0).toUpperCase() + role.slice(1), value: role }))
    );
    const applyFilters = () => {
      router.get(route("dashboard.users.index"), filterForm.data(), {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    };
    const clearFilters = () => {
      filterForm.reset();
      applyFilters();
    };
    const formatDate = (dateString) => {
      if (!dateString) return "";
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    };
    const getRoleSeverity = (role) => {
      if (role === "admin") return "danger";
      return "info";
    };
    const onPage = (event) => {
      router.get(route("dashboard.users.index"), {
        page: event.page + 1,
        search: filterForm.search,
        role: filterForm.role
      }, {
        preserveState: true,
        preserveScroll: false,
        replace: true
      });
    };
    const confirmDeleteUser = (user) => {
      confirm.require({
        group: "deleteUserConfirmation",
        message: `Are you sure you want to delete user "${user.name}"? This action cannot be undone.`,
        header: "Confirm Deletion",
        icon: "pi pi-exclamation-triangle",
        acceptClass: "p-button-danger",
        accept: () => {
          router.delete(route("dashboard.users.destroy", user.id), {
            preserveScroll: true,
            onSuccess: () => {
            },
            onError: (errors) => {
              console.error("Error deleting user:", errors);
            }
          });
        },
        reject: () => {
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AdminLayout, _attrs, {
        "header-title": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Manage Users`);
          } else {
            return [
              createTextVNode("Manage Users")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Admin - Users" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex justify-between items-center mb-6"${_scopeId2}><h1 class="text-2xl font-semibold"${_scopeId2}>Users</h1>`);
                  _push3(ssrRenderComponent(unref(Link), {
                    href: _ctx.route("dashboard.users.create")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Button), {
                          label: "Create User",
                          icon: "pi pi-plus"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Button), {
                            label: "Create User",
                            icon: "pi pi-plus"
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(unref(Card), { class: "mb-4" }, {
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<form class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4"${_scopeId3}><div${_scopeId3}><label for="search" class="block text-sm font-medium mb-1"${_scopeId3}>Search</label>`);
                        _push4(ssrRenderComponent(unref(InputText), {
                          modelValue: unref(filterForm).search,
                          "onUpdate:modelValue": ($event) => unref(filterForm).search = $event,
                          id: "search",
                          placeholder: "Name or Email",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div${_scopeId3}><label for="role" class="block text-sm font-medium mb-1"${_scopeId3}>Role</label>`);
                        _push4(ssrRenderComponent(unref(Select), {
                          modelValue: unref(filterForm).role,
                          "onUpdate:modelValue": ($event) => unref(filterForm).role = $event,
                          options: roleOptions.value,
                          optionLabel: "label",
                          optionValue: "value",
                          placeholder: "All Roles",
                          id: "role",
                          class: "w-full",
                          showClear: ""
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="flex space-x-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(Button), {
                          type: "submit",
                          label: "Filter",
                          icon: "pi pi-filter"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Button), {
                          type: "button",
                          label: "Clear",
                          icon: "pi pi-times",
                          outlined: "",
                          onClick: clearFilters
                        }, null, _parent4, _scopeId3));
                        _push4(`</div></form>`);
                        _push4(ssrRenderComponent(unref(DataTable), {
                          value: __props.users.data,
                          responsiveLayout: "scroll",
                          paginator: "",
                          rows: __props.users.per_page,
                          totalRecords: __props.users.total,
                          onPage
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Column), {
                                field: "name",
                                header: "Name",
                                sortable: ""
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Column), {
                                field: "email",
                                header: "Email",
                                sortable: ""
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Column), {
                                field: "role",
                                header: "Role",
                                sortable: ""
                              }, {
                                body: withCtx((slotProps, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(Tag), {
                                      value: slotProps.data.role,
                                      severity: getRoleSeverity(slotProps.data.role),
                                      class: "capitalize"
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(Tag), {
                                        value: slotProps.data.role,
                                        severity: getRoleSeverity(slotProps.data.role),
                                        class: "capitalize"
                                      }, null, 8, ["value", "severity"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Column), {
                                field: "created_at",
                                header: "Joined",
                                sortable: ""
                              }, {
                                body: withCtx((slotProps, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(formatDate(slotProps.data.created_at))}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(formatDate(slotProps.data.created_at)), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Column), { header: "Actions" }, {
                                body: withCtx((slotProps, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(Link), {
                                      href: _ctx.route("dashboard.users.edit", slotProps.data.id)
                                    }, {
                                      default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(Button), {
                                            icon: "pi pi-pencil",
                                            class: "p-button-sm p-button-text p-button-info mr-2"
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(unref(Button), {
                                              icon: "pi pi-pencil",
                                              class: "p-button-sm p-button-text p-button-info mr-2"
                                            })
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(Button), {
                                      icon: "pi pi-trash",
                                      class: "p-button-sm p-button-text p-button-danger",
                                      onClick: ($event) => confirmDeleteUser(slotProps.data)
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(Link), {
                                        href: _ctx.route("dashboard.users.edit", slotProps.data.id)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Button), {
                                            icon: "pi pi-pencil",
                                            class: "p-button-sm p-button-text p-button-info mr-2"
                                          })
                                        ]),
                                        _: 2
                                      }, 1032, ["href"]),
                                      createVNode(unref(Button), {
                                        icon: "pi pi-trash",
                                        class: "p-button-sm p-button-text p-button-danger",
                                        onClick: ($event) => confirmDeleteUser(slotProps.data)
                                      }, null, 8, ["onClick"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Column), {
                                  field: "name",
                                  header: "Name",
                                  sortable: ""
                                }),
                                createVNode(unref(Column), {
                                  field: "email",
                                  header: "Email",
                                  sortable: ""
                                }),
                                createVNode(unref(Column), {
                                  field: "role",
                                  header: "Role",
                                  sortable: ""
                                }, {
                                  body: withCtx((slotProps) => [
                                    createVNode(unref(Tag), {
                                      value: slotProps.data.role,
                                      severity: getRoleSeverity(slotProps.data.role),
                                      class: "capitalize"
                                    }, null, 8, ["value", "severity"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(Column), {
                                  field: "created_at",
                                  header: "Joined",
                                  sortable: ""
                                }, {
                                  body: withCtx((slotProps) => [
                                    createTextVNode(toDisplayString(formatDate(slotProps.data.created_at)), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(Column), { header: "Actions" }, {
                                  body: withCtx((slotProps) => [
                                    createVNode(unref(Link), {
                                      href: _ctx.route("dashboard.users.edit", slotProps.data.id)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Button), {
                                          icon: "pi pi-pencil",
                                          class: "p-button-sm p-button-text p-button-info mr-2"
                                        })
                                      ]),
                                      _: 2
                                    }, 1032, ["href"]),
                                    createVNode(unref(Button), {
                                      icon: "pi pi-trash",
                                      class: "p-button-sm p-button-text p-button-danger",
                                      onClick: ($event) => confirmDeleteUser(slotProps.data)
                                    }, null, 8, ["onClick"])
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (__props.users.links.length > 3) {
                          _push4(`<div class="mt-4 flex justify-center space-x-1"${_scopeId3}><!--[-->`);
                          ssrRenderList(__props.users.links, (link, k) => {
                            _push4(ssrRenderComponent(unref(Link), {
                              key: k,
                              class: ["px-3 py-2 text-sm rounded-md", { "bg-primary-500 text-white": link.active, "hover:bg-gray-200 dark:hover:bg-gray-700": !link.active, "text-gray-400 cursor-not-allowed": !link.url }],
                              href: link.url || "#",
                              as: link.url ? "a" : "span",
                              "preserve-scroll": "",
                              "preserve-state": ""
                            }, null, _parent4, _scopeId3));
                          });
                          _push4(`<!--]--></div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          createVNode("form", {
                            onSubmit: withModifiers(applyFilters, ["prevent"]),
                            class: "grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4"
                          }, [
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "search",
                                class: "block text-sm font-medium mb-1"
                              }, "Search"),
                              createVNode(unref(InputText), {
                                modelValue: unref(filterForm).search,
                                "onUpdate:modelValue": ($event) => unref(filterForm).search = $event,
                                id: "search",
                                placeholder: "Name or Email",
                                class: "w-full"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "role",
                                class: "block text-sm font-medium mb-1"
                              }, "Role"),
                              createVNode(unref(Select), {
                                modelValue: unref(filterForm).role,
                                "onUpdate:modelValue": ($event) => unref(filterForm).role = $event,
                                options: roleOptions.value,
                                optionLabel: "label",
                                optionValue: "value",
                                placeholder: "All Roles",
                                id: "role",
                                class: "w-full",
                                showClear: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                            ]),
                            createVNode("div", { class: "flex space-x-2" }, [
                              createVNode(unref(Button), {
                                type: "submit",
                                label: "Filter",
                                icon: "pi pi-filter"
                              }),
                              createVNode(unref(Button), {
                                type: "button",
                                label: "Clear",
                                icon: "pi pi-times",
                                outlined: "",
                                onClick: clearFilters
                              })
                            ])
                          ], 32),
                          createVNode(unref(DataTable), {
                            value: __props.users.data,
                            responsiveLayout: "scroll",
                            paginator: "",
                            rows: __props.users.per_page,
                            totalRecords: __props.users.total,
                            onPage
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Column), {
                                field: "name",
                                header: "Name",
                                sortable: ""
                              }),
                              createVNode(unref(Column), {
                                field: "email",
                                header: "Email",
                                sortable: ""
                              }),
                              createVNode(unref(Column), {
                                field: "role",
                                header: "Role",
                                sortable: ""
                              }, {
                                body: withCtx((slotProps) => [
                                  createVNode(unref(Tag), {
                                    value: slotProps.data.role,
                                    severity: getRoleSeverity(slotProps.data.role),
                                    class: "capitalize"
                                  }, null, 8, ["value", "severity"])
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Column), {
                                field: "created_at",
                                header: "Joined",
                                sortable: ""
                              }, {
                                body: withCtx((slotProps) => [
                                  createTextVNode(toDisplayString(formatDate(slotProps.data.created_at)), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Column), { header: "Actions" }, {
                                body: withCtx((slotProps) => [
                                  createVNode(unref(Link), {
                                    href: _ctx.route("dashboard.users.edit", slotProps.data.id)
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Button), {
                                        icon: "pi pi-pencil",
                                        class: "p-button-sm p-button-text p-button-info mr-2"
                                      })
                                    ]),
                                    _: 2
                                  }, 1032, ["href"]),
                                  createVNode(unref(Button), {
                                    icon: "pi pi-trash",
                                    class: "p-button-sm p-button-text p-button-danger",
                                    onClick: ($event) => confirmDeleteUser(slotProps.data)
                                  }, null, 8, ["onClick"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["value", "rows", "totalRecords"]),
                          __props.users.links.length > 3 ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "mt-4 flex justify-center space-x-1"
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.users.links, (link, k) => {
                              return openBlock(), createBlock(unref(Link), {
                                key: k,
                                class: ["px-3 py-2 text-sm rounded-md", { "bg-primary-500 text-white": link.active, "hover:bg-gray-200 dark:hover:bg-gray-700": !link.active, "text-gray-400 cursor-not-allowed": !link.url }],
                                href: link.url || "#",
                                innerHTML: link.label,
                                as: link.url ? "a" : "span",
                                "preserve-scroll": "",
                                "preserve-state": ""
                              }, null, 8, ["class", "href", "innerHTML", "as"]);
                            }), 128))
                          ])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "flex justify-between items-center mb-6" }, [
                      createVNode("h1", { class: "text-2xl font-semibold" }, "Users"),
                      createVNode(unref(Link), {
                        href: _ctx.route("dashboard.users.create")
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Button), {
                            label: "Create User",
                            icon: "pi pi-plus"
                          })
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ]),
                    createVNode(unref(Card), { class: "mb-4" }, {
                      content: withCtx(() => [
                        createVNode("form", {
                          onSubmit: withModifiers(applyFilters, ["prevent"]),
                          class: "grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4"
                        }, [
                          createVNode("div", null, [
                            createVNode("label", {
                              for: "search",
                              class: "block text-sm font-medium mb-1"
                            }, "Search"),
                            createVNode(unref(InputText), {
                              modelValue: unref(filterForm).search,
                              "onUpdate:modelValue": ($event) => unref(filterForm).search = $event,
                              id: "search",
                              placeholder: "Name or Email",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", {
                              for: "role",
                              class: "block text-sm font-medium mb-1"
                            }, "Role"),
                            createVNode(unref(Select), {
                              modelValue: unref(filterForm).role,
                              "onUpdate:modelValue": ($event) => unref(filterForm).role = $event,
                              options: roleOptions.value,
                              optionLabel: "label",
                              optionValue: "value",
                              placeholder: "All Roles",
                              id: "role",
                              class: "w-full",
                              showClear: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                          ]),
                          createVNode("div", { class: "flex space-x-2" }, [
                            createVNode(unref(Button), {
                              type: "submit",
                              label: "Filter",
                              icon: "pi pi-filter"
                            }),
                            createVNode(unref(Button), {
                              type: "button",
                              label: "Clear",
                              icon: "pi pi-times",
                              outlined: "",
                              onClick: clearFilters
                            })
                          ])
                        ], 32),
                        createVNode(unref(DataTable), {
                          value: __props.users.data,
                          responsiveLayout: "scroll",
                          paginator: "",
                          rows: __props.users.per_page,
                          totalRecords: __props.users.total,
                          onPage
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Column), {
                              field: "name",
                              header: "Name",
                              sortable: ""
                            }),
                            createVNode(unref(Column), {
                              field: "email",
                              header: "Email",
                              sortable: ""
                            }),
                            createVNode(unref(Column), {
                              field: "role",
                              header: "Role",
                              sortable: ""
                            }, {
                              body: withCtx((slotProps) => [
                                createVNode(unref(Tag), {
                                  value: slotProps.data.role,
                                  severity: getRoleSeverity(slotProps.data.role),
                                  class: "capitalize"
                                }, null, 8, ["value", "severity"])
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Column), {
                              field: "created_at",
                              header: "Joined",
                              sortable: ""
                            }, {
                              body: withCtx((slotProps) => [
                                createTextVNode(toDisplayString(formatDate(slotProps.data.created_at)), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Column), { header: "Actions" }, {
                              body: withCtx((slotProps) => [
                                createVNode(unref(Link), {
                                  href: _ctx.route("dashboard.users.edit", slotProps.data.id)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Button), {
                                      icon: "pi pi-pencil",
                                      class: "p-button-sm p-button-text p-button-info mr-2"
                                    })
                                  ]),
                                  _: 2
                                }, 1032, ["href"]),
                                createVNode(unref(Button), {
                                  icon: "pi pi-trash",
                                  class: "p-button-sm p-button-text p-button-danger",
                                  onClick: ($event) => confirmDeleteUser(slotProps.data)
                                }, null, 8, ["onClick"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["value", "rows", "totalRecords"]),
                        __props.users.links.length > 3 ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-4 flex justify-center space-x-1"
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.users.links, (link, k) => {
                            return openBlock(), createBlock(unref(Link), {
                              key: k,
                              class: ["px-3 py-2 text-sm rounded-md", { "bg-primary-500 text-white": link.active, "hover:bg-gray-200 dark:hover:bg-gray-700": !link.active, "text-gray-400 cursor-not-allowed": !link.url }],
                              href: link.url || "#",
                              innerHTML: link.label,
                              as: link.url ? "a" : "span",
                              "preserve-scroll": "",
                              "preserve-state": ""
                            }, null, 8, ["class", "href", "innerHTML", "as"]);
                          }), 128))
                        ])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(ConfirmDialog), { group: "deleteUserConfirmation" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Head), { title: "Admin - Users" }),
              createVNode(_sfc_main$1, null, {
                default: withCtx(() => [
                  createVNode("div", { class: "flex justify-between items-center mb-6" }, [
                    createVNode("h1", { class: "text-2xl font-semibold" }, "Users"),
                    createVNode(unref(Link), {
                      href: _ctx.route("dashboard.users.create")
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Button), {
                          label: "Create User",
                          icon: "pi pi-plus"
                        })
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ]),
                  createVNode(unref(Card), { class: "mb-4" }, {
                    content: withCtx(() => [
                      createVNode("form", {
                        onSubmit: withModifiers(applyFilters, ["prevent"]),
                        class: "grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4"
                      }, [
                        createVNode("div", null, [
                          createVNode("label", {
                            for: "search",
                            class: "block text-sm font-medium mb-1"
                          }, "Search"),
                          createVNode(unref(InputText), {
                            modelValue: unref(filterForm).search,
                            "onUpdate:modelValue": ($event) => unref(filterForm).search = $event,
                            id: "search",
                            placeholder: "Name or Email",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", null, [
                          createVNode("label", {
                            for: "role",
                            class: "block text-sm font-medium mb-1"
                          }, "Role"),
                          createVNode(unref(Select), {
                            modelValue: unref(filterForm).role,
                            "onUpdate:modelValue": ($event) => unref(filterForm).role = $event,
                            options: roleOptions.value,
                            optionLabel: "label",
                            optionValue: "value",
                            placeholder: "All Roles",
                            id: "role",
                            class: "w-full",
                            showClear: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                        ]),
                        createVNode("div", { class: "flex space-x-2" }, [
                          createVNode(unref(Button), {
                            type: "submit",
                            label: "Filter",
                            icon: "pi pi-filter"
                          }),
                          createVNode(unref(Button), {
                            type: "button",
                            label: "Clear",
                            icon: "pi pi-times",
                            outlined: "",
                            onClick: clearFilters
                          })
                        ])
                      ], 32),
                      createVNode(unref(DataTable), {
                        value: __props.users.data,
                        responsiveLayout: "scroll",
                        paginator: "",
                        rows: __props.users.per_page,
                        totalRecords: __props.users.total,
                        onPage
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Column), {
                            field: "name",
                            header: "Name",
                            sortable: ""
                          }),
                          createVNode(unref(Column), {
                            field: "email",
                            header: "Email",
                            sortable: ""
                          }),
                          createVNode(unref(Column), {
                            field: "role",
                            header: "Role",
                            sortable: ""
                          }, {
                            body: withCtx((slotProps) => [
                              createVNode(unref(Tag), {
                                value: slotProps.data.role,
                                severity: getRoleSeverity(slotProps.data.role),
                                class: "capitalize"
                              }, null, 8, ["value", "severity"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Column), {
                            field: "created_at",
                            header: "Joined",
                            sortable: ""
                          }, {
                            body: withCtx((slotProps) => [
                              createTextVNode(toDisplayString(formatDate(slotProps.data.created_at)), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Column), { header: "Actions" }, {
                            body: withCtx((slotProps) => [
                              createVNode(unref(Link), {
                                href: _ctx.route("dashboard.users.edit", slotProps.data.id)
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(Button), {
                                    icon: "pi pi-pencil",
                                    class: "p-button-sm p-button-text p-button-info mr-2"
                                  })
                                ]),
                                _: 2
                              }, 1032, ["href"]),
                              createVNode(unref(Button), {
                                icon: "pi pi-trash",
                                class: "p-button-sm p-button-text p-button-danger",
                                onClick: ($event) => confirmDeleteUser(slotProps.data)
                              }, null, 8, ["onClick"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["value", "rows", "totalRecords"]),
                      __props.users.links.length > 3 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "mt-4 flex justify-center space-x-1"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.users.links, (link, k) => {
                          return openBlock(), createBlock(unref(Link), {
                            key: k,
                            class: ["px-3 py-2 text-sm rounded-md", { "bg-primary-500 text-white": link.active, "hover:bg-gray-200 dark:hover:bg-gray-700": !link.active, "text-gray-400 cursor-not-allowed": !link.url }],
                            href: link.url || "#",
                            innerHTML: link.label,
                            as: link.url ? "a" : "span",
                            "preserve-scroll": "",
                            "preserve-state": ""
                          }, null, 8, ["class", "href", "innerHTML", "as"]);
                        }), 128))
                      ])) : createCommentVNode("", true)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(ConfirmDialog), { group: "deleteUserConfirmation" })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/dashboard/users/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
