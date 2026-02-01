import { welcomeMessages, TimeBlock } from "./welcomeMessages";

const BOSS_PROBABILITY = 0.25;

export function getTimeBlock(): TimeBlock {
  const hour = new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    hour12: false,
    timeZone: "Africa/Lagos",
  }).format(new Date());

  const h = Number(hour);

  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 22) return "evening";
  return "night";
}

export function getGreetingMessage({
  adminName,
  pendingOrders,
  weeklySales,
}: {
  adminName: string;
  pendingOrders: number;
  weeklySales: number;
}) {
  const timeBlock = getTimeBlock();
  const messages = welcomeMessages[timeBlock];

  const template = messages[Math.floor(Math.random() * messages.length)];

  const useBoss = Math.random() < BOSS_PROBABILITY;
  const name = useBoss ? "Boss" : `Mrs ${adminName}`;

  return template
    .replace("{{name}}", name)
    .replace("{{pending}}", pendingOrders.toString())
    .replace("{{sales}}", weeklySales.toLocaleString("en-NG"));
}
