import {drawBarChart} from "./barChart";

let data = [
    {
        name: "Q2",
        series: [
            {name: "03/01/2015 - 02/29/20161", "value": 292.952868791264, "referenceValue": null},
            {name: "03/01/2014 - 02/28/20152", "value": 285.730046486242, "referenceValue": null}
        ]
    },
    {
        name: "Q3",
        series: [
            {name: "03/01/2015 - 02/29/20161", "value": 270.530480429154, "referenceValue": null},
            {name: "03/01/2014 - 02/28/20152", "value": 313.194489749289, "referenceValue": null}
        ]
    },
    {
        name: "Q4",
        series: [
            {name: "03/01/2015 - 02/29/20161", "value": 287.322748099707, "referenceValue": null},
            {name: "03/01/2014 - 02/28/20152", "value": 310.013507782905, "referenceValue": null}]
    }
];

drawBarChart(data);