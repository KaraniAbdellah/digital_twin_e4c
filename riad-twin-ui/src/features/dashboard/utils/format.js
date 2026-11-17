export const formatNumber = (value) =>
  value === null || value === undefined ? '–' : Number(value).toFixed(1)
