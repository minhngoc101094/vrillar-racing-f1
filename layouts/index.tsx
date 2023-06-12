import React, {ReactElement, ReactNode} from "react";
import {MainLayout} from "./Main"

export const getMainLayout = (page: ReactElement, props: any): ReactNode => {
    return <MainLayout {...props}>{page}</MainLayout>
}

export default getMainLayout;
