import { parse } from 'accept-language-parser';

export const checkLanguage = (req) => {
    const acceptedLanguages = parse(req.headers['accept-language']);

    const isFrench = acceptedLanguages.some(lang => lang.code === 'fr');

    return isFrench
}