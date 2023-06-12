import React, {useMemo} from "react";
import _ from "lodash";
import {Skeleton} from "antd";

export interface Props {
    rows?: number
    classWrapItem: any
    classDesc: any
    quantity: number
}

export const WrapSkeletonTypeA = (props: Props) => {
    const {rows, classWrapItem, classDesc, quantity} = props;

    const yieldSkeleton = useMemo(() => {
        let tempQty = [];
        for (let i = 0; i < quantity; i++) {
            tempQty.push(i)
        }
        return _.map(tempQty, (ft) => {
            return (<div key={ft} className={classWrapItem}>
                <Skeleton.Image active/>
                <div className={classDesc}>
                    <Skeleton active paragraph={{rows: rows ? rows : 2, width: "100%"}}/>
                </div>
            </div>)
        });
    }, [rows, classDesc, classWrapItem, quantity]);

    return (
        <>
            {yieldSkeleton}
        </>
    )
}

export default WrapSkeletonTypeA
