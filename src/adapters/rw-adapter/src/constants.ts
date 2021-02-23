import { Dataset } from "@widget-editor/types";

export const ALLOWED_FIELD_TYPES = [
  // --- NUMBER ----
  { name: "esriFieldTypeSmallInteger", type: Dataset.FieldType.Number },
  { name: "esriFieldTypeInteger", type: Dataset.FieldType.Number },
  { name: "esriFieldTypeSingle", type: Dataset.FieldType.Number },
  { name: "esriFieldTypeDouble", type: Dataset.FieldType.Number },
  { name: "numeric", type: Dataset.FieldType.Number },
  { name: "number", type: Dataset.FieldType.Number },
  { name: "int", type: Dataset.FieldType.Number },
  { name: "integer", type: Dataset.FieldType.Number },
  { name: "float", type: Dataset.FieldType.Number },
  { name: "long", type: Dataset.FieldType.Number },
  { name: "double", type: Dataset.FieldType.Number },
  { name: "real", type: Dataset.FieldType.Number },
  { name: "decimal", type: Dataset.FieldType.Number },
  // ----- TEXT -----
  { name: "string", type: Dataset.FieldType.String },
  { name: "char", type: Dataset.FieldType.String },
  { name: "varchar", type: Dataset.FieldType.String },
  { name: "esriFieldTypeString", type: Dataset.FieldType.String },
  { name: "text", type: Dataset.FieldType.String },
  // ----- DATE ----
  { name: "esriFieldTypeDate", type: Dataset.FieldType.Date },
  { name: "date", type: Dataset.FieldType.Date },
  { name: "time", type: Dataset.FieldType.Date },
  { name: "timestamp", type: Dataset.FieldType.Date },
  { name: "interval", type: Dataset.FieldType.Date },
  // ------ BOOLEAN -----
  { name: "boolean", type: Dataset.FieldType.Boolean },
  // ------ ARRAY -------
  { name: "array", type: Dataset.FieldType.Array },
];