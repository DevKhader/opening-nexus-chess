
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
  private defaultOpenings: Opening[] = [
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

  private loadOpenings(): Opening[] {
    try {
      const stored = localStorage.getItem('chess-openings');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading openings from localStorage:', error);
    }
    // Return default openings if nothing is stored or there's an error
    return [...this.defaultOpenings];
  }

  private saveOpenings(openings: Opening[]): void {
    try {
      localStorage.setItem('chess-openings', JSON.stringify(openings));
    } catch (error) {
      console.error('Error saving openings to localStorage:', error);
    }
  }

  getAllOpenings(): Opening[] {
    return this.loadOpenings();
  }

  getOpeningById(id: string): Opening | undefined {
    const openings = this.loadOpenings();
    return openings.find(opening => opening.id === id);
  }

  addOpening(opening: Omit<Opening, 'id'>): string {
    const openings = this.loadOpenings();
    const id = (Date.now()).toString(); // Use timestamp for unique ID
    const newOpening = { ...opening, id };
    openings.push(newOpening);
    this.saveOpenings(openings);
    console.log('Added opening:', newOpening);
    return id;
  }

  updateOpening(id: string, opening: Partial<Opening>): boolean {
    const openings = this.loadOpenings();
    const index = openings.findIndex(o => o.id === id);
    if (index !== -1) {
      openings[index] = { ...openings[index], ...opening };
      this.saveOpenings(openings);
      return true;
    }
    return false;
  }

  deleteOpening(id: string): boolean {
    const openings = this.loadOpenings();
    const index = openings.findIndex(o => o.id === id);
    if (index !== -1) {
      openings.splice(index, 1);
      this.saveOpenings(openings);
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
