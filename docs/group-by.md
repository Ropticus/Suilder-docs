# Group by
```csharp
IAlias person = sql.Alias("person");

//Add group by to the query
IValList list = sql.ValList.Add(person["Name"], person["SurName"]);
IQuery query1 = sql.Query.GroupBy(list);

//Create group by
IQuery query2 = sql.Query
    .GroupBy(person["Name"], person["SurName"])

//Other options
IQuery query2 = sql.Query
    .GroupBy(x => x.Add(person["Name"], person["SurName"]));
```

With lambda expressions:
```csharp
Person person = null;

//Add group by to the query
IValList list = sql.ValList.Add(() => person.Name, () => person.SurName);
IQuery query1 = sql.Query.GroupBy(list);

//Create group by
IQuery query2 = sql.Query
    .GroupBy(() => person.Name, () => person.SurName)

//Other options
IQuery query2 = sql.Query
    .GroupBy(x => x.Add(() => person.Name, () => person.SurName));
```

---
[<Previous](where-having.md) &nbsp;|&nbsp;  [Back to index](index.md) &nbsp;|&nbsp;  [Next>](order-by.md)