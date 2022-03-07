import { isString } from 'lodash';
import { createConnection } from 'typeorm';
// tslint:disable-next-line:no-var-requires
const config = require('../config');

// The first thing that happens is to create the migration table.
// Since we configure a schema TypeORM creates the migration table under the configured schema.
// This doesn't make it possible to have the schema creation as a migration step.
// Therefore we need a pre script that generates for us the migration if it's not already existing.

const createSchema = async () => {
  try {
    const connection = await createConnection({
      type: config.database.type,
      url: config.database.url,
      ssl: config.database.ssl !== undefined ? config.database.ssl : true,
    });

    if (!isString(config.database.schema) || config.database.schema === '') {
      // tslint:disable-next-line:no-console
      console.error('`database.schema` has to be defined in your config!');
      process.exit(2);
    }

    const queryRunner = connection.createQueryRunner();
    await queryRunner.createSchema(config.database.schema, true);
    connection.close();
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log('Database schema could not be created!');
    // tslint:disable-next-line:no-console
    console.log(error);
    // tslint:disable-next-line:no-console
    console.log(`Message: ${error.message}`);
    // tslint:disable-next-line:no-console
    process.exit(1);
  }
};

createSchema();