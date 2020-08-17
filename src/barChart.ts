import * as d3 from 'd3';
import {getBandScale, getDomain, SeriesItem, VerticalBarModel} from "./utils";

export function drawBarChart(data: Array<VerticalBarModel>) {
    const width = 600;
    const height = 400;
    const innerPadding = 0.1;
    const outerPadding = 0;
    const barColor = ["#00aeef", "#f98e2b"];
    const margin = {bottom: 25, left: 60, right: 0, top: 20};


    const labelName = data.map(s => s.name);                // ["Q2", "Q3", "Q4"]
    const periodName = data[0].series.map(a => a.name);     //["03/01/2015 - 02/29/20161", "03/01/2014 - 02/28/20152"]

    let x0 = getBandScale(labelName, [0, width], innerPadding, outerPadding).round(true);
    console.log(x0("Q2")); //1
    console.log(x0("Q3")); //207
    console.log(x0("Q4")); //413
    console.log(x0.bandwidth()); //185

    const x1 = getBandScale(periodName, [0, x0.bandwidth()], innerPadding, outerPadding).round(true);
    console.log(x1(periodName[0])); //0
    console.log(x1(periodName[1]));  //97
    console.log(x1.bandwidth());  //87

    let z = d3.scaleOrdinal().domain(periodName).range(barColor);
    console.log(z(periodName[0])); //#00aeef
    console.log(z(periodName[1])); //#f98e2b


    let domain = getDomain(data);
    console.log(domain);//[0, 316.3264346467819]

    const y = d3.scaleLinear()
        .domain(domain).nice()
        .rangeRound([height, 0]);


    let svg = d3.selectAll('svg');

    let chart = svg.selectAll<SVGGElement, number>('g.chart').data([1]);
    chart = chart.enter()
        .append('g')
        .attr('class', 'chart')
        .merge(chart)
        .attr('transform', `translate(${margin.left},${margin.top})`);

// add the Y gridlines
    let gridLineGroup = chart.selectAll<SVGGElement, number>('g.grid-line-group').data([1]);
    gridLineGroup = gridLineGroup.enter()
        .append('g')
        .attr('class', 'grid-line-group')
        .merge(gridLineGroup)
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .ticks(this.ticks)
            .tickFormat(() => '')
        );
    gridLineGroup.selectAll('line').attr('stroke', '#d3d3d3');
    gridLineGroup.selectAll('path.domain').remove();

    let barGroupWrapper = chart.selectAll<SVGGElement, number>('g.bar-group-wrapper').data([1]);
    barGroupWrapper = barGroupWrapper.enter()
        .append('g')
        .merge(barGroupWrapper)
        .attr('class', 'bar-group-wrapper');

    let barGroup = barGroupWrapper.selectAll<SVGGElement, number>('g.bar-group').data(data);
    barGroup.exit()
        .remove();
    barGroup = barGroup.enter()
        .append('g')
        .attr('class', 'bar-group')
        .merge(barGroup)
        .attr('transform', d => `translate(${x0(d.name)},0)`);

    prepareBarRects(barGroup, x1, y, z, height);
}


function prepareBarRects(barGroup: d3.Selection<d3.BaseType, VerticalBarModel, d3.BaseType, number>,
                         x1: d3.ScaleBand<string>, y: d3.ScaleLinear<number, number>, z: d3.ScaleOrdinal<string, {}>, height: number): void {
    const barRects = barGroup.selectAll<SVGRectElement, any>('rect.bar, rect.bar-negative')
        .data((d, i) => {
            console.log('d--->', d);
            return d.series.map((seriesItem, si) => [seriesItem, i, si, d.name, d.series, d.description])
        });

    barRects.enter()
        .append('rect')
        .attr('width', x1.bandwidth())
        .attr('x', (d: [SeriesItem, number, number, string, SeriesItem[], string]) => x1(d[0].name))
        .attr('y', (d: [SeriesItem, number, number, string, SeriesItem[], string]) => {
            const startValue = d[0].value;
            return y(Math.max(0, startValue));
        })
        .attr('height', (d: [SeriesItem, number, number, string, SeriesItem[], string]) => {
            console.log(d);
            return d[0].value >= 0 ? y(0) - y(d[0].value) : y(d[0].value) - y(0);
        })
        .attr('stroke-width', 5)
        .attr('fill', (d: [SeriesItem, number, number, string, SeriesItem[], string]) => {
            return z(d[0].name).toString();
        })
        .merge(barRects)
        .attr('class', d => (d[0] as SeriesItem).value < 0 ? 'bar-negative' : 'bar');

    barRects.exit()
        .remove();
}