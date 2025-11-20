export type Language = 'uz' | 'uz-cyrl' | 'ru'

export interface Translations {
  header: {
    title: string
    subtitle: string
  }
  footer: {
    copyright: string
  }
  form: {
    fio: {
      label: string
      placeholder: string
    }
    telefon: {
      label: string
      placeholder: string
    }
    tumanShahar: {
      label: string
      placeholder: string
    }
    manzil: {
      label: string
      placeholder: string
    }
    murojaatMazmuni: {
      label: string
      placeholder: string
    }
    tashkilot: {
      label: string
      placeholder: string
    }
    submitButton: string
    successMessage: string
    required: string
  }
  tumanlar: string[]
  tashkilotlar: string[]
}

export const translations: Record<Language, Translations> = {
  uz: {
    header: {
      title: 'Jizzax Viloyati Kuz-Qish Shtabi',
      subtitle: 'Mavsumiy murojaatlarni qabul qilish uchun maxsus'
    },
    footer: {
      copyright: '© 2024 Jizzax Viloyati Kuz-Qish Shtabi'
    },
    form: {
      fio: {
        label: 'Murojaat muallifining F.I.SH',
        placeholder: 'Familiya Ism Otasining ismi'
      },
      telefon: {
        label: 'Murojaat muallifining telefon raqami',
        placeholder: '+998 XX XXX XX XX'
      },
      tumanShahar: {
        label: 'Murojaatni qabul qilgan tegishli tuman yoki shahar',
        placeholder: 'Tanlang...'
      },
      manzil: {
        label: 'Murojaat muallifining yashash manzili',
        placeholder: "Mahalla, ko'cha, uy raqami"
      },
      murojaatMazmuni: {
        label: 'Murojaat mazmuni',
        placeholder: 'Murojaatingiz mazmunini batafsil yozing...'
      },
      tashkilot: {
        label: 'Murojaat tegishli tashkilot yoki korxona',
        placeholder: 'Tanlang...'
      },
      submitButton: 'Murojaatni Yuborish',
      successMessage: 'Murojaatingiz muvaffaqiyatli qabul qilindi!',
      required: '*'
    },
    tumanlar: [
      'Arnasoy',
      'Baxmal',
      'Do\'stlik',
      'Paxtakor',
      'Zarbdor',
      'Zafarobot',
      'Zomin',
      'Sharof Rashidov',
      'Forish',
      'Mirzacho\'l',
      'Jizzax Shahar',
      'Jizzax viloyati'
    ],
    tashkilotlar: [
      'jizzax suv ta\'minoti AJ',
      'Ekalogiya boshqarmasi',
      'Qurilish va uy-joy kommunal xo\'jaligi bosh boshqarmasi',
      'XET korxonasi',
      'Ijtimoiy soha',
      'issiqlik Manbai MCHJ',
      'Ko\'mir ta\'minoti',
      'Boshqalar'
    ]
  },
  ru: {
    header: {
      title: 'Жизакская Область Осенне-Зимний Штаб',
      subtitle: 'Специально для приема сезонных обращений'
    },
    footer: {
      copyright: '© 2024 Жизакская Область Осенне-Зимний Штаб'
    },
    form: {
      fio: {
        label: 'Ф.И.О. автора обращения',
        placeholder: 'Фамилия Имя Отчество'
      },
      telefon: {
        label: 'Номер телефона автора обращения',
        placeholder: '+998 XX XXX XX XX'
      },
      tumanShahar: {
        label: 'Соответствующий район или город приема обращения',
        placeholder: 'Выберите...'
      },
      manzil: {
        label: 'Адрес проживания автора обращения',
        placeholder: 'Махалля, улица, номер дома'
      },
      murojaatMazmuni: {
        label: 'Содержание обращения',
        placeholder: 'Подробно опишите содержание вашего обращения...'
      },
      tashkilot: {
        label: 'Соответствующая организация или предприятие обращения',
        placeholder: 'Выберите...'
      },
      submitButton: 'Отправить обращение',
      successMessage: 'Ваше обращение успешно принято!',
      required: '*'
    },
    tumanlar: [
      'Арнасай',
      'Бахмал',
      'Дустлик',
      'Пахтакор',
      'Зарбдор',
      'Зафаробот',
      'Зомин',
      'Шароф Рашидов',
      'Фариш',
      'Мирзачўль',
      'Жизак Шахар',
      'Жизакская область'
    ],
    tashkilotlar: [
      'Жизак сув таъминоти АЖ',
      'Экология бошқармаси',
      'Бош бошқарма қурилиш ва уй-жой коммунал хўжалиги',
      'ХЕТ корхонаси',
      'Ижтимоий соҳа',
      'Иссиқлик Манбаи МЧЖ',
      'Кўмир таъминоти',
      'Бошқалар'
    ]
  },
  'uz-cyrl': {
    header: {
      title: 'Жиззах Вилояти Кўз-Қиш Штаби',
      subtitle: 'Мавсумий мурожаатларни қабул қилиш учун махсус'
    },
    footer: {
      copyright: '© 2024 Жиззах Вилояти Кўз-Қиш Штаби'
    },
    form: {
      fio: {
        label: 'Мурожаат муаллифининг Ф.И.Ш',
        placeholder: 'Фамилия Исм Отасининг исми'
      },
      telefon: {
        label: 'Мурожаат муаллифининг телефон рақами',
        placeholder: '+998 XX XXX XX XX'
      },
      tumanShahar: {
        label: 'Мурожаатни қабул қилган тегишли туман ёки шаҳар',
        placeholder: 'Танланг...'
      },
      manzil: {
        label: 'Мурожаат муаллифининг яшаш манзили',
        placeholder: 'Махалла, кўча, уй рақами'
      },
      murojaatMazmuni: {
        label: 'Мурожаат мазмуни',
        placeholder: 'Мурожатингиз мазмунини батафсил ёзинг...'
      },
      tashkilot: {
        label: 'Мурожаат тегишли ташкилот ёки корхона',
        placeholder: 'Танланг...'
      },
      submitButton: 'Мурожаатни Юбориш',
      successMessage: 'Мурожатингиз муваффақиятли қабул қилинди!',
      required: '*'
    },
    tumanlar: [
      'Арнасой',
      'Бахмал',
      'Дўстлик',
      'Пахтакор',
      'Зарбдор',
      'Зафаробот',
      'Зомин',
      'Шароф Рашидов',
      'Фариш',
      'Мирзачўль',
      'Жиззах Шаҳар',
      'Жиззах вилояти'
    ],
    tashkilotlar: [
      'жиззах сув таъминоти АЖ',
      'Экалогия бошқармаси',
      'Қурилиш ва уй-жой коммунал хўжалиги бош бошқармаси',
      'ХЕТ корхонаси',
      'Ижтимоий соҳа',
      'иссиқлик Манбаи МЧЖ',
      'Кўмир таъминоти',
      'Бошқалар'
    ]
  }
}

