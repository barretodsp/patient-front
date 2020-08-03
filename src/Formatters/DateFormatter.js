import moment from 'moment';

const DateFormater = param => {
  return moment(param.value).format('DD/MM/YYYY')
}

export default DateFormater;