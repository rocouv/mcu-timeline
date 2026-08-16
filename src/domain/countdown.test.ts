import { describe, expect, it } from 'vitest';
import { getCountdownParts } from './countdown';

describe('getCountdownParts', () => {
  it('breaks the time remaining into days, hours, minutes and seconds', () => {
    const target = new Date('2026-12-18T00:00:00');
    const now = new Date('2026-12-16T01:02:03');

    expect(getCountdownParts(target, now)).toMatchObject({ days: 1, hours: 22, minutes: 57, seconds: 57 });
  });

  it('does not return negative values after the target date', () => {
    const target = new Date('2026-12-18T00:00:00');

    expect(getCountdownParts(target, new Date('2026-12-19T00:00:00'))).toEqual({ totalMilliseconds: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});
