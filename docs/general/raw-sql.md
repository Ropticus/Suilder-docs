# Raw SQL
You can write any raw SQL and combine with any other `IQueryFragment`:
```csharp
// Raw string
IRawSql raw1 = sql.Raw("SELECT person.Name FROM person");

// Add other fragments
IAlias person = sql.Alias("person");
IRawSql raw2 = sql.Raw("SELECT {0} {1}", person["Name"], sql.From(person));

// Add parameters
IRawSql raw3 = sql.Raw("WHERE {0} = {1}", person["Id"], 10);

// Add parameter list
IRawSql raw4 = sql.Raw("WHERE {0} IN {1}", person["Id"], sql.SubList.Add(1, 2, 3));
```

If your raw string is a complete query you must use the **RawQuery** method:
```csharp
// Raw query
IRawQuery raw1 = sql.RawQuery("SELECT person.Name FROM person");

// Create offset
IRawQuery raw2 = sql.RawQuery("SELECT person.Name FROM person")
    .Offset(10, 20);
```

!!! note
    The difference between `IRawSql` and `IRawQuery`, is that the last add parentheses when is added to other `IQueryFragment`.