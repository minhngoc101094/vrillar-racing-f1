import CanvasJSReact from '@/assets/canvasjs.react';
import _ from "lodash";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export interface Props {
    year?: string
    dataResult?: any
}

export const WrapChartTeam = (props: Props) => {
    const {year, dataResult} = props;

    const chartTeamStandings = {
        title: {
            text: "Constructor Standings " + `${year}`
        },
        axisY: {
            title: "PTS"
        },
        data: [
            {
                type: "column",
                dataPoints: _.map(dataResult, ft => {
                    return ({
                        label: ft.car, y: Number(ft.pts)
                    })
                })
            
            }
        ]
    }

    return (
        <CanvasJSChart options={chartTeamStandings}
                            /* onRef={ref => this.chart = ref} */
                        />
    )
}

export default WrapChartTeam