import wnumb from 'wnumb';

const moneyFormat = wnumb({
  mark: '.',
  thousand: ',',
  prefix: '₦',
  decimals: 2,
});

export default moneyFormat;