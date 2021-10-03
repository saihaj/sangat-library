export enum Screens {
  HomeScreen = 'Home',
  BookDetailScreen = 'BookDetail',
}

export type NavigationParams = {
  [Screens.HomeScreen]: undefined
  [Screens.BookDetailScreen]: { id: string }
}
