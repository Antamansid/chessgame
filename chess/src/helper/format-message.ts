import moment from 'moment';

export default function formatMessage(nickname: string, msg: string) {
  return {
    nickname,
    msg,
    dateMsg: moment().format('DD.MM.YYYY HH:mm')
  };
}