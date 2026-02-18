import __unplugin_components_1 from "primevue/row";
import __unplugin_components_0 from "primevue/columngroup";
import { ref, computed, mergeProps, withCtx, unref, createTextVNode, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { useForm, Head, Link, router } from "@inertiajs/vue3";
import { A as AdminLayout } from "./AdminLayout-CbDljQzr.js";
import { a as _sfc_main$1, P as PageTitleSection } from "../ssr.js";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Card from "primevue/card";
import Tag from "primevue/tag";
import DatePicker from "primevue/datepicker";
import { saveAs } from "file-saver";
import axios from "axios";
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
    orders: Object,
    // Paginated order data from controller
    filters: Object
    // Applied filters (start_date, end_date)
  },
  setup(__props) {
    var _a, _b;
    const props = __props;
    const filterForm = useForm({
      start_date: ((_a = props.filters) == null ? void 0 : _a.start_date) || null,
      end_date: ((_b = props.filters) == null ? void 0 : _b.end_date) || null
    });
    const exporting = ref(null);
    const applyFilters = () => {
      const filterData = {};
      if (filterForm.start_date) {
        filterData.start_date = filterForm.start_date instanceof Date ? filterForm.start_date.toISOString().split("T")[0] : filterForm.start_date;
      }
      if (filterForm.end_date) {
        filterData.end_date = filterForm.end_date instanceof Date ? filterForm.end_date.toISOString().split("T")[0] : filterForm.end_date;
      }
      router.get(route("dashboard.orders.index"), filterData, {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    };
    const clearFilters = () => {
      filterForm.reset();
      router.get(route("dashboard.orders.index"), {}, {
        // Navigate without filters
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    };
    const formatDateForSubmit = (dateValue) => {
      if (dateValue instanceof Date) {
        return dateValue.toISOString().split("T")[0];
      }
      return dateValue;
    };
    const exportData = async (format) => {
      exporting.value = format;
      const exportParams = {
        format,
        start_date: formatDateForSubmit(filterForm.start_date),
        end_date: formatDateForSubmit(filterForm.end_date)
      };
      try {
        const response = await axios.get(route("dashboard.orders.export"), {
          params: exportParams,
          responseType: "blob"
        });
        const headerLine = response.headers["content-disposition"];
        let filename = "export." + format;
        if (headerLine) {
          const filenameMatch = headerLine.match(/filename="?(.+?)"?$/);
          if (filenameMatch && filenameMatch.length === 2) {
            filename = filenameMatch[1];
          }
        }
        saveAs(response.data, filename);
      } catch (error) {
        console.error(`Error exporting ${format}:`, error);
        let errorMessage = `Export failed. Please try again.`;
        if (error.response && error.response.data) {
          if (error.response.data instanceof Blob && error.response.data.type === "application/json") {
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const errorJson = JSON.parse(reader.result);
                alert(`Export failed: ${errorJson.message || "Server error details."}`);
              } catch (e) {
                alert(errorMessage);
              }
            };
            reader.readAsText(error.response.data);
            errorMessage = null;
          }
        }
        if (errorMessage) alert(errorMessage);
      } finally {
        exporting.value = null;
      }
    };
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    };
    const formatCurrency = (value) => {
      if (typeof value !== "number") value = parseFloat(value);
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(value);
    };
    const getStatusSeverity = (status) => {
      const s = status == null ? void 0 : status.toLowerCase();
      if (s === "completed" || s === "delivered" || s === "shipped") return "success";
      if (s === "pending" || s === "processing") return "warning";
      if (s === "cancelled" || s === "refunded") return "danger";
      return "info";
    };
    const getPaymentStatusSeverity = (status) => {
      const s = status == null ? void 0 : status.toLowerCase();
      if (s === "paid") return "success";
      if (s === "pending") return "warning";
      if (s === "failed" || s === "refunded") return "danger";
      return "info";
    };
    const pageTotalAmount = computed(() => {
      return props.orders.data.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    });
    const pageTotalPrintOnMaterial = computed(() => {
      return props.orders.data.reduce((sum, order) => sum + parseFloat(order.print_on_material_value), 0);
    });
    const first = computed(() => {
      return (props.orders.current_page - 1) * props.orders.per_page;
    });
    const onPage = (event) => {
      router.get(route("dashboard.orders.index"), {
        page: event.page + 1,
        // PrimeVue pages are 0-indexed
        start_date: filterForm.start_date instanceof Date ? filterForm.start_date.toISOString().split("T")[0] : filterForm.start_date,
        end_date: filterForm.end_date instanceof Date ? filterForm.end_date.toISOString().split("T")[0] : filterForm.end_date
      }, {
        preserveState: true,
        preserveScroll: false,
        // Usually scroll to top on page change
        replace: true
      });
    };
    const onSort = (event) => {
      const newDirection = event.sortOrder === 1 ? "asc" : "desc";
      router.get(route("dashboard.orders.index"), {
        // Keep existing search
        search: props.filters.search,
        // Apply new sort
        sort: event.sortField,
        direction: newDirection,
        // Reset to page 1 (Important! Sorting changes the order, so page 5 might not exist or be relevant anymore)
        page: 1
      }, {
        preserveState: true,
        preserveScroll: true
        // Feels like an instant table update
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ColumnGroup = __unplugin_components_0;
      const _component_Row = __unplugin_components_1;
      _push(ssrRenderComponent(AdminLayout, mergeProps({ title: "Orders" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Admin - Orders" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(PageTitleSection, {
                    title: "Manage Orders",
                    breadcrumbs: "Dashboard > Orders"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Card), { class: "mt-6 mb-4" }, {
                    content: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<form${_scopeId3}><div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end mb-4"${_scopeId3}><div${_scopeId3}><label for="start_date" class="block text-sm font-medium mb-1"${_scopeId3}>From Date</label>`);
                        _push4(ssrRenderComponent(unref(DatePicker), {
                          modelValue: unref(filterForm).start_date,
                          "onUpdate:modelValue": ($event) => unref(filterForm).start_date = $event,
                          dateFormat: "yy-mm-dd",
                          showIcon: "",
                          inputId: "start_date",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div${_scopeId3}><label for="end_date" class="block text-sm font-medium mb-1"${_scopeId3}>To Date</label>`);
                        _push4(ssrRenderComponent(unref(DatePicker), {
                          modelValue: unref(filterForm).end_date,
                          "onUpdate:modelValue": ($event) => unref(filterForm).end_date = $event,
                          dateFormat: "yy-mm-dd",
                          showIcon: "",
                          inputId: "end_date",
                          class: "w-full"
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
                        _push4(`</div><div class="flex space-x-2 justify-start md:justify-end items-end"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(Button), {
                          label: "XLSX",
                          icon: "pi pi-file-excel",
                          severity: "success",
                          onClick: ($event) => exportData("xlsx"),
                          loading: exporting.value === "xlsx"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Button), {
                          label: "PDF",
                          icon: "pi pi-file-pdf",
                          severity: "danger",
                          onClick: ($event) => exportData("pdf"),
                          loading: exporting.value === "pdf"
                        }, null, _parent4, _scopeId3));
                        _push4(`</div></div>`);
                        if (unref(filterForm).errors.start_date) {
                          _push4(`<small class="p-error"${_scopeId3}>${ssrInterpolate(unref(filterForm).errors.start_date)}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        if (unref(filterForm).errors.end_date) {
                          _push4(`<small class="p-error mt-1"${_scopeId3}>${ssrInterpolate(unref(filterForm).errors.end_date)}</small>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</form>`);
                        _push4(ssrRenderComponent(unref(DataTable), {
                          value: __props.orders.data,
                          responsiveLayout: "scroll",
                          stripedRows: "",
                          lazy: "",
                          first: first.value,
                          paginator: "",
                          rows: 15,
                          totalRecords: __props.orders.total,
                          onPage,
                          sortField: __props.filters.sort,
                          sortOrder: __props.filters.direction === "asc" ? 1 : -1,
                          onSort
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Column), {
                                field: "id",
                                header: "Order #",
                                sortable: ""
                              }, {
                                body: withCtx((slotProps, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(Link), {
                                      href: _ctx.route("dashboard.orders.show", slotProps.data.id),
                                      class: "text-primary-500 no-underline hover:underline"
                                    }, {
                                      default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(slotProps.data.id)} (<span class="text-gray-500 text-xs"${_scopeId6}>${ssrInterpolate(slotProps.data.order_number)}</span>) `);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(slotProps.data.id) + " (", 1),
                                            createVNode("span", { class: "text-gray-500 text-xs" }, toDisplayString(slotProps.data.order_number), 1),
                                            createTextVNode(") ")
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(Link), {
                                        href: _ctx.route("dashboard.orders.show", slotProps.data.id),
                                        class: "text-primary-500 no-underline hover:underline"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(slotProps.data.id) + " (", 1),
                                          createVNode("span", { class: "text-gray-500 text-xs" }, toDisplayString(slotProps.data.order_number), 1),
                                          createTextVNode(") ")
                                        ]),
                                        _: 2
                                      }, 1032, ["href"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Column), {
                                field: "customer_name",
                                header: "Customer",
                                sortable: ""
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Column), {
                                field: "total_amount",
                                header: "Total",
                                sortable: ""
                              }, {
                                body: withCtx((slotProps, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(formatCurrency(slotProps.data.total_amount))}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(formatCurrency(slotProps.data.total_amount)), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Column), {
                                field: "print_on_material_value",
                                header: "Print Cost (15%)",
                                sortable: ""
                              }, {
                                body: withCtx((slotProps, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(formatCurrency(slotProps.data.print_on_material_value))}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(formatCurrency(slotProps.data.print_on_material_value)), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Column), {
                                field: "status",
                                header: "Order Status",
                                sortable: ""
                              }, {
                                body: withCtx((slotProps, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(Tag), {
                                      value: slotProps.data.status,
                                      severity: getStatusSeverity(slotProps.data.status)
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(Tag), {
                                        value: slotProps.data.status,
                                        severity: getStatusSeverity(slotProps.data.status)
                                      }, null, 8, ["value", "severity"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Column), {
                                field: "payment_status",
                                header: "Payment",
                                sortable: ""
                              }, {
                                body: withCtx((slotProps, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(Tag), {
                                      value: slotProps.data.payment_status,
                                      severity: getPaymentStatusSeverity(slotProps.data.payment_status)
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(Tag), {
                                        value: slotProps.data.payment_status,
                                        severity: getPaymentStatusSeverity(slotProps.data.payment_status)
                                      }, null, 8, ["value", "severity"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(Column), {
                                field: "created_at",
                                header: "Date",
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
                                      href: _ctx.route("dashboard.orders.show", slotProps.data.id)
                                    }, {
                                      default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(Button), {
                                            icon: "pi pi-eye",
                                            class: "p-button-sm p-button-text"
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(unref(Button), {
                                              icon: "pi pi-eye",
                                              class: "p-button-sm p-button-text"
                                            })
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(Link), {
                                        href: _ctx.route("dashboard.orders.show", slotProps.data.id)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Button), {
                                            icon: "pi pi-eye",
                                            class: "p-button-sm p-button-text"
                                          })
                                        ]),
                                        _: 2
                                      }, 1032, ["href"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              if (__props.orders.data && __props.orders.data.length > 0) {
                                _push5(ssrRenderComponent(_component_ColumnGroup, { type: "footer" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_Row, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(Column), {
                                              footer: `Total Orders on Page: ${__props.orders.data.length}`,
                                              colspan: 2
                                            }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(unref(Column), {
                                              footer: formatCurrency(pageTotalAmount.value)
                                            }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(unref(Column), {
                                              footer: formatCurrency(pageTotalPrintOnMaterial.value)
                                            }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(unref(Column), { colspan: 4 }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(unref(Column), {
                                                footer: `Total Orders on Page: ${__props.orders.data.length}`,
                                                colspan: 2
                                              }, null, 8, ["footer"]),
                                              createVNode(unref(Column), {
                                                footer: formatCurrency(pageTotalAmount.value)
                                              }, null, 8, ["footer"]),
                                              createVNode(unref(Column), {
                                                footer: formatCurrency(pageTotalPrintOnMaterial.value)
                                              }, null, 8, ["footer"]),
                                              createVNode(unref(Column), { colspan: 4 })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_Row, null, {
                                          default: withCtx(() => [
                                            createVNode(unref(Column), {
                                              footer: `Total Orders on Page: ${__props.orders.data.length}`,
                                              colspan: 2
                                            }, null, 8, ["footer"]),
                                            createVNode(unref(Column), {
                                              footer: formatCurrency(pageTotalAmount.value)
                                            }, null, 8, ["footer"]),
                                            createVNode(unref(Column), {
                                              footer: formatCurrency(pageTotalPrintOnMaterial.value)
                                            }, null, 8, ["footer"]),
                                            createVNode(unref(Column), { colspan: 4 })
                                          ]),
                                          _: 1
                                        })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createVNode(unref(Column), {
                                  field: "id",
                                  header: "Order #",
                                  sortable: ""
                                }, {
                                  body: withCtx((slotProps) => [
                                    createVNode(unref(Link), {
                                      href: _ctx.route("dashboard.orders.show", slotProps.data.id),
                                      class: "text-primary-500 no-underline hover:underline"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(slotProps.data.id) + " (", 1),
                                        createVNode("span", { class: "text-gray-500 text-xs" }, toDisplayString(slotProps.data.order_number), 1),
                                        createTextVNode(") ")
                                      ]),
                                      _: 2
                                    }, 1032, ["href"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(Column), {
                                  field: "customer_name",
                                  header: "Customer",
                                  sortable: ""
                                }),
                                createVNode(unref(Column), {
                                  field: "total_amount",
                                  header: "Total",
                                  sortable: ""
                                }, {
                                  body: withCtx((slotProps) => [
                                    createTextVNode(toDisplayString(formatCurrency(slotProps.data.total_amount)), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(Column), {
                                  field: "print_on_material_value",
                                  header: "Print Cost (15%)",
                                  sortable: ""
                                }, {
                                  body: withCtx((slotProps) => [
                                    createTextVNode(toDisplayString(formatCurrency(slotProps.data.print_on_material_value)), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(Column), {
                                  field: "status",
                                  header: "Order Status",
                                  sortable: ""
                                }, {
                                  body: withCtx((slotProps) => [
                                    createVNode(unref(Tag), {
                                      value: slotProps.data.status,
                                      severity: getStatusSeverity(slotProps.data.status)
                                    }, null, 8, ["value", "severity"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(Column), {
                                  field: "payment_status",
                                  header: "Payment",
                                  sortable: ""
                                }, {
                                  body: withCtx((slotProps) => [
                                    createVNode(unref(Tag), {
                                      value: slotProps.data.payment_status,
                                      severity: getPaymentStatusSeverity(slotProps.data.payment_status)
                                    }, null, 8, ["value", "severity"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(Column), {
                                  field: "created_at",
                                  header: "Date",
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
                                      href: _ctx.route("dashboard.orders.show", slotProps.data.id)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Button), {
                                          icon: "pi pi-eye",
                                          class: "p-button-sm p-button-text"
                                        })
                                      ]),
                                      _: 2
                                    }, 1032, ["href"])
                                  ]),
                                  _: 1
                                }),
                                __props.orders.data && __props.orders.data.length > 0 ? (openBlock(), createBlock(_component_ColumnGroup, {
                                  key: 0,
                                  type: "footer"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_Row, null, {
                                      default: withCtx(() => [
                                        createVNode(unref(Column), {
                                          footer: `Total Orders on Page: ${__props.orders.data.length}`,
                                          colspan: 2
                                        }, null, 8, ["footer"]),
                                        createVNode(unref(Column), {
                                          footer: formatCurrency(pageTotalAmount.value)
                                        }, null, 8, ["footer"]),
                                        createVNode(unref(Column), {
                                          footer: formatCurrency(pageTotalPrintOnMaterial.value)
                                        }, null, 8, ["footer"]),
                                        createVNode(unref(Column), { colspan: 4 })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("form", {
                            onSubmit: withModifiers(applyFilters, ["prevent"])
                          }, [
                            createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end mb-4" }, [
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "start_date",
                                  class: "block text-sm font-medium mb-1"
                                }, "From Date"),
                                createVNode(unref(DatePicker), {
                                  modelValue: unref(filterForm).start_date,
                                  "onUpdate:modelValue": ($event) => unref(filterForm).start_date = $event,
                                  dateFormat: "yy-mm-dd",
                                  showIcon: "",
                                  inputId: "start_date",
                                  class: "w-full"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              createVNode("div", null, [
                                createVNode("label", {
                                  for: "end_date",
                                  class: "block text-sm font-medium mb-1"
                                }, "To Date"),
                                createVNode(unref(DatePicker), {
                                  modelValue: unref(filterForm).end_date,
                                  "onUpdate:modelValue": ($event) => unref(filterForm).end_date = $event,
                                  dateFormat: "yy-mm-dd",
                                  showIcon: "",
                                  inputId: "end_date",
                                  class: "w-full"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                              ]),
                              createVNode("div", { class: "flex space-x-2 justify-start md:justify-end items-end" }, [
                                createVNode(unref(Button), {
                                  label: "XLSX",
                                  icon: "pi pi-file-excel",
                                  severity: "success",
                                  onClick: ($event) => exportData("xlsx"),
                                  loading: exporting.value === "xlsx"
                                }, null, 8, ["onClick", "loading"]),
                                createVNode(unref(Button), {
                                  label: "PDF",
                                  icon: "pi pi-file-pdf",
                                  severity: "danger",
                                  onClick: ($event) => exportData("pdf"),
                                  loading: exporting.value === "pdf"
                                }, null, 8, ["onClick", "loading"])
                              ])
                            ]),
                            unref(filterForm).errors.start_date ? (openBlock(), createBlock("small", {
                              key: 0,
                              class: "p-error"
                            }, toDisplayString(unref(filterForm).errors.start_date), 1)) : createCommentVNode("", true),
                            unref(filterForm).errors.end_date ? (openBlock(), createBlock("small", {
                              key: 1,
                              class: "p-error mt-1"
                            }, toDisplayString(unref(filterForm).errors.end_date), 1)) : createCommentVNode("", true)
                          ], 32),
                          createVNode(unref(DataTable), {
                            value: __props.orders.data,
                            responsiveLayout: "scroll",
                            stripedRows: "",
                            lazy: "",
                            first: first.value,
                            paginator: "",
                            rows: 15,
                            totalRecords: __props.orders.total,
                            onPage,
                            sortField: __props.filters.sort,
                            sortOrder: __props.filters.direction === "asc" ? 1 : -1,
                            onSort
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Column), {
                                field: "id",
                                header: "Order #",
                                sortable: ""
                              }, {
                                body: withCtx((slotProps) => [
                                  createVNode(unref(Link), {
                                    href: _ctx.route("dashboard.orders.show", slotProps.data.id),
                                    class: "text-primary-500 no-underline hover:underline"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(slotProps.data.id) + " (", 1),
                                      createVNode("span", { class: "text-gray-500 text-xs" }, toDisplayString(slotProps.data.order_number), 1),
                                      createTextVNode(") ")
                                    ]),
                                    _: 2
                                  }, 1032, ["href"])
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Column), {
                                field: "customer_name",
                                header: "Customer",
                                sortable: ""
                              }),
                              createVNode(unref(Column), {
                                field: "total_amount",
                                header: "Total",
                                sortable: ""
                              }, {
                                body: withCtx((slotProps) => [
                                  createTextVNode(toDisplayString(formatCurrency(slotProps.data.total_amount)), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Column), {
                                field: "print_on_material_value",
                                header: "Print Cost (15%)",
                                sortable: ""
                              }, {
                                body: withCtx((slotProps) => [
                                  createTextVNode(toDisplayString(formatCurrency(slotProps.data.print_on_material_value)), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Column), {
                                field: "status",
                                header: "Order Status",
                                sortable: ""
                              }, {
                                body: withCtx((slotProps) => [
                                  createVNode(unref(Tag), {
                                    value: slotProps.data.status,
                                    severity: getStatusSeverity(slotProps.data.status)
                                  }, null, 8, ["value", "severity"])
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Column), {
                                field: "payment_status",
                                header: "Payment",
                                sortable: ""
                              }, {
                                body: withCtx((slotProps) => [
                                  createVNode(unref(Tag), {
                                    value: slotProps.data.payment_status,
                                    severity: getPaymentStatusSeverity(slotProps.data.payment_status)
                                  }, null, 8, ["value", "severity"])
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Column), {
                                field: "created_at",
                                header: "Date",
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
                                    href: _ctx.route("dashboard.orders.show", slotProps.data.id)
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Button), {
                                        icon: "pi pi-eye",
                                        class: "p-button-sm p-button-text"
                                      })
                                    ]),
                                    _: 2
                                  }, 1032, ["href"])
                                ]),
                                _: 1
                              }),
                              __props.orders.data && __props.orders.data.length > 0 ? (openBlock(), createBlock(_component_ColumnGroup, {
                                key: 0,
                                type: "footer"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_Row, null, {
                                    default: withCtx(() => [
                                      createVNode(unref(Column), {
                                        footer: `Total Orders on Page: ${__props.orders.data.length}`,
                                        colspan: 2
                                      }, null, 8, ["footer"]),
                                      createVNode(unref(Column), {
                                        footer: formatCurrency(pageTotalAmount.value)
                                      }, null, 8, ["footer"]),
                                      createVNode(unref(Column), {
                                        footer: formatCurrency(pageTotalPrintOnMaterial.value)
                                      }, null, 8, ["footer"]),
                                      createVNode(unref(Column), { colspan: 4 })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["value", "first", "totalRecords", "sortField", "sortOrder"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(PageTitleSection, {
                      title: "Manage Orders",
                      breadcrumbs: "Dashboard > Orders"
                    }),
                    createVNode(unref(Card), { class: "mt-6 mb-4" }, {
                      content: withCtx(() => [
                        createVNode("form", {
                          onSubmit: withModifiers(applyFilters, ["prevent"])
                        }, [
                          createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end mb-4" }, [
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "start_date",
                                class: "block text-sm font-medium mb-1"
                              }, "From Date"),
                              createVNode(unref(DatePicker), {
                                modelValue: unref(filterForm).start_date,
                                "onUpdate:modelValue": ($event) => unref(filterForm).start_date = $event,
                                dateFormat: "yy-mm-dd",
                                showIcon: "",
                                inputId: "start_date",
                                class: "w-full"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", null, [
                              createVNode("label", {
                                for: "end_date",
                                class: "block text-sm font-medium mb-1"
                              }, "To Date"),
                              createVNode(unref(DatePicker), {
                                modelValue: unref(filterForm).end_date,
                                "onUpdate:modelValue": ($event) => unref(filterForm).end_date = $event,
                                dateFormat: "yy-mm-dd",
                                showIcon: "",
                                inputId: "end_date",
                                class: "w-full"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                            ]),
                            createVNode("div", { class: "flex space-x-2 justify-start md:justify-end items-end" }, [
                              createVNode(unref(Button), {
                                label: "XLSX",
                                icon: "pi pi-file-excel",
                                severity: "success",
                                onClick: ($event) => exportData("xlsx"),
                                loading: exporting.value === "xlsx"
                              }, null, 8, ["onClick", "loading"]),
                              createVNode(unref(Button), {
                                label: "PDF",
                                icon: "pi pi-file-pdf",
                                severity: "danger",
                                onClick: ($event) => exportData("pdf"),
                                loading: exporting.value === "pdf"
                              }, null, 8, ["onClick", "loading"])
                            ])
                          ]),
                          unref(filterForm).errors.start_date ? (openBlock(), createBlock("small", {
                            key: 0,
                            class: "p-error"
                          }, toDisplayString(unref(filterForm).errors.start_date), 1)) : createCommentVNode("", true),
                          unref(filterForm).errors.end_date ? (openBlock(), createBlock("small", {
                            key: 1,
                            class: "p-error mt-1"
                          }, toDisplayString(unref(filterForm).errors.end_date), 1)) : createCommentVNode("", true)
                        ], 32),
                        createVNode(unref(DataTable), {
                          value: __props.orders.data,
                          responsiveLayout: "scroll",
                          stripedRows: "",
                          lazy: "",
                          first: first.value,
                          paginator: "",
                          rows: 15,
                          totalRecords: __props.orders.total,
                          onPage,
                          sortField: __props.filters.sort,
                          sortOrder: __props.filters.direction === "asc" ? 1 : -1,
                          onSort
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Column), {
                              field: "id",
                              header: "Order #",
                              sortable: ""
                            }, {
                              body: withCtx((slotProps) => [
                                createVNode(unref(Link), {
                                  href: _ctx.route("dashboard.orders.show", slotProps.data.id),
                                  class: "text-primary-500 no-underline hover:underline"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(slotProps.data.id) + " (", 1),
                                    createVNode("span", { class: "text-gray-500 text-xs" }, toDisplayString(slotProps.data.order_number), 1),
                                    createTextVNode(") ")
                                  ]),
                                  _: 2
                                }, 1032, ["href"])
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Column), {
                              field: "customer_name",
                              header: "Customer",
                              sortable: ""
                            }),
                            createVNode(unref(Column), {
                              field: "total_amount",
                              header: "Total",
                              sortable: ""
                            }, {
                              body: withCtx((slotProps) => [
                                createTextVNode(toDisplayString(formatCurrency(slotProps.data.total_amount)), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Column), {
                              field: "print_on_material_value",
                              header: "Print Cost (15%)",
                              sortable: ""
                            }, {
                              body: withCtx((slotProps) => [
                                createTextVNode(toDisplayString(formatCurrency(slotProps.data.print_on_material_value)), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Column), {
                              field: "status",
                              header: "Order Status",
                              sortable: ""
                            }, {
                              body: withCtx((slotProps) => [
                                createVNode(unref(Tag), {
                                  value: slotProps.data.status,
                                  severity: getStatusSeverity(slotProps.data.status)
                                }, null, 8, ["value", "severity"])
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Column), {
                              field: "payment_status",
                              header: "Payment",
                              sortable: ""
                            }, {
                              body: withCtx((slotProps) => [
                                createVNode(unref(Tag), {
                                  value: slotProps.data.payment_status,
                                  severity: getPaymentStatusSeverity(slotProps.data.payment_status)
                                }, null, 8, ["value", "severity"])
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Column), {
                              field: "created_at",
                              header: "Date",
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
                                  href: _ctx.route("dashboard.orders.show", slotProps.data.id)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Button), {
                                      icon: "pi pi-eye",
                                      class: "p-button-sm p-button-text"
                                    })
                                  ]),
                                  _: 2
                                }, 1032, ["href"])
                              ]),
                              _: 1
                            }),
                            __props.orders.data && __props.orders.data.length > 0 ? (openBlock(), createBlock(_component_ColumnGroup, {
                              key: 0,
                              type: "footer"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_Row, null, {
                                  default: withCtx(() => [
                                    createVNode(unref(Column), {
                                      footer: `Total Orders on Page: ${__props.orders.data.length}`,
                                      colspan: 2
                                    }, null, 8, ["footer"]),
                                    createVNode(unref(Column), {
                                      footer: formatCurrency(pageTotalAmount.value)
                                    }, null, 8, ["footer"]),
                                    createVNode(unref(Column), {
                                      footer: formatCurrency(pageTotalPrintOnMaterial.value)
                                    }, null, 8, ["footer"]),
                                    createVNode(unref(Column), { colspan: 4 })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }, 8, ["value", "first", "totalRecords", "sortField", "sortOrder"])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Head), { title: "Admin - Orders" }),
              createVNode(_sfc_main$1, null, {
                default: withCtx(() => [
                  createVNode(PageTitleSection, {
                    title: "Manage Orders",
                    breadcrumbs: "Dashboard > Orders"
                  }),
                  createVNode(unref(Card), { class: "mt-6 mb-4" }, {
                    content: withCtx(() => [
                      createVNode("form", {
                        onSubmit: withModifiers(applyFilters, ["prevent"])
                      }, [
                        createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end mb-4" }, [
                          createVNode("div", null, [
                            createVNode("label", {
                              for: "start_date",
                              class: "block text-sm font-medium mb-1"
                            }, "From Date"),
                            createVNode(unref(DatePicker), {
                              modelValue: unref(filterForm).start_date,
                              "onUpdate:modelValue": ($event) => unref(filterForm).start_date = $event,
                              dateFormat: "yy-mm-dd",
                              showIcon: "",
                              inputId: "start_date",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", {
                              for: "end_date",
                              class: "block text-sm font-medium mb-1"
                            }, "To Date"),
                            createVNode(unref(DatePicker), {
                              modelValue: unref(filterForm).end_date,
                              "onUpdate:modelValue": ($event) => unref(filterForm).end_date = $event,
                              dateFormat: "yy-mm-dd",
                              showIcon: "",
                              inputId: "end_date",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                          ]),
                          createVNode("div", { class: "flex space-x-2 justify-start md:justify-end items-end" }, [
                            createVNode(unref(Button), {
                              label: "XLSX",
                              icon: "pi pi-file-excel",
                              severity: "success",
                              onClick: ($event) => exportData("xlsx"),
                              loading: exporting.value === "xlsx"
                            }, null, 8, ["onClick", "loading"]),
                            createVNode(unref(Button), {
                              label: "PDF",
                              icon: "pi pi-file-pdf",
                              severity: "danger",
                              onClick: ($event) => exportData("pdf"),
                              loading: exporting.value === "pdf"
                            }, null, 8, ["onClick", "loading"])
                          ])
                        ]),
                        unref(filterForm).errors.start_date ? (openBlock(), createBlock("small", {
                          key: 0,
                          class: "p-error"
                        }, toDisplayString(unref(filterForm).errors.start_date), 1)) : createCommentVNode("", true),
                        unref(filterForm).errors.end_date ? (openBlock(), createBlock("small", {
                          key: 1,
                          class: "p-error mt-1"
                        }, toDisplayString(unref(filterForm).errors.end_date), 1)) : createCommentVNode("", true)
                      ], 32),
                      createVNode(unref(DataTable), {
                        value: __props.orders.data,
                        responsiveLayout: "scroll",
                        stripedRows: "",
                        lazy: "",
                        first: first.value,
                        paginator: "",
                        rows: 15,
                        totalRecords: __props.orders.total,
                        onPage,
                        sortField: __props.filters.sort,
                        sortOrder: __props.filters.direction === "asc" ? 1 : -1,
                        onSort
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Column), {
                            field: "id",
                            header: "Order #",
                            sortable: ""
                          }, {
                            body: withCtx((slotProps) => [
                              createVNode(unref(Link), {
                                href: _ctx.route("dashboard.orders.show", slotProps.data.id),
                                class: "text-primary-500 no-underline hover:underline"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(slotProps.data.id) + " (", 1),
                                  createVNode("span", { class: "text-gray-500 text-xs" }, toDisplayString(slotProps.data.order_number), 1),
                                  createTextVNode(") ")
                                ]),
                                _: 2
                              }, 1032, ["href"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Column), {
                            field: "customer_name",
                            header: "Customer",
                            sortable: ""
                          }),
                          createVNode(unref(Column), {
                            field: "total_amount",
                            header: "Total",
                            sortable: ""
                          }, {
                            body: withCtx((slotProps) => [
                              createTextVNode(toDisplayString(formatCurrency(slotProps.data.total_amount)), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Column), {
                            field: "print_on_material_value",
                            header: "Print Cost (15%)",
                            sortable: ""
                          }, {
                            body: withCtx((slotProps) => [
                              createTextVNode(toDisplayString(formatCurrency(slotProps.data.print_on_material_value)), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Column), {
                            field: "status",
                            header: "Order Status",
                            sortable: ""
                          }, {
                            body: withCtx((slotProps) => [
                              createVNode(unref(Tag), {
                                value: slotProps.data.status,
                                severity: getStatusSeverity(slotProps.data.status)
                              }, null, 8, ["value", "severity"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Column), {
                            field: "payment_status",
                            header: "Payment",
                            sortable: ""
                          }, {
                            body: withCtx((slotProps) => [
                              createVNode(unref(Tag), {
                                value: slotProps.data.payment_status,
                                severity: getPaymentStatusSeverity(slotProps.data.payment_status)
                              }, null, 8, ["value", "severity"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Column), {
                            field: "created_at",
                            header: "Date",
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
                                href: _ctx.route("dashboard.orders.show", slotProps.data.id)
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(Button), {
                                    icon: "pi pi-eye",
                                    class: "p-button-sm p-button-text"
                                  })
                                ]),
                                _: 2
                              }, 1032, ["href"])
                            ]),
                            _: 1
                          }),
                          __props.orders.data && __props.orders.data.length > 0 ? (openBlock(), createBlock(_component_ColumnGroup, {
                            key: 0,
                            type: "footer"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_Row, null, {
                                default: withCtx(() => [
                                  createVNode(unref(Column), {
                                    footer: `Total Orders on Page: ${__props.orders.data.length}`,
                                    colspan: 2
                                  }, null, 8, ["footer"]),
                                  createVNode(unref(Column), {
                                    footer: formatCurrency(pageTotalAmount.value)
                                  }, null, 8, ["footer"]),
                                  createVNode(unref(Column), {
                                    footer: formatCurrency(pageTotalPrintOnMaterial.value)
                                  }, null, 8, ["footer"]),
                                  createVNode(unref(Column), { colspan: 4 })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }, 8, ["value", "first", "totalRecords", "sortField", "sortOrder"])
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
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/dashboard/orders/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
