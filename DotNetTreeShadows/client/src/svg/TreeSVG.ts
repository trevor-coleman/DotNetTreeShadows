import AspenLargeTree from '../svg/exports/Aspen-LargeTree.svg'
import AspenMediumTree from '../svg/exports/Aspen-MediumTree.svg'
import AspenSmallTree from '../svg/exports/Aspen-SmallTree.svg'
import AspenSeed from '../svg/exports/Aspen-Seed.svg'

import AshLargeTree from '../svg/exports/Ash-LargeTree.svg'
import AshMediumTree from '../svg/exports/Ash-MediumTree.svg'
import AshSmallTree from '../svg/exports/Ash-SmallTree.svg'
import AshSeed from '../svg/exports/Ash-Seed.svg'

import PoplarLargeTree from '../svg/exports/Poplar-LargeTree.svg'
import PoplarMediumTree from '../svg/exports/Poplar-MediumTree.svg'
import PoplarSmallTree from '../svg/exports/Poplar-SmallTree.svg'
import PoplarSeed from '../svg/exports/Poplar-Seed.svg'

import BirchLargeTree from '../svg/exports/Birch-LargeTree.svg'
import BirchMediumTree from '../svg/exports/Birch-MediumTree.svg'
import BirchSmallTree from '../svg/exports/Birch-SmallTree.svg'
import BirchSeed from '../svg/exports/Birch-Seed.svg'
import { PieceType, TreeType } from '../store/sessions/types';

const TreeSVGs : {[key:string]: {
  [key:string]:string
  }} = {
  Ash: {
    LargeTree: AshLargeTree,
    MediumTree: AshMediumTree,
    SmallTree: AshSmallTree,
    Seed: AshSeed
  },
  Aspen: {
    LargeTree: AspenLargeTree,
    MediumTree: AspenMediumTree,
    SmallTree: AspenSmallTree,
    Seed: AspenSeed
  },
  Poplar: {
    LargeTree: PoplarLargeTree,
    MediumTree: PoplarMediumTree,
    SmallTree: PoplarSmallTree,
    Seed: PoplarSeed
  },
  Birch: {
    LargeTree: BirchLargeTree,
    MediumTree: BirchMediumTree,
    SmallTree: BirchSmallTree,
    Seed: BirchSeed
  },

}


export default function TreeSVG (treeType: TreeType, pieceType: PieceType):string {
  console.log(treeType, pieceType);
  console.log(TreeSVGs[treeType])
  console.log(TreeSVGs[treeType][pieceType])
  return TreeSVGs[treeType][pieceType];
}
