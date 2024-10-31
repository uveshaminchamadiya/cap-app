import { CapacitorSQLite } from "@capacitor-community/sqlite";
const DB_NAME = "cap_test";

const setEncryptionKey = async () => {
  try {
    const { result } = await CapacitorSQLite.isSecretStored();
    if (!result) {
      await CapacitorSQLite.setEncryptionSecret({
        passphrase: "mysecretkey",
      });
    }
  } catch (error) {
    console.error("Error setting encryption key:", error);
  }
};

export const deleteEncryptionKey = async () => {
  try {
    const { result } = await CapacitorSQLite.isSecretStored();
    if (result) {
      await CapacitorSQLite.clearEncryptionSecret();
      console.log("Encryption key deleted successfully.");
      return;
    }
    console.log("No encryption key found.");
  } catch (error) {
    console.error("Failed to delete encryption key:", error);
  }
};

class db {
  private async openDatabase() {
    try {
      await setEncryptionKey();
      const result = await CapacitorSQLite.checkConnectionsConsistency({
        dbNames: [DB_NAME],
        openModes: ["RW"],
      });
      if (!result || !result.result) {
        await CapacitorSQLite.createConnection({
          database: DB_NAME,
          mode: "secret",
          encrypted: true,
        });
      }
    } catch (e) {
      console.error("Exception caught: openDatabase => createConnection", e);
    }

    try {
      const result = await CapacitorSQLite.isDBOpen({
        database: DB_NAME,
        readonly: false,
      });
      if (!result || !result.result)
        await CapacitorSQLite.open({
          database: DB_NAME,
          readonly: false,
        });
    } catch (e) {
      console.error("Exception caught: openDatabase => open", e);
    }
  }

  async checkKey() {
    const exists = await CapacitorSQLite.isSecretStored();
    console.log("exists: ", exists);
  }

  async createTable() {
    const query = ` CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL
          ); `;
    try {
      await this.openDatabase();
      const result = await CapacitorSQLite.execute({
        database: DB_NAME,
        statements: query,
      });
      return result;
    } catch (e) {
      console.error("Exception caught: createTable", e);
      return e;
    }
  }

  async insertRecord(id: number, name: string) {
    const query = `INSERT INTO users (id, name) VALUES (${id}, '${name}');`;
    // console.log("query: ", query);
    try {
      await this.openDatabase();
      const result = await CapacitorSQLite.execute({
        database: DB_NAME,
        statements: query,
      });
      return result;
    } catch (e) {
      console.error("Exception caught: insert", e);
      return e;
    }
  }

  async selectRecords() {
    const query = `SELECT * FROM users;`;
    try {
      await this.openDatabase();
      const result = await CapacitorSQLite.query({
        database: DB_NAME,
        statement: query,
        values: [],
      });
      if (result && result.values) {
        console.log("Users Data:", result.values);
      } else {
        console.log("No records found.");
      }
      return result;
    } catch (e) {
      console.error("Exception caught: insert", e);
      return e;
    }
  }
}

export default new db();
