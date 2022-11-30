export function parseSlot(str: string, template: string): string[] | undefined {
  const slots: string[] = [];
  let i = 0;
  let j = 0;

  while (i < str.length && j < template.length) {
    const c = template.at(j);

    if (c === "<") {
      // Foo <<1>> Bar
      //        ^
      //        k - 模版结束标记
      const k = template.indexOf(">>", j + 1);

      if (k === -1) {
        throw new Error("Invalid template");
      }

      // Foo <<1>> Bar
      //       ^
      //      slot - 插值，必须为数字
      const slot = template.slice(j + 2, k);
      const n = parseInt(slot, 10);

      if (isNaN(n) || n < 1) {
        throw new Error("Invalid template");
      }

      // Foo 123 Bar
      //        ^
      //        m - 字符串结束标记
      const m = str.indexOf(" ", i);

      if (m === -1) {
        // 如果字符串已结束，模版也已结束，则匹配成功
        if (k === template.length - 2) {
          slots.push(str.slice(i));
          return slots;
        }
        return undefined;
      }

      slots.push(str.slice(i, m));
      i = m + 1;
      j = k + 3;
    } else {
      if (str.at(i) !== c) {
        return undefined;
      }

      i++;
      j++;
    }
  }

  if (i !== str.length || j !== template.length) {
    return undefined;
  }

  return slots;
}

if (import.meta.main) {
  const template = "Foo <<1>>";
  console.log(parseSlot("Foo 123", template));
}
