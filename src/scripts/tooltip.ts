/** 是否显示 ToolTip */
function shouldShowTooltip(el: HTMLElement) {
  return (
    el.tagName === "A" &&
    !el.classList.contains("no-tooltip") &&
    (el as HTMLAnchorElement).pathname.startsWith("/set/")
  );
}

/** 缓存已经 fetch 的数据 */
const tooltipData: Record<string, any> = {};

const tooltip = document.createElement("div");
tooltip.classList.add("eso-tooltip");
tooltip.innerHTML = `
  <div class="eso-tooltip-header">
    <b class="eso-tooltip-type">制造</b>
  </div>
  <img width="64" height="64" class="eso-tooltip-icon" src="https://esoicons.uesp.net/esoui/art/icons/gear_syrabanesregard_waist_a.png" alt="" />
  <div class="eso-tooltip-name">森林怨灵利爪</div>
  <div class="eso-tooltip-nameEn">Claw of the Forest Wraith</div>
  <div class="eso-tooltip-description">
  （2件）增加15-657暴击率<br/>
  （3件）增加3-129武器伤害和法术伤害<br/>
  （4件）增加15-657暴击率<br/>
  （5件）你的职业技能增加47-2037暴击率。
  </div>
`;
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
    line-height: 170%;
    padding: 10px 10px 20px;
    width: 350px;
    text-align: center;
    margin-top: 30px;
  }
  .eso-tooltip-header {
    display: flex;
    justify-content: space-between;
    padding: 0 5px;
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
  .eso-tooltip-description {
    margin-top: 10px;
  }
`;
document.body.appendChild(style);

document.addEventListener("mouseout", (e) => {
  tooltip.style.display = "none";
});

document.addEventListener("mouseover", async (e) => {
  const target = e.target as HTMLAnchorElement;
  if (!shouldShowTooltip(target)) return;

  const response = await fetch(target.href, {
    headers: {
      "x-request-for": "tooltip",
    },
  });
  const data = await response.json();

  tooltip.querySelector(".eso-tooltip-icon")!.setAttribute("src", data.icon);
  tooltip.querySelector(".eso-tooltip-name")!.textContent = data.name;
  tooltip.querySelector(".eso-tooltip-nameEn")!.textContent = data.nameEn;
  tooltip.querySelector(".eso-tooltip-description")!.innerHTML = data.description;
  tooltip.querySelector(".eso-tooltip-type")!.textContent = data.type;
  tooltip.style.display = "block";
  tooltip.style.top = `${e.pageY - 30}px`;
  tooltip.style.left = `${e.pageX + 10}px`;
});

document.addEventListener("mousemove", (e) => {
  const target = e.target as HTMLElement;
  if (!shouldShowTooltip(target)) return;
  tooltip.style.top = `${e.pageY - 30}px`;
  tooltip.style.left = `${e.pageX + 10}px`;
});
