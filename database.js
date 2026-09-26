const OPERATOR_DB = [
  { name: "Telkomsel", jenis: "Prabayar / Pascabayar", brand: ["simPATI", "Kartu As", "kartuHALO", "Loop"],
    prefixes: ["0811", "0812", "0813", "0821", "0822", "0823", "0851", "0852", "0853"] },
  { name: "Indosat Ooredoo", jenis: "Prabayar / Pascabayar", brand: ["IM3", "Mentari", "Matrix"],
    prefixes: ["0814", "0815", "0816", "0855", "0856", "0857", "0858"] },
  { name: "XL Axiata", jenis: "Prabayar / Pascabayar", brand: ["XL", "XL Prioritas"],
    prefixes: ["0817", "0818", "0819", "0859", "0877", "0878"] },
  { name: "Axis (XL)", jenis: "Prabayar", brand: ["Axis"],
    prefixes: ["0831", "0832", "0833", "0838"] },
  { name: "Tri (3)", jenis: "Prabayar", brand: ["Tri"],
    prefixes: ["0895", "0896", "0897", "0898", "0899"] },
  { name: "Smartfren", jenis: "Prabayar", brand: ["Smartfren"],
    prefixes: ["0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888", "0889"] }
];

function deteksiOperator(nomor) {
  let n = String(nomor).replace(/\D/g, "");
  if (n.startsWith("62")) n = "0" + n.slice(2);

  for (const op of OPERATOR_DB) {
    if (op.prefixes.some((p) => n.startsWith(p))) {
      return { name: op.name, jenis: op.jenis };
    }
  }
  return { name: "Tidak dikenali", jenis: "-" };
}
