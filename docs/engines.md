# Engines
An engine contains the configuration of a specific SQL engine, and allows you to compile a query:
```csharp
// Create your engine
IEngine engine = new Engine();
```

It accepts a `TableBuilder` with the configuration of your tables:
```csharp
// Create a table builder and add your entity classes
TableBuilder tableBuilder = new TableBuilder()
    .Add<Person>()
    .Add<Department>();

// Create an engine with the table builder
IEngine engine = new Engine(tableBuilder);
```

You can have any number of engines. The engines can share the same `TableBuilder` or have his own `TableBuilder` with different configuration.

## Supported engines
You can use Suilder with any SQL engine, but there a list of supported engines that are already configured.

Engine | Class name | Remarks |
-------|------------|---------|
MySQL | MySQL | |
Oracle Database | OracleDB | By default it uses quoted uppercase names. |
PostgreSQL | PostgreSQL | By default it uses quoted lowercase names. |
SQLite | SQLite | |
SQL Server | SQLServer | |

If your SQL engine is not in the list, it does not mean that you cannot use Suilder with them, but you have to configure your engine.

## Engine configuration
You can change the configuration of the engine using the **Options** property:
```csharp
IEngine engine = new Engine();
engine.Options.EscapeStart = '[';
engine.Options.EscapeEnd = ']';
engine.Options.Pagination = PaginationStyle.Offset;
```

> **Warning:** if you need different configurations, you must create multiple engines instances, modify the configuration continuously before execute a query is not thread safe.

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

Property | Default value | Description |
---------|---------------|-------------|
EscapeStart | `"` | The start character to delimit identifiers. |
EscapeEnd | `"` | The end character to delimit identifiers. |
UpperCaseNames | `false` | If true, converts all tables and column names to uppercase. |
LowerCaseNames | `false` | If true, converts all tables and column names to lowercase. |
TableAs | `true` | If true, adds the "as" keyword before the alias of a table. |
FromDummyName | `null` | The name of a dummy table for engines that always need a "from" clause. Set to null for engines that do not need a dummy table. |
TopSupported | `true` | If the engine support "top". |
DistinctOnSupported | `true` | If the engine support "distinct on". |
RightJoinSupported | `true` | If the engine support "right join". |
FullJoinSupported | `true` | If the engine support "full join". |
OffsetStyle | `OffsetStyle.Offset`  | The offset style. |
OffsetAsParameters | `true` | If true, add the offset values as parameters. |
InsertWithUnion | `false` | If the "insert" statement must use a "select union all" to insert multiple rows. |
UpdateWithFrom | `false` | If the "update" statement must have a "from" clause. Some engines need it when the table has an alias or a join. |
UpdateSetWithTableName | `false` | If the column must have the table name in the "set" clause. Some engines need it when the table has a join. |
DeleteWithAlias | `true` | If the "delete" statement must have an alias before the "from" clause. Some engines need it when the table has an alias or a join. |
ParameterPrefix | `"@p"` | The prefix of the parameters. |
FunctionsOnlyRegistered | `false` | If only allow registered functions. |

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

> **Note:** The delegate function works like the [Compile method](builder.md#custom-components) of the `IQueryFragment` interface.

You can inherit the `Engine` class instead and override the **InitFunctions** method.
```csharp
protected override void InitFunctions()
{
    // Translate 'LENGTH' to 'LEN'
    engine.AddFunction("LENGTH", "LEN");
}
```

The supported engines has already registered the functions of the [SqlFn](functions.md#sqlfn) and [SqlExp](functions.md#sqlexp) classes.

## Compile query
The engine can compile any object that implements the interface `IQueryFragment`.
```csharp
// Create your query
IAlias person = sql.Alias("person");
IQueryFragment query = sql.Query
    .Select(person.All)
    .From(person)
    .Where(person["Id"].Eq(1));

// Compile the query using the engine
QueryResult result = engine.Compile(query);

// This is the SQL result
result.Sql; // SELECT "person".* FROM "person" WHERE "person"."Id" = @p0

// This is a dictionary with the parameters
result.Parameters; // { ["@p0"] = 1 }
```

---
[<Previous](entity-classes.md) &nbsp;|&nbsp;  [Back to index](index.md) &nbsp;|&nbsp;  [Next>](builder.md)