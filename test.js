const addDays = (date, days) => {
  const formattedDate = new Date(date);
  formattedDate.setDate(formattedDate.getDate() + days);
  return formattedDate;
};

const goBackDays = 99;
const today = new Date();
const datesSorted = [new Date().toISOString().split('T')[0]];

for (let i = 0; i < goBackDays; i++) {
  const newDate = new Date(today.setDate(today.getDate() - 1))
    .toISOString()
    .split('T')[0];
  datesSorted.push(newDate);
}

console.log({ datesSorted });

function randomInRange(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}
const durasiPasien = [];
const durasiTunggu = [];
const durasiTemuDokter = [];
const BOR = [];
const LOS = [];
const GDR = [];

for (let i = 0; i < 100; i++) {
  const value1 = randomInRange(20, 200);
  const value2 = randomInRange(5, 120);
  const value3 = randomInRange(2, 20);
  const value4 = randomInRange(55, 90);
  const value5 = randomInRange(1, 20);
  const value6 = randomInRange(3, 7);
  durasiPasien.push(value1);
  durasiTunggu.push(value2);
  durasiTemuDokter.push(value3);
  BOR.push(value4);
  LOS.push(value5);
  GDR.push(value6);
}

console.log({ durasiPasien });
console.log({ durasiTunggu });
console.log({ durasiTemuDokter });
console.log({ BOR });
console.log({ LOS });
console.log({ GDR });
