import { getServiceAlerts } from "../src/utils/serviceAlerts.ts";

const serviceAlerts = await getServiceAlerts();

const content = JSON.stringify(serviceAlerts);
const savePath = "src/data/serviceAlerts.json";

Deno.writeTextFileSync(savePath, content);

console.log(`save success`);
