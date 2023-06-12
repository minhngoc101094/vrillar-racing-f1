import React from 'react'
import Image from "next/image";
import {Layout} from 'antd';
import Link from 'next/link';
import styles from "./styles.module.scss"

export interface Props {
}

export const Header = (props: Props) => {
    const {Header} = Layout;
    return (
        <>
            <Header className={styles['blockHeader']}>
                <Link href="/"><div className={styles['logo']}>
                    <Image src="/logo.png" alt={"test"} width={100} height={24}/>
                </div></Link>
            </Header>
        </>
    )
}

export default Header
