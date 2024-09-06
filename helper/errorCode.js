const messageError = (code, apiMessage = "Unknown DB Error") => {
  let msg;

  switch (code) {
    case "P1000":
      msg =
        "Authentication failed against database server at ${error.database_host}, the provided database credentials for ${error.database_user} are not valid. Please make sure to provide valid database credentials for the database server at ${error.database_host}.";
      break;
    case "P1001":
      msg =
        "Can't reach database server at ${error.database_host}:${error.database_port}. Please make sure your database server is running at ${error.database_host}:${error.database_port}.";
      break;
    case "P1002":
      msg =
        "The database server at ${error.database_host}:${error.database_port} was reached but timed out. Please try again. Please make sure your database server is running at ${error.database_host}:${error.database_port}.";
      break;
    case "P1003":
      msg =
        "Database ${error.database_file_name} does not exist at ${error.database_file_path}. Database ${error.database_name}.${error.database_schema_name} does not exist on the database server at ${error.database_host}:${error.database_port}. Database ${error.database_name} does not exist on the database server at ${error.database_host}:${error.database_port}.";
      break;
    case "P1008":
      msg = "Operations timed out after ${error.time}.";
      break;
    case "P1009":
      msg =
        "Database ${error.database_name} already exists on the database server at ${error.database_host}:${error.database_port}.";
      break;
    case "P1010":
      msg =
        "User ${error.database_user} was denied access on the database ${error.database_name}.";
      break;
    case "P1011":
      msg = "Error opening a TLS connection: ${error.message}.";
      break;
    case "P1012":
      msg =
        "Note: If you get error code P1012 after you upgrade Prisma ORM to version 4.0.0 or later, see the version 4.0.0 upgrade guide. A schema that was valid before version 4.0.0 might be invalid in version 4.0.0 and later. The upgrade guide explains how to update your schema to make it valid.";
      break;
    case "P1013":
      msg = "The provided database string is invalid. ${error.details}";
      break;
    case "P1014":
      msg =
        "The underlying ${error.kind} for model ${error.model} does not exist.";
      break;
    case "P1015":
      msg =
        "Your Prisma schema is using features that are not supported for the version of the database. Database version: ${error.database_version} Errors: ${error.errors}";
      break;
    case "P1016":
      msg =
        "Your raw query had an incorrect number of parameters. Expected: ${error.expected}, actual: ${error.actual}.";
      break;
    case "P1017":
      msg = "Server has closed the connection.";
      break;
    case "P2000":
      msg =
        "The provided value for the column is too long for the column's type. Column: ${error.column_name}";
      break;
    case "P2001":
      msg =
        "The record searched for in the where condition (${error.model_name}.${error.argument_name} = ${error.argument_value}) does not exist";
      break;
    case "P2002":
      msg = "Unique constraint failed on the ${error.constraint}";
      break;
    case "P2003":
      msg = "Foreign key constraint failed on the field: ${error.field_name}";
      break;
    case "P2004":
      msg = "A constraint failed on the database: ${error.database_error}";
      break;
    case "P2005":
      msg =
        "The value ${error.field_value} stored in the database for the field ${error.field_name} is invalid for the field's type";
      break;
    case "P2006":
      msg =
        "The provided value ${error.field_value} for ${error.model_name} field ${error.field_name} is not valid";
      break;
    case "P2007":
      msg = "Data validation error ${error.database_error}";
      break;
    case "P2008":
      msg =
        "Failed to parse the query ${error.query_parsing_error} at ${error.query_position}";
      break;
    case "P2009":
      msg =
        "Failed to validate the query: ${error.query_validation_error} at ${error.query_position}";
      break;
    case "P2010":
      msg = "Raw query failed. Code: ${error.code}. Message: ${error.message}";
      break;
    case "P2011":
      msg = "Null constraint violation on the ${error.constraint}";
      break;
    case "P2012":
      msg = "Missing a required value at ${error.path}";
      break;
    case "P2013":
      msg =
        "Missing the required argument ${error.argument_name} for field ${error.field_name} on ${error.object_name}.";
      break;
    case "P2014":
      msg =
        "The change you are trying to make would violate the required relation '${error.relation_name}' between the ${error.model_a_name} and ${error.model_b_name} models.";
      break;
    case "P2015":
      msg = "A related record could not be found. ${error.details}";
      break;
    case "P2016":
      msg = "Query interpretation error. ${error.details}";
      break;
    case "P2017":
      msg =
        "The records for relation ${error.relation_name} between the ${error.parent_name} and ${error.child_name} models are not connected.";
      break;
    case "P2018":
      msg = "The required connected records were not found. ${error.details}";
      break;
    case "P2019":
      msg = "Input error. ${error.details}";
      break;
    case "P2020":
      msg = "Value out of range for the type. ${error.details}";
      break;
    case "P2021":
      msg = "The table ${error.table} does not exist in the current database.";
      break;
    case "P2022":
      msg =
        "The column ${error.column} does not exist in the current database.";
      break;
    case "P2023":
      msg = "Inconsistent column data: ${error.message}";
      break;
    case "P2024":
      msg =
        "Timed out fetching a new connection from the connection pool. (More info: http://pris.ly/d/connection-pool (Current connection pool timeout: ${error.timeout}, connection limit: ${error.connection_limit})";
      break;
    case "P2025":
      msg =
        "An operation failed because it depends on one or more records that were required but not found. ${error.cause}";
      break;
    case "P2026":
      msg =
        "The current database provider doesn't support a feature that the query used: ${error.feature}";
      break;
    case "P2027":
      msg =
        "Multiple errors occurred on the database during query execution: ${error.errors}";
      break;
    case "P2028":
      msg = "Transaction API error: ${error.error}";
      break;
    case "P2029":
      msg = "Query parameter limit exceeded error: ${error.message}";
      break;
    case "P2030":
      msg =
        "Cannot find a fulltext index to use for the search, try adding a @@fulltext([Fields...]) to your schema";
      break;
    case "P2031":
      msg =
        "Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set. See details: https://pris.ly/d/mongodb-replica-set";
      break;
    case "P2033":
      msg =
        "A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers";
      break;
    case "P2034":
      msg =
        "Transaction failed due to a write conflict or a deadlock. Please retry your transaction";
      break;
    case "P2035":
      msg = "Assertion violation on the database: ${error.database_error}";
      break;
    case "P2036":
      msg = "Error in external connector (id ${error.id})";
      break;
    case "P2037":
      msg = "Too many database connections opened: ${error.message}";
      break;
    case "P3000":
      msg = "Failed to create database: ${error.database_error}";
      break;
    case "P3001":
      msg =
        "Migration possible with destructive changes and possible data loss: ${error.migration_engine_destructive_details}";
      break;
    case "P3002":
      msg = "The attempted migration was rolled back: ${error.database_error}";
      break;
    case "P3003":
      msg =
        "The format of migrations changed, the saved migrations are no longer valid. To solve this problem, please follow the steps at: https://pris.ly/d/migrate";
      break;
    case "P3004":
      msg =
        "The ${error.database_name} database is a system database, it should not be altered with prisma migrate. Please connect to another database.";
      break;
    case "P3005":
      msg =
        "The database schema is not empty. Read more about how to baseline an existing production database: https://pris.ly/d/migrate-baseline";
      break;
    case "P3006":
      msg =
        "Migration ${error.migration_name} failed to apply cleanly to the shadow database. ${error.error_code} Error: ${error.inner_error}";
      break;
    case "P3007":
      msg =
        "Some of the requested preview features are not yet allowed in schema engine. Please remove them from your data model before using migrations. (blocked: ${error.list_of_blocked_features})";
      break;
    case "P3008":
      msg =
        "The migration ${error.migration_name} is already recorded as applied in the database.";
      break;
    case "P3009":
      msg =
        "Migrate found failed migrations in the target database, new migrations cannot be applied before the error is recovered from.";
      break;
    case "P3010":
      msg =
        "The name of the migration is too long. It must not be longer than 200 characters. Migration name: ${error.migration_name}";
      break;
    case "P3011":
      msg =
        "Migration cannot be rolled back because it was never applied to the database.";
      break;
    case "P3012":
      msg =
        "Migration cannot be rolled back because it is not in a failed state.";
      break;
    case "P3013":
      msg =
        "Datasource provider arrays are no longer supported in migrate. Please use multiple datasources.";
      break;
    case "P3014":
      msg =
        "Prisma Migrate could not create the shadow database. ${error.details}";
      break;
    case "P3015":
      msg = "Could not find the migration file at ${error.file_path}.";
      break;
    case "P3016":
      msg =
        "The fallback method for database resets failed, meaning Migrate could not clean up the shadow database. Original error: ${error.error_message}";
      break;
    case "P3017":
      msg = "The migration ${error.migration_name} could not be found.";
      break;
    case "P3018":
      msg =
        "A migration failed to apply. New migrations cannot be applied before the error is recovered from.";
      break;
    case "P3019":
      msg =
        "The datasource provider specified in your schema does not match the one specified in the migration_lock.toml. The provider must match to continue.";
      break;
    case "P3020":
      msg =
        "The automatic creation of shadow databases is disabled on Azure SQL. More info: https://pris.ly/d/migrate-shadow";
      break;
    case "P3021":
      msg = "Foreign keys cannot be created on this database. ${error.details}";
      break;
    case "P3022":
      msg =
        "Direct execution of DDL SQL statements is disabled on this database. ${error.details}";
      break;
    case "P4000":
      msg =
        "Introspection operation failed to produce a schema file. ${error.details}";
      break;
    case "P4001":
      msg = "The introspected database was empty: ${error.database_name}";
      break;
    case "P4002":
      msg =
        "The schema of the introspected database was inconsistent: ${error.details}";
      break;
    case "P6000":
      msg = "Generic error. Reason: ${error.message}";
      break;
    case "P6001":
      msg =
        "The URL is malformed, for example it does not use the prisma:// protocol. ${error.details}";
      break;
    case "P6002":
      msg = "The API key in the connection string is invalid. ${error.details}";
      break;
    case "P6003":
      msg =
        "The included usage of the current plan has been exceeded. ${error.details}";
      break;
    case "P6004":
      msg =
        "The global timeout of Accelerate has been exceeded. ${error.details}";
      break;
    case "P6005":
      msg =
        "The user supplied invalid parameters. Currently only relevant for transaction methods. ${error.details}";
      break;
    case "P6006":
      msg =
        "The chosen Prisma version is not compatible with Accelerate. ${error.details}";
      break;
    case "P6008":
      msg = "The engine failed to start. ${error.message}";
      break;
    case "P6009":
      msg =
        "The global response size limit of Accelerate has been exceeded. ${error.details}";
      break;
    case "P6010":
      msg = "Your accelerate project is disabled. ${error.details}";
      break;
    case "P6100":
      msg = "An unexpected server error occurred. ${error.details}";
      break;
    case "P6101":
      msg = "The datasource is not reachable by Prisma Pulse. ${error.details}";
      break;
    case "P6102":
      msg = "The API key is invalid. ${error.details}";
      break;
    case "P6103":
      msg =
        "Prisma Pulse is not enabled for the configured API key. ${error.details}";
      break;
    case "P6104":
      msg =
        "Your Prisma Data Platform account has been blocked. ${error.details}";
      break;
    case "P6105":
      msg =
        "The Prisma version of the project is not compatible with Prisma Pulse. ${error.details}";
      break;
    default:
      msg = apiMessage;
      break;
  }
  return msg;
};

module.exports = messageError;
