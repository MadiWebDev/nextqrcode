import { describe, expect, it } from 'vitest';
import { parseCsv, toCsv } from '../csv';

describe('parseCsv', () => {
  it('parses simple rows and CRLF', () => {
    expect(parseCsv('a,b,c\r\n1,2,3')).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ]);
  });
  it('handles quoted commas, quotes and newlines', () => {
    const rows = parseCsv('name,note\n"Acme, Inc","He said ""hi""\nthen left"');
    expect(rows[1]).toEqual(['Acme, Inc', 'He said "hi"\nthen left']);
  });
  it('strips a BOM and drops blank rows', () => {
    expect(parseCsv('\uFEFFa,b\n\n1,2\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });
  it('round-trips with toCsv', () => {
    const data = [
      ['Name', 'Note'],
      ['A, B', 'x "y" z'],
      ['plain', 'multi\nline'],
    ];
    expect(parseCsv(toCsv(data))).toEqual(data);
  });
});
