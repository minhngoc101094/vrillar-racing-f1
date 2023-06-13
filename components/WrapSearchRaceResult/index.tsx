import React, {useEffect, useState} from "react";
import moment from "moment";
import _ from "lodash";
import {dataType} from "@/constants/data";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/stores";
import {Button, Checkbox, Col, Form, Input, Row, Radio, Select} from "antd";
import type {CheckboxChangeEvent} from 'antd/es/checkbox';
import styles from "./styles.module.scss"

export interface Props {
    loading: boolean
    onSearchResult: (values: any) => void,
    crawData?: [{
        year?: string
        link?: string
        race_result?: [{
            grand_prix?: string
            date?: string,
            winner?: string,
            car?: string,
            laps?: number,
            time?: string
        }],
        driver_standings?: [{
            pos?: number,
            driver?: string,
            nationality?: string,
            car?: string,
            pts?: string
        }],
        team_standings?: [{
            pos?: number,
            car?: string,
            pts?: string
        }],
    }],
}

export const WrapSearchRaceResult = (props: Props) => {
    const [type, setType] = useState<string>("");
    const [isDisabledRadio, setIsDisabledRadio] = useState<boolean>(true);
    const [hideFrmTeam, setHideFrmTeam] = useState<boolean>(false);
    const [hideFrmDriver, setHideFrmDriver] = useState<boolean>(false);
    const [hideFrmGrandPrix, setHideFrmGrandPrix] = useState<boolean>(false);
    const [listYear, setListYear] = useState<any>([]);
    const [listTeam, setListTeam] = useState<any>([]);
    const [listDriver, setListDriver] = useState<any>([]);
    const [listGrandPrix, setListGrandPrix] = useState<any>([]);


    const {loading, onSearchResult, crawData} = props;

    const [form] = Form.useForm();

    useEffect(() => {
        if (crawData && crawData.length > 0) {
            let tmpListYear:{}[] = [];
            crawData.forEach(val => {
                tmpListYear.push({value: val.year, label: val.year});
            });
            setListYear(tmpListYear);
        }
    }, [crawData]);

    const onChangeYear = (value: string) => {
        setIsDisabledRadio(false);
        form.setFieldsValue({
            itemType: "race"
        });
        setType("race")
    };

    const onChangeTeam = (value: string) => {
        // console.log(`selected ${value}`);
    };

    const onChangeGrandPrix = (value: string) => {
        // console.log(`selected ${value}`);
    };

    const onChangeType = (e: CheckboxChangeEvent) => {
        let value;
        if (e.target.checked) {
            value = e.target.value;
            const itemYear = form.getFieldsValue(["itemYear"]).itemYear;
            const findData = _.find(crawData, obj => obj.year === itemYear);
            if (findData) {
                let tmpListTeam:{}[] = [];
                let tmpListDriver:{}[] = [];
                let tmpListGrandPrix:{}[] = [];
                if (value === "race") {
                    if (findData.race_result && findData.race_result.length) {
                        findData.race_result.forEach(val => {
                            tmpListTeam.push({value: val.car, label: val.car});
                            tmpListDriver.push({value: val.winner, label: val.winner});
                            tmpListGrandPrix.push({value: val.grand_prix, label: val.grand_prix});
                        });
                    }
                    tmpListGrandPrix = _.uniqBy(tmpListGrandPrix, "value");
                    setHideFrmGrandPrix(false);
                    setHideFrmDriver(false);
                    setHideFrmTeam(false);
                }
                if (value === "driver") {
                    if (findData.driver_standings && findData.driver_standings.length) {
                        findData.driver_standings.forEach(val => {
                            tmpListTeam.push({value: val.car, label: val.car});
                            tmpListDriver.push({value: val.driver, label: val.driver});
                        });
                    }
                    setHideFrmGrandPrix(true);
                    setHideFrmDriver(false);
                }
                if (value === "team") {
                    if (findData.team_standings && findData.team_standings.length) {
                        findData.team_standings.forEach(val => {
                            tmpListTeam.push({value: val.car, label: val.car});
                        });
                    }
                    setHideFrmGrandPrix(true);
                    setHideFrmDriver(true);
                }
                tmpListTeam = _.uniqBy(tmpListTeam, "value");
                tmpListDriver = _.uniqBy(tmpListDriver, "value");

                setListTeam(tmpListTeam);
                setListDriver(tmpListDriver);
                setListGrandPrix(tmpListGrandPrix);
            }
        } else {
            value = undefined;
        }
    
        form.resetFields([
            'itemTeam',
            'itemDriver',
            'itemGrandPrix',
        ]);
        form.setFieldsValue({
            itemType: value
        });
    }
    return (
        <>
            <div className={styles["formSearchRace"]}>
                <h2 className={styles["title"]}>Search Race Result</h2>
                <Form onFinish={onSearchResult}
                      form={form}
                      size="large"
                      name="formSearchRace">
                    <Form.Item label="Year"
                               name="itemYear"
                               rules={[{required: true, message: "Please choose year"}]}>
                        <Select
                            showSearch
                            allowClear
                            placeholder="Select a year"
                            optionFilterProp="year"
                            onChange={onChangeYear}
                            filterOption={(input: string, option: any) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={listYear}
                        />
                    </Form.Item>
                    {" "}
                    <Form.Item label="Type" name="itemType" hidden={true}><Input type="text"/></Form.Item>
                    {" "}
                    <Form.Item label="Type"
                               name="itemType">
                        <Radio.Group value={type ? type : ""}
                                     disabled={isDisabledRadio}
                                     onChange={onChangeType}>
                            {dataType().map((item) => {
                                return (
                                    <Radio key={item.value} value={item.value}>{item.label}</Radio>
                                )
                            })}
                        </Radio.Group>
                    </Form.Item>
                    {" "}
                    {
                        !hideFrmTeam ?
                            <Form.Item label="Team"
                                       name="itemTeam">
                                <Select
                                    showSearch
                                    allowClear
                                    disabled={!type}
                                    placeholder="Select a team"
                                    optionFilterProp="team"
                                    onChange={onChangeTeam}
                                    filterOption={(input: string, option: any) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={listTeam}
                                />
                            </Form.Item> : null
                    }
                    {" "}
                    {
                        !hideFrmDriver ?
                            <Form.Item label="Driver"
                                       name="itemDriver">
                                <Select
                                    showSearch
                                    allowClear
                                    disabled={!type}
                                    placeholder="Select a driver"
                                    optionFilterProp="driver"
                                    // onChange={onChangeTeam}
                                    filterOption={(input: string, option: any) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={listDriver}
                                />
                            </Form.Item> : null
                    }
                    {" "}
                    {
                        !hideFrmGrandPrix ?
                            <Form.Item label="Grand Prix"
                                       name="itemGrandPrix">
                                <Select
                                    showSearch
                                    allowClear
                                    disabled={!type}
                                    placeholder="Select a grand prix"
                                    optionFilterProp="grand pix"
                                    onChange={onChangeGrandPrix}
                                    filterOption={(input: string, option: any) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={listGrandPrix}
                                />
                            </Form.Item> : null
                    }
                    {" "}
                    <Form.Item className="wrap-form-action">
                        <div className="box-button-event">
                            <Button loading={loading}
                                    className="btn-accept"
                                    htmlType="submit">
                                <span>Search</span>
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}

export default WrapSearchRaceResult
