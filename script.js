const $ = (id) => document.getElementById(id);

const el = {
  length: $("length"),
  width: $("width"),
  houseType: $("houseType"),
  floors: $("floors"),
  floorWrap: $("floorWrap"),
  roofType: $("roofType"),
  roofOptions: $("roofOptions"),
  roofFactor: $("roofFactor"),
  tileRate: $("tileRate"),

  rawRate: $("rawRate"),
  finishRate: $("finishRate"),
  fullRate: $("fullRate"),
  roofRate: $("roofRate"),
  foundationRate: $("foundationRate"),

  calcBtn: $("calcBtn"),
  resetBtn: $("resetBtn"),
  copyBtn: $("copyBtn"),
  toggleRatesBtn: $("toggleRatesBtn"),
  rateBox: $("rateBox"),

  oneFloorArea: $("oneFloorArea"),
  totalFloorArea: $("totalFloorArea"),
  roofArea: $("roofArea"),
  tileQty: $("tileQty"),

  brickQty: $("brickQty"),
  steelQty: $("steelQty"),
  sandQty: $("sandQty"),
  cementQty: $("cementQty"),
  concreteQty: $("concreteQty"),
  plasterQty: $("plasterQty"),

  foundationCost: $("foundationCost"),
  rawCost: $("rawCost"),
  finishCost: $("finishCost"),
  fullCost: $("fullCost"),
  roofCost: $("roofCost"),
  grandTotal: $("grandTotal"),
};

const MATERIAL_RATES = {
  brick: 280,
  steel: 0.035,
  sand: 0.46,
  cement: 0.18,
  concrete: 0.12,
  plaster: 3.2
};

let lastResultText = "";

function num(value) {
  return Number(value || 0);
}

function formatNumber(value, digits = 2) {
  return Number(value).toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits
  });
}

function formatCurrency(value) {
  return Number(value).toLocaleString("vi-VN") + " đ";
}

function toggleFields() {
  const isTang = el.houseType.value === "tang";
  const hasRoof = el.roofType.value === "nhat";

  el.floorWrap.classList.toggle("hidden", !isTang);
  el.roofOptions.classList.toggle("hidden", !hasRoof);
}

function toggleRates() {
  el.rateBox.classList.toggle("hidden");
}

function resetResults() {
  const mapping = [
    [el.oneFloorArea, "0 m²"],
    [el.totalFloorArea, "0 m²"],
    [el.roofArea, "0 m²"],
    [el.tileQty, "0 viên"],
    [el.brickQty, "0 viên"],
    [el.steelQty, "0 tấn"],
    [el.sandQty, "0 m³"],
    [el.cementQty, "0 tấn"],
    [el.concreteQty, "0 m³"],
    [el.plasterQty, "0 m²"],
    [el.foundationCost, "0 đ"],
    [el.rawCost, "0 đ"],
    [el.finishCost, "0 đ"],
    [el.fullCost, "0 đ"],
    [el.roofCost, "0 đ"],
    [el.grandTotal, "0 đ"]
  ];

  mapping.forEach(([node, value]) => {
    node.textContent = value;
  });

  lastResultText = "";
}

function calculate() {
  const length = parseFloat(el.length.value);
  const width = parseFloat(el.width.value);

  if (!length || !width || length <= 0 || width <= 0) {
    alert("Vui lòng nhập chiều dài và chiều rộng hợp lệ.");
    return;
  }

  const houseType = el.houseType.value;
  const floors = houseType === "tang" ? parseInt(el.floors.value, 10) : 1;
  const roofType = el.roofType.value;
  const roofFactor = parseFloat(el.roofFactor.value);
  const tileRate = parseFloat(el.tileRate.value);

  const rawRate = num(el.rawRate.value);
  const finishRate = num(el.finishRate.value);
  const fullRate = num(el.fullRate.value);
  const roofRate = num(el.roofRate.value);
  const foundationRate = num(el.foundationRate.value);

  const oneFloorArea = length * width;
  const totalFloorArea = oneFloorArea * floors;

  let roofArea = 0;
  let tileQty = 0;

  if (roofType === "nhat") {
    roofArea = oneFloorArea * roofFactor;
    tileQty = roofArea * tileRate * 1.05;
  }

  const brickQty = totalFloorArea * MATERIAL_RATES.brick;
  const steelQty = totalFloorArea * MATERIAL_RATES.steel;
  const sandQty = totalFloorArea * MATERIAL_RATES.sand;
  const cementQty = totalFloorArea * MATERIAL_RATES.cement;
  const concreteQty = totalFloorArea * MATERIAL_RATES.concrete;
  const plasterQty = totalFloorArea * MATERIAL_RATES.plaster;

  const foundationCost = totalFloorArea * foundationRate;
  const rawCost = totalFloorArea * rawRate;
  const finishCost = totalFloorArea * finishRate;
  const fullCost = totalFloorArea * fullRate;
  const roofCost = roofArea * roofRate;

  const grandTotal = foundationCost + fullCost + roofCost;

  el.oneFloorArea.textContent = `${formatNumber(oneFloorArea)} m²`;
  el.totalFloorArea.textContent = `${formatNumber(totalFloorArea)} m²`;
  el.roofArea.textContent = `${formatNumber(roofArea)} m²`;
  el.tileQty.textContent = `${formatNumber(tileQty, 0)} viên`;

  el.brickQty.textContent = `${formatNumber(brickQty, 0)} viên`;
  el.steelQty.textContent = `${formatNumber(steelQty)} tấn`;
  el.sandQty.textContent = `${formatNumber(sandQty)} m³`;
  el.cementQty.textContent = `${formatNumber(cementQty)} tấn`;
  el.concreteQty.textContent = `${formatNumber(concreteQty)} m³`;
  el.plasterQty.textContent = `${formatNumber(plasterQty)} m²`;

  el.foundationCost.textContent = formatCurrency(foundationCost);
  el.rawCost.textContent = formatCurrency(rawCost);
  el.finishCost.textContent = formatCurrency(finishCost);
  el.fullCost.textContent = formatCurrency(fullCost);
  el.roofCost.textContent = formatCurrency(roofCost);
  el.grandTotal.textContent = formatCurrency(grandTotal);

  lastResultText = `
TÍNH XÂY NHÀ PRO
- Dài x Rộng: ${formatNumber(length)}m x ${formatNumber(width)}m
- Loại nhà: ${houseType === "tang" ? "Nhà tầng" : "Nhà cấp 4"}
- Số tầng: ${floors}
- Mái: ${roofType === "nhat" ? "Mái Nhật" : "Không mái"}

KẾT QUẢ
- Diện tích 1 sàn: ${formatNumber(oneFloorArea)} m²
- Tổng diện tích sàn: ${formatNumber(totalFloorArea)} m²
- Diện tích mái: ${formatNumber(roofArea)} m²
- Số lượng ngói: ${formatNumber(tileQty, 0)} viên

VẬT TƯ SƠ BỘ
- Gạch: ${formatNumber(brickQty, 0)} viên
- Thép: ${formatNumber(steelQty)} tấn
- Cát: ${formatNumber(sandQty)} m³
- Xi măng: ${formatNumber(cementQty)} tấn
- Bê tông: ${formatNumber(concreteQty)} m³
- Trát tường: ${formatNumber(plasterQty)} m²

CHI PHÍ
- Móng: ${formatCurrency(foundationCost)}
- Xây thô: ${formatCurrency(rawCost)}
- Hoàn thiện: ${formatCurrency(finishCost)}
- Xây + nội thất: ${formatCurrency(fullCost)}
- Mái: ${formatCurrency(roofCost)}
- Tổng tạm tính: ${formatCurrency(grandTotal)}
  `.trim();
}

async function copyResults() {
  if (!lastResultText) {
    alert("Chưa có kết quả để copy.");
    return;
  }

  try {
    await navigator.clipboard.writeText(lastResultText);
    alert("Đã copy kết quả.");
  } catch (error) {
    alert("Không copy tự động được. Sếp tính lại rồi copy thủ công giúp nhé.");
  }
}

function resetForm() {
  el.length.value = "";
  el.width.value = "";
  el.houseType.value = "cap4";
  el.floors.value = "2";
  el.roofType.value = "none";
  el.roofFactor.value = "1.4";
  el.tileRate.value = "10";

  el.rawRate.value = "3800000";
  el.finishRate.value = "5500000";
  el.fullRate.value = "6500000";
  el.roofRate.value = "1000000";
  el.foundationRate.value = "600000";

  toggleFields();
  resetResults();
}

el.houseType.addEventListener("change", toggleFields);
el.roofType.addEventListener("change", toggleFields);
el.toggleRatesBtn.addEventListener("click", toggleRates);
el.calcBtn.addEventListener("click", calculate);
el.resetBtn.addEventListener("click", resetForm);
el.copyBtn.addEventListener("click", copyResults);

window.addEventListener("load", () => {
  toggleFields();
  resetResults();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
});
