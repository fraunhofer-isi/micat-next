// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TextEncoder, TextDecoder } from 'node:util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const getPage = async (url) => {
  const response = await fetch(url, {
    mode: 'cors',
    method: 'GET',
    headers: {}
  }).catch(error => {
    throw error;
  });
  const text = await response.text().catch(error => {
    throw error;
  });
  return text;
};

const getDescriptionPage = async () => {
  const html = await getPage('https://micatool-dev.eu/mica-tool/documentation/chart-descriptions.php');
  const document_ = document.createElement('html');
  document_.innerHTML = html;
  return document_;
};

const getElementBox = (document_) => {
  const elementBox = [...document_.querySelectorAll('.elementBox')].filter((div) => {
    return (div.firstChild && div.firstChild.firstChild && div.firstChild.firstChild.textContent === 'Descriptions');
  });
  return elementBox;
};

let document_;
let elementBox;
let descriptionDivElement;
const diagramTitles = [
  'Health impact due to air pollution',
  'Lost work days due to air pollution',
  'Air pollution',
  'Greenhouse gas emissions',
  'Energy costs for consumers',
  'Energy poverty',
  'Primary savings by fuel',
  'Import dependency',
  'Energy Intensity',
  'Monetisation of health impact due to air pollution'
];

beforeAll(async () => {
  document_ = await getDescriptionPage();
  elementBox = getElementBox(document_);
  descriptionDivElement = elementBox[0].firstChild;
});
describe('Chart description page', () => {
  it('container is present', async () => {
    expect(elementBox.length).toBe(1);
    expect(elementBox[0].firstChild).toBeDefined();
  });
  it('description section is present', () => {
    const descriptionTitleElement = descriptionDivElement.children[0].firstChild;
    expect(descriptionTitleElement.tagName).toBe('H2');
    expect(descriptionTitleElement.textContent).toBe('Descriptions');
  });
  it('description titles are present', () => {
    const descriptions = [...descriptionDivElement.children].slice(1);
    for (const descriptionSection of descriptions) {
      expect(descriptionSection.firstChild.tagName).toBe('H3');
      expect(diagramTitles).toContain(descriptionSection.firstChild.textContent);
    }
  });
  it('descriptions are present', () => {
    const descriptions = [...descriptionDivElement.children].slice(1);
    for (const descriptionSection of descriptions) {
      const paragraphs = [...descriptionSection.children].slice(1);
      expect(paragraphs.length).toBeGreaterThan(0);
      expect(paragraphs[0].textContent.length).toBeGreaterThan(0);
      for(const paragraph of paragraphs) {
        expect(paragraph.tagName).toBe('P');
      }
    }
  });
});
