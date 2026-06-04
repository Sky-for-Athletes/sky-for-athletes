export interface ICoordinates {
  type: "Point";
  coordinates: [number, number];
}

export interface IFavoriteLocation {
  _id: string;
  name: string;
  city?: string;
  coordinates: ICoordinates;
}

export interface ISaveFavoriteData {
  name: string;
  city?: string;
  coordinates: ICoordinates;
}

export interface ISearchHistory {
  _id: string;
  query: {
    city: string;
    coordinates: [number, number];
  };
  searchedAt: string;
}
