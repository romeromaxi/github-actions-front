import { EntityWithId } from 'types/baseEntities';

export const removeDuplicates = (entities: any[]) => {
  return entities.filter(
      (entity, index, self) =>
          self.findIndex((e) => e === entity) === index,
  );
};

export const removeDuplicatesById = (entities: EntityWithId<number>[]) => {
  return entities.filter(
    (entity, index, self) =>
      self.findIndex((e) => e.id === entity.id) === index,
  );
};

export const removeDuplicatesByField = (
  entities: any[],
  field: string,
): any[] => {
  return entities.filter(
    (entity, index, self) =>
      self.findIndex((e) => e[field] === entity[field]) === index,
  );
};

export const removeDuplicatesByFieldWithPriority = (
    items: any[],
    field: string,
    priorityField: string 
) => {
  const uniqueItemsMap = new Map<any, any>();

  items.forEach((item) => {
    const fieldValue = item[field];
    const existingItem = uniqueItemsMap.get(fieldValue);

    if (!existingItem) {
      uniqueItemsMap.set(fieldValue, item);
    } else if (item[priorityField] === true) {
      uniqueItemsMap.set(fieldValue, item);
    }
  });

  return Array.from(uniqueItemsMap.values());
};

export const arrayChunks = (array: any[], chunk_size: number) =>
  Array(Math.ceil(array.length / chunk_size))
    .fill(0)
    .map((_, index) => index * chunk_size)
    .map((begin) => array.slice(begin, begin + chunk_size));

export const count = (array: any[] = [], countField: string) => {
  type countDict = { [key: string]: number };

  return array?.reduce((p: countDict, c) => {
    const field = c[countField]?.toString();
    if (!p.hasOwnProperty(field)) {
      p[field] = 0;
    }
    p[field]++;
    return p;
  }, {});
};

export const sum = (
  array: any[] = [],
  groupField: string,
  sumField: string,
) => {
  type countDict = Record<string, number>;

  return array?.reduce((p: countDict, c) => {
    const field = c[groupField];
    if (!p.hasOwnProperty(field)) {
      p[field] = 0;
    }
    p[field] += c[sumField];
    return p;
  }, {});
};

export const groupBy = <T>(
  arr: T[] = [],
  keys: (keyof T)[],
): { [key: string]: T[] } => {
  return arr.reduce(
    (storage, item) => {
      const objKey = keys.map((key) => `${item[key]}`).join(':');
      if (storage[objKey]) {
        storage[objKey].unshift(item);
      } else {
        storage[objKey] = [item];
      }
      return storage;
    },
    {} as { [key: string]: T[] },
  );
};

export const groupBySum = <T>(
  array: T[] = [],
  groupFields: (keyof T)[],
  sumFields: (keyof T)[],
) => {
  let helper: Record<string, any> = {};
  //map to objects with selected fields
  const newArray = array.map((o: T) =>
    [...groupFields, ...sumFields]
      //.filter((key: keyof T) => key in o)
      .reduce((obj2: Partial<T>, key) => ((obj2[key] = o[key]), obj2), {}),
  );

  return newArray.reduce(function (r: Record<string, any>[], o: Partial<T>) {
    let key = '';
    groupFields.forEach((p: keyof T) => (key += o[p] + '-'));
    if (!helper[key]) {
      helper[key] = Object.assign({}, o); //create a copy of object
      r.push(helper[key]);
    } else {
      sumFields.forEach((sumField) => {
        helper[key][sumField] += o[sumField];
      });
    }
    return r;
  }, []);
};

export const getDifference = <T>(a: T[], b: T[]): T[] => {
  return a.filter((element) => {
    return !b.includes(element);
  });
};

export const haveSameElements = <T>(a: T[], b: T[]): boolean => {
  if (typeof a == 'number') a = [a];
  if (typeof b == 'number') b = [b];

  if (a.length === b.length) {
    return a.every((element) => {
      return !!b.includes(element);
    });
  }
  return false;
};

export type WithCount<T, K extends keyof T> = Pick<T, K> & { count: number };

export function countObjects<T, K extends keyof T>(
  originalList: T[],
  key: K,
  keepKeys?: (keyof T)[],
): WithCount<T, K>[] {
  const countedList: WithCount<T, K>[] = [];

  originalList.forEach((originalObj) => {
    // @ts-ignore
    const existingCountedObj = countedList.find(
      // @ts-ignore
      (countedObj) => countedObj[key] === originalObj[key],
    );

    if (existingCountedObj) {
      existingCountedObj.count += 1;
    } else {
      // @ts-ignore
      const newCountedObj: WithCount<T, K> = {
        [key]: originalObj[key],
        count: 1,
      };

      if (keepKeys) {
        keepKeys.forEach((keepKey) => {
          // @ts-ignore
          newCountedObj[keepKey] = originalObj[keepKey];
        });
      }

      countedList.push(newCountedObj);
    }
  });

  return countedList;
}

export const convertListToMap = <
  T extends { [key: string | number]: string | number },
  U extends keyof T,
  V extends keyof T,
>(
  list: T[],
  key: U,
  secondKey: V,
) => {
  const map = {} as Record<T[U], T[V]>;
  for (const ele of list) {
    map[ele[key]] = ele[secondKey];
  }
  return map;
};


export const shuffle = <T>(list: readonly T[]): T[] => {
  const copy = [...list];
  let currentIndex = copy.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [copy[currentIndex], copy[randomIndex]] = [
      copy[randomIndex], copy[currentIndex]
    ];
  }
  
  return copy;
};


