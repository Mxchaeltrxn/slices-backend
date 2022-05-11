export enum Role {
  NextDrawerAndNextRevealer,
  CurrentDrawer,
  CurrentRevealer,
  NextDrawer,
  NextRevealer,
  None,
}

export enum Phase {
  ChoosingWord = 'ChoosingWord',
  Drawing = 'Drawing',
  ChoosingSlice = 'ChoosingSlice',
  RevealedSlice = 'RevealedSlice',
  Waiting = 'Waiting',
  Finished = 'Finished',
}
