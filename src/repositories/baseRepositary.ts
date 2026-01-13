export abstract class BaseRepositary {
  protected sanitizeSchema(schema: string): string {
    if (!/^[a-zA-Z0-9_]+$/.test(schema)) {
      throw new Error("Invalid schema name");
    }
    return schema;
  }
}
