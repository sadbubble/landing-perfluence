import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

/**
 * Одна страница без маршрутизатора: внутри папки лендинга работает только
 * её корень (см. lib/base.ts и DEPLOY.md). Менеджер приходит параметром
 * ?manager=КОД, страниц-подадресов нет.
 */
createApp(App).mount("#root");
