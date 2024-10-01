import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const dateFormatter = () => {
  const { locale } = useI18n()
  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'UTC'
  })
}

export const formatDateFromMs = (ms: number) => dateFormatter().format(ms)

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}

export const scrollToTop = (scrollType: ScrollBehavior = 'smooth'): void => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: scrollType
  })
}
