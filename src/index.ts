let response = {"value":[{"name":"Very Low 0.00 - <0.50","series":[{"name":"03/01/2015 - 02/29/2016","value":12087,"referenceValue":null},{"name":"03/01/2014 - 02/28/2015","value":0,"referenceValue":null}]},{"name":"Low 0.50 - <1.00","series":[{"name":"03/01/2015 - 02/29/2016","value":8485,"referenceValue":null},{"name":"03/01/2014 - 02/28/2015","value":0,"referenceValue":null}]},{"name":"Medium 1.00 - <2.50","series":[{"name":"03/01/2015 - 02/29/2016","value":6801,"referenceValue":null},{"name":"03/01/2014 - 02/28/2015","value":0,"referenceValue":null}]},{"name":"High 2.50 - <7.50","series":[{"name":"03/01/2015 - 02/29/2016","value":1977,"referenceValue":null},{"name":"03/01/2014 - 02/28/2015","value":0,"referenceValue":null}]},{"name":"Very High >=7.50","series":[{"name":"03/01/2015 - 02/29/2016","value":316,"referenceValue":null},{"name":"03/01/2014 - 02/28/2015","value":0,"referenceValue":null}]}],"description":"Average risk score for DxCG Model #56 (Rx + All Medical Predicting Prospective Total Risk)"}

type RiskBucketData = {
    name: string,
    value: number,
    referenceValue: number
}[];

let riskDistributionData: Array<RiskBucketData> = response.value[0].series.map((d, periodIndex) => {
    return response.value.map(d => ({
        name: d.name,
        value: d.series[periodIndex].value,
        referenceValue: d.series[periodIndex].referenceValue
    }));
});

console.log('Risk Distribution data');
console.dir(riskDistributionData);


let riskScorePieData = {
    pieModels: riskDistributionData.map(periodData => {
        let totalMembers = periodData.reduce((acc, d) => acc + d.value, 0);
        return periodData.map(riskBucket => ({
            name: riskBucket.name,
            value: totalMembers > 0 ? 100 * riskBucket.value / totalMembers : 0,
            label: riskBucket.name,
            hoverLabel: `${riskBucket.name} <br> Members: ${riskBucket.value}`
        }))
    }),
    distinctNames: riskDistributionData[0].map(d => d.name),
    pieColorCodes: ["#00853D", "#28B067", "#EDE819", "#dc7471", "#D6312C"]
};

console.log('Pie chart data');
console.log(riskScorePieData);


console.log('Response');
console.log(response);



