// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';
import styles from './modal.module.scss';

export default function Modal(properties) {
  const showModal = properties.showModal;
  const title = properties.title;
  const closeButtonTitle = properties.closeButtonTitle;
  const onClose = properties.onClose;
  const text = properties.text;
  if (!showModal) {
    return (
      <>
      {/* Nothing will be rendered when showModal is false */}
      </>
    );
  }
  return (
    <div onClick={onClose} className={styles.overlay}>
      <div
        onClick={event => {
          event.stopPropagation();
        }}
        className={styles.modalContainer}
      >
        <div className={styles.contentContainer}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.children}>
            <p>{text}</p>
            <p>{properties.children}</p>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={onClose}>
              {closeButtonTitle}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
