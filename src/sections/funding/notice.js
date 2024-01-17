// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/* eslint-disable max-lines */

import React from 'react';
import Image from 'next/image';
import styles from './notice.module.scss';

export default function Notice() {
  return <div className={styles['micat-funding-notice']}>
      <Image
        src="https://micatool.eu/micat-project-wAssets/img/weblication/wThumbnails/eu-flag-2c3b0581-543393bb@97ll.png"
        alt="eu-flag"
        width="97"
        height="64"
      />
      <div>
        This project has received funding from the European<br/>
        Union’s Horizon 2020 research and innovation programme<br/>
        under grant agreement No. 101000132.
      </div>
  </div>
}