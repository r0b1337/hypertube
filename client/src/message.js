import FrDatas from './json/fr.json';
import EnDatas from './json/en.json';

const tabLanguage = {
  "fr": FrDatas,
  "en": EnDatas,
};

function Message(id) {
    var msgData = tabLanguage[localStorage.getItem('language')];
    if (msgData === undefined)
      msgData = EnDatas;
    return msgData[id];
}

export default Message;
