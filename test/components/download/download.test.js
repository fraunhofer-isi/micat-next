// © 2024-2026 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Download, { _Download } from '../../../src/components/download/download';

describe('main', () => {
  let sutButton;
  let sutText;
  beforeEach(() => {
    const properties = {
      title: 'mocked_title',
      fileName: 'mocked_file_name',
      blob: () => {}
    };
    sutButton = Download(properties);
    properties.text = 'mocked_text';
    sutText = Download(properties);
  });

  it('construction', () => {
    expect(sutButton).toBeDefined();
    expect(sutText).toBeDefined();
  });

  it('onClick', async () => {
    const onClick = sutButton.props.onClick;
    spyOn(_Download, 'download');
    await onClick();
    expect(_Download.download).toHaveBeenCalled();
  });
});

describe('_Download', () => {
  it('download', async () => {
    const properties = {
      fileName: 'mocked_fileName',
      blob: async () => {}
    };
    spyOn(properties, 'blob');
    spyOn(_Download, '_downloadBlob');

    await _Download.download(properties);
    expect(properties.blob).toHaveBeenCalled();
    expect(_Download._downloadBlob).toHaveBeenCalled();
  });

  it('_downloadBlob', () => {
    window.URL = {
      createObjectURL: () => {}
    };
    spyOn(window.URL, 'createObjectURL');
    _Download._downloadBlob('mocked_blob', 'mocked_fileName');

    expect(window.URL.createObjectURL).toHaveBeenCalled();
  });
});
