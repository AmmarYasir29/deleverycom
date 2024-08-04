const messageError = (code,apiMessage) => {
  let msg = switch(code) {
    case 'P1000':
      return "Authentication failed against database server at ${error.database_host}, the provided database credentials for ${error.database_user} are not valid. Please make sure to provide valid database credentials for the database server at ${error.database_host}.";
    case 'P1001':
      return "Can't reach database server at ${error.database_host}:${error.database_port}. Please make sure your database server is running at ${error.database_host}:${error.database_port}.";
    case 'P1002':
      return "The database server at ${error.database_host}:${error.database_port} was reached but timed out. Please try again. Please make sure your database server is running at ${error.database_host}:${error.database_port}.";
    case 'P1003':
      return "Database ${error.database_file_name} does not exist at ${error.database_file_path}. Database ${error.database_name}.${error.database_schema_name} does not exist on the database server at ${error.database_host}:${error.database_port}. Database ${error.database_name} does not exist on the database server at ${error.database_host}:${error.database_port}.";
    case 'P1008':
      return "Operations timed out after ${error.time}.";
    case 'P1009':
      return "Database ${error.database_name} already exists on the database server at ${error.database_host}:${error.database_port}.";
    case 'P1010':
      return "User ${error.database_user} was denied access on the database ${error.database_name}.";
    case 'P1011':
      return "Error opening a TLS connection: ${error.message}.";
    case 'P1012':
      return "Note: If you get error code P1012 after you upgrade Prisma ORM to version 4.0.0 or later, see the version 4.0.0 upgrade guide. A schema that was valid before version 4.0.0 might be invalid in version 4.0.0 and later. The upgrade guide explains how to update your schema to make it valid.";
    case 'P1013':
      return "The provided database string is invalid. ${error.details}";
    case 'P1014':
      return "The underlying ${error.kind} for model ${error.model} does not exist.";
    case 'P1015':
      return "Your Prisma schema is using features that are not supported for the version of the database. Database version: ${error.database_version} Errors: ${error.errors}";
    case 'P1016':
      return "Your raw query had an incorrect number of parameters. Expected: ${error.expected}, actual: ${error.actual}.";
    case 'P1017':
      return "Server has closed the connection.";
    case 'P2000':
      return "The provided value for the column is too long for the column's type. Column: ${error.column_name}";
    case 'P2001':
      return "The record searched for in the where condition (${error.model_name}.${error.argument_name} = ${error.argument_value}) does not exist";
    case 'P2002':
      return "Unique constraint failed on the ${error.constraint}";
    case 'P2003':
      return "Foreign key constraint failed on the field: ${error.field_name}";
    case 'P2004':
      return "A constraint failed on the database: ${error.database_error}";
    case 'P2005':
      return "The value ${error.field_value} stored in the database for the field ${error.field_name} is invalid for the field's type";
    case 'P2006':
      return "The provided value ${error.field_value} for ${error.model_name} field ${error.field_name} is not valid";
    case 'P2007':
      return "Data validation error ${error.database_error}";
    case 'P2008':
      return "Failed to parse the query ${error.query_parsing_error} at ${error.query_position}";
    case 'P2009':
      return "Failed to validate the query: ${error.query_validation_error} at ${error.query_position}";
    case 'P2010':
      return "Raw query failed. Code: ${error.code}. Message: ${error.message}";
    case 'P2011':
      return "Null constraint violation on the ${error.constraint}";
    case 'P2012':
      return "Missing a required value at ${error.path}";
    case 'P2013':
      return "Missing the required argument ${error.argument_name} for field ${error.field_name} on ${error.object_name}.";
    case 'P2014':
      return "The change you are trying to make would violate the required relation '${error.relation_name}' between the ${error.model_a_name} and ${error.model_b_name} models.";
    case 'P2015':
      return "A related record could not be found. ${error.details}";
    case 'P2016':
      return "Query interpretation error. ${error.details}";
    case 'P2017':
      return "The records for relation ${error.relation_name} between the ${error.parent_name} and ${error.child_name} models are not connected.";
    case 'P2018':
      return "The required connected records were not found. ${error.details}";
    case 'P2019':
      return "Input error. ${error.details}";
    case 'P2020':
      return "Value out of range for the type. ${error.details}";
    case 'P2021':
      return "The table ${error.table} does not exist in the current database.";
    case 'P2022':
      return "The column ${error.column} does not exist in the current database.";
    case 'P2023':
      return "Inconsistent column data: ${error.message}";
    case 'P2024':
      return "Timed out fetching a new connection from the connection pool. (More info: http://pris.ly/d/connection-pool (Current connection pool timeout: ${error.timeout}, connection limit: ${error.connection_limit})";
    case 'P2025':
      return "An operation failed because it depends on one or more records that were required but not found. ${error.cause}";
    case 'P2026':
      return "The current database provider doesn't support a feature that the query used: ${error.feature}";
    case 'P2027':
      return "Multiple errors occurred on the database during query execution: ${error.errors}";
    case 'P2028':
      return "Transaction API error: ${error.error}";
    case 'P2029':
      return "Query parameter limit exceeded error: ${error.message}";
    case 'P2030':
      return "Cannot find a fulltext index to use for the search, try adding a @@fulltext([Fields...]) to your schema";
    case 'P2031':
      return "Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set. See details: https://pris.ly/d/mongodb-replica-set";
    case 'P2033':
      return "A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers";
    case 'P2034':
      return "Transaction failed due to a write conflict or a deadlock. Please retry your transaction";
    case 'P2035':
      return "Assertion violation on the database: ${error.database_error}";
    case 'P2036':
      return "Error in external connector (id ${error.id})";
    case 'P2037':
      return "Too many database connections opened: ${error.message}";
    case 'P3000':
      return "Failed to create database: ${error.database_error}";
    case 'P3001':
      return "Migration possible with destructive changes and possible data loss: ${error.migration_engine_destructive_details}";
    case 'P3002':
      return "The attempted migration was rolled back: ${error.database_error}";
    case 'P3003':
      return "The format of migrations changed, the saved migrations are no longer valid. To solve this problem, please follow the steps at: https://pris.ly/d/migrate";
    case 'P3004':
      return "The ${error.database_name} database is a system database, it should not be altered with prisma migrate. Please connect to another database.";
    case 'P3005':
      return "The database schema is not empty. Read more about how to baseline an existing production database: https://pris.ly/d/migrate-baseline";
    case 'P3006':
      return "Migration ${error.migration_name} failed to apply cleanly to the shadow database. ${error.error_code} Error: ${error.inner_error}";
    case 'P3007':
      return "Some of the requested preview features are not yet allowed in schema engine. Please remove them from your data model before using migrations. (blocked: ${error.list_of_blocked_features})";
    case 'P3008':
      return "The migration ${error.migration_name} is already recorded as applied in the database.";
    case 'P3009':
      return "migrate found failed migrations in the target database, new migrations will not be applied. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve ${error.details}";
    case 'P3010':
      return "The name of the migration is too long. It must not be longer than 200 characters (bytes).";
    case 'P3011':
      return "Migration ${error.migration_name} cannot be rolled back because it was never applied to the database. Hint: did you pass in the whole migration name? (example: "20201207184859_initial_migration")";
    case 'P3012':
      return "Migration ${error.migration_name} cannot be rolled back because it is not in a failed state.";
    case 'P3013':
      return "Datasource provider arrays are no longer supported in migrate. Please change your datasource to use a single provider. Read more at https://pris.ly/multi-provider-deprecation";
    case 'P3014':
      return "Prisma Migrate could not create the shadow database. Please make sure the database user has permission to create databases. Read more about the shadow database (and workarounds) at https://pris.ly/d/migrate-shadow. Original error: ${error.error_code} ${error.inner_error}";
    case 'P3015':
      return "Could not find the migration file at ${error.migration_file_path}. Please delete the directory or restore the migration file.";
    case 'P3016':
      return "The fallback method for database resets failed, meaning Migrate could not clean up the database entirely. Original error: ${error.error_code} ${error.inner_error}";
    case 'P3017':
      return "The migration ${error.migration_name} could not be found. Please make sure that the migration exists, and that you included the whole name of the directory. (example: "20201207184859_initial_migration")";
    case 'P3018':
      return "A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve Migration name: ${error.migration_name} Database error code: ${error.database_error_code} Database error: ${error.database_error}";
    case 'P3019':
      return "The datasource provider ${error.provider} specified in your schema does not match the one specified in the migration_lock.toml, ${error.expected_provider}. Please remove your current migration directory and start a new migration history with prisma migrate dev. Read more: https://pris.ly/d/migrate-provider-switch";
    case 'P3020':
      return "The automatic creation of shadow databases is disabled on Azure SQL. Please set up a shadow database using the shadowDatabaseUrl datasource attribute. Read the docs page for more details: https://pris.ly/d/migrate-shadow";
    case 'P3021':
      return "Foreign keys cannot be created on this database. Learn more how to handle this: https://pris.ly/d/migrate-no-foreign-keys";
    case 'P3022':
      return "Direct execution of DDL (Data Definition Language) SQL statements is disabled on this database. Please read more here about how to handle this: https://pris.ly/d/migrate-no-direct-ddl";
    case 'P4000':
      return "Introspection operation failed to produce a schema file: ${error.introspection_error}";
    case 'P4001':
      return "The introspected database was empty.";
    case 'P4002':
      return "The schema of the introspected database was inconsistent: ${error.explanation}";
    case 'P6000':
      return "Generic error to catch all other errors.";
    case 'P6001':
      return "The URL is malformed; for instance, it does not use the prisma:// protocol.";
    case 'P6002':
      return "The API Key in the connection string is invalid.";
    case 'P6003':
      return "The included usage of the current plan has been exceeded. This can only occur on the free plan.";
    case 'P6004':
      return "The global timeout of Accelerate has been exceeded. You can find the limit here.";
    case 'P6005':
      return "The user supplied invalid parameters. Currently only relevant for transaction methods. For example, setting a timeout that is too high. You can find the limit here.";
    case 'P6006':
      return "The chosen Prisma version is not compatible with Accelerate. This may occur when a user uses an unstable development version that we occasionally prune.";
    case 'P6008':
      return "The engine failed to start. For example, it couldn't establish a connection to the database.";
    case 'P6009':
      return "The global response size limit of Accelerate has been exceeded. You can find the limit here.";
    case 'P6010':
      return "Your accelerate project is disabled. Please enable it again to use it.";
    case 'P6100':
      return "An unexpected server error occurred. This can happen due to a technical issue within the Prisma Pulse or its infrastructure. For any incidents related to Prisma Pulse, you can refer to our status page here and reach out to our support team through one of our available channels to report your issue.";
    case 'P6101':
      return "The datasource is not reachable by Prisma Pulse. The Console will validate the connection when enabling Pulse to reduce the likelihood of this error. However, the datasource may become unavailable after the configuration step, resulting in this error. The datasource is reachable, but did not meet the requirements for Prisma Pulse. The Console will validate the configuration when enabling Pulse to reduce the likelihood of this error. However, the datasource may change after the configuration step, resulting in this error.";
    case 'P6102':
      return "The API key is invalid.";
    case 'P6103':
      return "Prisma Pulse is not enabled for the configured API key.";
    case 'P6104':
      return "Your Prisma Data Platform account has been blocked, potentially due to exceeding the usage limit included in your current plan. Please review the error message for further information. If you require further assistance, please get in touch with us via one of our support channels.";
    case 'P6105':
      return "The Prisma version of the project is not compatible with Prisma Pulse.";
    default:
      return apiMessage; };
      return msg;
}