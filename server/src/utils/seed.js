import faker from 'faker';
import { join } from 'path';

import User from '../models/User';
// import Message from '../models/Message';
import Book from '../models/Book';
import { deleteAllAvatars } from './utils';

export const seedDb = async () => {
  console.log('Seeding database...');

  await User.deleteMany({});
  // await Message.deleteMany({});
  await Book.deleteMany({});
  await deleteAllAvatars(join(__dirname, '../..', process.env.IMAGES_FOLDER_PATH));

  // create 3 users
  const usersPromises = [...Array(3).keys()].map((index, i) => {

    const user = new User({
      provider: 'email',
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      username: `user${index}`,
      email: `email${index}@email.com`,
      password: '123456789',
      name: faker.name.findName(),
      // avatar: faker.image.avatar(),
      avatar: `avatar${index}.jpg`,
      bio: faker.lorem.sentences(3),
    });

    if (index === 0) {
      user.role = 'ADMIN';
    }
    user.registerUser(user, () => {});
    return user;
  });

  await Promise.all(
    usersPromises.map(async (user) => {
      await user.save();
    }),
  );

  // create 9 books
  const bookPromises = [...Array(9).keys()].map((index, i) => {
    const book = new Book({
      title: faker.lorem.sentences(1),
      author: faker.name.findName(),
      year: 2020,
      genre: faker.lorem.sentences(1),
      stock: 3,
    });
    return book;
  });

  await Promise.all(
    bookPromises.map(async (book) => {
      await book.save();
    }),
  );

  console.log('database seeded!');
};


