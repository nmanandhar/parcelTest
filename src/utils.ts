import * as d3 from "d3";


export function getBandScale(domain, range, innerPadding = 0, outerPadding = 0): d3.ScaleBand<string> {
    const scale = d3.scaleBand()
        .range(range)
        .domain(domain)
        .paddingInner(innerPadding)
        .paddingOuter(outerPadding);
    return scale;
}


export function getDomain(data): [number, number] {
    const barValues: number[] = [].concat(...data.map(s => s.series.map(a => a.value)), ...data.map(s => s.series.map(a => a.referenceValue)));
    return [(d3.min(barValues) > 0 ? 0 : d3.min(barValues)), (d3.max(barValues) * 1.01)];
}


export interface SeriesItem {
    name: string;
    value: any;
    referenceValue: number;
    selected?: boolean;
}

export interface VerticalBarModel {
    name: string;
    series: SeriesItem[];
    description?: string;
}


