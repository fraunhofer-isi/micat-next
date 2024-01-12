// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import styles from './parameters.module.scss';

import Download from '../../../components/download/download';
import ExcelUpload from '../../../components/upload/excel-upload';

export default function Parameters(properties) {
  return <div className={styles.parameters}>
        <Download
          title="Download parameters_template.xlsx"
          fileName="micat_parameters_template.xlsx"
          blob={async fileName => await properties.templateBlob(fileName)}
        />

        <ExcelUpload
          title={'Click and select or drop *.xlsx file to upload optional parameters'}
          onlyFirstSheet={false}
          change={jsonData => properties.change(jsonData)}
          allowWithoutContext={true}
        />
    </div>;
}
