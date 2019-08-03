# Insert
```csharp
IAlias person = sql.Alias("person");

//Insert all columns
IQuery query1 = sql.Query
    .Insert(person)
    .Values(1, "Name1", "SurName1");

//Add columns
IQuery query2 = sql.Query
    .Insert(x => x.Into(person)
    .Add(person["Name"], person["SurName"]))
    .Values("Name1", "SurName1");

//Multiple rows
IQuery query3 = sql.Query
    .Insert(x => x.Into(person)
    .Add(person["Name"], person["SurName"]))
    .Values("Name1", "SurName1")
    .Values("Name2", "SurName2")
    .Values("Name3", "SurName3");

//Insert into select
IQuery query4 = sql.Query
    .Insert(x => x.Into(person)
    .Add(person["Name"], person["SurName"]))
    .Select(person["Name"], person["SurName"])
    .From(person)
    .Where(person["Active"].Eq(false));

//Add insert options to the query
IInsert insert = sql.Insert().Into(person)
    .Add(person["Name"], person["SurName"]))

IQuery query5 = sql.
    .Insert(insert)
    .Values("Name1", "SurName1");
```

With lambda expressions:
```csharp
Person person = null;

//Insert all columns
IQuery query1 = sql.Query
    .Insert(() => person)
    .Values(1, "Name1", "SurName1");

//Add columns
IQuery query2 = sql.Query
    .Insert(x => x.Into(() => person)
    .Add(() => person.Name, () => person.SurName))
    .Values("Name1", "SurName1");

//Multiple rows
IQuery query3 = sql.Query
    .Insert(x => x.Into(() => person)
    .Add(() => person.Name, () => person.SurName))
    .Values("Name1", "SurName1")
    .Values("Name2", "SurName2")
    .Values("Name3", "SurName3");

//Insert into select
IQuery query4 = sql.Query
    .Insert(x => x.Into(() => person)
    .Add(() => person.Name, () => person.SurName))
    .Select(() => person.Name, () => person.SurName)
    .From(() => person)
    .Where(() => !person.Active);

//Add insert options to the query
IInsert insert = sql.Insert().Into(() => person)
    .Add(() => person.Name, () => person.SurName))

IValList values = sql.ValList.Add("Name1", "SurName1");

IQuery query5 = sql.Query
    .Insert(insert)
    .Values(values);
```

> **Note:** some engines do not support **insert** multiple row values.

---
[<Previous](offset.md) &nbsp;|&nbsp;  [Back to index](index.md) &nbsp;|&nbsp;  [Next>](update.md)