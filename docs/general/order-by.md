# Order by
```csharp
IAlias person = sql.Alias("person");

// Order default
IOrderBy orderBy1 = sql.OrderBy().Add(person["Name"], person["Surname"]);

// Custom order
IOrderBy orderBy2 = sql.OrderBy()
    .Add(person["Name"]).Asc
    .Add(person["Surname"]).Desc;

// Set order to multiple columns
IOrderBy orderBy3 = sql.OrderBy().Add(person["Name"], person["Surname"]).Desc;

// Boolean overload
IOrderBy orderBy4 = sql.OrderBy().Add(person["Name"]).SetOrder(false);

```

With lambda expressions:
```csharp
Person person = null;

// Order default
IOrderBy orderBy1 = sql.OrderBy().Add(() => person.Name, () => person.Surname);

// Custom order
IOrderBy orderBy2 = sql.OrderBy()
    .Add(() => person.Name).Asc
    .Add(() => person.Surname).Desc;

// Set order to multiple columns
IOrderBy orderBy3 = sql.OrderBy().Add(() => person.Name, () => person.Surname).Desc;

// Boolean overload
IOrderBy orderBy4 = sql.OrderBy().Add(() => person.Name).SetOrder(false);
```

With query object:
```csharp
IAlias person = sql.Alias("person");

// Add order by to the query
IOrderBy orderBy = sql.OrderBy().Add(person["Name"], person["Surname"]);
IQuery query1 = sql.Query.OrderBy(select);

// Create order by
IQuery query2 = sql.Query
    .OrderBy(x => x.Add(person["Name"], person["Surname"]));
```