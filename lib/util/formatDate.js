/**
 * Format time to "M d, Y"
 *
 * @param {string} time
 * @returns {string} A formatted Date string (e.g. `Jul 5, 2020`).
 */
export const formatDate = (time) => {
    return new Date(time).toLocaleDateString(
        undefined,
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }
    );
};
