import { LocalFileStorage } from "@remix-run/file-storage/local";

export const fileStorage = new LocalFileStorage("./data");
