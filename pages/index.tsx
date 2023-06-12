import React, {useState, useEffect, useMemo} from "react";
import {Modal} from "antd";
import _ from "lodash";
import {GetServerSidePropsContext} from "next";
import {_Crawl} from "@/stores/actions";
import Loading from "@/components/Loading";
import WrapSearchRaceResult from "@/components/WrapSearchRaceResult";
import WrapRaceResult from "@/components/WrapRaceResult";
import {bindActionCreators} from "redux";
import {connect, useSelector} from "react-redux";
import styles from './styles.module.scss'
import {RootState} from "@/stores";

export interface Props {
}

export function Home(props: any) {
    const [loading, setLoading] = useState<boolean>(false);
    const [radioType, setRadioType] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [dataResult, setDataResult] = useState<any>([]);
    const [dataChart, setDataChart] = useState<any>([]);

    const [modal, contextHolder] = Modal.useModal();
    const {
        _Crawl
    } = props;

    const crawData = useSelector((state:any = RootState) => state.crawl);


    useEffect(() => {
        if (crawData && crawData.length > 0) {
            setLoading(false);
        } else {
            setLoading(true);
            _Crawl();
        }
    }, [crawData, _Crawl]);

    const onSearchResult = (values: any) => {
        setLoading(true);
        const radioType = values.itemType ? values.itemType : undefined;
        const year = values.itemYear ? values.itemYear.trim() : undefined;
        const team = values.itemTeam ? values.itemTeam : undefined;
        const driver = values.itemDriver ? values.itemDriver : undefined;
        const grand_prix = values.itemGrandPrix ? values.itemGrandPrix : undefined;
        const objYear = _.find(crawData, obj => obj.year === year);
        setRadioType(radioType);
        setYear(year);
        if (objYear) {
            if (radioType === "race") {
                if (team || driver || grand_prix) {
                    const filterRaceResult = _.filter(objYear.race_result,
                        obj => (team && !driver && !grand_prix ? obj.car === team : "")
                            || (team && driver && !grand_prix ? obj.car === team && obj.winner === driver : "")
                            || (team && !driver && grand_prix ? obj.car === team && obj.grand_prix === grand_prix : "")
                            || (team && driver && grand_prix ? obj.car === team && obj.winner === driver && obj.grand_prix === grand_prix : "")
                            || (driver && !team && !grand_prix ? obj.winner === driver : "")
                            || (driver && !team && grand_prix ? obj.winner === driver && obj.grand_prix === grand_prix : "")
                            || (grand_prix && !team && !driver ? obj.grand_prix === grand_prix : "")
                    );
                    setDataResult(filterRaceResult);
                } else {
                    setDataResult(objYear.race_result);
                }
            }
            if (radioType === "driver") {
                if (team || driver) {
                    const filterDriver = _.filter(objYear.driver_standings,
                        obj => (team && !driver ? obj.car === team : "")
                            || (team && driver ? obj.car === team && obj.driver === driver : "")
                            || (driver && !team ? obj.driver === driver : "")
                    );
                    setDataResult(filterDriver);
                } else {
                    setDataResult(objYear.driver_standings);
                }
            }
            if (radioType === "team") {
                if (team) {
                    const filterTeam = _.filter(objYear.team_standings,
                        obj => (obj.car === team)
                    );
                    setDataResult(filterTeam);
                } else {
                    setDataResult(objYear.team_standings);
                }
            }

        }
        setLoading(false);
    }

    const onSearchGraphic = (values: any) => {
        setLoading(true);
        const year = values.itemYear ? values.itemYear.trim() : undefined;
        const objYear = _.find(crawData, obj => obj.year === year);
        if (objYear) {
            setDataChart(objYear.driver_standings);
        }
        setLoading(false);
    }

    const yieldDataResult:any = useMemo(() => {
        if (dataResult.length > 0) {
            const temp: {
                key: number, grand_prix: string, date: string, winner: string,
                car: string, laps: string, time: string, pos: string, driver: string,
                nationality: string, pts: string
            }[] = [];
            dataResult.forEach((ft: any, indexFt : number) => {
                temp.push({
                    key: indexFt,
                    grand_prix: ft.grand_prix,
                    date: ft.date,
                    winner: ft.winner,
                    car: ft.car,
                    laps: ft.laps,
                    time: ft.time,
                    pos: ft.pos,
                    driver: ft.driver,
                    nationality: ft.nationality,
                    pts: ft.pts,
                });               
            });
            return temp;
        } else {
            return [];
        }
    }, [dataResult]);

    return (
        <>
            <div className={styles["blockHomePage"]}>
                <section className={styles["breadcrumbArea"]} style={{backgroundImage: `url("/breadcrumb_bg.jpg")`}}>
                </section>
                <section className={styles["resultArea"]}>
                    <div className={styles["wrapSearchRace"]}>
                        <WrapSearchRaceResult
                            loading={loading}
                            crawData={crawData}
                            onSearchResult={onSearchResult}
                            onSearchGraphic={onSearchGraphic}
                        />
                    </div>
                    <div className={styles["wrapResultRace"]}>
                        <WrapRaceResult
                            loading={loading}
                            radioType={radioType}
                            year={year}
                            dataResult={yieldDataResult}
                        />
                        {/*<div className="wrapResultChart">*/}
                        {/*    <canvas className="webgl"></canvas>*/}
                        {/*</div>*/}
                    </div>
                </section>
            </div>
            <Loading open={loading}/>
            {contextHolder}
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    let props = {
        meta: {
            key: 'home',
            title: 'Home page - Race F1',
            noindex: false,
            nofollow: false,
            description: 'Home page - Race F1',
            robotsProps: {}
        }
    }
    return {props}
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({_Crawl}, dispatch);
}

export default connect(null, mapDispatchToProps, null, {forwardRef: true})(Home);
