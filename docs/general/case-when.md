# Case when
```csharp
IAlias person = sql.Alias("person");

ICase caseWhen1 = sql.Case()
    .When(person["Name"].IsNotNull(), person["Name"])
    .Else(person["SurName"]);

//Simple case
ICase caseWhen2 = sql.Case(person["Active"])
    .When(true, "Active")
    .Else("Inactive");
```

With lambda expressions:
```csharp
Person person = null;

ICase caseWhen1 = sql.Case()
    .When(() => person.Name != null, () => person.Name)
    .Else(() => person.SurName);

//Simple case
ICase caseWhen2 = sql.Case(() => person.Active)
    .When(true, "Active")
    .Else("Inactive");
```