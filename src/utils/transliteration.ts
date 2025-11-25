export type SupportedLanguage = 'uz' | 'uz-cyrl' | 'ru'

const CYRIL_TO_LATIN: Record<string, string> = {
  А: 'A', а: 'a',
  Б: 'B', б: 'b',
  В: 'V', в: 'v',
  Г: 'G', г: 'g',
  Д: 'D', д: 'd',
  Е: 'E', е: 'e',
  Ё: 'Yo', ё: 'yo',
  Ж: 'J', ж: 'j',
  З: 'Z', з: 'z',
  И: 'I', и: 'i',
  Й: 'Y', й: 'y',
  К: 'K', к: 'k',
  Л: 'L', л: 'l',
  М: 'M', м: 'm',
  Н: 'N', н: 'n',
  О: 'O', о: 'o',
  П: 'P', п: 'p',
  Р: 'R', р: 'r',
  С: 'S', с: 's',
  Т: 'T', т: 't',
  У: 'U', у: 'u',
  Ф: 'F', ф: 'f',
  Х: 'X', х: 'x',
  Ц: 'Ts', ц: 'ts',
  Ч: 'Ch', ч: 'ch',
  Ш: 'Sh', ш: 'sh',
  Щ: 'Sh', щ: 'sh',
  Ы: 'I', ы: 'i',
  Э: 'E', э: 'e',
  Ю: 'Yu', ю: 'yu',
  Я: 'Ya', я: 'ya',
  Қ: 'Q', қ: 'q',
  Ғ: "G'", ғ: "g'",
  Ў: "O'", ў: "o'",
  Ҳ: 'H', ҳ: 'h',
  Ъ: '', ъ: '',
  Ь: '', ь: ''
}

const latinDigraphs = [
  { latin: "o'", cyril: 'ў' },
  { latin: "g'", cyril: 'ғ' },
  { latin: 'sh', cyril: 'ш' },
  { latin: 'ch', cyril: 'ч' },
  { latin: 'yo', cyril: 'ё' },
  { latin: 'yu', cyril: 'ю' },
  { latin: 'ya', cyril: 'я' },
  { latin: 'ts', cyril: 'ц' }
]

const latinSingleMap: Record<string, string> = {
  a: 'а', b: 'б', c: 'к', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'ҳ',
  i: 'и', j: 'ж', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п',
  q: 'қ', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в', w: 'в', x: 'кс',
  y: 'й', z: 'з', "'": 'ъ'
}

export const convertCyrilToLatin = (value: string) =>
  value
    .split('')
    .map(char => CYRIL_TO_LATIN[char] ?? char)
    .join('')

export const convertLatinToCyril = (value: string) => {
  let result = ''
  const lower = value.toLowerCase()

  for (let i = 0; i < lower.length; i++) {
    const pair = lower.slice(i, i + 2)
    const digraph = latinDigraphs.find(d => pair === d.latin)

    if (digraph) {
      const originalPair = value.slice(i, i + 2)
      const mappedChar =
        originalPair[0] === originalPair[0].toUpperCase()
          ? digraph.cyril.toUpperCase()
          : digraph.cyril
      result += mappedChar
      i++
      continue
    }

    const currentChar = value[i]
    const mapped = latinSingleMap[lower[i]]
    result += mapped
      ? currentChar === currentChar.toUpperCase()
        ? mapped.toUpperCase()
        : mapped
      : currentChar
  }

  return result
}

export const normalizeByLanguage = (value: string, language: SupportedLanguage) => {
  if (!value) return value
  const trimmed = value.trim()

  if (language === 'uz') {
    return convertCyrilToLatin(trimmed)
  }

  if (language === 'uz-cyrl' || language === 'ru') {
    return convertLatinToCyril(trimmed)
  }

  return trimmed
}


