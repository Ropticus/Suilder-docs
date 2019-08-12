# Where and having
Use the **Where** and **Having** methods of the `IQuery` object.
```csharp
IAlias person = sql.Alias("person");

// Where
IQuery query1 = sql.Query.Where(person["Active"].Eq(true));

// Having
IQuery query2 = sql.Query.Having(SqlFn.Count().Gt(10));
```

!!! warning
    Each call to these methods, does not create an **and** condition, it **overrides** the clause.