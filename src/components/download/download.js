// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import { Download as DownloadIcon } from 'react-bootstrap-icons';
import styles from './download.module.scss';

export default function Download(properties){
  return <button
      title={properties.title}
      onClick={ async () => await _Download.download(properties)}
      className={properties.text ? styles['button-text'] : styles['icon-button']}
      disabled={properties.disabled}
    >
      {properties.text || <DownloadIcon/>}
    </button>;
}

export class _Download {
  static async download(properties){
    const fileName = properties.fileName;
    const blob = await properties.blob(fileName);
    this._downloadBlob(blob, fileName);
  }

  static _downloadBlob(blob, fileName) {
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.style = 'display: none';
    link.href = url;
    link.download = fileName;

    document.body.append(link);
    link.click();
    link.remove();
  }
}
