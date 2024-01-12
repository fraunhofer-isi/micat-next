// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import General from './general';

export default class Runtime extends General {
  constructor(frontEndSettings){
    super({
      frontEnd: frontEndSettings,
      backEnd: 'Error: This should only be used for front end at runtime.'
    });
  }

  async loadChartDescriptions() {
    try {
      const document_ = await this._descriptionDocument();
      const elementBox = Runtime._queryElementBox(document_);
      const descriptions = Runtime._extractDescriptions(elementBox);
      return descriptions;
    } catch(error) {
      const message = 'Failed to get chart descriptions.';
      console.error(message, error);
      return [];
    }
  }

  async _descriptionDocument(){
    const html = await this._fetchDescriptionPage();
    const parser = new DOMParser();
    const document_ = parser.parseFromString(html, 'text/html');
    return document_;
  }

  async _fetchDescriptionPage() {
    const url = this._settings.frontEnd.chartDescriptionsUrl;
    const response = await fetch(url, {
      mode: 'cors',
      method: 'GET'
    });
    const text = await response.text();
    return text;
  }

  static _queryElementBox(document_){
    const elementBoxes = Runtime._queryElementBoxes(document_);
    if(elementBoxes.length !== 1) {
      const message = 'Exactly one element box must exist. Descriptions will be empty.';
      throw new Error(message);
    }
    const elementBox = elementBoxes[0];
    return elementBox;
  }

  static _queryElementBoxes(document_){
    const elementBoxes = document_.querySelectorAll('.elementBox');
    const elementBoxesWithDescriptions = [...elementBoxes].filter(
      div => Runtime._containsDescription(div)
    );
    return elementBoxesWithDescriptions;
  }

  static _extractDescriptions(elementBox){
    const descriptionElement = elementBox.firstChild;
    const sections = descriptionElement.children;

    const descriptions = [];
    for (const section of sections) {
      const description = Runtime._extractDescriptionFromSection(section);
      if(description){
        descriptions.push(description);
      }
    }
    return descriptions;
  }

  static _containsDescription(div){
    const child = div.firstChild;
    if(!child){
      return false;
    }
    const grandChild = child.firstChild;
    if(!grandChild){
      return false;
    }
    return grandChild.textContent === 'Descriptions';
  }

  static _extractDescriptionFromSection(section){
    const containsHeader = this._containsH4Header(section);
    if(containsHeader) {
      const title = section.firstChild;
      const paragraphs = this._queryParagraphs(section);
      const descriptionText = this._joinParagraphs(paragraphs);

      const descriptionObject = {
        title,
        titleText: title.textContent,
        description: paragraphs,
        descriptionText
      };
      return descriptionObject;
    }
  }

  static _containsH4Header(section){
    const firstChild = section.firstChild;
    return (firstChild &&
      firstChild.tagName &&
      firstChild.tagName === 'H4');
  }

  static _queryParagraphs(section){
    const nodes = [...section.childNodes];
    const paragraphs = nodes.filter((node) => node.tagName === 'P');
    return paragraphs;
  }

  static _joinParagraphs(paragraphs){
    const texts = paragraphs.map((node) => node.textContent);
    const text = texts.join(' ').trim();
    return text;
  }
}
