import {describe, expect, test} from '@jest/globals';
import { generateContentfulId } from './contentful.util';

describe('contentfulId', () => {
    test('generates product-2 when passing product contentmodel and 2 as id', () => {
        expect(generateContentfulId('product', 2)).toBe('product-2');
    });

    test('generates a lower cased contentfulId', () => {
        expect(generateContentfulId('PrOdUct', 3)).toBe('product-3');
    });

    test('throws and error when id is 0', () => {
        expect(() => { generateContentfulId('PrOdUct', 0) }).toThrowError('id is required: bigger than zero argument - or a value - 0');
    });

    test('throws and error when contentmodel is empty', () => {
        expect(() => {  generateContentfulId('', 1) }).toThrowError('contentModel is a required filled in argument');
    });
});

