function shouldShowTooltip(el: HTMLElement) {
  return (
    el.tagName === "A" &&
    !el.classList.contains("no-tooltip") &&
    (el as HTMLAnchorElement).pathname.startsWith("/set/")
  );
}

const tooltip = document.createElement("div");
tooltip.classList.add("absolute", "bg-gray-100", "p-2", "rounded-md");
document.body.appendChild(tooltip);
document.addEventListener("mouseout", (e) => {
  tooltip.style.display = "none";
});
document.addEventListener("mouseover", (e) => {
  const target = e.target as HTMLElement;
  if (!shouldShowTooltip(target)) return;
  tooltip.innerHTML = target.innerText;
  tooltip.style.display = "block";
  tooltip.style.top = `${e.pageY + 10}px`;
  tooltip.style.left = `${e.pageX + 10}px`;
});
document.addEventListener("mousemove", (e) => {
  const target = e.target as HTMLElement;
  if (!shouldShowTooltip(target)) return;
  tooltip.style.top = `${e.pageY + 10}px`;
  tooltip.style.left = `${e.pageX + 10}px`;
});
