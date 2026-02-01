export type TimeBlock = 'morning' | 'afternoon' | 'evening' | 'night';

export const welcomeMessages: Record<TimeBlock, string[]> = {
  morning: [
    "Good morning, {{name}}. Here’s an overview of your online store — you have <strong>{{pending}}</strong> pending orders and <strong>₦{{sales}}</strong> in sales this week.",
    "Good morning, {{name}}. Your store is already in motion — <strong>{{pending}}</strong> orders waiting and <strong>₦{{sales}}</strong> earned this week.",
    "Morning, {{name}}. Overview: <strong>{{pending}}</strong> pending orders • <strong>₦{{sales}}</strong> this week.",
    "Good morning, {{name}}. You’re off to a strong start — <strong>{{pending}}</strong> pending orders and <strong>₦{{sales}}</strong> in weekly sales.",
    "Good morning, {{name}}. Business update: <strong>{{pending}}</strong> pending orders, <strong>₦{{sales}}</strong> so far this week."
  ],

  afternoon: [
    "Good afternoon, {{name}}. Here’s a snapshot — <strong>{{pending}}</strong> pending orders and <strong>₦{{sales}}</strong> this week.",
    "Good afternoon, {{name}}. Your store is active — <strong>{{pending}}</strong> orders pending with <strong>₦{{sales}}</strong> in sales.",
    "Good afternoon, {{name}}. Progress looks good — <strong>{{pending}}</strong> customers waiting, <strong>₦{{sales}}</strong> earned.",
    "Good afternoon, {{name}}. Store performance: <strong>{{pending}}</strong> pending orders • <strong>₦{{sales}}</strong> this week."
  ],

  evening: [
    "Good evening, {{name}}. Today’s overview — <strong>{{pending}}</strong> pending orders and <strong>₦{{sales}}</strong> this week.",
    "Good evening, {{name}}. Your store continues to perform — <strong>{{pending}}</strong> orders pending, <strong>₦{{sales}}</strong> made.",
    "Evening, {{name}}. <strong>{{pending}}</strong> pending orders • <strong>₦{{sales}}</strong> this week.",
    "Good evening, {{name}}. Business stands at <strong>{{pending}}</strong> pending orders and <strong>₦{{sales}}</strong> in sales."
  ],

  night: [
    "Hello, {{name}}. A quick overview — <strong>{{pending}}</strong> pending orders and <strong>₦{{sales}}</strong> this week.",
    "Hello, {{name}}. Your store stands at <strong>{{pending}}</strong> pending orders with <strong>₦{{sales}}</strong> in sales."
  ],
};
