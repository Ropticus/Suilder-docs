# Update
The **update** is a bit different than SQL because it uses the **From** method:
```csharp
IAlias person = sql.Alias("person");
IAlias dept = sql.Alias("dept");

// Update
IQuery query1 = sql.Query
    .Update()
    .Set(person["Name"], "SomeName")
    .From(person);

// With join
IQuery query2 = sql.Query
    .Update()
    .Set(person["Name"], "SomeName")
    .From(person)
    .Join(dept)
        .On(dept["Id"].Eq(person["DepartmentId"]));

// Update join table
IQuery query3 = sql.Query
    .Update()
    .Set(dept["Name"], "SomeName2")
    .From(person)
    .Join(dept)
        .On(dept["Id"].Eq(person["DepartmentId"]));

// Update multiple tables
IQuery query4 = sql.Query
    .Update()
    .Set(person["Name"], "SomeName")
    .Set(dept["Name"], "SomeName2")
    .From(person)
    .Join(dept)
        .On(dept["Id"].Eq(person["DepartmentId"]));

// Update top
IQuery query5 = sql.Query
    .Update(x => x.Top(10))
    .Set(person["Name"], "SomeName")
    .From(person);

// Add update options to the query
IUpdate update = sql.Update().Top(10);

IQuery query6 = sql.Query
    .Update(update)
    .Set(person["Name"], "SomeName")
    .From(person);
```

With lambda expressions:
```csharp
Person person = null;
Department dept = null;

// Update
IQuery query1 = sql.Query
    .Update()
    .Set(() => person.Name, "SomeName")
    .From(() => person);

// With join
IQuery query2 = sql.Query
    .Update()
    .Set(() => person.Name, "SomeName")
    .From(() => person)
    .Join(() => dept)
        .On(() => dept.Id == person.Department.Id);

// Update join table
IQuery query3 = sql.Query
    .Update()
    .Set(() => dept.Name, "SomeName2")
    .From(() => person)
    .Join(() => dept)
        .On(() => dept.Id == person.Department.Id);

// Update multiple tables
IQuery query4 = sql.Query
    .Update()
    .Set(() => person.Name, "SomeName")
    .Set(() => dept.Name, "SomeName2")
    .From(() => person)
    .Join(() => dept)
        .On(() => dept.Id == person.Department.Id);

// Update top
IQuery query5 = sql.Query
    .Update(x => x.Top(10))
    .Set(() => person.Name, "SomeName")
    .From(() => person);

// Add update options to the query
IUpdate update = sql.Update().Top(10);

IQuery query6 = sql.Query
    .Update(update)
    .Set(() => person.Name, "SomeName")
    .From(() => person);
```

!!! warning
    Not all engines support **update** with **join** or update multiple tables.