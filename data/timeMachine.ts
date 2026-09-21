export interface TimeMachineYear {
  year: number;
  label: string;
  vaultLabel: string;
  albumCount: number;
  heading: string;
  description: string;
  tags: string[];
  featuredFilms: string[];
}

export const TIME_MACHINE_YEARS: TimeMachineYear[] = [
  {
    year: 1990,
    label: '1990',
    vaultLabel: 'Vault Archive #90',
    albumCount: 22,
    heading: '1990: Dawn of a New Musical Era',
    description: 'The birth of the Nadeem-Shravan era. Aashiqui redefined film music forever, launching the cassette revolution across the nation.',
    tags: ['Popular Songs', 'Iconic Artists', 'Romantic Hits', 'Sad Songs'],
    featuredFilms: ['Aashiqui', 'Dil', 'Ghayal', 'Agneepath'],
  },
  {
    year: 1991,
    label: '1991',
    vaultLabel: 'Vault Archive #91',
    albumCount: 25,
    heading: '1991: The Saajan Summer',
    description: 'Saajan, Lamhe, and Sadak dominated the airwaves. Kumar Sanu became the undisputed Melody King of Bollywood.',
    tags: ['Popular Songs', 'Duets', 'Romantic Hits', 'Party Hits'],
    featuredFilms: ['Saajan', 'Sadak', 'Lamhe', 'Saudagar'],
  },
  {
    year: 1992,
    label: '1992',
    vaultLabel: 'Vault Archive #92',
    albumCount: 28,
    heading: '1992: College Romance & First Love',
    description: 'Jo Jeeta Wohi Sikandar and Roja defined college nostalgia. A.R. Rahman\'s debut changed Indian cinema music forever.',
    tags: ['Popular Songs', 'Iconic Artists', 'Romantic Hits', 'Happy Songs'],
    featuredFilms: ['Roja', 'Jo Jeeta Wohi Sikandar', 'Khalnayak', 'Deewana'],
  },
  {
    year: 1993,
    label: '1993',
    vaultLabel: 'Vault Archive #93',
    albumCount: 30,
    heading: '1993: Dance Floor Fever',
    description: 'Khalnayak\'s chart-toppers and Hum Hain Rahi Pyar Ke set the nation dancing. Alisha Chinai\'s Made In India took over.',
    tags: ['Dance Anthems', 'Popular Songs', 'Party Hits', 'Indipop'],
    featuredFilms: ['Khalnayak', 'Baazigar', 'Darr', 'Hum Hain Rahi'],
  },
  {
    year: 1994,
    label: '1994',
    vaultLabel: 'Vault Archive #94',
    albumCount: 32,
    heading: '1994: The Wedding Season',
    description: 'Hum Aapke Hain Koun became India\'s highest grossing film. Mohra\'s Tip Tip Barsa dominated every radio.',
    tags: ['Popular Songs', 'Wedding Songs', 'Dance Hits', 'Romantic Hits'],
    featuredFilms: ['HAHK', 'Mohra', 'Anjaam', '1942 A Love Story'],
  },
  {
    year: 1995,
    label: '1995',
    vaultLabel: 'Vault Archive #95',
    albumCount: 34,
    heading: '1995: The Golden Melodic Monsoon',
    description: 'Peak romantic renaissance featuring epoch-defining soundtracks: Dilwale Dulhania Le Jayenge, Rangeela, Coolie No. 1, and Akele Hum Akele Tum.',
    tags: ['Popular Songs', 'Iconic Artists', 'Romantic Hits', 'Party Hits'],
    featuredFilms: ['DDLJ', 'Rangeela', 'Coolie No. 1', 'Akele Hum Akele Tum'],
  },
  {
    year: 1996,
    label: '1996',
    vaultLabel: 'Vault Archive #96',
    albumCount: 31,
    heading: '1996: Indipop Revolution',
    description: 'Lucky Ali\'s Sunoh and Khamoshi redefined acoustic soul. Udit Narayan ruled the charts alongside a new wave of indie artists.',
    tags: ['Indipop', 'Romantic Hits', 'Hidden Gems', 'Acoustic'],
    featuredFilms: ['Khamoshi', 'Raja Hindustani', 'Jeet', 'Saajan Chale Sasural'],
  },
  {
    year: 1997,
    label: '1997',
    vaultLabel: 'Vault Archive #97',
    albumCount: 29,
    heading: '1997: Pardes & Dil Toh Pagal Hai',
    description: 'The year of heartbreak and dance. DTPH\'s synchronized performances and Border\'s patriotic anthems defined two extremes.',
    tags: ['Romantic Hits', 'Dance Anthems', 'Patriotic', 'Hidden Gems'],
    featuredFilms: ['Dil Toh Pagal Hai', 'Pardes', 'Border', 'Judwaa'],
  },
  {
    year: 1998,
    label: '1998',
    vaultLabel: 'Vault Archive #98',
    albumCount: 36,
    heading: '1998: Kuch Kuch Hota Hai & Dil Se',
    description: 'The year that gave us two of the greatest soundtracks ever recorded. Jatin-Lalit vs A.R. Rahman — the ultimate musical duel.',
    tags: ['Popular Songs', 'Dance Hits', 'Romantic Hits', 'AR Rahman'],
    featuredFilms: ['KKHH', 'Dil Se', 'Kuch Kuch Hota Hai', 'Soldier'],
  },
  {
    year: 1999,
    label: '1999',
    vaultLabel: 'Vault Archive #99',
    albumCount: 33,
    heading: '1999: End of a Golden Decade',
    description: 'Hum Dil De Chuke Sanam, Sarfarosh, and Biwi No.1 closed the decade with unforgettable melodies and a new sound beginning to emerge.',
    tags: ['Romantic Hits', 'Popular Songs', 'Party Hits', 'Decade Closing'],
    featuredFilms: ['Hum Dil De Chuke Sanam', 'Sarfarosh', 'Biwi No.1', 'Sirf Tum'],
  },
];
