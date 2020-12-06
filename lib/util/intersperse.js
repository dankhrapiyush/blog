/**
 * https://stackoverflow.com/a/23619085/1438863
 *
 * intersperse: Return an array with the separator interspersed between
 * each element of the input array.
 *
 * > _([1,2,3]).intersperse(0)
 * [1,0,2,0,3]
 *
 * @param {array} arr
 * @param {string} sep
 * @returns {array}
 */
export const intersperse = (arr, sep) => {
    if (arr.length === 0) {
        return [];
    }

    return arr.slice(1).reduce(
        function (xs, x, i) {
            return xs.concat([sep, x]);
        },
        [arr[0]]
    );
};
