# Engines
An engine contains the configuration of a specific SQL engine, and allows you to compile a query:
```csharp
// Create your engine
IEngine engine = new Engine();
```

It accepts an `ITableBuilder` with the configuration of your tables:
```csharp
// Create a table builder and add your entity classes
ITableBuilder tableBuilder = new TableBuilder();
tableBuilder.Add<Person>();
tableBuilder.Add<Department>();

// Create an engine with the table builder
IEngine engine = new Engine(tableBuilder);
```

You can have any number of engines. The engines can share the same `ITableBuilder` or have his own `ITableBuilder` with different configuration.

## Supported engines
You can use Suilder with any SQL engine, but there a list of supported engines that are already configured.

| Engine | Class name | Remarks |
|--------|------------|---------|
| MySQL | MySQLEngine | |
| Oracle Database | OracleDBEngine | By default it uses quoted uppercase names. |
| PostgreSQL | PostgreSQLEngine | By default it uses quoted lowercase names. |
| SQLite | SQLiteEngine | |
| SQL Server | SQLServerEngine | |

If your SQL engine is not in the list, it does not mean that you cannot use Suilder with them, but you have to configure your engine.

## Engine configuration
You can change the configuration of the engine using the **Options** property:
```csharp
IEngine engine = new Engine();
engine.Options.EscapeStart = '[';
engine.Options.EscapeEnd = ']';
engine.Options.Pagination = PaginationStyle.Offset;
```

!!! warning
    If you need different configurations, you must create multiple engines instances, modify the configuration continuously before execute a query is not thread safe.

You can inherit the `Engine` class instead and override the **InitOptions** method:
```csharp
protected override EngineOptions InitOptions()
{
    EngineOptions options = new EngineOptions();
    options.EscapeStart = '[';
    options.EscapeEnd = ']';
    options.Pagination = PaginationStyle.Offset;

    return options;
}
```

You can alter the following configurations:

| Property | Default value | Description |
|----------|---------------|-------------|
| Name | `null` | The engine name. |
| EscapeStart | `"` | The start character to delimit identifiers. |
| EscapeEnd | `"` | The end character to delimit identifiers. |
| UpperCaseNames | `false` | If true, converts all tables and column names to uppercase. |
| LowerCaseNames | `false` | If true, converts all tables and column names to lowercase. |
| TableAs | `true` | If true, adds the "as" keyword before the alias of a table. |
| FromDummyName | `null` | The name of a dummy table for engines that always need a "from" clause. Set to null for engines that do not need a dummy table. |
| WithRecursive | `false` | If the "with" clause needs the "recursive" keyword. |
| TopSupported | `true` | If the engine supports "top". |
| TopAsParameters  | `true` | If true, adds the top values as parameters. |
| DistinctOnSupported | `true` | If the engine supports "distinct on". |
| RightJoinSupported | `true` | If the engine supports "right join". |
| FullJoinSupported | `true` | If the engine supports "full join". |
| OffsetStyle | `OffsetStyle.Offset`  | The offset style. |
| OffsetAsParameters | `true` | If true, adds the offset values as parameters. |
| InsertWithUnion | `false` | If the "insert" statement must use a "select union all" to insert multiple rows. |
| UpdateWithFrom | `false` | If the "update" statement must have a "from" clause. Some engines need it when the table has an alias or a join. |
| UpdateSetWithTableName | `false` | If the column must have the table name in the "set" clause. Some engines need it when the table has a join. |
| DeleteWithAlias | `true` | If the "delete" statement must have an alias before the "from" clause. Some engines need it when the table has an alias or a join. |
| SetOperatorWrapQuery | `true` | If true, adds parentheses to the set operator queries. |
| SetOperatorWithSubQuery | `false` | If the set operator must use a subquery when the value is another set operator. |
| ParameterPrefix | `"@p"` | The prefix of the parameters. |
| ParameterIndex  | `true` | If true, adds the index after the parameter name. |
| FunctionsOnlyRegistered | `false` | If only allow registered functions. |

## Register operators
You can register operators with the **AddOperator** method to translate them with a different name:
```csharp
// Translate 'EXCEPT' to 'MINUS'
engine.AddOperator("EXCEPT", "MINUS");
```

You can also translate the operator into a function:
```csharp
// Translate '&' to 'BITAND()'
engine.AddOperator("&", "BITAND", true);
```

## Register functions
You can register functions with the **AddFunction** method to translate them with a different name:
```csharp
// Translate 'LENGTH' to 'LEN'
engine.AddFunction("LENGTH", "LEN");
```

You can also add a delegate to compile the function to SQL:
```csharp
engine.AddFunction("CAST", (queryBuilder, engine, name, fn) =>
{
    queryBuilder.Write(name + "(");
    queryBuilder.WriteValue(fn.Args[0]);
    queryBuilder.Write(" AS ");
    queryBuilder.WriteValue(fn.Args[1]);
    queryBuilder.Write(")");
});
```

!!! note
    The delegate function works like the [Compile method](../general/builder.md#custom-components) of the `IQueryFragment` interface.

You can inherit the `Engine` class instead and override the **InitFunctions** method.
```csharp
protected override void InitFunctions()
{
    // Translate 'LENGTH' to 'LEN'
    engine.AddFunction("LENGTH", "LEN");
}
```

The supported engines has already registered the functions of the [SqlFn](../general/functions.md#sqlfn) and [SqlExp](../general/functions.md#sqlexp) classes.

## Compile the query
The engine can compile any object that implements the `IQueryFragment` interface.
```csharp
// Create your query
IAlias person = sql.Alias("person");
IQueryFragment query = sql.Query
    .Select(person.All)
    .From(person)
    .Where(person["Id"].Eq(1));

// Compile the query using the engine
QueryResult result = engine.Compile(query);

// This is the SQL result:
// SELECT "person".* FROM "person" WHERE "person"."Id" = @p0
result.Sql;

// This is a dictionary with the parameters:
// { ["@p0"] = 1 }
result.Parameters;
```

### Parameters
The default parameter name is `@p` or `:p` (Oracle), but you can set any name:
```csharp
// Change parameter prefix
engine.Options.ParameterPrefix = "$p";
```

You can also remove the index from the parameter name to use positional parameters:
```csharp
// Enable positional parameters
engine.Options.ParameterPrefix = "?";
engine.Options.ParameterIndex = false;
```

The parameters will be added to a list instead of a dictionary:
```csharp
// This is the SQL result:
// SELECT "person".* FROM "person" WHERE "person"."Id" = ?
result.Sql;

// This is a list with the parameters:
// { 1 }
result.ParametersList;
```