export const addOrPop = (listOne: string[], listTwo: string[]): string[] => {
  const diff = (arr1, arr2) =>
    arr1.filter((a1) => !arr2.some((a2) => a1 === a2));
  const [larger, smaller] =
    listOne.length >= listTwo.length ? [listOne, listTwo] : [listTwo, listOne];

  return diff(larger, smaller).concat(diff(smaller, larger));
};
