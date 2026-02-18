import { computed, ref, withCtx, unref, createVNode, toDisplayString, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderClass } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { A as AdminLayout } from "./AdminLayout-CbDljQzr.js";
import { _ as _export_sfc, a as _sfc_main$1, P as PageTitleSection } from "../ssr.js";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Chart from "primevue/chart";
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
  __name: "Dashboard",
  __ssrInlineRender: true,
  props: {
    recentOrders: Array,
    orderCount: Number,
    newOrders: Number,
    revenue: Number,
    // Total revenue passed from backend
    revenueChange: Number,
    quarterLabel: String,
    customerCount: Number,
    newCustomers: Number,
    topFrames: Array,
    topSizes: Array,
    salesChartData: Array,
    // Array of {date: '...', total: ...}
    averageOrderValue: Number
  },
  setup(__props) {
    const props = __props;
    const formatCurrency = (value) => {
      return parseFloat(value).toFixed(2);
    };
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("el-GR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const getStatusBadge = (status) => {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase";
        case "pending":
          return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold uppercase";
        case "cancelled":
          return "bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase";
        default:
          return "bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold uppercase";
      }
    };
    const recentOrdersFormatted = computed(() => {
      return props.recentOrders.map((order) => ({
        ...order,
        name: order.customer_name,
        date: formatDate(order.created_at),
        status: order.status,
        price: order.total_amount
      }));
    });
    const chartData = computed(() => {
      const labels = props.salesChartData.map((d) => new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }));
      const data = props.salesChartData.map((d) => d.total);
      return {
        labels,
        datasets: [
          {
            label: "Daily Revenue (€)",
            data,
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            // Blue-500 with opacity
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }
        ]
      };
    });
    const chartOptions = ref({
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)"
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      maintainAspectRatio: false
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AdminLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Dashboard" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(PageTitleSection, { title: "Dashboard Overview" }, null, _parent3, _scopeId2));
                  _push3(`<div class="grid grid-cols-12 gap-6 pt-4" data-v-6b49b71b${_scopeId2}><div class="col-span-12 md:col-span-6 xl:col-span-3" data-v-6b49b71b${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Link), {
                    href: _ctx.route("dashboard.orders.index"),
                    class: "no-underline block h-full"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="card mb-0 hover:shadow-md transition-shadow h-full flex flex-col justify-between" data-v-6b49b71b${_scopeId3}><div class="flex justify-between mb-3" data-v-6b49b71b${_scopeId3}><div data-v-6b49b71b${_scopeId3}><span class="block text-muted-color font-medium mb-3" data-v-6b49b71b${_scopeId3}>Orders</span><div class="text-surface-900 dark:text-surface-0 font-bold text-2xl" data-v-6b49b71b${_scopeId3}>${ssrInterpolate(__props.orderCount)}</div></div><div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full" style="${ssrRenderStyle({ "width": "2.5rem", "height": "2.5rem" })}" data-v-6b49b71b${_scopeId3}><i class="pi pi-shopping-cart text-blue-500 !text-xl" data-v-6b49b71b${_scopeId3}></i></div></div><span class="text-primary font-medium" data-v-6b49b71b${_scopeId3}>${ssrInterpolate(__props.newOrders)} new </span><span class="text-muted-color text-sm" data-v-6b49b71b${_scopeId3}>since last week</span></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "card mb-0 hover:shadow-md transition-shadow h-full flex flex-col justify-between" }, [
                            createVNode("div", { class: "flex justify-between mb-3" }, [
                              createVNode("div", null, [
                                createVNode("span", { class: "block text-muted-color font-medium mb-3" }, "Orders"),
                                createVNode("div", { class: "text-surface-900 dark:text-surface-0 font-bold text-2xl" }, toDisplayString(__props.orderCount), 1)
                              ]),
                              createVNode("div", {
                                class: "flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full",
                                style: { "width": "2.5rem", "height": "2.5rem" }
                              }, [
                                createVNode("i", { class: "pi pi-shopping-cart text-blue-500 !text-xl" })
                              ])
                            ]),
                            createVNode("span", { class: "text-primary font-medium" }, toDisplayString(__props.newOrders) + " new ", 1),
                            createVNode("span", { class: "text-muted-color text-sm" }, "since last week")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="col-span-12 md:col-span-6 xl:col-span-3" data-v-6b49b71b${_scopeId2}><div class="card mb-0 h-full flex flex-col justify-between" data-v-6b49b71b${_scopeId2}><div class="flex justify-between mb-3" data-v-6b49b71b${_scopeId2}><div data-v-6b49b71b${_scopeId2}><span class="block text-muted-color font-medium mb-3" data-v-6b49b71b${_scopeId2}>Revenue (${ssrInterpolate(__props.quarterLabel)})</span><div class="text-surface-900 dark:text-surface-0 font-bold text-2xl" data-v-6b49b71b${_scopeId2}>€${ssrInterpolate(formatCurrency(__props.revenue))}</div></div><div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full" style="${ssrRenderStyle({ "width": "2.5rem", "height": "2.5rem" })}" data-v-6b49b71b${_scopeId2}><i class="pi pi-dollar text-orange-500 !text-xl" data-v-6b49b71b${_scopeId2}></i></div></div><div data-v-6b49b71b${_scopeId2}><span class="${ssrRenderClass([__props.revenueChange >= 0 ? "text-green-500" : "text-red-500", "font-medium"])}" data-v-6b49b71b${_scopeId2}>${ssrInterpolate(__props.revenueChange >= 0 ? "+" : "")}${ssrInterpolate(__props.revenueChange)}% </span><span class="text-muted-color text-sm" data-v-6b49b71b${_scopeId2}> vs last quarter</span></div></div></div><div class="col-span-12 md:col-span-6 xl:col-span-3" data-v-6b49b71b${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Link), {
                    href: _ctx.route("dashboard.users.index"),
                    class: "no-underline block h-full"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="card mb-0 hover:shadow-md transition-shadow h-full flex flex-col justify-between" data-v-6b49b71b${_scopeId3}><div class="flex justify-between mb-3" data-v-6b49b71b${_scopeId3}><div data-v-6b49b71b${_scopeId3}><span class="block text-muted-color font-medium mb-3" data-v-6b49b71b${_scopeId3}>Customers</span><div class="text-surface-900 dark:text-surface-0 font-bold text-2xl" data-v-6b49b71b${_scopeId3}>${ssrInterpolate(__props.customerCount)}</div></div><div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-full" style="${ssrRenderStyle({ "width": "2.5rem", "height": "2.5rem" })}" data-v-6b49b71b${_scopeId3}><i class="pi pi-users text-cyan-500 !text-xl" data-v-6b49b71b${_scopeId3}></i></div></div><span class="text-primary font-medium" data-v-6b49b71b${_scopeId3}>${ssrInterpolate(__props.newCustomers)}</span><span class="text-muted-color text-sm" data-v-6b49b71b${_scopeId3}>newly registered</span></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "card mb-0 hover:shadow-md transition-shadow h-full flex flex-col justify-between" }, [
                            createVNode("div", { class: "flex justify-between mb-3" }, [
                              createVNode("div", null, [
                                createVNode("span", { class: "block text-muted-color font-medium mb-3" }, "Customers"),
                                createVNode("div", { class: "text-surface-900 dark:text-surface-0 font-bold text-2xl" }, toDisplayString(__props.customerCount), 1)
                              ]),
                              createVNode("div", {
                                class: "flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-full",
                                style: { "width": "2.5rem", "height": "2.5rem" }
                              }, [
                                createVNode("i", { class: "pi pi-users text-cyan-500 !text-xl" })
                              ])
                            ]),
                            createVNode("span", { class: "text-primary font-medium" }, toDisplayString(__props.newCustomers), 1),
                            createVNode("span", { class: "text-muted-color text-sm" }, "newly registered")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="col-span-12 md:col-span-6 xl:col-span-3" data-v-6b49b71b${_scopeId2}><div class="card mb-0 h-full flex flex-col justify-between" data-v-6b49b71b${_scopeId2}><div class="flex justify-between mb-3" data-v-6b49b71b${_scopeId2}><div data-v-6b49b71b${_scopeId2}><span class="block text-muted-color font-medium mb-3" data-v-6b49b71b${_scopeId2}>Avg. Order Value</span><div class="text-surface-900 dark:text-surface-0 font-bold text-2xl" data-v-6b49b71b${_scopeId2}>€${ssrInterpolate(formatCurrency(__props.averageOrderValue))}</div></div><div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full" style="${ssrRenderStyle({ "width": "2.5rem", "height": "2.5rem" })}" data-v-6b49b71b${_scopeId2}><i class="pi pi-wallet text-green-500 !text-xl" data-v-6b49b71b${_scopeId2}></i></div></div><span class="text-muted-color text-sm" data-v-6b49b71b${_scopeId2}>Average spend per order</span></div></div></div><div class="grid grid-cols-12 gap-6 pt-6" data-v-6b49b71b${_scopeId2}><div class="col-span-12 xl:col-span-8" data-v-6b49b71b${_scopeId2}><div class="card h-full" data-v-6b49b71b${_scopeId2}><div class="font-semibold text-xl mb-4" data-v-6b49b71b${_scopeId2}>Revenue Overview</div>`);
                  _push3(ssrRenderComponent(unref(Chart), {
                    type: "bar",
                    data: chartData.value,
                    options: chartOptions.value,
                    class: "h-[20rem]"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div><div class="col-span-12 xl:col-span-4 flex flex-col gap-6" data-v-6b49b71b${_scopeId2}><div class="card flex-1" data-v-6b49b71b${_scopeId2}><div class="font-semibold text-lg mb-3" data-v-6b49b71b${_scopeId2}>Best Selling Frames</div>`);
                  _push3(ssrRenderComponent(unref(DataTable), {
                    value: __props.topFrames,
                    rows: 5,
                    responsiveLayout: "scroll",
                    size: "small"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Column), {
                          field: "frame",
                          header: "Color/Type"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Column), {
                          field: "total_sold",
                          header: "Sold",
                          class: "flex text-right justify-end"
                        }, {
                          body: withCtx((slotProps, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<span class="font-bold text-surface-700 dark:text-white/80" data-v-6b49b71b${_scopeId4}>${ssrInterpolate(slotProps.data.total_sold)}</span>`);
                            } else {
                              return [
                                createVNode("span", { class: "font-bold text-surface-700 dark:text-white/80" }, toDisplayString(slotProps.data.total_sold), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Column), {
                            field: "frame",
                            header: "Color/Type"
                          }),
                          createVNode(unref(Column), {
                            field: "total_sold",
                            header: "Sold",
                            class: "flex text-right justify-end"
                          }, {
                            body: withCtx((slotProps) => [
                              createVNode("span", { class: "font-bold text-surface-700 dark:text-white/80" }, toDisplayString(slotProps.data.total_sold), 1)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="card flex-1" data-v-6b49b71b${_scopeId2}><div class="font-semibold text-lg mb-3" data-v-6b49b71b${_scopeId2}>Best Selling Sizes</div>`);
                  _push3(ssrRenderComponent(unref(DataTable), {
                    value: __props.topSizes,
                    rows: 5,
                    responsiveLayout: "scroll",
                    size: "small"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Column), {
                          field: "size",
                          header: "Dimension"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Column), {
                          field: "total_sold",
                          header: "Sold",
                          class: "flex text-right justify-end"
                        }, {
                          body: withCtx((slotProps, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<span class="font-bold text-surface-700 dark:text-white/80" data-v-6b49b71b${_scopeId4}>${ssrInterpolate(slotProps.data.total_sold)}</span>`);
                            } else {
                              return [
                                createVNode("span", { class: "font-bold text-surface-700 dark:text-white/80" }, toDisplayString(slotProps.data.total_sold), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Column), {
                            field: "size",
                            header: "Dimension"
                          }),
                          createVNode(unref(Column), {
                            field: "total_sold",
                            header: "Sold",
                            class: "flex text-right justify-end"
                          }, {
                            body: withCtx((slotProps) => [
                              createVNode("span", { class: "font-bold text-surface-700 dark:text-white/80" }, toDisplayString(slotProps.data.total_sold), 1)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div></div><div class="grid grid-cols-12 gap-6 pt-6" data-v-6b49b71b${_scopeId2}><div class="col-span-12" data-v-6b49b71b${_scopeId2}><div class="card" data-v-6b49b71b${_scopeId2}><div class="flex justify-between items-center mb-4" data-v-6b49b71b${_scopeId2}><div class="font-semibold text-xl" data-v-6b49b71b${_scopeId2}>Recent Orders</div>`);
                  _push3(ssrRenderComponent(unref(Link), {
                    href: _ctx.route("dashboard.orders.index")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Button), {
                          label: "View All",
                          icon: "pi pi-arrow-right",
                          iconPos: "right",
                          text: "",
                          size: "small"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Button), {
                            label: "View All",
                            icon: "pi pi-arrow-right",
                            iconPos: "right",
                            text: "",
                            size: "small"
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(unref(DataTable), {
                    value: recentOrdersFormatted.value,
                    responsiveLayout: "scroll",
                    size: "small"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Column), {
                          field: "order_number",
                          header: "Order No"
                        }, {
                          body: withCtx((slotProps, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Link), {
                                href: _ctx.route("dashboard.orders.show", slotProps.data.id),
                                class: "font-medium text-primary hover:underline decoration-1"
                              }, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(slotProps.data.order_number)}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(slotProps.data.order_number), 1)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Link), {
                                  href: _ctx.route("dashboard.orders.show", slotProps.data.id),
                                  class: "font-medium text-primary hover:underline decoration-1"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(slotProps.data.order_number), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["href"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Column), {
                          field: "name",
                          header: "Customer"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Column), {
                          field: "date",
                          header: "Date"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Column), {
                          field: "status",
                          header: "Status"
                        }, {
                          body: withCtx((slotProps, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<span class="${ssrRenderClass(getStatusBadge(slotProps.data.status))}" data-v-6b49b71b${_scopeId4}>${ssrInterpolate(slotProps.data.status)}</span>`);
                            } else {
                              return [
                                createVNode("span", {
                                  class: getStatusBadge(slotProps.data.status)
                                }, toDisplayString(slotProps.data.status), 3)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Column), {
                          field: "price",
                          header: "Total"
                        }, {
                          body: withCtx((slotProps, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` €${ssrInterpolate(slotProps.data.price)}`);
                            } else {
                              return [
                                createTextVNode(" €" + toDisplayString(slotProps.data.price), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Column), { style: { "width": "4rem" } }, {
                          body: withCtx((slotProps, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Link), {
                                href: _ctx.route("dashboard.orders.show", slotProps.data.id)
                              }, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(Button), {
                                      icon: "pi pi-search",
                                      rounded: "",
                                      text: "",
                                      severity: "secondary"
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(Button), {
                                        icon: "pi pi-search",
                                        rounded: "",
                                        text: "",
                                        severity: "secondary"
                                      })
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Link), {
                                  href: _ctx.route("dashboard.orders.show", slotProps.data.id)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Button), {
                                      icon: "pi pi-search",
                                      rounded: "",
                                      text: "",
                                      severity: "secondary"
                                    })
                                  ]),
                                  _: 2
                                }, 1032, ["href"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Column), {
                            field: "order_number",
                            header: "Order No"
                          }, {
                            body: withCtx((slotProps) => [
                              createVNode(unref(Link), {
                                href: _ctx.route("dashboard.orders.show", slotProps.data.id),
                                class: "font-medium text-primary hover:underline decoration-1"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(slotProps.data.order_number), 1)
                                ]),
                                _: 2
                              }, 1032, ["href"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Column), {
                            field: "name",
                            header: "Customer"
                          }),
                          createVNode(unref(Column), {
                            field: "date",
                            header: "Date"
                          }),
                          createVNode(unref(Column), {
                            field: "status",
                            header: "Status"
                          }, {
                            body: withCtx((slotProps) => [
                              createVNode("span", {
                                class: getStatusBadge(slotProps.data.status)
                              }, toDisplayString(slotProps.data.status), 3)
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Column), {
                            field: "price",
                            header: "Total"
                          }, {
                            body: withCtx((slotProps) => [
                              createTextVNode(" €" + toDisplayString(slotProps.data.price), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(unref(Column), { style: { "width": "4rem" } }, {
                            body: withCtx((slotProps) => [
                              createVNode(unref(Link), {
                                href: _ctx.route("dashboard.orders.show", slotProps.data.id)
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(Button), {
                                    icon: "pi pi-search",
                                    rounded: "",
                                    text: "",
                                    severity: "secondary"
                                  })
                                ]),
                                _: 2
                              }, 1032, ["href"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div></div>`);
                } else {
                  return [
                    createVNode(PageTitleSection, { title: "Dashboard Overview" }),
                    createVNode("div", { class: "grid grid-cols-12 gap-6 pt-4" }, [
                      createVNode("div", { class: "col-span-12 md:col-span-6 xl:col-span-3" }, [
                        createVNode(unref(Link), {
                          href: _ctx.route("dashboard.orders.index"),
                          class: "no-underline block h-full"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "card mb-0 hover:shadow-md transition-shadow h-full flex flex-col justify-between" }, [
                              createVNode("div", { class: "flex justify-between mb-3" }, [
                                createVNode("div", null, [
                                  createVNode("span", { class: "block text-muted-color font-medium mb-3" }, "Orders"),
                                  createVNode("div", { class: "text-surface-900 dark:text-surface-0 font-bold text-2xl" }, toDisplayString(__props.orderCount), 1)
                                ]),
                                createVNode("div", {
                                  class: "flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full",
                                  style: { "width": "2.5rem", "height": "2.5rem" }
                                }, [
                                  createVNode("i", { class: "pi pi-shopping-cart text-blue-500 !text-xl" })
                                ])
                              ]),
                              createVNode("span", { class: "text-primary font-medium" }, toDisplayString(__props.newOrders) + " new ", 1),
                              createVNode("span", { class: "text-muted-color text-sm" }, "since last week")
                            ])
                          ]),
                          _: 1
                        }, 8, ["href"])
                      ]),
                      createVNode("div", { class: "col-span-12 md:col-span-6 xl:col-span-3" }, [
                        createVNode("div", { class: "card mb-0 h-full flex flex-col justify-between" }, [
                          createVNode("div", { class: "flex justify-between mb-3" }, [
                            createVNode("div", null, [
                              createVNode("span", { class: "block text-muted-color font-medium mb-3" }, "Revenue (" + toDisplayString(__props.quarterLabel) + ")", 1),
                              createVNode("div", { class: "text-surface-900 dark:text-surface-0 font-bold text-2xl" }, "€" + toDisplayString(formatCurrency(__props.revenue)), 1)
                            ]),
                            createVNode("div", {
                              class: "flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full",
                              style: { "width": "2.5rem", "height": "2.5rem" }
                            }, [
                              createVNode("i", { class: "pi pi-dollar text-orange-500 !text-xl" })
                            ])
                          ]),
                          createVNode("div", null, [
                            createVNode("span", {
                              class: [__props.revenueChange >= 0 ? "text-green-500" : "text-red-500", "font-medium"]
                            }, toDisplayString(__props.revenueChange >= 0 ? "+" : "") + toDisplayString(__props.revenueChange) + "% ", 3),
                            createVNode("span", { class: "text-muted-color text-sm" }, " vs last quarter")
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "col-span-12 md:col-span-6 xl:col-span-3" }, [
                        createVNode(unref(Link), {
                          href: _ctx.route("dashboard.users.index"),
                          class: "no-underline block h-full"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "card mb-0 hover:shadow-md transition-shadow h-full flex flex-col justify-between" }, [
                              createVNode("div", { class: "flex justify-between mb-3" }, [
                                createVNode("div", null, [
                                  createVNode("span", { class: "block text-muted-color font-medium mb-3" }, "Customers"),
                                  createVNode("div", { class: "text-surface-900 dark:text-surface-0 font-bold text-2xl" }, toDisplayString(__props.customerCount), 1)
                                ]),
                                createVNode("div", {
                                  class: "flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-full",
                                  style: { "width": "2.5rem", "height": "2.5rem" }
                                }, [
                                  createVNode("i", { class: "pi pi-users text-cyan-500 !text-xl" })
                                ])
                              ]),
                              createVNode("span", { class: "text-primary font-medium" }, toDisplayString(__props.newCustomers), 1),
                              createVNode("span", { class: "text-muted-color text-sm" }, "newly registered")
                            ])
                          ]),
                          _: 1
                        }, 8, ["href"])
                      ]),
                      createVNode("div", { class: "col-span-12 md:col-span-6 xl:col-span-3" }, [
                        createVNode("div", { class: "card mb-0 h-full flex flex-col justify-between" }, [
                          createVNode("div", { class: "flex justify-between mb-3" }, [
                            createVNode("div", null, [
                              createVNode("span", { class: "block text-muted-color font-medium mb-3" }, "Avg. Order Value"),
                              createVNode("div", { class: "text-surface-900 dark:text-surface-0 font-bold text-2xl" }, "€" + toDisplayString(formatCurrency(__props.averageOrderValue)), 1)
                            ]),
                            createVNode("div", {
                              class: "flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full",
                              style: { "width": "2.5rem", "height": "2.5rem" }
                            }, [
                              createVNode("i", { class: "pi pi-wallet text-green-500 !text-xl" })
                            ])
                          ]),
                          createVNode("span", { class: "text-muted-color text-sm" }, "Average spend per order")
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "grid grid-cols-12 gap-6 pt-6" }, [
                      createVNode("div", { class: "col-span-12 xl:col-span-8" }, [
                        createVNode("div", { class: "card h-full" }, [
                          createVNode("div", { class: "font-semibold text-xl mb-4" }, "Revenue Overview"),
                          createVNode(unref(Chart), {
                            type: "bar",
                            data: chartData.value,
                            options: chartOptions.value,
                            class: "h-[20rem]"
                          }, null, 8, ["data", "options"])
                        ])
                      ]),
                      createVNode("div", { class: "col-span-12 xl:col-span-4 flex flex-col gap-6" }, [
                        createVNode("div", { class: "card flex-1" }, [
                          createVNode("div", { class: "font-semibold text-lg mb-3" }, "Best Selling Frames"),
                          createVNode(unref(DataTable), {
                            value: __props.topFrames,
                            rows: 5,
                            responsiveLayout: "scroll",
                            size: "small"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Column), {
                                field: "frame",
                                header: "Color/Type"
                              }),
                              createVNode(unref(Column), {
                                field: "total_sold",
                                header: "Sold",
                                class: "flex text-right justify-end"
                              }, {
                                body: withCtx((slotProps) => [
                                  createVNode("span", { class: "font-bold text-surface-700 dark:text-white/80" }, toDisplayString(slotProps.data.total_sold), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["value"])
                        ]),
                        createVNode("div", { class: "card flex-1" }, [
                          createVNode("div", { class: "font-semibold text-lg mb-3" }, "Best Selling Sizes"),
                          createVNode(unref(DataTable), {
                            value: __props.topSizes,
                            rows: 5,
                            responsiveLayout: "scroll",
                            size: "small"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Column), {
                                field: "size",
                                header: "Dimension"
                              }),
                              createVNode(unref(Column), {
                                field: "total_sold",
                                header: "Sold",
                                class: "flex text-right justify-end"
                              }, {
                                body: withCtx((slotProps) => [
                                  createVNode("span", { class: "font-bold text-surface-700 dark:text-white/80" }, toDisplayString(slotProps.data.total_sold), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["value"])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "grid grid-cols-12 gap-6 pt-6" }, [
                      createVNode("div", { class: "col-span-12" }, [
                        createVNode("div", { class: "card" }, [
                          createVNode("div", { class: "flex justify-between items-center mb-4" }, [
                            createVNode("div", { class: "font-semibold text-xl" }, "Recent Orders"),
                            createVNode(unref(Link), {
                              href: _ctx.route("dashboard.orders.index")
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Button), {
                                  label: "View All",
                                  icon: "pi pi-arrow-right",
                                  iconPos: "right",
                                  text: "",
                                  size: "small"
                                })
                              ]),
                              _: 1
                            }, 8, ["href"])
                          ]),
                          createVNode(unref(DataTable), {
                            value: recentOrdersFormatted.value,
                            responsiveLayout: "scroll",
                            size: "small"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Column), {
                                field: "order_number",
                                header: "Order No"
                              }, {
                                body: withCtx((slotProps) => [
                                  createVNode(unref(Link), {
                                    href: _ctx.route("dashboard.orders.show", slotProps.data.id),
                                    class: "font-medium text-primary hover:underline decoration-1"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(slotProps.data.order_number), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["href"])
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Column), {
                                field: "name",
                                header: "Customer"
                              }),
                              createVNode(unref(Column), {
                                field: "date",
                                header: "Date"
                              }),
                              createVNode(unref(Column), {
                                field: "status",
                                header: "Status"
                              }, {
                                body: withCtx((slotProps) => [
                                  createVNode("span", {
                                    class: getStatusBadge(slotProps.data.status)
                                  }, toDisplayString(slotProps.data.status), 3)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Column), {
                                field: "price",
                                header: "Total"
                              }, {
                                body: withCtx((slotProps) => [
                                  createTextVNode(" €" + toDisplayString(slotProps.data.price), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Column), { style: { "width": "4rem" } }, {
                                body: withCtx((slotProps) => [
                                  createVNode(unref(Link), {
                                    href: _ctx.route("dashboard.orders.show", slotProps.data.id)
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Button), {
                                        icon: "pi pi-search",
                                        rounded: "",
                                        text: "",
                                        severity: "secondary"
                                      })
                                    ]),
                                    _: 2
                                  }, 1032, ["href"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["value"])
                        ])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Head), { title: "Dashboard" }),
              createVNode(_sfc_main$1, null, {
                default: withCtx(() => [
                  createVNode(PageTitleSection, { title: "Dashboard Overview" }),
                  createVNode("div", { class: "grid grid-cols-12 gap-6 pt-4" }, [
                    createVNode("div", { class: "col-span-12 md:col-span-6 xl:col-span-3" }, [
                      createVNode(unref(Link), {
                        href: _ctx.route("dashboard.orders.index"),
                        class: "no-underline block h-full"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "card mb-0 hover:shadow-md transition-shadow h-full flex flex-col justify-between" }, [
                            createVNode("div", { class: "flex justify-between mb-3" }, [
                              createVNode("div", null, [
                                createVNode("span", { class: "block text-muted-color font-medium mb-3" }, "Orders"),
                                createVNode("div", { class: "text-surface-900 dark:text-surface-0 font-bold text-2xl" }, toDisplayString(__props.orderCount), 1)
                              ]),
                              createVNode("div", {
                                class: "flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full",
                                style: { "width": "2.5rem", "height": "2.5rem" }
                              }, [
                                createVNode("i", { class: "pi pi-shopping-cart text-blue-500 !text-xl" })
                              ])
                            ]),
                            createVNode("span", { class: "text-primary font-medium" }, toDisplayString(__props.newOrders) + " new ", 1),
                            createVNode("span", { class: "text-muted-color text-sm" }, "since last week")
                          ])
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ]),
                    createVNode("div", { class: "col-span-12 md:col-span-6 xl:col-span-3" }, [
                      createVNode("div", { class: "card mb-0 h-full flex flex-col justify-between" }, [
                        createVNode("div", { class: "flex justify-between mb-3" }, [
                          createVNode("div", null, [
                            createVNode("span", { class: "block text-muted-color font-medium mb-3" }, "Revenue (" + toDisplayString(__props.quarterLabel) + ")", 1),
                            createVNode("div", { class: "text-surface-900 dark:text-surface-0 font-bold text-2xl" }, "€" + toDisplayString(formatCurrency(__props.revenue)), 1)
                          ]),
                          createVNode("div", {
                            class: "flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full",
                            style: { "width": "2.5rem", "height": "2.5rem" }
                          }, [
                            createVNode("i", { class: "pi pi-dollar text-orange-500 !text-xl" })
                          ])
                        ]),
                        createVNode("div", null, [
                          createVNode("span", {
                            class: [__props.revenueChange >= 0 ? "text-green-500" : "text-red-500", "font-medium"]
                          }, toDisplayString(__props.revenueChange >= 0 ? "+" : "") + toDisplayString(__props.revenueChange) + "% ", 3),
                          createVNode("span", { class: "text-muted-color text-sm" }, " vs last quarter")
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "col-span-12 md:col-span-6 xl:col-span-3" }, [
                      createVNode(unref(Link), {
                        href: _ctx.route("dashboard.users.index"),
                        class: "no-underline block h-full"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "card mb-0 hover:shadow-md transition-shadow h-full flex flex-col justify-between" }, [
                            createVNode("div", { class: "flex justify-between mb-3" }, [
                              createVNode("div", null, [
                                createVNode("span", { class: "block text-muted-color font-medium mb-3" }, "Customers"),
                                createVNode("div", { class: "text-surface-900 dark:text-surface-0 font-bold text-2xl" }, toDisplayString(__props.customerCount), 1)
                              ]),
                              createVNode("div", {
                                class: "flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-full",
                                style: { "width": "2.5rem", "height": "2.5rem" }
                              }, [
                                createVNode("i", { class: "pi pi-users text-cyan-500 !text-xl" })
                              ])
                            ]),
                            createVNode("span", { class: "text-primary font-medium" }, toDisplayString(__props.newCustomers), 1),
                            createVNode("span", { class: "text-muted-color text-sm" }, "newly registered")
                          ])
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ]),
                    createVNode("div", { class: "col-span-12 md:col-span-6 xl:col-span-3" }, [
                      createVNode("div", { class: "card mb-0 h-full flex flex-col justify-between" }, [
                        createVNode("div", { class: "flex justify-between mb-3" }, [
                          createVNode("div", null, [
                            createVNode("span", { class: "block text-muted-color font-medium mb-3" }, "Avg. Order Value"),
                            createVNode("div", { class: "text-surface-900 dark:text-surface-0 font-bold text-2xl" }, "€" + toDisplayString(formatCurrency(__props.averageOrderValue)), 1)
                          ]),
                          createVNode("div", {
                            class: "flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full",
                            style: { "width": "2.5rem", "height": "2.5rem" }
                          }, [
                            createVNode("i", { class: "pi pi-wallet text-green-500 !text-xl" })
                          ])
                        ]),
                        createVNode("span", { class: "text-muted-color text-sm" }, "Average spend per order")
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "grid grid-cols-12 gap-6 pt-6" }, [
                    createVNode("div", { class: "col-span-12 xl:col-span-8" }, [
                      createVNode("div", { class: "card h-full" }, [
                        createVNode("div", { class: "font-semibold text-xl mb-4" }, "Revenue Overview"),
                        createVNode(unref(Chart), {
                          type: "bar",
                          data: chartData.value,
                          options: chartOptions.value,
                          class: "h-[20rem]"
                        }, null, 8, ["data", "options"])
                      ])
                    ]),
                    createVNode("div", { class: "col-span-12 xl:col-span-4 flex flex-col gap-6" }, [
                      createVNode("div", { class: "card flex-1" }, [
                        createVNode("div", { class: "font-semibold text-lg mb-3" }, "Best Selling Frames"),
                        createVNode(unref(DataTable), {
                          value: __props.topFrames,
                          rows: 5,
                          responsiveLayout: "scroll",
                          size: "small"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Column), {
                              field: "frame",
                              header: "Color/Type"
                            }),
                            createVNode(unref(Column), {
                              field: "total_sold",
                              header: "Sold",
                              class: "flex text-right justify-end"
                            }, {
                              body: withCtx((slotProps) => [
                                createVNode("span", { class: "font-bold text-surface-700 dark:text-white/80" }, toDisplayString(slotProps.data.total_sold), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["value"])
                      ]),
                      createVNode("div", { class: "card flex-1" }, [
                        createVNode("div", { class: "font-semibold text-lg mb-3" }, "Best Selling Sizes"),
                        createVNode(unref(DataTable), {
                          value: __props.topSizes,
                          rows: 5,
                          responsiveLayout: "scroll",
                          size: "small"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Column), {
                              field: "size",
                              header: "Dimension"
                            }),
                            createVNode(unref(Column), {
                              field: "total_sold",
                              header: "Sold",
                              class: "flex text-right justify-end"
                            }, {
                              body: withCtx((slotProps) => [
                                createVNode("span", { class: "font-bold text-surface-700 dark:text-white/80" }, toDisplayString(slotProps.data.total_sold), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["value"])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "grid grid-cols-12 gap-6 pt-6" }, [
                    createVNode("div", { class: "col-span-12" }, [
                      createVNode("div", { class: "card" }, [
                        createVNode("div", { class: "flex justify-between items-center mb-4" }, [
                          createVNode("div", { class: "font-semibold text-xl" }, "Recent Orders"),
                          createVNode(unref(Link), {
                            href: _ctx.route("dashboard.orders.index")
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Button), {
                                label: "View All",
                                icon: "pi pi-arrow-right",
                                iconPos: "right",
                                text: "",
                                size: "small"
                              })
                            ]),
                            _: 1
                          }, 8, ["href"])
                        ]),
                        createVNode(unref(DataTable), {
                          value: recentOrdersFormatted.value,
                          responsiveLayout: "scroll",
                          size: "small"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Column), {
                              field: "order_number",
                              header: "Order No"
                            }, {
                              body: withCtx((slotProps) => [
                                createVNode(unref(Link), {
                                  href: _ctx.route("dashboard.orders.show", slotProps.data.id),
                                  class: "font-medium text-primary hover:underline decoration-1"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(slotProps.data.order_number), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["href"])
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Column), {
                              field: "name",
                              header: "Customer"
                            }),
                            createVNode(unref(Column), {
                              field: "date",
                              header: "Date"
                            }),
                            createVNode(unref(Column), {
                              field: "status",
                              header: "Status"
                            }, {
                              body: withCtx((slotProps) => [
                                createVNode("span", {
                                  class: getStatusBadge(slotProps.data.status)
                                }, toDisplayString(slotProps.data.status), 3)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Column), {
                              field: "price",
                              header: "Total"
                            }, {
                              body: withCtx((slotProps) => [
                                createTextVNode(" €" + toDisplayString(slotProps.data.price), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Column), { style: { "width": "4rem" } }, {
                              body: withCtx((slotProps) => [
                                createVNode(unref(Link), {
                                  href: _ctx.route("dashboard.orders.show", slotProps.data.id)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Button), {
                                      icon: "pi pi-search",
                                      rounded: "",
                                      text: "",
                                      severity: "secondary"
                                    })
                                  ]),
                                  _: 2
                                }, 1032, ["href"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["value"])
                      ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/dashboard/Dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6b49b71b"]]);
export {
  Dashboard as default
};
