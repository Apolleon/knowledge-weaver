"use server";

import { initKnowledgeBase } from "./knowledge-base";

let isInitialized = false;

export async function ensureKnowledgeBaseInitialized() {
  if (!isInitialized) {
    console.log("Инициализация базы знаний...");
    initKnowledgeBase();
    isInitialized = true;
  }
}
