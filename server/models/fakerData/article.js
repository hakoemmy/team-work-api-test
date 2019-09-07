import faker from 'faker';

const articles = [
  // Index = 0
  // An article with missing property
  {
    // title: 'My journey in software development industry',
    article: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
  },

  // Index = 1
  // An article with one field empty
  {
    title: ' ',
    article: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
  },
  // Index = 2
  // An article with one number field
  {
    title: '888899',
    article: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
  },
  // Index = 3
  // Valid article post
  {
    title: 'My journey in software development industry',
    article: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
  },
];

export default articles;
