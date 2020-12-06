import { intersperse } from '../intersperse';

test('returns an array with the separator', () => {
    const arr = [1, 2, 3];
    const sep = 0;

    expect(intersperse(arr, sep)).toEqual([1, 0, 2, 0, 3]);
});
