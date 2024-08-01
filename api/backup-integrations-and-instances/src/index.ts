import exportData from "./exportData";
import restoreData from "./restoreData";

const action = process.argv[2];

switch (action) {
  case "backup":
    exportData();
    break;
  case "restore":
    restoreData();
    break;
  default:
    throw new Error("Must select 'backup' or 'restore'");
}
