# Where and having
```csharp
IAlias person = sql.Alias("person");

//Where
IQuery query1 = sql.Query.Where(person["Active"].Eq(true));

//Having
IQuery query2 = sql.Query.Having(SqlFn.Count().Gt(10));
```

> **Note:** calling the **Where** or **Having** method multiple overrides the clause.

---
[<Previous](from-join-cte.md) &nbsp;|&nbsp;  [Back to index](index.md) &nbsp;|&nbsp;  [Next>](group-by.md)