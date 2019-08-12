# Delete
```csharp
IAlias person = sql.Alias("person");
IAlias dept = sql.Alias("dept");

// Delete from
IQuery query1 = sql.Query
    .Delete()
    .From(person);

// With join
IQuery query2 = sql.Query
    .Delete()
    .From(person)
    .Join(dept)
        .On(dept["Id"].Eq(person["DepartmentId"]));

// Delete join table
IQuery query3 = sql.Query
    .Delete(x => x.Add(dept))
    .From(person)
    .Join(dept)
        .On(dept["Id"].Eq(person["DepartmentId"]));

// Delete multiple tables
IQuery query4 = sql.Query
    .Delete(x => x.Add(person, dept))
    .From(person)
    .Join(dept)
        .On(dept["Id"].Eq(person["DepartmentId"]));

// Delete top
IQuery query5 = sql.Query
    .Delete(x => x.Top(10))
    .From(person);

// Add delete options to the query
IDelete delete = sql.Delete().Top(10).Add(dept);

IQuery query6 = sql.Query
    .Delete(delete)
    .From(person)
    .Join(dept)
        .On(dept["Id"].Eq(person["DepartmentId"]));
```

With lambda expressions:
```csharp
Person person = null;
Department dept = null;

// Delete from
IQuery query1 = sql.Query
    .Delete()
    .From(() => person);

// With join
IQuery query2 = sql.Query
    .Delete()
    .From(() => person)
    .Join(() => dept)
        .On(() => dept.Id == person.Department.Id);

// Delete join table
IQuery query3 = sql.Query
    .Delete(x => x.Add(() => dept))
    .From(() => person)
    .Join(() => dept)
        .On(() => dept.Id == person.Department.Id);

// Delete multiple tables
IQuery query4 = sql.Query
    .Delete(x => x.Add(() => person, () => dept))
    .From(() => person)
    .Join(() => dept)
        .On(() => dept.Id == person.Department.Id);

// Delete top
IQuery query5 = sql.Query
    .Delete(x => x.Top(10))
    .From(() => person);

// Add delete options to the query
IDelete delete = sql.Delete().Top(10).Add(() => dept);

IQuery query6 = sql.Query
    .Delete(delete)
    .From(() => person)
    .Join(() => dept)
        .On(() => dept.Id == person.Department.Id);
```

!!! warning
    Not all engines support **delete** with **join** or delete multiple tables.