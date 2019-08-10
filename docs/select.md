# Select
```csharp
IAlias person = sql.Alias("person");

// Select all
ISelect select1 = sql.Select().Add(person.All);

// Select columns
ISelect select2 = sql.Select().Add(person["Name"], person["SurName"]);

// Add alias
ISelect select3 = sql.Select().Add(person["SurName"]).As("SurName");

// Distinct
ISelect select4 = sql.Select().Distinct().Add(person["Name"]);

// Distinct on
ISelect select5 = sql.Select().DistinctOn(person["Name"]).Add(person.All);

// Top
ISelect select6 = sql.Select().Top(10).Percent().Add(person.All);

// Over
ISelect select7 = sql.Select().Add(SqlFn.Sum(person["Salary"]))
    .Over(o => o.PartitionBy(x => x.Add(person["DepartmentId"])));
```

With lambda expressions:
```csharp
Person person = null;

// Select all
ISelect select1 = sql.Select().Add(() => person);

// Select columns
ISelect select2 = ISelect select = sql.Select().Add(() => person.Name, () => person.SurName);

// Add alias
ISelect select3 = sql.Select().Add(() => person.SurName).As("SurName");

// Distinct
ISelect select4 = sql.Select().Distinct().Add(() => person.Name);

// Distinct on
ISelect select5 = sql.Select().DistinctOn(() => person.Name).Add(() => person);

// Top
ISelect select6 = sql.Select().Top(10).Percent().Add(() => person);

// Over
ISelect select = sql.Select().Add(() => SqlExp.Sum(person.Salary))
    .Over(o => o.PartitionBy(x => x.Add(() => person.Department.Id)));
```

With query object:
```csharp
IAlias person = sql.Alias("person");

// Add select to the query
ISelect select = sql.Select().Add(person.All);
IQuery query1 = sql.Query.Select(select);

// Create select (columns only)
IQuery query2 = sql.Query
    .Select(person["Name"], person["SurName"]);

// Other options
IQuery query3 = sql.Query
    .Select(x => x.Distinct().Add(person["Name"]));
```

---
[<Previous](functions.md) &nbsp;|&nbsp;  [Back to index](index.md) &nbsp;|&nbsp;  [Next>](from-join-cte.md)