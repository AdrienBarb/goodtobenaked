import React, { FC } from 'react'
import styles from '@/styles/SettingSectionHeader.module.scss'
import clsx from 'clsx'

interface SettingSectionHeaderProps {
    title: string;
    subTitle?: string;
    type: 'main' | 'sub'
}

const SettingSectionHeader: FC<SettingSectionHeaderProps> = ({ title, subTitle, type }) => {

    return (
        <div className={clsx(styles.container, type === 'main' ? styles.mainMenu : styles.subMenu)}>
            <div className={styles.title}>{title}</div>
            {subTitle && <div className={styles.subTitle}>{subTitle}</div>}
        </div>
    )
}

export default SettingSectionHeader




