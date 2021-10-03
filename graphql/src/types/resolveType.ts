import { TypeNames } from './shared'

export default (obj) => {
  const { AuthorType } = require('./author')
  const { BookType } = require('./book')
  const { GenreType } = require('./genre')
  const { IssueType } = require('./issue')
  const { LibraryType } = require('./library')
  const { UserType } = require('./user')

  switch (obj.type) {
    case TypeNames.Author:
      return AuthorType
    case TypeNames.Book:
      return BookType
    case TypeNames.Genre:
      return GenreType
    case TypeNames.Issue:
      return IssueType
    case TypeNames.Library:
      return LibraryType
    case TypeNames.User:
      return UserType
    default:
      throw new Error(`Unknown type: ${JSON.stringify(obj)}`)
  }
}
