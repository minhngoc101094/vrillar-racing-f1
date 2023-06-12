import CanvasJSReact from '@/assets/canvasjs.react';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export interface Props {
    year?: string
    dataResult?: any
}

export const WrapChartDriver = (props: Props) => {
    const {year, dataResult} = props;

    const chartDriverStandings = {
        animationEnabled: true,
        title: {
            text: "Driver Standings " + `${year}`
        },
        axisY2: {
            title: "PTS"
        },
        data: [
            {
                type: "bar",
                axisYType: "secondary",
                color: "#014D65",
                dataPoints: _.map(dataResult, ft => {
                    return ({
                        label: `${ft.driver}`, y: Number(ft.pts)
                    })
                })
            
            }
        ]
    }

    return (
        <CanvasJSChart options={chartDriverStandings}/>
    )
}

export default WrapChartDriver