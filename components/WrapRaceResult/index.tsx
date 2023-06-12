import React, {useMemo} from "react";
import _ from "lodash";
import {Empty, Table} from 'antd';
import WrapSkeletonTypeA from "@/components/WrapSkeletonTypeA";
import dynamic from 'next/dynamic';
import styles from "./styles.module.scss"

const WrapChartTeam = dynamic(() => import("@/components/WrapChartTeam"),  { ssr: false })
const WrapChartDriver = dynamic(() => import("@/components/WrapChartDriver"),  { ssr: false })

export interface Props {
    loading: boolean
    year: string
    radioType: string
    dataResult?: [{
        grand_prix?: string
        date?: string
        winner?: string
        car?: string
        laps: string
        time: string,
        pos: string,
        driver: string,
        nationality: string,
        pts: string,
        data: object
    }],
}

export const WrapRaceResult = (props: Props) => {
    const {loading, radioType, year, dataResult} = props;

    const columnRaceResult = useMemo(() => {
        return [
            {
                title: 'GRAND PRIX', dataIndex: 'grand_prix', key: 'grand_prix', width: '250px',
                render: (grand_prix: string) => (<>
                    <span className="fw-bold">{grand_prix}</span>
                </>)
            },
            {
                title: 'DATE', dataIndex: 'date', key: 'date', width: '250px',
                sorter: (a:any, b:any) => a.date > b.date
            },
            {
                title: 'WINNER', dataIndex: 'winner', key: 'winner', width: '250px',
                sorter: (a:any, b:any) => a.winner > b.winner
            },
            {
                title: 'CAR', dataIndex: 'car', key: 'car', width: '250px',
                sorter: (a:any, b:any) => a.car > b.car
            },
            {
                title: 'LAPS', dataIndex: 'laps', key: 'laps', width: '250px',
                sorter: (a:any, b:any) => a.laps > b.laps
            },
            {
                title: 'TIME', dataIndex: 'time', key: 'time', width: '250px',
                sorter: (a:any, b:any) => a.time > b.time
            }
        ];
    }, []);

    const columnDriverStandings = useMemo(() => {
        return [
            {
                title: 'POS', dataIndex: 'pos', key: 'pos', width: '250px',
                render: (pos: string) => (<>
                    <span className="fw-bold">{pos}</span>
                </>)
            },
            {
                title: 'DRIVER', dataIndex: 'driver', key: 'driver', width: '250px',
                sorter: (a:any, b:any) => a.driver > b.driver
            },
            {
                title: 'NATIONALITY', dataIndex: 'nationality', key: 'nationality', width: '250px',
                sorter: (a:any, b:any) => a.nationality > b.nationality
            },
            {
                title: 'CAR', dataIndex: 'car', key: 'car', width: '250px',
                sorter: (a:any, b:any) => a.car > b.car
            },
            {
                title: 'PTS', dataIndex: 'pts', key: 'pts', width: '250px',
                sorter: (a:any, b:any) => a.pts > b.pts
            }
        ];
    }, []);

    const columnTeamStandings = useMemo(() => {
        return [
            {
                title: 'POS', dataIndex: 'pos', key: 'pos', width: '250px',
                render: (pos: string) => (<>
                    <span className="fw-bold">{pos}</span>
                </>)
            },
            {
                title: 'TEAM', dataIndex: 'car', key: 'car', width: '800px',
                sorter: (a:any, b:any) => a.car > b.car
            },
            {
                title: 'PTS', dataIndex: 'pts', key: 'pts', width: '250px',
                sorter: (a:any, b:any) => a.pts > b.pts
            }
        ];
    }, []);

    const yieldDataResult = useMemo(() => {
        if (loading) {
            return (<WrapSkeletonTypeA classDesc={styles["desc"]} classWrapItem={styles["wrapItem"]} quantity={15}/>);
        }
        if (dataResult && dataResult.length) {
            return (
                <Table
                    columns ={radioType === "race" ? columnRaceResult : radioType === "driver" ? columnDriverStandings : columnTeamStandings}
                    className={styles["antd-table-style antd-table-custom"]}
                    pagination={false}
                    dataSource={dataResult}/>
            )
        } else {
            return <Empty description={false}/>;
        }
    }, [dataResult, loading]);

    return (
        < >
            <div className={styles["resultRace"]}>
                <div className={styles["wrapListItem"]}>
                    {yieldDataResult}
                </div>
                <div className={styles["wrapChart"]}>
                    {radioType === "team" && dataResult?.length ?
                        <WrapChartTeam year={year} dataResult = {dataResult}/>
                        : null}
                    {radioType === "driver" && dataResult?.length ?
                        <WrapChartDriver year={year} dataResult = {dataResult}/>
                        : null}

                </div>
            </div>
        </>
    )
}

export default WrapRaceResult
