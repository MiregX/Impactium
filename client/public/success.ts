import { Template } from "./locale";

export type SuccessLocale = Record<string, Template>;

const success: SuccessLocale = {
  user_updated_successfully: {
    us: 'Changes saved successfully!',
    ru: 'Изменения успешно сохранены!',
    ua: 'Зміни успішно збережено!',
    it: 'Modifiche salvate con successo!',
    pl: 'Zmiany zostały pomyślnie zapisane!'
  },
  member_updated_successfully: {
    us: 'Changes saved successfully!',
    ru: 'Изменения успешно сохранены!',
    ua: 'Зміни успішно збережено!',
    it: 'Modifiche salvate con successo!',
    pl: 'Zmiany zostały pomyślnie zapisane!'
  }
}

export { success }