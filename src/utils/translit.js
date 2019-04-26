function trim ( str, charlist ) {
  let newCharList = charlist;
  newCharList = !newCharList ? ' \xA0' : newCharList.replace(/[\]:]/g, '1');
  const re = new RegExp('^[' + newCharList + ']+|[' + newCharList + ']+$', 'g');
  return str.replace(re, '');
}

const dict = {
  'а': 'a', 'ый': 'iy', 'ые': 'ie', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
  'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh',
  'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'йо': 'yo', 'ï': 'i',
  'í': 'i', 'Ғ': 'gh', 'à': 'a', 'ғ': 'gh', 'ү': 'y', 'Ң': 'ng', 'Ұ': 'u', 'é': 'e',
  'ê': 'e', 'è': 'e', 'Ү': 'u', 'Һ': 'h', 'û': 'u', 'ç': 'c', 'е́': 'e', 'һ': 'h', 'қ': 'q',
  'ң': 'ng', 'ұ': 'y', 's': 's', 'Ә': 'e', 'ә': 'e', 'ө': 'o', 'Қ': 'q', 'Ө': 'o', 'А': 'A',
  'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y',
  'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
  'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ь': '', 'Ы': 'Y', 'Ъ': '',
  'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
};

function translit(str) {
  let newStr = str;

  for (let i = 0; i < newStr.length; i++) {
    let f = newStr.charAt(i),
      r = dict[f];
    if (r !== undefined) {
      newStr = newStr.replace(new RegExp(f, 'g'), r);
    }
  }

  newStr = newStr.toLowerCase();
  newStr = newStr.replace(/[^-a-z0-9_]+/ug, '-');
  newStr = trim(newStr, '-');
  newStr = newStr.replace(/(-){2,}/g, '-');

  return newStr;
}

module.exports = {
  translit
};
