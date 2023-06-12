import React, {Fragment} from "react";
import ReactLoading from "react-loading";
// import {URL} from "../../../constants/Path";
import styles from "./styles.module.scss"

export interface Props {
    open?: any
}

export const Loading = (props: Props) => {
    //*** Declare props ***//
    const {open} = props;
    let yieldLoading: any = "";
    if (open) {
        yieldLoading = (<div className={styles["panel-loading"]}>
            <ReactLoading className={styles["loading"]} color={"rgb(32 85 39)"} type={"spin"}/>
            {/*<img src={URL.IMG + "loading.png"} alt=""/>*/}
        </div>);
    }
    return (
        <Fragment>{yieldLoading}</Fragment>
    );
};

export default Loading;
