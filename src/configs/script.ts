import employeeModel from "../models/employeeModel.model.js";

// db.ts or startup.ts
export async function initIDX() {
  await employeeModel.collection.createIndex(
    { phone: 1 },
    { unique: true }
  );
}