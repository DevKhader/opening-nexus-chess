
interface Opening {
  id: string;
  name: string;
  moves: string[];
  variations: Array<{
    name: string;
    startMove: number;
    moves: string[];
  }>;
  description: string;
}

class OpeningsStore {
  private openings: Opening[] = [
    {
      id: '1',
      name: 'Sicilian Defense',
      moves: ['e4', 'c5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6'],
      variations: [
        {
          name: 'French Defense',
          startMove: 1,
          moves: ['e6', 'd4', 'Nf6']
        }
      ],
      description: 'The most popular chess opening'
    },
    {
      id: '2',
      name: 'Queen\'s Gambit',
      moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6'],
      variations: [],
      description: 'Classical opening for white'
    },
    {
      id: '3',
      name: 'King\'s Indian Defense',
      moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6'],
      variations: [],
      description: 'Dynamic counterattacking setup'
    }
  ];

  getAllOpenings(): Opening[] {
    return this.openings;
  }

  getOpeningById(id: string): Opening | undefined {
    return this.openings.find(opening => opening.id === id);
  }

  addOpening(opening: Omit<Opening, 'id'>): string {
    const id = (this.openings.length + 1).toString();
    const newOpening = { ...opening, id };
    this.openings.push(newOpening);
    console.log('Added opening:', newOpening);
    return id;
  }

  updateOpening(id: string, opening: Partial<Opening>): boolean {
    const index = this.openings.findIndex(o => o.id === id);
    if (index !== -1) {
      this.openings[index] = { ...this.openings[index], ...opening };
      return true;
    }
    return false;
  }

  deleteOpening(id: string): boolean {
    const index = this.openings.findIndex(o => o.id === id);
    if (index !== -1) {
      this.openings.splice(index, 1);
      return true;
    }
    return false;
  }

  getMainLineMoves(id: string): number {
    const opening = this.getOpeningById(id);
    return opening ? opening.moves.length : 0;
  }

  getVariationsCount(id: string): number {
    const opening = this.getOpeningById(id);
    return opening ? opening.variations.length : 0;
  }
}

export const openingsStore = new OpeningsStore();
export type { Opening };
