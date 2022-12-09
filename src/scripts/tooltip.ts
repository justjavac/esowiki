function tooltipType(el: HTMLElement) {
  if (el.tagName !== "A" || el.classList.contains("no-tooltip")) {
    return undefined;
  }

  const parts = (el as HTMLAnchorElement).pathname.split("/");
  if (parts.length <= 2) return undefined;

  return parts[1];
}

async function getData(url: string) {
  if (tooltipData[url] != null) return tooltipData[url];

  const response = await fetch(url, {
    headers: {
      "x-request-for": "tooltip",
    },
  });
  const data = await response.json();
  tooltipData[url] = data;
  return data;
}

/** 缓存已经 fetch 的数据 */
const tooltipData: Record<string, any> = {};

const tooltip = document.createElement("div");
tooltip.classList.add("eso-tooltip");
document.body.appendChild(tooltip);

const style = document.createElement("style");
style.innerHTML = `.eso-tooltip {
    position: absolute;
    z-index: 9999;
    display: none;
    background-color: #101010;
    background-image: url('data:image/svg+xml;utf8,<svg style="transform:rotate(30deg)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 40"><text x="5" y="15" fill="rgba(255,255,255,0.03)" font-weight="bold">eso.denohub.com </text></svg>');
    background-position: 0 0;
    background-size: 200px 200px;
    border: 2px solid #222;
    border-image: none 100%/1/0 stretch;
    border-radius: 3px;
    color: #c5c29e;
    font-size: 14px;
    line-height: 150%;
    padding: 10px;
    width: 350px;
    text-align: center;
    margin-top: 30px;
  }
  .eso-tooltip-header {
    display: flex;
    justify-content: space-between;
  }
  .eso-tooltip-icon {
    margin: 0 auto;
    display: block;
    filter: drop-shadow(2px 4px 6px black);
    margin-top: -64px;
  }
  .eso-tooltip-name {
    color: #EECA2A;
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
  }
  .eso-tooltip-nameEn {
    color: #EECA2A;
  }
  .eso-tooltip-skill {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .eso-tooltip-skill-value {
    color: #FFFFFF;
  }
  .eso-tooltip-divider {
    margin: 10px 0;
  }
  .eso-tooltip-description {
    margin-top: 10px;
  }
  .eso-tooltip-description p {
    margin: 0.5em 0;
  }
  .eso-tooltip-effect-lines {
    margin-top: 1em;
    color: #EECA2A;
  }
  .eso-tooltip-hidden {
    display: none;
  }
`;
document.body.appendChild(style);

document.addEventListener("mouseout", (e) => {
  tooltip.style.display = "none";
});

document.addEventListener("mouseover", async (e) => {
  const target = e.target as HTMLAnchorElement;

  switch (tooltipType(target)) {
    case "item": {
      const data = await getData(target.href);
      tooltip.innerHTML = `
  
        `;
      break;
    }
    case "set": {
      const data = await getData(target.href);
      tooltip.innerHTML = `
        <div class="eso-tooltip-header">
          <b class="eso-tooltip-type">${data.type}</b>
        </div>
        <img width="64" height="64" class="eso-tooltip-icon" src="${data.icon}" alt="" />
        <div class="eso-tooltip-name">${data.name}</div>
        <div class="eso-tooltip-nameEn">${data.nameEn}</div>
        <div class="eso-tooltip-description">
        ${data.description}
        </div>
      `;
      break;
    }
    case "skill": {
      const data = await getData(target.href);
      tooltip.innerHTML = `
        <div class="eso-tooltip-header">
          <b>${data.skillTypeName}</b>
          <b>${data.morph > 0 ? `${data.baseName}变形` : ""}</b>
        </div>
        <img width="64" height="64" class="eso-tooltip-icon" src="${data.icon}" alt="" />
        <div class="eso-tooltip-name">${data.name}</div>
        <div class="eso-tooltip-nameEn">${data.nameEn}</div>
        <div class="eso-tooltip-skill ${data.castTime || "eso-tooltip-hidden"}">
          <span class="eso-tooltip-skill-label">施法时间</span>
          <span class="eso-tooltip-skill-value">${data.castTime ? `${data.castTime}秒` : "瞬发"}</span>
        </div>
        <div class="eso-tooltip-skill ${data.target || "eso-tooltip-hidden"}">
          <span class="eso-tooltip-skill-label">目标</span>
          <span class="eso-tooltip-skill-value">${data.target}</span>
        </div>
        <div class="eso-tooltip-skill ${data.radius || "eso-tooltip-hidden"}">
          <span class="eso-tooltip-skill-label">射程</span>
          <span class="eso-tooltip-skill-value">${data.radius}米</span>
        </div>
        <div class="eso-tooltip-skill ${data.maxRange || "eso-tooltip-hidden"}">
          <span class="eso-tooltip-skill-label">范围</span>
          <span class="eso-tooltip-skill-value">${data.maxRange}米</span>
        </div>
        <div class="eso-tooltip-skill ${data.duration || "eso-tooltip-hidden"}">
          <span class="eso-tooltip-skill-label">持续时间</span>
          <span class="eso-tooltip-skill-value">${data.duration}秒</span>
        </div>
        <div class="eso-tooltip-skill ${data.cost || "eso-tooltip-hidden"}">
          <span class="eso-tooltip-skill-label">消耗</span>
          <span class="eso-tooltip-skill-value">${data.cost}</span>
        </div>
        <img src="//esolog.uesp.net/resources/skill_divider.png" width="100%" height="3" class="eso-tooltip-divider">
        <div class="eso-tooltip-description">
          ${data.description}
        </div>
        <div class="eso-tooltip-effect-lines ${data.effectLines || "eso-tooltip-hidden"}"">
          <b>新效果</b><br>
          ${data.effectLines}
        </div>
      `;
      break;
    }
    default:
      return;
  }

  tooltip.style.display = "block";
  tooltip.style.top = `${e.pageY - 30}px`;
  tooltip.style.left = `${e.pageX + 10}px`;
});

document.addEventListener("mousemove", (e) => {
  const target = e.target as HTMLElement;
  if (tooltipType(target) == null) return;
  tooltip.style.top = `${e.pageY - 30}px`;
  tooltip.style.left = `${e.pageX + 10}px`;
});
