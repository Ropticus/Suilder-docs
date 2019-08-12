# Query
The query object allows us to create a complete query. The order of the methods does not matter, except for the joins:
```csharp
IAlias person = sql.Alias("person");
IAlias<Department> dept = sql.Alias<Department>();

IQuery query = sql.Query
    .Select(person.All, dept.All)
    .From(person)
    .Left.Join(dept)
        .On(dept[x => x.Id].Eq(person["DepartmentId"]))
    .Where(sql.And
        .Add(person["Active"].Eq(true))
        .Add(dept[x => x.Id].Eq(10)))
    .OrderBy(x => x.Add(person["Name"]).Asc)
    .Offset(10, 50);
```

With lambda expressions:
```csharp
Person person = null;
Department dept = null;

IQuery query = sql.Query
    .Select(() => person, () => dept)
    .From(() => person)
    .Left.Join(() => dept)
        .On(() => dept.Id == person.Department.Id)
    .Where(() => person.Active && dept.Id == 10)
    .OrderBy(x => x.Add(() => person.Name).Asc)
    .Offset(10, 50);
```

You can create individual query fragments and combine them later:
```csharp
Person person = null;
Department dept = null;

// Create the fragments
ISelect select = sql.Select.Add(() => person, () => dept);
IFrom from = sql.From(() => person);
IJoin join = sql.Left.Join(() => dept)
    .On(() => dept.Id == person.Department.Id);
IOperator where = sql.Op(() => person.Active && dept.Id == 10);
IOrderBy orderBy = sql.OrderBy.Add(() => person.Name).Asc;
IOffset offset = sql.Offset(10, 50);

// Create the query
IQuery query = sql.Query
    .Select(select)
    .From(from)
    .Join(join)
    .Where(where)
    .OrderBy(orderBy)
    .Offset(offset);
```