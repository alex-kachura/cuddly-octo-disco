export const formatMoney = (amount, currency) =>
  `${amount.toFixed().toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')} ${currency}`
