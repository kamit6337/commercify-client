type Obj = {
  _id?: string;
  id?: string;
  quantity: number;
};

const removeDuplicate = <T extends keyof Obj>(
  array: Obj[],
  variable: T = "_id" as T
) => {
  if (!array.length) return array;

  const uniqueIds = new Set<Obj[T]>();

  const uniqueArrayOfObjects = array.filter((obj) => {
    const key = obj[variable];

    if (uniqueIds.has(key)) return false;
    uniqueIds.add(key);
    return true;
  });

  return uniqueArrayOfObjects;
};

export default removeDuplicate;
