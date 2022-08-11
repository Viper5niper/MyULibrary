import * as Yup from 'yup';

export const bookFormSchema = Yup.object({
  title: Yup.string()
    .min(5, 'Must be 5 characters at minimum')
    .max(50, 'Must be 50 characters or less')
    .required('Required'),
  author: Yup.string()
    .min(5, 'Must be 5 characters at minimum')
    .max(50, 'Must be 50 characters or less')
    .required('Required'),
  genre: Yup.string()
    .min(5, 'Must be 5 characters at minimum')
    .max(50, 'Must be 50 characters or less')
    .required('Required'),
  year: Yup.number().min(1000, 'Must be greater than 1000').max(2022,'Must be less than 2022').required('Required'),
  stock: Yup.number().required('Required'),

});
