const chartsModule = {
    state:{
        chartsCritical: {
                chart: {
                    width: 380,
                    type: "donut",
                    dropShadow: {
                    enabled: true,
                    color: "#111",
                    top: -1,
                    left: 3,
                    blur: 3,
                    opacity: 0.2,
                    },
                },
                stroke: {
                    width: 0,
                },
                plotOptions: {
                    pie: {
                    donut: {
                        labels: {
                        show: true,
                        total: {
                            show: true,
                            showAlways: true,
                            label: "Total",
                            fontSize: "16px",
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: 600,
                            color: "#373d3f",
                            formatter: function (w) {
                            return w.globals.seriesTotals.reduce((a, b) => {
                                return a + b;
                            }, 0);
                            },
                        },
                        value: {
                            show: true,
                            fontSize: "1.5em",
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: 400,
                            color: undefined,
                            offsetY: 16,
                            formatter: function (val) {
                            return val;
                            },
                        },
                        },
                    },
                    },
                },
                labels: ["Open", "Cleared"],
                legend: {
                    show: true,
                    position: "bottom",
                    fontSize: "15px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: 400,
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val, opts) {
                    return opts.w.globals.seriesTotals[opts.seriesIndex];
                    },
                },
                states: {
                    hover: {
                    filter: "none",
                    },
                },
                colors: ["#EA8426", "#F4E0CD"],
                noData: {
                    text: "No Data",
                    align: "center",
                    verticalAlign: "middle",
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                    color: "#000",
                    fontSize: "20px",
                    },
                },
                responsive: [
                    {
                    breakpoint: 480,
                    options: {
                        chart: {
                        width: 200,
                        },
                        legend: {
                        position: "bottom",
                        },
                    },
                    },
                ],
            },
        chartsMajor: {
                chart: {
                    width: 380,
                    type: "donut",
                    dropShadow: {
                    enabled: true,
                    color: "#111",
                    top: -1,
                    left: 3,
                    blur: 3,
                    opacity: 0.2,
                    },
                },
                stroke: {
                    width: 0,
                },
                plotOptions: {
                    pie: {
                    donut: {
                        labels: {
                        show: true,
                        total: {
                            show: true,
                            showAlways: true,
                            label: "Total",
                            fontSize: "22px",
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: 600,
                            color: "#373d3f",
                            formatter: function (w) {
                            return w.globals.seriesTotals.reduce((a, b) => {
                                return a + b;
                            }, 0);
                            },
                        },
                        value: {
                            show: true,
                            fontSize: "2em",
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: 400,
                            color: undefined,
                            offsetY: 16,
                            formatter: function (val) {
                            return val;
                            },
                        },
                        },
                    },
                    },
                },
                labels: ["Open ", "Cleared"],
                legend: {
                    show: true,
                    position: "bottom",
                    fontSize: "15px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: 400,
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val, opts) {
                    return opts.w.globals.seriesTotals[opts.seriesIndex];
                    },
                },
                states: {
                    hover: {
                    filter: "none",
                    },
                },
                colors: ["#CB4F4F", "#EDC2C2"],
                noData: {
                    text: "No Data",
                    align: "center",
                    verticalAlign: "middle",
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                    color: "#000",
                    fontSize: "20px",
                    },
                },
                responsive: [
                    {
                    breakpoint: 480,
                    options: {
                        chart: {
                        width: 200,
                        },
                        legend: {
                        position: "bottom",
                        },
                    },
                    },
                ],
            },
        chartsMinor: {
                chart: {
                    width: 380,
                    type: "donut",
                    dropShadow: {
                    enabled: true,
                    color: "#111",
                    top: -1,
                    left: 3,
                    blur: 3,
                    opacity: 0.2,
                    },
                },
                stroke: {
                    width: 0,
                },
                plotOptions: {
                    pie: {
                    donut: {
                        labels: {
                        show: true,
                        total: {
                            show: true,
                            showAlways: true,
                            label: "Total",
                            fontSize: "16px",
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: 600,
                            color: "#373d3f",
                            formatter: function (w) {
                            return w.globals.seriesTotals.reduce((a, b) => {
                                return a + b;
                            }, 0);
                            },
                        },
                        value: {
                            show: true,
                            fontSize: "1.5em",
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: 400,
                            color: undefined,
                            offsetY: 16,
                            formatter: function (val) {
                            return val;
                            },
                        },
                        },
                    },
                    },
                },
                labels: ["Open", "Cleared"],
                legend: {
                    show: true,
                    position: "bottom",
                    fontSize: "15px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: 400,
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val, opts) {
                    return opts.w.globals.seriesTotals[opts.seriesIndex];
                    },
                },
                states: {
                    hover: {
                    filter: "none",
                    },
                },
                colors: ["#EA8426", "#F4E0CD"],
                noData: {
                    text: "No Data",
                    align: "center",
                    verticalAlign: "middle",
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                    color: "#000",
                    fontSize: "20px",
                    },
                },
                responsive: [
                    {
                    breakpoint: 480,
                    options: {
                        chart: {
                        width: 200,
                        },
                        legend: {
                        position: "bottom",
                        },
                    },
                    },
                ],
            },
    },
   getters:{
      optionsChartsCritical: state => state.chartsCritical,
      optionsChartsMajor: state =>state.chartsMajor,
      optionsChartsMinor: state => state.chartsMinor
   }
};

module.exports = chartsModule