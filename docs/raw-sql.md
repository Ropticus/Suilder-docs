# Raw SQL
```csharp
// Raw text
IRawSql raw1 = sql.Raw("SELECT person.Name FROM person");

// Add other fragments
IAlias person = sql.Alias("person");
IRawSql raw2 = sql.Raw("SELECT {0} {1}", person["Name"], sql.From(person));

// Add parameters
IRawSql raw3 = sql.Raw("WHERE {0} = {1}", person["Id"], 10);
```

If your raw text is a complete query you have to use the **RawQuery** method:
```csharp
// Raw query
IRawQuery raw1 = sql.RawQuery("SELECT person.Name FROM person");

// Create offset
IRawQuery raw2 = sql.RawQuery("SELECT person.Name FROM person")
    .Offset(10, 20);
```

> **Note**: the difference between `IRawSql` and `IRawQuery` is that the last add parentheses when is added to other `IQueryFragment`.

---
[<Previous](delete.md) &nbsp;|&nbsp;  [Back to index](index.md) &nbsp;|&nbsp;  [Next>](crud.md)