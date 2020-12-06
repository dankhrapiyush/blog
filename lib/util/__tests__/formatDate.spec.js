import { formatDate } from '../formatDate';

test('returns a formatted date', () => {
    const time = '2020-07-05 00:00:00';

    expect(formatDate(time)).toBe('5 Jul 2020');
});
