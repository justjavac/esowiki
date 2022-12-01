export function parse(str: string, template: string): string[] | undefined {
  const slots: string[] = [];
  let i = 0;
  let j = 0;

  while (i < str.length && j < template.length) {
    const c = template.at(j);

    if (c === "<" && template.at(j + 1) === "<") {
      // 解析 `<<<`
      if (template.at(j + 2) === "<") {
        i++;
        j++;
        continue;
      }

      // Foo <<1>> Bar
      //        ^
      //        k - 模版结束标记
      const k = template.indexOf(">>", j + 1);

      if (k === -1) {
        console.log(template);
        throw new Error("Invalid template");
      }

      // Foo <<1>> Bar
      //       ^
      //      slot - 插值
      const slot = template.slice(j + 2, k);
      const n = parseInt(slot, 10);

      if (isNaN(n) || n < 1) {
        // TODO 插值又可能不是数字，目前还不知道如何处理
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

// TODO
export function apply(template: string, ...slots: string[]): string {
  let i = 0;
  let j = 0;
  let str = "";

  while (i < template.length) {
    const c = template.at(i);

    if (c === "<") {
      // Foo <<1>> Bar
      //        ^
      //        k - 模版结束标记
      const k = template.indexOf(">>", i + 1);

      if (k === -1) {
        throw new Error("Invalid template");
      }

      // Foo <<1>> Bar
      //       ^
      //      slot - 插值
      const slot = template.slice(i + 2, k);
      const n = parseInt(slot, 10);

      if (isNaN(n) || n < 1) {
        // TODO 插值又可能不是数字，目前还不知道如何处理
      }

      str += slots[n - 1];
      i = k + 2;
    } else {
      str += c;
      i++;
    }
  }

  return str;
}
