// © 2024, 2025 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Runtime from '../../src/server/runtime';
describe('main', () => {
  let sut;
  beforeEach(() => {
    sut = new Runtime('mockedSettings');
  });

  describe('loadChartDescriptions', () => {
    it('without error', async () => {
      spyOn(sut, '_descriptionDocument');
      spyOn(Runtime, '_queryElementBox').and.returnValue('mocked_elementBox');
      spyOn(Runtime, '_extractDescriptions').and.returnValue('mocked_descriptions');

      const descriptions = await sut.loadChartDescriptions();

      expect(descriptions).toBe('mocked_descriptions');
    });

    it('with error', async () => {
      spyOn(sut, '_descriptionDocument').and.callFake(() => { throw new Error('mocked_error'); });
      spyOn(console, 'error');
      const descriptions = await sut.loadChartDescriptions();
      expect(descriptions).toStrictEqual([]);
    });
  });

  it('_descriptionDocument', async () => {
    spyOn(sut, '_fetchDescriptionPage').and.returnValue('<html></html>');
    const document_ = await sut._descriptionDocument();
    expect(document_).toBeDefined();
  });

  it('_fetchDescriptionPage', async () => {
    const mockedSettings = {
      frontEnd: {
        chartDescriptionsUrl: 'mocked_url'
      }
    };
    sut._settings = mockedSettings;

    const responseMock = {
      text: async() => 'mocked_text'
    };
    spyOn(window, 'fetch').and.callFake(async () => responseMock);

    const text = await sut._fetchDescriptionPage();

    expect(text).toBe('mocked_text');
  });

  describe('_queryElementBox ', () => {
    it('single element box', () => {
      spyOn(Runtime, '_queryElementBoxes').and.returnValue(['mocked_elementBox']);
      const result = Runtime._queryElementBox('mocked_document');
      expect(result).toBe('mocked_elementBox');
    });

    it('missing element box', () => {
      spyOn(Runtime, '_queryElementBoxes').and.returnValue([]);
      expect(() => Runtime._queryElementBox('mocked_document')).toThrowError();
    });
  });

  it('_queryElementBoxes', () => {
    const mockedDocument = {
      querySelectorAll: () => ['mocked_elementBox', 'mocked_elementBox']
    };
    spyOn(Runtime, '_containsDescription').and.returnValue(true);
    const result = Runtime._queryElementBoxes(mockedDocument);
    expect(result).toStrictEqual(['mocked_elementBox', 'mocked_elementBox']);
  });

  describe('_extractDescriptions', () => {
    it('with description ', () => {
      const mockedElementBox = {
        firstChild: {
          children: ['mocked_section', 'mocked_section']
        }
      };
      spyOn(Runtime, '_extractDescriptionFromSection').and.returnValue('mocked_description');
      const result = Runtime._extractDescriptions(mockedElementBox);
      expect(result).toStrictEqual(['mocked_description', 'mocked_description']);
    });

    it('without description ', () => {
      const mockedElementBox = {
        firstChild: {
          children: ['mocked_section', 'mocked_section']
        }
      };
      spyOn(Runtime, '_extractDescriptionFromSection');
      const result = Runtime._extractDescriptions(mockedElementBox);
      expect(result).toStrictEqual([]);
    });
  });

  describe('_containsDescription', () => {
    it('without child', () => {
      const mockedDiv = {
        firstChild: undefined
      };

      const result = Runtime._containsDescription(mockedDiv);
      expect(result).toBe(false);
    });

    it('without grand child', () => {
      const mockedDiv = {
        firstChild: {
          firstChild: undefined
        }
      };

      const result = Runtime._containsDescription(mockedDiv);
      expect(result).toBe(false);
    });

    it('with different content', () => {
      const mockedDiv = {
        firstChild: {
          firstChild: {
            textContent: 'Foo'
          }
        }
      };

      const result = Runtime._containsDescription(mockedDiv);
      expect(result).toBe(false);
    });

    it('normal usage', () => {
      const mockedDiv = {
        firstChild: {
          firstChild: {
            textContent: 'Descriptions'
          }
        }
      };

      const result = Runtime._containsDescription(mockedDiv);
      expect(result).toBe(true);
    });
  });

  describe('_extractDescriptionFromSection', () => {
    it('with header ', async () => {
      const mockedTitleElement = {
        textContent: 'mocked_title'
      };

      const mockedSection = {
        firstChild: mockedTitleElement
      };

      spyOn(Runtime, '_containsH4Header').and.returnValue(true);
      spyOn(Runtime, '_queryParagraphs').and.returnValue('mocked_paragraphs');
      spyOn(Runtime, '_joinParagraphs').and.returnValue('mocked_text');
      const result = Runtime._extractDescriptionFromSection(mockedSection);
      expect(result.titleText).toBe('mocked_title');
      expect(result.descriptionText).toBe('mocked_text');
    });

    it('without header ', async () => {
      spyOn(Runtime, '_containsH4Header').and.returnValue(false);
      const result = Runtime._extractDescriptionFromSection('mocked_section');
      expect(result).toBeUndefined();
    });
  });

  describe('_containsH4Header', () => {
    it('without child ', () => {
      const mockedSection = {
        firstChild: undefined
      };
      const result = Runtime._containsH4Header(mockedSection);
      expect(result).toBeFalsy();
    });

    it('without tagName ', () => {
      const mockedSection = {
        firstChild: {
          tagName: undefined
        }
      };
      const result = Runtime._containsH4Header(mockedSection);
      expect(result).toBeFalsy();
    });

    it('with different header', () => {
      const mockedSection = {
        firstChild: {
          tagName: 'H1'
        }
      };
      const result = Runtime._containsH4Header(mockedSection);
      expect(result).toBe(false);
    });

    it('normal usage', () => {
      const mockedSection = {
        firstChild: {
          tagName: 'H4'
        }
      };
      const result = Runtime._containsH4Header(mockedSection);
      expect(result).toBe(true);
    });
  });

  it('_queryParagraphs ', () => {
    const mockedSection = {
      childNodes: [
        { tagName: 'P' },
        { tagName: 'DIV' }
      ]
    };
    const result = Runtime._queryParagraphs(mockedSection);
    expect(result.length).toBe(1);
    expect(result[0].tagName).toBe('P');
  });

  it('_joinParagraphs ', () => {
    const mockedParagraphs = [
      { textContent: '  foo' },
      { textContent: 'baa  ' }
    ];

    const result = Runtime._joinParagraphs(mockedParagraphs);
    expect(result).toBe('foo baa');
  });
});
