# Group by
Use the **GroupBy** method of the `IQuery` object.
```csharp
IAlias person = sql.Alias("person");

// Add group by to the query
IValList list = sql.ValList.Add(person["Name"], person["Surname"]);
IQuery query1 = sql.Query.GroupBy(list);

// Create group by
IQuery query2 = sql.Query
    .GroupBy(person["Name"], person["Surname"])

// Other options
IQuery query3 = sql.Query
    .GroupBy(x => x.Add(person["Name"], person["Surname"]));
```

With lambda expressions:
```csharp
Person person = null;

// Add group by to the query
IValList list = sql.ValList.Add(() => person.Name, () => person.Surname);
IQuery query1 = sql.Query.GroupBy(list);

// Create group by
IQuery query2 = sql.Query
    .GroupBy(() => person.Name, () => person.Surname)

// Other options
IQuery query3 = sql.Query
    .GroupBy(x => x.Add(() => person.Name, () => person.Surname));
```