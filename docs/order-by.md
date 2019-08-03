# Order by
```csharp
IAlias person = sql.Alias("person");

//Order default
IOrderBy orderBy = sql.OrderBy().Add(person["Name"], person["SurName"]);

//Custom order
IOrderBy orderBy = sql.OrderBy()
    .Add(person["Name"]).Asc
    .Add(person["SurName"]).Desc;

//Set order to multiple columns
IOrderBy orderBy = sql.OrderBy().Add(person["Name"], person["SurName"]).Desc;

//Boolean overload
IOrderBy orderBy = sql.OrderBy().Add(person["Name"]).SetOrder(false);

```

With lambda expressions:
```csharp
Person person = null;

//Order default
IOrderBy orderBy = sql.OrderBy().Add(() => person.Name, () => person.SurName);

//Custom order
IOrderBy orderBy = sql.OrderBy()
    .Add(() => person.Name).Asc
    .Add(() => person.SurName).Desc;

//Set order to multiple columns
IOrderBy orderBy = sql.OrderBy().Add(() => person.Name, () => person.SurName).Desc;

//Boolean overload
IOrderBy orderBy = sql.OrderBy().Add(() => person.Name).SetOrder(false);
```

With query object:
```csharp
IAlias person = sql.Alias("person");

//Add order by to the query
IOrderBy orderBy = sql.OrderBy().Add(person["Name"], person["SurName"]);
IQuery query1 = sql.Query.OrderBy(select);

//Create order by
IQuery query2 = sql.Query
    .OrderBy(x => x.Add(person["Name"], person["SurName"]));
```

---
[<Previous](group-by.md) &nbsp;|&nbsp;  [Back to index](index.md) &nbsp;|&nbsp;  [Next>](offset.md)