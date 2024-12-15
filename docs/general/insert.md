# Insert
```csharp
IAlias person = sql.Alias("person");

// Insert all columns
IQuery query1 = sql.Query
    .Insert(person)
    .Values(1, "Name1", "Surname1");

// Add columns
IQuery query2 = sql.Query
    .Insert(x => x.Into(person)
        .Add(person["Name"], person["Surname"]))
    .Values("Name1", "Surname1");

// Multiple rows
IQuery query3 = sql.Query
    .Insert(x => x.Into(person)
        .Add(person["Name"], person["Surname"]))
    .Values("Name1", "Surname1")
    .Values("Name2", "Surname2")
    .Values("Name3", "Surname3");

// Insert into select
IQuery query4 = sql.Query
    .Insert(x => x.Into(person)
        .Add(person["Name"], person["Surname"]))
    .Select(person["Name"], person["Surname"])
    .From(person)
    .Where(person["Active"].Eq(false));

// Add insert options to the query
IInsert insert = sql.Insert().Into(person)
    .Add(person["Name"], person["Surname"]);

IQuery query5 = sql.
    .Insert(insert)
    .Values("Name1", "Surname1");
```

With lambda expressions:
```csharp
Person person = null;

// Insert all columns
IQuery query1 = sql.Query
    .Insert(() => person)
    .Values(1, "Name1", "Surname1");

// Add columns
IQuery query2 = sql.Query
    .Insert(x => x.Into(() => person)
        .Add(() => person.Name, () => person.Surname))
    .Values("Name1", "Surname1");

// Multiple rows
IQuery query3 = sql.Query
    .Insert(x => x.Into(() => person)
        .Add(() => person.Name, () => person.Surname))
    .Values("Name1", "Surname1")
    .Values("Name2", "Surname2")
    .Values("Name3", "Surname3");

// Insert into select
IQuery query4 = sql.Query
    .Insert(x => x.Into(() => person)
        .Add(() => person.Name, () => person.Surname))
    .Select(() => person.Name, () => person.Surname)
    .From(() => person)
    .Where(() => !person.Active);

// Add insert options to the query
IInsert insert = sql.Insert().Into(() => person)
    .Add(() => person.Name, () => person.Surname);

IValList values = sql.ValList.Add("Name1", "Surname1");

IQuery query5 = sql.Query
    .Insert(insert)
    .Values(values);
```